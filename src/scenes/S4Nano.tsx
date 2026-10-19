import React from "react";
import { AbsoluteFill } from "remotion";
import { NanoCutaway, NanoDefs, nanoGeom, reflectPoints, shelfLen, tierY } from "../art/Nano";
import { Scale, ScaleDefs } from "../art/Scales";
import { Glow } from "../art/common";
import { Headline, Label, Leader } from "../components/ui";
import { TravelWave } from "../components/Wave";
import { fade, lerp, prog, rand } from "../lib/anim";
import { BEATS } from "../timeline";
import { C, FONT_BODY, Layout } from "../theme";

const norm = (x: number, y: number): [number, number] => {
  const l = Math.hypot(x, y);
  return [x / l, y / l];
};

export const S4Nano: React.FC<{ t: number; L: Layout }> = ({ t, L }) => {
  const land = L.fmt === "landscape";
  const g = nanoGeom(L.fmt);
  const u = g.u;
  const P = reflectPoints(g);
  const din = land ? norm(0.86, 0.5) : norm(0.6, 0.8);
  const dout = land ? norm(0.86, -0.5) : norm(0.6, -0.8);
  const Lin = land ? 700 : 650;
  const D1 = land ? 330 : 280;
  const Lout = land ? 470 : 300;
  const lensR = land ? 130 : 120;
  const mean = [P.reduce((a, p) => a + p[0], 0) / P.length, P.reduce((a, p) => a + p[1], 0) / P.length];
  const M = [mean[0] + dout[0] * D1, mean[1] + dout[1] * D1];
  const lens = [M[0] + dout[0] * (Lout + lensR), M[1] + dout[1] * (Lout + lensR)];

  // ---------- Phase A: one scale, then the cut ----------
  const aO = 1 - prog(t, BEATS.insideScales + 0.6, BEATS.insideScales + 1.4);
  const zoomA = lerp(1, 5, prog(t, BEATS.insideScales + 0.5, BEATS.insideScales + 1.6, "inOut"));
  const cut = prog(t, BEATS.insideScales - 0.05, BEATS.insideScales + 0.6, "inOut");
  const scl = land ? { x: 1300, y: 560, k: 3.6, r: -14 } : { x: 540, y: 1060, k: 4.3, r: -10 };
  const floatY = Math.sin(t * 1.1) * 8;

  // ---------- Phase B: cutaway reveal ----------
  const bO = prog(t, BEATS.insideScales + 0.7, BEATS.insideScales + 1.5);
  const reveal = prog(t, BEATS.insideScales + 0.9, BEATS.insideScales + 2.8, "inOut");
  const diagS = lerp(1.35, 1, prog(t, BEATS.insideScales + 0.7, BEATS.insideScales + 2.8, "out"));
  const hi = prog(t, BEATS.precisePatterns, BEATS.precisePatterns + 0.6);
  // Phase E: diagram recedes under the headline
  const eDim = prog(t, BEATS.structuralColoration - 0.2, BEATS.structuralColoration + 0.8);
  const diagO = bO * (1 - 0.68 * eDim);
  const ox = L.w / 2;
  const oy = g.base - g.H / 2;

  // ---------- Phase C: light ----------
  const tIn = BEATS.sunlightHits + 0.1;
  const tRef = BEATS.reinforce - 0.1;
  const tOther = BEATS.otherWavelengths + 0.05;
  const wlB = 58;
  const dot = (p: [number, number]) => p[0] * dout[0] + p[1] * dout[1];
  const result = prog(t, BEATS.metallic - 0.3, BEATS.metallic + 1.0);
  const lensO = fade(t, BEATS.theResult + 0.2, 0.6, land ? BEATS.notDye + 1.5 : BEATS.structuralColoration - 0.6, 0.6);

  return (
    <AbsoluteFill>
      <svg width={L.w} height={L.h} style={{ position: "absolute", inset: 0 }}>
        <NanoDefs id="s4n" glow={result} />
        <ScaleDefs id="s4s" />
        {/* Phase A — a single wing scale */}
        {aO > 0 && (
          <g opacity={aO} transform={`translate(${scl.x} ${scl.y + floatY}) scale(${scl.k * zoomA}) rotate(${scl.r})`}>
            <Glow x={0} y={0} rx={80} ry={110} opacity={0.9} id="s4g" />
            <g transform="translate(0 -59)">
              <Scale id="s4s" variant={2} hl={0.25 + 0.25 * Math.sin(t * 1.4) ** 2} />
              {/* cut line */}
              <line x1={-40} y1={64} x2={-40 + 80 * cut} y2={64} stroke="#FFFFFF" strokeWidth={1.6} opacity={cut > 0 ? 0.95 : 0} />
              <line x1={-40} y1={64} x2={-40 + 80 * cut} y2={64} stroke={C.cyan} strokeWidth={5} opacity={cut > 0 ? 0.35 : 0} />
            </g>
          </g>
        )}

        {/* Phase B–E — cutaway */}
        {bO > 0 && (
          <g opacity={diagO} transform={`translate(${ox} ${oy}) scale(${diagS}) translate(${-ox} ${-oy})`}>
            <NanoCutaway g={g} id="s4n" w={L.w} reveal={reveal} hi={hi} />
            {/* repeating-layer markers on the demo ridge */}
            {hi > 0 &&
              Array.from({ length: g.N }).map((_, k) => {
                const p = prog(t, BEATS.precisePatterns + 0.2 + k * 0.12, BEATS.precisePatterns + 0.6 + k * 0.12, "out");
                const x = g.trees[g.m] + 8 * u + shelfLen(g, g.m, k);
                const y = tierY(g, g.m, k) - shelfLen(g, g.m, k) * 0.07;
                return <circle key={k} cx={x + 12 * u} cy={y} r={7 * u * p} fill={C.orange} opacity={0.9 * (1 - prog(t, BEATS.sunlightHits - 0.4, BEATS.sunlightHits + 0.2))} />;
              })}
            {/* hair comparison bracket */}
            {(() => {
              const o = fade(t, BEATS.hairCompare, 0.5, BEATS.sunlightHits - 0.5, 0.5);
              if (o <= 0) return null;
              const x1 = g.trees[g.m];
              const x2 = g.trees[g.m + 1];
              const y = g.base + 58 * u;
              return (
                <g opacity={o} stroke={C.orange} strokeWidth={2.5} fill="none">
                  <path d={`M${x1} ${y - 12} L${x1} ${y} L${x2} ${y} L${x2} ${y - 12}`} />
                </g>
              );
            })()}
          </g>
        )}

        {/* Phase C — incoming sunlight reaches several layers */}
        {P.map((p, k) => (
          <TravelWave
            key={`in${k}`}
            t={t}
            at={tIn + k * 0.22}
            dur={1.25}
            x1={p[0] - din[0] * Lin}
            y1={p[1] - din[1] * Lin}
            x2={p[0]}
            y2={p[1]}
            color="#F4F8FF"
            wl={52}
            amp={8}
            width={2.6}
            glow={0.16}
            out={BEATS.structuralColoration - 0.3}
          />
        ))}
        {P.map((p, k) => (
          <circle key={`hit${k}`} cx={p[0]} cy={p[1]} r={9} fill="#FFFFFF" opacity={0.7 * Math.sin(Math.PI * prog(t, tIn + k * 0.22 + 1.1, tIn + k * 0.22 + 1.8)) * (1 - eDim)} />
        ))}
        {/* reflected blue: crests line up → they add together */}
        {P.map((p, k) => (
          <TravelWave
            key={`b${k}`}
            t={t}
            at={tRef + k * 0.06}
            dur={1.0}
            x1={p[0]}
            y1={p[1]}
            x2={p[0] + dout[0] * D1}
            y2={p[1] + dout[1] * D1}
            color="#58B4FF"
            wl={wlB}
            amp={8}
            width={3}
            phase={(-2 * Math.PI * dot(p)) / wlB}
            glow={0.2}
            taper={0.08}
            out={BEATS.structuralColoration - 0.3}
          />
        ))}
        <TravelWave
          t={t}
          at={tRef + 1.0}
          dur={1.2}
          x1={M[0]}
          y1={M[1]}
          x2={lens[0] - dout[0] * lensR * 0.9}
          y2={lens[1] - dout[1] * lensR * 0.9}
          color="#8FDcFF"
          wl={wlB}
          amp={15 + 5 * result}
          width={6 + 3 * result}
          phase={(-2 * Math.PI * (M[0] * dout[0] + M[1] * dout[1])) / wlB}
          glow={0.3 + 0.2 * result}
          taper={0.06}
          out={BEATS.structuralColoration - 0.3}
        />
        {/* other colours: weaker and out of step */}
        {[C.red, C.green, C.yellow].map((col, ci) =>
          P.map((p, k) => (
            <TravelWave
              key={`o${ci}${k}`}
              t={t}
              at={tOther + ci * 0.15 + k * 0.05}
              dur={0.9}
              x1={p[0] + 4 * ci}
              y1={p[1]}
              x2={p[0] + dout[0] * D1 * 0.75}
              y2={p[1] + dout[1] * D1 * 0.75}
              color={col}
              wl={[86, 66, 74][ci]}
              amp={3.5}
              width={2}
              phase={rand(ci * 10 + k) * Math.PI * 2}
              opacity={0.65 * (1 - prog(t, tOther + 1.6, tOther + 3.2))}
              glow={0.08}
            />
          )),
        )}

        {/* Phase D — the result as seen by an observer */}
        {lensO > 0 && <Lens x={lens[0]} y={lens[1]} r={lensR} t={t} o={lensO} k={result} />}

        {/* ---------- labels ---------- */}
        {(() => {
          const ridgeI = g.m + (land ? 2 : 1);
          const rx = g.trees[ridgeI];
          const ry = g.base - g.H - 10 * u;
          const shI = land ? 1 : 0;
          const kk = g.N - 2;
          const sx = g.trees[shI] + 8 * u + shelfLen(g, shI, kk);
          const sy = tierY(g, shI, kk);
          const outB = BEATS.sunlightHits - 0.5;
          const lab1 = land ? { x: rx + 70, y: ry - 70 } : { x: rx - 120, y: ry - 110 };
          const lab2 = land ? { x: 120, y: 300 } : { x: 70, y: 520 };
          return (
            <g>
              <Leader t={t} at={BEATS.insideScales + 2.2} out={outB} x1={lab1.x - 20} y1={lab1.y + 10} x2={rx} y2={ry + 6} />
              <Label t={t} at={BEATS.insideScales + 2.2} out={outB} x={lab1.x} y={lab1.y} text="RIDGES" size={land ? 34 : 40} />
              <Leader t={t} at={BEATS.insideScales + 2.9} out={outB} x1={lab2.x + 40} y1={lab2.y + 26} x2={sx} y2={sy} />
              <Label t={t} at={BEATS.insideScales + 2.9} out={outB} x={lab2.x} y={lab2.y} text="SHELF-LIKE LAYERS" sub="nanoscale structures" size={land ? 34 : 40} dot={false} />
              <Label
                t={t}
                at={BEATS.hairCompare + 0.2}
                out={BEATS.sunlightHits - 0.5}
                x={(g.trees[g.m] + g.trees[g.m + 1]) / 2}
                y={g.base + (land ? 104 : 92) * u}
                anchor="middle"
                size={land ? 28 : 34}
                color={C.orange}
                text="LESS THAN 1 µm APART"
                sub="a human hair is about 70 µm wide"
              />
              <Label
                t={t}
                at={BEATS.precisePatterns + 0.2}
                out={BEATS.sunlightHits - 0.5}
                x={land ? 760 : 540}
                y={land ? 150 : 400}
                anchor="middle"
                size={land ? 34 : 42}
                text="PRECISE, REPEATING PATTERN"
                sub="remarkably regular, though never perfectly uniform"
              />
              {/* Phase C labels */}
              <Label t={t} at={tIn + 0.3} out={BEATS.theResult - 0.2} x={land ? 120 : 70} y={land ? 150 : 470} text="SUNLIGHT" sub="all colors together" size={land ? 32 : 38} dot={false} color="#FFF4DC" />
              <Label
                t={t}
                at={BEATS.reinforce + 0.5}
                out={BEATS.theResult - 0.2}
                x={land ? 1000 : 540}
                y={land ? 120 : 250}
                anchor={land ? "start" : "middle"}
                size={land ? 32 : 40}
                color={C.morphoBright}
                text="BLUE WAVES IN STEP"
                sub="they reinforce → strong blue reflection"
              />
              <Label
                t={t}
                at={tOther + 0.4}
                out={BEATS.theResult - 0.2}
                x={land ? 470 : 540}
                y={land ? 300 : 370}
                anchor={land ? "start" : "middle"}
                size={land ? 30 : 36}
                color="#FFB3A8"
                text="OTHER COLORS OUT OF STEP"
                sub="reflected much more weakly"
              />
              <Label
                t={t}
                at={BEATS.metallic + 0.2}
                out={land ? BEATS.notDye + 1.5 : BEATS.structuralColoration - 0.6}
                x={land ? lens[0] : 540}
                y={land ? lens[1] + lensR + 60 : 250}
                anchor="middle"
                size={land ? 30 : 40}
                text="INTENSE, METALLIC BLUE"
              />
              <text
                x={land ? L.w - 60 : L.w / 2}
                y={land ? L.h - 34 : 1560}
                textAnchor={land ? "end" : "middle"}
                fontFamily={FONT_BODY}
                fontSize={land ? 18 : 22}
                letterSpacing={3}
                fill="#8EA2CC"
                opacity={bO * (1 - eDim) * 0.85}
              >
                SCHEMATIC CROSS-SECTION OF A WING SCALE · NOT TO SCALE
              </text>
            </g>
          );
        })()}
      </svg>

      <Headline
        t={t}
        at={BEATS.differentTrick + 0.1}
        out={BEATS.insideScales + 0.3}
        lines={[[["A DIFFERENT"]], [["TRICK", true]]]}
        x={land ? 120 : 540}
        y={land ? 380 : 300}
        size={land ? 112 : 130}
        align={land ? "left" : "center"}
        width={land ? 900 : 1000}
      />
      <Headline
        t={t}
        at={BEATS.structuralColoration + 0.05}
        lines={[[["STRUCTURAL", true]], [["COLORATION"]]]}
        x={land ? 120 : 540}
        y={land ? 120 : 250}
        size={land ? 104 : 112}
        align={land ? "left" : "center"}
        width={land ? 1200 : 1040}
      />
      <Chip t={t} at={BEATS.notDye + 0.1} x={land ? 120 : 540} y={land ? 420 : 560} center={!land} good={false} text="NOT FROM BLUE DYE" />
      <Chip t={t} at={BEATS.interactsLight + 0.15} x={land ? 120 : 540} y={land ? 510 : 660} center={!land} good text="STRUCTURE + LIGHT" />
    </AbsoluteFill>
  );
};

const Lens: React.FC<{ x: number; y: number; r: number; t: number; o: number; k: number }> = ({ x, y, r, t, o, k }) => {
  const sw = ((t * 0.5) % 1) * 2.4 - 1.2;
  return (
    <g opacity={o}>
      <defs>
        <radialGradient id="lensFill" cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#C8F4FF" />
          <stop offset="0.3" stopColor="#4FC2FF" />
          <stop offset="0.7" stopColor="#1A62E6" />
          <stop offset="1" stopColor="#0A2A8C" />
        </radialGradient>
        <linearGradient id="lensSweep" x1={sw} x2={sw + 0.6} y1="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.7" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <clipPath id="lensClip">
          <circle cx={x} cy={y} r={r} />
        </clipPath>
      </defs>
      <circle cx={x} cy={y} r={r * (1.5 + 0.3 * k)} fill={C.morphoElectric} opacity={0.12 + 0.16 * k} />
      <circle cx={x} cy={y} r={r} fill="url(#lensFill)" />
      <g clipPath="url(#lensClip)">
        {Array.from({ length: 9 }).map((_, i) => (
          <path key={i} d={`M${x - r + i * r * 0.26} ${y - r} l${r * 0.5} ${r * 2}`} stroke="#E8FBFF" strokeOpacity={0.12} strokeWidth={r * 0.06} />
        ))}
        <rect x={x - r} y={y - r} width={2 * r} height={2 * r} fill="url(#lensSweep)" />
      </g>
      <circle cx={x} cy={y} r={r} fill="none" stroke={C.white} strokeWidth={3} opacity={0.85} />
    </g>
  );
};

const Chip: React.FC<{ t: number; at: number; x: number; y: number; center: boolean; good: boolean; text: string }> = ({ t, at, x, y, center, good, text }) => {
  const o = fade(t, at, 0.45);
  if (o <= 0) return null;
  const p = prog(t, at, at + 0.6, "out");
  const col = good ? C.cyan : C.orange;
  return (
    <div style={{ position: "absolute", left: center ? x - 400 : x, top: y, width: 800, textAlign: center ? "center" : "left", opacity: o, transform: `translateX(${(1 - p) * -24}px)` }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 18,
          padding: "14px 30px 14px 18px",
          borderRadius: 999,
          background: "rgba(8,19,47,0.82)",
          border: `2px solid ${col}`,
          fontFamily: FONT_BODY,
          fontWeight: 700,
          fontSize: 36,
          letterSpacing: "0.1em",
          color: C.white,
        }}
      >
        <span style={{ width: 44, height: 44, borderRadius: 22, background: col, color: C.navy, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 30, fontWeight: 800 }}>
          {good ? "✓" : "✕"}
        </span>
        {text}
      </div>
    </div>
  );
};
