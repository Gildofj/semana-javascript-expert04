import { constants } from "../../_shared/constants.js";
import Attendee from "../../_shared/entities/attendee.js";

export default class RoomController {
  constructor({ view, socketBuilder, roomInfo, roomService, peerBuilder }) {
    this.socketBuilder = socketBuilder;
    this.roomService = roomService;
    this.peerBuilder = peerBuilder;
    this.roomInfo = roomInfo;
    this.view = view;

    this.socket = {};
  }

  static async initialize(deps) {
    return new RoomController(deps)._initialize();
  }
  async _initialize() {
    this._setupViewEvents();
    this.roomService.init();

    this.socket = this._setupSocket();
    this.roomService.setCurrentPeer(await this._setupWebRTC());
  }

  _setupViewEvents() {
    this.view.configureOnMicrophoneActivation(this.onMicrophoneActivation());
    this.view.configureLeaveButton();
    this.view.configureClapButton(this.onClapPressed());
    this.view.updateUserImage(this.roomInfo.user);
    this.view.updateRoomTopic(this.roomInfo.room);
  }

  onMicrophoneActivation() {
    return async () => {
      await this.roomService.toggleAudioActivation();
    };
  }

  onClapPressed() {
    return () => {
      this.socket.emit(constants.events.SPEAK_REQUEST);
    };
  }

  _setupSocket() {
    return this.socketBuilder
      .setOnUserConnected(this.onUserConnected())
      .setOnUserDisconnected(this.onUserDisconnected())
      .setOnRoomUpdated(this.onRoomUpdated())
      .setOnUserProfileUpgrade(this.onUserProfileUpgrade())
      .setOnSpeakRequested(this.onSpeakRequested())
      .build();
  }

  onSpeakRequested() {
    return (data) => {
      const user = new Attendee(data);
      const result = prompt(
        `${attendee.username} pediu para falar!, aceitar? 1 sim, 0 não`,
      );
      this.socket.emit(constants.events.SPEAK_ANSWER, {
        answer: !!Number(result),
        user,
      });
    };
  }

  async _setupWebRTC() {
    return this.peerBuilder
      .setOnError(this.onPeerError())
      .setOnConnectionOpened(this.onPeerConnectionOpened())
      .setOnCallReceived(this.onCallReceived())
      .setOnCallError(this.onCallError())
      .setOnCallClose(this.onCallClose())
      .setOnStreamReceived(this.onStreamReceived())
      .build();
  }

  onStreamReceived() {
    return (call, stream) => {
      const callerId = call.peer;
      console.log(call, stream);
      const { isCurrentId } = this.roomService.addReceivedPeer(call);
      this.view.renderAudioElement({
        callerId,
        stream,
        isCurrentId,
      });
    };
  }

  onCallClose() {
    return (call) => {
      console.log(call);
      const peerId = call.peer;
      this.roomService.disconnectPeer({ peerId });
    };
  }

  onCallError() {
    return (call, error) => {
      console.error(call, error);
      const peerId = call.peer;
      this.roomService.disconnectPeer({ peerId });
    };
  }

  onCallReceived() {
    return async (call) => {
      const stream = await this.roomService.getCurrentStream();
      console.log("resp call", call);
      call.answer(stream);
    };
  }

  onPeerError() {
    return (error) => {
      console.error("deu ruim", error);
    };
  }

  onPeerConnectionOpened() {
    return (peer) => {
      console.log("peeer", peer);
      this.roomInfo.user.peerId = peer.id;
      this.socket.emit(constants.events.JOIN_ROOM, this.roomInfo);
    };
  }

  onUserConnected() {
    return (data) => {
      const attendee = new Attendee(data);
      console.log("User Connected:", attendee);
      this.view.addAttendeeOnGrid(attendee);

      this.roomService.callNewUser(attendee);
    };
  }

  onUserDisconnected() {
    return (data) => {
      const attendee = new Attendee(data);

      console.log(`${attendee.username} Disconnected`);

      this.view.removeItemFromGrid(attendee.id);

      this.roomService.disconnectPeer(attendee);
    };
  }

  onRoomUpdated() {
    return (data) => {
      const users = data.map((item) => new Attendee(item));

      console.log("Room List:", users);

      this.view.updateAttendeesOnGrid(users);
      this.roomService.updateCurrentUserProfile(users);
      this.activateUserFeatures();
    };
  }

  onUserProfileUpgrade() {
    return (data) => {
      const attendee = new Attendee(data);
      console.log("onUserProfileUpgrade", attendee);

      if (attendee.isSpeaker) {
        this.roomService.upgradeUserPermission(attendee);
        this.view.addAttendeeOnGrid(attendee, true);
      }

      this.activateUserFeatures();
    };
  }

  activateUserFeatures() {
    const currentUser = this.roomService.getCurrentUser();
    this.view.showUserFeatures(currentUser.isSpeaker);
  }
}
