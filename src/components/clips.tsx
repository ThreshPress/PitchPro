import { useEffect, useRef, useState } from "react";
import { BAND_LABEL, SKILL_LABEL } from "@/lib/soccer/copy";
import { CLIP_CHECKS, bandFromClip } from "@/lib/soccer/assess";
import { deleteClipBlob, loadClipBlob, saveClipBlob } from "@/lib/soccer/clip-db";
import { usePitch } from "@/lib/soccer/store";
import { SKILL_KEYS, type Player, type PlayerClip, type SkillKey } from "@/lib/soccer/types";

const MAX_SECONDS = 45;
const MAX_BYTES = 30 * 1024 * 1024;

function clipLength(src: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => resolve(Number.isFinite(video.duration) ? video.duration : 0);
    video.onerror = () => reject(new Error("clip"));
    video.src = src;
  });
}

export function ClipsBoard({ player }: { player: Player }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const applyClip = usePitch((s) => s.applyClip);
  const removeClip = usePitch((s) => s.removeClip);
  const [skill, setSkill] = useState<SkillKey | "">("");
  const [picks, setPicks] = useState<string[]>(["", "", ""]);
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [openUrl, setOpenUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [url]);

  useEffect(() => {
    return () => {
      if (openUrl) URL.revokeObjectURL(openUrl);
    };
  }, [openUrl]);

  const checks = skill ? CLIP_CHECKS[skill] : [];
  const score = checks.reduce((sum, check, index) => {
    const picked = check.options.find((option) => option.label === picks[index]);
    return sum + (picked?.score ?? 0);
  }, 0);
  const ready = Boolean(file && skill && picks.every((pick) => pick !== ""));

  const onFile = async (next: File | null) => {
    setError("");
    setSkill("");
    setPicks(["", "", ""]);
    if (!next) return;
    if (!next.type.startsWith("video/")) {
      setError("Use a video file.");
      return;
    }
    if (next.size > MAX_BYTES) {
      setError("Under 30 MB.");
      return;
    }
    const local = URL.createObjectURL(next);
    try {
      const duration = await clipLength(local);
      if (duration > MAX_SECONDS) {
        URL.revokeObjectURL(local);
        setError("Under 45 seconds.");
        return;
      }
      setUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return local;
      });
      setFile(next);
      setSeconds(Math.round(duration));
    } catch {
      URL.revokeObjectURL(local);
      setError("Could not read that clip.");
    }
  };

  const assess = async () => {
    if (!file || !skill || !ready) return;
    setBusy(true);
    setError("");
    try {
      const clip: PlayerClip = {
        id: crypto.randomUUID(),
        at: new Date().toISOString(),
        skill,
        band: bandFromClip(score),
        fileName: file.name,
        seconds,
      };
      await saveClipBlob(clip.id, file);
      applyClip(player.id, clip);
      setFile(null);
      setSkill("");
      setPicks(["", "", ""]);
      setSeconds(0);
      setUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    } catch {
      setError("Could not save that clip.");
    } finally {
      setBusy(false);
    }
  };

  const play = async (clip: PlayerClip) => {
    if (openId === clip.id) {
      setOpenId(null);
      setOpenUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      return;
    }
    const blob = await loadClipBlob(clip.id);
    if (!blob) {
      setError("Clip file is missing.");
      return;
    }
    const local = URL.createObjectURL(blob);
    setOpenUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return local;
    });
    setOpenId(clip.id);
  };

  const clips = [...(player.clips ?? [])].sort((a, b) => b.at.localeCompare(a.at));

  return (
    <div className="flex flex-col gap-5">
      <section className="card p-4">
        <p className="kicker">Skill video review</p>
        <p className="mt-2 text-sm text-muted">Upload a short drill clip (up to 45 seconds / 30 MB), then rate the observable actions with the guided checklist. This is a parent/coach observation, not automatic AI video analysis or a verified scouting grade. A clip cannot by itself establish professional potential.</p>
        <button type="button" className="btn btn-secondary mt-3" onClick={() => fileRef.current?.click()}>
          Upload
        </button>
        <input
          ref={fileRef}
          className="sr-only"
          type="file"
          accept="video/*"
          onChange={(e) => {
            const next = e.target.files?.[0] ?? null;
            e.target.value = "";
            void onFile(next);
          }}
        />
        {error ? <p className="mt-3 text-sm text-muted">{error}</p> : null}
        {url ? (
          <div className="mt-4 flex flex-col gap-4">
            <video className="max-h-80 w-full rounded-xl bg-paper" src={url} controls playsInline />
            <label className="block">
              <span className="text-sm font-semibold">Skill</span>
              <select className="field mt-1" value={skill} onChange={(e) => {
                setSkill(e.target.value as SkillKey | "");
                setPicks(["", "", ""]);
              }}>
                <option value="">{"\u00a0"}</option>
                {SKILL_KEYS.map((key) => (
                  <option key={key} value={key}>
                    {SKILL_LABEL[key]}
                  </option>
                ))}
              </select>
            </label>
            {checks.map((check, index) => (
              <label key={check.prompt} className="block">
                <span className="text-sm font-semibold">{check.prompt}</span>
                <select
                  className="field mt-1"
                  value={picks[index] ?? ""}
                  onChange={(e) =>
                    setPicks((curr) => curr.map((pick, i) => (i === index ? e.target.value : pick)))
                  }
                >
                  <option value="">{"\u00a0"}</option>
                  {check.options.map((option) => (
                    <option key={option.label} value={option.label}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            ))}
            <button type="button" className="btn btn-primary" disabled={!ready || busy} onClick={() => void assess()}>
              Save guided assessment
            </button>
          </div>
        ) : null}
      </section>
      <ul className="flex flex-col gap-2">
        {clips.map((clip) => (
          <li key={clip.id} className="card p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button type="button" className="text-left" onClick={() => void play(clip)}>
                <p className="font-semibold">
                  {SKILL_LABEL[clip.skill]} · {BAND_LABEL[clip.band]}
                </p>
                <p className="text-sm text-muted">
                  {clip.seconds ? `${clip.seconds}s · ` : ""}
                  {clip.fileName}
                </p>
              </button>
              <button
                type="button"
                className="btn btn-secondary px-3"
                onClick={() => {
                  void deleteClipBlob(clip.id);
                  removeClip(player.id, clip.id);
                  if (openId === clip.id) {
                    setOpenId(null);
                    setOpenUrl((prev) => {
                      if (prev) URL.revokeObjectURL(prev);
                      return null;
                    });
                  }
                }}
              >
                Remove
              </button>
            </div>
            {openId === clip.id && openUrl ? (
              <video className="mt-3 max-h-80 w-full rounded-xl bg-paper" src={openUrl} controls playsInline />
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
