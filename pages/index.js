import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [style, setStyle] = useState("neutral");
  const [direction, setDirection] = useState("pl-hr");

  const translate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setOutput("");
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input, style, direction })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Błąd");
      setOutput(data.translation);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleDirection = () => {
    setDirection(d => d === "pl-hr" ? "hr-pl" : "pl-hr");
    setInput(output);
    setOutput("");
  };

  const styles = [
    { id: "neutral", label: "⚖️ Neutralna" },
    { id: "formal", label: "📋 Firmowa" },
    { id: "casual", label: "💬 Luźna" }
  ];

  const isPlHr = direction === "pl-hr";

  return (
    <div style={{ minHeight:"100vh", background:"#0e0e11", display:"flex", flexDirection:"column", alignItems:"center", padding:"40px 20px", fontFamily:"system-ui,sans-serif", color:"#f0ede8" }}>
      <div style={{ textAlign:"center", marginBottom:32 }}>
        <h1 style={{ fontSize:40, fontWeight:800, letterSpacing:"-0.02em", margin:0 }}>
          Tłumacz <span style={{ color:"#e63c3c" }}>PL ↔ HR</span>
        </h1>
        <p style={{ marginTop:8, color:"#6e6d78", fontSize:14, fontStyle:"italic" }}>Powered by Claude AI</p>
      </div>

      {/* Kierunek */}
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
        <span style={{ background: isPlHr?"#e63c3c":"#2a2a32", color: isPlHr?"#fff":"#6e6d78", fontSize:13, fontWeight:700, letterSpacing:"0.1em", padding:"6px 14px", borderRadius:8 }}>
          {isPlHr ? "Polski" : "Hrvatski"}
        </span>
        <button
          onClick={toggleDirection}
          style={{ cursor:"pointer", background:"#2a2a32", border:"1px solid #3a3a42", color:"#f0ede8", borderRadius:8, padding:"6px 14px", fontSize:16, fontWeight:700 }}
          title="Zamień kierunek"
        >
          ⇄
        </button>
        <span style={{ background: isPlHr?"#2a2a32":"#e63c3c", color: isPlHr?"#6e6d78":"#fff", fontSize:13, fontWeight:700, letterSpacing:"0.1em", padding:"6px 14px", borderRadius:8 }}>
          {isPlHr ? "Hrvatski" : "Polski"}
        </span>
      </div>

      {/* Styl */}
      <div style={{ display:"flex", gap:8, marginBottom:20 }}>
        {styles.map(s => (
          <button
            key={s.id}
            onClick={() => setStyle(s.id)}
            style={{
              cursor:"pointer",
              background: style === s.id ? "#e63c3c" : "#16161a",
              color: style === s.id ? "#fff" : "#6e6d78",
              border: `1px solid ${style === s.id ? "#e63c3c" : "#2a2a32"}`,
              borderRadius:8,
              padding:"8px 16px",
              fontSize:13,
              fontWeight:700,
              transition:"all 0.2s"
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div style={{ width:"100%", maxWidth:820, background:"#16161a", border:"1px solid #2a2a32", borderRadius:16, overflow:"hidden" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1px 1fr" }}>
          <div style={{ padding:24, display:"flex", flexDirection:"column", minHeight:300 }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:"#6e6d78", marginBottom:12 }}>
              {isPlHr ? "🔴 Polski" : "🔵 Hrvatski"}
            </div>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key==="Enter" && (e.ctrlKey||e.metaKey)) translate(); }}
              placeholder={isPlHr ? "Wpisz tekst po polsku..." : "Unesite tekst na hrvatskom..."}
              style={{ flex:1, background:"transparent", border:"none", outline:"none", color:"#f0ede8", fontSize:15, lineHeight:1.7, resize:"none", width:"100%", minHeight:260, fontFamily:"inherit" }}
            />
          </div>
          <div style={{ background:"#2a2a32", margin:"20px 0" }} />
          <div style={{ padding:24, display:"flex", flexDirection:"column", minHeight:300 }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:"#6e6d78", marginBottom:12 }}>
              {isPlHr ? "🟢 Hrvatski" : "🔴 Polski"}
            </div>
            <div style={{ flex:1, fontSize:15, lineHeight:1.7, minHeight:260, whiteSpace:"pre-wrap", wordBreak:"break-word", color: output ? "#f0ede8" : "#6e6d78", fontStyle: output ? "normal" : "italic" }}>
              {loading ? "Tłumaczę..." : output || (isPlHr ? "Prijevod će se pojaviti ovdje..." : "Tłumaczenie pojawi się tutaj...")}
            </div>
          </div>
        </div>
        <div style={{ borderTop:"1px solid #2a2a32", padding:"14px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
          <span style={{ fontSize:12, color:"#6e6d78" }}>{input.length} znaków · Ctrl+Enter = przetłumacz</span>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={() => { setInput(""); setOutput(""); setError(""); }} style={{ cursor:"pointer", background:"transparent", border:"1px solid #2a2a32", color:"#6e6d78", borderRadius:8, padding:"9px 18px", fontSize:13, fontWeight:700 }}>Wyczyść</button>
            <button onClick={copy} disabled={!output} style={{ cursor: output?"pointer":"not-allowed", background:"transparent", border:`1px solid ${copied?"#3cce8e":"#2a2a32"}`, color: copied?"#3cce8e":"#6e6d78", borderRadius:8, padding:"9px 18px", fontSize:13, fontWeight:700 }}>
              {copied ? "Skopiowano ✓" : "Kopiuj"}
            </button>
            <button onClick={translate} disabled={!input.trim()||loading} style={{ cursor:(!input.trim()||loading)?"not-allowed":"pointer", background:(!input.trim()||loading)?"#2a2a32":"#e63c3c", color:(!input.trim()||loading)?"#6e6d78":"#fff", border:"none", borderRadius:8, padding:"9px 24px", fontSize:13, fontWeight:700 }}>
              {loading ? "Tłumaczę..." : "Przetłumacz →"}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div style={{ marginTop:12, padding:"12px 16px", background:"rgba(230,60,60,0.08)", border:"1px solid rgba(230,60,60,0.25)", borderRadius:8, fontSize:13, color:"#ff7a7a", maxWidth:820, width:"100%" }}>
          Błąd: {error}
        </div>
      )}
    </div>
  );
}
