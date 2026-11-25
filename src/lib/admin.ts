import { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
import { deleteObject, getDownloadURL, getStorage, listAll, ref, uploadBytes } from 'firebase/storage';
import Swal from 'sweetalert2';
import { app, db } from './firebase';

const auth = getAuth(app);
const storage = getStorage(app);
const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString('es-AR', { dateStyle: 'medium', timeStyle: 'short' });

const toast = (text: string) =>
  Swal.fire({ icon: 'success', text, toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });

function messageCard(id: string, m: Record<string, unknown>) {
  const card = document.createElement('div');
  card.className = 'card';
  card.style.width = '23rem';
  const body = document.createElement('div');
  body.className = 'card-body';

  const add = (tag: string, text: string, cls = '') => {
    const el = document.createElement(tag);
    el.textContent = text;
    if (cls) el.className = cls;
    body.appendChild(el);
    return el;
  };
  const str = (k: string) => String(m[k] ?? '');

  add('h5', fmtDate(id), 'card-title');
  add('p', str('message'), 'card-text');
  add('h5', str('nombre').toLowerCase(), 'card-subtitle mb-2 text-body-secondary');
  const mail = add('a', ` ${str('email')}`, 'card-subtitle mb-2 text-body-secondary') as HTMLAnchorElement;
  mail.href = `mailto:${str('email')}`;
  add('h5', ` ${str('phoneNumber')}`, 'card-subtitle mb-2 text-body-secondary');
  add('h5', ` In:   ${str('checkIn')}`);
  add('h5', ` Out:   ${str('checkOut')}`);
  // Producción guardaba el checkbox como string "true"/"false".
  add('p', str('check') === 'true' ? 'Quiero que me llamen.' : 'No me llamen, escríbanme.');

  const del = document.createElement('button');
  del.className = 'del-msg';
  del.textContent = 'Borrar mensaje';
  del.addEventListener('click', async () => {
    const ok = await Swal.fire({ title: '¿Borrar mensaje?', showCancelButton: true, confirmButtonText: 'Borrar' });
    if (!ok.isConfirmed) return;
    await deleteDoc(doc(db, 'contacto', id));
    card.remove();
  });
  body.appendChild(del);
  card.appendChild(body);
  return card;
}

async function loadMessages() {
  const box = $('messages');
  box.replaceChildren();
  const snap = await getDocs(collection(db, 'contacto'));
  snap.docs
    .sort((a, b) => b.id.localeCompare(a.id))
    .forEach((d) => box.appendChild(messageCard(d.id, d.data())));
}

function modalValues() {
  const form = $<HTMLFormElement>('modalForm');
  const input = (n: string) => form.elements.namedItem(n) as HTMLInputElement;
  return {
    tittle: input('tittle').value,
    description: input('text').value,
    thumbnail: input('thumbnail').value,
    button: input('button').value,
    show: input('show').checked,
  };
}

async function loadImages() {
  const box = $('images');
  box.replaceChildren();
  const { items } = await listAll(ref(storage, 'indexModal'));
  for (const item of items) {
    const url = await getDownloadURL(item);
    const wrap = document.createElement('div');
    wrap.className = 'db-imgCont m-1';

    const img = document.createElement('img');
    img.src = url;
    img.className = 'db-img mb-3';
    img.style.width = '200px';

    const use = document.createElement('button');
    use.className = 'btn btn-primary m-1';
    use.textContent = 'Usar';
    use.addEventListener('click', () => {
      $<HTMLInputElement>('thumbnail').value = url;
    });

    const del = document.createElement('button');
    del.className = 'btn btn-danger m-1';
    del.textContent = 'Borrar';
    del.addEventListener('click', async () => {
      await deleteObject(item);
      wrap.remove();
    });

    wrap.append(img, use, del);
    box.appendChild(wrap);
  }
}

export function initAdmin() {
  const provider = new GoogleAuthProvider();
  $('signIn').addEventListener('click', () => signInWithPopup(auth, provider).catch(console.error));
  $('signOutBtn').addEventListener('click', () => signOut(auth));
  $('reload').addEventListener('click', loadMessages);

  onAuthStateChanged(auth, async (user) => {
    const logged = !!user;
    $('signIn').hidden = logged;
    $('signOutBtn').hidden = !logged;
    $('reload').hidden = !logged;
    $('panel').hidden = !logged;
    if (!logged) return;
    try {
      await loadMessages();
    } catch {
      Swal.fire({ icon: 'error', text: 'Esta cuenta no tiene permiso para ver el panel.' });
      signOut(auth);
    }
  });

  $('modalForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    await setDoc(doc(db, 'modal_index', 'modal_index'), modalValues());
    toast('Modal publicado');
  });

  $('testButton').addEventListener('click', () => {
    const m = modalValues();
    Swal.fire({ titleText: m.tittle, text: m.description, confirmButtonText: m.button, imageUrl: m.thumbnail, imageWidth: '90%' });
  });

  $('fileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const file = $<HTMLInputElement>('file').files?.[0];
    if (!file) return;
    await uploadBytes(ref(storage, `indexModal/${file.name}`), file);
    toast('Imagen enviada');
    loadImages();
  });

  $('showImages').addEventListener('click', loadImages);
}
