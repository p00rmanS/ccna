# CCNA Mastery

A beginner-first, local-first study platform for the Cisco 200-301 CCNA, with Taglish explanations and a memory trick in every lesson. Built from `PROJECT.md`. See [`../AUDIT.md`](../AUDIT.md) for what was audited, what was built, and what is deliberately not built yet.

Not affiliated with or endorsed by Cisco. All explanations, questions and labs are original.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173 (or the port in $PORT)
npm test           # 234 unit and content-integrity tests
npm run build      # strict type-check + production build into dist/
```

Progress is stored in your browser only (`localStorage`). Use **Progress → Export** to back it up. The app uses hash routing, so `dist/` works from any static host.

## What is in it

- **Learn** — 27 published lessons (Phase 0, Phase 1, most of Phase 2 — VLANs, trunking, inter-VLAN routing, STP, Rapid PVST+, STP protection, EtherChannel, CDP/LLDP — and DHCP from Phase 4) and the full course roadmap, with planned modules clearly marked. Every lesson opens in **Taglish** by default, has a **Pro tip — madaling tandaan** memory hook with a self-test, and a Taglish analogy.
- **CLI practice** — a simulated Cisco IOS terminal with real error messages, `?` help, Tab completion and 9 auto-checked tasks, for both a router and a Layer 2 switch (VLANs, trunks, router-on-a-stick).
- **Practice exams** — timed or untimed, flagging, domain breakdown and an honest readiness estimate.
- **Interactives** — MAC-learning switch simulator, binary drill, IPv4 splitter, subnet lister, VLSM planner, IPv6 compressor and type finder with EUI-64, STP election, cable picker, encapsulation stepper and more.
- **Subnetting** — generated questions in four levels and three modes, a calculator and stats. Answers are computed, never hard-coded.
- **Quizzes and flashcards** — 228 questions, 206 spaced-repetition cards (each lesson’s memory hook is a card).
- **Labs** — 23 guided labs (Packet Tracer, paper, your own PC).
- **Commands, notes, search, progress** — 62 command cards, Markdown notes, global search (press `/`), streaks, weak-topic detection, achievements and data export/import.

## Layout

```
src/
  data/         curriculum, domains/objectives, lessons (one file each with its quiz, cards and lab), commands, CLI tasks, validator
  utils/        pure logic: subnet, vlsm, ipv6, binary, mac, switching, ios (CLI simulator), stp, exam, search, quiz, srs (all unit-tested)
  store/        pure reducer + defensive loader, derived stats, React binding
  components/   layout, lessons, diagrams (SVG), interactive, quizzes, subnetting, common
  pages/        one file per route (lazy-loaded)
```

## Adding a lesson

1. Copy an existing file in `src/data/lessons/`, then write the lesson, its questions, flashcards and lab. Every lesson needs a Taglish explanation, a Taglish analogy, a `hook` section and a flashcard with id `<lesson-id>-hook`.
2. Register it in `src/data/index.ts` and place its id in a module in `src/data/curriculum.ts`.
3. Run `npm test`. The validator checks required sections, answer indexes, objective codes, references and duplicates.

Exam-objective wording in `src/data/domains.ts` is paraphrased. Re-check it against Cisco’s current 200-301 exam topics before a content refresh.
