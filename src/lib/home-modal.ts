import { doc, getDoc, setDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import { db } from './firebase';

interface ModalDoc {
  show: boolean;
  tittle: string;
  description: string;
  button: string;
  thumbnail: string;
}

export async function initModal() {
  try {
    const snap = await getDoc(doc(db, 'modal_index', 'modal_index'));
    if (!snap.exists()) return;
    const m = snap.data() as ModalDoc;
    if (!m.show) return;

    const landscape = window.innerWidth > window.innerHeight;
    const result = await Swal.fire({
      titleText: m.tittle,
      text: m.description,
      confirmButtonText: m.button,
      imageUrl: m.thumbnail,
      imageWidth: '90%',
      backdrop: !landscape,
    });

    // Producción cuenta cuántos tocan el botón del modal (solo en horizontal).
    if (landscape && result.isConfirmed) {
      const ref = doc(db, 'counter', 'visits');
      const current = await getDoc(ref);
      const visits = (current.data()?.visits ?? 0) + 1;
      await setDoc(ref, { visits });
    }
  } catch (err) {
    console.error('No se pudo mostrar el modal', err);
  }
}
