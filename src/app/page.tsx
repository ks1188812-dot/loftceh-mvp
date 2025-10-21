
"use client";
import { useState } from "react";

const CATEGORIES = [
  { id: "BEDS", title: "Кровати" },
  { id: "SHELVES", title: "Стеллажи" },
  { id: "DESKS", title: "Столы" },
];

export default function Page() {
  const [step, setStep] = useState(1);
  const [cats, setCats] = useState<string[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [selectedSlugs, setSelected] = useState<string[]>([]);
  const [roomUrl, setRoomUrl] = useState<string>("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [tgLink, setTgLink] = useState<string|undefined>();

  async function loadModels() {
    const res = await fetch("/api/models"); // optional route (not implemented here), can seed client-side
    if (res.ok) {
      const list = await res.json();
      setModels(list);
    } else {
      // fallback demo data
      setModels([
        { slug:"loft-uno", name:"Кровать LOFT Uno", category:"BEDS", imageUrl:"/demo/bed1.svg", basePrice:29900 },
        { slug:"loft-duo", name:"Кровать LOFT Duo", category:"BEDS", imageUrl:"/demo/bed2.svg", basePrice:39900 },
        { slug:"loft-bunk", name:"Двухъярусная LOFT Bunk", category:"BEDS", imageUrl:"/demo/bed3.svg", basePrice:55900 },
        { slug:"shelf-grid", name:"Стеллаж Grid", category:"SHELVES", imageUrl:"/demo/shelf1.svg", basePrice:16900 },
        { slug:"shelf-solid", name:"Стеллаж Solid", category:"SHELVES", imageUrl:"/demo/shelf2.svg", basePrice:19900 },
        { slug:"shelf-loftbox", name:"Стеллаж LoftBox", category:"SHELVES", imageUrl:"/demo/shelf3.svg", basePrice:21900 },
        { slug:"desk-workone", name:"Стол WorkOne", category:"DESKS", imageUrl:"/demo/desk1.svg", basePrice:24900 },
        { slug:"desk-drawerpro", name:"Стол DrawerPro", category:"DESKS", imageUrl:"/demo/desk2.svg", basePrice:28900 },
        { slug:"desk-studiox", name:"Стол StudioX", category:"DESKS", imageUrl:"/demo/desk3.svg", basePrice:31900 },
      ]);
    }
  }

  async function uploadFile(file: File) {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method:"POST", body: fd });
    const json = await res.json();
    setRoomUrl(json.url);
  }

  async function sendLead() {
    const payload = {
      name, phone,
      categories: cats,
      modelSlugs: selectedSlugs,
      roomImageUrl: roomUrl
    };
    const res = await fetch("/api/lead", { method:"POST", body: JSON.stringify(payload) });
    const data = await res.json();
    if (data.tgDeepLink) setTgLink(data.tgDeepLink);
    alert("Заявка отправлена!");
  }

  return (
    <main style={{maxWidth:960, margin:"0 auto", padding:"24px"}}>
      <h1>LOFT ЦЕХ — визуализация мебели</h1>
      <p>Выберите категории и модели, загрузите фото комнаты — мы свяжемся с вами в Telegram.</p>

      {step===1 && (
        <section>
          <h3>1) Категории</h3>
          <div style={{display:"flex", gap:8, flexWrap:"wrap"}}>
            {CATEGORIES.map(c => (
              <button key={c.id} onClick={()=> setCats(v=> v.includes(c.id) ? v.filter(x=>x!==c.id) : [...v, c.id])}
                style={{padding:"8px 12px", border:"1px solid #ccc", borderRadius:12, background: cats.includes(c.id)?"#000":"#fff", color: cats.includes(c.id)?"#fff":"#000"}}>{c.title}</button>
            ))}
          </div>
          <div style={{marginTop:16}}>
            <button onClick={()=>{loadModels(); setStep(2);}} disabled={!cats.length}>Далее</button>
          </div>
        </section>
      )}

      {step===2 && (
        <section>
          <h3>2) Модели</h3>
          <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(220px,1fr))", gap:12}}>
            {models.filter((m:any)=> cats.includes(m.category)).map((m:any)=> (
              <button key={m.slug} onClick={()=> setSelected(v=> v.includes(m.slug) ? v.filter(x=>x!==m.slug) : [...v, m.slug])} style={{textAlign:"left", border:"1px solid #ccc", borderRadius:12, padding:12, background: selectedSlugs.includes(m.slug)?"#f4f4f4":"#fff"}}>
                <img src={m.imageUrl} alt={m.name} style={{width:"100%", aspectRatio:"4/3", objectFit:"contain", background:"#fff", borderRadius:8}} />
                <div style={{marginTop:6, fontWeight:600}}>{m.name}</div>
                <div style={{fontSize:12, color:"#555"}}>от {m.basePrice} ₽</div>
              </button>
            ))}
          </div>
          <div style={{marginTop:16}}>
            <button onClick={()=> setStep(1)}>Назад</button>{" "}
            <button onClick={()=> setStep(3)} disabled={!selectedSlugs.length}>Далее</button>
          </div>
        </section>
      )}

      {step===3 && (
        <section>
          <h3>3) Фото комнаты</h3>
          <input type="file" accept="image/*" onChange={(e)=> e.target.files && uploadFile(e.target.files[0])} />
          {roomUrl && <div style={{marginTop:8}}><img src={roomUrl} style={{maxHeight:220, border:"1px solid #ddd", borderRadius:12}}/></div>}
          <div style={{marginTop:16}}>
            <button onClick={()=> setStep(2)}>Назад</button>{" "}
            <button onClick={()=> setStep(4)} disabled={!roomUrl}>Далее</button>
          </div>
        </section>
      )}

      {step===4 && (
        <section>
          <h3>4) Контакты</h3>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8}}>
            <input placeholder="Имя" value={name} onChange={(e)=> setName(e.target.value)} />
            <input placeholder="+7 ___ ___-__-__" value={phone} onChange={(e)=> setPhone(e.target.value)} />
          </div>
          <div style={{marginTop:16}}>
            <button onClick={()=> setStep(3)}>Назад</button>{" "}
            <button onClick={sendLead} disabled={!name || !phone}>Отправить</button>
          </div>
          {tgLink && <p style={{marginTop:12}}><a href={tgLink} target="_blank">Продолжить в Telegram →</a></p>}
        </section>
      )}
    </main>
  );
}
