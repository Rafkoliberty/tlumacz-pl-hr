import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const translate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setOutput("");
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input })
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

  return (
    <div style={{ minHeight:"100vh", background:"#0e0e11", display:"flex", flexDirection:"column", alignItems:"center", padding:"40px 20px", fontFamily:"system-ui,sans-serif", color:"#f0ede8" }}>
      <div style={{ textAlign:"center", marginBottom:40 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, justifyContent:"center", marginBottom:14 }}>
          <span style={{ background:"#e63c3c", color:"#fff", fontSize:11, fontWeight:700, letterSpacing:"0.12em", padding:"3px 10px", borderRadius:4 }}>PL</span>
          <span style={{ color:"#6e6d78", fontSize:16 }}>→</span>
          <span style={{ background:"#2a2a32", color:"#6e6d78", fontSize:11, fontWeight:700, letterSpacing:"0.12em", padding:"3px 10px", borderRadius:4 }}>HR</span>
        </div>
        <h1 style={{ fontSize:40, fontWeight:800, letterSpacing:"-0.02em", margin:0 }}>
          Polski <span style={{ color:"#e63c3c" }}>→</span> Chorwacki
        </h1>
        <p style={{ marginTop:8, color:"#6e6d78", fontSize:14, fontStyle:"italic" }}>Powered by Claude AI</p>
      </div>

      <div style={{ width:"100%", maxWidth:820, background:"#16161a", border:"1px solid #2a2a32", borderRadius:16, overflow:"hidden" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1px 1fr" }}>
          <div style={{ padding:24, display:"flex", flexDirection:"column", minHeight:300 }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:"#6e6d78", marginBottom:12 }}>
              🔴 Polski
            </div>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key==="Enter" && (e.ctrlKey||e.metaKey)) translate(); }}
              placeholder="Wpisz tekst po polsku..."
              style={{ flex:1, background:"transparent", border:"none", outline:"none", color:"#f0ede8", fontSize:15, lineHeight:1.7, resize:"none", width:"100%", minHeight:260, fontFamily:"inherit" }}
            />
          </div>
          <div style={{ background:"#2a2a32", margin:"20px 0" }} />
          <div style={{ padding:24, display:"flex", flexDirection:"column", minHeight:300 }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:"#6e6d78", marginBottom:12 }}>
              🟢 Hrvatski
            </div>
            <div style={{ flex:1, fontSize:15, lineHeight:1.7, minHeight:260, whiteSpace:"pre-wrap", wordBreak:"break-word", color: output ? "#f0ede8" : "#6e6d78", fontStyle: output ? "normal" : "italic" }}>
              {loading ? "Tłumaczę..." : output || "Prijevod će se pojaviti ovdje..."}
            </div>
          </div>
        </div>
        <div style={{ borderTop:"1px solid #2a2a32", padding:"14px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
          <span style={{ fontSize:12, color:"#6e6d78" }}>{input.length} znaków</span>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={() => { setInput(""); setOutput(""); setError(""); }} style={{ cursor:"pointer", background:"transparent", border:"1px solid #2a2a32", color:"#6e6d78", borderRadius:8, padding:"9px 18px", fontSize:13, fontWeight:700 }}>Wyczyść</button>
            <button onClick={copy} disabled={!output} style={{ cursor: output?"pointer":"not-allowed", background:"transparent", border:`1px solid ${copied?"#3cce8e":"#2a2a32"}`, color: copied?"#3cce8e":"#6e6d78", borderRadius:8, padding:"9px 18px", fontSize:13, fontWeight:700 }}>
              {copied ? "Skopiowano ✓" : "Kopiuj"}
            </button>
            <button onClick={translate} disabled={!input.trim()||loading} style={{ cursor:(!input.trim()||loading)?"not-allowed":"pointer", background:(!input.trim()||loading)?"#2a2a32":"#e63c3c", color:(!input.trim()||loading)?"#6e6d78":"#fff", border:"none", borderRadius:8, padding:"9px 24px", fontSize:13, fontWeight:700 }}>
              {loading ? "Tłumaczę..." : "Przetłumacz →"}
            </button>
          </d
