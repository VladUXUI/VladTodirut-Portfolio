import { Fraunces } from "next/font/google";
import styles from "./PipStatus.module.css";

/* Skouta's heading font, only loaded where these cards are */
const fraunces = Fraunces({ subsets: ["latin"], weight: "700" });

/* Skouta's dark theme, from the app's color tokens */
const BODY = "#EDEDED";
const INK = "#010101";
const CARD = "#141414";
const SUN = { clear: "#76BDD3", up: "#EDDC45", care: "#FE7D6B" };

/*
 * The top of the Skouta home screen in each of its three states: the hero card
 * (status + Pip) with the Area status card under it, as in HeroStatusCard and
 * AreaStatusCard. Counts are made-up examples that fit each state.
 */
const statuses = [
  {
    Pip: PipAllClear,
    title: "All clear",
    text: "Nothing to worry about close by",
    counts: { critical: 0, important: 0, minor: 4 },
  },
  {
    Pip: PipHeadsUp,
    title: "Heads up",
    text: "A few incidents in your area",
    counts: { critical: 0, important: 3, minor: 6 },
  },
  {
    Pip: PipTakeCare,
    title: "Take care",
    text: "Active critical incidents nearby",
    counts: { critical: 2, important: 3, minor: 5 },
  },
];

export function PipStatuses({ caption }: { caption?: string }) {
  return (
    <figure className="my-24 flex flex-col gap-12">
      {/* Swipeable row until three phone-width columns fit (xl) */}
      <div className="-mx-24 flex snap-x snap-mandatory gap-16 overflow-x-auto scroll-px-24 px-24 pb-8 [scrollbar-color:var(--color-dot)_transparent] [scrollbar-width:thin] lg:-mx-64 lg:scroll-px-64 lg:px-64 xl:mx-0 xl:grid xl:grid-cols-3 xl:gap-24 xl:overflow-visible xl:px-0 xl:pb-0">
        {statuses.map(({ Pip, title, text, counts }) => (
          <div
            key={title}
            className="flex w-[332px] shrink-0 snap-start flex-col gap-8 rounded-lg p-16 xl:w-auto"
            style={{ background: INK }}
          >
            <div className="overflow-hidden rounded-lg" style={{ background: INK }}>
              <div className="flex flex-col items-center px-24 pt-24 text-center">
                <p className={`${fraunces.className} text-[40px] leading-[48px] tracking-[-0.02em]`} style={{ color: BODY }}>
                  {title}
                </p>
                <p className="text-body font-medium text-white/75">{text}</p>
              </div>
              <div className="mt-24 flex h-[140px] justify-center">
                <Pip style={{ height: 140 }} />
              </div>
            </div>
            <AreaStatus {...counts} />
          </div>
        ))}
      </div>
      {caption && <figcaption className="text-body text-fg-dim">{caption}</figcaption>}
    </figure>
  );
}

/* Counts by level, a ring of the same split, and the "See all incidents" button */
function AreaStatus({ critical, important, minor }: { critical: number; important: number; minor: number }) {
  const rows = [
    { label: "Critical", count: critical, color: SUN.care },
    { label: "Important", count: important, color: SUN.up },
    { label: "Minor", count: minor, color: SUN.clear },
  ];
  return (
    <div className="flex flex-col gap-16 rounded-lg p-16" style={{ background: CARD }}>
      <div className="flex items-center justify-between gap-8">
        <p className="text-body font-medium" style={{ color: BODY }}>
          Area status
        </p>
        <p className="text-[14px] leading-[20px] text-white/40">based on your location</p>
      </div>
      <div className="flex items-center gap-16">
        <ul className="flex flex-1 flex-col gap-16">
          {rows.map((row) => (
            <li key={row.label} className="flex items-center gap-16">
              <span
                className="flex size-32 shrink-0 items-center justify-center rounded-full text-body font-bold tracking-[-0.03em]"
                style={{ background: row.color, color: INK }}
              >
                {row.count}
              </span>
              <span className="text-body text-white/75">{row.label}</span>
            </li>
          ))}
        </ul>
        <Ring segments={rows} />
      </div>
      <span className="flex h-48 items-center justify-center gap-8 rounded-[16px] bg-white/15 text-body font-semibold tracking-[0.01em] text-white/85">
        See all incidents
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </span>
    </div>
  );
}

/* AlertDonutChart: segments in level order around a full ring, starting bottom-left */
function Ring({ segments }: { segments: { count: number; color: string }[] }) {
  const size = 160;
  const stroke = 12;
  const c = size / 2;
  const r = (size - stroke) / 2;
  const parts = segments.filter((s) => s.count > 0);
  const total = parts.reduce((sum, s) => sum + s.count, 0);

  const point = (deg: number) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return `${c + r * Math.cos(rad)} ${c + r * Math.sin(rad)}`;
  };
  let cursor = 240;
  const arcs = parts.map((s) => {
    const start = cursor;
    cursor += (s.count / total) * 360;
    return { color: s.color, d: `M ${point(start)} A ${r} ${r} 0 ${cursor - start > 180 ? 1 : 0} 1 ${point(cursor)}` };
  });

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-[45%] max-w-[160px] shrink-0" aria-hidden>
      {parts.length === 1 ? (
        <circle cx={c} cy={c} r={r} stroke={parts[0].color} strokeWidth={stroke} fill="none" />
      ) : (
        arcs.map((a) => (
          <g key={a.color}>
            <path d={a.d} stroke={CARD} strokeWidth={stroke + 8} strokeLinecap="round" fill="none" />
            <path d={a.d} stroke={a.color} strokeWidth={stroke} strokeLinecap="round" fill="none" />
          </g>
        ))
      )}
      <text x={c} y={c + 8} textAnchor="middle" fontSize={32} fontWeight={700} fill={BODY}>
        {total}
      </text>
      <text x={c} y={c + 28} textAnchor="middle" fontSize={14} fill="rgb(245 245 245 / 0.4)">
        active
      </text>
    </svg>
  );
}

type PipProps = { style?: React.CSSProperties };

/* Walks in place, bobs and sings */
function PipAllClear({ style }: PipProps) {
  return (
    <svg viewBox="0 0 524 646" fill="none" aria-hidden className={styles.pip} style={style}>
      <circle cx={215} cy={215} r={215} fill={SUN.clear} />
      <g className={styles.clearBob}>
        <g className={styles.clearBeakTop}>
          <path d="M104.402 244.018L189.309 226.757C190.639 226.487 191.846 227.59 191.695 228.939L180.499 329.242C180.307 330.963 178.165 331.643 177.015 330.348L103.304 247.306C102.281 246.153 102.891 244.325 104.402 244.018Z" fill={BODY} />
        </g>
        <g className={styles.clearBeakBottom}>
          <path d="M109.291 273.125L188.203 237.344C189.438 236.784 190.861 237.59 191.016 238.938L202.493 339.209C202.69 340.93 200.755 342.071 199.345 341.065L108.956 276.574C107.701 275.679 107.888 273.761 109.291 273.125Z" fill={BODY} />
        </g>
        <path d="M447.194 279.391C446.485 195.223 378.037 127.21 293.701 127.21C226.855 127.21 168.893 169.564 148.927 229.576C144.027 244.303 137.714 281.83 138.291 310.221C137.704 362.793 145.241 419.941 152.314 454.476C162.742 513.785 210.669 560.606 270.46 569.277L283.417 570.578C299.404 572.254 316.456 573.352 334.268 573.988L347.246 574.37C401.651 575.635 471.689 559.283 520.789 537.893C521.008 537.798 521.241 537.755 521.472 537.698C523.178 537.278 523.771 534.604 522.563 533.321C522.314 533.056 521.933 532.973 521.569 532.97C471.763 532.567 440.291 478.569 439.919 441.372C439.512 400.656 450.464 339.105 447.194 279.391Z" fill={BODY} />
        <g className={styles.clearLeg1}>
          <path d="M265.834 643.233C265.449 644.268 264.297 644.795 263.262 644.409L258.576 642.664C257.541 642.279 257.015 641.127 257.4 640.092L285.674 564.187C286.059 563.151 287.211 562.625 288.246 563.01L292.932 564.756C293.967 565.141 294.493 566.293 294.108 567.328L265.834 643.233Z" fill={BODY} />
        </g>
        <g className={styles.clearLeg2}>
          <path d="M363.341 640.469C363.705 641.512 363.154 642.652 362.111 643.016L357.39 644.662C356.347 645.026 355.207 644.476 354.843 643.433L328.168 566.951C327.805 565.908 328.355 564.768 329.398 564.404L334.119 562.757C335.162 562.394 336.303 562.944 336.666 563.987L363.341 640.469Z" fill={BODY} />
        </g>
        <path d="M248 237.242C248 225.091 238.15 215.242 226 215.242C213.85 215.242 204 225.091 204 237.242" stroke={INK} strokeWidth={4} strokeLinecap="round" />
      </g>
      <g className={styles.note}>
        <path d="M88.3669 233.468C90.0222 233.394 91.4236 234.677 91.4968 236.332C91.5699 237.987 90.2877 239.387 88.6326 239.461L83.741 239.677L91.6482 252.195L91.8591 252.55C93.9336 256.235 92.7748 260.939 89.1589 263.223C85.4263 265.581 80.4884 264.467 78.1306 260.734C75.7732 257.002 76.8884 252.065 80.6208 249.707C81.2028 249.339 81.814 249.055 82.4402 248.853L75.908 238.511C75.3369 237.607 75.2905 236.467 75.7859 235.519C76.2813 234.572 77.2432 233.959 78.3113 233.912L88.3669 233.468Z" fill={INK} />
      </g>
      <g className={`${styles.note} ${styles.note2}`}>
        <path d="M68.8239 183.93C69.7669 183.426 70.9076 183.461 71.8171 184.024L82.0905 190.376C83.4994 191.248 83.9354 193.097 83.0641 194.506C82.1927 195.915 80.3433 196.351 78.9343 195.48L73.0583 191.845L72.4069 210.636L72.3786 211.098C71.9729 215.838 67.9153 219.478 63.1071 219.311C58.1439 219.138 54.2603 214.975 54.4323 210.012C54.6046 205.049 58.7671 201.164 63.7302 201.336C64.7788 201.373 65.7796 201.589 66.7038 201.951L67.2409 186.471C67.2781 185.402 67.8812 184.434 68.8239 183.93Z" fill={INK} />
      </g>
      <g className={`${styles.note} ${styles.note3}`}>
        <path d="M99.0505 116.042C100.684 115.767 102.231 116.867 102.508 118.5C102.784 120.134 101.684 121.682 100.05 121.958L86.9372 124.175L106.894 148.525L107.09 148.771C111.127 153.96 110.311 161.451 105.197 165.643C100.001 169.901 92.337 169.141 88.0788 163.946C83.8208 158.75 84.581 151.087 89.7761 146.828C91.5162 145.402 93.5339 144.54 95.6071 144.218L79.0192 123.98C78.3414 123.153 78.1549 122.027 78.53 121.026C78.9051 120.025 79.7853 119.299 80.8395 119.12L99.0505 116.042Z" fill={INK} />
      </g>
    </svg>
  );
}

const upBody =
  "M441.194 257.181C440.485 173.013 372.037 105 287.701 105C220.855 105 162.893 147.354 142.927 207.366C138.027 222.093 131.714 259.62 132.291 288.011C131.704 340.583 139.241 397.731 146.314 432.266C156.742 491.575 204.669 538.396 264.46 547.067L277.417 548.368C293.404 550.044 310.456 551.142 328.268 551.779L341.246 552.16C395.637 553.425 427.342 541.719 482.703 563.378C482.971 563.483 483.27 563.548 483.547 563.468C485.157 563 485.727 560.495 484.643 559.201C484.361 558.865 484.047 558.547 483.884 558.139C470.149 523.649 441.15 481.285 433.919 419.162C426.645 356.664 444.464 316.895 441.194 257.181Z";
const upBeak =
  "M93.4886 232.314L177.176 209.872C178.487 209.52 179.759 210.548 179.692 211.903L174.675 312.704C174.589 314.434 172.493 315.244 171.266 314.021L92.5953 235.662C91.5033 234.575 92.0001 232.713 93.4886 232.314Z";
const upLeg1 =
  "M275.254 621.128C275.254 622.233 274.358 623.128 273.254 623.128L268.254 623.128C267.149 623.128 266.254 622.233 266.254 621.128L266.254 540.128C266.254 539.024 267.149 538.128 268.254 538.128L273.254 538.128C274.358 538.128 275.254 539.024 275.254 540.128L275.254 621.128Z";
const upLeg2 =
  "M289 621.16C289 622.265 288.105 623.16 287 623.16L282 623.16C280.895 623.16 280 622.265 280 621.16L280 540.16C280 539.056 280.895 538.16 282 538.16L287 538.16C288.105 538.16 289 539.056 289 540.16L289 621.16Z";
const sclera =
  "M189.425 179.234C201.691 175.146 215.003 181.534 219.499 193.671C223.996 205.806 218.06 219.321 206.07 224.216C197.964 227.532 188.676 226.161 181.872 220.641C175.068 215.121 171.814 206.326 173.392 197.704C174.95 189.081 181.103 182.001 189.425 179.234Z";
const pupil =
  "M205.897 189.669C212.541 187.454 219.752 190.914 222.187 197.488C224.623 204.061 221.407 211.382 214.913 214.034C210.522 215.83 205.491 215.087 201.806 212.097C198.12 209.107 196.358 204.344 197.212 199.673C198.056 195.002 201.389 191.167 205.897 189.669Z";

/*
 * Breathes, walks and blinks, looking forward. Drawn twice like in the app:
 * an outline pass in the page colour separates Pip from the yellow sun, then
 * the fills cover its inner half.
 */
function PipHeadsUp({ style }: PipProps) {
  const outline = {
    stroke: "var(--color-bg)",
    strokeWidth: 20,
    strokeLinejoin: "round" as const,
    strokeLinecap: "round" as const,
  };
  return (
    <svg viewBox="0 0 486 624" fill="none" aria-hidden className={styles.pip} style={style}>
      <circle cx={215} cy={215} r={215} fill={SUN.up} />
      <g className={styles.upBreath}>
        <path d={upBody} {...outline} />
        <g className={styles.upBeak}>
          <path d={upBeak} {...outline} />
        </g>
      </g>
      <g className={styles.upLeg1}>
        <path d={upLeg1} {...outline} />
      </g>
      <g className={styles.upLeg2}>
        <path d={upLeg2} {...outline} />
      </g>

      <g className={styles.upBreath}>
        <path d={upBody} fill={BODY} />
        <g className={styles.upBeak}>
          <path d={upBeak} fill={BODY} />
        </g>
        <g className={styles.upBlink}>
          <path d={sclera} fill={INK} />
          <g transform="translate(-25 0)">
            <path d={pupil} fill={BODY} />
          </g>
        </g>
      </g>
      <g className={styles.upLeg1}>
        <path d={upLeg1} fill={BODY} />
      </g>
      <g className={styles.upLeg2}>
        <path d={upLeg2} fill={BODY} />
      </g>
    </svg>
  );
}

/* Frozen in place. Only the eye moves: it glances forward and blinks */
function PipTakeCare({ style }: PipProps) {
  return (
    <svg viewBox="0 0 444 624" fill="none" aria-hidden className={styles.pip} style={style}>
      <circle cx={215} cy={215} r={215} fill={SUN.care} />
      <path d="M423.194 257.181C422.485 173.013 354.037 105 269.701 105C202.855 105 144.893 147.354 124.927 207.366C120.027 222.093 113.714 259.62 114.291 288.011C113.704 340.583 121.241 397.731 128.314 432.266C138.742 491.575 186.669 538.396 246.46 547.067L259.417 548.368C275.404 550.044 292.456 551.142 310.268 551.779L323.246 552.16C377.772 553.428 382.484 550.81 441.116 547.541C443.281 547.42 443.988 543.883 442.131 542.763C408.991 522.765 416.292 456.499 415.919 419.162C415.512 378.446 426.464 316.895 423.194 257.181Z" fill={BODY} />
      <path d="M85.4017 219.808L170.309 202.547C171.639 202.277 172.846 203.38 172.695 204.729L161.499 305.032C161.307 306.753 159.165 307.433 158.015 306.138L84.3044 223.096C83.2813 221.943 83.8914 220.115 85.4017 219.808Z" fill={BODY} />
      <g className={styles.careBlink}>
        <path d={sclera} fill={INK} />
        <g className={styles.careLook}>
          <path d={pupil} fill={BODY} />
        </g>
      </g>
      <path d="M308 622C308 623.105 307.105 624 306 624L301 624C299.895 624 299 623.105 299 622L299 541C299 539.895 299.895 539 301 539L306 539C307.105 539 308 539.895 308 541L308 622Z" fill={BODY} />
      <path d="M265 622C265 623.105 264.105 624 263 624L258 624C256.895 624 256 623.105 256 622L256 541C256 539.895 256.895 539 258 539L263 539C264.105 539 265 539.895 265 541L265 622Z" fill={BODY} />
    </svg>
  );
}
