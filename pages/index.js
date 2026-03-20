import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [style, setStyle] = useState("neutral");

  const translate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setOutput("");
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input, style })
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

  const styles = [
    { id: "neutral", label: "⚖️ Neutralna" },
    { id: "formal", label: "📋 Firmowa" },
    { id: "casual", label: "💬 Luźna" }
  ];

  return (
    <div style={{ minHeight:"100vh", background:"#0e0e11", display:"flex", flexDirection:"column", alignItems:"center", padding:"40px 20px", fontFamily:"system-ui,sans-serif", color:"#f0ede8" }}>
      <div style={{ textAlign:"center", marginBottom:32 }}>
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

      {/* Wybór stylu */}
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
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", col
