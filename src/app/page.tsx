import Image from 'next/image';

type Category = 'BEDS' | 'DESKS' | 'SHELVES' | 'WARDROBES';
type ProductModel = {
  id: string; name: string; slug: string;
  description?: string; basePrice?: number;
  imageUrl?: string; category: Category; finishes: string[];
};

async function getModels(): Promise<ProductModel[]> {
  // SSR-запрос — без кеша
  const res = await fetch('https://loft-workshop.netlify.app/api/models', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load models');
  return res.json();
}

export default async function Page() {
  const data = await getModels();

  return (
    <div style={{padding:20,fontFamily:'system-ui'}}>
      <h1>LOFT ЦЕХ — каталог</h1>
      <p>Серверная отрисовка: данные берём напрямую из /api/models.</p>
      <ul style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:16,listStyle:'none',padding:0}}>
        {data.map(m => (
          <li key={m.id} style={{border:'1px solid #ddd',borderRadius:12,padding:12}}>
            <div style={{fontWeight:600}}>{m.name}</div>
            <div style={{fontSize:12,opacity:.7}}>{m.category}</div>
            {m.imageUrl && (
              // можно оставить <img>, Image не обязателен
              <img src={m.imageUrl} alt={m.name}
                   style={{width:'100%',height:140,objectFit:'cover',marginTop:8,borderRadius:8}}/>
            )}
            <div style={{marginTop:8}}>
              От {new Intl.NumberFormat('ru-RU').format(m.basePrice ?? 0)} {'\u20BD'}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
