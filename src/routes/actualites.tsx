import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Calendar, ArrowRight, Newspaper } from "lucide-react";
import { PageLayout } from "@/components/site-layout";
import mairie from "@/assets/mairie.jpg";
import genet from "@/assets/genet.png";
import artisanat from "@/assets/artisanat.jpg";
import rue from "@/assets/tizi_centre.jpg";
import djurdjura from "@/assets/tizi_djurdjura.jpg";
import boulevard from "@/assets/tizi_boulevard.jpg";

export const Route = createFileRoute("/actualites")({
  head: () => ({
    meta: [
      { title: "Actualités — APC de Tizi Ouzou" },
      { name: "description", content: "Actualités et agenda des événements de la commune de Tizi Ouzou." },
    ],
  }),
  component: ActualitesPage,
});

type Article = {
  id: string;
  titre: string;
  date: string;
  categorie: string;
  image: string;
  resume: string;
  contenu: string;
  aLaUne?: boolean;
};

const ARTICLES: Article[] = [
  {
    id: "hotel-ville-restaure",
    titre: "L'Hôtel de ville s'illumine : la façade historique entièrement restaurée",
    date: "2026-11-02",
    categorie: "Patrimoine",
    image: mairie,
    resume: "Après plusieurs mois de travaux, la façade historique de l'Hôtel de ville retrouve tout son éclat.",
    contenu: "Les travaux de restauration de la façade de l'Hôtel de ville de Tizi Ouzou sont désormais achevés. Cette réhabilitation, menée par une équipe d'artisans locaux, a permis de restituer à ce bâtiment historique son aspect d'origine. Les habitants peuvent désormais admirer la façade illuminée chaque soir, place du 1er Novembre.",
    aLaUne: true,
  },
  {
    id: "plantation-2000-arbres",
    titre: "Campagne de plantation : 2 000 arbres pour les quartiers",
    date: "2026-10-29",
    categorie: "Environnement",
    image: genet,
    resume: "L'APC lance une grande campagne de plantation d'arbres dans tous les quartiers de la commune.",
    contenu: "Dans le cadre de la politique de verdissement de la commune, 2 000 arbres seront plantés dans les quartiers de Tizi Ouzou. Cette campagne, qui s'étendra sur plusieurs semaines, vise à améliorer le cadre de vie des habitants et à lutter contre la pollution urbaine. Les habitants sont invités à participer aux journées de plantation organisées chaque week-end.",
  },
  {
    id: "salon-artisanat",
    titre: "Salon de l'artisanat kabyle : appel aux exposants",
    date: "2026-10-25",
    categorie: "Culture",
    image: artisanat,
    resume: "Le salon de l'artisanat kabyle ouvre ses portes en décembre. Les inscriptions sont ouvertes.",
    contenu: "La Maison de la culture Mouloud Mammeri accueillera le salon de l'artisanat kabyle du 18 au 23 décembre 2026. Potiers, bijoutiers, tisserands et artisans de tous horizons sont invités à s'inscrire avant le 30 novembre. Le salon mettra à l'honneur le savoir-faire ancestral de la région.",
  },
  {
    id: "nouveau-boulevard",
    titre: "Inauguration du boulevard rénové du centre-ville",
    date: "2026-10-15",
    categorie: "Urbanisme",
    image: boulevard,
    resume: "Le boulevard principal du centre-ville a été entièrement réaménagé : pistes cyclables, éclairage LED et espaces piétons.",
    contenu: "Le boulevard principal du centre-ville de Tizi Ouzou a été entièrement réaménagé. Les travaux ont inclus la création de pistes cyclables, l'installation d'un éclairage LED basse consommation et l'élargissement des trottoirs. Cette rénovation s'inscrit dans le plan global de modernisation de la commune.",
  },
  {
    id: "festival-djurdjura",
    titre: "Festival de la montagne au Djurdjura : un week-end grandeur nature",
    date: "2026-10-10",
    categorie: "Culture",
    image: djurdjura,
    resume: "Le festival de la montagne a réuni des centaines de visiteurs pour célébrer le massif du Djurdjura.",
    contenu: "Le festival de la montagne, organisé au pied du massif du Djurdjura, a connu un franc succès. Randonnées, expositions photographiques, concerts de musique kabyle et dégustations de produits locaux ont animé ce week-end. L'APC remercie tous les participants et les partenaires qui ont contribué à la réussite de cet événement.",
  },
  {
    id: "rue-pietonne",
    titre: "Une nouvelle rue piétonne au cœur de Tizi",
    date: "2026-10-05",
    categorie: "Urbanisme",
    image: rue,
    resume: "Une rue du centre-ville est désormais entièrement piétonne, avec des terrasses et des espaces de détente.",
    contenu: "Une nouvelle rue piétonne a été inaugurée dans le centre-ville de Tizi Ouzou. Cet aménagement offre aux habitants et aux visiteurs un espace de promenade et de détente, avec des terrasses, des bancs et des espaces verts. Cette initiative vise à redynamiser le commerce de proximité et à améliorer la qualité de vie en centre-ville.",
  },
];

const AGENDA = [
  { jour: "12", mois: "NOV", titre: "Conseil municipal ouvert au public", lieu: "Salle des délibérations" },
  { jour: "18", mois: "NOV", titre: "Festival de la poterie", lieu: "Maison de la culture Mouloud Mammeri" },
  { jour: "24", mois: "NOV", titre: "Marathon de Tizi Ouzou", lieu: "Départ : Stade du 1er Novembre" },
  { jour: "05", mois: "DÉC", titre: "Journée portes ouvertes de l'état civil", lieu: "Hôtel de ville" },
  { jour: "12", mois: "JAN", titre: "Yennayer 2977 — célébrations", lieu: "Place de l'Olivier" },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function ActualitesPage() {
  const aLaUne = ARTICLES.find((a) => a.aLaUne);
  const autres = ARTICLES.filter((a) => !a.aLaUne);

  return (
    <PageLayout pageTitle="Actualités & agenda">
      <div className="mx-auto max-w-7xl px-5 pb-24">
        <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
          {/* Articles */}
          <div className="grid gap-6">
            {aLaUne && (
              <article className="reveal group relative overflow-hidden rounded-[2rem]">
                <img src={aLaUne.image} alt={aLaUne.titre} loading="lazy" className="aspect-[16/9] w-full object-cover transition duration-[1.5s] group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-night via-night/30 to-transparent" />
                <div className="relative bg-night p-5 text-cream sm:absolute sm:bottom-0 sm:bg-transparent sm:p-8">
                  <span className="rounded-full bg-saffron px-3 py-1 text-xs font-bold text-night">À la une · {formatDate(aLaUne.date)}</span>
                  <h2 className="mt-4 max-w-2xl font-display text-2xl sm:text-3xl md:text-5xl">{aLaUne.titre}</h2>
                </div>
              </article>
            )}
            <div className="grid gap-6 sm:grid-cols-2">
              {autres.map((a, k) => (
                <article key={a.id} className="reveal group cursor-pointer rounded-[1.5rem] border border-border bg-card overflow-hidden transition hover:shadow-[var(--shadow-soft)]" style={{ transitionDelay: `${k * 60}ms` }}>
                  <div className="overflow-hidden">
                    <img src={a.image} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover transition duration-1000 group-hover:scale-110" />
                  </div>
                  <div className="p-5">
                    <div className="text-xs font-bold uppercase tracking-widest text-clay">{formatDate(a.date)}</div>
                    <span className="mt-1 inline-block rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">{a.categorie}</span>
                    <h3 className="mt-2 font-display text-xl leading-snug text-night group-hover:text-olive">{a.titre}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{a.resume}</p>
                    <div className="mt-3 flex items-center gap-1 text-sm font-bold text-olive">
                      Lire la suite <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Agenda sidebar */}
          <aside className="reveal rounded-[2rem] bg-secondary p-8">
            <h3 className="font-display text-3xl text-night">Agenda</h3>
            <div className="mt-2 h-1 w-12 rounded bg-saffron" />
            <ul className="mt-6 divide-y divide-border">
              {AGENDA.map((e) => (
                <li key={e.titre} className="reveal agenda-item group flex gap-5 py-5">
                  <div className="w-14 shrink-0 text-center">
                    <div className="font-display text-4xl leading-none text-clay transition group-hover:text-olive">{e.jour}</div>
                    <div className="text-xs font-bold tracking-widest text-muted-foreground">{e.mois}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-night">{e.titre}</div>
                    <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} /> {e.lieu}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </PageLayout>
  );
}
