// src/app/page.tsx
import Image from 'next/image';
import { headers } from 'next/headers';
import Configurator from '@/components/Configurator';

type Category = 'BEDS' | 'DESKS' | 'SHELVES' | 'WARDROBES';
type ProductModel = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  basePrice?: number;
  imageUrl?: string;
  category: Category;
  finishes: string[];
};

// SSR-запрос с абсолютным URL (важно для Vercel/production)
async function getModels(): Promise<ProductModel[]> {
  const h = headers();
  const proto = h.get('x-forwarded-proto') ?? 'https';
  const host = h.get('host') ?? 'localhost:3000';
  const url = `${proto}://${host}/api/models`;

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load models');
  return res.json();
}

export default async function Page() {
  const data = await getModels();

  return (
    <div style={{ padding: 20, fontFamily: 'system-ui' }}>
      <h1>LOFT ЦЕХ — каталог</h1>
      <p>
        Серверная отрисовка: данные берём напрямую из <code>/api/models</code>.
      </p>

      <ul
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 16,
          listStyle: 'none',
          padding: 0,
        }}
      >
        {data.map((m) => (
          <li
            key={m.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: 12,
              padding: 12,
              background: '#fff',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ fontWeight: 600 }}>{m.name}</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>{m.category}</div>

            {m.imageUrl && (
              <div
                style={{
                  position: 'relative',
                  width: '100%',
				  aspectRatio: '1 / 1', // квадрат
                  marginTop: 8,
                  borderRadius: 8,
                  overflow: 'hidden',
                }}
              >
                <Image
                  src={m.imageUrl}
                  alt={m.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 300px"
                  style={{ objectFit: 'cover' }}
                  quality={80}
                />
              </div>
            )}

            <div style={{ marginTop: 8 }}>
              От {new Intl.NumberFormat('ru-RU').format(m.basePrice ?? 0)} ₽
            </div>
          </li>
        ))}
      </ul>

      {/* Интерактив: выбор моделей, загрузка фото и отправка в Telegram */}
      <Configurator models={data} />
    </div>
  );
}
