// src/modules/expenses/ExpensesPage.jsx
import { useState } from "react";
import { C, FONTS } from "../../styles/tokens";
import { Glass, Btn, Badge, FInput, FSelect } from "../../components/ui/Atoms";
import { Modal, ViewModal } from "../../components/ui/Model";
import { BarChart, CategoryBars } from "../../components/charts/Charts";
import { CAT_CFG } from "../../data/constants";
import { DEMO_EXPENSES } from "../../data/demo";
import { uid, fmtDate } from "../../utils/helpers";

const CATS = ["All","Food","Travel","Study","Health","Entertainment","Income"];

export default function ExpensesPage({ toast }) {
  const [expenses, setExpenses] = useState(DEMO_EXPENSES);
  const [filter,   setFilter]   = useState("All");
  const [modal,    setModal]    = useState(null); // null | {t:"add"|"edit"|"view", d?}
  const [form,     setForm]     = useState({ name:"", cat:"Food", amount:"", date:today(), note:"", type:"expense" });

  function today() { return new Date().toISOString().slice(0,10); }
  const f = (k,v) => setForm(prev => ({ ...prev, [k]: v }));

  const total  = expenses.filter(e=>e.amount<0).reduce((s,e)=>s+Math.abs(e.amount),0);
  const income = expenses.filter(e=>e.amount>0).reduce((s,e)=>s+e.amount,0);
  const filtered = filter==="All" ? expenses : expenses.filter(e=>e.cat===filter);

  const openAdd  = () => { setForm({ name:"", cat:"Food", amount:"", date:today(), note:"", type:"expense" }); setModal({t:"add"}); };
  const openEdit = (e) => { setForm({ ...e, amount:Math.abs(e.amount), type:e.amount>0?"income":"expense" }); setModal({t:"edit",d:e}); };
  const openView = (e) => setModal({t:"view",d:e});

  const save = () => {
    if (!form.name || !form.amount) return;
    const amt  = form.type==="income" ? +Math.abs(form.amount) : -Math.abs(+form.amount);
    const icon = CAT_CFG[form.cat]?.icon || "📦";
    if (modal.t==="add") { setExpenses(es=>[{...form,id:uid(),amount:amt,icon},...es]); toast("Expense added ✓"); }
    else { setExpenses(es=>es.map(x=>x.id===modal.d.id?{...form,id:x.id,amount:amt,icon}:x)); toast("Updated ✓"); }
    setModal(null);
  };

  const del = (id) => { setExpenses(es=>es.filter(x=>x.id!==id)); setModal(null); toast("Deleted"); };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:18 }}>

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <h2 style={{ fontFamily:FONTS.display, fontSize:22, color:C.text }}>Expense Manager</h2>
        <Btn onClick={openAdd}>+ Add Expense</Btn>
      </div>

      {/* Summary row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
        {[
          { l:"Total Spent", v:`₹${total.toLocaleString()}`,          c:C.red   },
          { l:"Income",      v:`₹${income.toLocaleString()}`,         c:C.green },
          { l:"Balance",     v:`₹${(income-total).toLocaleString()}`, c:income-total>=0?C.green:C.red },
        ].map((s,i) => (
          <Glass key={i} style={{ padding:16 }}>
            <div style={{ fontSize:11, color:C.textDim }}>{s.l}</div>
            <div style={{ fontSize:20, fontWeight:700, color:s.c, marginTop:4, fontFamily:FONTS.display }}>{s.v}</div>
          </Glass>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <Glass style={{ padding:18 }}>
          <div style={{ fontSize:12, color:C.textDim, marginBottom:12 }}>Monthly Spending</div>
          <BarChart currentTotal={total} />
        </Glass>
        <Glass style={{ padding:18 }}>
          <div style={{ fontSize:12, color:C.textDim, marginBottom:12 }}>By Category</div>
          <CategoryBars expenses={expenses} />
        </Glass>
      </div>

      {/* AI insight */}
      <Glass style={{ padding:16, background:"rgba(124,58,237,.1)", border:"1px solid rgba(124,58,237,.25)" }}>
        <div style={{ display:"flex", gap:10 }}>
          <span style={{ fontSize:20 }}>⟡</span>
          <div>
            <div style={{ fontSize:13, color:"#c4b5fd", fontWeight:600 }}>AI Insight</div>
            <div style={{ fontSize:12, color:C.textMid, marginTop:3 }}>
              You've spent ₹{total.toLocaleString()} this month. Food is your top category. Meal-prepping 3×/week could save ~₹400.
            </div>
            <div style={{ display:"flex", gap:8, marginTop:10, flexWrap:"wrap" }}>
              {["Get saving tips","Set budget","View trends"].map((x,i)=><Btn key={i} variant="ai" small>{x}</Btn>)}
            </div>
          </div>
        </div>
      </Glass>

      {/* Filter + list */}
      <Glass style={{ padding:18 }}>
        <div style={{ display:"flex", gap:6, marginBottom:14, flexWrap:"wrap" }}>
          {CATS.map(c => (
            <button key={c} onClick={()=>setFilter(c)} style={{ padding:"5px 13px", borderRadius:20, fontSize:12, cursor:"pointer", background:filter===c?C.violet:"rgba(255,255,255,.05)", border:filter===c?"none":`1px solid ${C.glassBorder}`, color:filter===c?"#fff":C.textMid, transition:"all .15s" }}>{c}</button>
          ))}
        </div>

        {filtered.length===0 && <div style={{ textAlign:"center", padding:30, color:C.textDim, fontSize:13 }}>No expenses found.</div>}

        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {filtered.map(e => (
            <div key={e.id} className="hov-card" onClick={()=>openView(e)} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", borderRadius:12, background:"rgba(255,255,255,.03)", border:`1px solid ${C.glassBorder}`, cursor:"pointer", transition:"all .2s" }}>
              <div style={{ width:38, height:38, borderRadius:10, background:(CAT_CFG[e.cat]?.color||C.textDim)+"22", border:`1px solid ${(CAT_CFG[e.cat]?.color||C.textDim)}40`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>
                {e.icon || CAT_CFG[e.cat]?.icon || "📦"}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, color:C.text, fontWeight:500 }}>{e.name}</div>
                <div style={{ fontSize:11, color:C.textDim }}>{e.cat} · {fmtDate(e.date)}{e.note?` · ${e.note}`:""}</div>
              </div>
              <div style={{ fontSize:15, fontWeight:700, color:e.amount>0?C.green:C.text, flexShrink:0 }}>
                {e.amount>0?"+":""}₹{Math.abs(e.amount).toLocaleString()}
              </div>
              <div style={{ display:"flex", gap:4 }}>
                <button onClick={ev=>{ev.stopPropagation();openEdit(e)}} style={{ padding:"4px 8px", borderRadius:7, background:"rgba(255,255,255,.05)", border:"none", color:C.textMid, cursor:"pointer", fontSize:12 }}>✏️</button>
                <button onClick={ev=>{ev.stopPropagation();del(e.id)}}   style={{ padding:"4px 8px", borderRadius:7, background:"rgba(239,68,68,.08)", border:"none", color:C.red, cursor:"pointer", fontSize:12 }}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      </Glass>

      {/* Add / Edit Modal */}
      {(modal?.t==="add"||modal?.t==="edit") && (
        <Modal title={modal.t==="add"?"Add Expense":"Edit Expense"} onClose={()=>setModal(null)}>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div style={{ display:"flex", gap:8 }}>
              {["expense","income"].map(tp=>(
                <button key={tp} onClick={()=>f("type",tp)} style={{ flex:1, padding:"8px", borderRadius:10, border:form.type===tp?"none":`1px solid ${C.glassBorder}`, background:form.type===tp?(tp==="income"?C.green:C.violet):"rgba(255,255,255,.04)", color:"#fff", cursor:"pointer", fontWeight:600, fontSize:13, textTransform:"capitalize" }}>{tp}</button>
              ))}
            </div>
            <FInput label="Name" value={form.name} onChange={v=>f("name",v)} placeholder="e.g. Zomato Order" required />
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <FInput label="Amount (₹)" type="number" value={form.amount} onChange={v=>f("amount",v)} placeholder="0" required />
              <FSelect label="Category" value={form.cat} onChange={v=>f("cat",v)} options={Object.keys(CAT_CFG).filter(k=>k!=="Income")} />
            </div>
            <FInput label="Date" type="date" value={form.date} onChange={v=>f("date",v)} />
            <FInput label="Note (optional)" value={form.note} onChange={v=>f("note",v)} placeholder="Any note..." />
            <div style={{ display:"flex", gap:10 }}>
              <Btn onClick={save} disabled={!form.name||!form.amount}>{modal.t==="add"?"Add Expense":"Save Changes"}</Btn>
              <Btn variant="ghost" onClick={()=>setModal(null)}>Cancel</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* View Modal */}
      {modal?.t==="view" && (
        <ViewModal title={modal.d.name} onClose={()=>setModal(null)} onEdit={()=>openEdit(modal.d)} onDelete={()=>del(modal.d.id)}>
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16 }}>
            <div style={{ width:52, height:52, borderRadius:14, background:(CAT_CFG[modal.d.cat]?.color||C.textDim)+"22", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28 }}>
              {modal.d.icon || CAT_CFG[modal.d.cat]?.icon}
            </div>
            <div>
              <div style={{ fontSize:26, fontWeight:700, color:modal.d.amount>0?C.green:C.text, fontFamily:FONTS.display }}>
                {modal.d.amount>0?"+":""}₹{Math.abs(modal.d.amount).toLocaleString()}
              </div>
              <div style={{ fontSize:12, color:C.textDim }}>{modal.d.cat} · {fmtDate(modal.d.date)}</div>
            </div>
          </div>
          {modal.d.note && <div style={{ padding:14, background:"rgba(255,255,255,.03)", borderRadius:10, fontSize:13, color:C.textMid }}>{modal.d.note}</div>}
        </ViewModal>
      )}
    </div>
  );
}
