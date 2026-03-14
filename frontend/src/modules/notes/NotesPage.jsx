// src/modules/notes/NotesPage.jsx
import { useState } from "react";
import { C, FONTS } from "../../styles/tokens";
import { Glass, Btn, Badge, FInput, FTextarea, FSelect } from "../../components/ui/Atoms";
import { Modal, ViewModal } from "../../components/ui/Model";
import { NOTE_TAGS, NOTE_COLS } from "../../data/constants";
import { DEMO_NOTES } from "../../data/demo";
import { uid } from "../../utils/helpers";

export default function NotesPage({ toast }) {
  const [notes,  setNotes]  = useState(DEMO_NOTES);
  const [vm,     setVm]     = useState("grid");
  const [folder, setFolder] = useState("All");
  const [modal,  setModal]  = useState(null);
  const [form,   setForm]   = useState({ title:"", content:"", tag:"Study", color:NOTE_COLS[0] });

  const f = (k,v) => setForm(p=>({...p,[k]:v}));

  const openAdd  = () => { setForm({ title:"", content:"", tag:"Study", color:NOTE_COLS[0] }); setModal({t:"add"}); };
  const openEdit = (n) => { setForm({...n}); setModal({t:"edit",d:n}); };
  const openView = (n) => setModal({t:"view",d:n});

  const save = () => {
    if (!form.title) return;
    if (modal.t==="add") { setNotes(ns=>[{...form,id:uid(),updated:"Just now"},...ns]); toast("Note saved ✓"); }
    else { setNotes(ns=>ns.map(n=>n.id===modal.d.id?{...form,id:n.id,updated:"Just now"}:n)); toast("Updated ✓"); }
    setModal(null);
  };

  const del = (id) => { setNotes(ns=>ns.filter(n=>n.id!==id)); setModal(null); toast("Deleted"); };
  const filtered = folder==="All" ? notes : notes.filter(n=>n.tag===folder);

  return (
    <div style={{ display:"flex", gap:16 }}>
      {/* Folder sidebar */}
      <Glass style={{ width:140, flexShrink:0, padding:14, alignSelf:"flex-start" }}>
        <div style={{ fontSize:11, color:C.textDim, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>Folders</div>
        {["All",...NOTE_TAGS].map(fdr=>(
          <button key={fdr} onClick={()=>setFolder(fdr)} style={{ width:"100%", textAlign:"left", padding:"7px 10px", borderRadius:8, cursor:"pointer", fontSize:12, color:folder===fdr?"#c4b5fd":C.textDim, background:folder===fdr?"rgba(124,58,237,.15)":"transparent", border:"none", marginBottom:2, fontFamily:"'DM Sans',sans-serif" }}>{fdr}</button>
        ))}
      </Glass>

      {/* Main */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", gap:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <h2 style={{ fontFamily:FONTS.display, fontSize:22, color:C.text }}>
            Notes {folder!=="All"&&<span style={{ fontSize:14, color:C.textDim }}>/ {folder}</span>}
          </h2>
          <div style={{ display:"flex", gap:8 }}>
            {["grid","list"].map(v=><Btn key={v} variant={vm===v?"primary":"ghost"} small onClick={()=>setVm(v)}>{v==="grid"?"⊞ Grid":"☰ List"}</Btn>)}
            <Btn onClick={openAdd}>+ New Note</Btn>
          </div>
        </div>

        {filtered.length===0 && (
          <Glass style={{ padding:40, textAlign:"center" }}>
            <div style={{ fontSize:36, marginBottom:10 }}>◇</div>
            <div style={{ color:C.textDim }}>No notes here yet.</div>
            <div style={{ marginTop:14 }}><Btn onClick={openAdd}>+ New Note</Btn></div>
          </Glass>
        )}

        <div style={{ display:vm==="grid"?"grid":"flex", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", flexDirection:"column", gap:12 }}>
          {filtered.map(n=>(
            <Glass key={n.id} className="hov-card" onClick={()=>openView(n)} style={{ padding:16, cursor:"pointer", borderLeft:`3px solid ${n.color}`, transition:"all .2s" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                <Badge label={n.tag} color={n.color} /><span style={{ fontSize:10, color:C.textDim }}>{n.updated}</span>
              </div>
              <div style={{ fontSize:13, color:C.text, fontWeight:600, marginBottom:6 }}>{n.title}</div>
              <div style={{ fontSize:11, color:C.textDim, lineHeight:1.5, overflow:"hidden", display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical" }}>{n.content}</div>
              <div style={{ display:"flex", gap:6, marginTop:10 }}>
                <Btn variant="ai" small onClick={e=>e.stopPropagation()}>⟡ Summarize</Btn>
                <button onClick={e=>{e.stopPropagation();openEdit(n)}} style={{ padding:"4px 8px", borderRadius:7, background:"rgba(255,255,255,.05)", border:"none", color:C.textMid, cursor:"pointer", fontSize:12 }}>✏️</button>
                <button onClick={e=>{e.stopPropagation();del(n.id)}}  style={{ padding:"4px 8px", borderRadius:7, background:"rgba(239,68,68,.08)", border:"none", color:C.red, cursor:"pointer", fontSize:12 }}>🗑</button>
              </div>
            </Glass>
          ))}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {(modal?.t==="add"||modal?.t==="edit") && (
        <Modal title={modal.t==="add"?"New Note":"Edit Note"} onClose={()=>setModal(null)} wide>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <FInput label="Title" value={form.title} onChange={v=>f("title",v)} placeholder="Note title..." required />
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <FSelect label="Tag" value={form.tag} onChange={v=>f("tag",v)} options={NOTE_TAGS} />
              <div>
                <label style={{ fontSize:12, color:C.textMid, fontWeight:500, display:"block", marginBottom:5 }}>Color</label>
                <div style={{ display:"flex", gap:8 }}>
                  {NOTE_COLS.map(c=><button key={c} onClick={()=>f("color",c)} style={{ width:26, height:26, borderRadius:7, background:c, border:form.color===c?"3px solid #fff":"none", cursor:"pointer" }}/>)}
                </div>
              </div>
            </div>
            <FTextarea label="Content" value={form.content} onChange={v=>f("content",v)} placeholder="Write your note..." rows={8} />
            <div style={{ display:"flex", gap:10 }}>
              <Btn onClick={save} disabled={!form.title}>{modal.t==="add"?"Save Note":"Update Note"}</Btn>
              <Btn variant="ghost" onClick={()=>setModal(null)}>Cancel</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* View Modal */}
      {modal?.t==="view" && (
        <ViewModal title={modal.d.title} onClose={()=>setModal(null)} onEdit={()=>openEdit(modal.d)} onDelete={()=>del(modal.d.id)}>
          <div style={{ display:"flex", gap:8, marginBottom:14 }}><Badge label={modal.d.tag} color={modal.d.color}/><span style={{ fontSize:11, color:C.textDim }}>Updated {modal.d.updated}</span></div>
          <div style={{ fontSize:13, color:C.textMid, lineHeight:1.85, whiteSpace:"pre-wrap", marginBottom:16 }}>{modal.d.content}</div>
          <Btn variant="ai">⟡ AI Summarize</Btn>
        </ViewModal>
      )}
    </div>
  );
}
