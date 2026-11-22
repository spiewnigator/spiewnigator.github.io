import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export interface RawSong {
  title: string;
  author?: string;
  content: string[][];
}

/** The catalog as shipped, so tests never hard-code its size. */
export const catalog: RawSong[] = JSON.parse(
  readFileSync(resolve(process.cwd(), 'src/assets/songs_structured.json'), 'utf8'),
) as RawSong[];

export const sortedTitles = (): string[] =>
  catalog.map((song) => song.title).sort((a, b) => a.localeCompare(b, 'pl'));
