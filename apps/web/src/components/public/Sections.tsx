import type { SiteContent } from "@tpb/contracts";
import { DriveImage } from "../DriveImage";
import { Band } from "./ui";

export function Stats({ items, anchor }: { items: SiteContent["stats"]; anchor?: string }) {
  return (
    <section id={anchor} className="scroll-mt-24 bg-cream py-12 sm:py-20">
      <div className="mx-auto grid max-w-[1360px] grid-cols-2 gap-3 sm:gap-5 px-4 sm:px-5 lg:grid-cols-4 lg:px-10">
        {items.map((item) => (
          <div key={`${item.label}-${item.value}`} className="reveal rounded-2xl sm:rounded-3xl border border-midnight/10 bg-white p-4 sm:p-6">
            <p className="font-display text-2xl sm:text-4xl font-extrabold text-midnight break-words">
              {item.value}<span className="text-gold">{item.suffix}</span>
            </p>
            <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-midnight/60 break-words">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function About({ about, anchor = "profil" }: { about: SiteContent["about"]; anchor?: string }) {
  return (
    <Band id={anchor} kicker={about.kicker} title={about.title} intro={about.body} tone="cream">
      <div className="grid gap-6 sm:gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div className="reveal overflow-hidden rounded-2xl sm:rounded-[2rem] bg-midnight">
          <DriveImage src={about.image} alt="" className="h-full max-h-[360px] sm:max-h-[520px] w-full object-cover" />
        </div>
        <div className="space-y-5 sm:space-y-7">
          <div className="reveal rounded-2xl sm:rounded-3xl bg-midnight p-5 sm:p-7 text-white">
            <p className="font-display text-4xl sm:text-5xl font-extrabold text-gold">{about.sinceYear}</p>
            <p className="mt-2 text-xs sm:text-sm text-white/70">{about.sinceNote}</p>
          </div>
          <ul className="reveal grid gap-2.5 sm:gap-3">
            {about.points.map((point) => (
              <li key={point} className="flex items-start gap-2.5 sm:gap-3 rounded-xl sm:rounded-2xl border border-midnight/10 bg-white p-3.5 sm:p-4 text-xs sm:text-sm text-midnight/70">
                <span className="mt-0.5 text-leaf-600 shrink-0">✦</span>
                <span className="break-words">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Band>
  );
}

export function Programs({ programs, onDaftar, anchor = "akademik" }: { programs: SiteContent["programs"]; onDaftar: () => void; anchor?: string }) {
  return (
    <Band id={anchor} tone="white" kicker={programs.kicker} title={programs.title}>
      <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
        {programs.cards.map((card) => (
          <article key={`${card.tag}-${card.title}`} className="reveal group overflow-hidden rounded-2xl sm:rounded-3xl bg-midnight text-white flex flex-col">
            {card.img ? (
              <div className="h-44 sm:h-52 overflow-hidden shrink-0">
                <DriveImage src={card.img} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              </div>
            ) : null}
            <div className="p-5 sm:p-6 flex-1 flex flex-col">
              <span className="font-mono text-[11px] sm:text-xs uppercase tracking-wider text-gold">{card.tag}</span>
              <h3 className="mt-2.5 sm:mt-3 font-display text-xl sm:text-2xl font-bold break-words">{card.title}</h3>
              <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm leading-relaxed text-white/65 break-words flex-1">{card.body}</p>
            </div>
          </article>
        ))}
      </div>
      <button onClick={onDaftar} className="mt-6 sm:mt-8 rounded-full bg-midnight px-6 py-3 sm:px-7 sm:py-3.5 text-xs sm:text-sm font-bold text-white transition hover:bg-midnight-700 active:scale-95">
        {programs.cta}
      </button>
    </Band>
  );
}

export function Research({ research, anchor = "penelitian" }: { research: SiteContent["research"]; anchor?: string }) {
  return (
    <Band id={anchor} kicker={research.kicker} title={research.title} intro={research.body}>
      <div className="grid gap-4 sm:gap-5 lg:grid-cols-2">
        {research.areas.map((area) => (
          <article key={area.no} className="reveal rounded-2xl sm:rounded-3xl bg-midnight p-5 sm:p-7 text-white">
            <span className="font-mono text-xs text-gold">{area.no}</span>
            <h3 className="mt-3 sm:mt-5 font-display text-xl sm:text-2xl font-bold break-words">{area.title}</h3>
            <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm leading-relaxed text-white/65 break-words">{area.body}</p>
          </article>
        ))}
      </div>
      <div className="mt-5 sm:mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {research.metrics.map((metric) => (
          <div key={`${metric.v}-${metric.l}`} className="reveal rounded-xl sm:rounded-2xl border border-midnight/10 bg-white p-3.5 sm:p-5">
            <p className="font-display text-2xl sm:text-3xl font-extrabold text-leaf-600 break-words">{metric.v}</p>
            <p className="mt-1 text-[11px] sm:text-xs text-midnight/55 break-words">{metric.l}</p>
          </div>
        ))}
      </div>
    </Band>
  );
}

export function Community({ community, anchor = "pengabdian" }: { community: SiteContent["community"]; anchor?: string }) {
  return (
    <Band id={anchor} tone="white" kicker={community.kicker} title={community.title} intro={community.body}>
      <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div className="reveal overflow-hidden rounded-2xl sm:rounded-[2rem]">
          <DriveImage src={community.image} alt="" className="max-h-[320px] sm:max-h-[500px] w-full object-cover" />
        </div>
        <ul className="reveal space-y-2.5 sm:space-y-3">
          {community.items.map((item) => (
            <li key={item} className="rounded-xl sm:rounded-2xl bg-cream p-4 sm:p-5 text-xs sm:text-sm leading-relaxed text-midnight/75 break-words">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </Band>
  );
}

export function StudentLife({ studentLife, onDaftar, anchor = "kemahasiswaan" }: { studentLife: SiteContent["studentLife"]; onDaftar: () => void; anchor?: string }) {
  return (
    <Band id={anchor} kicker={studentLife.kicker} title={studentLife.title}>
      <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
        {studentLife.cards.map((card) => (
          <article key={`${card.tag}-${card.title}`} className="reveal rounded-2xl sm:rounded-3xl border border-midnight/10 bg-white p-5 sm:p-7">
            <span className="font-mono text-[11px] sm:text-xs uppercase tracking-wider text-leaf-600">{card.tag}</span>
            <h3 className="mt-3 sm:mt-4 font-display text-xl sm:text-2xl font-bold text-midnight break-words">{card.title}</h3>
            <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm leading-relaxed text-midnight/65 break-words">{card.body}</p>
          </article>
        ))}
      </div>
      <button onClick={onDaftar} className="mt-6 sm:mt-8 rounded-full bg-gold px-6 py-3 sm:px-7 sm:py-3.5 text-xs sm:text-sm font-extrabold text-midnight transition hover:bg-gold-light active:scale-95">
        {studentLife.cta}
      </button>
    </Band>
  );
}
