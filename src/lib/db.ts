import { PGlite } from "@electric-sql/pglite";

export type SignalementCategorie =
  | "proprete"
  | "eclairage"
  | "voirie"
  | "espaces_verts"
  | "etat_civil"
  | "autres";

export type SignalementStatut = "soumis" | "en_cours" | "resolu" | "ferme";

export type Signalement = {
  id: string;
  numero_suivi: string;
  categorie: SignalementCategorie;
  titre: string;
  description: string;
  adresse: string;
  latitude: number | null;
  longitude: number | null;
  urgence: "faible" | "moyenne" | "elevee";
  nom_declarant: string | null;
  telephone_declarant: string | null;
  email_declarant: string | null;
  photo_path: string | null;
  statut: SignalementStatut;
  created_at: string;
  updated_at: string;
};

export type SignalementHistorique = {
  id: string;
  signalement_id: string;
  statut: SignalementStatut;
  commentaire: string;
  created_at: string;
};

const SCHEMA = `
CREATE TABLE IF NOT EXISTS signalements (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  numero_suivi TEXT UNIQUE NOT NULL,
  categorie TEXT NOT NULL DEFAULT 'autres',
  titre TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  adresse TEXT NOT NULL DEFAULT '',
  latitude REAL,
  longitude REAL,
  urgence TEXT NOT NULL DEFAULT 'moyenne',
  nom_declarant TEXT,
  telephone_declarant TEXT,
  email_declarant TEXT,
  photo_path TEXT,
  statut TEXT NOT NULL DEFAULT 'soumis',
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE TABLE IF NOT EXISTS signalements_historique (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  signalement_id TEXT NOT NULL REFERENCES signalements(id) ON DELETE CASCADE,
  statut TEXT NOT NULL,
  commentaire TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_signalements_numero ON signalements(numero_suivi);
CREATE INDEX IF NOT EXISTS idx_historique_signalement ON signalements_historique(signalement_id);
`;

let dbPromise: Promise<PGlite> | undefined;

export async function getDb(): Promise<PGlite> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = new PGlite("idb://apc-tizi");
      await db.exec(SCHEMA);
      return db;
    })();
  }
  return dbPromise;
}

export function genererNumeroSuivi(): string {
  const annee = new Date().getFullYear();
  const random = Math.floor(10000 + Math.random() * 89999);
  return `TZO-${annee}-${random}`;
}

export async function creerSignalement(
  data: Omit<
    Signalement,
    "id" | "numero_suivi" | "statut" | "created_at" | "updated_at"
  >,
): Promise<Signalement> {
  const db = await getDb();
  const numero = genererNumeroSuivi();
  await db.query(
    `INSERT INTO signalements
      (numero_suivi, categorie, titre, description, adresse, latitude, longitude, urgence, nom_declarant, telephone_declarant, email_declarant, photo_path)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
    [
      numero,
      data.categorie,
      data.titre,
      data.description,
      data.adresse,
      data.latitude,
      data.longitude,
      data.urgence,
      data.nom_declarant,
      data.telephone_declarant,
      data.email_declarant,
      data.photo_path,
    ],
  );
  await db.query(
    `INSERT INTO signalements_historique (signalement_id, statut, commentaire)
     SELECT id, 'soumis', 'Signalement soumis par un citoyen' FROM signalements WHERE numero_suivi = $1`,
    [numero],
  );
  const result = await db.query<Signalement>(
    "SELECT * FROM signalements WHERE numero_suivi = $1",
    [numero],
  );
  return result.rows[0]!;
}

export async function trouverSignalement(
  numero: string,
): Promise<Signalement | null> {
  const db = await getDb();
  const result = await db.query<Signalement>(
    "SELECT * FROM signalements WHERE numero_suivi = $1",
    [numero.trim()],
  );
  return result.rows[0] ?? null;
}

export async function getHistorique(
  signalementId: string,
): Promise<SignalementHistorique[]> {
  const db = await getDb();
  const result = await db.query<SignalementHistorique>(
    "SELECT * FROM signalements_historique WHERE signalement_id = $1 ORDER BY created_at ASC",
    [signalementId],
  );
  return result.rows;
}

export const CATEGORIES: { value: SignalementCategorie; label: string; icon: string }[] = [
  { value: "proprete", label: "Propreté", icon: "Trash2" },
  { value: "eclairage", label: "Éclairage public", icon: "Lightbulb" },
  { value: "voirie", label: "Voirie", icon: "Construction" },
  { value: "espaces_verts", label: "Espaces verts", icon: "Trees" },
  { value: "etat_civil", label: "État civil", icon: "ScrollText" },
  { value: "autres", label: "Autres", icon: "MoreHorizontal" },
];

export const STATUTS: { value: SignalementStatut; label: string; couleur: string }[] = [
  { value: "soumis", label: "Soumis", couleur: "text-saffron" },
  { value: "en_cours", label: "En cours de traitement", couleur: "text-olive" },
  { value: "resolu", label: "Résolu", couleur: "text-leaf" },
  { value: "ferme", label: "Fermé", couleur: "text-muted-foreground" },
];
