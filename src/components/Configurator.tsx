// src/components/Configurator.tsx
'use client';

import { useMemo, useState } from 'react';

type Category = 'BEDS' | 'DESKS' | 'SHELVES' | 'WARDROBES';
export type ProductModel = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  basePrice?: number;
  imageUrl?: string;
  category: Category;
  finishes: string[];
};

export default function Configurator({ models }: { models: ProductModel[] }) {
  const byCat = useMemo(() => {
    const g: Record<Category, ProductModel[]> = { BEDS: [], DESKS: [], SHELVES: [], WARDROBES: [] };
    for (const m of models) g[m.category]?.push(m);
    return g;
  }, [models]);

  const [selected, setSelected] = useState<string[]>([]);
  const [selectedCats, setSelectedCats] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  function toggleModel(slug: string) {
    setSelected((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  }
  function toggleCat(cat: Category) {
    setSelectedCats((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name || !phone) {
      setError('Введите имя и телефон');
      return;
    }

    setStatus('sending');
    try {
      const fd = new FormData();
      fd.append('name', name);
      fd.append('phone', phone);
      if (selected.length) fd.append('selections', selected.join(','));
      if (selectedCats.length) fd.append('categories', selectedCats.join(','));
      if (file) fd.append('photo', file, file.name);

      const res = await fetch('/api/sendToTelegram', { method: 'POST', body: fd });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || 'Ошибка отправки');

      setStatus('ok');
      setSelected([]);
      setSelectedCats([]);
      setName('');
      setPhone('');
      setFile(null);
    } catch (err: any) {
      setStatus('error');
      setError(err?.message || 'Не удалось отправить. Попробуйте ещё раз.');
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 24, display: 'grid', gap: 20 }}>
      <h2>1) Выберите категории</h2>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {(['BEDS', 'DESKS', 'SHELVES'] as Category[]).map((cat) => (
          <label key={cat} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={selectedCats.includes(cat)}
              onChange={() => toggleCat(cat)}
            />
            {cat}
          </label>
        ))}
      </div>

      <h2>2) Отметьте понравившиеся модели</h2>
      {(['BEDS', 'DESKS', 'SHELVES'] as Category[]).map((cat) => (
        <div key={cat}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>{cat}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 12 }}>
            {byCat[cat]?.map((m) => (
              <label key={m.slug} style={{ border: '1px solid #eee', borderRadius: 10, padding: 10 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={selected.includes(m.slug)}
                    onChange={() => toggleModel(m.slug)}
                  />
                  <div style={{ fontWeight: 600 }}>{m.name}</div>
                </div>
				 {m.imageUrl && (
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: 140,
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
                  quality={70}
                />
              </div>
            )}
                <div style={{ fontSize: 12, opacity: 0.7 }}>{m.description}</div>
                <div style={{ fontSize: 12, marginTop: 4 }}>
                  От {new Intl.NumberFormat('ru-RU').format(m.basePrice ?? 0)} ₽
                </div>
              </label>
            ))}
          </div>
        </div>
      ))}

      <h2>3) Загрузите фото комнаты (необязательно)</h2>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <h2>4) Контакты</h2>
      <div style={{ display: 'grid', gap: 10, maxWidth: 420 }}>
        <input
          placeholder="Имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }}
        />
        <input
          placeholder="Телефон"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }}
        />
      </div>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      <button
        type="submit"
        disabled={status === 'sending'}
        style={{
          padding: '12px 18px',
          borderRadius: 10,
          border: '1px solid #222',
          background: '#111',
          color: '#fff',
          width: 220,
        }}
      >
        {status === 'sending' ? 'Отправляю…' : 'Отправить в Telegram'}
      </button>

      {status === 'ok' && <div style={{ color: 'green' }}>Заявка отправлена! Мы скоро свяжемся.</div>}
    </form>
  );
}
