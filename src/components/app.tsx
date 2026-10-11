import { useEffect, useState } from "react";
import { CalendarDays, Flag, Target, Video } from "lucide-react";
import { CalendarBoard, PathBoard, TodayBoard } from "@/components/board";
import { ClipsBoard } from "@/components/clips";
import { Mark } from "@/components/mark";
import { Onboarding } from "@/components/onboarding";
import { cn } from "@/lib/cn";
import { ageBand, firstName, playerIndex } from "@/lib/soccer/engine";
import { useActivePlayer, usePitch, type View } from "@/lib/soccer/store";

const NAV: { id: View; label: string; icon: typeof Target }[] = [
  { id: "today", label: "Today", icon: Target },
  { id: "calendar", label: "Calendar", icon: CalendarDays },
  { id: "path", label: "Path", icon: Flag },
  { id: "clips", label: "Clips", icon: Video },
];

export function App() {
  const [ready, setReady] = useState(false);
  const editor = usePitch((s) => s.editor);
  const player = useActivePlayer();

  useEffect(() => {
    let alive = true;
    const finish = () => {
      if (alive) setReady(true);
    };
    const api = usePitch.persist;
    if (!api || api.hasHydrated()) {
      finish();
      return;
    }
    const unsub = api.onFinishHydration(() => finish());
    const timer = window.setTimeout(finish, 800);
    return () => {
      alive = false;
      unsub();
      window.clearTimeout(timer);
    };
  }, []);

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center gap-3 bg-paper px-6 text-ink">
        <Mark className="size-12" />
        <p className="font-display text-3xl leading-none">Pitch Pro</p>
      </main>
    );
  }

  if (!player || editor === "create") return <Onboarding />;
  if (editor === "edit") return <Onboarding initial={player} />;
  return <Shell />;
}

function Shell() {
  const player = useActivePlayer();
  const players = usePitch((s) => s.players);
  const view = usePitch((s) => s.view);
  const setView = usePitch((s) => s.setView);
  const setActive = usePitch((s) => s.setActive);
  const setEditor = usePitch((s) => s.setEditor);
  if (!player) return null;

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="sticky top-0 z-20 border-b border-line bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 md:px-8">
          <div className="flex items-center gap-2">
            <Mark />
            <p className="font-display text-xl leading-none">Pitch Pro</p>
          </div>
          <p className="font-display text-4xl leading-none text-pitch">{player.attrs ? playerIndex(player.attrs).toFixed(1) : "—"}</p>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <label className="sr-only" htmlFor="player-switch">
              Active player
            </label>
            <select
              id="player-switch"
              className="field w-auto max-w-44"
              value={player.id}
              onChange={(e) => setActive(e.target.value)}
            >
              {players.map((item) => (
                <option key={item.id} value={item.id}>
                  {firstName(item)} · {ageBand(item.age)}
                </option>
              ))}
            </select>
            <button type="button" className="btn btn-secondary px-3" onClick={() => setEditor("edit")}>
              Edit
            </button>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-6xl md:grid-cols-[12.5rem_minmax(0,1fr)]">
        <nav className="hidden px-4 py-6 md:block" aria-label="Sections">
          <ul className="sticky top-24 flex flex-col gap-1">
            {NAV.map((item) => (
              <li key={item.id}>
                <NavButton id={item.id} label={item.label} icon={item.icon} current={view} onSelect={setView} />
              </li>
            ))}
          </ul>
        </nav>
        <main className="min-w-0 px-4 pt-5 pb-28 md:px-8 md:pt-8 md:pb-16">
          {view === "today" ? <TodayBoard player={player} /> : null}
          {view === "calendar" ? <CalendarBoard player={player} /> : null}
          {view === "path" ? <PathBoard player={player} /> : null}
          {view === "clips" ? <ClipsBoard player={player} /> : null}
        </main>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-card md:hidden" aria-label="Sections">
        <ul className="grid grid-cols-4">
          {NAV.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className={cn(
                  "flex min-h-16 w-full flex-col items-center justify-center gap-1 text-xs font-semibold",
                  view === item.id ? "text-pitch" : "text-muted",
                )}
                onClick={() => setView(item.id)}
              >
                <item.icon className="size-5" />
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

function NavButton({
  id,
  label,
  icon: Icon,
  current,
  onSelect,
}: {
  id: View;
  label: string;
  icon: typeof Target;
  current: View;
  onSelect: (view: View) => void;
}) {
  const on = current === id;
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={cn(
        "flex min-h-11 w-full items-center gap-2 rounded-full px-3 text-sm font-semibold",
        on ? "bg-pitch text-on-pitch" : "text-ink hover:bg-paper-deep",
      )}
    >
      <Icon className="size-4" />
      {label}
    </button>
  );
}
