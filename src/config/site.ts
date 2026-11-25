// Única fuente de verdad de los datos del negocio.
export const site = {
  name: 'Hostería Roble Sur',
  shortName: 'Roble Sur',
  tagline: 'Hostería y compañía',
  url: 'https://roblesur.com.ar',
  defaultImage: '/img/26.jpg',
  phone: '+ 54 0 2902 495559',
  whatsapp: {
    display: '+ 54 9 2966 687337',
    href: 'https://wa.me/5492966687337?text=Hola%21%20Quisiera%20hospedarme%20en%20Roble%20Sur...',
  },
  email: 'info@roblesur.com.ar',
  address: ['Glaciar Río Túnel 210', 'El Calafate', 'Santa Cruz', 'República Argentina'],
  social: {
    facebook: 'https://www.facebook.com/100063781770288',
    instagram: 'https://www.instagram.com/hosteria.roblesur/',
    tripadvisor:
      'https://www.tripadvisor.com.ar/Hotel_Review-g312851-d670899-Reviews-Roble_Sur-El_Calafate_Province_of_Santa_Cruz_Patagonia.html?m=19905',
  },
  author: 'Oscar Frischmann - WEB DEVELOPER',
  analyticsId: 'G-H0SWB98NYL',
} as const;

export const nav = [
  { href: '/nosotros.html', label: 'Nosotros' },
  { href: '/la_hosteria.html', label: 'La Hostería' },
  { href: '/contacto.html', label: 'Reservas' },
  { href: '/ubicacion.html', label: 'Ubicación' },
  { href: '/fotos.html', label: 'Fotos' },
] as const;
