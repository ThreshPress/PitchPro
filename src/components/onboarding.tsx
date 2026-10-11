import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Mark } from "@/components/mark";
import { cn } from "@/lib/cn";
import { BAND_LABEL, POS_LABEL, SKILL_LABEL } from "@/lib/soccer/copy";
import { ageBand, buildPlan, exactAge, formatNumber, playerIndex } from "@/lib/soccer/engine";
import { usePitch } from "@/lib/soccer/store";
import { BAND_ATTR, SKILL_BANDS, SKILL_KEYS, type Gender, type Player, type Position, type SkillBand, type SkillKey } from "@/lib/soccer/types";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function attrsFor(skills: Record<SkillKey, SkillBand>, previous?: Player): Record<SkillKey, number> {
  const attrs = {} as Record<SkillKey, number>;
  for (const key of SKILL_KEYS) {
    if (previous && previous.skills[key] === skills[key] && typeof previous.attrs?.[key] === "number") {
      attrs[key] = previous.attrs[key];
    } else {
      attrs[key] = BAND_ATTR[skills[key]];
    }
  }
  return attrs;
}

export function Onboarding({ initial }: { initial?: Player }) {
  const savePlayer = usePitch((s) => s.savePlayer);
  const setEditor = usePitch((s) => s.setEditor);
  const [step, setStep] = useState(0);
  const [name, setName] = useState(initial?.name ?? "");
  const [years, setYears] = useState<number | "">(initial ? initial.age : "");
  const [months, setMonths] = useState<number | "">(initial ? (initial.ageMonths ?? 0) : "");
  const [gender, setGender] = useState<Gender | "">(initial?.gender ?? "");
  const [position, setPosition] = useState<Position | "">(initial ? initial.position : "");
  const [skills, setSkills] = useState<Partial<Record<SkillKey, SkillBand>>>(initial?.skills ?? {});
  const [practiceDays, setPracticeDays] = useState<number[]>(initial?.practiceDays ?? []);
  const [gameDay, setGameDay] = useState<number | null>(initial?.matchDays?.[0] ?? null);

  const skillsReady = SKILL_KEYS.every((key) => Boolean(skills[key]));
  const filled = skillsReady ? (skills as Record<SkillKey, SkillBand>) : null;
  const ageReady = years !== "" && months !== "" && position !== "" && gender !== "";
  const stepReady = [ageReady, skillsReady, skillsReady][step];

  const preview = useMemo(() => {
    if (!filled || gender === "" || position === "" || years === "" || months === "") return null;
    const attrs = attrsFor(filled, initial);
    const player: Player = {
      id: initial?.id ?? "preview",
      name: name.trim() || "Player",
      age: years,
      ageMonths: years >= 18 ? 0 : months,
      gender,
      environment: "rec",
      position,
      skills: filled,
      attrs,
      soloDays: 5,
      teamDays: [],
      practiceDays,
      matchDays: gameDay === null ? [] : [gameDay],
      createdAt: initial?.createdAt ?? todayKey(),
      checks: initial?.checks ?? [],
      loggedDates: initial?.loggedDates ?? [],
      logs: initial?.logs ?? [],
      clips: initial?.clips ?? [],
    };
    return { player, plan: buildPlan(player) };
  }, [filled, gameDay, gender, initial, months, name, position, practiceDays, years]);

  const save = () => {
    if (!preview || gender === "" || position === "" || !filled) return;
    savePlayer({
      ...preview.player,
      id: initial?.id ?? crypto.randomUUID(),
      name: name.trim() || "Player",
    });
  };

  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="mx-auto max-w-xl px-4 py-6 md:px-8 md:py-10">
        <section>
          <div className="flex items-center gap-3">
            <Mark className="size-14" />
            <h1 className="font-display text-5xl leading-none md:text-6xl">Pitch Pro</h1>
          </div>

          {step === 0 ? (
            <div className="mt-6 flex flex-col gap-4">
              <label className="block">
                <span className="text-sm font-semibold">Name</span>
                <input className="field mt-1" value={name} onChange={(e) => setName(e.target.value)} />
              </label>
              <fieldset>
                <legend className="text-sm font-semibold">Gender</legend>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {(
                    [
                      ["girl", "Girl"],
                      ["boy", "Boy"],
                      ["unspecified", "Unspecified"],
                    ] as const
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={gender === id}
                      className={cn("btn px-2", gender === id ? "btn-primary" : "btn-secondary")}
                      onClick={() => setGender(id)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </fieldset>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-sm font-semibold">Years</span>
                  <select
                    className="field mt-1"
                    value={years === "" ? "" : String(years)}
                    onChange={(e) => {
                      if (e.target.value === "") {
                        setYears("");
                        return;
                      }
                      const next = Number(e.target.value);
                      setYears(next);
                      if (next >= 18) setMonths(0);
                    }}
                  >
                    <option value="">{"\u00a0"}</option>
                    {Array.from({ length: 15 }, (_, i) => i + 4).map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm font-semibold">Months</span>
                  <select
                    className="field mt-1"
                    value={months === "" ? "" : String(months)}
                    disabled={years === 18}
                    onChange={(e) => setMonths(e.target.value === "" ? "" : Number(e.target.value))}
                  >
                    <option value="">{"\u00a0"}</option>
                    {Array.from({ length: 12 }, (_, n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              {years !== "" && months !== "" ? (
                <p className="text-sm text-muted">
                  {ageBand(years)} · {exactAge({ age: years, ageMonths: years >= 18 ? 0 : months }).toFixed(1)}
                </p>
              ) : null}
              <label className="block">
                <span className="text-sm font-semibold">Role</span>
                <select className="field mt-1" value={position} onChange={(e) => setPosition(e.target.value as Position | "")}>
                  <option value="">{"\u00a0"}</option>
                  {(Object.keys(POS_LABEL) as Position[]).map((id) => (
                    <option key={id} value={id}>
                      {POS_LABEL[id]}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="mt-6 flex flex-col gap-4">
              {SKILL_KEYS.map((key) => (
                <label key={key} className="block">
                  <span className="text-sm font-semibold">{SKILL_LABEL[key]}</span>
                  <select
                    className="field mt-1"
                    value={skills[key] ?? ""}
                    onChange={(e) => setSkills((curr) => ({ ...curr, [key]: e.target.value as SkillBand }))}
                  >
                    <option value="">{"\u00a0"}</option>
                    {SKILL_BANDS.map((band) => (
                      <option key={band} value={band}>
                        {BAND_LABEL[band]}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          ) : null}

          {step === 2 && preview ? (
            <div className="mt-6 flex flex-col gap-4">
              <div>
                <p className="text-sm font-semibold">Practice</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {DAYS.map((label, index) => (
                    <button
                      key={label}
                      type="button"
                      aria-pressed={practiceDays.includes(index)}
                      className={cn("btn px-3", practiceDays.includes(index) ? "btn-primary" : "btn-secondary")}
                      onClick={() =>
                        setPracticeDays((curr) =>
                          curr.includes(index) ? curr.filter((d) => d !== index) : [...curr, index].sort(),
                        )
                      }
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold">Game day</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {DAYS.map((label, index) => (
                    <button
                      key={label}
                      type="button"
                      aria-pressed={gameDay === index}
                      className={cn("btn px-3", gameDay === index ? "btn-primary" : "btn-secondary")}
                      onClick={() => setGameDay((curr) => (curr === index ? null : index))}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-line bg-card p-4">
                <p className="kicker">Index</p>
                <p className="font-display text-6xl leading-none">{playerIndex(preview.player.attrs).toFixed(1)}</p>
                <p className="mt-3 text-sm">
                  {formatNumber(preview.plan.today.touches)} touches · {preview.plan.today.minutes} min · {preview.plan.today.lever.title}
                </p>
              </div>
            </div>
          ) : null}

          <div className="mt-6 flex items-center justify-between gap-3">
            {step === 0 && initial ? (
              <button type="button" className="btn btn-quiet" onClick={() => setEditor(null)}>
                Cancel
              </button>
            ) : step > 0 ? (
              <button type="button" className="btn btn-quiet" onClick={() => setStep((s) => s - 1)}>
                <ArrowLeft className="size-4" />
                Back
              </button>
            ) : (
              <span />
            )}
            {step < 2 ? (
              <button type="button" className="btn btn-primary" disabled={!stepReady} onClick={() => setStep((s) => s + 1)}>
                Continue
                <ArrowRight className="size-4" />
              </button>
            ) : (
              <button type="button" className="btn btn-primary" onClick={save}>
                {initial ? "Update the plan" : "Build the plan"}
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
