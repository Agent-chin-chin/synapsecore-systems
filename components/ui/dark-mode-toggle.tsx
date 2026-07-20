import { useState, useEffect } from 'react';

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);
  return (
    <button
      className="px-4 py-2 rounded bg-slate-800 text-white"
      onClick={() => setDark((d) => !d)}
    >
      {dark ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}
