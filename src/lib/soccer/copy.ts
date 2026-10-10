import type {
  AgeBand,
  Environment,
  Gender,
  Position,
  SkillBand,
  SkillKey,
} from "@/lib/soccer/types";

export const SKILL_LABEL: Record<SkillKey, string> = {
  firstTouch: "First touch",
  dribbling: "Dribbling",
  passing: "Passing",
  finishing: "Finishing",
  duels: "1v1 duels",
  weakFoot: "Weak foot",
  athleticism: "Speed & agility",
  decisions: "Scanning & decisions",
};

export const BAND_LABEL: Record<SkillBand, string> = {
  beginner: "Beginner",
  developing: "Developing",
  intermediate: "Intermediate",
  advanced: "Advanced",
  elite: "Elite",
};

export const SKILL_MEANING: Record<SkillKey, Record<SkillBand, string>> = {
  firstTouch: {
    beginner: "The ball bounces away when it arrives.",
    developing: "Can stop a rolling ball with the sole if there is time.",
    intermediate: "Cushions with the inside, then plays a simple next pass.",
    advanced: "The touch sets up the next action, both feet, under light pressure.",
    elite: "The touch breaks a line or hides the ball. It is a decision, not a stop.",
  },
  dribbling: {
    beginner: "Kicks it and chases.",
    developing: "Keeps it close in a straight line at an easy speed.",
    intermediate: "Changes direction with one move and keeps the ball.",
    advanced: "Beats a defender with a move that has an end product.",
    elite: "Unbalances a defender, then plays forward. Both feet.",
  },
  passing: {
    beginner: "The pass is a kick toward a person.",
    developing: "Inside foot, short distance, most of them arrive.",
    intermediate: "Weight is playable. Can use two surfaces.",
    advanced: "Plays around a corner and hits the receiver's right foot.",
    elite: "Weight and choice create the next advantage, weak foot included.",
  },
  finishing: {
    beginner: "Hits it toward the goal and hopes.",
    developing: "Scores from close range when the ball is still.",
    intermediate: "Finishes a moving ball from about ten yards.",
    advanced: "Picks a side from a cross or a cutback. Both feet.",
    elite: "The finish matches the goalkeeper. One or two touches, rarely more.",
  },
  duels: {
    beginner: "Dives in, or avoids the duel.",
    developing: "Tries to win it. Sometimes gets the body in the way.",
    intermediate: "Can shield, and can delay a dribbler without diving in.",
    advanced: "Wins it or forces a backward pass, then recovers fast.",
    elite: "Duels are timed. Pressing cues and body shape, not just bravery.",
  },
  weakFoot: {
    beginner: "Avoids it.",
    developing: "Will use it if reminded. The pass is a nudge.",
    intermediate: "Can pass and dribble slowly with it on purpose.",
    advanced: "Will shoot and receive with it in a game.",
    elite: "A defender cannot show them onto it and feel safe.",
  },
  athleticism: {
    beginner: "Still learning to run, stop, and turn with a ball.",
    developing: "Can sprint and stop, but the ball gets left behind.",
    intermediate: "Accelerates with the ball and lands on balance.",
    advanced: "The first step is sharp, and the pass still works after it.",
    elite: "Speed is usable late in the game. Braking is as clean as going.",
  },
  decisions: {
    beginner: "Eyes stay on the ball. The plan appears after the touch.",
    developing: "Sometimes looks up before receiving.",
    intermediate: "Chooses pass or dribble in simple games. Scans when reminded.",
    advanced: "Checks the shoulder and plays the picture they saw.",
    elite: "Plays the next action early. Teammates know where the ball is going.",
  },
};

export const ENV_LABEL: Record<Environment, string> = {
  rec: "Recreational",
  club: "Club",
  competitive: "Competitive",
};

export const ENV_HINT: Record<Environment, string> = {
  rec: "House, rec, or in-house. Practices are short and the roster is mixed.",
  club: "Travel or town club. A coach, a schedule, not a national league.",
  competitive: "MLS NEXT, ECNL, Girls Academy, or a state premier / ECNL-RL level.",
};

export const POS_LABEL: Record<Position, string> = {
  goalkeeper: "Goalkeeper",
  fullback: "Fullback",
  centerback: "Center back",
  midfielder: "Midfielder",
  winger: "Winger",
  striker: "Striker",
  flex: "No set position",
};

export const BLOCKER_LABEL: Record<string, string> = {
  time: "Not enough time",
  fun: "It was not fun",
  soreness: "Soreness or pain",
  overload: "Team load was already high",
  travel: "Travel or a busy week",
  motivation: "Hard to get out the door",
};

export interface BandBrief {
  id: AgeBand;
  ages: string;
  format: string;
  formation: string;
  targetSessions: number;
  sessionMinutes: number;
  notYet: string[];
  milestones: string[];
  parent: string;
  sideline: string[];
}

export const BANDS: Record<AgeBand, BandBrief> = {
  U6: {
    id: "U6",
    ages: "Ages 4–6",
    format: "3v3 or 4v4",
    formation: "No formation and no fixed positions.",
    targetSessions: 1,
    sessionMinutes: 45,
    notYet: ["Formations", "Offside lectures", "Heading", "A specialist position", "Laps without a ball"],
    milestones: [
      "They want to bring the ball everywhere.",
      "They can stop a rolling ball with the sole, sometimes.",
      "They try both feet without a fight.",
      "Games are short, and they still smile at the end.",
    ],
    parent: "Your job is to play, not to coach. Be the wall, the shark, and the ride home.",
    sideline: [
      "Cheer effort and bravery. Do not shout instructions.",
      "If you are the coach, the session is games. The rules are few.",
      "Ask after: what was fun? Not: why did you pass there?",
    ],
  },
  U8: {
    id: "U8",
    ages: "Ages 7–8",
    format: "4v4, sometimes 5v5",
    formation: "Still no fixed positions. Rotate the goalkeeper.",
    targetSessions: 2,
    sessionMinutes: 55,
    notYet: ["A real formation", "Heading practice", "Set-piece choreography", "Year-round single sport"],
    milestones: [
      "They dribble out of pressure sometimes instead of booting it.",
      "They look up because a friend is actually there.",
      "They can pass through a gate with the inside of the foot.",
      "One other sport or a pile of free play is still in the week.",
    ],
    parent: "Keep a second sport or wild free play in the week. The best 17-year-olds were not soccer-only at 8.",
    sideline: [
      "One voice on the sideline: the coach.",
      "Do not run the touchline coaching the dribble you just practiced.",
      "Ask after: did you try a move, and did you help a friend?",
    ],
  },
  U10: {
    id: "U10",
    ages: "Ages 9–10",
    format: "7v7",
    formation: "A light shape such as 2-3-1. Roles rotate.",
    targetSessions: 2,
    sessionMinutes: 70,
    notYet: ["Heading circuits", "11v11 tactics", "Specialization that benches them for a year"],
    milestones: [
      "They scan before the ball arrives when reminded, and sometimes when not.",
      "The first touch is away from pressure more often than not.",
      "They understand width: the touchline is a teammate.",
      "They can play a 7v7 game without being lost.",
    ],
    parent: "This is the last easy window to build touches without a heavy club schedule. Use it.",
    sideline: [
      "Film is optional and short. A phone on the sideline is not the session.",
      "After the game, one question: where did you look before the ball came?",
      "If the coach only runs fitness, the individual plan has to carry the technique.",
    ],
  },
  U12: {
    id: "U12",
    ages: "Ages 11–12",
    format: "9v9",
    formation: "3-2-3 or 3-3-2. Everyone learns to build, and everyone defends.",
    targetSessions: 3,
    sessionMinutes: 80,
    notYet: ["A locked lifelong position", "Adult set-piece books", "Heading as a drill block"],
    milestones: [
      "They can receive on the half-turn when the picture is simple.",
      "They know what rest-defense means: someone stays.",
      "The weak foot is a choice in practice, not a rumor.",
      "They can tell you why they passed, in one sentence.",
    ],
    parent: "The identification window is opening. Opponents start to matter, but minutes still matter more than a badge.",
    sideline: [
      "No tactical shouting. They cannot hear a useful cue in that noise.",
      "Help the week: sleep, food, and a ball at home.",
      "Ask: when we lost it, what was your next job?",
    ],
  },
  U14: {
    id: "U14",
    ages: "Ages 13–14",
    format: "11v11",
    formation: "4-3-3, with a second position they can actually play.",
    targetSessions: 4,
    sessionMinutes: 90,
    notYet: ["Max-weight lifting", "Random showcase every weekend", "Heading volume"],
    milestones: [
      "They have a position and a second one.",
      "They can press on a cue and delay when the cue is not there.",
      "Speed work is short and fresh, not a punishment.",
      "They eat and sleep like it is part of practice, because it is.",
    ],
    parent: "Growth spurts make good players look clumsy. Do not panic and do not add a second club.",
    sideline: [
      "The tactical voice is the coach. Yours is logistics and calm.",
      "If something hurts for more than a few days, you are the adult who stops the session.",
      "Ask: what was the cue on the goal we conceded, or the one we scored?",
    ],
  },
  U16: {
    id: "U16",
    ages: "Ages 15–16",
    format: "11v11",
    formation: "4-3-3 or 4-2-3-1. Patterns, not just a shape.",
    targetSessions: 4,
    sessionMinutes: 90,
    notYet: ["A new workout program every month", "Energy drinks", "Playing hurt to impress a scout"],
    milestones: [
      "They can watch a half and talk about one player without the ball.",
      "Training has a point even when they are not the star of the drill.",
      "They recover on purpose: food, sleep, and a day that is actually easy.",
      "The weak foot shows up in games, not only in the yard.",
    ],
    parent: "College soccer is the main on-ramp in this country. Grades stay. The pathway is a week, not a highlight reel.",
    sideline: [
      "Do not chase every ID camp. One well-chosen event beats a season of guest appearances.",
      "Protect sleep the night before. It changes more than a new pair of boots.",
      "Ask on Sunday: what is the one job for next match?",
    ],
  },
  U18: {
    id: "U18",
    ages: "Ages 17–18",
    format: "11v11",
    formation: "The team model. Their role inside it has to be explainable.",
    targetSessions: 4,
    sessionMinutes: 100,
    notYet: ["Junk volume on top of an academy week", "Skipping meals to 'stay sharp'"],
    milestones: [
      "They can describe their game in two minutes without a cliché.",
      "They prepare an opponent with film and still sleep.",
      "Professional habits are boring and visible: on time, fueled, repeatable.",
      "They are useful in two positions and reliable in one.",
    ],
    parent: "You are no longer the coach. You are the person who makes the week possible and tells the truth if the level is wrong.",
    sideline: [
      "Watch like a scout, talk like a parent. Those are different jobs.",
      "If they are not playing, a move for minutes is more serious than another individual session.",
      "The question: what did you do when the game state changed?",
    ],
  },
};

export interface Tactic {
  title: string;
  principle: string;
  constraint: string;
  question: string;
  teamCue: string;
}

export const TACTICS: Record<AgeBand, Tactic[]> = {
  U6: [
    {
      title: "Dribble at the open goal",
      principle: "If there is space and a goal, take the ball there. Passing is a tool for later, not a moral rule.",
      constraint: "In the yard game, a goal only counts if you dribbled for three touches first.",
      question: "Where was the empty space?",
      teamCue: "Let them dribble in the game. Do not demand a pass that is not there.",
    },
    {
      title: "Both feet get a try",
      principle: "The non-favorite foot is introduced as a game, not a correction.",
      constraint: "Every other score must be with the other foot. Toe pokes count.",
      question: "Which foot felt silly, and did you try it anyway?",
      teamCue: "The coach praises the attempt with the other foot more than the easy goal.",
    },
    {
      title: "Find a friend if you are stuck",
      principle: "When a player is trapped, a teammate close by is the help. That is the whole passing idea.",
      constraint: "If a parent-shark is on you, you may pass. If not, dribble.",
      question: "When did you need a friend?",
      teamCue: "Teach support by standing close, not by lecturing about triangles.",
    },
    {
      title: "Win it and go",
      principle: "After the ball is won, the next action is forward. Celebrating the tackle is how counters die.",
      constraint: "After you steal the tail or the ball, the next touch has to go toward a goal.",
      question: "What did you do right after you got the ball?",
      teamCue: "Restart fast. The game is the teacher.",
    },
  ],
  U8: [
    {
      title: "Attack the goal you can see",
      principle: "Play the direction you are facing if a goal is there. Turning into traffic is an advanced problem.",
      constraint: "Score in the goal you are facing unless a shark is in the way.",
      question: "Which goal were you facing when you got it?",
      teamCue: "Two goals, no positions. Reward forward play.",
    },
    {
      title: "Spread out",
      principle: "If everyone stands on the ball, nobody can receive. Space is the first tactic.",
      constraint: "A pass only counts if the receiver was more than four big steps away.",
      question: "Where was your friend when you looked up?",
      teamCue: "Freeze the game once and ask them to find a big space. Then play.",
    },
    {
      title: "Body between ball and opponent",
      principle: "Shielding is the first duel. It does not require a fancy move.",
      constraint: "In 1v1, you get a point for holding the ball for five seconds, and a point for scoring.",
      question: "How did you keep the ball when they came close?",
      teamCue: "Praise body shape, not just the nutmeg.",
    },
    {
      title: "Pass, then move",
      principle: "A pass is not the end of your job. The next step starts the combination.",
      constraint: "After a pass you have to touch a cone or a line before you can get it back.",
      question: "Where did you run after you passed?",
      teamCue: "Do not let them stand and admire the pass.",
    },
  ],
  U10: [
    {
      title: "Look before it arrives",
      principle: "The scan happens before the touch. Players who look after the touch are already late.",
      constraint: "Call a color behind you before you receive. No call, no point.",
      question: "What did you see before the ball got to you?",
      teamCue: "The coach asks for a scan, then stays quiet and lets them play it.",
    },
    {
      title: "First touch away from pressure",
      principle: "The first touch is a pass to yourself into space, or a protection if space is gone.",
      constraint: "A cone stands for a defender. The touch has to go to the free side.",
      question: "Which way did your first touch take you?",
      teamCue: "Serve from an angle so the free side is obvious. Then take the cone away.",
    },
    {
      title: "Use the width",
      principle: "In 7v7 the touchline gives you time. Bunching in the middle feels busy and solves nothing.",
      constraint: "One goal in the game must start from a wide gate.",
      question: "Did we have anyone standing wide?",
      teamCue: "A simple 2-3-1. Rotate who is wide. Do not freeze a winger forever.",
    },
    {
      title: "Press as a pair",
      principle: "One player pressing alone is a 1v1 donation. Two players make the ball go backward.",
      constraint: "You can only win the ball if you and a friend both step. Solo wins do not count for one round.",
      question: "Who went with you when you stepped?",
      teamCue: "Practice a pair pressing a wall pass, then let the game show it.",
    },
  ],
  U12: [
    {
      title: "Forward if it is on, secure if it is not",
      principle: "Playing forward is the aim. Playing secure when the lane is closed is intelligence, not fear.",
      constraint: "Before each pass, call 'forward' or 'secure'. The pass has to match the word.",
      question: "When did you choose secure, and were you right?",
      teamCue: "Build-out from the goalkeeper with a simple shape. Punish a blind forward ball in the review, not during the rep.",
    },
    {
      title: "The third player",
      principle: "Most good attacks are not the passer and the receiver. They are the person who arrives next.",
      constraint: "You cannot shoot until a third cone or person has touched the attack.",
      question: "Who was the third player on our best attack?",
      teamCue: "9v9, a 3-2-3. Ask the back line to play the bounce and the third player to show.",
    },
    {
      title: "Someone stays",
      principle: "Rest-defense means one player is not in the attack. Counters are how good teams get punished.",
      constraint: "In the game, one player wears a different pinnie and may not cross half. They are the stay.",
      question: "Who was home when we lost the ball?",
      teamCue: "Name the stay player before each phase. Rotate the job.",
    },
    {
      title: "Switch the point",
      principle: "If one side is crowded, the ball should change the picture. That is the start of real possession.",
      constraint: "A switch across two gates is worth a goal in the conditioned game.",
      question: "Did we ever move the ball from one side to the other?",
      teamCue: "Stop play on a switch and show them why the winger was free. Then immediately play again.",
    },
  ],
  U14: [
    {
      title: "Half-spaces",
      principle: "The pocket between the fullback and the center back is more valuable than hugging the touchline every time.",
      constraint: "A gate in the half-space has to be used before a cross counts.",
      question: "Did you receive between the lines, or only on the touchline?",
      teamCue: "4-3-3. The eight shows in the pocket. The winger holds width so the pocket stays open.",
    },
    {
      title: "Press the cue, not the emotion",
      principle: "Jump a heavy touch, a square pass, or a pass back to a weak foot. Otherwise get compact.",
      constraint: "The defender must call 'jump' or 'wait' before they move. Wrong cue loses the point.",
      question: "What was the cue the last time we won it high?",
      teamCue: "Install two triggers only. More than two and nobody jumps together.",
    },
    {
      title: "Five seconds after the loss",
      principle: "Counterpress is a short, trained action. If it fails, everyone recovers. Chasing for a minute is not a press.",
      constraint: "After a turnover you have five seconds to win it back or you must get behind the ball.",
      question: "Did we counterpress, or did we just run around?",
      teamCue: "Reward the recovery as much as the steal so they learn to stop the press.",
    },
    {
      title: "Fullbacks join and return",
      principle: "A fullback who attacks must have a picture for getting home. Overlaps without recovery are how leads die.",
      constraint: "After an overlap rep, the fullback has to sprint back through a gate before the next ball.",
      question: "When the fullback went, who covered?",
      teamCue: "Name the cover midfielder. Do not tell the fullback to 'get forward' with no partner.",
    },
  ],
  U16: [
    {
      title: "Against the mid-block",
      principle: "When the opponent is compact, patience is an action. One vertical pass after drawing them is the goal, not thirty sideways passes.",
      constraint: "You need four passes, then a forward attempt. Sideways forever does not score.",
      question: "What did we do to make the vertical pass possible?",
      teamCue: "Train the bounce into the striker and the third-player run. Film one example.",
    },
    {
      title: "Overload, then switch",
      principle: "Put numbers on one side so they jump, then attack the far side before they recover.",
      constraint: "The far-side player cannot be passed to until three passes have happened on the near side.",
      question: "Were we patient enough to switch, or did we force the crowded side?",
      teamCue: "Winger and fullback on the weak side have a rule: stay wide and time the run.",
    },
    {
      title: "Transitions are their own game",
      principle: "The five seconds after a win and after a loss decide more matches than the pattern you rehearsed.",
      constraint: "Score from a transition counts double. A slow restart does not count.",
      question: "What was your first action on the last turnover?",
      teamCue: "Start phases from a loose ball, not from a neat coach serve, at least twice a session.",
    },
    {
      title: "Set pieces have jobs",
      principle: "Corners and free kicks are roles, not a swarm. Two runners, one stay, one rest-defender, a plan for the second ball.",
      constraint: "In the yard, rehearse your personal job five times. Not the whole encyclopedia.",
      question: "What is your job on our corner, and on theirs?",
      teamCue: "Install one short corner and one delivery. Review on film in ten minutes, not a seminar.",
    },
  ],
  U18: [
    {
      title: "Game state",
      principle: "Leading, chasing, and level are different matches. Elite players change risk on purpose.",
      constraint: "Play a small game where the score starts at 1-0. The leader must have a secure option. The chaser must play forward within three passes.",
      question: "What did you change when the state changed?",
      teamCue: "Tell the team the state out loud in training. Make them practice both.",
    },
    {
      title: "Three patterns, not thirty",
      principle: "A player who can run three team patterns under fatigue is more useful than one who knows a whiteboard.",
      constraint: "Rehearse your three: a build pattern, a wide pattern, and a press trigger. Five reps each, both sides if it is your job.",
      question: "Which pattern actually showed up in the match?",
      teamCue: "If the coach does not have a model, ask for one. A serious U18 team can answer.",
    },
    {
      title: "Pressing map",
      principle: "Everyone knows who jumps, who covers, and who stays on the far side. Hero pressing breaks the map.",
      constraint: "Walk the map once with no ball. Then live. If you jump out of role, the rep stops.",
      question: "Who was your cover the last time you stepped?",
      teamCue: "Film a press that worked and one that broke. Ten minutes. Stop the video on the role, not the foul.",
    },
    {
      title: "The week is the product",
      principle: "Selectors at this age can see who prepares. Sleep, food, film, and punctuality are visible in the way you play minute seventy.",
      constraint: "Today's ball work ends on time. The extra session is the meal and lights-out.",
      question: "What did you do in the four hours after training?",
      teamCue: "Individual work is a top-up. It does not outrank the team model in a real academy week.",
    },
  ],
};

export interface OutlinePhase {
  phase: string;
  share: number;
  detail: string;
}

export const OUTLINES: Record<AgeBand, OutlinePhase[]> = {
  U6: [
    { phase: "Free play to goals", share: 0.35, detail: "Balls out, tiny goals, almost no talking from the coach." },
    { phase: "A tag game with a ball", share: 0.25, detail: "Sharks, tails, or gates. Both feet get praised." },
    { phase: "1v1 or 2v2", share: 0.25, detail: "Lots of restarts. Everyone attacks and defends." },
    { phase: "Free play again", share: 0.15, detail: "Coach is quiet. End while they want more." },
  ],
  U8: [
    { phase: "Arrival game", share: 0.2, detail: "They play as they arrive. Do not make them wait in a line." },
    { phase: "Ball mastery as a race", share: 0.15, detail: "Gates or a relay. Short. Both feet." },
    { phase: "Conditioned small game", share: 0.3, detail: "One rule only, tied to the week's picture." },
    { phase: "Match play", share: 0.25, detail: "4v4. Coach coaches in the stoppages, not over the play." },
    { phase: "One question", share: 0.1, detail: "Water. One question. Go home." },
  ],
  U10: [
    { phase: "Arrival play", share: 0.12, detail: "7v7 goals or 1v1s. The session has already started." },
    { phase: "Technical theme", share: 0.2, detail: "Unopposed, then lightly opposed. First touch or the week's skill." },
    { phase: "Picture game", share: 0.28, detail: "A 4v4 or 5v5 with one tactical constraint." },
    { phase: "Match", share: 0.3, detail: "7v7. Let the game breathe. Note two clips in your head, not twenty." },
    { phase: "Close", share: 0.1, detail: "One cue to remember. No speech." },
  ],
  U12: [
    { phase: "Rondo or possession arrival", share: 0.15, detail: "3v1 or 4v2. The lose-it, win-it habit starts here." },
    { phase: "Theme, then oppose it", share: 0.2, detail: "Passing pattern or receiving, then add a defender." },
    { phase: "Phase of play", share: 0.25, detail: "Build-out or a 6v5 attack to goal with rest-defense." },
    { phase: "9v9 or large game", share: 0.3, detail: "The week's rule is live. Coach stops rarely." },
    { phase: "Review", share: 0.1, detail: "Two questions. Players talk more than the coach." },
  ],
  U14: [
    { phase: "Activation and rondo", share: 0.12, detail: "Passing quality and a scan cue. No garbage-yard running." },
    { phase: "Position technique", share: 0.18, detail: "Finishing for forwards, duels for backs, receiving for mids. Keepers with the group at the end." },
    { phase: "Tactical phase", share: 0.28, detail: "Half-space, press trigger, or fullback join-and-return." },
    { phase: "11v11 slice", share: 0.32, detail: "A real game model moment, both directions." },
    { phase: "Downshift", share: 0.1, detail: "Easy possession. Name the cue for the next match. Done." },
  ],
  U16: [
    { phase: "Activation", share: 0.1, detail: "Sharp, short, position-specific. Fresh speed if it is a speed day." },
    { phase: "Pattern or pressing map", share: 0.22, detail: "One pattern to fluency. Both sides." },
    { phase: "Phase vs a block or a press", share: 0.28, detail: "The opponent has a behavior, not just a color of pinnie." },
    { phase: "Game", share: 0.3, detail: "Game-state bonus: start a phase while leading or chasing." },
    { phase: "Film cue", share: 0.1, detail: "Ten minutes max, one clip, their role. Or assign it for home." },
  ],
  U18: [
    { phase: "Individual activation", share: 0.1, detail: "Players arrive with a job already done at home or in the gym of touches." },
    { phase: "Team model", share: 0.25, detail: "Three patterns or the press. No new idea on match week." },
    { phase: "Opponent or game state", share: 0.25, detail: "One scouted cue, or a state: lead, chase, level." },
    { phase: "Match play", share: 0.3, detail: "11v11 with the model under fatigue. Stop only for the idea." },
    { phase: "Recovery plan", share: 0.1, detail: "Who eats, who treats, who watches ten minutes. The session ends in writing." },
  ],
};

export function positionJob(age: number, position: Position): string {
  if (age <= 8) {
    if (position === "goalkeeper") {
      return "Let them play in the field most of the time. A few minutes in goal is a turn, not an identity. Hands can practice catching a roll. Feet stay in the games.";
    }
    return "There is no position yet. The job is to dribble when there is space, shield when someone comes, and pass when a friend is actually open. Rotating the front, the back, and the goal is the curriculum.";
  }
  if (age <= 12) {
    const mid: Record<Position, string> = {
      goalkeeper: "Start claims with the hands and restarts with the feet. In 7v7 and 9v9 the goalkeeper is the first attacker. They still take outfield reps every week so distribution is soccer, not a punt.",
      fullback: "Provide width, then get back. At 9v9 this is a wide player who can defend a 1v1. Overlapping is allowed. Getting stuck up the field is the lesson to fix, kindly.",
      centerback: "Body shape first, tackle second. They start the build and they talk. Heading is not the job yet. Clean receiving under a high ball that they can pass, not head, is the job.",
      midfielder: "Receive on the half-turn and connect three players. They are the scan. If they only kick it long, the week's individual work is first touch and the picture before it.",
      winger: "Stay wide enough to stretch the game, then come inside with a purpose. A move without a cross, a shot, or a cutback is not the end product this age needs.",
      striker: "Move before the ball arrives. Hold the ball long enough for a friend, or finish when the touch is clean. Press the first pass back.",
      flex: "Play at least two roles a week on purpose. The pathway at this age is a soccer player who can receive, duel, and decide. The position can wait.",
    };
    return mid[position];
  }
  const older: Record<Position, string> = {
    goalkeeper: "Set position, claim or stay, and start the attack with a pass to a picture. Shot-stopping volume stays modest. Footwork and decision clips are the individual priority. Crosses are practiced fresh, never exhausted.",
    fullback: "You are a 1v1 defender and a passer into the attack. The overlap has a cover. Film should be your recovery run as often as your cross. Weak-foot passes down the line are non-negotiable.",
    centerback: "Defend the space first, then the ball. Step into midfield only when the picture is yours, and leave a partner home. Build-out under pressure is the elite separator, not a harder tackle.",
    midfielder: "Body shape before the ball, and a job on both rest-defense and the press. Elite mids at this age are reliable under a counter, not just stylish on the ball. Pick a number 6 or an 8 and learn the other.",
    winger: "Isolate, beat, and deliver. If the fullback is good, combine. If the half-space is free, take it. Track the fullback's run as if it were your own mistake, because at this level it is.",
    striker: "Two runs: in behind, and coming short to lay it. Finishing with both feet from cutbacks is the daily craft. Pressing the center backs is part of the goal tally.",
    flex: "Choose a primary role for the month and a second role you can play without hurting the team. College and academy coaches trust a clear player more than a mystery athlete.",
  };
  return older[position];
}

export interface FilmStudy {
  name: string;
  why: string;
  side: "woman" | "man";
}

const STUDIES: Record<Position, FilmStudy[]> = {
  goalkeeper: [
    { name: "Mary Earps", why: "Sets her feet early and makes the save look small.", side: "woman" },
    { name: "Ederson", why: "The first pass is an attack, not a clearance.", side: "man" },
    { name: "Alyssa Naeher", why: "Claims what is hers and stays on what is not.", side: "woman" },
  ],
  fullback: [
    { name: "Lucy Bronze", why: "Times the join, then still defends the box.", side: "woman" },
    { name: "Alphonso Davies", why: "Recovery speed after the attack is the real highlight.", side: "man" },
    { name: "Crystal Dunn", why: "1v1 defending without a reckless dive.", side: "woman" },
  ],
  centerback: [
    { name: "Naomi Girma", why: "Steps in when the cue is there and body-shapes when it is not.", side: "woman" },
    { name: "Virgil van Dijk", why: "Waits. The tackle is the last tool, not the first.", side: "man" },
    { name: "Becky Sauerbrunn", why: "Organizes the line before the cross arrives.", side: "woman" },
  ],
  midfielder: [
    { name: "Aitana Bonmatí", why: "Receives on the half-turn and plays the next pass immediately.", side: "woman" },
    { name: "Rodri", why: "Body shape is decided before the ball arrives.", side: "man" },
    { name: "Rose Lavelle", why: "Knows when to carry and when the carry is selfish.", side: "woman" },
  ],
  winger: [
    { name: "Sophia Smith", why: "The first step is the move. The end product is not optional.", side: "woman" },
    { name: "Vinícius Júnior", why: "Beats the fullback, then the cross or the shot still has a target.", side: "man" },
    { name: "Lauren Hemp", why: "Runs in behind off the shoulder, not just at the defender.", side: "woman" },
  ],
  striker: [
    { name: "Sam Kerr", why: "The run starts before the pass is obvious.", side: "woman" },
    { name: "Harry Kane", why: "Comes short to link, then arrives late in the box.", side: "man" },
    { name: "Alex Morgan", why: "Near-post timing and a finish that does not need a wind-up.", side: "woman" },
  ],
  flex: [
    { name: "Aitana Bonmatí", why: "A scanner. Watch her before the ball arrives.", side: "woman" },
    { name: "Naomi Girma", why: "A defender who sees the whole picture and still wins the ball.", side: "woman" },
    { name: "Pedri", why: "Keeps the ball when the press comes and plays simple under heat.", side: "man" },
  ],
};

export function filmCast(position: Position, gender: Gender): FilmStudy[] {
  const all = STUDIES[position];
  const women = all.filter((p) => p.side === "woman");
  const men = all.filter((p) => p.side === "man");
  if (gender === "girl") return [...women, ...men].slice(0, 2);
  if (gender === "boy") return [...men, ...women].slice(0, 2);
  const mixed = [women[0], men[0]].filter((item): item is FilmStudy => Boolean(item));
  return mixed;
}

export const LOOK_FOR: Record<SkillKey, string[]> = {
  firstTouch: [
    "Did they know the touch before the ball arrived?",
    "Was the touch out of pressure, or back into it?",
    "What was the second action?",
  ],
  dribbling: [
    "Did the move create a pass or a shot, or just a highlight?",
    "Which way did the defender lean?",
    "What did they do in the two steps after they went by?",
  ],
  passing: [
    "Was the weight playable, or did the receiver have to fight it?",
    "Did they play the way they were facing first?",
    "Who was the third player?",
  ],
  finishing: [
    "Where was the run before the ball was played?",
    "Which side did they choose, and why was the keeper wrong?",
    "Was it one touch, two, or a heavy extra?",
  ],
  duels: [
    "Did they dive, or did they delay?",
    "What was the cue if they stepped in?",
    "What happened in the five seconds after they won or lost it?",
  ],
  weakFoot: [
    "Did they hide the weak foot or use it on purpose?",
    "Could a defender show them that way and relax?",
    "Was the contact the inside of the foot or an accident?",
  ],
  athleticism: [
    "How many steps did the sprint actually take to get away?",
    "Could they pass or finish at the end of the run?",
    "How did they brake?",
  ],
  decisions: [
    "When did the head turn — before the ball, or after?",
    "What picture did that look give them?",
    "Was the safe pass available, and did they ignore it for a reason?",
  ],
};

export interface FuelPlan {
  dayTitle: string;
  calories: string;
  hydration: string;
  plate: { label: string; detail: string }[];
  pre: string;
  during: string;
  post: string;
  grocery: string[];
  avoid: string[];
  sleep: string;
  notes: string[];
}

export function buildFuel(age: number, gender: Gender, kind: "train" | "match" | "rest"): FuelPlan {
  const calories =
    age <= 8
      ? "Often about 1,400–2,000 calories across the day for an active child. Appetite is the real guide."
      : age <= 13
        ? gender === "boy"
          ? "Active boys this age often land around 2,000–2,800 calories. Growing days run higher."
          : gender === "girl"
            ? "Active girls this age often land around 1,800–2,400 calories. Under-eating shows up as heavy legs, not as discipline."
            : "Active players this age often land around 1,800–2,600 calories. Follow hunger on training days."
        : gender === "boy"
          ? "Active teen boys often need about 2,600–3,400 calories, more in a double-session week."
          : gender === "girl"
            ? "Active teen girls often need about 2,200–3,000 calories. This is not a diet. Low energy availability ends seasons."
            : "Active teens often need about 2,200–3,400 calories. Eat to train and grow.";

  const sleep =
    age <= 5
      ? "Aim for 10–13 hours including naps."
      : age <= 12
        ? "Aim for 9–12 hours. A short night shows up in the first touch."
        : "Aim for 8–10 hours. This is the cheapest performance tool in the plan.";

  const hydration =
    age <= 8
      ? "A bottle at their feet. Sips at every break. Water is enough."
      : age <= 12
        ? "Water through the day. A sports drink only if a match or session runs past about 75 minutes in the heat."
        : "Water by default. Add electrolytes if they are a salty sweater, it is hot, or the day has two sessions. Skip energy drinks entirely.";

  const plate = [
    {
      label: "Half the plate",
      detail: "Fruit and vegetables. Color is the point: berries, oranges, greens, tomatoes, carrots.",
    },
    {
      label: "Protein",
      detail:
        age <= 8
          ? "A quarter of the plate. Protein they will actually eat: yogurt, eggs, beans, chicken, milk."
          : "A quarter of the plate. Eggs, yogurt, milk, beans, fish, chicken, tofu, or lean meat. A palm-sized portion is plenty for most meals.",
    },
    {
      label: "Grains",
      detail: "The other quarter. Rice, oats, pasta, bread, tortillas, or potatoes. Training days can take an extra scoop.",
    },
    {
      label: "Plus",
      detail:
        gender === "girl" && age >= 12
          ? "Calcium and iron matter. Dairy or a fortified drink, and iron-rich foods with vitamin C: beans and salsa, beef and fruit, fortified cereal and berries."
          : "Calcium daily: milk, yogurt, fortified soy, or cheese. Growing bones are in training too.",
    },
  ];

  const pre =
    kind === "match"
      ? "Two to three hours before: a familiar meal they have eaten on a training day. Toast and eggs, rice and chicken, or yogurt, fruit, and oats. Nothing new."
      : kind === "rest"
        ? "Eat on a normal rhythm. Rest day is not a day to skip meals. Growth does not take the day off."
        : age <= 8
          ? "About an hour before: fruit and a small yogurt, or a half sandwich. Hungry and grumpy loses to a snack."
          : "Sixty to ninety minutes before: carbs plus a little protein. Banana and yogurt, toast and eggs, applesauce and cheese, or a small bowl of oats.";

  const during =
    kind === "match" && age >= 10
      ? "Water on the bench. A small familiar snack at halftime if the match is long: a few crackers, a banana, or a watered sports drink."
      : "Water. If the session is under an hour and they ate beforehand, they do not need a bar, a gel, or a lecture.";

  const post =
    kind === "rest"
      ? "A normal plate. Include protein so tomorrow's session has something to build on."
      : "Within about 45 minutes: chocolate milk, a turkey or peanut-butter sandwich, yogurt and fruit, or rice, beans, and chicken. Then a real meal later. The snack is the bridge, not the whole recovery.";

  const grocery =
    age <= 8
      ? ["Bananas", "Yogurt", "Milk or fortified soy", "Eggs", "Berries", "Bread", "Pasta", "A fruit they like"]
      : [
          "Oats",
          "Rice",
          "Eggs",
          "Yogurt",
          "Chicken or beans",
          "Fruit for the car",
          "Bread or tortillas",
          "Greens they will eat",
          "Chocolate milk or milk",
        ];

  const avoid = [
    "Energy drinks. They are a no at every age in this plan.",
    "New or greasy food on match day.",
    "Skipping the meal before training and trying to be tough.",
    "Supplements, fat-burners, and protein-as-a-meal. Food first. A doctor is the only person who adds a pill.",
  ];
  if (age <= 12) avoid.push("Adult 'diet' talk. Kids in this plan are supposed to grow.");

  const notes: string[] = [
    "These are typical ranges for active, growing players, not a prescription and not a target to undercut.",
  ];
  if (gender === "girl" && age >= 12) {
    notes.push(
      "Girls in this window are at real risk of under-fueling. Lost period, constant fatigue, or stress fractures are a medical conversation, not a coaching badge.",
    );
  }
  if ((gender === "boy" && age >= 13 && age <= 16) || (gender !== "boy" && age >= 11 && age <= 14)) {
    notes.push("Appetite can jump during a growth spurt. Add the extra snack. Do not negotiate with hunger on training days.");
  }
  if (kind === "match") notes.push("Match day food should be boring on purpose. Experiment on a Tuesday.");
  if (kind === "rest") notes.push("Do not 'earn' dinner with a workout. Recovery is the session.");

  const dayTitle = kind === "match" ? "Match day plate" : kind === "rest" ? "Rest day plate" : "Training day plate";

  return { dayTitle, calories, hydration, plate, pre, during, post, grocery, avoid, sleep, notes };
}

export const HOW_IT_WORKS: string[] = [
  "Daily ball targets follow the kind of individual volume used around top MLS NEXT and ECNL schedules at each age. Younger days are shorter and more playful. Older days trade junk volume for sharper work because the team session carries more of the load.",
  "Eight skill ratings become one technical index. An on-track curve runs from early beginner at age 4 to high-advanced at 18. If the player is behind that curve, the dose rises. If they are ahead, the plan gets pickier instead of longer.",
  "Recreational weeks add individual work, because match reps are fewer. Competitive weeks trim it, so team training plus the yard does not become an injury plan.",
  "A weekly hour ceiling by age caps the math. If the gap wants more than the ceiling allows, the plan says so. Past a point, the lever is the team environment, not another hour outside.",
  "A missed check shortens and simplifies the next stretch. An exceeded check adds harder constraints, not a second workout. Soreness and stacked team load cut volume immediately.",
  "Girls and boys share the same technical standard. Fueling notes and growth-spurt timing change. Heading work is not in the plan before 14, and it is never a circuit. U.S. Soccer does not want heading practice before 11.",
  "This is a development standard, not a promise of a contract. Athleticism, health, coaching, and opportunity still decide who is seen.",
];

export const DISCLAIMER =
  "Guidance for parents and coaches, not medical advice. Pain, dizziness, chest pain, or a limp means the session stops. When in doubt, ask a clinician. Heading is not trained as a block in this plan.";
