import swal from "./modal.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
// Your web app's Firebase configuration
const firebaseConfig = initializeApp({
  apiKey: "AIzaSyC-Vugn6OZcEOZuRhwO4DcX6jQ1UrPgADM",
  authDomain: "hosteria-roblesur.firebaseapp.com",
  projectId: "hosteria-roblesur",
  storageBucket: "hosteria-roblesur.appspot.com",
  messagingSenderId: "587587113540",
  appId: "1:587587113540:web:98f34cdf522d748b9ce211",
});

let dateTime = luxon.DateTime;
const now = dateTime.now().setZone("America/Buenos_Aires").toISO();

// Initialize Firebase
const auth = getAuth(firebaseConfig);
const provider = new GoogleAuthProvider();
const db = getFirestore(firebaseConfig);

// SIGN IN GOOGLE
const signInButton = document.getElementById("googleLogIn");
signInButton.addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      console.log(result);
      const userID = { userID: user.uid };
      (async function () {
        try {
          await setDoc(doc(db, "Users", user.displayName), userID).then();
        } catch (e) {
          console.error("User ID NOT added: ", e);
        }
      })();
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
});

//sign out
const signOutButton = document.getElementById("googleLogOut");
signOutButton.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      console.log("Signed Out succesfully");
      console.log(getMessages(db));
      location.reload();
    })
    .catch((error) => {
      console.log("We couldn´t sign you Out", error);
    });
});

// detect auth state
onAuthStateChanged(auth, (user) => {
  if (user != null) {
    console.log("User Logged In");
    console.log(user);
    const showModalForm = document.getElementById("alertContainer");
    showModalForm.classList.toggle("show");
    getMessages(db);
  } else {
    console.log("No User Logged In");
  }
});

//GET INFO
const msgContainer = document.getElementById("messages");
let allMessagesInDB;
async function getMessages(db) {
  try {
    const mensajes = collection(db, "contacto");

    const mensajesSnapshot = await getDocs(mensajes);
    console.log(mensajesSnapshot);
    allMessagesInDB = mensajesSnapshot.docs.map((doc) => doc.data());
    const withID = mensajesSnapshot.docs.map((doc) => doc.id);
    console.log(withID);
    withID.forEach((id) => {
      console.log(dateTime.fromISO(id).toLocaleString(dateTime.DATETIME_MED));
    });
    console.log(allMessagesInDB);

    allMessagesInDB.forEach((msg, i) => {
      msg.id = withID[i];

      let newMsgDiv = document.createElement("div");
      newMsgDiv.className = "msgContainer";

      const time = document.createElement("span");
      time.textContent = `${dateTime
        .fromISO(msg.id)
        .toLocaleString(dateTime.DATETIME_MED)}`;

      const email = document.createElement("span");
      email.textContent = ` ${msg.email}`;

      const checkIn = document.createElement("span");
      checkIn.textContent = ` In:   ${msg.checkIn}`;

      const checkOut = document.createElement("span");
      checkOut.textContent = ` Out:   ${msg.checkOut}`;

      const phoneNumber = document.createElement("span");
      phoneNumber.textContent = ` ${msg.phoneNumber}`;

      const text = document.createElement("span");
      text.textContent = ` ${msg.message}`;

      const name = document.createElement("span");
      name.textContent = `${msg.nombre.toLowerCase()}`;
      console.log(typeof msg.nombre);

      msgContainer.appendChild(newMsgDiv);
      newMsgDiv.appendChild(time);
      newMsgDiv.appendChild(email);
      newMsgDiv.appendChild(checkIn);
      newMsgDiv.appendChild(checkOut);
      newMsgDiv.appendChild(phoneNumber);
      newMsgDiv.appendChild(text);
      newMsgDiv.appendChild(name);

      const deleteMsg = document.createElement("button");
      deleteMsg.innerHTML = "Borrar mensaje";
      deleteMsg.setAttribute("data-id", msg.id);
      newMsgDiv.appendChild(deleteMsg);
    });
    const deleteButtons = document.querySelectorAll("#messages button ");
    console.log(deleteButtons);
    for (let btn of deleteButtons) {
      btn.addEventListener("click", async ({ target: { dataset } }) => {
        console.log(dataset);
        await deleteDoc(doc(db, "contacto", dataset.id));
        // deleteMsg(dataset.id);
        setTimeout(() => {
          location.reload();
        }, 1000);
      });
    }
    return allMessagesInDB;
  } catch (e) {
    console.error("Error getting documents", e);
  }
}

const getData = document.getElementById("getData");
getData.addEventListener("click", () => {
  // getMessages(db).then((result) => console.log(result));
  location.reload();
});

function deleteMsg(tg) {
  deleteDoc(doc(db, "contacto", tg));
}
const manageModal = document.getElementById("alert");

const show = document.getElementById("show");
let showModal = false;
show.addEventListener("click", () => {
  if (show.checked) {
    showModal = true;
    console.log(showModal);
  } else {
    showModal = false;
  }
});
const changeModal = async (event) => {
  event.preventDefault();
  console.log(show);
  const tittle = manageModal["tittle"].value;
  const description = manageModal["text"].value;
  const thumbnail = manageModal["thumbnail"].value;
  const button = manageModal["button"].value;

  try {
    await setDoc(doc(db, "modal_index", "modal_index"), {
      tittle: tittle,
      description: description,
      thumbnail: thumbnail,
      button: button,
      show: showModal,
    });
    await swal();
  } catch (err) {
    throw new Error("bla bla", err);
  }
};
manageModal.addEventListener("submit", changeModal);
