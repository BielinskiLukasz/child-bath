import { useEffect, useState } from "react";

export function LiveRegion({ message }: { message: string }) {
  const [spoken, setSpoken] = useState("");
  // Region jest najpierw zamontowany pusty, potem zmienia się jego zawartość.
  useEffect(() => { setSpoken(message); }, [message]);
  return <div className="sr-only" aria-live="polite" aria-atomic="true">{spoken}</div>;
}
