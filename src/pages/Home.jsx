import { useEffect, useState } from 'react'; import { Link } from 'react-router-dom'; import { motion } from 'framer-motion'; import { api } from '../store.jsx'; import Card from './Card.jsx';
const cats = ['Luxury Pret', 'Casual Wear', 'Formal Wear', 'Bridal Collection', 'Unstitched Collection', 'Festive Collection'];
export default function Home() { const [feat, setFeat] = useState(null); const [fresh, setFresh] = useState([]); const [banners, setBanners] = useState([]); const [i, setI] = useState(0); const [email, setEmail] = useState(''); const [msg, setMsg] = useState('');
  useEffect(() => { api.get('/products?featured=1&limit=8').then(r => setFeat(r.data.products)); api.get('/products?sort=newest&limit=4').then(r => setFresh(r.data.products)); api.get('/banners').then(r => setBanners(r.data)); }, []);
  const slides = banners.length ? banners : [{ title: 'The Emerald Edit', image: 'https://picsum.photos/seed/hero1/1600/700', link: '/shop?category=Luxury Pret' }, { title: 'Wedding Season', image: 'https://picsum.photos/seed/hero2/1600/700', link: '/shop?category=Bridal Collection' }];
  useEffect(() => { const t = setInterval(() => setI(x => (x + 1) % slides.length), 5000); return () => clearInterval(t); }, [slides.length]);
  const s = slides[i % slides.length];
  return <div>
    <div className="relative h-[60vh] overflow-hidden"><motion.img key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={s.image} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-emerald-dark/40 flex flex-col items-center justify-center text-ivory text-center gap-5"><h1 className="font-serif text-4xl md:text-6xl">{s.title}</h1><Link to={s.link || '/shop'} className="btn-gold">Shop Now</Link></div></div>
    <section className="px-4 md:px-10 py-14"><h2 className="font-serif text-3xl text-center mb-8">Shop by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">{cats.map(c => <Link key={c} to={`/shop?category=${encodeURIComponent(c)}`} className="border border-sage py-10 text-center font-serif text-xl hover:bg-emerald hover:text-ivory transition">{c}</Link>)}</div></section>
    <Grid title="Featured Collection" items={feat} /><Grid title="New Arrivals" items={fresh} />
    <section className="bg-sage/30 py-16 text-center px-6"><h2 className="font-serif text-3xl mb-3">Our Story</h2><p className="max-w-xl mx-auto">Zarnigar celebrates Pakistani craftsmanship — hand embroidery, heritage weaves and modern silhouettes made by artisans across Punjab and Sindh.</p></section>
    <section className="py-16 text-center px-6"><h2 className="font-serif text-3xl mb-4">Join the Circle</h2>
      <form className="flex max-w-md mx-auto gap-2" onSubmit={async e => { e.preventDefault(); await api.post('/newsletter', { email }); setMsg('Thank you for subscribing!'); setEmail(''); }}><input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="inp" placeholder="Email address" /><button className="btn">Join</button></form><p className="mt-2 text-emerald">{msg}</p></section>
  </div>; }
const Grid = ({ title, items }) => <section className="px-4 md:px-10 py-10"><h2 className="font-serif text-3xl text-center mb-8">{title}</h2><div className="grid grid-cols-2 md:grid-cols-4 gap-5">{items ? items.map(p => <Card key={p._id} p={p} />) : Array.from({ length: 4 }, (_, k) => <div key={k} className="skel aspect-[3/4]" />)}</div></section>;
