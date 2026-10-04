import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";
import { normalize } from "viem/ens";
import { z } from "zod";

const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || "https://rpc.sepolia.org";
const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(rpcUrl),
});

const languageSchema = z.enum(["en", "pt", "es"]).catch("en");
const lengthSchema = z.enum(["short", "medium", "long"]).catch("medium");
const levelSchema = z.enum(["simple", "standard", "expert"]).catch("standard");

const languageMap = {
  en: "Please reply in English.",
  pt: "Please reply in Portuguese.",
  es: "Please reply in Spanish.",
};

const lengthMap = {
  short: "Keep the answer extremely concise, ideally under 3 sentences.",
  medium: "Provide a moderate length answer of 1-2 paragraphs.",
  long: "Provide a detailed, comprehensive explanation.",
};

const levelMap = {
  simple: "Explain it simply, as if to a beginner or child. Avoid jargon.",
  standard: "Use standard language.",
  expert: "Assume the user is an expert. Use precise technical terminology.",
};

export async function POST(req: NextRequest) {
  try {
    const { ensName, question } = await req.json();

    if (!ensName || !question) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    let normalizedName: string;
    try {
      normalizedName = normalize(ensName);
    } catch {
      return NextResponse.json({ error: "Invalid name format" }, { status: 400 });
    }

    let rawLang = null;
    let rawLength = null;
    let rawLevel = null;

    try { rawLang = await publicClient.getEnsText({ name: normalizedName, key: "ai.pref.language" }); } catch {}
    try { rawLength = await publicClient.getEnsText({ name: normalizedName, key: "ai.pref.length" }); } catch {}
    try { rawLevel = await publicClient.getEnsText({ name: normalizedName, key: "ai.pref.level" }); } catch {}

    let langKey: "en" | "pt" | "es" = "en";
    if (rawLang === "pt" || rawLang === "es" || rawLang === "en") {
      langKey = rawLang;
    } else if (!rawLang) {
      langKey = "en";
    }

    let lengthKey: "short" | "medium" | "long" = "medium";
    if (rawLength === "short" || rawLength === "medium" || rawLength === "long") {
      lengthKey = rawLength;
    } else if (!rawLength) {
      lengthKey = "medium";
    }

    let levelKey: "simple" | "standard" | "expert" = "standard";
    if (rawLevel === "simple" || rawLevel === "standard" || rawLevel === "expert") {
      levelKey = rawLevel;
    } else if (!rawLevel) {
      levelKey = "standard";
    }

    const systemInstruction = `You are a helpful AI assistant.
${languageMap[langKey]}
${lengthMap[lengthKey]}
${levelMap[levelKey]}`;

    const apiKey = process.env.OPENAI_API_KEY;
    const baseUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
    const modelId = process.env.MODEL_ID || "gpt-3.5-turbo";

    if (!apiKey) {
      return NextResponse.json({ error: "Configuration missing" }, { status: 500 });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    let aiResponse;
    let data;
    try {
      aiResponse = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: modelId,
          messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: question }
          ]
        }),
        signal: controller.signal
      });

      if (!aiResponse.ok) {
        return NextResponse.json({ error: "Provider failure" }, { status: 502 });
      }

      data = await aiResponse.json();
    } finally {
      clearTimeout(timeoutId);
    }

    const answer = data.choices?.[0]?.message?.content || "No response generated.";

    return NextResponse.json({ answer, appliedPrefs: { langKey, lengthKey, levelKey } });

  } catch (error: any) {
    if (error.name === "AbortError") {
      return NextResponse.json({ error: "Request timed out" }, { status: 504 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
