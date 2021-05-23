import { constants } from "../../../_shared/constants.js";
import SocketBuilder from "../../../_shared/socketBuilder.js";

export default class RoomSocketBuilder extends SocketBuilder {
  constructor({ socketUrl, namespace }) {
    super({ socketUrl, namespace });
    this.onRoomUpdated = () => {};
    this.onUserProfileUpgrade = () => {};
    this.OnSpeakRequested = () => {};
    this.OnSpeakAnswered = () => {};
  }

  setOnRoomUpdated(fn) {
    this.onRoomUpdated = fn;

    return this;
  }

  setOnUserProfileUpgrade(fn) {
    this.onUserProfileUpgrade = fn;

    return this;
  }

  setOnSpeakRequested(fn) {
    this.OnSpeakRequested = fn;

    return this;
  }

  setOnSpeakAnswered(fn) {
    this.OnSpeakAnswered = fn;

    return this;
  }

  build() {
    const socket = super.build();

    socket.on(constants.events.LOBBY_UPDATED, this.onRoomUpdated);
    socket.on(
      constants.events.UPGRADE_USER_PERMISSION,
      this.onUserProfileUpgrade,
    );
    socket.on(constants.events.SPEAK_ANSWER, this.OnSpeakAnswered);
    socket.on(constants.events.SPEAK_REQUEST, this.OnSpeakRequested);

    return socket;
  }
}
