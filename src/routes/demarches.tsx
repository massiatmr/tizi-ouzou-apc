import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Search, FileText, ArrowRight, Clock, MapPin, FileCheck, Download,
  ChevronDown, HelpCircle, UserCheck, ClipboardList, PackageCheck,
  Baby, Heart, Globe, Car, IdCard, Vote, Home, ShieldCheck, Building2,
  ScrollText, FileSignature, Users,
} from "lucide-react";
import { PageLayout } from "@/components/site-layout";

export const Route = createFileRoute("/demarches")({
  head: () => ({
    meta: [
      { title: "Démarches administratives — APC de Tizi Ouzou" },
      { name: "description", content: "Consultez les pièces à fournir, les délais indicatifs, les modalités de dépôt et les formulaires téléchargeables pour les 32 démarches de la commune de Tizi Ouzou." },
    ],
  }),
  component: DemarchesPage,
});

type Categorie = "etat_civil" | "identite" | "certificats" | "famille" | "divers" | "formulaires";

type Demarche = {
  id: string;
  titre: string;
  categorie: Categorie;
  description: string;
  documents: string[];
  etapes: string[];
  delai: string;
  cout: string;
  lieu: string;
  formulaire?: boolean;
};

const CATEGORIES: { value: Categorie; label: string; icon: typeof FileText }[] = [
  { value: "etat_civil", label: "État civil", icon: Baby },
  { value: "identite", label: "Identité", icon: IdCard },
  { value: "certificats", label: "Certificats", icon: FileSignature },
  { value: "famille", label: "Famille & autorisations", icon: Heart },
  { value: "divers", label: "Divers administratifs", icon: Building2 },
  { value: "formulaires", label: "Formulaires spécialisés", icon: ScrollText },
];

const CAT_LABELS: Record<Categorie, string> = {
  etat_civil: "État civil",
  identite: "Identité",
  certificats: "Certificats",
  famille: "Famille & autorisations",
  divers: "Divers administratifs",
  formulaires: "Formulaires spécialisés",
};

const DEMARCHES: Demarche[] = [
  // État civil
  {
    id: "naissance-12s",
    titre: "Extrait de naissance 12S",
    categorie: "etat_civil",
    description: "Document sécurisé requis pour les démarches d'identité biométrique et passeport.",
    documents: ["Carte d'identité nationale du demandeur", "Date et lieu de naissance de l'intéressé", "Timbre fiscal (selon tarif en vigueur)"],
    etapes: ["Se présenter au bureau d'état civil", "Remplir le formulaire S12", "Déposer les pièces requises", "Retrait du document"],
    delai: "48 heures",
    cout: "Timbre fiscal",
    lieu: "Bureau d'état civil — Hôtel de ville",
  },
  {
    id: "acte-mariage",
    titre: "Acte de mariage & mariage mixte",
    categorie: "etat_civil",
    description: "Extrait ou copie intégrale de l'acte de mariage établi par la commune de célébration.",
    documents: ["Carte d'identité nationale", "Livret de famille (si disponible)", "Information sur la date et lieu du mariage"],
    etapes: ["Se présenter au bureau d'état civil", "Indiquer la date et le lieu du mariage", "Retrait du document"],
    delai: "48 heures",
    cout: "Timbre fiscal",
    lieu: "Bureau d'état civil — Hôtel de ville",
  },
  {
    id: "acte-deces",
    titre: "Acte de décès",
    categorie: "etat_civil",
    description: "Document officiel attestant le décès d'une personne enregistrée auprès des services communaux.",
    documents: ["Carte d'identité nationale du demandeur", "Information sur le défunt (date et lieu du décès)", "Pièce d'identité du défunt (si disponible)"],
    etapes: ["Se présenter au bureau d'état civil", "Fournir les informations sur le défunt", "Retrait du document"],
    delai: "24 à 48 heures",
    cout: "Timbre fiscal",
    lieu: "Bureau d'état civil — Hôtel de ville",
  },
  {
    id: "fiche-familiale",
    titre: "Fiche familiale",
    categorie: "etat_civil",
    description: "Document synthétique de la composition familiale à jour dans les registres communaux.",
    documents: ["Livret de famille", "Carte d'identité nationale du demandeur"],
    etapes: ["Se présenter au bureau d'état civil", "Présenter le livret de famille", "Retrait du document"],
    delai: "48 heures",
    cout: "Timbre fiscal",
    lieu: "Bureau d'état civil — Hôtel de ville",
  },
  {
    id: "attestation-non-mariage",
    titre: "Attestation de non mariage",
    categorie: "etat_civil",
    description: "Attestation administrative certifiant la situation matrimoniale actuelle du demandeur.",
    documents: ["Carte d'identité nationale", "Extrait de naissance 12S"],
    etapes: ["Se présenter au bureau d'état civil", "Fournir l'extrait de naissance", "Retrait de l'attestation"],
    delai: "72 heures",
    cout: "Timbre fiscal",
    lieu: "Bureau d'état civil — Hôtel de ville",
  },

  // Identité
  {
    id: "cni-biometrique",
    titre: "Carte nationale d'identité biométrique",
    categorie: "identite",
    description: "Carte d'identification officielle valable 10 ans pour majeurs et 5 ans pour mineurs.",
    documents: ["Extrait de naissance 12S", "Carte d'identité ancienne (si renouvellement)", "Justificatif de domicile", "Timbre fiscal", "Photo d'identité récente"],
    etapes: ["Retirer le formulaire CNI au guichet", "Constituer le dossier avec les pièces requises", "Dépôt du dossier et prise d'empreintes", "Retrait de la carte après notification"],
    delai: "30 à 60 jours",
    cout: "Timbre fiscal",
    lieu: "Service d'identité — Hôtel de ville",
  },
  {
    id: "passeport",
    titre: "Passeport",
    categorie: "identite",
    description: "Document de voyage biométrique délivré après instruction du dossier d'identité.",
    documents: ["Extrait de naissance 12S", "Carte d'identité nationale", "Justificatif de domicile", "Timbre fiscal (tarif passeport)", "Photo d'identité récente", "Ancien passeport (si renouvellement)"],
    etapes: ["Retirer le formulaire de passeport", "Constituer le dossier complet", "Dépôt au service d'identité", "Retrait du passeport après notification"],
    delai: "30 à 60 jours",
    cout: "Timbre fiscal (tarif passeport)",
    lieu: "Service d'identité — Hôtel de ville",
  },
  {
    id: "permis-conduire",
    titre: "Permis de conduire",
    categorie: "identite",
    description: "Information sur les pièces à déposer pour demande, renouvellement ou duplicata.",
    documents: ["Carte d'identité nationale", "Certificat médical (pour renouvellement)", "Ancien permis (si renouvellement ou duplicata)", "Photo d'identité", "Timbre fiscal"],
    etapes: ["Se présenter au service compétent", "Déposer le dossier complet", "Suivre les instructions du service", "Retrait du permis"],
    delai: "Selon procédure",
    cout: "Timbre fiscal",
    lieu: "Service de la circulation — Hôtel de ville",
  },
  {
    id: "carte-electorale",
    titre: "Carte électorale",
    categorie: "identite",
    description: "Inscription, modification ou renouvellement de la carte électorale.",
    documents: ["Carte d'identité nationale", "Justificatif de domicile", "Acte de naissance (pour première inscription)"],
    etapes: ["Se présenter au service des élections", "Remplir le formulaire d'inscription", "Vérification et traitement", "Réception de la carte d'électeur"],
    delai: "30 jours",
    cout: "Gratuit",
    lieu: "Service des élections — Hôtel de ville",
  },

  // Certificats
  {
    id: "certificat-residence",
    titre: "Certificat de résidence",
    categorie: "certificats",
    description: "Document attestant l'adresse de résidence pour les démarches d'identité et dossiers administratifs.",
    documents: ["Carte d'identité nationale", "Justificatif de domicile (facture d'eau ou d'électricité)"],
    etapes: ["Se présenter au bureau d'état civil", "Fournir les pièces justificatives", "Retrait le jour même"],
    delai: "Immédiat",
    cout: "Gratuit",
    lieu: "Bureau d'état civil — Hôtel de ville",
  },
  {
    id: "certificat-individualite",
    titre: "Certificat d'individualité",
    categorie: "certificats",
    description: "Attestation utile en cas de divergence d'état civil ou d'homonymie dans un dossier.",
    documents: ["Carte d'identité nationale", "Extrait de naissance 12S"],
    etapes: ["Se présenter au bureau d'état civil", "Fournir les pièces justificatives", "Retrait du certificat"],
    delai: "48 heures",
    cout: "Timbre fiscal",
    lieu: "Bureau d'état civil — Hôtel de ville",
  },
  {
    id: "procuration",
    titre: "Procuration",
    categorie: "certificats",
    description: "Formalité de mandatement avec légalisation de signature auprès du service administratif.",
    documents: ["Carte d'identité nationale du mandant", "Carte d'identité nationale du mandataire", "Document de procuration rédigé", "Timbre fiscal"],
    etapes: ["Se présenter en personne avec le mandataire", "Signer devant l'agent communal", "Retrait immédiat"],
    delai: "Immédiat",
    cout: "Timbre fiscal",
    lieu: "Accueil de la mairie — Hôtel de ville",
  },

  // Famille / autorisations
  {
    id: "sortie-mineurs",
    titre: "Sortie de mineurs à l'étranger",
    categorie: "famille",
    description: "Autorisation parentale requise pour le déplacement d'un mineur hors du territoire national.",
    documents: ["Carte d'identité nationale du parent", "Extrait de naissance de l'enfant", "Passeport de l'enfant (si disponible)", "Timbre fiscal"],
    etapes: ["Se présenter au service compétent", "Remplir le formulaire d'autorisation", "Déposer les pièces", "Retrait de l'autorisation"],
    delai: "48 heures",
    cout: "Timbre fiscal",
    lieu: "Accueil de la mairie — Hôtel de ville",
  },
  {
    id: "declaration-hebergement",
    titre: "Déclaration d'hébergement",
    categorie: "famille",
    description: "Attestation d'hébergement destinée aux dossiers administratifs nécessitant une adresse de référence.",
    documents: ["Carte d'identité nationale de l'hébergeant", "Justificatif de domicile", "Carte d'identité de l'hébergé (si disponible)"],
    etapes: ["Se présenter à l'accueil de la mairie", "Remplir la déclaration d'hébergement", "Signature devant l'agent communal", "Retrait immédiat"],
    delai: "Immédiat",
    cout: "Timbre fiscal",
    lieu: "Accueil de la mairie — Hôtel de ville",
  },

  // Divers administratifs
  {
    id: "service-national",
    titre: "Service national",
    categorie: "divers",
    description: "Constitution de dossier, attestations et régularisation liées à la situation vis-à-vis du service national.",
    documents: ["Carte d'identité nationale", "Extrait de naissance 12S", "Diplôme ou certificat de scolarité"],
    etapes: ["Se présenter au service compétent", "Constituer le dossier", "Suivre les instructions du service"],
    delai: "Selon procédure",
    cout: "Gratuit",
    lieu: "Service de l'accueil — Hôtel de ville",
  },
  {
    id: "immatriculation-vente-vehicule",
    titre: "Immatriculation et vente de véhicule",
    categorie: "divers",
    description: "Formalités administratives de mutation, vente et mise à jour des documents d'immatriculation.",
    documents: ["Carte d'identité nationale", "Carte grise du véhicule", "Contrat de vente ou de cession", "Timbre fiscal"],
    etapes: ["Se présenter au service de la circulation", "Déposer le dossier complet", "Retrait des documents mis à jour"],
    delai: "Selon procédure",
    cout: "Timbre fiscal",
    lieu: "Service de la circulation — Hôtel de ville",
  },
  {
    id: "visa-prolongation",
    titre: "Demande de visa & prolongation de visa",
    categorie: "divers",
    description: "Orientation sur les pièces administratives locales requises pour les dossiers de visa.",
    documents: ["Passeport en cours de validité", "Justificatif de domicile", "Motif de la demande de visa"],
    etapes: ["Se présenter au service compétent", "Constituer le dossier", "Suivre les instructions du service"],
    delai: "Selon procédure",
    cout: "Selon tarif",
    lieu: "Accueil de la mairie — Hôtel de ville",
  },

  // Formulaires spécialisés
  {
    id: "commercant-non-sedentaire",
    titre: "Commerçant non sédentaire",
    categorie: "formulaires",
    description: "Dossier de demande d'autorisation pour l'exercice de commerce ambulant.",
    documents: ["Carte d'identité nationale", "Registre du commerce (si existant)", "Casier judiciaire", "Timbre fiscal"],
    etapes: ["Retirer le formulaire", "Constituer le dossier", "Dépôt au service compétent"],
    delai: "Selon procédure",
    cout: "Timbre fiscal",
    lieu: "Service de l'urbanisme — Hôtel de ville",
    formulaire: true,
  },
  {
    id: "carte-commercant-etranger",
    titre: "Carte commerçant étranger",
    categorie: "formulaires",
    description: "Demande et constitution du dossier administratif lié au statut de commerçant étranger.",
    documents: ["Passeport en cours de validité", "Registre du commerce", "Casier judiciaire", "Timbre fiscal"],
    etapes: ["Retirer le formulaire", "Constituer le dossier", "Dépôt au service compétent"],
    delai: "Selon procédure",
    cout: "Timbre fiscal",
    lieu: "Service de l'urbanisme — Hôtel de ville",
    formulaire: true,
  },
  {
    id: "logement-rural",
    titre: "Logement rural",
    categorie: "formulaires",
    description: "Formulaire de demande ou de suivi administratif lié aux dispositifs de logement rural.",
    documents: ["Carte d'identité nationale", "Acte de propriété du terrain", "Plan de situation"],
    etapes: ["Retirer le formulaire", "Constituer le dossier", "Dépôt au service de l'urbanisme"],
    delai: "Selon procédure",
    cout: "Gratuit",
    lieu: "Service de l'urbanisme — Hôtel de ville",
    formulaire: true,
  },
  {
    id: "licence-reunion-publique",
    titre: "Licence pour organiser une réunion publique",
    categorie: "formulaires",
    description: "Demande préalable pour la tenue d'une réunion publique dans les espaces autorisés.",
    documents: ["Carte d'identité nationale du demandeur", "Note descriptive de la réunion", "Date et lieu envisagés"],
    etapes: ["Retirer le formulaire", "Constituer le dossier", "Dépôt à l'accueil de la mairie"],
    delai: "15 jours",
    cout: "Gratuit",
    lieu: "Accueil de la mairie — Hôtel de ville",
    formulaire: true,
  },
  {
    id: "certificat-morcellement",
    titre: "Certificat de morcellement",
    categorie: "formulaires",
    description: "Formulaire technique pour les opérations de division foncière et vérification administrative.",
    documents: ["Acte de propriété", "Plan du terrain", "Carte d'identité nationale", "Plan de morcellement"],
    etapes: ["Retirer le formulaire", "Constituer le dossier technique", "Dépôt au service de l'urbanisme"],
    delai: "Selon procédure",
    cout: "Selon barème",
    lieu: "Service de l'urbanisme — Hôtel de ville",
    formulaire: true,
  },
  {
    id: "permis-demolir",
    titre: "Permis de démolir",
    categorie: "formulaires",
    description: "Dossier de demande d'autorisation de démolition selon la réglementation locale en vigueur.",
    documents: ["Acte de propriété", "Plan du bâtiment à démolir", "Carte d'identité nationale", "Note justificative"],
    etapes: ["Retirer le formulaire", "Constituer le dossier", "Dépôt au service de l'urbanisme"],
    delai: "1 à 2 mois",
    cout: "Selon barème",
    lieu: "Service de l'urbanisme — Hôtel de ville",
    formulaire: true,
  },
  {
    id: "permis-lotir",
    titre: "Permis de lotir",
    categorie: "formulaires",
    description: "Demande d'autorisation de lotissement pour projets d'aménagement foncier.",
    documents: ["Acte de propriété du terrain", "Plan de lotissement", "Plan de situation", "Carte d'identité nationale", "Étude technique"],
    etapes: ["Retirer le formulaire", "Constituer le dossier technique", "Dépôt au service de l'urbanisme", "Enquête publique si nécessaire"],
    delai: "2 à 3 mois",
    cout: "Selon barème",
    lieu: "Service de l'urbanisme — Hôtel de ville",
    formulaire: true,
  },
  {
    id: "etablissement-loisirs",
    titre: "Exploitation d'établissement de loisirs et spectacles",
    categorie: "formulaires",
    description: "Constitution du dossier administratif pour l'exploitation d'un établissement de loisirs.",
    documents: ["Carte d'identité nationale", "Registre du commerce", "Plan des locaux", "Règlement intérieur de l'établissement"],
    etapes: ["Retirer le formulaire", "Constituer le dossier", "Dépôt au service compétent"],
    delai: "Selon procédure",
    cout: "Timbre fiscal",
    lieu: "Service de l'urbanisme — Hôtel de ville",
    formulaire: true,
  },
  {
    id: "autorisation-mariage-mixte",
    titre: "Autorisation de mariage mixte",
    categorie: "formulaires",
    description: "Formulaire officiel de demande d'autorisation administrative pour mariage mixte.",
    documents: ["Carte d'identité nationale", "Passeport du conjoint étranger", "Extrait de naissance 12S", "Certificat de célibat du conjoint étranger"],
    etapes: ["Retirer le formulaire", "Constituer le dossier", "Dépôt au bureau d'état civil"],
    delai: "Selon procédure",
    cout: "Timbre fiscal",
    lieu: "Bureau d'état civil — Hôtel de ville",
    formulaire: true,
  },
  {
    id: "passeport-urgence",
    titre: "Passeport d'urgence",
    categorie: "formulaires",
    description: "Formulaire dédié aux demandes de passeport d'urgence dans les cas prévus par la réglementation.",
    documents: ["Carte d'identité nationale", "Justificatif de l'urgence (billet, document officiel)", "Photo d'identité", "Timbre fiscal"],
    etapes: ["Retirer le formulaire", "Constituer le dossier avec justificatif d'urgence", "Dépôt au service d'identité"],
    delai: "48 à 72 heures",
    cout: "Timbre fiscal (tarif urgence)",
    lieu: "Service d'identité — Hôtel de ville",
    formulaire: true,
  },
  {
    id: "formulaire-passeport-cni",
    titre: "Formulaire passeport & CNI biométriques",
    categorie: "formulaires",
    description: "Imprimé officiel de demande du passeport biométrique et de la carte nationale d'identité.",
    documents: ["Extrait de naissance 12S", "Carte d'identité nationale", "Justificatif de domicile", "Timbre fiscal"],
    etapes: ["Retirer le formulaire au guichet", "Remplir les rubriques requises", "Dépôt avec les pièces justificatives"],
    delai: "30 à 60 jours",
    cout: "Timbre fiscal",
    lieu: "Service d'identité — Hôtel de ville",
    formulaire: true,
  },
  {
    id: "cni-detenteurs-passeport",
    titre: "CNI biométrique (détenteurs passeport)",
    categorie: "formulaires",
    description: "Formulaire CNI biométrique pour les citoyens déjà titulaires d'un passeport biométrique.",
    documents: ["Passeport biométrique en cours de validité", "Extrait de naissance 12S", "Justificatif de domicile"],
    etapes: ["Retirer le formulaire", "Constituer le dossier", "Dépôt au service d'identité"],
    delai: "30 à 60 jours",
    cout: "Timbre fiscal",
    lieu: "Service d'identité — Hôtel de ville",
    formulaire: true,
  },
  {
    id: "certificat-medical-permis",
    titre: "Certificat médical (permis de conduire)",
    categorie: "formulaires",
    description: "Certificat médical exigé dans les dossiers de demande ou renouvellement du permis de conduire.",
    documents: ["Carte d'identité nationale", "Permis de conduire (si renouvellement)", "Photo d'identité"],
    etapes: ["Retirer le formulaire", "Passer la visite médicale", "Dépôt du certificat au service compétent"],
    delai: "Selon procédure",
    cout: "Frais médicaux",
    lieu: "Service de la circulation — Hôtel de ville",
    formulaire: true,
  },
  {
    id: "declaration-vente-vehicule",
    titre: "Déclaration de vente de véhicule",
    categorie: "formulaires",
    description: "Formulaire de déclaration de vente pour mutation administrative d'un véhicule.",
    documents: ["Carte d'identité nationale", "Carte grise du véhicule", "Contrat de vente"],
    etapes: ["Retirer le formulaire", "Remplir la déclaration de vente", "Dépôt au service de la circulation"],
    delai: "Immédiat",
    cout: "Timbre fiscal",
    lieu: "Service de la circulation — Hôtel de ville",
    formulaire: true,
  },
  {
    id: "prolongation-visa-sejour",
    titre: "Prolongation de visa / séjour",
    categorie: "formulaires",
    description: "Formulaire d'extension de visa ou de séjour pour usagers étrangers.",
    documents: ["Passeport en cours de validité", "Justificatif de domicile", "Motif de la prolongation", "Timbre fiscal"],
    etapes: ["Retirer le formulaire", "Constituer le dossier", "Dépôt au service compétent"],
    delai: "Selon procédure",
    cout: "Timbre fiscal",
    lieu: "Accueil de la mairie — Hôtel de ville",
    formulaire: true,
  },
];

const PARCOURS = [
  { icon: ClipboardList, titre: "Préparer les pièces", desc: "Vérifiez la liste des documents nécessaires avant tout déplacement au guichet." },
  { icon: UserCheck, titre: "Déposer la demande", desc: "Présentez un dossier complet au service concerné pour lancer le traitement." },
  { icon: PackageCheck, titre: "Retirer le document", desc: "Une fois la demande instruite, retirez votre document selon la modalité indiquée." },
];

const FAQ = [
  { q: "Où retirer les formulaires administratifs ?", a: "Tous les formulaires sont disponibles aux guichets concernés de l'Hôtel de ville, aux horaires d'ouverture : dimanche à jeudi, 8h00–16h30." },
  { q: "Puis-je déposer une demande pour un tiers ?", a: "Oui, muni d'une procuration légalisée et d'une copie de la pièce d'identité du mandant, vous pouvez déposer une demande au nom d'un tiers." },
  { q: "Comment connaître l'état d'avancement de ma demande ?", a: "Vous pouvez suivre l'état de votre signalement ou demande via la page « Suivre ma demande » avec votre numéro de suivi." },
  { q: "Que faire si un document me manque ?", a: "Rapprochez-vous du guichet compétent : nos agents vous orienteront sur les alternatives possibles selon votre situation." },
  { q: "Les démarches sont-elles payantes ?", a: "La plupart des démarches nécessitent un timbre fiscal. Certaines attestations sont gratuites. Le coût est indiqué pour chaque démarche dans le catalogue." },
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

  return (
    <PageLayout pageTitle="Démarches administratives">
      <div className="mx-auto max-w-5xl px-5 pb-24">
        {/* Intro */}
        <p className="mb-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Consultez les pièces à fournir, les délais indicatifs, les modalités de dépôt et les formulaires téléchargeables pour les {DEMARCHES.length} démarches de la commune.
        </p>

        {/* Search */}
        <div className="mb-6 flex items-center gap-3 rounded-full bg-cream px-5 py-3.5 shadow-sm ring-1 ring-border">
          <Search className="h-5 w-5 shrink-0 text-olive" strokeWidth={1.5} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher une démarche ou un formulaire…"
            className="w-full bg-transparent text-night outline-none placeholder:text-muted-foreground"
          />
          {query && (
            <button onClick={() => setQuery("")} className="shrink-0 text-sm font-semibold text-clay hover:text-night">Effacer</button>
          )}
        </div>

        {/* Category filters */}
        <div className="mb-10 flex flex-wrap gap-2">
          <button
            onClick={() => setCat("all")}
            className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${cat === "all" ? "bg-saffron text-night" : "bg-secondary text-muted-foreground hover:bg-saffron/20"}`}
          >
            Toutes ({DEMARCHES.length})
          </button>
          {CATEGORIES.map((c) => {
            const count = DEMARCHES.filter((d) => d.categorie === c.value).length;
            return (
              <button
                key={c.value}
                onClick={() => setCat(c.value)}
                className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${cat === c.value ? "bg-saffron text-night" : "bg-secondary text-muted-foreground hover:bg-saffron/20"}`}
              >
                <c.icon className="h-4 w-4" strokeWidth={1.5} />
                {c.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Results count */}
        <div className="mb-6 text-sm font-semibold text-muted-foreground">
          {filtered.length} résultat{filtered.length > 1 ? "s" : ""} affiché{filtered.length > 1 ? "s" : ""}
        </div>

        {/* Grouped list */}
        {cat === "all" && filtered.length > 0 ? (
          <div className="space-y-12">
            {CATEGORIES.map((c) => {
              const items = grouped.get(c.value);
              if (!items || items.length === 0) return null;
              return (
                <section key={c.value}>
                  <div className="mb-5 flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-olive/10 text-olive">
                      <c.icon className="h-5 w-5" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-display text-2xl text-night">{c.label}</h3>
                    <span className="text-sm font-semibold text-muted-foreground">({items.length})</span>
                  </div>
                  <div className="space-y-4">
                    {items.map((d, k) => (
                      <DemarcheCard key={d.id} d={d} isOpen={openId === d.id} onToggle={() => setOpenId(openId === d.id ? null : d.id)} delay={k * 50} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((d, k) => (
              <DemarcheCard key={d.id} d={d} isOpen={openId === d.id} onToggle={() => setOpenId(openId === d.id ? null : d.id)} delay={k * 50} />
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
            <div className="text-sm font-bold uppercase tracking-[0.25em] text-clay">Votre parcours</div>
            <h2 className="mt-2 font-display text-3xl text-night md:text-4xl">Votre parcours en 3 étapes</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {PARCOURS.map((p, i) => (
              <div key={i} className="reveal rounded-[1.75rem] border border-border bg-card p-8 text-center" style={{ transitionDelay: `${i * 100}ms` }}>
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

        {/* Help CTA */}
        <section className="mt-16 overflow-hidden rounded-[2rem] bg-night p-10 text-center text-cream md:p-14">
          <Users className="mx-auto h-10 w-10 text-saffron" strokeWidth={1.5} />
          <h2 className="mt-4 font-display text-2xl md:text-3xl">Besoin d'un accompagnement pour votre dossier ?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-cream/70">
            Nos services vous orientent vers le guichet compétent, les horaires adaptés et la liste exacte des pièces avant dépôt.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <span className="flex items-center gap-2 rounded-full bg-cream/10 px-5 py-3 text-sm font-semibold">
              <Clock className="h-4 w-4 text-saffron" strokeWidth={1.5} /> Dimanche–Jeudi : 8h00–16h30
            </span>
            <span className="flex items-center gap-2 rounded-full bg-cream/10 px-5 py-3 text-sm font-semibold">
              <MapPin className="h-4 w-4 text-saffron" strokeWidth={1.5} /> Hôtel de ville, Bd Abane Ramdane
            </span>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}

function DemarcheCard({ d, isOpen, onToggle, delay }: { d: Demarche; isOpen: boolean; onToggle: () => void; delay: number }) {
  return (
    <div className="reveal rounded-[1.75rem] border border-border bg-card overflow-hidden transition" style={{ transitionDelay: `${delay}ms` }}>
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-5 p-6 text-start"
      >
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-olive/10 text-olive">
          <FileText className="h-6 w-6" strokeWidth={1.25} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-clay">{CAT_LABELS[d.categorie]}</span>
            {d.formulaire && (
              <span className="rounded-full bg-saffron/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-saffron">Formulaire</span>
            )}
          </div>
          <div className="mt-1 font-display text-xl text-night">{d.titre}</div>
          <div className="mt-1 text-sm text-muted-foreground">{d.description}</div>
        </div>
        <ArrowRight className={`h-5 w-5 shrink-0 text-muted-foreground transition ${isOpen ? "rotate-90" : ""}`} />
      </button>
      {isOpen && (
        <div className="border-t border-border px-6 py-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h4 className="flex items-center gap-2 font-semibold text-night"><FileCheck className="h-4 w-4 text-olive" strokeWidth={1.5} /> Pièces à fournir</h4>
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
}
