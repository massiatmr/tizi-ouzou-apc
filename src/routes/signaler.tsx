import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Trash2, Lightbulb, Construction, Trees, ScrollText, MoreHorizontal,
  ArrowRight, ArrowLeft, MapPin, Camera, Check, X, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/site-layout";
import { creerSignalement, CATEGORIES, type SignalementCategorie } from "@/lib/db";
import { toast } from "sonner";

export const Route = createFileRoute("/signaler")({
  head: () => ({
    meta: [
      { title: "Signaler un problème — APC de Tizi Ouzou" },
      { name: "description", content: "Signalez un problème de voirie, éclairage, propreté ou autre à la commune de Tizi Ouzou." },
    ],
  }),
  component: SignalerPage,
});

const ICONS: Record<string, typeof Trash2> = {
  Trash2, Lightbulb, Construction, Trees, ScrollText, MoreHorizontal,
};

type FormState = {
  categorie: SignalementCategorie | null;
  titre: string;
  description: string;
  adresse: string;
  latitude: number | null;
  longitude: number | null;
  urgence: "faible" | "moyenne" | "elevee";
  nom: string;
  telephone: string;
  email: string;
  photo: string | null;
};

const STEPS = ["Catégorie", "Détails", "Localisation", "Contact", "Confirmation"] as const;

function SignalerPage() {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [numeroSuivi, setNumeroSuivi] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({
    categorie: null,
    titre: "",
    description: "",
    adresse: "",
    latitude: null,
    longitude: null,
    urgence: "moyenne",
    nom: "",
    telephone: "",
    email: "",
    photo: null,
  });

  const update = (patch: Partial<FormState>) => setForm((f) => ({ ...f, ...patch }));

  const canNext = () => {
    if (step === 0) return form.categorie !== null;
    if (step === 1) return form.titre.trim().length >= 3 && form.description.trim().length >= 10;
    if (step === 2) return form.adresse.trim().length >= 3;
    return true;
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("La photo ne doit pas dépasser 5 Mo"); return; }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) { toast.error("Format accepté : JPG, PNG ou WebP"); return; }
    const reader = new FileReader();
    reader.onload = () => update({ photo: reader.result as string });
    reader.readAsDataURL(file);
  };

  const useGeolocation = () => {
    if (!navigator.geolocation) { toast.error("La géolocalisation n'est pas disponible sur cet appareil"); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        update({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        toast.success("Position détectée : " + pos.coords.latitude.toFixed(4) + ", " + pos.coords.longitude.toFixed(4));
      },
      () => toast.error("Impossible d'obtenir votre position"),
    );
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      const s = await creerSignalement({
        categorie: form.categorie!,
        titre: form.titre.trim(),
        description: form.description.trim(),
        adresse: form.adresse.trim(),
        latitude: form.latitude,
        longitude: form.longitude,
        urgence: form.urgence,
        nom_declarant: form.nom.trim() || null,
        telephone_declarant: form.telephone.trim() || null,
        email_declarant: form.email.trim() || null,
        photo_path: form.photo,
      });
      setNumeroSuivi(s.numero_suivi);
      setStep(4);
      toast.success("Signalement enregistré !");
    } catch {
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  if (numeroSuivi && step === 4) {
    return (
      <PageLayout pageTitle="Signaler un problème">
        <div className="mx-auto max-w-2xl px-5 pb-24">
          <div className="reveal rounded-[2rem] bg-leaf p-10 text-center text-night">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-night text-leaf">
              <Check className="h-10 w-10" strokeWidth={2} />
            </div>
            <h2 className="mt-6 font-display text-3xl md:text-4xl">Signalement enregistré</h2>
            <p className="mt-3 text-night/80">Votre numéro de suivi :</p>
            <div className="mt-2 inline-block rounded-2xl bg-night px-8 py-4 font-display text-3xl font-bold text-saffron">{numeroSuivi}</div>
            <p className="mt-4 text-sm text-night/70">Conservez ce numéro pour suivre l'évolution de votre signalement.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild className="rounded-full bg-night text-cream hover:bg-night/90">
                <a href={`/suivre?numero=${numeroSuivi}`}>Suivre mon signalement <ArrowRight className="h-4 w-4" /></a>
              </Button>
              <Button asChild variant="outline" className="rounded-full border-night/30 bg-transparent text-night hover:bg-night/10">
                <a href="/signaler">Nouveau signalement</a>
              </Button>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout pageTitle="Signaler un problème">
      <div className="mx-auto max-w-3xl px-5 pb-24">
        {/* Stepper */}
        <div className="mb-10 flex items-center gap-2">
          {STEPS.slice(0, 4).map((s, i) => (
            <div key={s} className="flex flex-1 items-center gap-2">
              <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold transition ${i <= step ? "bg-saffron text-night" : "bg-muted text-muted-foreground"}`}>{i + 1}</div>
              <span className={`hidden text-xs font-semibold sm:block ${i <= step ? "text-night" : "text-muted-foreground"}`}>{s}</span>
              {i < 3 && <div className={`h-0.5 flex-1 rounded ${i < step ? "bg-saffron" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        <div className="rounded-[2rem] border border-border bg-card p-6 md:p-10">
          {/* Step 0: Categorie */}
          {step === 0 && (
            <div>
              <h2 className="font-display text-2xl text-night">Quel type de problème ?</h2>
              <p className="mt-1 text-sm text-muted-foreground">Sélectionnez la catégorie qui correspond le mieux.</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {CATEGORIES.map((cat) => {
                  const Icon = ICONS[cat.icon] ?? MoreHorizontal;
                  return (
                    <button
                      key={cat.value}
                      onClick={() => update({ categorie: cat.value })}
                      className={`reveal group flex items-center gap-4 rounded-2xl border-2 p-5 text-start transition ${form.categorie === cat.value ? "border-saffron bg-saffron/10" : "border-border hover:border-saffron/50"}`}
                    >
                      <span className="grid h-12 w-12 place-items-center rounded-full bg-olive/10 text-olive transition group-hover:bg-saffron group-hover:text-night">
                        <Icon className="h-5 w-5" strokeWidth={1.5} />
                      </span>
                      <span className="text-lg font-semibold text-night">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 1: Details */}
          {step === 1 && (
            <div>
              <h2 className="font-display text-2xl text-night">Décrivez le problème</h2>
              <div className="mt-6 space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-night">Titre <span className="text-destructive">*</span></label>
                  <input
                    value={form.titre}
                    onChange={(e) => update({ titre: e.target.value })}
                    placeholder="Ex : Lampadaire cassé rue des Genêts"
                    maxLength={120}
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-night outline-none focus:ring-2 focus:ring-saffron"
                  />
                  <span className="mt-1 block text-xs text-muted-foreground">{form.titre.length}/120</span>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-night">Description détaillée <span className="text-destructive">*</span></label>
                  <textarea
                    value={form.description}
                    onChange={(e) => update({ description: e.target.value })}
                    placeholder="Décrivez le problème en détail : quand l'avez-vous remarqué, quelle est l'ampleur, y a-t-il un danger immédiat…"
                    rows={5}
                    maxLength={1000}
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-night outline-none focus:ring-2 focus:ring-saffron"
                  />
                  <span className="mt-1 block text-xs text-muted-foreground">{form.description.length}/1000</span>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-night">Niveau d'urgence</label>
                  <div className="flex gap-2">
                    {[
                      { v: "faible", l: "Faible" },
                      { v: "moyenne", l: "Moyenne" },
                      { v: "elevee", l: "Élevée" },
                    ].map((u) => (
                      <button
                        key={u.v}
                        onClick={() => update({ urgence: u.v as FormState["urgence"] })}
                        className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${form.urgence === u.v ? "bg-saffron text-night" : "bg-muted text-muted-foreground hover:bg-saffron/20"}`}
                      >
                        {u.l}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-night">Photo (optionnel)</label>
                  {form.photo ? (
                    <div className="relative inline-block">
                      <img src={form.photo} alt="Aperçu" className="max-h-48 rounded-xl" />
                      <button onClick={() => update({ photo: null })} className="absolute -top-2 -right-2 grid h-8 w-8 place-items-center rounded-full bg-destructive text-destructive-foreground">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-border p-5 text-muted-foreground transition hover:border-saffron">
                      <Camera className="h-6 w-6" strokeWidth={1.5} />
                      <span className="text-sm">Ajouter une photo (JPG, PNG, WebP — 5 Mo max)</span>
                      <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhoto} className="hidden" />
                    </label>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Localisation */}
          {step === 2 && (
            <div>
              <h2 className="font-display text-2xl text-night">Où se trouve le problème ?</h2>
              <p className="mt-1 text-sm text-muted-foreground">Indiquez l'adresse ou utilisez votre position actuelle.</p>
              <div className="mt-6 space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-night">Adresse ou lieu <span className="text-destructive">*</span></label>
                  <input
                    value={form.adresse}
                    onChange={(e) => update({ adresse: e.target.value })}
                    placeholder="Ex : Rue des Genêts, près de l'école El Feth"
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-night outline-none focus:ring-2 focus:ring-saffron"
                  />
                </div>
                <Button variant="outline" onClick={useGeolocation} className="rounded-full border-olive/40 text-olive hover:bg-olive/10">
                  <MapPin className="h-4 w-4" strokeWidth={1.5} /> Utiliser ma position actuelle
                </Button>
                {form.latitude !== null && form.longitude !== null && (
                  <div className="flex items-center gap-2 rounded-xl bg-leaf/15 p-3 text-sm text-night">
                    <MapPin className="h-4 w-4 text-olive" strokeWidth={1.5} />
                    Position enregistrée : {form.latitude.toFixed(4)}, {form.longitude.toFixed(4)}
                  </div>
                )}
                <div className="overflow-hidden rounded-2xl border border-border">
                  <iframe
                    title="Carte interactive"
                    className="h-64 w-full"
                    loading="lazy"
                    src="https://www.google.com/maps?q=36.7169,4.0497&z=14&output=embed"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Vous pouvez également déplacer le marqueur sur la carte pour affiner la localisation.</p>
              </div>
            </div>
          )}

          {/* Step 3: Contact */}
          {step === 3 && (
            <div>
              <h2 className="font-display text-2xl text-night">Vos coordonnées (optionnel)</h2>
              <p className="mt-1 text-sm text-muted-foreground">Pour être informé du traitement de votre signalement.</p>
              <div className="mt-6 space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-night">Nom et prénom</label>
                  <input
                    value={form.nom}
                    onChange={(e) => update({ nom: e.target.value })}
                    placeholder="Votre nom"
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-night outline-none focus:ring-2 focus:ring-saffron"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-night">Téléphone</label>
                  <input
                    value={form.telephone}
                    onChange={(e) => update({ telephone: e.target.value })}
                    placeholder="Ex : 06 12 34 56 78"
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-night outline-none focus:ring-2 focus:ring-saffron"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-night">Email</label>
                  <input
                    value={form.email}
                    onChange={(e) => update({ email: e.target.value })}
                    placeholder="votre.email@exemple.dz"
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-night outline-none focus:ring-2 focus:ring-saffron"
                  />
                </div>
                <div className="rounded-xl bg-secondary p-4 text-sm text-muted-foreground">
                  <p>Récapitulatif :</p>
                  <ul className="mt-2 space-y-1">
                    <li>Catégorie : {CATEGORIES.find((c) => c.value === form.categorie)?.label}</li>
                    <li>Titre : {form.titre}</li>
                    <li>Adresse : {form.adresse}</li>
                    <li>Urgence : {form.urgence}</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          {step < 4 && (
            <div className="mt-8 flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="text-muted-foreground hover:text-night"
              >
                <ArrowLeft className="h-4 w-4" /> Précédent
              </Button>
              {step < 3 ? (
                <Button
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canNext()}
                  className="rounded-full bg-saffron text-night hover:bg-saffron/90"
                >
                  Continuer <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={submit}
                  disabled={submitting}
                  className="rounded-full bg-saffron text-night hover:bg-saffron/90"
                >
                  {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Envoi…</> : <>Envoyer le signalement <ArrowRight className="h-4 w-4" /></>}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
