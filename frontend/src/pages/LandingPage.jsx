// src/pages/LandingPage.jsx
import { C, FONTS } from "../styles/tokens";
import { Glass } from "../components/ui/Atoms";

const FEATURES = [
  { icon:"◈", title:"Expense Manager",  desc:"Visual charts, AI insights, instant add/edit/delete for every transaction.",         color:C.violet,  tag:"Smart tracking" },
  { icon:"✦", title:"Daily Journal",    desc:"Mood tracking, streaks, weekly AI summaries of your emotional patterns.",            color:C.yellow,  tag:"Mood aware"     },
  { icon:"◇", title:"Smart Notes",      desc:"Tags, folders, rich text and one-click AI summarization for any note.",             color:C.blue,    tag:"AI powered"     },
  { icon:"◎", title:"Task Planner",     desc:"Priority badges, grouped by Today/Tomorrow/Upcoming. Never miss a task.",           color:C.red,     tag:"Stay focused"   },
  { icon:"⟡", title:"AI Assistant",     desc:"Knows all your data. Gives contextual advice, summaries and personalised plans.",   color:"#c4b5fd", tag:"Always ready"   },
];

const TESTIMONIALS = [
  { name:"Priya S.",   role:"B.Tech · Delhi",      text:"Lumina changed how I manage hostel expenses. The AI insights are actually useful!", a:"P", c:C.violet },
  { name:"Rahul M.",   role:"MBA · Mumbai",         text:"Journal streak keeps me writing every day. Mood tracking is surprisingly helpful.", a:"R", c:C.blue   },
  { name:"Ananya K.",  role:"CA Student · Pune",    text:"Notes + tasks in one app with AI summaries. My exam prep is way better now.",       a:"A", c:C.yellow },
  { name:"Dev T.",     role:"12th Grade · Jaipur",  text:"Budget tracker helped me save ₹800 last month. Finally an app for students!",       a:"D", c:C.green  },
];

export default function LandingPage({ onLogin, onSignup }) {
  return (
    <div style={{ minHeight: "100vh", background: C.bg, overflowX: "hidden" }}>

      {/* Ambient blobs */}
      <div style={{ position:"fixed", top:-200, left:-150, width:700, height:700, borderRadius:"50%", background:"radial-gradient(circle,rgba(124,58,237,.1) 0%,transparent 65%)", pointerEvents:"none", zIndex:0 }} />
      <div style={{ position:"fixed", bottom:-150, right:-100, width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle,rgba(14,165,233,.06) 0%,transparent 65%)", pointerEvents:"none", zIndex:0 }} />

      {/* ── NAVBAR ── */}
      <nav style={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"16px 48px", borderBottom:`1px solid ${C.glassBorder}`,
        position:"sticky", top:0, background:"rgba(7,9,15,.9)",
        backdropFilter:"blur(24px)", zIndex:100,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:34, height:34, borderRadius:10, background:`linear-gradient(135deg,${C.violet},${C.violetLight})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, boxShadow:"0 4px 16px rgba(124,58,237,.3)" }}>✦</div>
          <span style={{ fontFamily:FONTS.display, fontSize:20, color:C.text, fontWeight:700 }}>Lumina</span>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onLogin}  style={{ padding:"8px 20px", borderRadius:10, background:"transparent", border:`1px solid ${C.glassBorder}`, color:C.textMid, fontSize:13, fontWeight:500, cursor:"pointer" }}>Log In</button>
          <button onClick={onSignup} style={{ padding:"8px 22px", borderRadius:10, background:`linear-gradient(135deg,${C.violet},${C.violetLight})`, border:"none", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", boxShadow:"0 4px 20px rgba(124,58,237,.35)" }}>Get Started Free ✦</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"center", padding:"80px 80px 60px", maxWidth:1200, margin:"0 auto", position:"relative", zIndex:1 }}>
        <div>
          <div className="fu1" style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"6px 16px", borderRadius:20, background:"rgba(124,58,237,.15)", border:"1px solid rgba(124,58,237,.3)", marginBottom:24 }}>
            <span style={{ fontSize:10, color:"#c4b5fd", animation:"pulse 2s infinite" }}>●</span>
            <span style={{ fontSize:12, color:"#c4b5fd", fontWeight:500 }}>AI-Powered Productivity for Students</span>
          </div>

          <h1 className="fu2" style={{ fontFamily:FONTS.display, fontSize:"clamp(34px,4vw,58px)", color:C.text, fontWeight:700, lineHeight:1.12, marginBottom:22 }}>
            Your entire life,<br />
            <span style={{ background:`linear-gradient(135deg,${C.violet},${C.violetLight},#06b6d4)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              beautifully organized.
            </span>
          </h1>

          <p className="fu3" style={{ fontSize:16, color:C.textMid, lineHeight:1.78, marginBottom:36, maxWidth:480 }}>
            Lumina combines <strong style={{ color:C.text }}>expense tracking</strong>, <strong style={{ color:C.text }}>journaling</strong>, <strong style={{ color:C.text }}>notes</strong> and <strong style={{ color:C.text }}>tasks</strong> — all powered by an AI that understands your patterns and helps you grow.
          </p>

          <div className="fu4" style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:24 }}>
            <button className="hov-lift" onClick={onSignup} style={{ padding:"13px 32px", borderRadius:12, background:`linear-gradient(135deg,${C.violet},${C.violetLight})`, border:"none", color:"#fff", fontSize:15, fontWeight:700, boxShadow:"0 8px 32px rgba(124,58,237,.38)", cursor:"pointer", transition:"all .15s" }}>Start for Free →</button>
            <button onClick={onLogin}  style={{ padding:"13px 28px", borderRadius:12, background:C.glass, border:`1px solid ${C.glassBorder}`, color:C.textMid, fontSize:15, fontWeight:500, cursor:"pointer", backdropFilter:"blur(12px)" }}>I have an account</button>
          </div>

          <div className="fu5" style={{ display:"flex", gap:18, flexWrap:"wrap" }}>
            {["✓ Free forever plan","✓ No credit card","✓ Setup in 60 sec"].map((t,i)=>(
              <span key={i} style={{ fontSize:12, color:C.textDim }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Floating preview cards */}
        <div style={{ position:"relative", height:380, width:"100%" }}>
          <div style={{ position:"absolute", top:"35%", left:"50%", transform:"translate(-50%,-50%)", width:280, height:280, borderRadius:"50%", background:"radial-gradient(circle,rgba(124,58,237,.15) 0%,transparent 70%)", pointerEvents:"none" }}/>

          {/* Expense card */}
          <Glass className="fc1" style={{ position:"absolute", top:0, left:0, padding:"14px 18px", width:185, boxShadow:"0 16px 40px rgba(0,0,0,.4)" }}>
            <div style={{ fontSize:11, color:C.textDim, marginBottom:7 }}>This Month</div>
            <div style={{ fontSize:22, fontFamily:FONTS.display, color:C.text, fontWeight:700 }}>₹2,839</div>
            <div style={{ fontSize:11, color:C.textDim, marginTop:2 }}>Total Spent</div>
            <div style={{ marginTop:10, height:5, background:"rgba(255,255,255,.06)", borderRadius:4, overflow:"hidden" }}>
              <div style={{ width:"60%", height:"100%", background:`linear-gradient(90deg,${C.violet},${C.violetLight})`, borderRadius:4 }}/>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
              <span style={{ fontSize:10, color:C.textDim }}>60% of budget</span>
              <span style={{ fontSize:10, color:C.violet }}>₹5k</span>
            </div>
          </Glass>

          {/* Mood card */}
          <Glass className="fc2" style={{ position:"absolute", top:15, right:0, padding:"14px 18px", width:170, boxShadow:"0 16px 40px rgba(0,0,0,.4)" }}>
            <div style={{ fontSize:11, color:C.textDim, marginBottom:7 }}>Today's Mood</div>
            <div style={{ fontSize:30, textAlign:"center", margin:"4px 0" }}>😄</div>
            <div style={{ fontSize:12, color:"#c4b5fd", textAlign:"center", fontWeight:500 }}>Happy</div>
            <div style={{ display:"flex", justifyContent:"center", gap:5, marginTop:8 }}>
              {["😴","😟","😐","🙂","😄"].map((m,i)=><span key={i} style={{ fontSize:12, opacity:i===4?1:.35 }}>{m}</span>)}
            </div>
          </Glass>

          {/* Tasks card */}
          <Glass className="fc3" style={{ position:"absolute", bottom:30, left:15, padding:"14px 18px", width:198, boxShadow:"0 16px 40px rgba(0,0,0,.4)" }}>
            <div style={{ fontSize:11, color:C.textDim, marginBottom:9 }}>Today's Tasks</div>
            {[{t:"Submit DSA assignment",d:false},{t:"Read DBMS Chapter 7",d:true},{t:"Push to GitHub",d:false}].map((x,i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:7 }}>
                <div style={{ width:14, height:14, borderRadius:4, background:x.d?C.green:"transparent", border:x.d?"none":"1.5px solid rgba(255,255,255,.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, color:"#fff", flexShrink:0 }}>{x.d?"✓":""}</div>
                <span style={{ fontSize:11, color:x.d?C.textDim:C.text, textDecoration:x.d?"line-through":"none" }}>{x.t}</span>
              </div>
            ))}
          </Glass>

          {/* AI card */}
          <Glass className="fc1" style={{ position:"absolute", bottom:5, right:5, padding:"12px 16px", width:175, background:"rgba(124,58,237,.15)", border:"1px solid rgba(124,58,237,.35)", boxShadow:"0 16px 40px rgba(124,58,237,.2)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:7 }}>
              <div style={{ width:20, height:20, borderRadius:6, background:`linear-gradient(135deg,${C.violet},${C.violetLight})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11 }}>⟡</div>
              <span style={{ fontSize:11, color:"#c4b5fd", fontWeight:600 }}>AI Insight</span>
            </div>
            <div style={{ fontSize:11, color:C.textMid, lineHeight:1.5 }}>You spend 40% more on food this month. Want tips?</div>
          </Glass>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <div style={{ borderTop:`1px solid ${C.glassBorder}`, borderBottom:`1px solid ${C.glassBorder}`, background:"rgba(255,255,255,.01)", position:"relative", zIndex:1 }}>
        <div style={{ display:"flex", justifyContent:"center", flexWrap:"wrap", maxWidth:1000, margin:"0 auto" }}>
          {[["10,000+","Students using Lumina"],["5 modules","In one beautiful app"],["AI-powered","Insights & summaries"],["100% Free","No hidden charges"],["< 60 sec","To get started"]].map(([v,l],i)=>(
            <div key={i} style={{ padding:"22px 36px", textAlign:"center", borderRight:i<4?`1px solid ${C.glassBorder}`:"none" }}>
              <div style={{ fontFamily:FONTS.display, fontSize:22, color:C.violet, fontWeight:700 }}>{v}</div>
              <div style={{ fontSize:12, color:C.textDim, marginTop:3 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section style={{ padding:"72px 60px", maxWidth:1100, margin:"0 auto", position:"relative", zIndex:1 }}>
        <div style={{ textAlign:"center", marginBottom:52 }}>
          <div style={{ fontSize:11, color:"#c4b5fd", fontWeight:600, textTransform:"uppercase", letterSpacing:2, marginBottom:12 }}>Features</div>
          <h2 style={{ fontFamily:FONTS.display, fontSize:"clamp(26px,3vw,40px)", color:C.text, fontWeight:700 }}>Everything you need, nothing you don't</h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:16 }}>
          {FEATURES.map((f,i)=>(
            <Glass key={i} className="hov-card" style={{ padding:22, cursor:"default", transition:"all .25s", borderTop:`2px solid ${f.color}25` }}>
              <div style={{ width:40, height:40, borderRadius:11, background:f.color+"18", border:`1px solid ${f.color}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:19, color:f.color, marginBottom:13 }}>{f.icon}</div>
              <div style={{ display:"inline-block", fontSize:10, color:f.color, background:f.color+"15", padding:"2px 8px", borderRadius:20, marginBottom:8, fontWeight:600 }}>{f.tag}</div>
              <div style={{ fontFamily:FONTS.display, fontSize:14, color:C.text, fontWeight:600, marginBottom:7 }}>{f.title}</div>
              <div style={{ fontSize:12, color:C.textDim, lineHeight:1.65 }}>{f.desc}</div>
            </Glass>
          ))}
          <Glass style={{ padding:22, background:`linear-gradient(135deg,rgba(124,58,237,.18),rgba(168,85,247,.08))`, border:"1px solid rgba(124,58,237,.3)", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", textAlign:"center", gap:14 }}>
            <div style={{ fontSize:32 }}>✦</div>
            <div style={{ fontFamily:FONTS.display, fontSize:15, color:C.text }}>Ready to get organized?</div>
            <button onClick={onSignup} style={{ padding:"10px 24px", borderRadius:10, background:`linear-gradient(135deg,${C.violet},${C.violetLight})`, border:"none", color:"#fff", cursor:"pointer", fontSize:13, fontWeight:600 }}>Create Free Account</button>
          </Glass>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding:"60px 60px 72px", borderTop:`1px solid ${C.glassBorder}`, maxWidth:1100, margin:"0 auto", position:"relative", zIndex:1 }}>
        <div style={{ textAlign:"center", marginBottom:44 }}>
          <div style={{ fontSize:11, color:"#c4b5fd", fontWeight:600, textTransform:"uppercase", letterSpacing:2, marginBottom:12 }}>Testimonials</div>
          <h2 style={{ fontFamily:FONTS.display, fontSize:"clamp(24px,3vw,36px)", color:C.text, fontWeight:700 }}>Loved by students across India</h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:16 }}>
          {TESTIMONIALS.map((t,i)=>(
            <Glass key={i} className="hov-card" style={{ padding:22, transition:"all .2s" }}>
              <div style={{ display:"flex", gap:3, marginBottom:14 }}>{[...Array(5)].map((_,j)=><span key={j} style={{ color:C.yellow, fontSize:13 }}>★</span>)}</div>
              <div style={{ fontSize:13, color:C.textMid, lineHeight:1.75, marginBottom:18, fontStyle:"italic" }}>"{t.text}"</div>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:t.c+"28", border:`1px solid ${t.c}40`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, color:t.c, fontWeight:700 }}>{t.a}</div>
                <div>
                  <div style={{ fontSize:13, color:C.text, fontWeight:600 }}>{t.name}</div>
                  <div style={{ fontSize:11, color:C.textDim }}>{t.role}</div>
                </div>
              </div>
            </Glass>
          ))}
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section style={{ padding:"60px 60px 80px", borderTop:`1px solid ${C.glassBorder}`, textAlign:"center", position:"relative", zIndex:1 }}>
        <h2 style={{ fontFamily:FONTS.display, fontSize:32, color:C.text, fontWeight:700, marginBottom:14 }}>Start your journey today.</h2>
        <p style={{ color:C.textMid, fontSize:14, marginBottom:32 }}>Join 10,000+ students who use Lumina daily.</p>
        <button className="hov-lift" onClick={onSignup} style={{ padding:"14px 44px", borderRadius:12, background:`linear-gradient(135deg,${C.violet},${C.violetLight})`, border:"none", color:"#fff", fontSize:16, fontWeight:700, cursor:"pointer", boxShadow:"0 8px 32px rgba(124,58,237,.4)", transition:"all .15s" }}>
          Get Started — It's Free ✦
        </button>
        <p style={{ fontSize:11, color:C.textDim, marginTop:48 }}>© 2026 Lumina · Made with ✦ for students</p>
      </section>
    </div>
  );
}
