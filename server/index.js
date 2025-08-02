const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// In-memory storage (use Redis in production)
const activeStreams = new Map();
const streamViewers = new Map();
const userSockets = new Map();

// LiveKit token generation (mock - implement with actual LiveKit server)
const generateLiveKitToken = (roomName, identity, isPublisher = false) => {
  // In production, use LiveKit's AccessToken class
  return `mock-token-${roomName}-${identity}-${isPublisher ? 'publisher' : 'subscriber'}`;
};

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Authentication
  socket.on('authenticate', (data) => {
    const { userId, token } = data;
    // Verify token in production
    socket.userId = userId;
    userSockets.set(userId, socket);
    console.log(`User ${userId} authenticated`);
  });

  // Start stream
  socket.on('start-stream', (data) => {
    const { streamId, title, challenge } = data;
    const userId = socket.userId || socket.id;
    
    const stream = {
      id: streamId,
      title,
      challenge,
      streamerId: userId,
      status: 'live',
      viewerCount: 0,
      totalTips: 0,
      totalVotes: 0,
      startedAt: new Date().toISOString(),
      roomToken: generateLiveKitToken(streamId, userId, true)
    };

    activeStreams.set(streamId, stream);
    streamViewers.set(streamId, new Set());
    
    socket.join(`stream-${streamId}`);
    socket.streamId = streamId;

    // Broadcast stream started
    io.emit('stream-event', {
      type: 'stream-started',
      data: stream,
      timestamp: Date.now()
    });

    socket.emit('stream-started', { stream, roomToken: stream.roomToken });
    console.log(`Stream ${streamId} started by ${userId}`);
  });

  // End stream
  socket.on('end-stream', (data) => {
    const { streamId } = data;
    const stream = activeStreams.get(streamId);
    
    if (stream) {
      stream.status = 'ended';
      stream.endedAt = new Date().toISOString();
      
      // Notify all viewers
      io.to(`stream-${streamId}`).emit('stream-event', {
        type: 'stream-ended',
        data: stream,
        timestamp: Date.now()
      });

      // Clean up
      activeStreams.delete(streamId);
      streamViewers.delete(streamId);
    }
  });

  // Join stream
  socket.on('join-stream', (data) => {
    const { streamId } = data;
    const userId = socket.userId || socket.id;
    const stream = activeStreams.get(streamId);
    
    if (stream) {
      socket.join(`stream-${streamId}`);
      
      const viewers = streamViewers.get(streamId);
      viewers.add(userId);
      
      stream.viewerCount = viewers.size;
      activeStreams.set(streamId, stream);

      // Generate viewer token
      const roomToken = generateLiveKitToken(streamId, userId, false);

      // Notify viewer
      socket.emit('stream-joined', { stream, roomToken });

      // Notify streamer and other viewers
      io.to(`stream-${streamId}`).emit('stream-event', {
        type: 'viewer-joined',
        data: { userId, viewerCount: stream.viewerCount },
        timestamp: Date.now()
      });

      console.log(`User ${userId} joined stream ${streamId}`);
    }
  });

  // Leave stream
  socket.on('leave-stream', (data) => {
    const { streamId } = data;
    const userId = socket.userId || socket.id;
    
    const viewers = streamViewers.get(streamId);
    if (viewers) {
      viewers.delete(userId);
      
      const stream = activeStreams.get(streamId);
      if (stream) {
        stream.viewerCount = viewers.size;
        activeStreams.set(streamId, stream);

        // Notify others
        io.to(`stream-${streamId}`).emit('stream-event', {
          type: 'viewer-left',
          data: { userId, viewerCount: stream.viewerCount },
          timestamp: Date.now()
        });
      }
    }
    
    socket.leave(`stream-${streamId}`);
  });

  // Send tip
  socket.on('send-tip', (data) => {
    const { streamId, fromUserId, fromUsername, amount, message } = data;
    const stream = activeStreams.get(streamId);
    
    if (stream) {
      stream.totalTips += amount;
      activeStreams.set(streamId, stream);

      const tipEvent = {
        type: 'tip-sent',
        data: {
          streamId,
          fromUserId,
          fromUsername,
          amount,
          message,
          timestamp: Date.now()
        },
        timestamp: Date.now()
      };

      // Broadcast to all viewers and streamer
      io.to(`stream-${streamId}`).emit('stream-event', tipEvent);
      console.log(`Tip sent: ${amount} tokens from ${fromUsername} to stream ${streamId}`);
    }
  });

  // Submit vote
  socket.on('submit-vote', (data) => {
    const { streamId, userId, username, voteType } = data;
    const stream = activeStreams.get(streamId);
    
    if (stream) {
      stream.totalVotes += 1;
      activeStreams.set(streamId, stream);

      const voteEvent = {
        type: 'vote-submitted',
        data: {
          streamId,
          userId,
          username,
          voteType,
          timestamp: Date.now()
        },
        timestamp: Date.now()
      };

      // Broadcast to all viewers and streamer
      io.to(`stream-${streamId}`).emit('stream-event', voteEvent);
      console.log(`Vote submitted: ${voteType} from ${username} to stream ${streamId}`);
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    const userId = socket.userId || socket.id;
    
    // Remove from all streams
    streamViewers.forEach((viewers, streamId) => {
      if (viewers.has(userId)) {
        viewers.delete(userId);
        
        const stream = activeStreams.get(streamId);
        if (stream) {
          stream.viewerCount = viewers.size;
          activeStreams.set(streamId, stream);

          io.to(`stream-${streamId}`).emit('stream-event', {
            type: 'viewer-left',
            data: { userId, viewerCount: stream.viewerCount },
            timestamp: Date.now()
          });
        }
      }
    });

    // Clean up user socket mapping
    if (socket.userId) {
      userSockets.delete(socket.userId);
    }

    console.log('User disconnected:', socket.id);
  });
});

// REST API endpoints
app.get('/api/streams', (req, res) => {
  const streams = Array.from(activeStreams.values());
  res.json(streams);
});

app.get('/api/streams/:id', (req, res) => {
  const stream = activeStreams.get(req.params.id);
  if (stream) {
    res.json(stream);
  } else {
    res.status(404).json({ error: 'Stream not found' });
  }
});

// Token purchase endpoint (mock)
app.post('/api/purchase-tokens', (req, res) => {
  const { userId, amount, paymentMethod } = req.body;
  
  // Mock payment processing
  setTimeout(() => {
    res.json({
      success: true,
      transactionId: uuidv4(),
      tokens: amount * 100, // 1 dollar = 100 tokens
      message: 'Tokens purchased successfully'
    });
  }, 1000);
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`DareStream server running on port ${PORT}`);
});