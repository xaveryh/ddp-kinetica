import { NavLink, Outlet } from "react-router-dom";

const NAV = [
  { to: "/", label: "Chat", end: true },
  { to: "/visualisations", label: "Visualisations", end: false },
  { to: "/predictions", label: "Predictions", end: false },
];

export default function Layout() {
  return (
    <div className="flex h-full min-h-0">
      <aside className="w-56 shrink-0 border-r border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col">
        <div className="px-5 py-5 border-b border-[var(--color-border)]">
        </div>
        <nav className="flex flex-col p-2 gap-0.5">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                [
                  "px-3 py-2 rounded-md text-sm transition-colors",
                  isActive
                    ? "bg-[var(--color-user-bubble)] text-[var(--color-accent)] font-medium"
                    : "text-[var(--color-text)] hover:bg-[var(--color-bg)]",
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 min-w-0 min-h-0 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
