import React, { useMemo, useState, type ReactNode } from "react";
import ReactDOM from "react-dom/client";

const THEME = {
  // Pulled from QApilot logo dominant accent + a neutral scale to match the site vibe.
  accent: "#0070F0",
  accent2: "#00B3FF",
  bg: "#F7FAFF",
  surface: "#FFFFFF",
  surface2: "#F1F6FF",
  border: "#D9E5FF",
  text: "#0B1220",
  dim: "#44536A",
  muted: "#6B7280",
  warn: "#F59E0B",
  danger: "#EF4444",
};

type BarSegment = { label: string; value: number; color: string; textColor?: string };
type BarProps = { label: string; segments: BarSegment[]; total: number; note?: string };

function Bar({ label, segments, total, note }: BarProps) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span
          style={{
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
            fontSize: 12,
            color: THEME.dim,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
        {note && <span style={{ fontSize: 12, color: THEME.muted }}>{note}</span>}
      </div>
      <div
        style={{
          display: "flex",
          height: 36,
          borderRadius: 10,
          overflow: "hidden",
          background: THEME.surface2,
          border: `1px solid ${THEME.border}`,
          boxShadow: "0 1px 0 rgba(11,18,32,0.04)",
        }}
      >
        {segments.map((s, i) => {
          const pct = total > 0 ? (s.value / total) * 100 : 0;
          return (
            <div
              key={i}
              style={{
                width: `${pct}%`,
                background: s.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontFamily:
                  "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                color: s.textColor || "#FFFFFF",
                fontWeight: 700,
                transition: "width 0.5s ease",
                minWidth: s.value > 0 ? 2 : 0,
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {pct > 10 ? s.label : ""}
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 14, marginTop: 10, flexWrap: "wrap" }}>
        {segments
          .filter((s) => s.value > 0)
          .map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: s.color }} />
              <span style={{ fontSize: 12, color: THEME.dim }}>
                {s.label}:{" "}
                <span style={{ color: THEME.text, fontWeight: 600 }}>
                  {Math.round((s.value / total) * 100)}%
                </span>
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}

type PillProps = { color: string; children: ReactNode };
function Pill({ color, children }: PillProps) {
  return (
    <span
      style={{
        display: "inline-block",
        background: `${color}14`,
        border: `1px solid ${color}33`,
        color,
        borderRadius: 999,
        padding: "4px 10px",
        fontSize: 12,
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
        fontWeight: 700,
      }}
    >
      {children}
    </span>
  );
}

type FormulaRowProps = { label: string; op: string; value: string; color?: string; bold?: boolean };
function FormulaRow({ label, op, value, color, bold }: FormulaRowProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 14px",
        background: bold ? THEME.surface2 : "transparent",
        borderRadius: 10,
        border: bold ? `1px solid ${THEME.border}` : "1px solid transparent",
        marginTop: bold ? 6 : 0,
      }}
    >
      <span style={{ width: 14, color: THEME.muted, fontSize: 14 }}>{op}</span>
      <span style={{ flex: 1, fontSize: 13, color: bold ? THEME.text : THEME.dim }}>{label}</span>
      <span
        style={{
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
          fontSize: 13,
          color: color || THEME.text,
          fontWeight: bold ? 800 : 500,
        }}
      >
        {value}
      </span>
    </div>
  );
}

function App() {
  const [accuracy, setAccuracy] = useState(70);
  const [verifyRatio, setVerifyRatio] = useState(30);

  const N = 100;
  const manualEffort = N;

  const genEffort = 5;
  const verifyEffort = (verifyRatio / 100) * N;
  const wrongCases = N * (1 - accuracy / 100);
  const rerecordEffort = wrongCases * 1;
  const aiTotal = genEffort + verifyEffort + rerecordEffort;

  const savings = manualEffort - aiTotal;
  const savingsPct = Math.round((savings / manualEffort) * 100);
  const naiveSavings = accuracy;

  const maxBar = Math.max(manualEffort, aiTotal, 10);

  const gradient = useMemo(
    () => `linear-gradient(135deg, ${THEME.accent} 0%, ${THEME.accent2} 50%, ${THEME.accent} 100%)`,
    [],
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: THEME.bg,
        fontFamily:
          "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'",
        color: THEME.text,
        padding: "44px 18px",
      }}
    >
      <style>{`
        input[type=range] { accent-color: ${THEME.accent}; }
        * { box-sizing: border-box; }
        a { color: inherit; }
      `}</style>

      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div style={{ marginBottom: 34 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 12px",
              borderRadius: 999,
              background: THEME.surface,
              border: `1px solid ${THEME.border}`,
              boxShadow: "0 8px 30px rgba(0,112,240,0.08)",
              marginBottom: 16,
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: gradient,
                boxShadow: "0 0 0 3px rgba(0,112,240,0.14)",
              }}
            />
            <span style={{ fontSize: 12, color: THEME.dim, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              QApilot · Effort Model
            </span>
          </div>

          <h1 style={{ fontSize: 34, fontWeight: 850, margin: 0, lineHeight: 1.08, letterSpacing: "-0.02em" }}>
            AI doesn’t just save effort—
            <br />
            <span style={{ backgroundImage: gradient, WebkitBackgroundClip: "text", color: "transparent" }}>
              it trades one type for another.
            </span>
          </h1>
          <p style={{ color: THEME.dim, marginTop: 14, fontSize: 15.5, lineHeight: 1.65, maxWidth: 620 }}>
            AI test generation eliminates <em>writing</em> effort, but introduces <em>verification</em> effort and{" "}
            <em>re-recording</em> effort for incorrect cases. Real savings depend on accuracy.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
          {[
            { label: "Manual workflow", steps: ["Write test case", "Record / script it"], tone: "warn" as const, note: "Effort is predictable but high" },
            { label: "AI-assisted workflow", steps: ["AI generates", "✓ Verify all cases", "✗ Re-record wrong ones"], tone: "accent" as const, note: "Effort depends on AI accuracy" },
          ].map((w, i) => {
            const color = w.tone === "accent" ? THEME.accent : THEME.warn;
            return (
              <div
                key={i}
                style={{
                  background: THEME.surface,
                  border: `1px solid ${THEME.border}`,
                  borderRadius: 16,
                  padding: "18px 18px",
                  boxShadow: "0 16px 60px rgba(11,18,32,0.06)",
                }}
              >
                <div style={{ fontSize: 12, color, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12, fontWeight: 800 }}>
                  {w.label}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {w.steps.map((s, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 999,
                          background: `${color}18`,
                          border: `1px solid ${color}30`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          color,
                          fontWeight: 900,
                          flexShrink: 0,
                        }}
                      >
                        {j + 1}
                      </div>
                      <span style={{ fontSize: 13, color: THEME.dim }}>{s}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 14, fontSize: 12, color: THEME.muted, borderTop: `1px solid ${THEME.border}`, paddingTop: 12 }}>
                  {w.note}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ background: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: 16, padding: "22px", marginBottom: 16, boxShadow: "0 16px 60px rgba(11,18,32,0.06)" }}>
          <div style={{ fontSize: 12, color: THEME.muted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 18 }}>
            Adjust parameters
          </div>

          <div style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <label style={{ fontSize: 13, color: THEME.dim }}>AI accuracy (% of test cases correct)</label>
              <Pill color={THEME.accent}>{accuracy}%</Pill>
            </div>
            <input type="range" min={10} max={99} value={accuracy} onChange={(e) => setAccuracy(+e.target.value)} style={{ width: "100%" }} />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <label style={{ fontSize: 13, color: THEME.dim }}>Verification cost (% of manual effort per case)</label>
              <Pill color={THEME.warn}>{verifyRatio}%</Pill>
            </div>
            <input type="range" min={10} max={80} value={verifyRatio} onChange={(e) => setVerifyRatio(+e.target.value)} style={{ width: "100%" }} />
            <div style={{ fontSize: 12, color: THEME.muted, marginTop: 6 }}>
              How long does reviewing one AI-generated test take vs writing it manually?
            </div>
          </div>
        </div>

        <div style={{ background: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: 16, padding: "22px", marginBottom: 16, boxShadow: "0 16px 60px rgba(11,18,32,0.06)" }}>
          <div style={{ fontSize: 12, color: THEME.muted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 18 }}>
            Effort breakdown (per 100 test cases)
          </div>

          <Bar
            label="Manual"
            note="baseline"
            total={maxBar}
            segments={[{ label: "Write + record all cases", value: manualEffort, color: THEME.warn, textColor: "#1B1405" }]}
          />

          <Bar
            label="AI-assisted"
            note={`actual total: ${Math.round(aiTotal)} units`}
            total={maxBar}
            segments={[
              { label: "AI gen overhead", value: genEffort, color: THEME.accent },
              { label: "Verify all cases", value: verifyEffort, color: THEME.warn, textColor: "#1B1405" },
              { label: "Re-record wrong cases", value: rerecordEffort, color: THEME.danger },
            ]}
          />
        </div>

        <div style={{ background: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: 16, padding: "22px", marginBottom: 16, boxShadow: "0 16px 60px rgba(11,18,32,0.06)" }}>
          <div style={{ fontSize: 12, color: THEME.muted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
            The real savings formula
          </div>

          <FormulaRow label="Manual effort (baseline)" op="" value={`${manualEffort} units`} />
          <FormulaRow label="AI gen overhead (~5% of baseline)" op="−" value={`${genEffort} units`} color={THEME.accent} />
          <FormulaRow label={`Verify all ${N} cases (${verifyRatio}% cost each)`} op="−" value={`${Math.round(verifyEffort)} units`} color={THEME.warn} />
          <FormulaRow label={`Re-record ${Math.round(wrongCases)} wrong cases (100% cost each)`} op="−" value={`${Math.round(rerecordEffort)} units`} color={THEME.danger} />
          <FormulaRow
            label="Actual time saved"
            op="="
            value={`${Math.max(0, Math.round(savings))} units (${Math.max(0, savingsPct)}%)`}
            color={savings > 0 ? THEME.accent : THEME.danger}
            bold
          />
        </div>

        <div
          style={{
            background: "linear-gradient(180deg, rgba(0,112,240,0.10), rgba(0,179,255,0.06))",
            border: `1px solid ${THEME.border}`,
            borderRadius: 16,
            padding: "20px 22px",
            marginBottom: 10,
            boxShadow: "0 16px 60px rgba(0,112,240,0.10)",
          }}
        >
          <div style={{ fontSize: 12, color: THEME.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12, fontWeight: 900 }}>
            Key insight
          </div>
          <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 30, fontWeight: 900, color: THEME.warn }}>{naiveSavings}%</div>
              <div style={{ fontSize: 12.5, color: THEME.muted, marginTop: 4 }}>
                Naïve savings estimate
                <br />
                ("AI got {accuracy}% right")
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", fontSize: 22, color: THEME.muted }}>→</div>
            <div>
              <div style={{ fontSize: 30, fontWeight: 950, color: savings > 0 ? THEME.accent : THEME.danger }}>
                {Math.max(0, savingsPct)}%
              </div>
              <div style={{ fontSize: 12.5, color: THEME.muted, marginTop: 4 }}>
                Actual savings after
                <br />
                verification + re-recording
              </div>
            </div>
          </div>
          <div style={{ marginTop: 14, fontSize: 13.5, color: THEME.dim, lineHeight: 1.65, borderTop: `1px solid ${THEME.border}`, paddingTop: 12 }}>
            The gap between these two numbers is the <strong style={{ color: THEME.text }}>hidden verification tax</strong> — and it grows as AI accuracy drops or verification takes longer.
            {savings <= 0 && (
              <span style={{ color: THEME.danger }}>
                {" "}
                At these settings, AI-assisted QA is actually <strong>slower</strong> than manual. The break-even requires either higher accuracy or faster verification.
              </span>
            )}
          </div>
        </div>

        <div style={{ fontSize: 12, color: THEME.muted, textAlign: "center", padding: "14px 0" }}>
          QApilot.io · Effort model for AI-generated test cases
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

