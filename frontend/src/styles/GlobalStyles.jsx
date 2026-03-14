// src/styles/GlobalStyles.jsx
export default function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html, body, #root { height: 100%; }
      body { background: #07090f; font-family: 'DM Sans', sans-serif; color: #e2e8f0; }
      button, input, textarea, select { font-family: 'DM Sans', sans-serif; }

      ::-webkit-scrollbar { width: 3px; height: 3px; }
      ::-webkit-scrollbar-thumb { background: rgba(124,58,237,0.4); border-radius: 4px; }
      ::-webkit-scrollbar-track { background: transparent; }

      /* Animations */
      @keyframes fadeUp   { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
      @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
      @keyframes slideUp  { from { opacity:0; transform:translateY(28px) scale(.97); } to { opacity:1; transform:translateY(0) scale(1); } }
      @keyframes float    { 0%,100%{ transform:translateY(0); } 50%{ transform:translateY(-9px); } }
      @keyframes float2   { 0%,100%{ transform:translateY(0); } 50%{ transform:translateY(-12px); } }
      @keyframes pulse    { 0%,100%{ opacity:.7; } 50%{ opacity:1; } }
      @keyframes bounce   { 0%,60%,100%{ transform:translateY(0); } 30%{ transform:translateY(-5px); } }

      /* Utility classes */
      .fu1 { animation: fadeUp .6s ease .05s both; }
      .fu2 { animation: fadeUp .6s ease .18s both; }
      .fu3 { animation: fadeUp .6s ease .30s both; }
      .fu4 { animation: fadeUp .6s ease .42s both; }
      .fu5 { animation: fadeUp .6s ease .54s both; }
      .screen-in  { animation: fadeIn  .2s ease both; }
      .modal-in   { animation: slideUp .25s ease both; }
      .fc1 { animation: float  5s   ease-in-out        infinite; }
      .fc2 { animation: float2 6s   ease-in-out 1s     infinite; }
      .fc3 { animation: float  4.5s ease-in-out 0.5s   infinite; }

      .hov-card { transition: all .2s ease; }
      .hov-card:hover { transform: translateY(-2px); border-color: rgba(124,58,237,.45) !important; }
      .hov-lift:hover { transform: translateY(-3px); box-shadow: 0 16px 40px rgba(124,58,237,.3) !important; }
      .hov-nav:hover  { background: rgba(124,58,237,.1) !important; color: #c4b5fd !important; }
    `}</style>
  );
}
