import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";
import {
  BAND_ATTR,
  SKILL_BANDS,
  SKILL_KEYS,
  type CheckIn,
  type Player,
  type PlayerClip,
  type SessionLog,
  type SkillBand,
  type SkillKey,
} from "@/lib/soccer/types";
import { bandFromAttr, buildPlan, dateKey, gainFor, parseKey, playerIndex } from "@/lib/soccer/engine";

export type View = "today" | "calendar" | "path" | "clips";

interface PitchState {
  players: Player[];
  activeId: string | null;
  coachMode: boolean;
  view: View;
  editor: "create" | "edit" | null;
  setView: (view: View) => void;
  setEditor: (editor: "create" | "edit" | null) => void;
  setCoachMode: (on: boolean) => void;
  setActive: (id: string) => void;
  savePlayer: (player: Player) => void;
  removePlayer: (id: string) => void;
  toggleLogged: (id: string, date: string) => void;
  logWork: (id: string, date: string, touchesDone: number, completed?: boolean) => void;
  applyClip: (id: string, clip: PlayerClip) => void;
  removeClip: (id: string, clipId: string) => void;
  applyCheck: (id: string, check: CheckIn, skills?: Record<SkillKey, SkillBand>) => void;
}

const memory = new Map<string, string>();

const memoryStorage: StateStorage = {
  getItem: (name) => memory.get(name) ?? null,
  setItem: (name, value) => {
    memory.set(name, value);
  },
  removeItem: (name) => {
    memory.delete(name);
  },
};

function readRaw(storage: Storage, name: string): string | null {
  try {
    const raw = storage.getItem(name);
    if (raw == null) return null;
    JSON.parse(raw);
    return raw;
  } catch {
    return null;
  }
}

function browserStorage(): StateStorage {
  if (typeof window === "undefined") return memoryStorage;
  let ls: Storage | null = null;
  try {
    ls = window.localStorage;
    ls.getItem("pitchpath-v1");
  } catch {
    ls = null;
  }
  return {
    getItem: (name) => {
      const saved = ls ? readRaw(ls, name) : null;
      if (saved != null) return saved;
      return memoryStorage.getItem(name);
    },
    setItem: (name, value) => {
      memoryStorage.setItem(name, value);
      if (!ls) return;
      try {
        ls.setItem(name, value);
      } catch {
        /* memory copy is the backup */
      }
    },
    removeItem: (name) => {
      memoryStorage.removeItem(name);
      try {
        ls?.removeItem(name);
      } catch {
        /* ignore */
      }
    },
  };
}

function isBand(value: unknown): value is SkillBand {
  return SKILL_BANDS.includes(value as SkillBand);
}

function normalizePlayer(value: unknown): Player | null {
  if (!value || typeof value !== "object") return null;
  const p = value as Partial<Player>;
  if (typeof p.id !== "string" || typeof p.age !== "number") return null;
  const skills = {} as Record<SkillKey, SkillBand>;
  for (const key of SKILL_KEYS) {
    const band = p.skills?.[key];
    skills[key] = isBand(band) ? band : "developing";
  }
  return {
    id: p.id,
    name: typeof p.name === "string" && p.name.trim() ? p.name : "Player",
    age: Math.min(18, Math.max(4, Math.round(p.age))),
    gender: p.gender === "girl" || p.gender === "boy" || p.gender === "unspecified" ? p.gender : "unspecified",
    environment: p.environment === "rec" || p.environment === "club" || p.environment === "competitive" ? p.environment : "club",
    position:
      p.position === "goalkeeper" ||
      p.position === "fullback" ||
      p.position === "centerback" ||
      p.position === "midfielder" ||
      p.position === "winger" ||
      p.position === "striker" ||
      p.position === "flex"
        ? p.position
        : "flex",
    skills,
    attrs: attrsFrom(skills, p.attrs),
    soloDays: typeof p.soloDays === "number" ? p.soloDays : 5,
    teamDays: Array.isArray(p.teamDays) ? p.teamDays.filter((n) => typeof n === "number") : [],
    practiceDays: Array.isArray(p.practiceDays)
      ? p.practiceDays.filter((n) => typeof n === "number")
      : Array.isArray(p.teamDays)
        ? p.teamDays.filter((n) => typeof n === "number")
        : [],
    matchDays: Array.isArray(p.matchDays) ? p.matchDays.filter((n) => typeof n === "number") : [5],
    createdAt: typeof p.createdAt === "string" ? p.createdAt : "",
    checks: Array.isArray(p.checks) ? p.checks : [],
    loggedDates: Array.isArray(p.loggedDates) ? p.loggedDates.filter((d) => typeof d === "string") : [],
    ageMonths: typeof p.ageMonths === "number" ? Math.min(11, Math.max(0, Math.round(p.ageMonths))) : 0,
    logs: Array.isArray(p.logs) ? p.logs.filter(isLog) : [],
    clips: Array.isArray(p.clips) ? p.clips.filter(isClip) : [],
  };
}

function attrsFrom(skills: Record<SkillKey, SkillBand>, raw: Partial<Record<SkillKey, number>> | undefined) {
  const attrs = {} as Record<SkillKey, number>;
  for (const key of SKILL_KEYS) {
    const value = raw?.[key];
    attrs[key] = typeof value === "number" && Number.isFinite(value) ? Math.min(99, Math.max(1, value)) : BAND_ATTR[skills[key]];
  }
  return attrs;
}

function playerRichness(player: Player): number {
  return 1 + (player.logs?.length ?? 0) * 3 + (player.checks?.length ?? 0) + (player.clips?.length ?? 0);
}

function mergePlayers(saved: Player[], live: Player[]): Player[] {
  const byId = new Map<string, Player>();
  for (const player of saved) byId.set(player.id, player);
  for (const player of live) {
    const prev = byId.get(player.id);
    if (!prev || playerRichness(player) >= playerRichness(prev)) byId.set(player.id, player);
  }
  return [...byId.values()];
}
function isClip(value: unknown): value is PlayerClip {
  if (!value || typeof value !== "object") return false;
  const clip = value as Partial<PlayerClip>;
  return (
    typeof clip.id === "string" &&
    typeof clip.skill === "string" &&
    SKILL_KEYS.includes(clip.skill as SkillKey) &&
    isBand(clip.band) &&
    typeof clip.at === "string"
  );
}
function isLog(value: unknown): value is SessionLog {
  if (!value || typeof value !== "object") return false;
  const log = value as Partial<SessionLog>;
  return typeof log.date === "string" && typeof log.touchesDone === "number" && typeof log.theme === "string";
}

export const usePitch = create<PitchState>()(
  persist(
    (set) => ({
      players: [],
      activeId: null,
      coachMode: false,
      view: "today",
      editor: null,
      setView: (view) => set({ view }),
      setEditor: (editor) => set({ editor }),
      setCoachMode: (coachMode) => set({ coachMode }),
      setActive: (activeId) => set({ activeId, view: "today" }),
      savePlayer: (player) =>
        set((state) => {
          const exists = state.players.some((p) => p.id === player.id);
          const players = exists
            ? state.players.map((p) => (p.id === player.id ? player : p))
            : [...state.players, player];
          return { players, activeId: player.id, editor: null, view: "today" };
        }),
      removePlayer: (id) =>
        set((state) => {
          const players = state.players.filter((p) => p.id !== id);
          const activeId = state.activeId === id ? (players[0]?.id ?? null) : state.activeId;
          return { players, activeId, editor: null };
        }),
      toggleLogged: (id, date) =>
        set((state) => ({
          players: state.players.map((p) => {
            if (p.id !== id) return p;
            const logged = Array.isArray(p.loggedDates) ? p.loggedDates : [];
            const has = logged.includes(date);
            return {
              ...p,
              loggedDates: has ? logged.filter((d) => d !== date) : [...logged, date],
            };
          }),
        })),
      logWork: (id, date, touchesDone, completed = true) =>
        set((state) => ({
          players: state.players.map((p) => {
            if (p.id !== id) return p;
            const done = Math.max(0, Math.round(touchesDone));
            const prev = (p.logs ?? []).find((item) => item.date === date);
            const attrs = { ...p.attrs };
            const skills = { ...p.skills };
            if (prev) {
              attrs[prev.theme] = Math.min(99, Math.max(1, Math.round((attrs[prev.theme] - prev.gain) * 10) / 10));
              skills[prev.theme] = bandFromAttr(attrs[prev.theme]);
            }
            const plan = buildPlan({ ...p, attrs, skills }, parseKey(date));
            const day = plan.days.find((item) => item.date === date);
            if (!day) return p;
            const indexBefore = playerIndex(attrs);
            const target = prev?.touchesTarget ?? day.touches;
            const ratio = target > 0 ? done / target : 0;
            const gain = gainFor(attrs[day.theme] ?? 40, ratio * (completed ? 1 : 0.5));
            const nextAttr = Math.min(99, Math.round(((attrs[day.theme] ?? 40) + gain) * 10) / 10);
            attrs[day.theme] = nextAttr;
            skills[day.theme] = bandFromAttr(nextAttr);
            const indexAfter = playerIndex(attrs);
            const log: SessionLog = {
              date: day.date,
              touchesDone: done,
              touchesTarget: target,
              completed,
              theme: day.theme,
              gain,
              indexBefore,
              indexAfter,
            };
            const logs = [...(p.logs ?? []).filter((item) => item.date !== day.date), log];
            const loggedDates = p.loggedDates.includes(day.date) ? p.loggedDates : [...p.loggedDates, day.date];
            return { ...p, attrs, skills, logs, loggedDates };
          }),
        })),
      applyClip: (id, clip) =>
        set((state) => ({
          players: state.players.map((p) => {
            if (p.id !== id) return p;
            const skills = { ...p.skills, [clip.skill]: clip.band };
            const attrs = { ...p.attrs };
            if (p.skills[clip.skill] !== clip.band) attrs[clip.skill] = BAND_ATTR[clip.band];
            const clips = [...(p.clips ?? []).filter((item) => item.id !== clip.id), clip];
            return { ...p, skills, attrs, clips };
          }),
        })),
      removeClip: (id, clipId) =>
        set((state) => ({
          players: state.players.map((p) =>
            p.id === id ? { ...p, clips: (p.clips ?? []).filter((item) => item.id !== clipId) } : p,
          ),
        })),
      applyCheck: (id, check, skills) =>
        set((state) => ({
          players: state.players.map((p) => {
            if (p.id !== id) return p;
            const checks = [
              ...(Array.isArray(p.checks) ? p.checks : []).filter(
                (c) => !(c.date === check.date && c.period === check.period),
              ),
              check,
            ];
            return { ...p, checks, skills: skills ?? p.skills };
          }),
        })),
    }),
    {
      name: "pitchpath-v1",
      skipHydration: true,
      storage: createJSONStorage(browserStorage),
      merge: (persisted, current) => {
        const saved = persisted && typeof persisted === "object" ? (persisted as Partial<PitchState>) : {};
        const savedPlayers = Array.isArray(saved.players)
          ? saved.players.map(normalizePlayer).filter((p): p is Player => p !== null)
          : [];
        const livePlayers = Array.isArray(current.players)
          ? current.players.map(normalizePlayer).filter((p): p is Player => p !== null)
          : [];
        const players = mergePlayers(savedPlayers, livePlayers);
        const activeId =
          (current.activeId && players.some((p) => p.id === current.activeId) ? current.activeId : null) ??
          (players.some((p) => p.id === saved.activeId) ? (saved.activeId ?? null) : null) ??
          players[0]?.id ??
          null;
        return {
          ...current,
          players,
          activeId,
          coachMode: Boolean(saved.coachMode || current.coachMode),
        };
      },
      partialize: (state) => ({
        players: state.players,
        activeId: state.activeId,
        coachMode: state.coachMode,
      }),
    },
  ),
);

export function useActivePlayer(): Player | null {
  return usePitch((s) => s.players.find((p) => p.id === s.activeId) ?? null);
}

if (typeof window !== "undefined") {
  void usePitch.persist?.rehydrate();
}
