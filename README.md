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
cd Transkrypcja_MMoleda/github
cp .env.example .env
```

Uzupełnij `HF_TOKEN` w pliku `.env` — token z [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens).

## Uruchomienie

**CPU:**
```bash
docker compose -f docker-compose.whisper.yml up -d
```

**GPU (NVIDIA):**
```bash
docker compose -f docker-compose.gpu.yml up -d
```

Pierwszy start pobiera model (~3GB) — poczekaj aż kontener będzie gotowy:
```bash
docker compose -f docker-compose.whisper.yml logs -f
# Czekaj na: "Uvicorn running on http://0.0.0.0:9000"
```

## Transkrypcja

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
