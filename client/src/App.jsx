import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'; import { useState } from 'react'; import { ShoppingBag, Heart, User, Search, Instagram, Facebook, Youtube, MapPin, Phone, Mail, Truck, ShieldCheck, RefreshCw, Gem } from 'lucide-react';
import { useStore, api } from './store.jsx'; import Home from './pages/Home.jsx'; import Shop from './pages/Shop.jsx'; import ProductPage from './pages/ProductPage.jsx'; import { Cart, Checkout, Orders, Auth } from './pages/Account.jsx'; import Admin from './pages/Admin.jsx';
const Guard = ({ children, admin }) => { const { user } = useStore(); return !user ? <Navigate to="/login" /> : admin && user.role !== 'admin' ? <Navigate to="/" /> : children; };
export default function App() { const { cart, wish, user, logout } = useStore(); const [q, setQ] = useState(''); const nav = useNavigate();
  return <>
    <div className="bg-emerald text-ivory text-xs text-center py-2 tracking-widest">FREE SHIPPING OVER PKR 15,000 · CASH ON DELIVERY NATIONWIDE</div>
    <header className="sticky top-0 z-20 bg-ivory/95 backdrop-blur border-b border-sage/50 px-4 md:px-10 py-4 flex items-center gap-4 flex-wrap">
      <Link to="/" className="font-serif text-2xl text-emerald">Zarnigar</Link>
      <nav className="hidden lg:flex gap-5 text-sm">{['Luxury Pret', 'Casual Wear', 'Formal Wear', 'Bridal Collection', 'Unstitched Collection', 'Festive Collection', 'New Arrivals', 'Sale'].map(c => <Link key={c} to={`/shop?category=${encodeURIComponent(c)}`} className="hover:text-emerald">{c}</Link>)}</nav>
      <form className="ml-auto flex items-center border-b border-sage" onSubmit={e => { e.preventDefault(); nav(`/shop?search=${q}`); }}><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search" className="bg-transparent outline-none w-28 md:w-40 text-sm" /><button><Search size={18} /></button></form>
      <Link to={user ? '/orders' : '/login'} title={user?.name}><User size={20} /></Link>
      {user?.role === 'admin' && <Link to="/admin" className="text-xs text-emerald underline">Admin</Link>}
      {user && <button onClick={logout} className="text-xs">Logout</button>}
      <Link to="/shop?wishlist=1" className="relative"><Heart size={20} /><b className="absolute -top-2 -right-2 text-[10px] bg-gold rounded-full px-1">{wish.length}</b></Link>
      <Link to="/cart" className="relative"><ShoppingBag size={20} /><b className="absolute -top-2 -right-2 text-[10px] bg-gold rounded-full px-1">{cart.reduce((a, i) => a + i.qty, 0)}</b></Link>
    </header>
    <main className="min-h-[70vh]"><Routes>
      <Route path="/" element={<Home />} /><Route path="/shop" element={<Shop />} /><Route path="/product/:id" element={<ProductPage />} /><Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Guard><Checkout /></Guard>} /><Route path="/orders" element={<Guard><Orders /></Guard>} />
      <Route path="/login" element={<Auth />} /><Route path="/register" element={<Auth register />} /><Route path="/admin" element={<Guard admin><Admin /></Guard>} />
    </Routes></main>
    <Footer />
  </>; }

const cats = ['Luxury Pret', 'Casual Wear', 'Formal Wear', 'Bridal Collection', 'Unstitched Collection', 'Festive Collection', 'New Arrivals', 'Sale'];
function Footer() { const [email, setEmail] = useState(''); const [done, setDone] = useState(false);
  const L = ({ to, children }) => <Link to={to} className="block py-1 hover:text-gold transition">{children}</Link>;
  return <footer className="bg-emerald-dark text-ivory/80 text-sm mt-20">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-4 md:px-10 py-8 border-b border-ivory/10">
      {[[Truck, 'Nationwide Delivery', '2–5 working days'], [ShieldCheck, 'Cash on Delivery', 'Pay when it arrives'], [RefreshCw, 'Easy Exchange', '7-day exchange policy'], [Gem, 'Premium Quality', 'Hand-finished details']].map(([I, t, d]) => <div key={t} className="flex gap-3 items-center"><I className="text-gold shrink-0" size={26} /><div><p className="text-ivory font-medium">{t}</p><p className="text-xs">{d}</p></div></div>)}
    </div>
    <div className="grid md:grid-cols-4 gap-10 px-4 md:px-10 py-12">
      <div><h3 className="font-serif text-3xl text-gold mb-3">Zarnigar</h3><p className="leading-relaxed">Pakistani luxury fashion rooted in heritage craftsmanship — hand embroidery, fine fabrics and modern silhouettes for every occasion.</p>
        <div className="flex gap-3 mt-4">{[[Instagram, 'https://instagram.com'], [Facebook, 'https://facebook.com'], [Youtube, 'https://youtube.com']].map(([I, u], k) => <a key={k} href={u} target="_blank" rel="noreferrer" className="w-9 h-9 border border-ivory/30 rounded-full grid place-items-center hover:bg-gold hover:text-ink transition"><I size={16} /></a>)}</div></div>
      <div><h4 className="text-ivory font-medium tracking-widest uppercase mb-3">Shop</h4>{cats.map(c => <L key={c} to={`/shop?category=${encodeURIComponent(c)}`}>{c}</L>)}</div>
      <div><h4 className="text-ivory font-medium tracking-widest uppercase mb-3">My Account</h4><L to="/login">Sign In</L><L to="/register">Create Account</L><L to="/orders">Track My Order</L><L to="/shop?wishlist=1">Wishlist</L><L to="/cart">Shopping Bag</L>
        <h4 className="text-ivory font-medium tracking-widest uppercase mt-6 mb-3">Contact</h4>
        <p className="flex gap-2 py-1"><MapPin size={16} className="text-gold shrink-0" />Gulberg III, Lahore, Pakistan</p><p className="flex gap-2 py-1"><Phone size={16} className="text-gold shrink-0" />+92 300 0000000</p><p className="flex gap-2 py-1"><Mail size={16} className="text-gold shrink-0" />care@zarnigar.pk</p></div>
      <div><h4 className="text-ivory font-medium tracking-widest uppercase mb-3">Stay in Touch</h4><p className="mb-3">New collections, festive edits and exclusive offers — straight to your inbox.</p>
        {done ? <p className="text-gold">Thank you for subscribing!</p> : <form className="flex" onSubmit={async e => { e.preventDefault(); await api.post('/newsletter', { email }); setDone(true); }}><input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email" className="flex-1 min-w-0 bg-transparent border border-ivory/30 px-3 py-2 outline-none focus:border-gold" /><button className="bg-gold text-ink px-4 uppercase text-xs tracking-widest">Join</button></form>}
        <p className="mt-5 text-xs uppercase tracking-widest text-ivory/60">We accept</p><p className="mt-1">Cash on Delivery</p></div>
    </div>
    <div className="border-t border-ivory/10 px-4 md:px-10 py-5 flex flex-col md:flex-row justify-between gap-2 text-xs"><p>© {new Date().getFullYear()} Zarnigar. All rights reserved.</p><p>Crafted with care in Pakistan 🇵🇰</p></div>
  </footer>; }
