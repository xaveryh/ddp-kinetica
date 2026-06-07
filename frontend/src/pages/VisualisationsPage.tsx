import { useEffect, useState } from "react";

type ChartKind = "Bar" | "Line" | "Pie" | "Metric" | "Table";

type Viz = {
  src: string;
  title: string;
  question: string;
  kind: ChartKind;
};

const VISUALISATIONS: Viz[] = [
  {
    src: "/analytics/image1.png",
    title: "Total approved score per archer",
    question:
      "What is the total approved score for each archer, ranked highest to lowest?",
    kind: "Bar",
  },
  {
    src: "/analytics/image2.png",
    title: "Most perfect 10-arrow scores",
    question:
      "Which archer has the most perfect 10-arrow scores in approved ends?",
    kind: "Metric",
  },
  {
    src: "/analytics/image3.png",
    title: "Average score by bow type",
    question: "Which round type has the highest average approved score?",
    kind: "Line",
  },
  {
    src: "/analytics/image4.png",
    title: "Most competition wins",
    question: "Which archer has won the most competitions?",
    kind: "Metric",
  },
  {
    src: "/analytics/image5.png",
    title: "Busiest venue",
    question: "Which venue has hosted the most competitions?",
    kind: "Metric",
  },
  {
    src: "/analytics/image6.png",
    title: "Archers per default bow type",
    question: "How many archers use each bow type as their default equipment?",
    kind: "Pie",
  },
  {
    src: "/analytics/image7.png",
    title: "Approval / rejection / pending rate",
    question:
      "What is the approval, rejection and pending rate of ends as a percentage?",
    kind: "Table",
  },
  {
    src: "/analytics/image8.png",
    title: "Championships overview",
    question: "List all championships with their winner count and date range.",
    kind: "Table",
  },
  {
    src: "/analytics/image9.png",
    title: "Highest scoring class",
    question: "Which class has the highest average total approved score?",
    kind: "Table",
  },
];

const KIND_STYLES: Record<ChartKind, string> = {
  Bar: "bg-indigo-50 text-indigo-700",
  Line: "bg-sky-50 text-sky-700",
  Pie: "bg-rose-50 text-rose-700",
  Metric: "bg-amber-50 text-amber-700",
  Table: "bg-emerald-50 text-emerald-700",
};

function Badge({ kind }: { kind: ChartKind }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${KIND_STYLES[kind]}`}
    >
      {kind}
    </span>
  );
}

export default function VisualisationsPage() {
  const [active, setActive] = useState<Viz | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActive(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3">
        <h1 className="text-sm font-semibold">Visualisations</h1>
      </header>

      <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6">
            <h2 className="text-lg font-medium">Kinetica analytics</h2>
            <p className="mt-1 text-sm text-[var(--color-muted)] max-w-2xl">
              Exploratory queries and charts run against the archery dataset in
              Kinetica. Click any card to view it full size.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {VISUALISATIONS.map((viz) => (
              <button
                key={viz.src}
                type="button"
                onClick={() => setActive(viz)}
                className="group flex flex-col overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-[var(--color-accent)] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              >
                <div className="aspect-[16/9] overflow-hidden bg-[var(--color-bg)]">
                  <img
                    src={viz.src}
                    alt={viz.title}
                    loading="lazy"
                    className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold leading-snug">
                      {viz.title}
                    </h3>
                    <Badge kind={viz.kind} />
                  </div>
                  <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                    {viz.question}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setActive(null)}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-[var(--color-surface)] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-[var(--color-border)] px-5 py-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold">{active.title}</h3>
                  <Badge kind={active.kind} />
                </div>
                <p className="mt-0.5 text-xs text-[var(--color-muted)]">
                  {active.question}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActive(null)}
                aria-label="Close"
                className="shrink-0 rounded-md px-2 py-1 text-[var(--color-muted)] transition-colors hover:bg-[var(--color-bg)] hover:text-[var(--color-text)]"
              >
                ✕
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-auto bg-[var(--color-bg)] p-4">
              <img
                src={active.src}
                alt={active.title}
                className="mx-auto max-w-full rounded-md border border-[var(--color-border)] bg-white"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
