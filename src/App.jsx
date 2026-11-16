import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'; import { useState } from 'react'; import { ShoppingBag, Heart, User, Search } from 'lucide-react';
import { useStore } from './store.jsx'; import Home from './pages/Home.jsx'; import Shop from './pages/Shop.jsx'; import ProductPage from './pages/ProductPage.jsx'; import { Cart, Checkout, Orders, Auth } from './pages/Account.jsx'; import Admin from './pages/Admin.jsx';
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
    <footer className="bg-emerald-dark text-ivory/80 text-sm mt-20 p-10 text-center">© Zarnigar — Crafted in Pakistan</footer>
  </>; }
