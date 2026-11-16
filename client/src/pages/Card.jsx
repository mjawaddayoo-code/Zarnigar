import { Link } from 'react-router-dom'; import { Heart } from 'lucide-react'; import { motion } from 'framer-motion'; import { useStore } from '../store.jsx';
export const pkr = n => 'PKR ' + Number(n).toLocaleString();
export default function Card({ p }) { const { wish, toggleWish } = useStore();
  return <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="group relative">
    <Link to={`/product/${p._id}`} className="block aspect-[3/4] overflow-hidden bg-sage/20 relative">
      <img src={p.images[0]} alt={p.name} className="absolute inset-0 w-full h-full object-cover transition group-hover:opacity-0" />
      <img src={p.images[1] || p.images[0]} alt="" className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition duration-500" />
      {p.salePrice && <span className="absolute top-2 left-2 bg-gold text-xs px-2 py-1">SALE</span>}
    </Link>
    <button onClick={() => toggleWish(p._id)} className="absolute top-2 right-2 bg-ivory/90 p-2 rounded-full"><Heart size={16} fill={wish.includes(p._id) ? '#0F5132' : 'none'} /></button>
    <h3 className="mt-3 text-sm">{p.name}</h3>
    <p className="text-sm">{p.salePrice ? <><b className="text-emerald">{pkr(p.salePrice)}</b> <s className="text-ink/50">{pkr(p.price)}</s></> : pkr(p.price)}</p>
  </motion.div>; }
