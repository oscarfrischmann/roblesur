import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

const firebaseConfig = initializeApp({
  apiKey: "AIzaSyC-Vugn6OZcEOZuRhwO4DcX6jQ1UrPgADM",
  authDomain: "hosteria-roblesur.firebaseapp.com",
  projectId: "hosteria-roblesur",
  storageBucket: "hosteria-roblesur.appspot.com",
  messagingSenderId: "587587113540",
  appId: "1:587587113540:web:98f34cdf522d748b9ce211",
});
import sweetalert2 from "https://cdn.jsdelivr.net/npm/sweetalert2@11.11.1/+esm";

const db = getFirestore(firebaseConfig);
let alert = document.getElementById("alert");
console.log("modal on");

(async function getModal() {
  try {
    const fRef = doc(db, `modal_index`, "modal_index");
    const docSnap = await getDoc(fRef);
    const modalData = docSnap._document.data.value.mapValue.fields;
    console.log(modalData);
    if (modalData.show.booleanValue) {
      const modal = document.getElementById("modal");
      console.log(modal);
      sweetalert2.fire({
        titleText: modalData.tittle.stringValue,
        text: modalData.text.stringValue,
        confirmButtonText: modalData.confirmButtonText.stringValue,
        imageUrl: modalData.thumbnail.stringValue,
        imageWidth: "90%",
        backdrop: true,
      });
    }
  } catch (err) {
    throw new Error(err);
  }
})();

const changeModal = async (event) => {
  await event.preventDefault();
  console.log("hi");
  try {
    const tittle = alert["tittle"].value;
    const description = alert["text"].value;
    const thumbnail = alert["thumbnail"].value;
    const button = alert["button"].value;
    const show = alert["stock"].value;
    console.log(tittle, description, thumbnail, button, show);
    await setDoc(doc(db, "modal_index", "modal_index"), {
      tittle: tittle,
      description: description,
      thumbnail: thumbnail,
      button: button,
      show: show,
    });
  } catch (err) {
    throw new Error("bla bla", err);
  }
  console.log(newModal);
};
alert.addEventListener("submit", changeModal());
