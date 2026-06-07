# MatematikHelt 🤖

Sjov matematik-app for børn på 9-12 år med AI-hints, highscores og konfetti!

## Kom i gang

### 1. Klon projektet
```bash
git clone https://github.com/DITBRUGERNAVN/matematik-app.git
cd matematik-app
npm install
```

### 2. Sæt miljøvariabler op
```bash
cp .env.example .env
```
Udfyld `.env` med dine nøgler (se nedenfor).

### 3. Kør lokalt
```bash
npm run dev
```

### 4. Deploy til Vercel
```bash
npm run deploy
```
Eller forbind dit GitHub-repo direkte på [vercel.com](https://vercel.com).

---

## Miljøvariabler

Tilføj disse på Vercel under **Settings → Environment Variables**:

| Variabel | Hvad | Hvor finder du den |
|---|---|---|
| `ANTHROPIC_API_KEY` | AI-hints | [console.anthropic.com](https://console.anthropic.com) |
| `SUPABASE_URL` | Database-URL | Supabase projekt → Settings → API |
| `SUPABASE_ANON_KEY` | Offentlig nøgle | Supabase projekt → Settings → API |
| `SUPABASE_SERVICE_KEY` | Server-nøgle | Supabase projekt → Settings → API |

---

## Supabase opsætning

Opret denne tabel i Supabase (SQL editor):

```sql
create table scores (
  id uuid default gen_random_uuid() primary key,
  score integer not null,
  level text not null,
  correct integer not null,
  created_at timestamptz default now()
);
```

---

## Mappestruktur

```
matematik-app/
├── index.html          ← hoved-HTML
├── vercel.json         ← Vercel-konfiguration
├── package.json
├── .env.example        ← skabelon til env-variabler
├── public/             ← statiske filer
├── styles/
│   └── main.css        ← al CSS
├── src/
│   ├── app.js          ← hoved-controller
│   ├── game.js         ← spilmotor
│   ├── ui.js           ← DOM-manipulation
│   └── confetti.js     ← konfetti-animation
├── api/
│   ├── hints.js        ← AI-hints (Anthropic)
│   ├── scores.js       ← highscores (Supabase)
│   └── auth.js         ← login (Supabase Auth)
└── lib/
    ├── supabase.js     ← Supabase-klient (browser)
    └── anthropic.js    ← kalder /api/hints
```
