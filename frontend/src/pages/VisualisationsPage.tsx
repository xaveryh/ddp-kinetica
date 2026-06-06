export default function VisualisationsPage() {
  return (
    <>
      <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3">
        <h1 className="text-sm font-semibold">Visualisations</h1>
      </header>
      <div className="flex-1 flex items-center justify-center px-6 text-center">
        <div>
          <h2 className="text-lg font-medium">Visualisations</h2>
          <p className="mt-2 text-sm text-[var(--color-muted)] max-w-md">
            Charts and exploratory views over Kinetica query results will live
            here.
          </p>
        </div>
      </div>
    </>
  );
}
