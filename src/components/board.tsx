import { Component, useEffect, useMemo, useState, type ReactNode } from "react";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis, ZAxis } from "recharts";
import { SessionDetail } from "@/components/session";
import { cn } from "@/lib/cn";
import { SKILL_LABEL, BAND_LABEL } from "@/lib/soccer/copy";
import {
  addDays,
  bandFromAttr,
  buildPlan,
  dateKey,
  formatNumber,
  parseKey,
  playerIndex,
} from "@/lib/soccer/engine";
import { usePitch } from "@/lib/soccer/store";
import { BAND_ATTR, SKILL_KEYS, type Player, type SkillKey } from "@/lib/soccer/types";

const SPOKES: { key: SkillKey; label: string }[] = [
  { key: "firstTouch", label: "Touch" },
  { key: "dribbling", label: "Dribble" },
  { key: "passing", label: "Pass" },
  { key: "finishing", label: "Finish" },
  { key: "duels", label: "Duels" },
  { key: "weakFoot", label: "Weak" },
  { key: "athleticism", label: "Speed" },
  { key: "decisions", label: "Read" },
];

const ELITE = BAND_ATTR.elite;

const WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function useMounted() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    setOn(true);
  }, []);
  return on;
}

function formatIndex(value: number): string {
  return Number.isFinite(value) ? value.toFixed(1) : "0.0";
}

function IndexMark({ player }: { player: Player }) {
  const index = playerIndex(player.attrs ?? ({} as Player["attrs"]));
  return (
    <div className="card flex flex-col justify-between p-5">
      <p className="kicker">Index</p>
      <p className="font-display text-8xl leading-none text-ink">{formatIndex(index)}</p>
      <p className="mt-2 text-sm text-muted">{BAND_LABEL[bandFromAttr(index)]}</p>
    </div>
  );
}

function RadarCard({ player }: { player: Player }) {
  const on = useMounted();
  const logs = player.logs ?? [];
  const last = [...logs].sort((a, b) => a.date.localeCompare(b.date)).at(-1);
  const hot = last && last.gain > 0 ? SPOKES.find((item) => item.key === last.theme)?.label : undefined;
  const data = SPOKES.map((item) => ({
    skill: item.label,
    now: Math.round((player.attrs?.[item.key] ?? 0) * 10) / 10,
    elite: ELITE,
  }));
  return (
    <div className="card flex h-80 flex-col p-3">
      <ChartGuard>
        {on ? (
          <div className="min-h-0 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={data} cx="50%" cy="50%" outerRadius="62%">
                <PolarGrid stroke="var(--color-line)" />
                <PolarAngleAxis dataKey="skill" tick={(props) => <SpokeTick {...props} hot={hot} values={data} />} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar dataKey="elite" stroke="var(--color-muted)" fill="transparent" strokeDasharray="4 4" isAnimationActive={false} />
                <Radar dataKey="now" stroke="var(--color-pitch)" strokeWidth={2} fill="var(--color-pitch)" fillOpacity={0.45} dot={{ r: 3, fill: "var(--color-pitch)" }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        ) : null}
      </ChartGuard>
    </div>
  );
}

type SpokeTickProps = {
  x?: number;
  y?: number;
  textAnchor?: "start" | "middle" | "end";
  payload?: { value?: string };
  hot?: string;
  values: { skill: string; now: number }[];
};

function SpokeTick({ x = 0, y = 0, textAnchor = "middle", payload, hot, values }: SpokeTickProps) {
  const name = payload?.value ?? "";
  const value = values.find((item) => item.skill === name)?.now ?? 0;
  const on = name === hot;
  return (
    <text x={x} y={y} textAnchor={textAnchor} fill={on ? "var(--color-pitch)" : "var(--color-muted)"} fontSize={11}>
      <tspan x={x} dy="-0.2em">
        {name}
      </tspan>
      <tspan x={x} dy="1.15em" fontSize={12} fill={on ? "var(--color-pitch)" : "var(--color-ink)"}>
        {value.toFixed(1)}
      </tspan>
    </text>
  );
}

class ChartGuard extends Component<{ children: ReactNode }, { bad: boolean }> {
  state = { bad: false };
  static getDerivedStateFromError(): { bad: boolean } {
    return { bad: true };
  }
  render() {
    if (this.state.bad) return null;
    return this.props.children;
  }
}

function LogWork({
  playerId,
  day,
  existing,
  onNext,
  onBack,
  skillNow,
}: {
  playerId: string;
  day: { date: string; touches: number; theme: SkillKey };
  existing?: Player["logs"][number];
  skillNow?: number;
  onNext?: () => void;
  onBack?: () => void;
}) {
  const logWork = usePitch((s) => s.logWork);
  const [touches, setTouches] = useState(existing ? String(existing.touchesDone) : "");
  useEffect(() => {
    setTouches(existing ? String(existing.touchesDone) : "");
  }, [day.date, existing]);
  const today = dateKey(new Date());
  const open = day.date <= today;
  const done = Number(touches);
  const ratio = day.touches > 0 && Number.isFinite(done) ? Math.min(1, done / day.touches) : 0;

  return (
    <section className="card p-4">
      <p className="kicker">Log</p>
      {open ? (
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <label className="block">
            <span className="text-sm font-semibold">Touches done</span>
            <input
              className="field mt-1 w-32"
              inputMode="numeric"
              value={touches}
              placeholder="0"
              onChange={(e) => setTouches(e.target.value.replace(/[^\d]/g, ""))}
            />
          </label>
          <button type="button" className="btn btn-secondary" onClick={() => setTouches(String(day.touches))}>
            All {formatNumber(day.touches)}
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={!Number.isFinite(done) || touches === ""}
            onClick={() => logWork(playerId, day.date, done)}
          >
            Log
          </button>
          {onNext ? (
            <button type="button" className="btn btn-primary" onClick={onNext}>
              Next
            </button>
          ) : null}
          {onBack ? (
            <button type="button" className="btn btn-secondary" onClick={onBack}>
              Back
            </button>
          ) : null}
        </div>
      ) : onBack || onNext ? (
        <div className="mt-3 flex flex-wrap gap-3">
          {onBack ? (
            <button type="button" className="btn btn-secondary" onClick={onBack}>
              Back
            </button>
          ) : null}
          {onNext ? (
            <button type="button" className="btn btn-primary" onClick={onNext}>
              Next
            </button>
          ) : null}
        </div>
      ) : null}
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-paper-deep">
        <div className="h-full bg-pitch" style={{ width: `${Math.round(ratio * 100)}%` }} />
      </div>
      {existing ? (
        <p className="mt-3 text-sm">
          {formatNumber(existing.touchesDone)} / {formatNumber(existing.touchesTarget)} · Index {formatIndex(existing.indexBefore)} → {formatIndex(existing.indexAfter)} · {SKILL_LABEL[existing.theme]}{" "}
          {typeof skillNow === "number" ? skillNow.toFixed(1) : existing.gain > 0 ? `+${existing.gain}` : "0"}
        </p>
      ) : null}
    </section>
  );
}

export function TodayBoard({ player }: { player: Player }) {
  const todayKey = dateKey(new Date());
  const [cursor, setCursor] = useState(todayKey);
  const plan = useMemo(() => buildPlan(player, parseKey(cursor)), [player, cursor]);
  const day = plan.days.find((item) => item.date === cursor) ?? plan.today;
  const existing = (player.logs ?? []).find((log) => log.date === day.date);
  const complete = Boolean(existing && existing.touchesTarget > 0 && existing.touchesDone >= existing.touchesTarget);

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-3 md:grid-cols-2">
        <IndexMark player={player} />
        <RadarCard player={player} />
      </div>
      <SessionDetail day={day} coach={false} logged={Boolean(existing)} showHero />
      <LogWork
        playerId={player.id}
        day={day}
        existing={existing}
        skillNow={player.attrs?.[day.theme]}
        onNext={complete ? () => setCursor(dateKey(addDays(parseKey(day.date), 1))) : undefined}
        onBack={cursor !== todayKey ? () => setCursor(todayKey) : undefined}
      />
    </div>
  );
}

function monthCells(anchor: Date): Date[] {
  const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const pad = (first.getDay() + 6) % 7;
  const start = new Date(first);
  start.setDate(1 - pad);
  return Array.from({ length: 42 }, (_, i) => {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    return day;
  });
}

export function CalendarBoard({ player }: { player: Player }) {
  const [cursor, setCursor] = useState(() => new Date());
  const [selected, setSelected] = useState(() => dateKey(new Date()));
  const cells = monthCells(cursor);
  const plan = useMemo(() => buildPlan(player, parseKey(selected)), [player, selected]);
  const day = plan.days.find((item) => item.date === selected) ?? plan.today;
  const log = (player.logs ?? []).find((item) => item.date === selected);
  const monthLabel = cursor.toLocaleString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="flex flex-col gap-5">
      <header className="flex items-end justify-between gap-3">
        <div>
          <p className="kicker">Calendar</p>
          <h1 className="font-display text-4xl leading-none">{monthLabel}</h1>
        </div>
        <div className="flex gap-2">
          <button type="button" className="btn btn-secondary px-3" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}>
            Prev
          </button>
          <button type="button" className="btn btn-secondary px-3" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}>
            Next
          </button>
        </div>
      </header>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold tracking-widest text-muted uppercase">
        {WEEK.map((label) => (
          <div key={label}>{label}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((date) => {
          const key = dateKey(date);
          const inMonth = date.getMonth() === cursor.getMonth();
          const weekday = (date.getDay() + 6) % 7;
          const logged = (player.logs ?? []).some((item) => item.date === key);
          const mark = (player.practiceDays ?? []).includes(weekday) ? "P" : (player.matchDays ?? []).includes(weekday) ? "G" : "";
          const on = key === selected;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelected(key)}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center rounded-xl border text-sm",
                on ? "border-pitch bg-pitch text-on-pitch" : "border-line bg-card text-ink",
                !inMonth && "opacity-40",
              )}
            >
              <span className="font-display text-xl leading-none">{date.getDate()}</span>
              <span className={cn("mt-1 text-xs font-semibold", on ? "text-on-pitch" : "text-pitch")}>{logged ? "•" : mark}</span>
            </button>
          );
        })}
      </div>
      <SessionDetail day={day} coach={false} logged={Boolean(log)} showHero />
      <LogWork playerId={player.id} day={day} existing={log} />
    </div>
  );
}

export function PathBoard({ player }: { player: Player }) {
  const on = useMounted();
  const logs = [...(player.logs ?? [])].sort((a, b) => a.date.localeCompare(b.date));
  const dots = logs.map((log, i) => ({ x: i + 1, y: log.indexAfter }));

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-3 md:grid-cols-2">
        <IndexMark player={player} />
        <RadarCard player={player} />
      </div>
      <section className="card p-4">
        <p className="kicker">Sessions</p>
        <div className="mt-2 h-52">
          {on && dots.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 8, bottom: 0, left: 0 }}>
                <XAxis dataKey="x" hide />
                <YAxis dataKey="y" domain={[0, 99]} tick={{ fill: "var(--color-muted)", fontSize: 11 }} axisLine={false} tickLine={false} width={32} />
                <ZAxis range={[80, 80]} />
                <Scatter data={dots} fill="var(--color-pitch)" />
              </ScatterChart>
            </ResponsiveContainer>
          ) : null}
        </div>
      </section>
      <ul className="flex flex-col gap-3">
        {SKILL_KEYS.map((key) => {
          const value = player.attrs?.[key] ?? 0;
          return (
            <li key={key} className="flex flex-col gap-1">
              <span className="flex items-baseline justify-between gap-3">
                <span className="font-semibold">{SKILL_LABEL[key]}</span>
                <span className="font-display text-2xl leading-none">{value.toFixed(1)}</span>
              </span>
              <span className="relative h-2 overflow-hidden rounded-full bg-paper-deep">
                <span className="block h-full bg-pitch" style={{ width: `${Math.min(100, Math.round(value))}%` }} />
                <span className="absolute inset-y-0 w-px bg-ink" style={{ left: `${ELITE}%` }} />
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
