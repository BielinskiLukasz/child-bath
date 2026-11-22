import { Cottage, Pine } from "./landscapeProps";

export function MountainTub() {
  return <>
    <path d="M0 627 336 398l144 93L749 266q19-21 40 1l230 211 179-143 402 284v381H0Z" fill="#a8b7c0" />
    <path d="m541 441 208-175q19-21 40 1l174 160-89-25-24 31-76-63-61 53-33-22-60 39Z" fill="#f6f1df" />
    <path d="m780 270 239 208 179-143 402 284h-562l-187-162Z" fill="#8e9fac" opacity=".67" />
    <path d="m975 506 223-171 210 149-102-21-36 19-66-64-39 48-51-12-67 52Z" fill="#f4eedf" />
    <path d="M0 701q258-130 542-96 291 52 544-21 302-80 514 98v318H0Z" fill="var(--hill-far)" />
    <path d="M0 763q285-122 639-34 283 64 503-64 199-105 458 25v310H0Z" fill="var(--hill-near)" />
    <path d="M550 1000q-20-54 72-133 84-65 179-210-69 115-58 161 8 54 128 182Z" fill="#e5d4b8" />
    <path d="M0 878q284-50 563-16 493 58 1037-65v203H0Z" fill="#eadfc9" opacity=".43" />
    <Cottage x={1070} y={681} scale={.92} color="#d9be99" />
    <Pine x={382} y={737} scale={1.52} color="var(--pine-b)" /><Pine x={285} y={773} scale={1.77} color="var(--pine-a)" />
    <Pine x={1165} y={758} scale={1.84} color="var(--pine-a)" /><Pine x={1260} y={796} scale={2.6} color="var(--pine-b)" />
    <path d="M340 886q39-51 85-37 28 8 55 58-93 32-140-21Zm810 38q19-61 68-70 44-8 72 55-73 43-140 15Z" fill="#b5b5a5" />
    <path d="M350 877q27-37 62-31 33 5 50 36-59-2-112-5Zm810 31q17-45 61-52 34-4 55 34-68-2-116 18Z" fill="#efe9db" opacity=".85" />
  </>;
}