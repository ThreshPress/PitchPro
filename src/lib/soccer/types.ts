export const SKILL_KEYS = [
  "firstTouch",
  "dribbling",
  "passing",
  "finishing",
  "duels",
  "weakFoot",
  "athleticism",
  "decisions",
] as const;

export type SkillKey = (typeof SKILL_KEYS)[number];

export const SKILL_BANDS = [
  "beginner",
  "developing",
  "intermediate",
  "advanced",
  "elite",
] as const;

export type SkillBand = (typeof SKILL_BANDS)[number];

export const BAND_SCORE: Record<SkillBand, number> = {
  beginner: 1,
  developing: 2,
  intermediate: 3,
  advanced: 4,
  elite: 5,
};

export type Gender = "girl" | "boy" | "unspecified";
export type Environment = "rec" | "club" | "competitive";
export type Position =
  | "goalkeeper"
  | "fullback"
  | "centerback"
  | "midfielder"
  | "winger"
  | "striker"
  | "flex";

export type AgeBand = "U6" | "U8" | "U10" | "U12" | "U14" | "U16" | "U18";

export type Blocker = "time" | "fun" | "soreness" | "overload" | "travel" | "motivation";

export const BAND_ATTR: Record<SkillBand, number> = {
  beginner: 16,
  developing: 40,
  intermediate: 56,
  advanced: 72,
  elite: 88,
};

export interface SessionLog {
  date: string;
  touchesDone: number;
  touchesTarget: number;
  completed?: boolean;
  theme: SkillKey;
  gain: number;
  indexBefore: number;
  indexAfter: number;
}

export interface PlayerClip {
  id: string;
  at: string;
  skill: SkillKey;
  band: SkillBand;
  fileName: string;
  seconds: number;
}

export interface CheckIn {
  id: string;
  date: string;
  period: "week" | "month";
  result: "missed" | "met" | "exceeded";
  blockers: Blocker[];
  note: string;
  summary: string;
  indexBefore?: number;
  indexAfter?: number;
}

export interface Player {
  id: string;
  name: string;
  age: number;
  ageMonths: number;
  gender: Gender;
  environment: Environment;
  position: Position;
  skills: Record<SkillKey, SkillBand>;
  attrs: Record<SkillKey, number>;
  soloDays: number;
  teamDays: number[];
  practiceDays: number[];
  matchDays: number[];
  createdAt: string;
  checks: CheckIn[];
  loggedDates: string[];
  logs: SessionLog[];
  clips: PlayerClip[];
}

export type DayKind = "full" | "team" | "match" | "play" | "recovery" | "practice";
export type Level = "easy" | "standard" | "hard";
export type Slot =
  | "mastery"
  | "technical"
  | "game"
  | "finish"
  | "athletic"
  | "play"
  | "activation";

export interface Drill {
  id: string;
  name: string;
  themes: SkillKey[];
  slots: Slot[];
  minAge: number;
  maxAge: number;
  level: Level;
  gk?: boolean;
  setup: string;
  steps: string[];
  cues: string[];
  equipment: string[];
  easyFix: string;
  hardFix: string;
  see: string;
}
