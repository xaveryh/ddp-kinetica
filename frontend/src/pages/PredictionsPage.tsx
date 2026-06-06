export default function PredictionsPage() {
  return (
    <>
      <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3">
        <h1 className="text-sm font-semibold">Predictions</h1>
      </header>
      <div className="flex-1 flex items-center justify-center px-6 text-center">
        <div>
          <h2 className="text-lg font-medium">Predictions</h2>
          <p className="mt-2 text-sm text-[var(--color-muted)] max-w-md">
            Forecasts and model output summaries will live here.
          </p>
        </div>
      </div>
    </>
  );
}
