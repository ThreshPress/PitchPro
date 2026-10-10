import type { ReactNode } from "react";
import { Check, Clock } from "lucide-react";
import type { DayPlan } from "@/lib/soccer/engine";
import { formatNumber } from "@/lib/soccer/engine";
import { cn } from "@/lib/cn";

export function SessionDetail({
  day,
  coach,
  logged,
  onToggle,
  showHero = false,
}: {
  day: DayPlan;
  coach: boolean;
  logged: boolean;
  onToggle?: () => void;
  showHero?: boolean;
}) {
  return (
    <div className="flex flex-col gap-4">
      {showHero ? (
        <header>
          <p className="kicker">
            {day.weekday} · {day.kindLabel}
          </p>
          <h1 className="mt-2 flex items-baseline gap-2 font-display text-5xl leading-none text-ink md:text-6xl">
            <span>{formatNumber(day.touches)}</span>
            <span className="font-sans text-lg font-medium text-muted">touches</span>
          </h1>
          <p className="mt-3 max-w-xl text-base text-ink">{day.sentence}</p>
          {day.lever ? (
            <div className="mt-4 max-w-xl rounded-2xl border border-pitch/40 bg-pitch-soft px-4 py-3">
              <p className="kicker">The detail</p>
              <p className="mt-1 font-display text-3xl leading-none text-ink">{day.lever.title}</p>
              <p className="mt-2 text-sm text-ink">{day.lever.cue}</p>
              <p className="mt-2 text-sm text-muted">{day.lever.why}</p>
            </div>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-2">
            <Pill icon={<Clock className="size-4" />} label={`${day.minutes} min on the ball`} />
            <Pill label={day.themeLabel} />
            {day.film ? <Pill label={`${day.film.minutes} min film${day.film.optional ? " · optional" : ""}`} /> : null}
          </div>
        </header>
      ) : (
        <header>
          <p className="kicker">
            {day.weekday} · {day.kindLabel}
          </p>
          <h2 className="mt-1 font-display text-3xl text-ink">{day.themeLabel}</h2>
          <p className="mt-2 text-sm text-ink">{day.sentence}</p>
          <p className="mt-2 text-sm text-muted">
            {formatNumber(day.touches)} touches · {day.minutes} min
            {day.film ? ` · ${day.film.minutes} min film` : ""}
          </p>
        </header>
      )}

      {day.equipment.length > 0 ? (
        <p className="text-sm text-muted">
          <span className="font-semibold text-ink">Set out: </span>
          {day.equipment.join(" · ")}
        </p>
      ) : null}

      <ol className="flex flex-col gap-3">
        {day.blocks.map((block, index) => (
          <li
            key={block.id}
            className={cn(
              "card border-l-4 p-4 md:p-5",
              block.slot === "tactical" || block.slot === "team" ? "border-l-cone" : "border-l-pitch",
            )}
          >
            <div className="flex items-baseline justify-between gap-3">
              <p className="kicker">
                {String(index + 1).padStart(2, "0")} · {block.kicker}
              </p>
              {block.minutes > 0 ? (
                <p className="text-sm text-muted">
                  {block.minutes} min
                  {block.touches > 0 ? ` · ${formatNumber(block.touches)}` : ""}
                </p>
              ) : null}
            </div>
            <h3 className="mt-1 font-display text-2xl text-ink">{block.title}</h3>
            <p className="mt-2 text-sm text-ink">{block.setup}</p>
            <ol className="mt-3 flex list-decimal flex-col gap-1.5 pl-5 text-sm text-ink">
              {block.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <ul className="mt-3 flex flex-col gap-1">
              {block.cues.map((cue) => (
                <li key={cue} className="text-sm text-ink">
                  <span className="font-semibold text-pitch">Cue · </span>
                  {cue}
                </li>
              ))}
            </ul>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              <p className="rounded-xl bg-paper px-3 py-2 text-sm text-ink">
                <span className="font-semibold">If it is messy. </span>
                {block.easyFix}
              </p>
              <p className="rounded-xl bg-paper px-3 py-2 text-sm text-ink">
                <span className="font-semibold">If it is easy. </span>
                {block.hardFix}
              </p>
            </div>
            <p className={cn("mt-3 text-sm", coach ? "rounded-xl bg-pitch-soft px-3 py-2 text-ink" : "text-muted")}>
              <span className="font-semibold text-ink">{coach ? "Coach eye. " : "Notice. "}</span>
              {block.see}
            </p>
            {block.caution ? <p className="mt-2 text-sm font-medium text-cone">{block.caution}</p> : null}
          </li>
        ))}
      </ol>

      {day.film ? (
        <section className="card p-4 md:p-5">
          <p className="kicker">
            {day.film.title} · {day.film.minutes} min
          </p>
          <h3 className="mt-1 font-display text-2xl text-ink">What to watch</h3>
          <p className="mt-2 text-sm text-ink">{day.film.watch}</p>
          <ul className="mt-3 flex flex-col gap-1 text-sm">
            {day.film.lookFor.map((item) => (
              <li key={item}>
                <span className="font-semibold text-pitch">Look for · </span>
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-4 grid gap-2 md:grid-cols-2">
            {day.film.players.map((person) => (
              <p key={person.name} className="rounded-xl bg-paper px-3 py-2 text-sm">
                <span className="font-semibold">{person.name}. </span>
                {person.why}
              </p>
            ))}
          </div>
          <p className="mt-3 text-sm font-medium text-ink">{day.film.prompt}</p>
        </section>
      ) : (
        <p className="text-sm text-muted">No screen today. The ball is the whole assignment.</p>
      )}

      {onToggle ? (
        <button type="button" className={cn("btn", logged ? "btn-secondary" : "btn-primary")} onClick={onToggle}>
          <Check className="size-4" />
          {logged ? "Logged for this day" : "Log this session"}
        </button>
      ) : null}
    </div>
  );
}

function Pill({ label, icon }: { label: string; icon?: ReactNode }) {
  return (
    <span className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-line bg-card px-3 text-sm font-medium text-ink">
      {icon}
      {label}
    </span>
  );
}
