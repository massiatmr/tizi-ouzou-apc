import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, FileText, ArrowRight, Clock, MapPin, FileCheck, Download } from "lucide-react";
import { PageLayout } from "@/components/site-layout";

export const Route = createFileRoute("/demarches")({
  head: () => ({
    meta: [
      { title: "Démarches — APC de Tizi Ouzou" },
      { name: "description", content: "Toutes les démarches administratives de la commune de Tizi Ouzou : état civil, urbanisme, élections." },
    ],
  }),
  component: DemarchesPage,
});

type Demarche = {
  id: string;
  titre: string;
  categorie: "etat_civil" | "urbanisme" | "elections" | "divers";
  description: string;
  documents: string[];
  etapes: string[];
  delai: string;
  cout: string;
  lieu: string;
};

const DEMARCHES: Demarche[] = [
  {
    id: "naissance-s12",
    titre: "Extrait d'acte de naissance (S12)",
    categorie: "etat_civil",
    description: "Demande d'extrait d'acte de naissance pour tout citoyen né dans la commune.",
    documents: ["Carte d'identité nationale", "Information sur l'acte (date et lieu de naissance)", "Timbre fiscal (selon tarif en vigueur)"],
    etapes: ["Se présenter au bureau d'état civil", "Remplir le formulaire S12", "Déposer les pièces requises", "Retrait du document sous 48h"],
    delai: "48 heures",
    cout: "Timbre fiscal",
    lieu: "Bureau d'état civil — Hôtel de ville",
  },
  {
    id: "certificat-residence",
    titre: "Certificat de résidence",
    categorie: "etat_civil",
    description: "Attestation de résidence dans la commune de Tizi Ouzou.",
    documents: ["Carte d'identité nationale", "Justificatif de domicile (facture d'eau ou d'électricité)"],
    etapes: ["Se présenter au bureau d'état civil", "Fournir les pièces justificatives", "Retrait le jour même"],
    delai: "Immédiat",
    cout: "Gratuit",
    lieu: "Bureau d'état civil — Hôtel de ville",
  },
  {
    id: "fiche-familiale",
    titre: "Fiche familiale d'état civil",
    categorie: "etat_civil",
    description: "Document récapitulant les actes d'état civil des membres d'une famille.",
    documents: ["Livret de famille", "Carte d'identité nationale du demandeur"],
    etapes: ["Se présenter au bureau d'état civil", "Présenter le livret de famille", "Retrait sous 48h"],
    delai: "48 heures",
    cout: "Timbre fiscal",
    lieu: "Bureau d'état civil — Hôtel de ville",
  },
  {
    id: "legalisation-signature",
    titre: "Légalisation de signature",
    categorie: "divers",
    description: "Authentification de signature auprès des services de la commune.",
    documents: ["Carte d'identité nationale", "Document à légaliser (en deux exemplaires)", "Timbre fiscal"],
    etapes: ["Se présenter en personne", "Signer devant l'agent communal", "Retrait immédiat"],
    delai: "Immédiat",
    cout: "Timbre fiscal",
    lieu: "Accueil de la mairie — Hôtel de ville",
  },
  {
    id: "permis-construire",
    titre: "Permis de construire",
    categorie: "urbanisme",
    description: "Autorisation de construire, rénover ou modifier un bâtiment sur le territoire communal.",
    documents: ["Plan d'architecture (4 exemplaires)", "Plan de situation du terrain", "Acte de propriété du terrain", "Carte d'identité nationale", "Fiche de renseignements dûment remplie"],
    etapes: ["Dépôt du dossier au service de l'urbanisme", "Étude du dossier (conformité)", "Enquête publique si nécessaire", "Notification de la décision sous 2 à 3 mois"],
    delai: "2 à 3 mois",
    cout: "Selon barème",
    lieu: "Service de l'urbanisme — Hôtel de ville",
  },
  {
    id: "listes-electorales",
    titre: "Inscription sur les listes électorales",
    categorie: "elections",
    description: "Inscription ou mise à jour de la situation sur les listes électorales de la commune.",
    documents: ["Carte d'identité nationale", "Justificatif de domicile", "Acte de naissance (pour première inscription)"],
    etapes: ["Se présenter au service des élections", "Remplir le formulaire d'inscription", "Vérification et traitement", "Réception de la carte d'électeur"],
    delai: "30 jours",
    cout: "Gratuit",
    lieu: "Service des élections — Hôtel de ville",
  },
];

const CAT_LABELS: Record<Demarche["categorie"], string> = {
  etat_civil: "État civil",
  urbanisme: "Urbanisme",
  elections: "Élections",
  divers: "Divers",
};

function DemarchesPage() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<Demarche["categorie"] | "all">("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = DEMARCHES.filter((d) => {
    if (cat !== "all" && d.categorie !== cat) return false;
    if (query && !d.titre.toLowerCase().includes(query.toLowerCase()) && !d.description.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <PageLayout pageTitle="Démarches administratives">
      <div className="mx-auto max-w-5xl px-5 pb-24">
        {/* Search + filter */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row">
          <div className="flex flex-1 items-center gap-3 rounded-full bg-cream px-5 py-3 shadow-sm ring-1 ring-border">
            <Search className="h-5 w-5 shrink-0 text-olive" strokeWidth={1.5} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher une démarche…"
              className="w-full bg-transparent text-night outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {(["all", "etat_civil", "urbanisme", "elections", "divers"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${cat === c ? "bg-saffron text-night" : "bg-secondary text-muted-foreground hover:bg-saffron/20"}`}
              >
                {c === "all" ? "Toutes" : CAT_LABELS[c]}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="space-y-4">
          {filtered.map((d, k) => {
            const isOpen = openId === d.id;
            return (
              <div key={d.id} className="reveal rounded-[1.75rem] border border-border bg-card overflow-hidden transition" style={{ transitionDelay: `${k * 60}ms` }}>
                <button
                  onClick={() => setOpenId(isOpen ? null : d.id)}
                  className="flex w-full items-center gap-5 p-6 text-start"
                >
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-olive/10 text-olive">
                    <FileText className="h-6 w-6" strokeWidth={1.25} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold uppercase tracking-widest text-clay">{CAT_LABELS[d.categorie]}</div>
                    <div className="mt-1 font-display text-xl text-night">{d.titre}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{d.description}</div>
                  </div>
                  <ArrowRight className={`h-5 w-5 shrink-0 text-muted-foreground transition ${isOpen ? "rotate-90" : ""}`} />
                </button>
                {isOpen && (
                  <div className="border-t border-border px-6 py-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <h4 className="flex items-center gap-2 font-semibold text-night"><FileCheck className="h-4 w-4 text-olive" strokeWidth={1.5} /> Documents à fournir</h4>
                        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                          {d.documents.map((doc) => (
                            <li key={doc} className="flex items-start gap-2">
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-saffron" /> {doc}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="flex items-center gap-2 font-semibold text-night"><ArrowRight className="h-4 w-4 text-olive" strokeWidth={1.5} /> Étapes</h4>
                        <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
                          {d.etapes.map((etape, i) => (
                            <li key={etape} className="flex items-start gap-3">
                              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-olive/10 text-xs font-bold text-olive">{i + 1}</span>
                              {etape}
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                    <div className="mt-6 grid gap-4 border-t border-border pt-4 sm:grid-cols-3">
                      <div className="flex items-center gap-2 text-sm text-night"><Clock className="h-4 w-4 text-clay" strokeWidth={1.5} /> Délai : <strong>{d.delai}</strong></div>
                      <div className="flex items-center gap-2 text-sm text-night"><Download className="h-4 w-4 text-clay" strokeWidth={1.5} /> Coût : <strong>{d.cout}</strong></div>
                      <div className="flex items-center gap-2 text-sm text-night"><MapPin className="h-4 w-4 text-clay" strokeWidth={1.5} /> {d.lieu}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="rounded-[2rem] bg-secondary p-12 text-center text-muted-foreground">
            <p>Aucune démarche ne correspond à votre recherche.</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
