import { constants } from "../../_shared/constants.js";
import UserDb from "../../_shared/userDb.js";

function redirectionToLobby() {
  window.location = constants.pages.lobby;
}

function onLogin({ provider, firebase }) {
  return async () => {
    try {
      const { user } = await firebase.auth().signInWithPopup(provider);

      const userData = {
        img: user.photoURL,
        username: user.displayName,
      };

      UserDb.insert(userData);
      redirectionToLobby();
    } catch (error) {
      alert(JSON.stringify(error));
    }
  };
}

const currentUser = UserDb.get();

if (Object.keys(currentUser).length) {
  redirectionToLobby();
}

const { firebaseConfig } = constants;

firebase.initializeApp(firebaseConfig);
firebase.analytics();

var provider = new firebase.auth.GithubAuthProvider();
provider.addScope("read:user");

const btnLogin = document.getElementById("btnLogin");
btnLogin.addEventListener("click", onLogin({ provider, firebase }));
