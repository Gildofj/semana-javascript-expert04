export const constants = {
  socketUrl: "http://localhost:3000",
  socketNamespaces: {
    room: "room",
    lobby: "lobby",
  },
  peerConfig: Object.values({
    id: undefined,
    debug: 2,
    // config: {
    //   host: "localhost",
    //   secure: true,
    //   port: 443,
    //   path: "/",
    // },
  }),
  pages: {
    lobby: "/pages/lobby",
    login: "/pages/login",
  },
  events: {
    USER_CONNECTED: "userConnection",
    USER_DISCONNECTED: "userDisconnection",

    JOIN_ROOM: "joinRoom",

    LOBBY_UPDATED: "lobbyUpdated",
    UPGRADE_USER_PERMISSION: "upgradeUserPermission",

    SPEAK_REQUEST: "speakRequest",
    SPEAK_ANSWER: "speakAnswer",
  },
  firebaseConfig: {
    apiKey: "AIzaSyCtbY-nFzNrQ2ohJHETOFbs4_lxRpxffKQ",
    authDomain: "semana-js-expert-gildo.firebaseapp.com",
    projectId: "semana-js-expert-gildo",
    storageBucket: "semana-js-expert-gildo.appspot.com",
    messagingSenderId: "922065587232",
    appId: "1:922065587232:web:70b2944f65caac23604045",
    measurementId: "G-YWRR8R54XN",
  },
  storageKey: "jsexpert:storage:user",
};
