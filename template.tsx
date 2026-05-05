import { useState, type ReactNode } from "react";

const COLORS = {
  bg: "#0f0f11",
  surface: "#17171c",
  border: "#2a2a35",
  accent: "#6ee7b7",
  warn: "#f59e0b",
  danger: "#f87171",
  muted: "#6b7280",
  text: "#e5e7eb",
  dim: "#9ca3af",
};

type BarSegment = { label: string; value: number; color: string };

type BarProps = {
  label: string;
  segments: BarSegment[];
  total: number;
  note?: string;
};

function Bar({ label, segments, total, note }: BarProps) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: COLORS.dim, letterSpacing: "0.05em" }}>{label}</span>
        {note && <span style={{ fontSize: 12, color: COLORS.muted }}>{note}</span>}
      </div>
      <div style={{ display: "flex", height: 36, borderRadius: 6, overflow: "hidden", background: "#1e1e28" }}>
        {segments.map((s, i) => (
          <div
            key={i}
            style={{
              width: `${(s.value / total) * 100}%`,
              background: s.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontFamily: "'DM Mono', monospace",
              color: "#000",
              fontWeight: 700,
              transition: "width 0.5s ease",
              minWidth: s.value > 0 ? 2 : 0,
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {(s.value / total) * 100 > 8 ? s.label : ""}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap" }}>
        {segments.filter(s => s.value > 0).map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} />
            <span style={{ fontSize: 11, color: COLORS.dim }}>{s.label}: <span style={{ color: COLORS.text }}>{Math.round((s.value / total) * 100)}%</span></span>
          </div>
        ))}
      </div>
    </div>
  );
}

type PillProps = { color: string; children: ReactNode };

function Pill({ color, children }: PillProps) {
  return (
    <span style={{
      display: "inline-block",
      background: color + "22",
      border: `1px solid ${color}55`,
      color: color,
      borderRadius: 4,
      padding: "2px 8px",
      fontSize: 12,
      fontFamily: "'DM Mono', monospace",
      fontWeight: 600,
    }}>{children}</span>
  );
}

type FormulaRowProps = {
  label: string;
  op: string;
  value: string;
  color?: string;
  bold?: boolean;
};

function FormulaRow({ label, op, value, color, bold }: FormulaRowProps) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "10px 16px",
      background: bold ? "#1e1e28" : "transparent",
      borderRadius: 6,
      borderTop: bold ? `1px solid ${COLORS.border}` : "none",
      marginTop: bold ? 4 : 0,
    }}>
      <span style={{ width: 14, color: COLORS.muted, fontSize: 14 }}>{op}</span>
      <span style={{ flex: 1, fontSize: 13, color: bold ? COLORS.text : COLORS.dim }}>{label}</span>
      <span style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 13,
        color: color || COLORS.text,
        fontWeight: bold ? 700 : 400,
      }}>{value}</span>
    </div>
  );
}

export default function App() {
  const [accuracy, setAccuracy] = useState(70);
  const [verifyRatio, setVerifyRatio] = useState(30); // % of manual gen effort per case to verify

  const N = 100; // normalize to 100 test cases
  const manualEffort = N; // 1 unit per test case = 100 total

  // AI workflow
  const genEffort = 5; // AI generates almost free, ~5% overhead (prompting, setup)
  const verifyEffort = (verifyRatio / 100) * N; // verify all N cases
  const wrongCases = N * (1 - accuracy / 100);
  const rerecordEffort = wrongCases * 1; // re-recording a wrong case = same as manual
  const aiTotal = genEffort + verifyEffort + rerecordEffort;

  const savings = manualEffort - aiTotal;
  const savingsPct = Math.round((savings / manualEffort) * 100);
  const naiveSavings = accuracy; // naive: "AI got X% right = X% savings"

  const maxBar = Math.max(manualEffort, aiTotal, 10);

  return (
    <div style={{
      minHeight: "100vh",
      background: COLORS.bg,
      fontFamily: "'DM Sans', sans-serif",
      color: COLORS.text,
      padding: "40px 24px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');
        input[type=range] { accent-color: #6ee7b7; }
        * { box-sizing: border-box; }
      `}</style>

      <div style={{ maxWidth: 680, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.15em", color: COLORS.muted, textTransform: "uppercase", marginBottom: 10 }}>
            QApilot · Effort Model
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, margin: 0, lineHeight: 1.1 }}>
            AI doesn't just save effort —<br />
            <span style={{ color: COLORS.accent }}>it trades one type for another.</span>
          </h1>
          <p style={{ color: COLORS.dim, marginTop: 14, fontSize: 15, lineHeight: 1.6, maxWidth: 520 }}>
            AI test generation eliminates <em>writing</em> effort, but introduces <em>verification</em> effort and <em>re-recording</em> effort for incorrect cases. Real savings depend on accuracy.
          </p>
        </div>

        {/* Workflows side-by-side concept */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 40 }}>
          {[
            {
              label: "Manual workflow",
              steps: ["Write test case", "Record / script it"],
              color: COLORS.warn,
              note: "Effort is predictable but high"
            },
            {
              label: "AI-assisted workflow",
              steps: ["AI generates", "✓ Verify all cases", "✗ Re-record wrong ones"],
              color: COLORS.accent,
              note: "Effort depends on AI accuracy"
            }
          ].map((w, i) => (
            <div key={i} style={{
              background: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 10,
              padding: "18px 20px",
            }}>
              <div style={{ fontSize: 11, color: w.color, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12, fontWeight: 600 }}>
                {w.label}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {w.steps.map((s, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: w.color + "22", border: `1px solid ${w.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: w.color, fontWeight: 700, flexShrink: 0 }}>
                      {j + 1}
                    </div>
                    <span style={{ fontSize: 13, color: COLORS.dim }}>{s}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 14, fontSize: 11, color: COLORS.muted, borderTop: `1px solid ${COLORS.border}`, paddingTop: 10 }}>
                {w.note}
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "24px", marginBottom: 32 }}>
          <div style={{ fontSize: 12, color: COLORS.muted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20 }}>
            Adjust parameters
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <label style={{ fontSize: 13, color: COLORS.dim }}>AI accuracy (% of test cases correct)</label>
              <Pill color={COLORS.accent}>{accuracy}%</Pill>
            </div>
            <input type="range" min={10} max={99} value={accuracy} onChange={e => setAccuracy(+e.target.value)} style={{ width: "100%" }} />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <label style={{ fontSize: 13, color: COLORS.dim }}>Verification cost (% of manual effort per case)</label>
              <Pill color={COLORS.warn}>{verifyRatio}%</Pill>
            </div>
            <input type="range" min={10} max={80} value={verifyRatio} onChange={e => setVerifyRatio(+e.target.value)} style={{ width: "100%" }} />
            <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 4 }}>
              How long does reviewing one AI-generated test take vs writing it manually?
            </div>
          </div>
        </div>

        {/* Effort Bars */}
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "24px", marginBottom: 32 }}>
          <div style={{ fontSize: 12, color: COLORS.muted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 24 }}>
            Effort breakdown (per 100 test cases)
          </div>

          <Bar
            label="MANUAL"
            note="baseline"
            total={maxBar}
            segments={[
              { label: "Write + record all cases", value: manualEffort, color: COLORS.warn }
            ]}
          />

          <Bar
            label="AI-ASSISTED"
            note={`actual total: ${Math.round(aiTotal)} units`}
            total={maxBar}
            segments={[
              { label: "AI gen overhead", value: genEffort, color: "#818cf8" },
              { label: "Verify all cases", value: verifyEffort, color: COLORS.warn },
              { label: "Re-record wrong cases", value: rerecordEffort, color: COLORS.danger },
            ]}
          />
        </div>

        {/* Formula breakdown */}
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "24px", marginBottom: 32 }}>
          <div style={{ fontSize: 12, color: COLORS.muted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>
            The real savings formula
          </div>

          <FormulaRow label="Manual effort (baseline)" op="" value={`${manualEffort} units`} />
          <FormulaRow label={`AI gen overhead (~5% of baseline)`} op="−" value={`${genEffort} units`} color="#818cf8" />
          <FormulaRow label={`Verify all ${N} cases (${verifyRatio}% cost each)`} op="−" value={`${Math.round(verifyEffort)} units`} color={COLORS.warn} />
          <FormulaRow label={`Re-record ${Math.round(wrongCases)} wrong cases (100% cost each)`} op="−" value={`${Math.round(rerecordEffort)} units`} color={COLORS.danger} />
          <FormulaRow
            label="Actual time saved"
            op="="
            value={`${Math.max(0, Math.round(savings))} units (${Math.max(0, savingsPct)}%)`}
            color={savings > 0 ? COLORS.accent : COLORS.danger}
            bold
          />
        </div>

        {/* The key insight */}
        <div style={{
          background: "#0d1f17",
          border: `1px solid ${COLORS.accent}33`,
          borderRadius: 10,
          padding: "22px 24px",
          marginBottom: 24,
        }}>
          <div style={{ fontSize: 12, color: COLORS.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
            Key insight
          </div>
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 28, fontFamily: "'Syne', sans-serif", fontWeight: 800, color: COLORS.warn }}>{naiveSavings}%</div>
              <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 4 }}>Naïve savings estimate<br />("AI got {accuracy}% right")</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", fontSize: 22, color: COLORS.muted }}>→</div>
            <div>
              <div style={{ fontSize: 28, fontFamily: "'Syne', sans-serif", fontWeight: 800, color: savings > 0 ? COLORS.accent : COLORS.danger }}>
                {Math.max(0, savingsPct)}%
              </div>
              <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 4 }}>Actual savings after<br />verification + re-recording</div>
            </div>
          </div>
          <div style={{ marginTop: 16, fontSize: 13, color: COLORS.dim, lineHeight: 1.6, borderTop: `1px solid ${COLORS.border}`, paddingTop: 14 }}>
            The gap between these two numbers is the <strong style={{ color: COLORS.text }}>hidden verification tax</strong> — and it grows as AI accuracy drops or verification takes longer.
            {savings <= 0 && (
              <span style={{ color: COLORS.danger }}> At these settings, AI-assisted QA is actually <strong>slower</strong> than manual. The break-even requires either higher accuracy or faster verification.</span>
            )}
          </div>
        </div>

        <div style={{ fontSize: 12, color: COLORS.muted, textAlign: "center" }}>
          QApilot.io · Effort model for AI-generated test cases
        </div>
      </div>
    </div>
  );
}
