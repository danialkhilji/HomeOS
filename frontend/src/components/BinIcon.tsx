import type { BinIconType } from "../types";

const WHEEL = "#2A211A";
const HUB = "#6B5D52";

const BODY = "M9.5 13.5H38.5L35.9 39.6A2.2 2.2 0 0 1 33.7 41.6H14.3A2.2 2.2 0 0 1 12.1 39.6Z";
const BODY_SHADE = "M31.5 13.5H38.5L35.9 39.6A2.2 2.2 0 0 1 33.7 41.6H30Z";
const BODY_HIGHLIGHT = "M12.6 16.5H15.2L16.4 38.5H14.4Z";
const LID_SHADOW = "M9.5 13.5H38.5L38.25 16H9.75Z";

const SYMBOLS: Record<BinIconType, React.ReactNode> = {
  general: (
    <>
      <path d="M21 25.5C18.2 27.3 17.5 30.5 18.3 33C18.8 34.6 20 35.5 21.6 35.5H26.4C28 35.5 29.2 34.6 29.7 33C30.5 30.5 29.8 27.3 27 25.5Z" />
      <path d="M21.5 25.5L19.8 21.5L24 23.6L28.2 21.5L26.5 25.5" />
    </>
  ),
  garden: (
    <>
      <path d="M18 35C18 26.5 23.5 21.5 31 21.5C31 29.5 26 35 18 35Z" />
      <path d="M18 35L25.5 27.5" />
    </>
  ),
  food: (
    <>
      <path d="M19.5 23.5Q24 21.5 28.5 23.5Q26.2 26 26.2 29.3Q26.2 32.3 28.5 34.6Q24 36.6 19.5 34.6Q21.8 32.3 21.8 29.3Q21.8 26 19.5 23.5Z" />
      <path d="M24 22.5V20.2Q25.8 19.2 27.2 19.9" />
    </>
  ),
  cardboard: (
    <>
      <path d="M24 21.5L30.5 25V32L24 35.5L17.5 32V25Z" />
      <path d="M17.5 25L24 28.5L30.5 25M24 28.5V35.5" />
    </>
  ),
  plastic: (
    <>
      <path d="M21.6 21H26.4" />
      <path d="M22.3 21.5V24.2C20 25.2 19 26.8 19 29V34A1.5 1.5 0 0 0 20.5 35.5H27.5A1.5 1.5 0 0 0 29 34V29C29 26.8 28 25.2 25.7 24.2V21.5" />
      <path d="M19 30H29" />
    </>
  ),
  glass: (
    <>
      <rect x="19.5" y="20.5" width="9" height="3" rx="1" />
      <path d="M20.5 23.5C19 24.8 18 26.3 18 28V33.5A2 2 0 0 0 20 35.5H28A2 2 0 0 0 30 33.5V28C30 26.3 29 24.8 27.5 23.5" />
      <path d="M21.5 28.5V31.5" />
    </>
  ),
};

interface BinIconProps {
  icon: BinIconType;
  colour: string;
  size?: number;
}

export default function BinIcon({ icon, colour, size = 48 }: BinIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true" className="shrink-0">
      <rect x="14" y="3.5" width="20" height="4.5" rx="2.25" fill={colour} />
      <rect x="14" y="3.5" width="20" height="4.5" rx="2.25" fill="#000" fillOpacity={0.35} />

      <path d={BODY} fill={colour} />
      <path d={BODY_SHADE} fill="#000" fillOpacity={0.14} />
      <path d={BODY_HIGHLIGHT} fill="#fff" fillOpacity={0.18} />
      <path d={LID_SHADOW} fill="#000" fillOpacity={0.2} />

      <rect x="6.5" y="7" width="35" height="6.5" rx="2.5" fill={colour} />
      <rect x="6.5" y="7" width="35" height="6.5" rx="2.5" fill="#000" fillOpacity={0.22} />

      <circle cx="14.5" cy="42" r="4" fill={WHEEL} />
      <circle cx="14.5" cy="42" r="1.5" fill={HUB} />
      <circle cx="33.5" cy="42" r="4" fill={WHEEL} />
      <circle cx="33.5" cy="42" r="1.5" fill={HUB} />

      <g stroke="#fff" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
        {SYMBOLS[icon]}
      </g>
    </svg>
  );
}
