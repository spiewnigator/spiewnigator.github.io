export interface Song {
    title: string;
    author?: string;
    content: SongPart[];
}

/**
 * stanza
 */
export interface SongPart {
    lines: SongLine[];
}

export interface SongLine {
    text?: string;
    chords?: string;
}

export interface SongRaw {
    title: string;
    author?: string;
    content: string[][];
}


export function parseSongLine(raw: string): SongLine {

    if (raw == null || raw === '') {
        throw new Error("Raw song line null or empty")
    }

    const elements: string[] = raw.split('\t');

    if (elements.length > 2) {
        throw new Error("Raw song line has too many tab characters")
    }

    if (elements.length === 2) {
        return {text: elements[0], chords: elements[1]}
    }

    if (raw[0] === '\t') {
        return {chords: elements[0]}
    }

    return {text: elements[0]}
}


export function parseSongPart(part: string[]): SongPart {
    return {lines: part.filter(line => line != null && line  !== '').map(line => parseSongLine(line))};
}


export function parseSongRaw(raw: SongRaw): Song {

    const result = {
        title: raw.title,
        author: raw.author,
        content: raw.content.map(part => parseSongPart(part))
    }

    return result;
}