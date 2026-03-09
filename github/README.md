# Transkrypcja - Speech-to-Text z diaryzacją

Aplikacja do transkrypcji plików audio z rozpoznawaniem mówców.
Używa [whisper-asr-webservice](https://github.com/ahmetoner/whisper-asr-webservice) z silnikiem WhisperX.

## Wymagania

- Docker Desktop z WSL2
- (GPU) NVIDIA Container Toolkit w WSL

## Szybki start

### 1. Sklonuj repo i skonfiguruj

```bash
git clone <repo-url>
cd transkrypcja
cp .env.example .env
```

Uzupełnij `HF_TOKEN` w pliku `.env` (token z [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)).
Potrzebny do diaryzacji (model pyannote).

### 2. Zbuduj frontend

```bash
cd frontend
npm install
npm run build
cd ..
```

### 3. Uruchom

**CPU:**
```bash
docker compose -f docker-compose.whisper.yml up -d
```

**GPU (NVIDIA):**
```bash
docker compose -f docker-compose.gpu.yml up -d
```

### 4. Otwórz

http://localhost:8001

## Komendy

```bash
# Stop
docker compose -f docker-compose.whisper.yml down

# Logi
docker compose -f docker-compose.whisper.yml logs -f

# Zmiana modelu (edytuj ASR_MODEL w compose, potem restart)
# Dostępne: small, base, medium, large-v3, large-v3-turbo
docker compose -f docker-compose.whisper.yml down && docker compose -f docker-compose.whisper.yml up -d
```

## Architektura

```
[Przeglądarka] → [:8001 nginx] → [whisper-asr :9000]
                    ↓
              frontend/dist (pliki statyczne)
```

- **nginx** - serwuje frontend + proxy do whisper-asr
- **whisper-asr** - transkrypcja (WhisperX + large-v3-turbo)
- Diaryzacja (rozpoznawanie mówców) - toggle w UI
