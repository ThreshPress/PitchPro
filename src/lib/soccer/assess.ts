import type { SkillBand, SkillKey } from "@/lib/soccer/types";

export interface ClipCheck {
  prompt: string;
  options: { label: string; score: 0 | 1 | 2 }[];
}

const often = [
  { label: "Often", score: 2 as const },
  { label: "Sometimes", score: 1 as const },
  { label: "Rarely", score: 0 as const },
];

const yes = [
  { label: "Yes", score: 2 as const },
  { label: "Sometimes", score: 1 as const },
  { label: "No", score: 0 as const },
];

export const CLIP_CHECKS: Record<SkillKey, ClipCheck[]> = {
  firstTouch: [
    { prompt: "The ball stays under control", options: yes },
    { prompt: "The touch sets up the next action", options: often },
    { prompt: "It goes away from pressure", options: often },
  ],
  dribbling: [
    { prompt: "The ball stays close", options: often },
    { prompt: "They beat a person, not just a cone", options: yes },
    { prompt: "Their head comes up", options: often },
  ],
  passing: [
    { prompt: "The pass arrives where it can be used", options: often },
    { prompt: "They use both feet", options: often },
    { prompt: "They look before they play it", options: often },
  ],
  finishing: [
    { prompt: "The shot is on target", options: often },
    { prompt: "They strike it cleanly", options: often },
    { prompt: "They choose placement, not just power", options: often },
  ],
  duels: [
    { prompt: "They stay on their feet", options: often },
    { prompt: "They keep the ball or win it back", options: often },
    { prompt: "They are brave against a person", options: yes },
  ],
  weakFoot: [
    { prompt: "The weak foot is actually used", options: often },
    { prompt: "The contact is clean", options: often },
    { prompt: "They choose it on purpose", options: often },
  ],
  athleticism: [
    { prompt: "They change speed with the ball", options: often },
    { prompt: "The first step is sharp", options: yes },
    { prompt: "Balance holds after the turn", options: often },
  ],
  decisions: [
    { prompt: "They look before the touch", options: often },
    { prompt: "The choice fits the picture", options: often },
    { prompt: "They play simple when it's on", options: often },
  ],
};

export function bandFromClip(score: number): SkillBand {
  if (score <= 1) return "beginner";
  if (score <= 3) return "developing";
  if (score <= 4) return "intermediate";
  if (score <= 5) return "advanced";
  return "elite";
}
