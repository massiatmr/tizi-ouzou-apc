import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Search, MapPin, Clock, CheckCircle2, Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/site-layout";
import { trouverSignalement, getHistorique, CATEGORIES, STATUTS, type Signalement, type SignalementHistorique } from "@/lib/db";

export const Route = createFileRoute("/suivre")({
  head: () => ({
    meta: [
      { title: "Suivre ma demande — APC de Tizi Ouzou" },
      { name: "description", content: "Suivez l'état de votre signalement grâce à votre numéro de suivi." },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    numero: typeof search.numero === "string" ? search.numero : "",
  }),
  component: SuivrePage,
});

function StatutBadge({ statut }: { statut: string }) {
  const s = STATUTS.find((st) => st.value === statut);
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${s?.couleur ?? "text-muted-foreground"} bg-secondary`}>
      {s?.label ?? statut}
    </span>
  );
}

function SuivrePage() {
  const search = useSearch({ from: "/suivre" });
  const [numero, setNumero] = useState(search.numero ?? "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Signalement | null>(null);
  const [historique, setHistorique] = useState<SignalementHistorique[]>([]);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rechercher = async (num: string) => {
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const s = await trouverSignalement(num);
      if (!s) {
        setResult(null);
        setHistorique([]);
        setError("Aucun signalement trouvé avec ce numéro.");
        return;
      }
      setResult(s);
      const h = await getHistorique(s.id);
      setHistorique(h);
    } catch {
      setError("Une erreur est survenue lors de la recherche.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (search.numero && search.numero.length > 0) {
      rechercher(search.numero);
    }
  }, [search.numero]);

  return (
    <PageLayout pageTitle="Suivre ma demande">
      <div className="mx-auto max-w-3xl px-5 pb-24">
        <div className="rounded-[2rem] border border-border bg-card p-6 md:p-10">
          <h2 className="font-display text-2xl text-night">Entrez votre numéro de suivi</h2>
          <p className="mt-1 text-sm text-muted-foreground">Format : TZO-AAAA-NNNNN (ex : TZO-2026-04817)</p>
          <div className="mt-5 flex gap-3">
            <input
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && numero.trim()) rechercher(numero); }}
              placeholder="TZO-2026-04817"
              className="w-full rounded-full border border-input bg-background px-5 py-3 text-night outline-none focus:ring-2 focus:ring-saffron"
            />
            <Button
              onClick={() => rechercher(numero)}
              disabled={loading || !numero.trim()}
              className="shrink-0 rounded-full bg-saffron text-night hover:bg-saffron/90"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Search className="h-4 w-4" /> Suivre</>}
            </Button>
          </div>
        </div>

        {error && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-5 text-destructive">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span className="text-sm font-semibold">{error}</span>
          </div>
        )}

        {result && (
          <div className="mt-6 space-y-6">
            {/* Signalement details */}
            <div className="rounded-[2rem] border border-border bg-card p-6 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-clay">
                    {CATEGORIES.find((c) => c.value === result.categorie)?.label}
                  </div>
                  <h3 className="mt-2 font-display text-2xl text-night">{result.titre}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{result.description}</p>
                </div>
                <StatutBadge statut={result.statut} />
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-sm text-night">
                  <MapPin className="h-4 w-4 text-olive" strokeWidth={1.5} /> {result.adresse}
                </div>
                <div className="flex items-center gap-2 text-sm text-night">
                  <Clock className="h-4 w-4 text-olive" strokeWidth={1.5} /> Soumis le {new Date(result.created_at).toLocaleDateString("fr-FR")}
                </div>
              </div>
              {result.photo_path && (
                <div className="mt-4 overflow-hidden rounded-xl">
                  <img src={result.photo_path} alt="Photo du signalement" className="max-h-64 w-full object-cover" />
                </div>
              )}
              {result.latitude !== null && result.longitude !== null && (
                <div className="mt-4 overflow-hidden rounded-xl border border-border">
                  <iframe
                    title="Localisation"
                    className="h-48 w-full"
                    loading="lazy"
                    src={`https://www.google.com/maps?q=${result.latitude},${result.longitude}&z=16&output=embed`}
                  />
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="rounded-[2rem] border border-border bg-card p-6 md:p-8">
              <h3 className="font-display text-xl text-night">Suivi</h3>
              <div className="mt-6 space-y-1">
                {historique.map((h, i) => {
                  const isLast = i === historique.length - 1;
                  const statutInfo = STATUTS.find((s) => s.value === h.statut);
                  return (
                    <div key={h.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`grid h-10 w-10 place-items-center rounded-full ${isLast ? "bg-saffron text-night" : "bg-olive/15 text-olive"}`}>
                          {h.statut === "resolu" || h.statut === "ferme" ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                        </div>
                        {!isLast && <div className="h-full min-h-[2rem] w-0.5 bg-border" />}
                      </div>
                      <div className="pb-6">
                        <div className={`font-semibold ${statutInfo?.couleur ?? "text-night"}`}>{statutInfo?.label ?? h.statut}</div>
                        <div className="mt-1 text-sm text-muted-foreground">{h.commentaire}</div>
                        <div className="mt-1 text-xs text-muted-foreground">{new Date(h.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-center">
              <Button asChild className="rounded-full bg-saffron text-night hover:bg-saffron/90">
                <a href="/signaler"><ArrowRight className="h-4 w-4 rotate-180" /> Faire un nouveau signalement</a>
              </Button>
            </div>
          </div>
        )}

        {!result && !error && !loading && searched === false && (
          <div className="mt-6 rounded-[2rem] bg-secondary p-8 text-center text-muted-foreground">
            <Search className="mx-auto h-10 w-10 opacity-40" strokeWidth={1} />
            <p className="mt-3 text-sm">Saisissez votre numéro de suivi pour voir l'état de votre signalement.</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
