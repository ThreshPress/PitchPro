import type { SkillBand, SkillKey } from "@/lib/soccer/types";

export interface Lever {
  title: string;
  cue: string;
  why: string;
}

const LEVERS: Record<SkillKey, Record<SkillBand, Lever>> = {
  firstTouch: {
    beginner: {
      title: "Stop it, then play",
      cue: "Move to the ball. Sole stop. Then pass it back. Two actions, not one hopeful stretch.",
      why: "The touch has to be yours before it can go anywhere.",
    },
    developing: {
      title: "Inside, across the body",
      cue: "Receive with the inside and let the touch roll across your body, not back at the passer.",
      why: "A dead stop under the feet is no longer the problem. Direction is.",
    },
    intermediate: {
      title: "Touch away from pressure",
      cue: "Before the ball arrives, pick a side. The first touch goes there, out from under the nearest foot.",
      why: "You can control it. The next gain is choosing where it lives.",
    },
    advanced: {
      title: "Receive at their front foot",
      cue: "Set a cone where a defender's front foot would be. First touch toward that cone, controlled, so the next step is already past it.",
      why: "More wall passes will not move this. The touch has to aim at a foot that is not yours.",
    },
    elite: {
      title: "The touch is the pass",
      cue: "One contact. It is already on the foot you will play with, already going where the picture asked. Twelve of those, then stop.",
      why: "Volume is not the lever. Clean, chosen touches are.",
    },
  },
  dribbling: {
    beginner: {
      title: "Stay glued",
      cue: "Sole, inside, outside. The ball never rolls more than one step away. Both feet.",
      why: "Close control is the whole job right now.",
    },
    developing: {
      title: "One move, then go",
      cue: "Inside cut or drag-back, then four fast steps. Do not collect moves.",
      why: "A move that does not end in a burst is a dance.",
    },
    intermediate: {
      title: "Look, then take it",
      cue: "Scan, pick a gate, and arrive there with the ball. Bigger touches in space, tiny ones when a shark is close.",
      why: "You can keep the ball. Now the dribble has to go somewhere.",
    },
    advanced: {
      title: "Onto the back foot",
      cue: "A cone is the defender. Receive side-on. First touch toward the cone, then take the ball onto the open side, their back foot. One action.",
      why: "You can already dribble. Hours of gates will not make you harder to stop.",
    },
    elite: {
      title: "Touch past, or don't touch",
      cue: "If the first touch is already past the cone, go. If it lands on the cone, play a simple pass to the wall. Eight honest reps.",
      why: "At this level the dribble is a decision, not a drill.",
    },
  },
  passing: {
    beginner: {
      title: "Through the gate",
      cue: "Plant foot points at the gate. Inside of the foot. Middle of the ball. Count hits.",
      why: "Direction before power.",
    },
    developing: {
      title: "Weight they can use",
      cue: "The pass should arrive rolling, not skipping. Both feet. Call the target before you strike.",
      why: "A hard pass that they cannot play is a turnover you caused.",
    },
    intermediate: {
      title: "Play the way you face",
      cue: "First pass is secure, into the foot they can use. The second one can break the line.",
      why: "You can hit a gate. The next pass has a person on the end of it.",
    },
    advanced: {
      title: "Pass to the front foot",
      cue: "A cone is the receiver's front foot. Weight the pass so it arrives rolling just ahead of the cone, not into it. Ten passes.",
      why: "Technique is there. The pass has to set the next touch.",
    },
    elite: {
      title: "Disguise the weight",
      cue: "Same shape, two weights: one to feet, one into the space just ahead. Say which before you hit it.",
      why: "The lever is the disguise, not another hundred passes.",
    },
  },
  finishing: {
    beginner: {
      title: "Get close and score",
      cue: "Dribble near a tiny goal and score. Every other goal is the other foot, even a toe poke.",
      why: "Finishing starts as wanting to score, with both feet invited.",
    },
    developing: {
      title: "Look, then strike",
      cue: "Eyes on the goal before the shot. Inside of the foot. Pick a side out loud.",
      why: "Power without a target is just a miss you kicked harder.",
    },
    intermediate: {
      title: "Set, then hit",
      cue: "Moving ball. Two touches maximum: set it, strike across your body. Chase the miss.",
      why: "A still ball in the yard is no longer the test.",
    },
    advanced: {
      title: "Across the front foot",
      cue: "A shoe is the goalkeeper's front foot. Finish across it, low, to the open side. Not harder. Eight reps a foot, then stop.",
      why: "You can hit it. Placement past the front foot is the detail that scores.",
    },
    elite: {
      title: "One cue, one finish",
      cue: "Call near, far, or slot before contact. Misses off the frame do not count. Stop at twelve good ones.",
      why: "The session is short on purpose. Quality is the rep.",
    },
  },
  duels: {
    beginner: {
      title: "Stay with your ball",
      cue: "A cone is the shark. Turn the ball away from it and keep going. If you touch the cone, five sole taps and start again.",
      why: "Bravery with the ball is the duel at this age. You do not need another person.",
    },
    developing: {
      title: "Body between",
      cue: "Put your body between the ball and a cone. If you win the space, the first step is forward.",
      why: "Shielding is the tackle you can learn alone.",
    },
    intermediate: {
      title: "Delay, then go",
      cue: "A cone is the attacker. Do not dive at it. Show one side, then take the ball if your own touch was heavy. Restart.",
      why: "You will compete. Timing is the skill, and a cone can stand in.",
    },
    advanced: {
      title: "Attack the back foot",
      cue: "The cone is the foot their weight is on. Take the ball to the open side of the cone, their back foot. Eight times.",
      why: "You do not need more contact minutes. You need to aim at the foot they cannot use.",
    },
    elite: {
      title: "Win it and leave",
      cue: "Beat the cone and the next action is already started: a pass to the wall, or a shot. Six reps.",
      why: "Winning the ball and standing on it is only half.",
    },
  },
  weakFoot: {
    beginner: {
      title: "Ten honest tries",
      cue: "The favorite foot may only stop the ball. Dribble and pass with the other one. Messy counts.",
      why: "Avoiding the foot is the only real failure.",
    },
    developing: {
      title: "Same move, other foot",
      cue: "Whatever you just did well on the strong foot, do a slower copy on the weak one. Half speed, full shape.",
      why: "The pattern already exists. The other foot needs the same picture.",
    },
    intermediate: {
      title: "Weak foot in the game",
      cue: "Attack a cone. One of the attacks has to finish, or pass to the wall, with the weak foot. You choose when.",
      why: "Isolated reps are no longer enough. The foot has to show up in the picture.",
    },
    advanced: {
      title: "It is a choice, not a drill",
      cue: "No separate weak-foot block. The first touch or the final action is the weak foot, at game speed, eight times.",
      why: "You have the foot. Hiding it in a cone drill wastes the session.",
    },
    elite: {
      title: "Don't announce it",
      cue: "Play. The weak foot is allowed to be the solution without a warmup dedicated to it. Notice when you refuse it.",
      why: "Maintenance is attention, not mileage.",
    },
  },
  athleticism: {
    beginner: {
      title: "Stop and go",
      cue: "Dribble, stop dead on 'stop', then sprint four steps with the ball. The game is the fitness.",
      why: "Running without the ball is not the session.",
    },
    developing: {
      title: "Burst after the move",
      cue: "Every change of direction ends in four hard steps. Then walk back. Fresh, not tired.",
      why: "The acceleration is the athletic skill that shows up in the game.",
    },
    intermediate: {
      title: "Short and sharp",
      cue: "Six bursts of about ten yards with the ball, full rest between. If the last one is slower, you are done.",
      why: "Tired running teaches tired running.",
    },
    advanced: {
      title: "The step after the touch",
      cue: "The first step after a receive is explosive and already in the direction of the touch. Eight reps. Stop while the fifth and the eighth look the same.",
      why: "You do not need an extra athletic hour. You need the first step to belong to the touch.",
    },
    elite: {
      title: "Leave a rep in the tank",
      cue: "Five maximal first steps. Full rest. If anything feels sharp in a joint, the day is over.",
      why: "Fresh speed moves the index. Junk volume does not.",
    },
  },
  decisions: {
    beginner: {
      title: "Which gate",
      cue: "Two gates. You have to pick one before you dribble. Say it.",
      why: "A choice, said out loud, is the start of a decision.",
    },
    developing: {
      title: "Shark or space",
      cue: "If the cone is close, tiny touches. If the yard is empty, a bigger touch into the space. Say which.",
      why: "The picture should change the touch.",
    },
    intermediate: {
      title: "Forward or secure",
      cue: "Before each receive, call forward or secure. The touch has to match the word.",
      why: "You see enough. Now the touch has to obey the picture.",
    },
    advanced: {
      title: "Name the foot you are attacking",
      cue: "A cone is the defender. Say front foot or back foot, then aim the first touch at the side you named. If you cannot name it, pass to the wall.",
      why: "The decision is the session. Cone volume will not teach it.",
    },
    elite: {
      title: "One sentence after",
      cue: "Play the cone and the wall. After each action, one sentence: what you saw, and whether the touch matched it.",
      why: "You are training recognition, not mileage.",
    },
  },
};

export function leverFor(skill: SkillKey, band: SkillBand): Lever {
  return LEVERS[skill][band];
}
