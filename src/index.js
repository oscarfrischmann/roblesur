import sweetalert2 from 'https://cdn.jsdelivr.net/npm/sweetalert2@11.11.1/+esm';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js';
import {
	getAuth,
	onAuthStateChanged,
	GoogleAuthProvider,
	signInWithPopup,
	signOut,
} from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js';
import {
	getFirestore,
	collection,
	getDocs,
	doc,
	setDoc,
} from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js';

// Your web app's Firebase configuration
const firebaseConfig = initializeApp({
	apiKey: 'AIzaSyC-Vugn6OZcEOZuRhwO4DcX6jQ1UrPgADM',
	authDomain: 'hosteria-roblesur.firebaseapp.com',
	projectId: 'hosteria-roblesur',
	storageBucket: 'hosteria-roblesur.appspot.com',
	messagingSenderId: '587587113540',
	appId: '1:587587113540:web:98f34cdf522d748b9ce211',
});

//LUXON
let dateTime = luxon.DateTime;
// Initialize Firebase
const auth = getAuth(firebaseConfig);
const db = getFirestore(firebaseConfig);

// detect auth state
onAuthStateChanged(auth, (user) => {
	if (user != null) {
		console.log('User Logged In');
		console.log(user);
	} else {
		console.log('No User Logged In');
	}
});

function submitForm(e) {
	const now = dateTime.now().setZone('America/Buenos_Aires').toISO();

	e.preventDefault();
	const name = contactForm['nombre'].value;
	const checkIn = contactForm['checkIn'].value;
	const checkOut = contactForm['checkOut'].value;
	const email = contactForm['email'].value;
	const phoneNumber = contactForm['phoneNumber'].value;
	const text = contactForm['text'].value;

	const contacto = {
		nombre: name,
		checkIn: checkIn,
		checkOut: checkOut,
		email: email,
		phoneNumber: phoneNumber,
		message: text,
	};
	(async function () {
		try {
			await setDoc(doc(db, 'contacto', now), contacto);
			sweetalert2.fire({
				icon: 'success',
				iconColor: '#3DA564',
				text: 'Mensaje enviado',
				position: `top-end`,
				toast: true,
				showConfirmButton: false,
				background: '#00FF21',
			});
			setTimeout(() => {
				window.location.href = '../index.html';
			}, 3000);
		} catch (e) {
			sweetalert2.fire({
				icon: 'error',
				iconColor: '#111827',
				text: 'Error',
				position: `top-end`,
				toast: true,
				showConfirmButton: false,
				background: '#FF4500',
			});
			console.error('Error adding document: ', e);
		}
	})();
	return contacto;
}
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', submitForm);

const checked = document.getElementById('checkbox');

checked.addEventListener('click', () => {
	if (checked.checked) {
		checked.value = true;
		console.log(checked.value);
	} else {
		checked.value = false;
		console.log(checked.value);
	}
});

//* Holaindex
