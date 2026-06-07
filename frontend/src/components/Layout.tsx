import { NavLink, Outlet } from "react-router-dom";

const NAV = [
  { to: "/", label: "💬 Chat", end: true },
  { to: "/visualisations", label: "📊 Visualisations", end: false },
  { to: "/predictions", label: "🔮 Predictions", end: false },
];

export default function Layout() {
  return (
    <div className="flex h-full min-h-0">
      <aside className="w-56 shrink-0 border-r-2 border-blue-200 bg-gradient-to-b from-white to-blue-50 flex flex-col shadow-sm">
        <div className="px-5 py-6 border-b-2 border-blue-200 bg-gradient-to-r from-blue-500 to-blue-600">
          <h1 className="text-white font-bold text-lg flex items-center gap-2">
            <span>🚀</span> ArrowDB
          </h1>
        </div>
        <nav className="flex flex-col p-3 gap-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                [
                  "px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md hover:shadow-lg"
                    : "text-gray-700 hover:bg-blue-100 hover:text-blue-700",
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
