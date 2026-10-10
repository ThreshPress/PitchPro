import { useMemo, useState } from "react";
import { BAND_LABEL, BANDS, BLOCKER_LABEL, DISCLAIMER, HOW_IT_WORKS, POS_LABEL, SKILL_LABEL, SKILL_MEANING } from "@/lib/soccer/copy";
import {
  ageBand,
  buildPlan,
  compareDose,
  dateKey,
  dueStatus,
  firstName,
  formatNumber,
  fuelFor,
  gapLabel,
  gapTone,
  streak,
  technicalIndex,
  type Plan,
} from "@/lib/soccer/engine";
import { useActivePlayer, usePitch } from "@/lib/soccer/store";
import { SKILL_BANDS, SKILL_KEYS, type Blocker, type Player, type SkillBand, type SkillKey } from "@/lib/soccer/types";
import { SessionDetail } from "@/components/session";
import { cn } from "@/lib/cn";

function usePlan(): { player: Player; plan: Plan } | null {
  const player = useActivePlayer();
  const plan = useMemo(() => (player ? buildPlan(player) : null), [player]);
  if (!player || !plan) return null;
  return { player, plan };
}

export function TodayPanel() {
  const data = usePlan();
  const coach = usePitch((s) => s.coachMode);
  const toggleLogged = usePitch((s) => s.toggleLogged);
  const setView = usePitch((s) => s.setView);
  if (!data) return null;
  const { player, plan } = data;
  const due = dueStatus(player, plan.today.date);
  const run = streak(player, plan.today.date);
  const logged = player.loggedDates.includes(plan.today.date);
  const tone = gapTone(plan.dose.gap);

  return (
    <div className="flex flex-col gap-5">
      {due.week || due.month ? (
        <button
          type="button"
          onClick={() => setView("path")}
          className="rounded-2xl border border-cone bg-cone-soft px-4 py-3 text-left"
        >
          <p className="text-sm font-semibold text-ink">
            {due.month ? "Monthly review is due." : "Weekly check-in is due."}
          </p>
          <p className="mt-1 text-sm text-ink">Tell the truth about the last block. The next sessions change from it.</p>
        </button>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <span className={cn("rounded-full px-3 py-1 text-sm font-semibold", tone === "behind" ? "bg-cone-soft text-ink" : "bg-pitch-soft text-pitch-deep")}>
          {gapLabel(plan.dose.gap)}
        </span>
        {run > 0 ? <span className="text-sm text-muted">{run}-day log streak</span> : null}
        <span className="text-sm text-muted">{plan.dose.adherence.mode === "habit" ? "Simpler week" : plan.dose.adherence.mode === "stretch" ? "Harder constraints" : "Baseline week"}</span>
      </div>

      <SessionDetail
        day={plan.today}
        coach={coach}
        logged={logged}
        showHero
        onToggle={() => toggleLogged(player.id, plan.today.date)}
      />

      <section className="card p-4 md:p-5">
        <p className="kicker">Why this dose</p>
        <ul className="mt-3 flex flex-col gap-2 text-sm text-ink">
          {plan.reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
        {plan.scheduleNote ? <p className="mt-3 text-sm font-medium text-ink">{plan.scheduleNote}</p> : null}
      </section>

      <FuelCard player={player} kind={plan.fuelKind} compact />
      <p className="text-xs text-muted">{DISCLAIMER}</p>
    </div>
  );
}

export function WeekPanel() {
  const data = usePlan();
  const coach = usePitch((s) => s.coachMode);
  const toggleLogged = usePitch((s) => s.toggleLogged);
  const [selected, setSelected] = useState<string | null>(null);
  if (!data) return null;
  const { player, plan } = data;
  const active = plan.days.find((d) => d.date === (selected ?? plan.today.date)) ?? plan.today;
  const today = dateKey(new Date());

  return (
    <div className="flex flex-col gap-5">
      <header>
        <p className="kicker">This week</p>
        <h1 className="mt-1 font-display text-4xl text-ink">Seven days, one picture</h1>
        <p className="mt-2 max-w-xl text-sm text-muted">
          {formatNumber(plan.weekTouches)} individual touches · {plan.weekMinutes} ball minutes · {plan.weekFilm} film
          minutes. The tactical idea stays all week. The technical theme rotates toward the weak side.
        </p>
      </header>
      {plan.scheduleNote ? <p className="rounded-2xl bg-cone-soft px-4 py-3 text-sm text-ink">{plan.scheduleNote}</p> : null}
      {plan.guard ? <p className="rounded-2xl bg-paper-deep px-4 py-3 text-sm text-ink">{plan.guard}</p> : null}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {plan.days.map((day) => {
          const on = day.date === active.date;
          const isToday = day.date === plan.today.date;
          return (
            <button
              key={day.date}
              type="button"
              onClick={() => setSelected(day.date)}
              className={cn(
                "min-h-24 rounded-2xl border px-3 py-3 text-left",
                on ? "border-pitch bg-pitch text-on-pitch" : "border-line bg-card text-ink",
              )}
            >
              <span className="block text-xs font-bold tracking-widest uppercase">
                {day.shortWeekday}
                {isToday ? " · today" : ""}
              </span>
              <span className="mt-1 block text-sm font-semibold">{day.kindLabel}</span>
              <span className={cn("mt-1 block text-xs", on ? "text-on-pitch" : "text-muted")}>
                {day.themeLabel} · {day.minutes}m
              </span>
            </button>
          );
        })}
      </div>
      <SessionDetail
        day={active}
        coach={coach}
        logged={player.loggedDates.includes(active.date)}
        onToggle={active.date <= today ? () => toggleLogged(player.id, active.date) : undefined}
      />
    </div>
  );
}

export function TeamPanel() {
  const data = usePlan();
  if (!data) return null;
  const { plan, player } = data;
  const team = plan.team;
  const tone =
    team.tone === "good" ? "bg-pitch text-on-pitch" : team.tone === "warn" ? "bg-cone-soft text-ink" : "bg-card text-ink";

  return (
    <div className="flex flex-col gap-5">
      <header>
        <p className="kicker">Team · {ageBand(player.age)} · {POS_LABEL[player.position]}</p>
        <h1 className="mt-1 font-display text-4xl text-ink">The room they train in</h1>
      </header>
      <section className={cn("rounded-2xl border border-line p-4 md:p-5", tone)}>
        <h2 className="font-display text-3xl">{team.verdictTitle}</h2>
        <p className="mt-2 text-sm leading-relaxed">{team.verdictBody}</p>
      </section>
      {team.warning ? <p className="rounded-2xl border border-cone bg-cone-soft px-4 py-3 text-sm">{team.warning}</p> : null}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        <Metric k="Your team days" v={String(team.yourSessions)} />
        <Metric k="Target days" v={String(team.targetSessions)} />
        <Metric k="Session length" v={`${team.sessionMinutes}m`} />
        <Metric k="Format" v={team.format} />
      </div>
      <section className="card p-4 md:p-5">
        <p className="kicker">Shape</p>
        <p className="mt-2 text-sm text-ink">{team.formation}</p>
        <p className="mt-3 text-sm text-ink">{team.positionJob}</p>
      </section>
      <section className="card p-4 md:p-5">
        <p className="kicker">{team.yourSessions === 0 && player.age <= 8 ? "The daily yard session" : "A team session you can hand a coach"}</p>
        <ol className="mt-3 flex flex-col gap-3">
          {team.outline.map((phase) => (
            <li key={phase.phase} className="border-l-4 border-l-pitch pl-3">
              <p className="text-sm font-semibold">
                {phase.phase}
                <span className="font-medium text-muted"> · {phase.minutes} min</span>
              </p>
              <p className="text-sm text-ink">{phase.detail}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="card p-4 md:p-5">
        <p className="kicker">Tactical thread for {ageBand(player.age)}</p>
        <p className="mt-2 text-sm text-muted">One idea per week. This week is marked. Do not install the whole list on Monday.</p>
        <ul className="mt-3 flex flex-col gap-2">
          {team.themes.map((theme) => (
            <li key={theme.title} className={cn("rounded-xl px-3 py-3", theme.current ? "bg-pitch text-on-pitch" : "bg-paper")}>
              <p className="text-sm font-semibold">
                {theme.current ? "This week · " : ""}
                {theme.title}
              </p>
              <p className={cn("mt-1 text-sm", theme.current ? "text-on-pitch" : "text-ink")}>{theme.detail}</p>
            </li>
          ))}
        </ul>
      </section>
      <section className="card p-4 md:p-5">
        <p className="kicker">Parent role</p>
        <p className="mt-2 text-sm text-ink">{team.parentRole}</p>
        <ul className="mt-3 flex list-disc flex-col gap-1 pl-5 text-sm">
          {team.sideline.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>
      <section className="card p-4 md:p-5">
        <p className="kicker">Not yet</p>
        <p className="mt-2 text-sm text-muted">Skipping these is part of the pathway, not a gap.</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {team.notYet.map((item) => (
            <li key={item} className="rounded-full border border-line px-3 py-1 text-sm">
              {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export function FuelPanel() {
  const data = usePlan();
  const [kind, setKind] = useState<"train" | "match" | "rest" | null>(null);
  if (!data) return null;
  const selected = kind ?? data.plan.fuelKind;
  return (
    <div className="flex flex-col gap-5">
      <header>
        <p className="kicker">Fuel and film</p>
        <h1 className="mt-1 font-display text-4xl">Eat for the session. Watch with a job.</h1>
        <p className="mt-2 max-w-xl text-sm text-muted">
          {firstName(data.player)} does not need a diet. The job is enough food to train and grow, and film that teaches one picture.
        </p>
      </header>
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["train", "Training day"],
            ["match", "Match day"],
            ["rest", "Rest day"],
          ] as const
        ).map(([id, label]) => (
          <button key={id} type="button" className={cn("btn", selected === id ? "btn-primary" : "btn-secondary")} onClick={() => setKind(id)}>
            {label}
          </button>
        ))}
      </div>
      <FuelCard player={data.player} kind={selected} />
      {data.plan.today.film ? (
        <section className="card p-4 md:p-5">
          <p className="kicker">Today's watch · {data.plan.today.film.minutes} min</p>
          <p className="mt-2 text-sm">{data.plan.today.film.watch}</p>
          <p className="mt-3 text-sm font-medium">{data.plan.today.film.prompt}</p>
        </section>
      ) : (
        <p className="text-sm text-muted">No film on today's card. That is intentional at this age or on this kind of day.</p>
      )}
      <p className="text-xs text-muted">{DISCLAIMER}</p>
    </div>
  );
}

function FuelCard({
  player,
  kind,
  compact = false,
}: {
  player: Player;
  kind: "train" | "match" | "rest";
  compact?: boolean;
}) {
  const fuel = fuelFor(player, kind);
  return (
    <section className="card p-4 md:p-5">
      <p className="kicker">{fuel.dayTitle}</p>
      <h2 className="mt-1 font-display text-3xl">The plate</h2>
      <div className="mt-4 grid gap-2">
        {fuel.plate.map((part, index) => (
          <div key={`${part.label}-${index}`} className={cn("rounded-xl px-3 py-3", index === 0 ? "bg-pitch-soft" : "bg-paper")}>
            <p className="text-sm font-semibold">{part.label}</p>
            <p className="text-sm text-ink">{part.detail}</p>
          </div>
        ))}
      </div>
      <dl className="mt-4 flex flex-col gap-3 text-sm">
        <div>
          <dt className="font-semibold">Before</dt>
          <dd>{fuel.pre}</dd>
        </div>
        <div>
          <dt className="font-semibold">During</dt>
          <dd>{fuel.during}</dd>
        </div>
        <div>
          <dt className="font-semibold">After</dt>
          <dd>{fuel.post}</dd>
        </div>
        <div>
          <dt className="font-semibold">Water</dt>
          <dd>{fuel.hydration}</dd>
        </div>
        <div>
          <dt className="font-semibold">Sleep</dt>
          <dd>{fuel.sleep}</dd>
        </div>
      </dl>
      {compact ? null : (
        <>
          <p className="mt-4 text-sm text-muted">{fuel.calories}</p>
          <p className="mt-3 text-sm font-semibold">Keep in the house</p>
          <p className="text-sm">{fuel.grocery.join(" · ")}</p>
          <ul className="mt-3 flex list-disc flex-col gap-1 pl-5 text-sm">
            {fuel.avoid.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {fuel.notes.map((note) => (
            <p key={note} className="mt-2 text-sm text-muted">
              {note}
            </p>
          ))}
        </>
      )}
    </section>
  );
}

export function PathPanel() {
  const data = usePlan();
  const setEditor = usePitch((s) => s.setEditor);
  const removePlayer = usePitch((s) => s.removePlayer);
  const applyCheck = usePitch((s) => s.applyCheck);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [period, setPeriod] = useState<"week" | "month">("week");
  const [result, setResult] = useState<"missed" | "met" | "exceeded" | "">("");
  const [blockers, setBlockers] = useState<Blocker[]>([]);
  const [note, setNote] = useState("");
  const [rerate, setRerate] = useState(false);
  const [nextSkills, setNextSkills] = useState<Record<SkillKey, SkillBand> | null>(null);
  const [saved, setSaved] = useState("");

  if (!data) return null;
  const { player, plan } = data;
  const band = ageBand(player.age);
  const due = dueStatus(player, plan.today.date);
  const years = Math.max(0, 18 - player.age);
  const full = plan.days.find((d) => d.kind === "full") ?? plan.today;
  const tone = gapTone(plan.dose.gap);

  const submit = () => {
    if (!result) return;
    const skills = period === "month" && nextSkills ? nextSkills : undefined;
    const after: Player = {
      ...player,
      skills: skills ?? player.skills,
      checks: [
        ...player.checks.filter((c) => !(c.date === plan.today.date && c.period === period)),
        {
          id: "temp",
          date: plan.today.date,
          period,
          result,
          blockers,
          note: note.trim(),
          summary: "",
        },
      ],
    };
    const summary = compareDose(player, after);
    applyCheck(
      player.id,
      {
        id: crypto.randomUUID(),
        date: plan.today.date,
        period,
        result,
        blockers,
        note: note.trim(),
        summary,
        indexBefore: technicalIndex(player),
        indexAfter: technicalIndex(after),
      },
      skills,
    );
    setSaved(summary);
    setResult("");
    setNote("");
    setBlockers([]);
  };

  return (
    <div className="flex flex-col gap-5">
      <header>
        <p className="kicker">{firstName(player)} · {band}</p>
        <h1 className="mt-1 font-display text-4xl md:text-5xl">
          {years === 0 ? "The U18 year is this year." : `${years} ${years === 1 ? "year" : "years"} to the end of U18.`}
        </h1>
        <p className={cn("mt-3 text-sm font-semibold", tone === "behind" ? "text-cone" : "text-pitch")}>{gapLabel(plan.dose.gap)}</p>
        <p className="mt-1 text-sm text-muted">
          Index {plan.dose.index.toFixed(1)} of 5. On-track at this age is {plan.dose.track.toFixed(1)}. Update the age on a birthday. The whole plan moves.
        </p>
      </header>

      <div className="overflow-x-auto rounded-2xl border border-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-paper-deep text-ink">
            <tr>
              <th className="px-3 py-2 font-semibold">This age</th>
              <th className="px-3 py-2 font-semibold">Your plan</th>
              <th className="px-3 py-2 font-semibold">Elite standard</th>
            </tr>
          </thead>
          <tbody className="bg-card">
            <Row k="Full-day touches" a={formatNumber(full.touches)} b={formatNumber(plan.benchmark.dailyTouches)} />
            <Row k="Full-day minutes" a={String(full.minutes)} b={String(plan.benchmark.dailyMinutes)} />
            <Row k="Individual days" a={String(player.soloDays)} b={String(plan.benchmark.soloDays)} />
            <Row k="Team sessions" a={String(plan.team.yourSessions)} b={String(plan.benchmark.teamSessions)} />
            <Row k="Film minutes" a={String(plan.today.film?.minutes ?? 0)} b={String(plan.benchmark.filmMinutes)} />
            <Row k="Format" a={plan.team.format} b={plan.benchmark.format} />
          </tbody>
        </table>
      </div>

      <section>
        <p className="kicker">Age windows</p>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
          {(Object.keys(BANDS) as (keyof typeof BANDS)[]).map((id) => {
            const item = BANDS[id];
            const on = id === band;
            return (
              <article key={id} className={cn("min-w-52 rounded-2xl border p-3", on ? "border-pitch bg-pitch text-on-pitch" : "border-line bg-card")}>
                <p className="text-xs font-bold tracking-widest uppercase">{on ? "You are here" : item.ages}</p>
                <h3 className="mt-1 font-display text-2xl">{id}</h3>
                <p className={cn("text-xs", on ? "text-on-pitch" : "text-muted")}>{item.ages}</p>
                <p className="mt-2 text-sm">{item.format}</p>
                <p className="mt-1 text-sm">{item.formation}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="card p-4 md:p-5">
        <p className="kicker">On track in {band} looks like</p>
        <ul className="mt-3 flex list-disc flex-col gap-1 pl-5 text-sm">
          {BANDS[band].milestones.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="card p-4 md:p-5">
        <p className="kicker">Check-in</p>
        <h2 className="mt-1 font-display text-3xl">{due.month ? "Month and week" : "How did the block go?"}</h2>
        <p className="mt-2 text-sm text-muted">{plan.dose.adherence.label}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" className={cn("btn", period === "week" ? "btn-primary" : "btn-secondary")} onClick={() => setPeriod("week")}>
            This week
          </button>
          <button type="button" className={cn("btn", period === "month" ? "btn-primary" : "btn-secondary")} onClick={() => setPeriod("month")}>
            This month
          </button>
        </div>
        <div className="mt-3 grid gap-2 md:grid-cols-3">
          {(
            [
              ["missed", "Short of it"],
              ["met", "Hit the plan"],
              ["exceeded", "Went past it"],
            ] as const
          ).map(([id, label]) => (
            <button key={id} type="button" aria-pressed={result === id} className={cn("btn", result === id ? "btn-primary" : "btn-secondary")} onClick={() => setResult(id)}>
              {label}
            </button>
          ))}
        </div>
        <p className="mt-4 text-sm font-semibold">What got in the way, if anything</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {(Object.keys(BLOCKER_LABEL) as Blocker[]).map((id) => {
            const on = blockers.includes(id);
            return (
              <button
                key={id}
                type="button"
                aria-pressed={on}
                className={cn("min-h-11 rounded-full border px-3 text-sm font-medium", on ? "border-pitch bg-pitch text-on-pitch" : "border-line bg-card")}
                onClick={() => setBlockers((curr) => (curr.includes(id) ? curr.filter((b) => b !== id) : [...curr, id]))}
              >
                {BLOCKER_LABEL[id]}
              </button>
            );
          })}
        </div>
        <label className="mt-4 block text-sm font-semibold">
          Note
          <textarea className="field mt-1 min-h-20" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional. One sentence is enough." />
        </label>
        {period === "month" ? (
          <div className="mt-4">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setRerate((v) => !v);
                setNextSkills(player.skills);
              }}
            >
              {rerate ? "Hide skill re-rate" : "Re-rate skills"}
            </button>
            {rerate && nextSkills ? (
              <div className="mt-3 flex flex-col gap-3">
                <p className="text-sm text-muted">Monthly is the right time. Do not bump a skill because one session felt good.</p>
                {SKILL_KEYS.map((key) => (
                  <label key={key} className="block text-sm">
                    <span className="font-semibold">{SKILL_LABEL[key]}</span>
                    <select
                      className="field mt-1"
                      value={nextSkills[key]}
                      onChange={(e) =>
                        setNextSkills((curr) => (curr ? { ...curr, [key]: e.target.value as SkillBand } : curr))
                      }
                    >
                      {SKILL_BANDS.map((bandId) => (
                        <option key={bandId} value={bandId}>
                          {BAND_LABEL[bandId]}
                        </option>
                      ))}
                    </select>
                    <span className="mt-1 block text-muted">{SKILL_MEANING[key][nextSkills[key]]}</span>
                  </label>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
        <button type="button" className="btn btn-primary mt-4" disabled={!result} onClick={submit}>
          Save check-in
        </button>
        {saved ? <p className="mt-3 rounded-xl bg-pitch-soft px-3 py-3 text-sm text-ink">{saved}</p> : null}
      </section>

      {player.checks.length > 0 ? (
        <section className="card p-4 md:p-5">
          <p className="kicker">History</p>
          <ul className="mt-3 flex flex-col gap-3">
            {[...player.checks].reverse().slice(0, 8).map((check) => (
              <li key={check.id} className="border-b border-line pb-3 text-sm last:border-0">
                <p className="font-semibold">
                  {check.date} · {check.period} · {check.result === "missed" ? "Short" : check.result === "met" ? "Hit" : "Past it"}
                </p>
                <p className="text-ink">{check.summary}</p>
                {check.note ? <p className="text-muted">{check.note}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="card p-4 md:p-5">
        <p className="kicker">How the numbers are built</p>
        <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-sm">
          {HOW_IT_WORKS.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn btn-secondary" onClick={() => setEditor("edit")}>
          Edit profile
        </button>
        {confirmRemove ? (
          <button type="button" className="btn btn-secondary" onClick={() => removePlayer(player.id)}>
            Confirm remove
          </button>
        ) : (
          <button type="button" className="btn btn-quiet" onClick={() => setConfirmRemove(true)}>
            Remove player
          </button>
        )}
      </div>
      <p className="text-xs text-muted">{DISCLAIMER}</p>
    </div>
  );
}

function Metric({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-2xl border border-line bg-card px-3 py-3">
      <p className="kicker">{k}</p>
      <p className="mt-1 font-display text-2xl leading-tight">{v}</p>
    </div>
  );
}

function Row({ k, a, b }: { k: string; a: string; b: string }) {
  return (
    <tr className="border-t border-line">
      <th className="px-3 py-2 font-medium">{k}</th>
      <td className="px-3 py-2">{a}</td>
      <td className="px-3 py-2">{b}</td>
    </tr>
  );
}
