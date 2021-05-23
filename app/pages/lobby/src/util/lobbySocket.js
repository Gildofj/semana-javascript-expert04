import { constants } from "../../../_shared/constants.js";
import SocketBuilder from "../../../_shared/socketBuilder.js";

export default class LoobySocketBuilder extends SocketBuilder {
  constructor({ socketUrl, namespace }) {
    super({ socketUrl, namespace });
    this.onLoobyUpdated = () => {};
  }

  setOnLoobyUpdated(fn) {
    this.onLoobyUpdated = fn;

    return this;
  }

  build() {
    const socket = super.build();

    socket.on(constants.events.LOBBY_UPDATED, this.onLoobyUpdated);

    return socket;
  }
}
