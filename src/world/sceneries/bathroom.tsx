import { useId } from "react";

export function Bathroom() {
  const tiles = useId();
  const boards = useId();
  return <>
    <rect width="1600" height="1000" fill="#efe6d5" />
    <path d="M0 0h1600v534H0z" fill="#fbf0db" opacity=".37" />
    <path d="M-10 225q420-30 820-26t800-5M-10 421q420-30 820-26t800-5" fill="none" stroke="#ded4be" strokeWidth="3" opacity=".52" />
    <defs>
      <pattern id={tiles} width="142" height="112" patternUnits="userSpaceOnUse">
        <rect width="142" height="112" fill="#eee7d5" />
        <rect x="4" y="4" width="134" height="104" rx="12" fill="var(--tile-b)" />
        <path d="M16 4h113a9 9 0 0 1 9 9v28q-44 14-67 14-22-1-67-14V16A12 12 0 0 1 16 4Z" fill="var(--tile-a)" opacity=".55" />
        <path d="M71 51q10 19 29 20-19 3-29 20-10-17-29-20 19-1 29-20Z" fill="#b9c7aa" opacity=".72" />
      </pattern>
      <pattern id={boards} width="310" height="68" patternUnits="userSpaceOnUse">
        <rect width="310" height="68" fill="#ddbc91" />
        <path d="M0 0h310M0 34h310" stroke="#b18c6d" opacity=".42" strokeWidth="3" />
        <path d="M83 0v34m158 0v34" stroke="#bc9a7b" strokeWidth="3" />
        <path d="M21 14q35-3 76 2m53 33q38-4 78 0" fill="none" stroke="#eed3a9" strokeLinecap="round" strokeWidth="3" opacity=".7" />
      </pattern>
    </defs>
    <rect y="500" width="1600" height="222" fill={`url(#${tiles})`} />
    <path d="M0 485h1600v23H0z" fill="#fff5df" /><path d="M0 507h1600v12H0z" fill="#c5c4a7" />
    <rect y="716" width="1600" height="284" fill={`url(#${boards})`} />
    <path d="M0 704h1600v18H0z" fill="#b7ac8b" />
    <path d="M0 704h1600v5H0z" fill="#e3d4b4" />
    <rect width="1600" height="1000" fill="#293952" className="room-evening" />
  </>;
}