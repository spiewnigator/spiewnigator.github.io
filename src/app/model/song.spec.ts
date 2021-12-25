import { TestBed } from '@angular/core/testing';
import { parseSongRaw, Song, songMatches, SongRaw } from './song';

describe('Song', () => {

    const realSong: SongRaw = {
        title: "A piosnka wciąż płynie",
        content: [
            [
                "A piosnka wciąż płynie\tC",
                "Unosi ją wiatr\ta",
                "I echo ją niesie\tF",
                "Daleko przez świat.\tG",
                "Gdy przy ognisku\tC",
                "siedzimy wraz\ta",
                "Kołysze nas do snu\td G",
                "Wieczorny wiatr.\tC"
            ],
            [
                "Te ognia płomienie",
                "Przywodzą na myśl",
                "Odległe wspomnienia",
                "Zatarte już dziś.",
                "Dawne obozy",
                "I przygód moc",
                "W tę jasną gwiaździstą",
                "Sierpniową noc."
            ]
        ]
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({}).compileComponents();
    });

    it('should parse real song', () => {
        const result = parseSongRaw(realSong);
        expect(result.id).toEqual(0);
        expect(result.title).toEqual(realSong.title)
        expect(result.content.length).toEqual(2)
    });

    it('should check if song matches', () => {
        const parsed = parseSongRaw(realSong);
        expect(songMatches(parsed, 'piosnka')).toBeTrue()
        expect(songMatches(parsed, 'unosi ją wiatr')).toBeTrue()
        expect(songMatches(parsed, 'sierpniową')).toBeTrue()

        const songWithAuthor: Song = {id: 0, title: 'Test', author: 'a', content: []}
        expect(songMatches(songWithAuthor, 'a')).toBeTrue()
    });

    it('should throw exception on edge cases in song parsing', () => {
        const case1: SongRaw = {title: 'TEST', content: [['a', 'b\tc\td']]}
        expect(() => parseSongRaw(case1)).toThrowError('Raw song line has too many tab characters')
    });


});