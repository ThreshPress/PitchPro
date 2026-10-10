import {
  BANDS,
  buildFuel,
  filmCast,
  HOW_IT_WORKS,
  LOOK_FOR,
  OUTLINES,
  positionJob,
  SKILL_LABEL,
  TACTICS,
  type FuelPlan,
} from "@/lib/soccer/copy";
import { pickDrill } from "@/lib/soccer/drills";
import { leverFor, type Lever } from "@/lib/soccer/levers";
import {
  BAND_ATTR,
  BAND_SCORE,
  SKILL_KEYS,
  type AgeBand,
  type CheckIn,
  type DayKind,
  type Level,
  type Player,
  type Position,
  type SkillBand,
  type SkillKey,
  type Slot,
} from "@/lib/soccer/types";

export { HOW_IT_WORKS, SKILL_LABEL };

export interface Adherence {
  factor: number;
  mode: "habit" | "standard" | "stretch";
  label: string;
  last: CheckIn | null;
}

export interface Dose {
  index: number;
  track: number;
  gap: number;
  factor: number;
  adherence: Adherence;
}

export interface Block {
  id: string;
  slot: Slot | "tactical" | "team";
  kicker: string;
  title: string;
  minutes: number;
  touches: number;
  setup: string;
  steps: string[];
  cues: string[];
  equipment: string[];
  easyFix: string;
  hardFix: string;
  see: string;
  caution?: string;
}

export interface FilmBlock {
  minutes: number;
  title: string;
  watch: string;
  lookFor: string[];
  players: { name: string; why: string }[];
  prompt: string;
  optional: boolean;
}

export interface DayPlan {
  date: string;
  weekday: string;
  shortWeekday: string;
  kind: DayKind;
  kindLabel: string;
  theme: SkillKey;
  themeLabel: string;
  minutes: number;
  touches: number;
  blocks: Block[];
  sentence: string;
  hunt: string[];
  film: FilmBlock | null;
  equipment: string[];
  lever: Lever;
  adjust: "missed" | "short" | null;
}

export interface TeamPlan {
  verdictTitle: string;
  verdictBody: string;
  tone: "good" | "warn" | "neutral";
  format: string;
  formation: string;
  yourSessions: number;
  targetSessions: number;
  sessionMinutes: number;
  outline: { phase: string; minutes: number; detail: string }[];
  themes: { title: string; detail: string; current: boolean }[];
  parentRole: string;
  sideline: string[];
  notYet: string[];
  positionJob: string;
  warning: string | null;
  leagueName: string;
}

export interface Benchmark {
  dailyTouches: number;
  dailyMinutes: number;
  soloDays: number;
  teamSessions: number;
  filmMinutes: number;
  format: string;
}

export interface Plan {
  days: DayPlan[];
  today: DayPlan;
  dose: Dose;
  guard: string | null;
  scheduleNote: string | null;
  reasons: string[];
  benchmark: Benchmark;
  team: TeamPlan;
  weekTouches: number;
  weekMinutes: number;
  weekFilm: number;
  fuelKind: "train" | "match" | "rest";
}

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const KIND_LABEL: Record<DayKind, string> = {
  full: "Full session",
  team: "Team day top-up",
  match: "Match activation",
  play: "Play day",
  recovery: "Easy day",
  practice: "Practice top-up",
};

export function exactAge(player: { age: number; ageMonths?: number }): number {
  const months = Math.min(11, Math.max(0, Math.round(player.ageMonths ?? 0)));
  return Math.min(18, Math.max(4, player.age + months / 12));
}

export function playerIndex(attrs: Record<SkillKey, number>): number {
  const total = SKILL_KEYS.reduce((sum, key) => sum + (attrs[key] ?? 0), 0);
  return Math.round((total / SKILL_KEYS.length) * 10) / 10;
}

export function bandFromAttr(value: number): SkillBand {
  if (value < 32) return "beginner";
  if (value < 48) return "developing";
  if (value < 64) return "intermediate";
  if (value < 80) return "advanced";
  return "elite";
}

export function gainFor(attr: number, ratio: number): number {
  // A small training-credit estimate, never a validated skill measurement.
  if (!Number.isFinite(ratio) || ratio <= 0) return 0;
  const credit = Math.min(1.25, Math.max(0, ratio));
  const pace = attr >= 88 ? 0.03 : attr >= 72 ? 0.05 : attr >= 56 ? 0.07 : 0.1;
  return Math.round(credit * pace * 100) / 100;
}

export function trackIndex99(age: number): number {
  const t = onTrackIndex(age);
  return Math.round(24 + ((t - 1) / 4) * 64);
}

export function ageBand(age: number): AgeBand {
  if (age <= 6) return "U6";
  if (age <= 8) return "U8";
  if (age <= 10) return "U10";
  if (age <= 12) return "U12";
  if (age <= 14) return "U14";
  if (age <= 16) return "U16";
  return "U18";
}

export function firstName(player: Player): string {
  const bit = player.name.trim().split(/\s+/)[0];
  return bit || "This player";
}

export function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function addDays(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}

export function startOfWeekMonday(d: Date): Date {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = x.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  return addDays(x, diff);
}

export function mondayIndex(d: Date): number {
  const day = d.getDay();
  return day === 0 ? 6 : day - 1;
}

export function formatNumber(n: number): string {
  return Math.max(0, Math.round(n)).toLocaleString("en-US");
}

export function technicalIndex(player: Player): number {
  const total = SKILL_KEYS.reduce((sum, key) => sum + BAND_SCORE[player.skills[key]], 0);
  return total / SKILL_KEYS.length;
}

export function onTrackIndex(age: number): number {
  const t = clamp((age - 4) / 14, 0, 1);
  return 1.15 + t * 3.55;
}

export function gapTone(gap: number): "ahead" | "on" | "close" | "behind" {
  if (gap < -0.45) return "ahead";
  if (gap < 0.25) return "on";
  if (gap < 0.9) return "close";
  return "behind";
}

export function gapLabel(gap: number): string {
  const tone = gapTone(gap);
  if (tone === "ahead") return "Ahead of the elite curve";
  if (tone === "on") return "On the elite curve";
  if (tone === "close") return "A step behind the curve";
  return "Behind the curve — catch-up is built in";
}

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function baseDaily(age: number): { touches: number; minutes: number; film: number } {
  const table: Record<number, [number, number, number]> = {
    4: [250, 20, 0],
    5: [320, 25, 0],
    6: [420, 30, 5],
    7: [520, 35, 8],
    8: [680, 40, 8],
    9: [880, 48, 10],
    10: [1100, 52, 12],
    11: [1350, 58, 15],
    12: [1550, 62, 15],
    13: [1800, 68, 20],
    14: [2000, 70, 20],
    15: [2100, 70, 25],
    16: [2000, 65, 25],
    17: [1800, 60, 30],
    18: [1650, 55, 30],
  };
  const clamped = clamp(age, 4, 18);
  const lo = Math.floor(clamped);
  const hi = Math.min(18, lo + 1);
  const t = clamped - lo;
  const a = table[lo] ?? table[8];
  const b = table[hi] ?? a;
  return {
    touches: Math.round(a[0] + (b[0] - a[0]) * t),
    minutes: Math.round(a[1] + (b[1] - a[1]) * t),
    film: Math.round(a[2] + (b[2] - a[2]) * t),
  };
}

export function weeklyHourCap(age: number): number {
  if (age <= 6) return 4;
  if (age <= 8) return 5.5;
  if (age <= 10) return 7;
  if (age <= 12) return 8.5;
  if (age <= 14) return 10;
  if (age <= 16) return 12;
  return 14;
}

export function teamSessionMinutes(age: number): number {
  return BANDS[ageBand(age)].sessionMinutes;
}

export function targetTeamSessions(age: number, competitiveOlder = false): number {
  const base = BANDS[ageBand(age)].targetSessions;
  if (competitiveOlder && age >= 16) return Math.max(base, 5);
  return base;
}

export function matchLoadMinutes(age: number): number {
  if (age <= 8) return 40;
  if (age <= 10) return 50;
  if (age <= 12) return 60;
  if (age <= 14) return 70;
  return 80;
}

export function adherenceFrom(checks: CheckIn[]): Adherence {
  const recent = [...checks].sort((a, b) => a.date.localeCompare(b.date)).slice(-3);
  if (!recent.length) {
    return {
      factor: 1,
      mode: "standard",
      label: "No check-in yet. This is the baseline dose for the profile.",
      last: null,
    };
  }
  let acc = 0;
  let wsum = 0;
  recent.forEach((c, i) => {
    const weight = i + 1;
    const value = c.result === "missed" ? 0.86 : c.result === "exceeded" ? 1.08 : 1;
    acc += value * weight;
    wsum += weight;
  });
  let factor = acc / wsum;
  const last = recent[recent.length - 1];
  if (!last) {
    return { factor: 1, mode: "standard", label: "Baseline dose.", last: null };
  }
  if (last.blockers.includes("soreness")) factor *= 0.94;
  if (last.blockers.includes("overload")) factor *= 0.92;
  if (last.result === "missed" && last.blockers.includes("travel") && !last.blockers.includes("soreness")) {
    factor = Math.max(factor, 0.97);
  }
  factor = clamp(factor, 0.72, 1.15);

  let mode: Adherence["mode"] = "standard";
  let label = "Last check landed on the plan. Keep the dose and clean up the details.";
  if (last.blockers.includes("soreness")) {
    mode = "habit";
    label = "Soreness was flagged. Volume is down. If a joint still hurts, today becomes recovery.";
  } else if (last.result === "missed" && last.blockers.includes("fun")) {
    mode = "habit";
    label = "The last block was not fun enough to repeat. Sessions are shorter. Games come before drill sheets.";
  } else if (last.blockers.includes("overload")) {
    mode = "habit";
    label = "Team load was already high. Individual work stays short until the legs feel light.";
  } else if (last.result === "missed" && last.blockers.includes("travel")) {
    mode = "standard";
    label = "Travel knocked out the last block. No penance session. Pick up the next full day.";
  } else if (last.result === "exceeded") {
    mode = "stretch";
    label = "The last check went past the plan. This stretch adds harder constraints, not a second workout.";
  } else if (last.result === "missed") {
    mode = "habit";
    label = "The last check came up short. The next stretch is shorter and simpler so the habit can restart.";
  }
  return { factor, mode, label, last };
}

export function doseFor(player: Player): Dose {
  const index = technicalIndex(player);
  const track = onTrackIndex(exactAge(player));
  const gap = track - index;
  let factor = 1 + gap * 0.15;
  if (player.environment === "rec") factor += 0.1;
  if (player.environment === "competitive") factor -= 0.05;
  const adherence = adherenceFrom(player.checks);
  // Check-in adherence changes session framing, not the baseline target.
  factor = clamp(factor, 0.7, 1.48);
  return { index, track, gap, factor, adherence };
}

function levelFor(band: SkillBand, mode: Adherence["mode"]): Level {
  const order: SkillBand[] = ["beginner", "developing", "intermediate", "advanced", "elite"];
  let i = order.indexOf(band);
  if (mode === "habit") i -= 1;
  if (mode === "stretch") i += 1;
  i = clamp(i, 0, 4);
  if (i <= 1) return "easy";
  if (i === 2) return "standard";
  return "hard";
}

const POSITION_BIAS: Record<Position, Partial<Record<SkillKey, number>>> = {
  goalkeeper: { decisions: 2, firstTouch: 1, athleticism: 1, passing: 1 },
  fullback: { athleticism: 2, duels: 2, passing: 1 },
  centerback: { duels: 2, decisions: 2, firstTouch: 1 },
  midfielder: { decisions: 2, passing: 2, firstTouch: 1 },
  winger: { dribbling: 2, weakFoot: 1, finishing: 1 },
  striker: { finishing: 2, duels: 1, firstTouch: 1 },
  flex: { decisions: 1, weakFoot: 1 },
};

function prioritySkills(player: Player): SkillKey[] {
  return [...SKILL_KEYS].sort((a, b) => {
    const bias = POSITION_BIAS[player.position];
    const da = BAND_SCORE[player.skills[a]] - (bias[a] ?? 0) * 0.2;
    const db = BAND_SCORE[player.skills[b]] - (bias[b] ?? 0) * 0.2;
    if (da !== db) return da - db;
    return a.localeCompare(b);
  });
}

export function weakestSkill(player: Player): SkillKey {
  return prioritySkills(player)[0] ?? "firstTouch";
}

function themeFor(player: Player, date: Date): SkillKey {
  const w = prioritySkills(player);
  const sharp = [...w].reverse().find((key) => player.skills[key] === "advanced" || player.skills[key] === "elite");
  if (sharp && mondayIndex(date) === 0) return sharp;
  const pool = (sharp ? w.filter((key) => key !== sharp) : w).filter(Boolean);
  const source = pool.length ? pool : w;
  const wheel = [0, 2, 1, 3, 0, 4, 1, 5, 6, 7].map((i) => source[i % source.length] ?? source[0]);
  const start = hash(player.id) % wheel.length;
  const day = Math.round(new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() / 86400000);
  return wheel[(day + start) % wheel.length] ?? source[0];
}

function isoWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export function leagueName(player: Player): string {
  if (player.gender === "girl") return "ECNL or Girls Academy";
  if (player.gender === "boy") return "MLS NEXT";
  return "MLS NEXT or ECNL";
}

export function buildTeamPlan(player: Player, date: Date): TeamPlan {
  const band = ageBand(player.age);
  const brief = BANDS[band];
  const themes = TACTICS[band];
  const current = isoWeek(date) % themes.length;
  const league = leagueName(player);
  const yourSessions = player.teamDays.filter((d) => !player.matchDays.includes(d)).length;
  const target = targetTeamSessions(player.age, player.environment === "competitive");
  let tone: TeamPlan["tone"] = "neutral";
  let verdictTitle = "The team environment fits this window.";
  let verdictBody = "Keep the ball work at home and let the team teach the game.";
  let warning: string | null = null;

  if (player.age <= 8 && yourSessions === 0) {
    tone = "neutral";
    verdictTitle = "The yard is the team.";
    verdictBody =
      "Rec soccer, if you have it, is a game. It will not build the touch. Five days at home do that. One other day is a real game with a parent, a sibling, or friends, with almost no coaching. A club can wait until 9 or 10. Chasing a badge at 8 does not.";
  } else if (player.age <= 8) {
    tone = "good";
    verdictTitle = "Do not chase an elite badge yet.";
    verdictBody =
      "From 4 to 8 the pathway is touches, bravery, and a kind coach. A recreational or local club team is the right room if the child plays a lot and still wants to come back.";
  } else if (player.age <= 10 && player.environment === "rec") {
    tone = "neutral";
    verdictTitle = "Rec can still be the right room.";
    verdictBody =
      "If practices are playful and they touch the ball a lot, stay. This is the year to start watching for a club that plays 7v7 and coaches decisions, not laps. You do not need a national league.";
  } else if (player.age <= 10 && player.environment === "competitive") {
    tone = "neutral";
    verdictTitle = "The badge is optional at this age.";
    verdictBody =
      "Competitive soccer at 9 or 10 is fine when they play and enjoy it. If the week is tense or they live on the bench, a strong club team is a better investment than the logo.";
  } else if (player.age <= 12 && player.environment === "rec") {
    tone = "warn";
    verdictTitle = "Start the move toward a real club.";
    verdictBody = `By the U12 window, opponent quality becomes part of the standard. The yard can build the touch. It cannot invent 9v9 decisions against trained players. Look at a club that trains ${themes[current]?.title.toLowerCase() ?? "the game"} on purpose.`;
  } else if (player.age >= 13 && player.environment === "rec") {
    tone = "warn";
    verdictTitle = "The team level is now the limiter.";
    verdictBody = `Individual work can close the technical gap. It will not replace ${league} speed of play. A competitive environment — ${league}, or the strongest state league you can actually play in — is the highest-leverage change this year.`;
  } else if (player.environment === "club" && player.age >= 13) {
    tone = "neutral";
    verdictTitle = "Club is the base. The next step has a name.";
    verdictBody = `Ask whether this club trains a real 11v11 model. If every match is a blowout or they never play half the game, look one level up or sideways into ${league}. Minutes at the right level beat a silent year on a bigger bench.`;
  } else if (player.environment === "competitive") {
    tone = "good";
    verdictTitle = "The environment matches the pathway.";
    verdictBody =
      player.age >= 15
        ? "Stay if the coaching is serious and the minutes are real. Individual work is a top-up around the team model, not a second academy."
        : "You are in a competitive room earlier than required. Protect joy and minutes. Do not add a second club on top.";
  }

  if (player.environment !== "competitive" && yourSessions >= 4 && player.age <= 12) {
    warning =
      "Four organized team sessions a week at this age, outside a national program, usually steals free play. Drop one team day and keep the ball at home.";
  }
  if (yourSessions === 0 && player.age >= 9) {
    warning = "There is no team day on the profile. The yard can carry technique. It cannot carry the game. Even one weekly small-sided team changes the pathway.";
  }
  if (player.environment === "competitive" && player.age >= 14 && yourSessions + player.matchDays.length >= 6) {
    warning = "The organized week is already full. Individual sessions on this plan stay short on purpose. Adding a guest team would be a mistake.";
  }

  const outline =
    player.age <= 8 && yourSessions === 0
      ? [
          {
            phase: "Ball mastery",
            minutes: Math.round(baseDaily(player.age).minutes * 0.22),
            detail: "Sticky toes, then sole, inside, outside. Both feet. The ball stays under the body. Count contacts, not compliments.",
          },
          {
            phase: "One skill",
            minutes: Math.round(baseDaily(player.age).minutes * 0.33),
            detail:
              "One theme a day: Catch the roll, Garden gates, Pass through the gate, Many small goals, Steal the tail, or Weak foot only. Do not run the whole list.",
          },
          {
            phase: "A game",
            minutes: Math.round(baseDaily(player.age).minutes * 0.3),
            detail:
              "1v1, or a parent as a slow shark. Two tiny goals made of shoes. This is the part rec practice usually skips: a decision with someone in the way.",
          },
          {
            phase: "Score",
            minutes: Math.round(baseDaily(player.age).minutes * 0.15),
            detail: "Both feet into a big goal. Messy weak-foot goals count. Stop while they still want another turn.",
          },
        ]
      : OUTLINES[band].map((phase) => ({
          phase: phase.phase,
          minutes: Math.max(5, Math.round(brief.sessionMinutes * phase.share)),
          detail: phase.detail,
        }));

  return {
    verdictTitle,
    verdictBody,
    tone,
    format: brief.format,
    formation: brief.formation,
    yourSessions,
    targetSessions: target,
    sessionMinutes: brief.sessionMinutes,
    outline,
    themes: themes.map((t, i) => ({
      title: t.title,
      detail: t.principle,
      current: i === current,
    })),
    parentRole:
      player.age <= 8 && yourSessions === 0
        ? "You are the coach on the five ball days. Be the wall, the shark, and the person who ends it while it is still fun. If they have rec, go play, then do not add a second session after."
        : brief.parent,
    sideline: brief.sideline,
    notYet: brief.notYet,
    positionJob: positionJob(player.age, player.position),
    warning,
    leagueName: league,
  };
}

function growthNote(player: Player): string | null {
  if (player.gender === "girl" && player.age >= 11 && player.age <= 14) {
    return "Many girls hit a growth spurt in this window. Heels, knees, and landings matter more than extra running. Pain turns today into recovery.";
  }
  if (player.gender === "boy" && player.age >= 13 && player.age <= 16) {
    return "Many boys hit a growth spurt here. Coordination can dip while the body changes. That is not a loss of talent. Keep touches high and impacts short.";
  }
  if (player.gender === "unspecified" && player.age >= 11 && player.age <= 16) {
    return "This is a common growth-spurt window. If coordination dips or a joint aches, shorten impacts and keep the ball. Do not add running to make up for it.";
  }
  return null;
}

interface Portion {
  slot: Slot | "tactical";
  share: number;
  density: number;
}

function portionsFor(age: number, kind: DayKind): Portion[] {
  if (kind === "practice") return [{ slot: "technical", share: 1, density: 22 }];
  if (kind === "team") return [
    { slot: "mastery", share: 0.35, density: 30 },
    { slot: "technical", share: 0.65, density: 24 },
  ];
  if (kind === "match") {
    return age < 11
      ? [
          { slot: "activation", share: 0.4, density: 18 },
          { slot: "finish", share: 0.6, density: 14 },
        ]
      : [
          { slot: "activation", share: 0.45, density: 16 },
          { slot: "athletic", share: 0.2, density: 8 },
          { slot: "finish", share: 0.35, density: 14 },
        ];
  }
  if (kind === "play") return [{ slot: "play", share: 1, density: 16 }];
  if (kind === "recovery") {
    return [{ slot: "mastery", share: 1, density: 18 }];
  }
  if (age <= 6) {
    return [
      { slot: "mastery", share: 0.3, density: 28 },
      { slot: "technical", share: 0.45, density: 20 },
      { slot: "finish", share: 0.25, density: 14 },
    ];
  }
  if (age <= 8) {
    return [
      { slot: "mastery", share: 0.22, density: 28 },
      { slot: "technical", share: 0.33, density: 22 },
      { slot: "game", share: 0.3, density: 16 },
      { slot: "finish", share: 0.15, density: 14 },
    ];
  }
  if (age <= 12) {
    return [
      { slot: "mastery", share: 0.16, density: 32 },
      { slot: "technical", share: 0.26, density: 24 },
      { slot: "tactical", share: 0.14, density: 8 },
      { slot: "game", share: 0.28, density: 16 },
      { slot: "finish", share: 0.16, density: 16 },
    ];
  }
  return [
    { slot: "mastery", share: 0.12, density: 34 },
    { slot: "technical", share: 0.24, density: 26 },
    { slot: "tactical", share: 0.18, density: 10 },
    { slot: "game", share: 0.22, density: 16 },
    { slot: "athletic", share: 0.14, density: 12 },
    { slot: "finish", share: 0.1, density: 16 },
  ];
}

function allocate(totalMinutes: number, totalTouches: number, parts: Portion[]) {
  const shareSum = parts.reduce((s, p) => s + p.share, 0) || 1;
  const rows = parts.map((p) => ({
    ...p,
    minutes: Math.max(1, Math.round((totalMinutes * p.share) / shareSum)),
  }));
  const first = rows[0];
  if (first) {
    const diff = totalMinutes - rows.reduce((s, p) => s + p.minutes, 0);
    first.minutes = Math.max(1, first.minutes + diff);
  }
  const weighted = rows.map((p) => ({ ...p, w: Math.max(1, p.minutes * p.density) }));
  const wsum = weighted.reduce((s, p) => s + p.w, 0) || 1;
  const out = weighted.map((p) => ({
    slot: p.slot,
    minutes: p.minutes,
    touches: Math.max(6, Math.round((totalTouches * p.w) / wsum)),
  }));
  const head = out[0];
  if (head) {
    const diff = totalTouches - out.reduce((s, p) => s + p.touches, 0);
    head.touches = Math.max(0, head.touches + diff);
  }
  return out;
}

const SLOT_KICKER: Record<string, string> = {
  mastery: "Ball mastery",
  technical: "Technical theme",
  tactical: "Tactical picture",
  game: "Picture",
  finish: "End product",
  athletic: "Athletic",
  play: "Play",
  activation: "Activation",
  team: "At the team session",
};

function filmFor(player: Player, theme: SkillKey, kind: DayKind): FilmBlock | null {
  if (player.age < 6 || kind === "practice") return null;
  const base = baseDaily(player.age).film;
  let minutes = base;
  if (kind === "match") minutes = player.age >= 12 ? Math.min(10, Math.max(base, 10)) : 0;
  if (kind === "play" && player.age < 9) minutes = 0;
  if (kind === "recovery" && player.age >= 9) minutes = Math.max(minutes, 12);
  if (minutes <= 0) return null;

  const optional = player.age <= 6;
  const players = filmCast(player.position, player.gender).map((p) => ({ name: p.name, why: p.why }));
  let watch = "One half of a real match, muted for the first ten minutes. Pause when the ball goes backward.";
  let prompt = "Say one sentence: the best action happened because ______.";
  if (player.age <= 8) {
    watch = "Five to eight minutes of highlights. Goals, brave dribbles, simple passes.";
    prompt = "Which player looked brave, and what did they try?";
  } else if (player.age <= 12) {
    watch = `Watch ${minutes} minutes of one player in a ${player.position === "flex" ? "midfield" : "clear"} role. Pause twice. Not a stepovers compilation.`;
    prompt = "What did they do before the ball arrived?";
  } else if (player.age <= 15) {
    watch = `Watch ${minutes} minutes of a full match, only the player in your role. Pause when they are off the ball.`;
    prompt = "Where were they standing at the moment the ball turned over?";
  } else {
    watch = `${minutes} minutes of a full match, paused. Track one player in your role. Compilations do not count.`;
    prompt = "What changed in their positioning when the score changed?";
  }
  if (kind === "match" && player.age >= 12) {
    watch = "Ten minutes max. One clip of a player in your position doing the job you wrote down. Then stop.";
    prompt = "What is your one job in today's match?";
  }

  const title = optional ? "Optional watch" : kind === "recovery" ? "Film session" : "Watch";
  return {
    minutes,
    title,
    watch,
    lookFor: LOOK_FOR[theme],
    players,
    prompt,
    optional,
  };
}

function dayTargets(player: Player, kind: DayKind, factor: number): { minutes: number; touches: number } {
  const age = exactAge(player);
  const base = baseDaily(age);
  const gap = onTrackIndex(age) - technicalIndex(player);
  if (kind === "practice") {
    const minutes = age < 10 ? 14 : age < 14 ? 16 : 18;
    const touches = Math.max(50, Math.round(base.touches * 0.22));
    return { minutes, touches };
  }
  if (kind === "match") {
    const minutes = player.age < 10 ? 12 : player.age < 14 ? 15 : 18;
    return { minutes, touches: player.age < 10 ? 80 : 150 };
  }
  if (kind === "play") {
    return {
      minutes: player.age < 8 ? 20 : 25,
      touches: player.age < 8 ? 200 : 320,
    };
  }
  if (kind === "recovery") {
    return {
      minutes: player.age < 14 ? 12 : 16,
      touches: player.age < 14 ? 80 : 120,
    };
  }
  if (kind === "team") {
    const minutes = clamp(Math.round(12 + Math.max(0, gap) * 4), 10, player.age < 12 ? 18 : 22);
    const touches = Math.round(minutes * (player.age < 10 ? 14 : 18));
    return { minutes, touches };
  }
  const minutes = clamp(Math.round(base.minutes * factor), 15, 110);
  const touches = clamp(Math.round(base.touches * factor), 120, 3200);
  return { minutes, touches };
}

function keptMatchDays(age: number, matchDays: number[]): number[] {
  const unique = [...new Set(matchDays.filter((d) => d >= 0 && d <= 6))];
  const weekend = unique.filter((d) => d === 5 || d === 6);
  const weekdays = unique.filter((d) => d !== 5 && d !== 6);
  if (age <= 10) {
    if (weekend.length) return weekend.slice(0, 2);
    return weekdays.slice(0, 1);
  }
  return [...weekend, ...weekdays].slice(0, 2);
}

function assignKinds(player: Player): { kinds: DayKind[]; note: string | null } {
  const kinds: DayKind[] = Array.from({ length: 7 }, () => "recovery");
  const taken = new Set<number>();
  const notes: string[] = [];
  const requestedMatches = [...new Set(player.matchDays.filter((d) => d >= 0 && d <= 6))];
  const matches = keptMatchDays(player.age, requestedMatches);
  if (requestedMatches.length > matches.length) {
    notes.push(
      `${requestedMatches.length} days were marked as matches. ${ageBand(player.age)} keeps ${matches.length === 1 ? "one game" : "a weekend pair"} and turns the other days back into ball work. A week of games does not build the player.`,
    );
  }
  for (const d of matches) {
    kinds[d] = "match";
    taken.add(d);
  }
  for (const d of player.practiceDays ?? []) {
    if (d >= 0 && d <= 6 && !taken.has(d)) {
      kinds[d] = "practice";
      taken.add(d);
    }
  }
  for (const d of player.teamDays) {
    if (d >= 0 && d <= 6 && !taken.has(d)) {
      kinds[d] = "team";
      taken.add(d);
    }
  }
  const pref = [0, 2, 4, 1, 3, 6, 5];
  const open = pref.filter((i) => !taken.has(i));
  const full = open.slice(0, player.soloDays);
  const rest = open.slice(player.soloDays);
  for (const i of full) kinds[i] = "full";
  for (const i of rest) kinds[i] = "recovery";
  let note: string | null = null;
  if (full.length < player.soloDays) {
    notes.push(
      `You asked for ${player.soloDays} individual days. Team training and matches already occupy ${taken.size}. This week uses ${full.length} full session${full.length === 1 ? "" : "s"}, plus short top-ups on team days.`,
    );
  }
  note = notes.length ? notes.join(" ") : null;
  return { kinds, note };
}

function leverBlocks(
  date: Date,
  kind: DayKind,
  minutes: number,
  touches: number,
  lever: Lever,
): Block[] {
  const alone = "Alone. A cone or a shoe is the defender. A wall brings the ball back.";
  if (kind === "practice") {
    return [
      {
        id: `${dateKey(date)}-lever`,
        slot: "technical",
        kicker: "Around practice",
        title: lever.title,
        minutes,
        touches,
        setup: `${alone} This is the whole top-up. Do not add a second session after.`,
        steps: [lever.cue, "Ten clean reps, or the minutes, whichever ends first.", "Then stop. Practice was the rest of the day."],
        cues: [lever.cue],
        equipment: ["Ball", "Cone or shoe", "Wall"],
        easyFix: "Move the cone closer and go slower. The touch still has to match the picture.",
        hardFix: "Start further from the cone and arrive faster. The picture does not change.",
        see: "They can name which side of the cone they attacked.",
      },
    ];
  }
  const liveMin = Math.max(6, Math.round(minutes * 0.35));
  const picMin = Math.max(8, minutes - liveMin);
  const liveTouches = Math.max(16, Math.round(touches * 0.35));
  const picTouches = Math.max(24, touches - liveTouches);
  return [
    {
      id: `${dateKey(date)}-picture`,
      slot: "technical",
      kicker: "The picture",
      title: lever.title,
      minutes: picMin,
      touches: picTouches,
      setup: `${alone} One action, repeated until it is honest.`,
      steps: [
        lever.cue,
        "Sets of eight. Rest between sets. A messy touch does not count.",
        "Stop while the picture is still sharp.",
      ],
      cues: [lever.cue],
      equipment: ["Ball", "Cone or shoe", "Wall"],
      easyFix: "Move the cone closer and shorten the space.",
      hardFix: "Arrive at the cone faster. The first touch still has to be the picture, or the rep is void.",
      see: lever.why,
    },
    {
      id: `${dateKey(date)}-live`,
      slot: "game",
      kicker: "Then once",
      title: "Same picture, once",
      minutes: liveMin,
      touches: liveTouches,
      setup: "A tiny goal made of shoes. The cone stays the defender. You play it alone.",
      steps: [
        "Attack the cone. Hunt the same picture twice, not twenty.",
        "If it shows up, stop. That is the session.",
        "If it never shows up, do four slower reps and finish.",
      ],
      cues: ["Two hunts, then done."],
      equipment: ["Ball", "Cone or shoe"],
      easyFix: "Start two steps further from the cone.",
      hardFix: "Start next to the cone. No free first touch.",
      see: "The picture appears, or they can say why it did not.",
    },
  ];
}

const NEEDS_SOMEONE = /\b(partner|defender|server|teammate|opponent|goalkeeper|parent|1v1|2v2|2v1|another player|other player|other person)\b/i;
const SOLO_OK = /\b(wall|cone|shoe|alone|solo|imaginary|yourself)\b/i;

function soloLine(line: string): string | null {
  let text = line.trim();
  const marked = text.match(/^(?:no partner|no parent|no second player|if you are solo|solo)\s*:\s*/i);
  if (marked) text = text.slice(marked[0].length);
  text = text
    .replace(/\bor a parent\b/gi, "")
    .replace(/\bor parent\b/gi, "")
    .replace(/\bwith a parent\b/gi, "on your own")
    .replace(/\bpartner or a wall\b/gi, "wall")
    .replace(/\bpartner or wall\b/gi, "wall")
    .replace(/\bwall or a partner\b/gi, "wall")
    .replace(/\bwall or partner\b/gi, "wall")
    .replace(/\ba partner if you have one\b/gi, "a cone")
    .replace(/\ba partner if possible\b/gi, "a cone")
    .replace(/\ba partner, or a cone\b/gi, "a cone")
    .replace(/\bor a partner\b/gi, "")
    .replace(/\bwith a partner\b/gi, "against a wall")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.])/g, "$1")
    .trim();
  if (!text) return null;
  if (/\b(partner|parent|1v1|2v2|2v1|teammate|other person|server|opponent|coach)\b/i.test(text)) return null;
  if (NEEDS_SOMEONE.test(text) && !SOLO_OK.test(text)) return null;
  return text;
}

function soloEquipment(items: string[]): string[] {
  const out: string[] = [];
  for (const item of items) {
    const next = soloLine(item);
    if (!next || /^a partner\b/i.test(next)) continue;
    if (!out.includes(next)) out.push(next);
  }
  if (!out.some((item) => /ball/i.test(item))) out.unshift("Ball");
  return out;
}

function soloBlock(block: Block): Block {
  const steps = block.steps.map(soloLine).filter((step): step is string => Boolean(step));
  const setup = soloLine(block.setup) ?? "One ball. You. A wall or a cone stands in for another player.";
  return {
    ...block,
    setup,
    steps: steps.length ? steps : ["Do the picture alone. A cone or a shoe stands in. Count every touch."],
    cues: block.cues.map(soloLine).filter((cue): cue is string => Boolean(cue)),
    equipment: soloEquipment(block.equipment),
    easyFix: soloLine(block.easyFix) ?? "Slow down. A cone is enough.",
    hardFix: soloLine(block.hardFix) ?? "Go faster at the same cone. Do not add a person.",
    see: soloLine(block.see) ?? block.see,
  };
}

function buildBlocks(
  player: Player,
  date: Date,
  kind: DayKind,
  theme: SkillKey,
  minutes: number,
  touches: number,
  lever: Lever,
): Block[] {
  const skillBand = player.skills[theme];
  if ((kind === "full" || kind === "practice") && (skillBand === "advanced" || skillBand === "elite")) {
    return leverBlocks(date, kind, minutes, touches, lever).map(soloBlock);
  }
  const mode = adherenceFrom(player.checks).mode;
  const gk = player.position === "goalkeeper";
  const parts = portionsFor(player.age, kind).filter((p) => !(p.slot === "athletic" && player.age < 10 && kind === "full"));
  const rows = allocate(minutes, touches, parts);
  const band = ageBand(player.age);
  const tactic = TACTICS[band][isoWeek(date) % TACTICS[band].length];
  const blocks: Block[] = [];
  const used: string[] = [];

  rows.forEach((row, index) => {
    if (row.slot === "tactical" && tactic) {
      blocks.push({
        id: `${dateKey(date)}-tac`,
        slot: "tactical",
        kicker: SLOT_KICKER.tactical,
        title: tactic.title,
        minutes: row.minutes,
        touches: row.touches,
        setup: "A small space, a ball, and one rule. A cone stands in for the other player.",
        steps: [
          tactic.principle,
          `Constraint: ${tactic.constraint}`,
          "Play it. Do not explain it twice.",
          `If you coach, ask this and stop: ${tactic.question}`,
        ],
        cues: [tactic.teamCue],
        equipment: ["Ball", "Markers"],
        easyFix: "Walk through the constraint once, then play.",
        hardFix: "Lose a point every time the constraint is ignored.",
        see: "The rule shows up without a reminder by the last minute.",
      });
      return;
    }
    const slot = row.slot === "tactical" ? "game" : row.slot;
    const level =
      slot === "mastery" || slot === "activation" || slot === "play"
        ? levelFor(player.skills[theme], mode === "stretch" ? "standard" : mode)
        : slot === "finish"
          ? levelFor(player.skills.weakFoot, mode)
          : slot === "athletic"
            ? levelFor(player.skills.athleticism, mode)
            : levelFor(player.skills[theme], mode);
    const salt = hash(`${player.id}|${dateKey(date)}|${slot}|${index}`);
    const drill = pickDrill({ slot, theme, age: player.age, level, gk, salt, exclude: used });
    used.push(drill.id);
    const steps = [...drill.steps];
    if (mode === "stretch") steps.push(`Harder constraint: ${drill.hardFix}`);
    if (mode === "habit") steps.push(`Simpler version: ${drill.easyFix}`);
    if (gk && !drill.gk && (slot === "game" || slot === "play")) {
      steps.push("Keepers play this one as an outfield player. Feet stay part of the job.");
    }
    blocks.push({
      id: `${dateKey(date)}-${drill.id}-${index}`,
      slot,
      kicker: slot === "technical" ? "The detail" : (SLOT_KICKER[slot] ?? "Work"),
      title: slot === "technical" ? lever.title : drill.name,
      minutes: row.minutes,
      touches: row.touches,
      setup: drill.setup,
      steps: slot === "technical" ? [lever.cue, ...steps] : steps,
      cues: slot === "technical" ? [lever.cue, ...drill.cues.slice(0, 1)] : drill.cues,
      equipment: drill.equipment,
      easyFix: drill.easyFix,
      hardFix: drill.hardFix,
      see: drill.see,
      caution:
        slot === "athletic" && player.age >= 12
          ? "Pain, a limp, or dizziness ends the session. Speed work stays short."
          : undefined,
    });
  });

  if (kind === "team" && tactic) {
    blocks.push({
      id: `${dateKey(date)}-hunt`,
      slot: "team",
      kicker: "At the team session",
      title: "Hunt list",
      minutes: 0,
      touches: 0,
      setup: "This replaces a second practice. Do not add the full yard session after training.",
      steps: [
        `Personal hunt: ${SKILL_LABEL[theme].toLowerCase()}. Find two moments, not twenty.`,
        `Team picture this week: ${tactic.title}. ${tactic.teamCue}`,
        tactic.constraint,
      ],
      cues: [tactic.question],
      equipment: [],
      easyFix: "If the coach's session is already huge, keep only the top-up touches and one hunt.",
      hardFix: "Ask the coach if you can play the week's picture in the opposed game.",
      see: "They can name one moment after.",
    });
  }
  return blocks.map(soloBlock);
}

function kindOn(player: Player, date: Date): DayKind {
  return assignKinds(player).kinds[mondayIndex(date)] ?? "full";
}

function themeOn(player: Player, date: Date, depth = 0): { theme: SkillKey; adjust: "missed" | "short" | null } {
  const planned = themeFor(player, date);
  if (depth > 8 || kindOn(player, date) === "recovery") return { theme: planned, adjust: null };
  let prev = addDays(date, -1);
  for (let i = 0; i < 6 && kindOn(player, prev) === "recovery"; i += 1) prev = addDays(prev, -1);
  const prevKey = dateKey(prev);
  const log = (player.logs ?? []).find((item) => item.date === prevKey);
  const today = dateKey(new Date());
  const started = (player.createdAt || "").slice(0, 10);
  const countable = /^\d{4}-\d{2}-\d{2}$/.test(started) && prevKey >= started && prevKey < today;
  if (!log) {
    if (countable) {
      return { theme: themeOn(player, prev, depth + 1).theme, adjust: "missed" };
    }
    return { theme: planned, adjust: null };
  }
  const ratio = log.touchesTarget > 0 ? log.touchesDone / log.touchesTarget : 1;
  if (ratio < 0.8) return { theme: log.theme, adjust: "short" };
  return { theme: planned, adjust: null };
}

function withLead(adjust: "missed" | "short" | null, sentence: string): string {
  if (adjust === "missed") return `Last session was missed. Same work, not a double. ${sentence}`;
  if (adjust === "short") return `Last session was short. Same picture, same size. ${sentence}`;
  return sentence;
}

function stripLead(sentence: string): string {
  return sentence
    .replace(/^Last session was missed\. Same work, not a double\. /, "")
    .replace(/^Last session was short\. Same picture, same size\. /, "");
}

function sentenceFor(
  name: string,
  day: { kind: DayKind; theme: SkillKey; minutes: number; touches: number; film: number; leverTitle?: string },
): string {
  const theme = SKILL_LABEL[day.theme].toLowerCase();
  if (day.kind === "match") return `${name}'s match day. ${day.minutes} minutes of activation, about ${formatNumber(day.touches)} touches, then stop. The game is the session.`;
  if (day.kind === "practice") {
    const picture = day.leverTitle ? ` One picture: ${day.leverTitle}.` : "";
    return `${name} has practice today. ${formatNumber(day.touches)} touches in ${day.minutes} minutes around it, then stop.${picture}`;
  }
  if (day.kind === "team") return `${name}'s team day. ${day.minutes} minutes and about ${formatNumber(day.touches)} touches before leaving, aimed at ${theme}. No second practice after.`;
  if (day.kind === "play") return `${name}'s play day. About ${day.minutes} minutes and ${formatNumber(day.touches)} touches inside a game. The sheet stays light.`;
  if (day.kind === "recovery") return `${name}'s easy day. ${formatNumber(day.touches)} touches in ${day.minutes} minutes, on their own.`;
  const filmBit = day.film > 0 ? ` Then ${day.film} minutes of watching.` : "";
  return `${name}'s job today is ${theme}. ${formatNumber(day.touches)} touches in ${day.minutes} minutes.${filmBit}`;
}

export function buildDay(player: Player, date: Date, kind: DayKind, factor: number): DayPlan {
  const picked = themeOn(player, date);
  const theme = picked.theme;
  const lever = leverFor(theme, player.skills[theme]);
  let targets = dayTargets(player, kind, factor);
  const band = player.skills[theme];
  const sharp = kind === "full" && (band === "advanced" || band === "elite");
  if (sharp) {
    const cut = band === "elite" ? 0.42 : 0.6;
    targets = {
      minutes: Math.max(14, Math.round(targets.minutes * cut)),
      touches: Math.max(70, Math.round(targets.touches * cut)),
    };
  }
  const film = filmFor(player, theme, kind);
  const blocks = buildBlocks(player, date, kind, theme, targets.minutes, targets.touches, lever);
  const huntBlock = blocks.find((b) => b.slot === "team");
  const equipment = [...new Set(blocks.flatMap((b) => b.equipment))];
  const idx = mondayIndex(date);
  return {
    date: dateKey(date),
    weekday: WEEKDAYS[idx] ?? "Day",
    shortWeekday: SHORT[idx] ?? "Day",
    kind,
    kindLabel: KIND_LABEL[kind],
    theme,
    themeLabel: SKILL_LABEL[theme],
    minutes: targets.minutes,
    touches: targets.touches,
    blocks,
    sentence: withLead(
      picked.adjust,
      sharp
        ? `${firstName(player)} does not need more hours on ${SKILL_LABEL[theme].toLowerCase()}. ${lever.title}. ${formatNumber(targets.touches)} sharp touches in ${targets.minutes} minutes.`
        : sentenceFor(firstName(player), {
            kind,
            theme,
            minutes: targets.minutes,
            touches: targets.touches,
            film: film?.minutes ?? 0,
            leverTitle: lever.title,
          }),
    ),
    hunt: huntBlock?.steps ?? [],
    film,
    equipment,
    lever,
    adjust: picked.adjust,
  };
}

function scaleDay(day: DayPlan, scale: number): DayPlan {
  if (day.kind === "match") return day;
  const floor = day.kind === "recovery" || day.kind === "practice" ? 8 : day.kind === "team" ? 8 : 12;
  const minutes = Math.max(floor, Math.round(day.minutes * scale));
  const touches = Math.max(40, Math.round(day.touches * (minutes / Math.max(1, day.minutes))));
  const ratio = minutes / Math.max(1, day.minutes);
  const blocks = day.blocks.map((b) =>
    b.slot === "team"
      ? b
      : {
          ...b,
          minutes: Math.max(b.minutes > 0 ? 3 : 0, Math.round(b.minutes * ratio)),
          touches: Math.max(b.touches > 0 ? 4 : 0, Math.round(b.touches * ratio)),
        },
  );
  const stripped = stripLead(day.sentence);
  const core = stripped.includes("sharp touches")
    ? stripped
        .replace(/[\d,]+ sharp touches/, `${formatNumber(touches)} sharp touches`)
        .replace(/in \d+ minutes\.$/, `in ${minutes} minutes.`)
    : sentenceFor(stripped.split("'")[0] || "This player", {
        kind: day.kind,
        theme: day.theme,
        minutes,
        touches,
        film: day.film?.minutes ?? 0,
        leverTitle: day.lever.title,
      });
  return {
    ...day,
    minutes,
    touches,
    blocks,
    sentence: withLead(day.adjust, core),
  };
}

export function eliteBenchmark(age: number): Benchmark {
  const base = baseDaily(age);
  const solos = age <= 8 ? 4 : age >= 17 ? 4 : 5;
  return {
    dailyTouches: base.touches,
    dailyMinutes: base.minutes,
    soloDays: solos,
    teamSessions: targetTeamSessions(age, age >= 16),
    filmMinutes: base.film,
    format: BANDS[ageBand(age)].format,
  };
}

function reasonsFor(player: Player, dose: Dose, guard: string | null): string[] {
  const name = firstName(player);
  const weak = SKILL_LABEL[weakestSkill(player)].toLowerCase();
  const reasons = [
    `${name} is ${player.age}, in the ${ageBand(player.age)} window. ${BANDS[ageBand(player.age)].ages}. The game format on the pathway is ${BANDS[ageBand(player.age)].format}.`,
    `${gapLabel(dose.gap)}. Technical index ${dose.index.toFixed(1)} versus an on-track ${dose.track.toFixed(1)} at this age. The plan leans on ${weak}, the current lever.`,
    dose.adherence.label,
  ];
  if (player.environment === "rec" && player.teamDays.length === 0 && player.age <= 8) {
    reasons.push(
      "There is no team practice. The five home sessions are the whole technical plan. Rec is just the match.",
    );
  } else if (player.environment === "rec") {
    reasons.push("Recreational team reps are fewer, so the yard carries more of the touching.");
  } else if (player.environment === "competitive") {
    reasons.push("Competitive team load is already real, so the individual plan stays a top-up instead of a second job.");
  } else {
    reasons.push("Club soccer is the base. The yard fills technique the team session does not have time to isolate.");
  }
  if (player.age <= 11) {
    reasons.push("Keep one other sport or a wild play day. Early all-soccer specialization is not how the best 18-year-olds were built.");
  }
  const growth = growthNote(player);
  if (growth) reasons.push(growth);
  if (player.age >= 17) {
    reasons.push("This is the arrival window. Selectors are watching habits as much as tricks: time, food, film, and a role you can explain.");
  }
  if (guard) reasons.push(guard);
  return reasons;
}

export function buildPlan(player: Player, anchor = new Date()): Plan {
  const dose = doseFor(player);
  const { kinds, note } = assignKinds(player);
  const start = startOfWeekMonday(anchor);
  let days = kinds.map((kind, i) => buildDay(player, addDays(start, i), kind, dose.factor));
  const cap = weeklyHourCap(player.age) * 60;
  const teamOnly = kinds.filter((k) => k === "team").length;
  const matches = kinds.filter((k) => k === "match").length;
  const organized = teamOnly * teamSessionMinutes(player.age) + matches * matchLoadMinutes(player.age);
  const room = Math.max(40, cap - organized);
  const individual = days.reduce((sum, d) => sum + d.minutes, 0);
  let guard: string | null = null;
  if (individual > room + 8) {
    const scale = room / individual;
    days = days.map((d) => scaleDay(d, scale));
    guard = `The technical gap asked for more ball work than ${[8, 11, 18].includes(player.age) ? "an" : "a"} ${player.age}-year-old should stack on top of team training. Individual time is capped near ${Math.round(room)} minutes this week. Past that, the lever is the team environment, not another hour in the yard.`;
  }
  // Carry forward a bounded portion of missed work without penalizing recovery.
  const todayKey = dateKey(anchor);
  const historic = (player.logs ?? []).filter((log) => log.date < todayKey && log.date >= dateKey(addDays(anchor, -28)));
  const deficits = historic.reduce((sum, log) => sum + Math.max(0, log.touchesTarget - log.touchesDone), 0);
  // Unlogged scheduled training is considered pending, not automatically a zero:
  // parents can backfill those days without being incorrectly penalized.
  let outstanding = deficits;
  let spareMinutes = Math.max(0, cap - organized - days.reduce((sum, d) => sum + d.minutes, 0));
  days = days.map((day) => {
    if (day.date < todayKey || outstanding <= 0 || !["full", "team", "practice"].includes(day.kind))
      return day;
    const extra = Math.min(outstanding, Math.round(day.touches * 0.15),
      Math.floor(day.touches * Math.min(0.15, spareMinutes / Math.max(1, day.minutes))));
    if (extra <= 0) return day;
    const adjusted = scaleDay(day, 1 + extra / Math.max(1, day.touches));
    outstanding -= Math.max(0, adjusted.touches - day.touches);
    spareMinutes = Math.max(0, spareMinutes - (adjusted.minutes - day.minutes));
    return { ...adjusted, sentence: `${adjusted.sentence} Includes a small catch-up allocation.` };
  });
  const today = days.find((d) => d.date === todayKey) ?? days[0];
  if (!today) {
    throw new Error("Plan produced no days");
  }
  const team = buildTeamPlan(player, anchor);
  const benchmark = eliteBenchmark(player.age);
  return {
    days,
    today,
    dose,
    guard,
    scheduleNote: note,
    reasons: reasonsFor(player, dose, guard),
    benchmark,
    team,
    weekTouches: days.reduce((s, d) => s + d.touches, 0),
    weekMinutes: days.reduce((s, d) => s + d.minutes, 0),
    weekFilm: days.reduce((s, d) => s + (d.film?.minutes ?? 0), 0),
    fuelKind: today.kind === "match" ? "match" : today.kind === "recovery" || today.kind === "play" ? "rest" : "train",
  };
}

export function fuelFor(player: Player, kind: "train" | "match" | "rest"): FuelPlan {
  return buildFuel(player.age, player.gender, kind);
}

export function streak(player: Player, today: string): number {
  let cursor = parseKey(today);
  if (!player.loggedDates.includes(today)) cursor = addDays(cursor, -1);
  let n = 0;
  while (player.loggedDates.includes(dateKey(cursor))) {
    n += 1;
    cursor = addDays(cursor, -1);
    if (n > 400) break;
  }
  return n;
}

export function dueStatus(player: Player, today: string): { week: boolean; month: boolean } {
  const todayDate = parseKey(today);
  const created = parseKey(player.createdAt.slice(0, 10));
  const ageDays = Math.round((todayDate.getTime() - created.getTime()) / 86400000);
  const last = (period: "week" | "month") =>
    [...player.checks].reverse().find((c) => c.period === period);
  const lastWeek = last("week");
  const lastMonth = last("month");
  const daysSince = (iso: string | undefined) => {
    if (!iso) return 999;
    return Math.round((todayDate.getTime() - parseKey(iso).getTime()) / 86400000);
  };
  return {
    week: ageDays >= 6 && daysSince(lastWeek?.date) >= 7,
    month: ageDays >= 28 && daysSince(lastMonth?.date) >= 28,
  };
}

export function compareDose(before: Player, after: Player): string {
  const a = doseFor(before);
  const b = doseFor(after);
  const base = baseDaily(before.age);
  const touchesA = Math.round(base.touches * a.factor);
  const touchesB = Math.round(base.touches * b.factor);
  const minutesA = Math.round(base.minutes * a.factor);
  const minutesB = Math.round(base.minutes * b.factor);
  const dir =
    touchesB > touchesA + 20 ? "up" : touchesB < touchesA - 20 ? "down" : "steady";
  if (dir === "steady" && a.adherence.mode !== b.adherence.mode) {
    return `Full-session size stays near ${formatNumber(touchesB)} touches. The texture changes: ${b.adherence.label}`;
  }
  if (dir === "steady") return `Full sessions stay near ${formatNumber(touchesB)} touches and ${minutesB} minutes. ${b.adherence.label}`;
  return `A full session moves from about ${formatNumber(touchesA)} touches / ${minutesA} min to ${formatNumber(touchesB)} touches / ${minutesB} min. ${b.adherence.label}`;
}
