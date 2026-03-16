
export default function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html, body, #root { height: 100%; }
      body { background: #07090f; font-family: 'DM Sans', sans-serif; color: #e2e8f0; }
      button, input, textarea, select { font-family: 'DM Sans', sans-serif; }

      ::-webkit-scrollbar { width: 3px; height: 3px; }
      ::-webkit-scrollbar-thumb { background: rgba(124,58,237,.4); border-radius: 4px; }
      ::-webkit-scrollbar-track { background: transparent; }

      @keyframes fadeUp   { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
      @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
      @keyframes slideUp  { from { opacity:0; transform:translateY(28px) scale(.97); } to { opacity:1; transform:translateY(0) scale(1); } }
      @keyframes bounce   { 0%,60%,100%{ transform:translateY(0); } 30%{ transform:translateY(-5px); } }

      .screen-in  { animation: fadeIn  .2s ease both; }
      .modal-in   { animation: slideUp .25s ease both; }
      .fu1 { animation: fadeUp .6s ease .05s both; }
      .fu2 { animation: fadeUp .6s ease .18s both; }
      .fu3 { animation: fadeUp .6s ease .30s both; }
      .fu4 { animation: fadeUp .6s ease .42s both; }

      .hov-card { transition: all .2s ease; }
      .hov-card:hover { transform: translateY(-2px); border-color: rgba(124,58,237,.45) !important; }
      .hov-nav:hover  { background: rgba(124,58,237,.1) !important; color: #c4b5fd !important; }
    `}</style>
  );
}
