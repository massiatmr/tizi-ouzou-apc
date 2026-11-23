import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Gavel, Download, Calendar, ArrowUpRight } from "lucide-react";
import { PageLayout } from "@/components/site-layout";

export const Route = createFileRoute("/marches-publics")({
  head: () => ({
    meta: [
      { title: "Marchés publics — APC de Tizi Ouzou" },
      { name: "description", content: "Avis d'appel d'offres et consultations de la commune de Tizi Ouzou." },
    ],
  }),
  component: MarchesPublicsPage,
});

type Marche = {
  ref: string;
  objet: string;
  dateLimite: string;
  statut: "ouvert" | "cloture";
  type: "ao" | "consultation";
};

const MARCHES: Marche[] = [
  { ref: "AO n°41/2026", objet: "Réhabilitation de l'éclairage public — Nouvelle-Ville", dateLimite: "2026-11-20", statut: "ouvert", type: "ao" },
  { ref: "AO n°39/2026", objet: "Aménagement des espaces verts — Boulevard Stiti", dateLimite: "2026-11-27", statut: "ouvert", type: "ao" },
  { ref: "AO n°38/2026", objet: "Acquisition de bacs de collecte des déchets", dateLimite: "2026-12-03", statut: "ouvert", type: "ao" },
  { ref: "Consultation n°12", objet: "Travaux de voirie — Quartier Les Genêts", dateLimite: "2026-12-10", statut: "ouvert", type: "consultation" },
  { ref: "AO n°35/2026", objet: "Fourniture de matériel informatique pour les services communaux", dateLimite: "2026-10-15", statut: "cloture", type: "ao" },
  { ref: "Consultation n°11", objet: "Réfection de la toiture de l'école primaire El Feth", dateLimite: "2026-10-08", statut: "cloture", type: "consultation" },
  { ref: "AO n°33/2026", objet: "Acquisition de véhicules de service pour la voirie", dateLimite: "2026-09-30", statut: "cloture", type: "ao" },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}

function MarchesPublicsPage() {
  const [filtre, setFiltre] = useState<"tous" | "ouvert" | "cloture">("tous");

  const marches = MARCHES.filter((m) => filtre === "tous" || m.statut === filtre).sort(
    (a, b) => new Date(b.dateLimite).getTime() - new Date(a.dateLimite).getTime(),
  );

  return (
    <PageLayout pageTitle="Marchés publics">
      <div className="mx-auto max-w-5xl px-5 pb-24">
        <p className="mb-8 text-lg text-muted-foreground">Avis d'appel d'offres et consultations de la commune de Tizi Ouzou. Transparence et égalité d'accès pour toutes les entreprises.</p>

        <div className="mb-8 flex gap-2">
          {([
            { v: "tous", l: "Tous" },
            { v: "ouvert", l: "Ouverts" },
            { v: "cloture", l: "Clôturés" },
          ] as const).map((f) => (
            <button
              key={f.v}
              onClick={() => setFiltre(f.v)}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${filtre === f.v ? "bg-saffron text-night" : "bg-secondary text-muted-foreground hover:bg-saffron/20"}`}
            >
              {f.l}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {marches.map((m, k) => (
            <div
              key={m.ref}
              className="reveal flex flex-col gap-4 rounded-[1.5rem] border border-border bg-card p-6 transition hover:shadow-[var(--shadow-soft)] sm:flex-row sm:items-center"
              style={{ transitionDelay: `${k * 60}ms` }}
            >
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-olive/10 text-olive">
                <Gavel className="h-6 w-6" strokeWidth={1.25} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-clay">{m.ref}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${m.statut === "ouvert" ? "bg-leaf/20 text-olive" : "bg-muted text-muted-foreground"}`}>
                    {m.statut === "ouvert" ? "Ouvert" : "Clôturé"}
                  </span>
                </div>
                <div className="mt-1 font-display text-lg text-night">{m.objet}</div>
                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" strokeWidth={1.5} />
                  Date limite : <strong className="text-night">{formatDate(m.dateLimite)}</strong>
                </div>
              </div>
              <button
                className="flex shrink-0 items-center gap-2 rounded-full bg-night px-5 py-3 text-sm font-bold text-cream transition hover:bg-leaf"
                aria-label="Télécharger le cahier des charges"
              >
                <Download className="h-4 w-4" strokeWidth={1.5} /> Cahier des charges
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-[2rem] bg-night p-8 text-cream">
          <h3 className="font-display text-2xl text-saffron">Information importante</h3>
          <p className="mt-3 text-sm text-cream/80">
            Les soumissions doivent être déposées au bureau des marchés de l'APC de Tizi Ouzou avant la date et l'heure limite indiquées.
            Tout dossier incomplet ou reçu après la date limite sera rejeté.
            Pour toute information complémentaire, contactez le service des marchés au 026 21 XX XX.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
