export default function LanguageSwitcher() {
  return (
    <select className="px-2 py-1 rounded border border-slate-300">
      <option value="en">English</option>
      <option value="es">Español</option>
      <option value="fr">Français</option>
      {/* Add more languages as needed */}
    </select>
  );
}
