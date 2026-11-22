// VI Clipper — make.fun gta6-clipper-01 entry (Node 22, standard library only).
//
// The entry itself is the video: this program only hands the gate the video's
// address. It reads VIDEO.json from the repository root, checks it is a JSON
// object naming one YouTube video, and copies it byte-for-byte to /output as
// VIDEO.json, where the house reads it and fetches the video's views through
// the YouTube Data API. Nothing this program writes about the video is scored.
//
// The clip was cut in the recorded build session: a moment from Rockstar's
// GTA 6 Trailer 2, cropped vertical 9:16, with make.fun's pitch burned in as
// on-screen text at the end, then published public on YouTube as a Short.
//
// Run it the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// Inside the grader the repository is mounted at /bot and the output at
// /output; outside it the two environment variables stand in for them.
const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// A YouTube video address, as the Share button gives it: a Shorts link, a
// watch link or a youtu.be link, with an 11-character video id.
const YOUTUBE_URL =
  /^https:\/\/(?:www\.|m\.)?(?:youtube\.com\/(?:shorts\/|watch\?v=)|youtu\.be\/)[A-Za-z0-9_-]{11}(?:[?#].*)?$/;

const sourcePath = join(BOT_DIR, 'VIDEO.json');
const raw = readFileSync(sourcePath, 'utf8');

let parsed;
try {
  parsed = JSON.parse(raw);
} catch {
  console.error('VIDEO.json is not valid JSON');
  process.exit(1);
}

if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
  console.error('VIDEO.json must be a JSON object like {"url": "https://www.youtube.com/shorts/<id>"}');
  process.exit(1);
}

if (typeof parsed.url !== 'string' || !YOUTUBE_URL.test(parsed.url)) {
  console.error('VIDEO.json url is not a YouTube video address');
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(sourcePath, join(OUTPUT_DIR, 'VIDEO.json'));
} catch (err) {
  console.error(`VIDEO.json could not be copied from ${BOT_DIR}: ${String(err)}`);
  process.exit(1);
}
