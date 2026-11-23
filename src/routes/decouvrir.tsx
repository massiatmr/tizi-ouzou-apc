import { createFileRoute } from "@tanstack/react-router";
import { MapPin, ArrowUpRight, Mountain, Building2, Sparkles, Trees, Camera } from "lucide-react";
import { PageLayout } from "@/components/site-layout";
import djurdjura from "@/assets/tizi_djurdjura.jpg";
import statue from "@/assets/statue.jpg";
import mairie from "@/assets/mairie.jpg";
import artisanat from "@/assets/artisanat.jpg";
import village from "@/assets/tizi_village.jpg";
import genet from "@/assets/genet.png";
import rue from "@/assets/tizi_centre.jpg";
import vue from "@/assets/tizi_vue.jpg";
import nuit from "@/assets/tizi_nuit.jpg";
import boulevard from "@/assets/tizi_boulevard.jpg";
import belloua from "@/assets/tizi_belloua.jpg";

export const Route = createFileRoute("/decouvrir")({
  head: () => ({
    meta: [
      { title: "Découvrir Tizi Ouzou — APC de Tizi Ouzou" },
      { name: "description", content: "Patrimoine, paysages, artisanat et culture de Tizi Ouzou et de sa région." },
    ],
  }),
  component: DecouvrirPage,
});

type Lieu = {
  nom: string;
  categorie: string;
  description: string;
  image: string;
  histoire: string;
  acces: string;
  conseil: string;
  grand?: boolean;
};

const LIEUX: Lieu[] = [
  {
    nom: "Le massif du Djurdjura",
    categorie: "Nature",
    description: "Le joyau naturel de la Kabylie, culminant à plus de 2 300 mètres.",
    image: djurdjura,
    histoire: "Le Djurdjura, ou Adrar n'Djerjer en kabyle, est un massif montagneux qui borde Tizi Ouzou au sud. Ses sommets enneigés en hiver et ses forêts de cèdres en font un site de randonnée réputé dans toute l'Algérie.",
    acces: "Accessible en voiture depuis Tizi Ouzou, direction sud, environ 45 minutes jusqu'au col de Tirourda.",
    conseil: "Prévoyez des chaussures de marche et de l'eau. Le meilleur moment pour la randonnée est d'avril à octobre.",
    grand: true,
  },
  {
    nom: "Statue monumentale",
    categorie: "Monument",
    description: "L'un des monuments emblématiques de la ville.",
    image: statue,
    histoire: "Cette statue rend hommage à l'histoire et à la résistance du peuple kabyle. Elle trône au centre de la ville et constitue un point de repère pour les habitants comme pour les visiteurs.",
    acces: "Centre-ville, accessible à pied depuis la place du 1er Novembre.",
    conseil: "À découvrir de jour comme de nuit, éclairée à la tombée du jour.",
  },
  {
    nom: "Hôtel de ville",
    categorie: "Patrimoine",
    description: "L'édifice historique de l'APC, récemment restauré.",
    image: mairie,
    histoire: "L'Hôtel de ville est un bâtiment historique qui abrite l'Assemblée Populaire Communale. Sa façade, entièrement restaurée en 2026, témoigne de l'architecture coloniale adaptée aux styles locaux.",
    acces: "Boulevard Abane Ramdane, centre-ville.",
    conseil: "La façade illuminée se découvre en soirée.",
  },
  {
    nom: "Poterie & bijoux kabyles",
    categorie: "Artisanat",
    description: "Le savoir-faire ancestral des artisans de la région.",
    image: artisanat,
    histoire: "L'artisanat kabyle est réputé pour sa poterie ornée de motifs berbères et ses bijoux en argent ciselés. Ces traditions remontent à des siècles et se transmettent de génération en génération.",
    acces: "Marché de l'artisanat et boutiques du centre-ville.",
    conseil: "Le salon de l'artisanat en décembre est l'occasion idéale de découvrir ces savoir-faire.",
  },
  {
    nom: "Le Djurdjura au couchant",
    categorie: "Montagne",
    description: "Les couleurs du soleil couchant sur les sommets.",
    image: village,
    histoire: "Au coucher du soleil, les sommets du Djurdjura prennent des teintes dorées et orangées spectaculaires. Ce panorama unique attire photographes et amoureux de la nature.",
    acces: "Visible depuis de nombreux points de la ville et des villages alentours.",
    conseil: "Le point de vue depuis la route du col offre la meilleure perspective.",
  },
  {
    nom: "Genêts en fleurs",
    categorie: "Nature",
    description: "Les fleurs jaunes emblématiques de la Kabylie.",
    image: genet,
    histoire: "Le genêt épineux, ou azuki en kabyle, est la fleur emblématique de la région. Sa floraison au printemps transforme les collines en tapis dorés. C'est le symbole choisi par la commune.",
    acces: "Visible partout dans la région au printemps (mars-mai).",
    conseil: "La période de pleine floraison est fin avril.",
  },
  {
    nom: "Le centre-ville",
    categorie: "Vie urbaine",
    description: "L'effervescence du cœur de Tizi Ouzou.",
    image: rue,
    histoire: "Le centre-ville de Tizi Ouzou est un lieu de rencontre et de commerce animé. Ses rues commerçantes, ses cafés et ses marchés reflètent la vitalité de la ville.",
    acces: "Centre-ville, accessible en transport en commun.",
    conseil: "Le marché du dimanche matin est le plus animé.",
  },
  {
    nom: "La ville dans sa vallée",
    categorie: "Panorama",
    description: "Tizi Ouzou nichée entre montagnes et vallées.",
    image: vue,
    histoire: "Tizi Ouzou, dont le nom signifie « col des genêts », est située dans une vallée verdoyante entourée de montagnes. Cette position géographique en a historically un carrefour commercial et culturel.",
    acces: "Vue panoramique depuis les hauteurs de la ville.",
    conseil: "Le point de vue depuis la route de Bougie offre la meilleure vue d'ensemble.",
    grand: true,
  },
  {
    nom: "Tizi Ouzou la nuit",
    categorie: "Panorama",
    description: "La ville illuminée à la tombée du jour.",
    image: nuit,
    histoire: "La nuit, Tizi Ouzou révèle une autre facette de son caractère. Les lumières de la ville se reflètent dans le ciel kabyle, créant une ambiance unique.",
    acces: "Visible depuis les hauteurs de la ville.",
    conseil: "À contempler depuis le pont illuminé.",
  },
  {
    nom: "Le boulevard principal",
    categorie: "Vie urbaine",
    description: "L'artère rénovée du centre-ville.",
    image: boulevard,
    histoire: "Le boulevard principal, récemment réaménagé, est devenu un lieu de promenade prisé des habitants. Pistes cyclables, éclairage moderne et espaces piétons en font un modèle d'urbanisme durable.",
    acces: "Centre-ville, accessible à pied.",
    conseil: "À découvrir en fin d'après-midi pour profiter des terrasses.",
  },
  {
    nom: "Tizi Belloua",
    categorie: "Patrimoine",
    description: "Un quartier historique aux ruelles typiques.",
    image: belloua,
    histoire: "Tizi Belloua est l'un des quartiers les plus anciens de la ville. Ses ruelles étroites, ses maisons traditionnelles et son atmosphere préservée en font un lieu de mémoire vivant.",
    acces: "Quartier historique, accessible à pied depuis le centre.",
    conseil: "Promenez-vous sans but précis pour en saisir toute l'atmosphère.",
  },
];

function DecouvrirPage() {
  return (
    <PageLayout pageTitle="Découvrir Tizi Ouzou">
      <div className="mx-auto max-w-7xl px-5 pb-24">
        <p className="mb-12 text-lg text-muted-foreground">Patrimoine, paysages, artisanat et culture : explorez la richesse de Tizi Ouzou et de sa région.</p>

        {/* Gallery grid */}
        <div className="grid auto-rows-[200px] grid-cols-2 gap-4 md:auto-rows-[260px] md:grid-cols-4">
          {LIEUX.map((lieu, k) => (
            <div
              key={lieu.nom}
              className={`reveal motion-card gallery-tile group relative overflow-hidden rounded-[1.5rem] transition-transform duration-300 ${lieu.grand ? "col-span-2 row-span-2" : ""}`}
              style={{ transitionDelay: `${k * 50}ms` }}
            >
              <img src={lieu.image} alt={lieu.nom} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-[1.2s] group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-night/85 via-night/20 to-transparent opacity-80 transition group-hover:opacity-100" />
              <div className="gallery-caption absolute bottom-0 p-5">
                <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-saffron">{lieu.categorie}</div>
                <div className="font-display text-lg md:text-2xl text-cream">{lieu.nom}</div>
                <p className="mt-1 text-xs text-cream/70">{lieu.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed sections */}
        <div className="mt-20 space-y-12">
          <h2 className="reveal font-display text-3xl text-night md:text-4xl">À voir, à faire</h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Mountain, titre: "Randonnée au Djurdjura", desc: "Sentiers balisés pour tous les niveaux, du col de Tirourda aux sommets." },
              { icon: Sparkles, titre: "Artisanat kabyle", desc: "Poterie, bijoux, tapis : découvrez le savoir-faire des artisans locaux." },
              { icon: Building2, titre: "Patrimoine bâti", desc: "Hôtel de ville, monuments historiques et quartiers anciens." },
              { icon: Trees, titre: "Nature & balades", desc: "Genêts en fleurs, forêts de cèdres et vallées verdoyantes." },
              { icon: Camera, titre: "Photographie", desc: "Points de vue panoramiques et lumière exceptionnelle au coucher du soleil." },
              { icon: MapPin, titre: "Vie urbaine", desc: "Marchés, cafés et ruelles animées du centre-ville." },
            ].map((c, k) => (
              <div
                key={c.titre}
                className="reveal rounded-[1.5rem] border border-border bg-card p-6 transition hover:shadow-[var(--shadow-soft)]"
                style={{ transitionDelay: `${k * 60}ms` }}
              >
                <c.icon className="h-8 w-8 text-olive" strokeWidth={1.25} />
                <h3 className="mt-4 font-display text-xl text-night">{c.titre}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="mt-20">
          <h2 className="reveal mb-6 font-display text-3xl text-night md:text-4xl">Localisation</h2>
          <div className="reveal overflow-hidden rounded-[2rem] border border-border">
            <iframe
              title="Carte de Tizi Ouzou"
              className="h-80 w-full"
              loading="lazy"
              src="https://www.openstreetmap.org/export/embed.html?bbox=4.03%2C36.70%2C4.09%2C36.73&layer=mapnik&marker=36.7169%2C4.0497"
            />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
