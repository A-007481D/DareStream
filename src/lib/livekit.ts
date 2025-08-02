import { Room, RoomEvent, RemoteParticipant, RemoteTrack, RemoteTrackPublication, Track } from 'livekit-client';

export class LiveKitService {
  private room: Room | null = null;
  private onParticipantConnected?: (participant: RemoteParticipant) => void;
  private onParticipantDisconnected?: (participant: RemoteParticipant) => void;
  private onTrackSubscribed?: (track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant) => void;

  constructor() {
    this.room = new Room();
  }

  async connect(wsUrl: string, token: string, callbacks?: {
    onParticipantConnected?: (participant: RemoteParticipant) => void;
    onParticipantDisconnected?: (participant: RemoteParticipant) => void;
    onTrackSubscribed?: (track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant) => void;
  }) {
    if (!this.room) return;

    this.onParticipantConnected = callbacks?.onParticipantConnected;
    this.onParticipantDisconnected = callbacks?.onParticipantDisconnected;
    this.onTrackSubscribed = callbacks?.onTrackSubscribed;

    this.room.on(RoomEvent.ParticipantConnected, this.handleParticipantConnected.bind(this));
    this.room.on(RoomEvent.ParticipantDisconnected, this.handleParticipantDisconnected.bind(this));
    this.room.on(RoomEvent.TrackSubscribed, this.handleTrackSubscribed.bind(this));

    await this.room.connect(wsUrl, token);
    return this.room;
  }

  async startStreaming() {
    if (!this.room) return;

    try {
      // Enable camera and microphone
      await this.room.localParticipant.enableCameraAndMicrophone();
      
      // Publish video and audio tracks
      await this.room.localParticipant.setCameraEnabled(true);
      await this.room.localParticipant.setMicrophoneEnabled(true);
    } catch (error) {
      console.error('Failed to start streaming:', error);
      throw error;
    }
  }

  async stopStreaming() {
    if (!this.room) return;

    await this.room.localParticipant.setCameraEnabled(false);
    await this.room.localParticipant.setMicrophoneEnabled(false);
  }

  async disconnect() {
    if (this.room) {
      await this.room.disconnect();
      this.room = null;
    }
  }

  private handleParticipantConnected(participant: RemoteParticipant) {
    this.onParticipantConnected?.(participant);
  }

  private handleParticipantDisconnected(participant: RemoteParticipant) {
    this.onParticipantDisconnected?.(participant);
  }

  private handleTrackSubscribed(track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant) {
    this.onTrackSubscribed?.(track, publication, participant);
  }

  getRoom() {
    return this.room;
  }

  getParticipants() {
    return this.room?.remoteParticipants || new Map();
  }

  getViewerCount() {
    return this.room ? this.room.remoteParticipants.size : 0;
  }
}