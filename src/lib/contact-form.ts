import { doc, setDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import { db } from './firebase';

const toast = (ok: boolean) =>
  Swal.fire({
    icon: ok ? 'success' : 'error',
    iconColor: ok ? '#3DA564' : '#111827',
    text: ok ? 'Mensaje enviado' : 'Error',
    position: 'top-end',
    toast: true,
    showConfirmButton: false,
    background: ok ? '#00FF21' : '#FF4500',
  });

// Misma forma de documento que usa el panel de mensajes (id = fecha ISO en Buenos Aires).
function nowIso() {
  const f = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'America/Argentina/Buenos_Aires',
    dateStyle: 'short',
    timeStyle: 'medium',
  });
  return f.format(new Date()).replace(' ', 'T') + '-03:00';
}

export function initContactForm() {
  const form = document.getElementById('contactForm') as HTMLFormElement | null;
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const contacto = {
      nombre: String(data.get('nombre') ?? ''),
      checkIn: String(data.get('checkIn') ?? ''),
      checkOut: String(data.get('checkOut') ?? ''),
      email: String(data.get('email') ?? ''),
      phoneNumber: String(data.get('phoneNumber') ?? ''),
      message: String(data.get('text') ?? ''),
      // El panel existente compara contra el string "true".
      check: String(data.get('checkbox') === 'on'),
    };
    try {
      await setDoc(doc(db, 'contacto', nowIso()), contacto);
      toast(true);
      setTimeout(() => (window.location.href = '/'), 3000);
    } catch (err) {
      toast(false);
      console.error('Error al enviar el mensaje', err);
    }
  });
}
