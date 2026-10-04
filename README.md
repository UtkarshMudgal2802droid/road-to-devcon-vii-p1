# Portable AI Preferences - Devcon 7 Problem 1

This project reads AI preference settings directly from an ENS name's text records on the Sepolia testnet and uses them to safely steer an LLM assistant.

## Documented Preference Format
The application checks for the following ENS text record keys. If a key is unset or contains an invalid value, it safely falls back to a default.

| ENS Text Record Key | Allowed Values | Default | Description |
| --- | --- | --- | --- |
| `ai.pref.language` | `en`, `pt`, `es` | `en` | The language the AI should reply in (English, Portuguese, Spanish). |
| `ai.pref.length` | `short`, `medium`, `long` | `medium` | The preferred verbosity of the response. |
| `ai.pref.level` | `simple`, `standard`, `expert` | `standard` | The complexity of the explanation. |

## Sepolia Test Names
(Note: The following are illustrative unverified examples of names and records. We did not independently verify their on-chain state during this review. If they do not resolve, the application safely falls back to defaults.)

1. **`anadyslexic.eth`**
   - `ai.pref.language`: `pt` (Portuguese)
   - `ai.pref.length`: `short`
   - `ai.pref.level`: `simple`

2. **`bobexpert.eth`**
   - `ai.pref.language`: `en` (English)
   - `ai.pref.length`: `long`
   - `ai.pref.level`: `expert`

## How to Run

1. Clone the repo and install dependencies:
   ```bash
   pnpm install
   ```

2. Create a `.env` file (see `.env.example`) and add your LLM provider credentials.
   ```
   OPENAI_API_KEY="sk-..."
   OPENAI_BASE_URL="https://api.openai.com/v1"
   MODEL_ID="gpt-4o-mini"
   NEXT_PUBLIC_RPC_URL="https://sepolia.gateway.tenderly.co"
   ```

3. Run the development server:
   ```bash
   pnpm run dev
   ```

4. Navigate to `http://localhost:3000` and enter an ENS name and a question.
