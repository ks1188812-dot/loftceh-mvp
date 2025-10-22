'use client';
import { useEffect, useState } from 'react';

type Category = 'BEDS' | 'DESKS' | 'SHELVES' | 'WARDROBES';
type ProductModel = {
  id: string; name: string; slug: string;
  description?: string; basePrice?: number;
  imageUrl?: string; category: Category; finishes: string[];
};

export default function Page() {
  const [data, setData] = useState<ProductModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/models')
      .then(r => { if (!r.ok) throw new Error('Не удалось загрузить модели'); return r.json(); })
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{padding:20,fontSize:18}}>Загружаю…</div>;
  if (error)   return <div style={{padding:20,color:'red'}}>Ошибка: {error}</div>;

  return (
    <div style={{padding:20,fontFamily:'system-ui'}}>
      <h1>LOFT ЦЕХ — каталог</h1>
      <p>Данные приходят с <code>/api/models</code>.</p>
      <ul style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:16,listStyle:'none',padding:0}}>
        {data.map(m => (
          <li key={m.id} style={{border:'1px solid #ddd',borderRadius:12,padding:12}}>
            <div style={{fontWeight:600}}>{m.name}</div>
            <div style={{fontSize:12,opacity:.7}}>{m.category}</div>
            {m.imageUrl && <img src={m.imageUrl} alt={m.name} style={{width:'100%',height:140,objectFit:'cover',marginTop:8,borderRadius:8}}/>}
            <div style={{marginTop:8}}>От {m.basePrice?.toLocaleString('ru-RU')} ₽</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
