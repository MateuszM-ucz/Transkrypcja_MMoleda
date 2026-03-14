#!/bin/bash
# Transkrypcja pliku audio z diaryzacją (WhisperX large-v3-turbo)
# Użycie: ./transkrybuj.sh plik.mp3 [liczba_mowcow] [jezyk]
# Przykłady:
#   ./transkrybuj.sh wyklad.mp3              # auto-detekcja języka i mówców
#   ./transkrybuj.sh wyklad.mp3 2            # 2 mówców
#   ./transkrybuj.sh wyklad.mp3 3 pl         # 3 mówców, język polski

set -e

if [ -z "$1" ]; then
    echo "Użycie: ./transkrybuj.sh <plik_audio> [liczba_mowcow] [jezyk]"
    echo ""
    echo "Argumenty:"
    echo "  plik_audio      - plik audio (mp3, wav, m4a, flac, ogg...)"
    echo "  liczba_mowcow   - opcjonalnie: ile osób mówi (domyślnie: auto)"
    echo "  jezyk           - opcjonalnie: kod języka, np. pl, en, de (domyślnie: auto)"
    exit 1
fi

FILE="$1"
SPEAKERS="${2:-}"
LANG_CODE="${3:-}"

if [ ! -f "$FILE" ]; then
    echo "Błąd: plik '$FILE' nie istnieje"
    exit 1
fi

FILENAME=$(basename "$FILE")
OUTPUT="${FILENAME%.*}_transkrypcja.txt"

# Buduj parametry URL
PARAMS="output=json&word_timestamps=true&vad_filter=true&diarize=true"
if [ -n "$SPEAKERS" ]; then
    PARAMS="${PARAMS}&min_speakers=${SPEAKERS}&max_speakers=${SPEAKERS}"
fi
if [ -n "$LANG_CODE" ]; then
    PARAMS="${PARAMS}&language=${LANG_CODE}"
fi

echo "Transkrybuję: $FILENAME"
[ -n "$SPEAKERS" ] && echo "Liczba mówców: $SPEAKERS"
[ -n "$LANG_CODE" ] && echo "Język: $LANG_CODE"
echo "Proszę czekać..."
echo ""

# Wyślij do whisper-asr i przetwórz wynik
RESPONSE=$(curl -s -X POST "http://localhost:9000/asr?${PARAMS}" \
    -F "audio_file=@${FILE}")

# Sprawdź czy odpowiedź jest poprawna
if echo "$RESPONSE" | grep -q '"segments"'; then
    # Formatuj wynik z mówcami i zapisz do pliku
    echo "$RESPONSE" | python3 -c "
import sys, json

data = json.load(sys.stdin)
segments = data.get('segments', [])
lang = data.get('language', '?')

print(f'Język: {lang}')
print('=' * 60)
print()

current_speaker = None
for seg in segments:
    speaker = seg.get('speaker', '')
    start = seg.get('start', 0)
    end = seg.get('end', 0)
    text = seg.get('text', '').strip()

    minutes_s, seconds_s = divmod(start, 60)
    minutes_e, seconds_e = divmod(end, 60)
    timestamp = f'[{int(minutes_s):02d}:{seconds_s:05.2f} -> {int(minutes_e):02d}:{seconds_e:05.2f}]'

    if speaker and speaker != current_speaker:
        current_speaker = speaker
        print(f'\n--- {speaker} ---')

    print(f'{timestamp} {text}')
" > "$OUTPUT"

    echo "Zapisano do: $OUTPUT"
    echo ""
    head -20 "$OUTPUT"
    LINES=$(wc -l < "$OUTPUT")
    if [ "$LINES" -gt 20 ]; then
        echo "..."
        echo "(łącznie $LINES linii - pełna transkrypcja w pliku $OUTPUT)"
    fi
else
    echo "Błąd transkrypcji:"
    echo "$RESPONSE"
    exit 1
fi
