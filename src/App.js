import { useState, useRef, useCallback, useEffect } from "react";
import './index.css';

const CATEGORIES = ["Tops", "Bottoms", "Dresses", "Outerwear", "Shoes", "Accessories", "Bags"];
const OUTFIT_SLOTS = ["Tops", "Bottoms", "Shoes", "Outerwear", "Accessories"];

async function loadItems() { try { const r = await window.storage.get("closet-items"); return r ? JSON.parse(r.value) : []; } catch { return []; } }
async function saveItems(items) { try { await window.storage.set("closet-items", JSON.stringify(items)); } catch {} }
async function loadOutfits() { try { const r = await window.storage.get("closet-outfits"); return r ? JSON.parse(r.value) : []; } catch { return []; } }
async function saveOutfits(outfits) { try { await window.storage.set("closet-outfits", JSON.stringify(outfits)); } catch {} }

function UploadModal({ onAdd, onClose }) {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Tops");
  const [tags, setTags] = useState("");
  const [dragging, setDragging] = useState(false);
  const ref = useRef();
  const readFile = (f) => { if (!f?.type.startsWith("image/")) return; const r = new FileReader(); r.onload = e => setImage(e.target.result); r.readAsDataURL(f); };
  const onDrop = useCallback((e) => { e.preventDefault(); setDragging(false); readFile(e.dataTransfer.files[0]); }, []);
  return (
    <div className="backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <h2 className="modal-title">Add Piece</h2>
          <button className="modal-x" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className={`drop${dragging ? " on" : ""}`} onClick={() => ref.current.click()} onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={onDrop}>
            {image ? <img src={image} alt="" /> : <><div className="drop-dot" /><p className="drop-txt">Drop photo here</p><p className="drop-hint">or click to browse</p></>}
            <input ref={ref} type="file" accept="image/*" style={{ display: "none" }} onChange={e => readFile(e.target.files[0])} />
          </div>
          <div><label className="lbl">Item Name</label><input className="inp" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Linen trousers" /></div>
          <div><label className="lbl">Category</label><select className="inp sel" value={category} onChange={e => setCategory(e.target.value)}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
          <div><label className="lbl">Tags (comma separated)</label><input className="inp" value={tags} onChange={e => setTags(e.target.value)} placeholder="e.g. casual, beige, oversized" /></div>
          <button className="btn-submit" disabled={!image || !name.trim()} onClick={() => { onAdd({ id: Date.now(), image, name: name.trim(), category, tags: tags.split(",").map(t => t.trim()).filter(Boolean), createdAt: Date.now() }); onClose(); }}>Add to Wardrobe</button>
        </div>
      </div>
    </div>
  );
}

function ItemCard({ item, onDelete }) {
  return (
    <div className="card">
      <div className="card-wrap">
        <img className="card-img" src={item.image} alt={item.name} />
        <span className="card-badge">{item.category}</span>
        <button className="card-del" onClick={() => onDelete(item.id)}>✕</button>
      </div>
      <div className="card-info">
        <div className="card-name">{item.name}</div>
        {item.tags.length > 0 && <div className="card-tags">{item.tags.slice(0, 3).map(t => <span key={t} className="card-tag">{t}</span>)}</div>}
      </div>
    </div>
  );
}

function OutfitCard({ outfit, onDelete }) {
  const slots = outfit.items.filter(Boolean);
  return (
    <div className="look">
      <div className="look-photos">{[0, 1, 2].map(i => <div key={i} className="look-photo">{slots[i] && <img src={slots[i].image} alt="" />}</div>)}</div>
      <div className="look-body">
        <div className="look-name">{outfit.name}</div>
        <div className="look-cats">{slots.map(i => i.category).join(" · ")}</div>
        <div className="look-foot">
          <span className="look-date">{new Date(outfit.savedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
          <button className="look-del" onClick={() => onDelete(outfit.id)}>Remove</button>
        </div>
      </div>
    </div>
  );
}

function Generator({ items, onSave }) {
  const [outfit, setOutfit] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [saved, setSaved] = useState(false);
  const generate = () => {
    setSpinning(true); setSaved(false);
    setTimeout(() => {
      const slots = OUTFIT_SLOTS.map(cat => { const p = items.filter(i => i.category === cat); return p.length ? p[Math.floor(Math.random() * p.length)] : null; }).filter(Boolean);
      setOutfit(slots); setSpinning(false);
    }, 650);
  };
  return (
    <div className="gen">
      <div className="gen-top">
        <div className="gen-title">Today's<br />Look</div>
        <div className="gen-sub">Outfit Generator</div>
      </div>
      <div className="gen-body">
        {spinning ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "32px 0 28px" }}><div className="spinner" /></div>
        ) : outfit ? (
          <div className="outfit-grid">
            {outfit.map((it, i) => <div key={i} className="outfit-slot"><img src={it.image} alt={it.name} /><div className="slot-label">{it.category}</div></div>)}
          </div>
        ) : (
          <div className="outfit-grid">
            <div className="outfit-empty"><div className="empty-dot" /><span className="empty-dot-txt">Press Generate</span></div>
          </div>
        )}
        <button className="btn-gen" onClick={generate} disabled={items.length === 0}>{spinning ? "Styling…" : outfit ? "↻ Reshuffle" : "Generate Look"}</button>
        {outfit && !spinning && (
          <button className={`btn-save-look${saved ? " saved" : ""}`} onClick={() => {
            const n = outfit.map(i => i.name.split(" ")[0]).slice(0, 2).join(" & ") + " Look";
            onSave({ id: Date.now(), name: n, items: outfit, savedAt: Date.now() }); setSaved(true);
          }}>{saved ? "✓ Saved!" : "Save This Look"}</button>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("closet");
  const [items, setItems] = useState([]);
  const [outfits, setOutfits] = useState([]);
  const [modal, setModal] = useState(false);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => { (async () => { const [i, o] = await Promise.all([loadItems(), loadOutfits()]); setItems(i); setOutfits(o); setLoading(false); })(); }, []);
  const addItem = async (item) => { const n = [item, ...items]; setItems(n); await saveItems(n); };
  const delItem = async (id) => { const n = items.filter(i => i.id !== id); setItems(n); await saveItems(n); };
  const saveOutfit = async (o) => { const n = [o, ...outfits]; setOutfits(n); await saveOutfits(n); };
  const delOutfit = async (id) => { const n = outfits.filter(o => o.id !== id); setOutfits(n); await saveOutfits(n); };
  const filtered = filter === "All" ? items : items.filter(i => i.category === filter);

  if (loading) return <div className="app" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}><div className="spinner" /></div>;

  return (
    <div className="app">
      {modal && <UploadModal onAdd={addItem} onClose={() => setModal(false)} />}

      <header className="header">
        <div className="logo">WARDROBE<span>Your Digital Closet</span></div>
        <div className="header-right">
          <span className="header-stats">{items.length} pieces · {outfits.length} looks</span>
          <button className="btn-add" onClick={() => setModal(true)}>+ Add Piece</button>
        </div>
      </header>

      <nav className="tabs">
        <button className={`tab${view === "closet" ? " active" : ""}`} onClick={() => setView("closet")}>Wardrobe</button>
        <button className={`tab${view === "outfits" ? " active" : ""}`} onClick={() => setView("outfits")}>Saved Looks</button>
      </nav>

      <div className="main">
        {view === "closet" && (
          <div className="layout">
            <div className="sidebar">
              <Generator items={items} onSave={saveOutfit} />
              <div>
                <p className="filter-lbl">Filter by Category</p>
                <div className="pills">
                  {["All", ...CATEGORIES].map(c => (
                    <button key={c} className={`pill${filter === c ? " active" : ""}`} onClick={() => setFilter(c)}>{c}</button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              {filtered.length === 0 ? (
                <div className="empty">
                  <div className="empty-blob" />
                  <h2 className="empty-h">{items.length === 0 ? "Your Wardrobe Awaits" : "Nothing Here"}</h2>
                  <p className="empty-p">{items.length === 0 ? "Upload your first clothing piece to begin." : "Try a different category."}</p>
                  {items.length === 0 && <button className="btn-cta" onClick={() => setModal(true)}>+ Add First Piece</button>}
                </div>
              ) : (
                <div className="clothes-grid">
                  {filtered.map(item => <ItemCard key={item.id} item={item} onDelete={delItem} />)}
                </div>
              )}
            </div>
          </div>
        )}
        {view === "outfits" && (
          outfits.length === 0 ? (
            <div className="empty">
              <div className="empty-blob" />
              <h2 className="empty-h">No Saved Looks</h2>
              <p className="empty-p">Generate an outfit and save it here.</p>
              <button className="btn-cta" onClick={() => setView("closet")}>Go to Wardrobe</button>
            </div>
          ) : (
            <div className="looks-grid">
              {outfits.map(o => <OutfitCard key={o.id} outfit={o} onDelete={delOutfit} />)}
            </div>
          )
        )}
      </div>
    </div>
  );
}