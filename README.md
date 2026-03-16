# Transkrypcja - Speech-to-Text z diaryzacją

Transkrypcja plików audio z automatycznym rozpoznawaniem mówców.
WhisperX + large-v3-turbo, diaryzacja przez pyannote.

## Wymagania

- Docker Desktop z WSL2
- (GPU) NVIDIA Container Toolkit w WSL
- Token HuggingFace (do diaryzacji)

## Instalacja

```bash
git clone https://github.com/MateuszM-ucz/Transkrypcja_MMoleda.git
cd Transkrypcja_MMoleda/transkrypcja
cp .env.example .env
```

Należy uzupełnić `HF_TOKEN` w pliku `.env` — token z [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens).
Token HuggingFace jest wymagany do diaryzacji (rozpoznawanie mówców). Model pyannote wymaga akceptacji licencji na https://huggingface.co/pyannote/speaker-diarization-3.1 oraz wygenerowania tokena na https://huggingface.co/settings/tokens 
## Uruchomienie

**CPU:**
```bash
docker compose -f docker-compose.whisper.yml up -d
```

**GPU (NVIDIA):**
```bash
docker compose -f docker-compose.gpu.yml up -d
```

Pierwszy start pobiera model (~3GB) - należy poczekać aż kontener będzie gotowy:
```bash
docker compose -f docker-compose.whisper.yml logs -f
# Należy czekać na: "Uvicorn running on http://0.0.0.0:9000"
```

## Transkrypcja
dozwolone formaty: mp3, wav, m4a, flac, ogg, webm, mp4

Na CPU mniej więcej 1 minuta przetwarzania na 30s audio, na GPU to samo idzie ~10x szybciej.
```bash
chmod +x transkrybuj.sh

# Podstawowe użycie (auto język, auto mówcy)
./transkrybuj.sh nagranie.mp3

# Podaj liczbę mówców
./transkrybuj.sh wyklad.mp3 2

# Podaj liczbę mówców i język
./transkrybuj.sh wyklad.mp3 3 pl
```

Wynik zapisuje się do pliku `nazwa_transkrypcja.txt` z oznaczeniami mówców i znacznikami czasu.

## Zatrzymanie

```bash
docker compose -f docker-compose.whisper.yml down
```
