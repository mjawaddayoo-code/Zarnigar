import { createContext, useContext, useEffect, useState } from 'react'; import axios from 'axios';
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });
api.interceptors.request.use(c => { const u = JSON.parse(localStorage.getItem('user') || 'null'); if (u) c.headers.Authorization = `Bearer ${u.token}`; return c; });
const Ctx = createContext(); export const useStore = () => useContext(Ctx);
const load = (k, d) => JSON.parse(localStorage.getItem(k) || d);
export function Store({ children }) {
  const [user, setUser] = useState(load('user', 'null')); const [cart, setCart] = useState(load('cart', '[]')); const [wish, setWish] = useState([]);
  useEffect(() => localStorage.setItem('cart', JSON.stringify(cart)), [cart]);
  const refreshWish = () => user ? api.get('/wishlist').then(r => setWish(r.data.map(p => p._id))).catch(() => {}) : setWish([]);
  useEffect(() => { refreshWish(); }, [user]);
  const login = u => { localStorage.setItem('user', JSON.stringify(u)); setUser(u); };
  const logout = () => { localStorage.removeItem('user'); setUser(null); };
  const addToCart = (p, size, color, qty = 1) => setCart(c => { const k = p._id + size + color; const e = c.find(i => i.key === k); return e ? c.map(i => i.key === k ? { ...i, qty: i.qty + qty } : i) : [...c, { key: k, product: p._id, name: p.name, image: p.images[0], price: p.salePrice || p.price, size, color, qty }]; });
  const setQty = (key, qty) => setCart(c => qty < 1 ? c.filter(i => i.key !== key) : c.map(i => i.key === key ? { ...i, qty } : i));
  const toggleWish = async id => { if (!user) return alert('Please login first'); const r = await api.post('/wishlist/' + id); setWish(r.data); };
  return <Ctx.Provider value={{ user, login, logout, cart, setCart, addToCart, setQty, wish, toggleWish }}>{children}</Ctx.Provider>;
}
