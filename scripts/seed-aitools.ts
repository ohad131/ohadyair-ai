import { drizzle } from "drizzle-orm/mysql2";
import { aiTools } from "../drizzle/schema";

const db = drizzle(process.env.DATABASE_URL!);

const AI_TOOLS_DATA = [
  { name: "n8n", url: "https://n8n.io", color: "239, 75, 113", displayOrder: 1 },
  { name: "Activepieces", url: "https://www.activepieces.com", color: "123, 92, 255", displayOrder: 2 },
  { name: "Lovable", url: "https://lovable.dev", color: "255, 107, 157", displayOrder: 3 },
  { name: "Bolt", url: "https://bolt.new", color: "255, 184, 0", displayOrder: 4 },
  { name: "ChatGPT", url: "https://chat.openai.com", color: "16, 163, 127", displayOrder: 5 },
  { name: "Gemini", url: "https://gemini.google.com", color: "66, 133, 244", displayOrder: 6 },
  { name: "Grok", url: "https://grok.x.ai", color: "139, 92, 246", displayOrder: 7 },
  { name: "Claude", url: "https://claude.ai", color: "217, 119, 87", displayOrder: 8 },
  { name: "Perplexity", url: "https://www.perplexity.ai", color: "32, 128, 141", displayOrder: 9 },
  { name: "Copilot", url: "https://copilot.microsoft.com", color: "94, 92, 230", displayOrder: 10 },
  { name: "Base44", url: "https://base44.ai", color: "245, 158, 11", displayOrder: 11 },
  { name: "Midjourney", url: "https://www.midjourney.com", color: "0, 188, 212", displayOrder: 12 },
  { name: "Kling", url: "https://klingai.com", color: "236, 72, 153", displayOrder: 13 },
];

async function seed() {
  console.log("Seeding AI tools...");
  
  for (const tool of AI_TOOLS_DATA) {
    await db.insert(aiTools).values(tool);
    console.log(`✓ ${tool.name}`);
  }
  
  console.log("Done!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Error seeding AI tools:", err);
  process.exit(1);
});
