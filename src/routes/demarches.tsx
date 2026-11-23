import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Search, FileText, ArrowRight, Clock, MapPin, FileCheck,
  ChevronDown, HelpCircle, UserCheck, ClipboardList, PackageCheck,
  Baby, Heart, IdCard, FileSignature, Building2, ScrollText, Users,
  Download, Phone,
} from "lucide-react";
import { PageLayout } from "@/components/site-layout";

export const Route = createFileRoute("/demarches")({
  head: () => ({
    meta: [
      { title: "Démarches administratives — APC de Tizi Ouzou" },
      { name: "description", content: "Consultez les pièces à fournir, les délais indicatifs, les modalités de dépôt et les formulaires téléchargeables pour les démarches de la commune de Tizi Ouzou." },
    ],
  }),
  component: DemarchesPage,
});

type Categorie = "etat_civil" | "identite" | "certificats" | "famille" | "urbanisme" | "divers";

type Demarche = {
  id: string;
  titre: string;
  categorie: Categorie;
  description: string;
  delai: string;
  depot: string;
  pieces: string[];
  hasPdf?: boolean;
  pdfLabel?: string;
  extraPdfLabel?: string;
};

const CATEGORIES: { value: Categorie; label: string; icon: typeof FileText }[] = [
  { value: "etat_civil", label: "État civil", icon: Baby },
  { value: "identite", label: "Identité", icon: IdCard },
  { value: "certificats", label: "Certificats", icon: FileSignature },
  { value: "famille", label: "Famille", icon: Heart },
  { value: "urbanisme", label: "Urbanisme / autorisations", icon: Building2 },
  { value: "divers", label: "Divers", icon: ScrollText },
];

const CAT_LABELS: Record<Categorie, string> = {
  etat_civil: "État civil",
  identite: "Identité",
  certificats: "Certificats",
  famille: "Famille",
  urbanisme: "Urbanisme / autorisations",
  divers: "Divers",
};

const PROCEDURES_PRIORITAIRES = [
  { num: 1, titre: "Extrait de naissance 12S" },
  { num: 2, titre: "Certificat de résidence" },
  { num: 3, titre: "Carte nationale d'identité biométrique" },
  { num: 4, titre: "Passeport" },
  { num: 5, titre: "Acte de mariage" },
  { num: 6, titre: "Acte de décès" },
];

const DEMARCHES: Demarche[] = [
  // État civil
  {
    id: "naissance-12s",
    titre: "Extrait de naissance 12S",
    categorie: "etat_civil",
    description: "Document sécurisé requis pour les démarches d'identité biométrique et passeport.",
    delai: "immédiat à 24 h",
    depot: "État civil APC",
    pieces: ["Pièce d'identité du demandeur", "Nom, prénom, date et lieu de naissance", "Livret de famille (si disponible)"],
  },
  {
    id: "acte-mariage",
    titre: "Acte de mariage & mariage mixte",
    categorie: "etat_civil",
    description: "Extrait ou copie intégrale de l'acte de mariage établi par la commune de célébration.",
    delai: "24 à 48 h",
    depot: "Commune du mariage",
    pieces: ["Pièce d'identité", "Noms des époux + date du mariage", "Livret de famille (si disponible)"],
    hasPdf: true,
    pdfLabel: "Télécharger le formulaire",
  },
  {
    id: "acte-deces",
    titre: "Acte de décès",
    categorie: "etat_civil",
    description: "Document officiel attestant le décès d'une personne enregistrée auprès des services communaux.",
    delai: "24 à 72 h",
    depot: "État civil APC",
    pieces: ["Pièce d'identité du demandeur", "Informations sur le défunt", "Certificat médical (déclaration)"],
  },
  {
    id: "fiche-familiale",
    titre: "Fiche familiale",
    categorie: "etat_civil",
    description: "Document synthétique de la composition familiale à jour dans les registres communaux.",
    delai: "24 h",
    depot: "État civil APC",
    pieces: ["Pièce d'identité du chef de famille", "Livret de famille", "Formulaire de demande signé"],
  },
  {
    id: "attestation-non-mariage",
    titre: "Attestation de non mariage",
    categorie: "etat_civil",
    description: "Attestation administrative certifiant la situation matrimoniale actuelle du demandeur.",
    delai: "24 à 48 h",
    depot: "État civil APC",
    pieces: ["Pièce d'identité", "Extrait de naissance récent", "Formulaire de demande"],
  },

  // Identité
  {
    id: "cni-biometrique",
    titre: "Carte nationale d'identité biométrique",
    categorie: "identite",
    description: "Carte d'identification officielle valable 10 ans pour majeurs et 5 ans pour mineurs.",
    delai: "variable selon Daïra",
    depot: "Daïra / centre biométrique",
    pieces: ["Acte de naissance 12S", "Certificat de résidence", "Photos biométriques + formulaire"],
    hasPdf: true,
    pdfLabel: "Télécharger le formulaire",
  },
  {
    id: "passeport",
    titre: "Passeport",
    categorie: "identite",
    description: "Document de voyage biométrique délivré après instruction du dossier d'identité.",
    delai: "selon instruction",
    depot: "Daïra",
    pieces: ["Acte de naissance 12S", "Carte d'identité en cours de validité", "Certificat de résidence et photos"],
    hasPdf: true,
    pdfLabel: "Télécharger le formulaire",
  },
  {
    id: "permis-conduire",
    titre: "Permis de conduire",
    categorie: "identite",
    description: "Information sur les pièces à déposer pour demande, renouvellement ou duplicata.",
    delai: "variable",
    depot: "service habilité",
    pieces: ["Pièce d'identité", "Justificatifs administratifs requis", "Formulaire de demande"],
    hasPdf: true,
    pdfLabel: "Télécharger le formulaire",
  },
  {
    id: "carte-electorale",
    titre: "Carte électorale",
    categorie: "identite",
    description: "Inscription, modification ou renouvellement de la carte électorale.",
    delai: "selon calendrier électoral",
    depot: "guichet électoral APC",
    pieces: ["Pièce d'identité", "Justificatif de résidence", "Formulaire d'inscription"],
  },

  // Certificats
  {
    id: "certificat-residence",
    titre: "Certificat de résidence",
    categorie: "certificats",
    description: "Document attestant l'adresse de résidence pour les démarches d'identité et dossiers administratifs.",
    delai: "immédiat à 24 h",
    depot: "guichet APC",
    pieces: ["Pièce d'identité", "Justificatif de domicile", "Attestation d'hébergement si nécessaire"],
  },
  {
    id: "certificat-individualite",
    titre: "Certificat d'individualité",
    categorie: "certificats",
    description: "Attestation utile en cas de divergence d'état civil ou d'homonymie dans un dossier.",
    delai: "24 à 48 h",
    depot: "guichet APC",
    pieces: ["Pièce d'identité", "Extraits d'état civil concernés", "Formulaire explicatif"],
  },
  {
    id: "procuration",
    titre: "Procuration",
    categorie: "certificats",
    description: "Formalité de mandatement avec légalisation de signature auprès du service administratif.",
    delai: "immédiat",
    depot: "guichet APC",
    pieces: ["Pièces d'identité des parties", "Texte de procuration ou formulaire", "Présence du mandant"],
  },

  // Famille
  {
    id: "sortie-mineurs",
    titre: "Sortie de mineurs à l'étranger",
    categorie: "famille",
    description: "Autorisation parentale requise pour le déplacement d'un mineur hors du territoire national.",
    delai: "24 à 48 h",
    depot: "guichet APC",
    pieces: ["Pièce d'identité du parent/tuteur", "Livret de famille", "Pièce d'identité du mineur"],
  },
  {
    id: "declaration-hebergement",
    titre: "Déclaration d'hébergement",
    categorie: "famille",
    description: "Attestation d'hébergement destinée aux dossiers administratifs nécessitant une adresse de référence.",
    delai: "immédiat à 24 h",
    depot: "guichet APC",
    pieces: ["Pièce d'identité de l'hébergeant", "Justificatif de domicile", "Copie d'identité de la personne hébergée"],
    hasPdf: true,
    pdfLabel: "Télécharger le formulaire",
  },

  // Divers administratifs
  {
    id: "service-national",
    titre: "Service national",
    categorie: "divers",
    description: "Constitution de dossier, attestations et régularisation liées à la situation vis-à-vis du service national.",
    delai: "selon instruction",
    depot: "service concerné",
    pieces: ["Pièce d'identité", "Acte de naissance", "Pièces complémentaires selon cas"],
  },
  {
    id: "immatriculation-vente-vehicule",
    titre: "Immatriculation et vente de véhicule",
    categorie: "divers",
    description: "Formalités administratives de mutation, vente et mise à jour des documents d'immatriculation.",
    delai: "variable",
    depot: "service habilité",
    pieces: ["Carte grise et pièces du véhicule", "Pièces d'identité des parties", "Actes de vente / formulaires"],
    hasPdf: true,
    pdfLabel: "Télécharger le formulaire",
    extraPdfLabel: "Déclaration de vente",
  },
  {
    id: "visa-prolongation",
    titre: "Demande de visa & prolongation de visa",
    categorie: "divers",
    description: "Orientation sur les pièces administratives locales requises pour les dossiers de visa.",
    delai: "selon instruction",
    depot: "service compétent",
    pieces: ["Pièce d'identité et justificatifs de séjour", "Documents du dossier de voyage", "Formulaire de demande"],
    hasPdf: true,
    pdfLabel: "Télécharger le formulaire",
    extraPdfLabel: "Prolongation de visa",
  },

  // Formulaires spécialisés
  {
    id: "commercant-non-sedentaire",
    titre: "Commerçant non sédentaire",
    categorie: "divers",
    description: "Dossier de demande d'autorisation pour l'exercice de commerce ambulant.",
    delai: "",
    depot: "",
    pieces: [],
  },
  {
    id: "carte-commercant-etranger",
    titre: "Carte commerçant étranger",
    categorie: "divers",
    description: "Demande et constitution du dossier administratif lié au statut de commerçant étranger.",
    delai: "",
    depot: "",
    pieces: [],
    hasPdf: true,
    pdfLabel: "Télécharger le formulaire",
  },
  {
    id: "logement-rural",
    titre: "Logement rural",
    categorie: "urbanisme",
    description: "Formulaire de demande ou de suivi administratif lié aux dispositifs de logement rural.",
    delai: "",
    depot: "",
    pieces: [],
  },
  {
    id: "licence-reunion-publique",
    titre: "Demander une licence pour organiser une réunion publique",
    categorie: "urbanisme",
    description: "Demande préalable pour la tenue d'une réunion publique dans les espaces autorisés.",
    delai: "",
    depot: "",
    pieces: [],
    hasPdf: true,
    pdfLabel: "Télécharger le formulaire",
  },
  {
    id: "certificat-morcellement",
    titre: "Demande certificat de morcellement",
    categorie: "urbanisme",
    description: "Formulaire technique pour les opérations de division foncière et vérification administrative.",
    delai: "",
    depot: "",
    pieces: [],
    hasPdf: true,
    pdfLabel: "Télécharger le formulaire",
  },
  {
    id: "permis-demolir",
    titre: "Demande permis de démolir",
    categorie: "urbanisme",
    description: "Dossier de demande d'autorisation de démolition selon la réglementation locale en vigueur.",
    delai: "",
    depot: "",
    pieces: [],
    hasPdf: true,
    pdfLabel: "Télécharger le formulaire",
  },
  {
    id: "permis-lotir",
    titre: "Demande permis de lotir",
    categorie: "urbanisme",
    description: "Demande d'autorisation de lotissement pour projets d'aménagement foncier.",
    delai: "",
    depot: "",
    pieces: [],
    hasPdf: true,
    pdfLabel: "Télécharger le formulaire",
  },
  {
    id: "etablissement-loisirs",
    titre: "Exploitation établissement de loisirs et spectacles",
    categorie: "divers",
    description: "Constitution du dossier administratif pour l'exploitation d'un établissement de loisirs.",
    delai: "",
    depot: "",
    pieces: [],
    hasPdf: true,
    pdfLabel: "Télécharger le formulaire",
  },
  {
    id: "autorisation-mariage-mixte",
    titre: "Autorisation de mariage mixte",
    categorie: "famille",
    description: "Formulaire officiel de demande d'autorisation administrative pour mariage mixte.",
    delai: "",
    depot: "",
    pieces: [],
    hasPdf: true,
    pdfLabel: "Télécharger le formulaire",
  },
  {
    id: "passeport-urgence",
    titre: "Passeport d'urgence",
    categorie: "identite",
    description: "Formulaire dédié aux demandes de passeport d'urgence dans les cas prévus par la réglementation.",
    delai: "",
    depot: "",
    pieces: [],
    hasPdf: true,
    pdfLabel: "Télécharger le formulaire",
  },
  {
    id: "formulaire-passeport-cni",
    titre: "Formulaire passeport & CNI biométriques",
    categorie: "identite",
    description: "Imprimé officiel de demande du passeport biométrique et de la carte nationale d'identité.",
    delai: "",
    depot: "",
    pieces: [],
    hasPdf: true,
    pdfLabel: "Télécharger le formulaire",
  },
  {
    id: "cni-detenteurs-passeport",
    titre: "CNI biométrique (détenteurs passeport)",
    categorie: "identite",
    description: "Formulaire CNI biométrique pour les citoyens déjà titulaires d'un passeport biométrique.",
    delai: "",
    depot: "",
    pieces: [],
    hasPdf: true,
    pdfLabel: "Télécharger le formulaire",
  },
  {
    id: "certificat-medical-permis",
    titre: "Certificat médical (permis de conduire)",
    categorie: "identite",
    description: "Certificat médical exigé dans les dossiers de demande ou renouvellement du permis de conduire.",
    delai: "",
    depot: "",
    pieces: [],
    hasPdf: true,
    pdfLabel: "Télécharger le formulaire",
  },
  {
    id: "declaration-vente-vehicule",
    titre: "Déclaration de vente de véhicule",
    categorie: "divers",
    description: "Formulaire de déclaration de vente pour mutation administrative d'un véhicule.",
    delai: "",
    depot: "",
    pieces: [],
    hasPdf: true,
    pdfLabel: "Télécharger le formulaire",
  },
  {
    id: "prolongation-visa-sejour",
    titre: "Prolongation de visa / séjour",
    categorie: "divers",
    description: "Formulaire d'extension de visa ou de séjour pour usagers étrangers.",
    delai: "",
    depot: "",
    pieces: [],
    hasPdf: true,
    pdfLabel: "Télécharger le formulaire",
  },
];

const PARCOURS = [
  { icon: ClipboardList, titre: "Préparer les pièces", desc: "Vérifiez la liste des documents nécessaires avant tout déplacement au guichet." },
  { icon: UserCheck, titre: "Déposer la demande", desc: "Présentez un dossier complet au service concerné pour lancer le traitement." },
  { icon: PackageCheck, titre: "Retirer le document", desc: "Une fois la demande instruite, retirez votre document selon la modalité indiquée." },
];

const FAQ = [
  { q: "Peut-on effectuer une demande pour un proche ?", a: "Oui. Une procuration signée, un justificatif du lien familial et une copie de pièce d'identité sont généralement requis selon la démarche." },
  { q: "Les démarches sont-elles toutes gratuites ?", a: "Certaines démarches sont gratuites, d'autres nécessitent un timbre fiscal. Le détail est indiqué pour chaque démarche dans le catalogue." },
  { q: "Peut-on préparer certaines démarches en ligne ?", a: "Les formulaires téléchargeables peuvent être remplis à l'avance. Le dépôt physique au guichet reste nécessaire pour la plupart des démarches." },
  { q: "Que faire si mon dossier est incomplet ?", a: "Rapprochez-vous du guichet compétent : nos agents vous orienteront sur les pièces manquantes et les alternatives possibles." },
];

function DemarchesPage() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<Categorie | "all">("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filtered = useMemo(() => DEMARCHES.filter((d) => {
    if (cat !== "all" && d.categorie !== cat) return false;
    if (query) {
      const q = query.toLowerCase();
      if (!d.titre.toLowerCase().includes(q) && !d.description.toLowerCase().includes(q)) return false;
    }
    return true;
  }), [query, cat]);

  const grouped = useMemo(() => {
    const map = new Map<Categorie, Demarche[]>();
    for (const d of filtered) {
      const arr = map.get(d.categorie) ?? [];
      arr.push(d);
      map.set(d.categorie, arr);
    }
    return map;
  }, [filtered]);

  const hasDetails = (d: Demarche) => d.pieces.length > 0 || d.delai || d.depot;

  return (
    <PageLayout pageTitle="Démarches administratives">
      <div className="mx-auto max-w-5xl px-5 pb-24">
        {/* Intro */}
        <p className="mb-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Consultez les pièces à fournir, les délais indicatifs, les modalités de dépôt et les formulaires téléchargeables.
        </p>

        {/* Procédures les plus demandées */}
        <section className="mb-12">
          <h2 className="mb-5 font-display text-2xl text-night">Accès rapide aux démarches prioritaires</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PROCEDURES_PRIORITAIRES.map((p) => {
              const target = DEMARCHES.find((d) => d.titre === p.titre);
              return (
                <button
                  key={p.num}
                  onClick={() => {
                    if (target) {
                      setOpenId(target.id);
                      setTimeout(() => {
                        document.getElementById(`demarche-${target.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
                      }, 100);
                    }
                  }}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 text-start transition hover:border-saffron hover:shadow-sm"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-saffron/20 font-display text-lg font-bold text-saffron">{p.num}</span>
                  <span className="text-sm font-semibold text-night">{p.titre}</span>
                  <ArrowRight className="ms-auto h-4 w-4 shrink-0 text-muted-foreground rtl:rotate-180" />
                </button>
              );
            })}
          </div>
        </section>

        {/* Search */}
        <div className="mb-4 flex items-center gap-3 rounded-full bg-cream px-5 py-3.5 shadow-sm ring-1 ring-border">
          <Search className="h-5 w-5 shrink-0 text-olive" strokeWidth={1.5} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher une démarche ou un formulaire"
            className="w-full bg-transparent text-night outline-none placeholder:text-muted-foreground"
          />
          {query && (
            <button onClick={() => setQuery("")} className="shrink-0 text-sm font-semibold text-clay hover:text-night">Effacer</button>
          )}
        </div>
        <p className="mb-6 text-xs text-muted-foreground">Exemple : passeport, certificat, mineur, résidence…</p>

        {/* Category filters */}
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setCat("all")}
            className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${cat === "all" ? "bg-saffron text-night" : "bg-secondary text-muted-foreground hover:bg-saffron/20"}`}
          >
            Toutes
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setCat(c.value)}
              className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${cat === c.value ? "bg-saffron text-night" : "bg-secondary text-muted-foreground hover:bg-saffron/20"}`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="mb-6 text-sm font-semibold text-muted-foreground">
          {filtered.length} résultat{filtered.length > 1 ? "s" : ""} affiché{filtered.length > 1 ? "s" : ""}
        </div>

        {/* Catalogue principal */}
        {cat === "all" && filtered.length > 0 ? (
          <div className="space-y-12">
            <div>
              <h3 className="mb-1 text-sm font-bold uppercase tracking-widest text-clay">Catalogue principal</h3>
              <h4 className="mb-5 font-display text-2xl text-night">Catalogue des démarches</h4>
              <div className="space-y-12">
                {CATEGORIES.slice(0, 4).map((c) => {
                  const items = grouped.get(c.value);
                  if (!items || items.length === 0) return null;
                  return (
                    <section key={c.value}>
                      <div className="mb-5 flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-olive/10 text-olive">
                          <c.icon className="h-5 w-5" strokeWidth={1.5} />
                        </div>
                        <h5 className="font-display text-xl text-night">{c.label}</h5>
                      </div>
                      <div className="space-y-4">
                        {items.map((d) => (
                          <DemarcheCard key={d.id} d={d} isOpen={openId === d.id} onToggle={() => setOpenId(openId === d.id ? null : d.id)} hasDetails={hasDetails(d)} />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            </div>

            {/* Divers administratifs */}
            {(() => {
              const items = grouped.get("divers")?.filter((d) => hasDetails(d)) ?? [];
              if (items.length === 0) return null;
              return (
                <section>
                  <div className="mb-5 flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-olive/10 text-olive">
                      <ScrollText className="h-5 w-5" strokeWidth={1.5} />
                    </div>
                    <h5 className="font-display text-xl text-night">Divers administratifs</h5>
                  </div>
                  <div className="space-y-4">
                    {items.map((d) => (
                      <DemarcheCard key={d.id} d={d} isOpen={openId === d.id} onToggle={() => setOpenId(openId === d.id ? null : d.id)} hasDetails />
                    ))}
                  </div>
                </section>
              );
            })()}

            {/* Formulaires spécialisés */}
            {(() => {
              const formItems = grouped.get("divers")?.filter((d) => !hasDetails(d)) ?? [];
              const urbanismeItems = grouped.get("urbanisme") ?? [];
              const familleForms = grouped.get("famille")?.filter((d) => !hasDetails(d)) ?? [];
              const identiteForms = grouped.get("identite")?.filter((d) => !hasDetails(d)) ?? [];
              const allForms = [...urbanismeItems, ...familleForms, ...identiteForms, ...formItems];
              if (allForms.length === 0) return null;
              return (
                <section>
                  <h3 className="mb-1 text-sm font-bold uppercase tracking-widest text-clay">Autres démarches</h3>
                  <h4 className="mb-5 font-display text-2xl text-night">Formulaires spécialisés</h4>
                  <div className="space-y-4">
                    {allForms.map((d) => (
                      <DemarcheCard key={d.id} d={d} isOpen={openId === d.id} onToggle={() => setOpenId(openId === d.id ? null : d.id)} hasDetails={false} />
                    ))}
                  </div>
                </section>
              );
            })()}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((d) => (
              <DemarcheCard key={d.id} d={d} isOpen={openId === d.id} onToggle={() => setOpenId(openId === d.id ? null : d.id)} hasDetails={hasDetails(d)} />
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="rounded-[2rem] bg-secondary p-12 text-center text-muted-foreground">
            <Search className="mx-auto mb-4 h-10 w-10 opacity-30" strokeWidth={1} />
            <p>Aucune démarche ne correspond à votre recherche.</p>
          </div>
        )}

        {/* Parcours en 3 étapes */}
        <section className="mt-20">
          <div className="mb-8 text-center">
            <div className="text-sm font-bold uppercase tracking-[0.25em] text-clay">Parcours usager</div>
            <h2 className="mt-2 font-display text-3xl text-night md:text-4xl">Votre parcours en 3 étapes</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {PARCOURS.map((p, i) => (
              <div key={i} className="rounded-[1.75rem] border border-border bg-card p-8 text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-saffron/20 text-saffron">
                  <p.icon className="h-7 w-7" strokeWidth={1.5} />
                </div>
                <div className="mt-4 text-xs font-bold uppercase tracking-widest text-clay">Étape {i + 1}</div>
                <h3 className="mt-2 font-display text-xl text-night">{p.titre}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-20">
          <div className="mb-8 flex items-center gap-3">
            <HelpCircle className="h-7 w-7 text-olive" strokeWidth={1.5} />
            <h2 className="font-display text-3xl text-night">Questions fréquentes</h2>
          </div>
          <div className="space-y-3">
            {FAQ.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-start"
                  >
                    <span className="font-semibold text-night">{item.q}</span>
                    <ChevronDown className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="border-t border-border px-5 py-4 text-sm leading-relaxed text-muted-foreground">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Assistance */}
        <section className="mt-16 overflow-hidden rounded-[2rem] bg-night p-10 text-center text-cream md:p-14">
          <Users className="mx-auto h-10 w-10 text-saffron" strokeWidth={1.5} />
          <h2 className="mt-4 font-display text-2xl md:text-3xl">Besoin d'un accompagnement pour votre dossier ?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-cream/70">
            Nos services vous orientent vers le guichet compétent, les horaires adaptés et la liste exacte des pièces avant dépôt.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <span className="flex items-center gap-2 rounded-full bg-cream/10 px-5 py-3 text-sm font-semibold">
              <Phone className="h-4 w-4 text-saffron" strokeWidth={1.5} /> 026 11 22 33
            </span>
            <span className="flex items-center gap-2 rounded-full bg-cream/10 px-5 py-3 text-sm font-semibold">
              <Clock className="h-4 w-4 text-saffron" strokeWidth={1.5} /> Dimanche à Jeudi · 08:30 à 16:30
            </span>
            <span className="flex items-center gap-2 rounded-full bg-cream/10 px-5 py-3 text-sm font-semibold">
              <MapPin className="h-4 w-4 text-saffron" strokeWidth={1.5} /> Service de l'état civil — APC
            </span>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}

function DemarcheCard({ d, isOpen, onToggle, hasDetails }: { d: Demarche; isOpen: boolean; onToggle: () => void; hasDetails: boolean }) {
  return (
    <div id={`demarche-${d.id}`} className="rounded-[1.75rem] border border-border bg-card overflow-hidden transition">
      <div className="p-6">
        <div className="mb-2">
          <span className="text-xs font-bold uppercase tracking-widest text-clay">{CAT_LABELS[d.categorie]}</span>
        </div>
        <h3 className="font-display text-xl text-night">{d.titre}</h3>
        <p className="mt-1.5 text-sm text-muted-foreground">{d.description}</p>

        {hasDetails && (d.delai || d.depot) && (
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm">
            {d.delai && (
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="h-3.5 w-3.5 text-clay" strokeWidth={1.5} /> Délai : <strong className="text-night">{d.delai}</strong>
              </span>
            )}
            {d.depot && (
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 text-clay" strokeWidth={1.5} /> Dépôt : <strong className="text-night">{d.depot}</strong>
              </span>
            )}
          </div>
        )}

        {hasDetails && (
          <div className="mt-4">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-night"><FileCheck className="h-4 w-4 text-olive" strokeWidth={1.5} /> Pièces à fournir</h4>
            {isOpen ? (
              <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                {d.pieces.map((piece) => (
                  <li key={piece} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-saffron" /> {piece}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-xs text-muted-foreground">{d.pieces.length} pièce(s) à fournir</p>
            )}
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {hasDetails && (
            <button
              onClick={onToggle}
              className="flex items-center gap-1.5 text-sm font-bold text-olive hover:text-night"
            >
              {isOpen ? "Réduire" : "Voir la démarche"} <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
          )}
          {d.hasPdf && (
            <button className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-night transition hover:bg-saffron/10">
              <FileText className="h-3.5 w-3.5" strokeWidth={1.5} /> PDF {d.pdfLabel}
            </button>
          )}
          {d.extraPdfLabel && (
            <button className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-night transition hover:bg-saffron/10">
              <FileText className="h-3.5 w-3.5" strokeWidth={1.5} /> PDF {d.extraPdfLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
