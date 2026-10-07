import { GoogleGenAI } from "@google/genai";
import { config } from "dotenv";
import readline from "readline";
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

config({});
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// async function main() {
//   const response = await ai.models.generateContent({
//     model: "gemini-3.1-flash-lite",
//     contents: [
//       {
//         role: "user",
//         parts: [{ text: "why is sky blue" }],
//       },
//     ],
//   });
//   console.log(response.text);
// }

// main();

class DumbClass {
  constructor() {
    this.history = [];
    this.systemPrompt = "";
  }

  chat({ history, systemPrompt }) {
    if (systemPrompt) {
      this.systemPrompt = systemPrompt;
    }

    if (Array.isArray(history) && history.length) {
      this.history.push(...history);
    }
  }

  async sendMessage({ text = "" }) {
    if (!!text) {
      this.history.push({ role: "user", parts: [{ text }] });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      config: {
        systemPrompt: this.systemPrompt,
      },
      contents: this.history,
    });

    if (response && response.text) {
      this.history.push({ role: "model", parts: [{ text: response.text }] });
    }

    return response.text;
  }
}

const aiChat = new DumbClass();

async function main() {
  aiChat.chat({
    systemPrompt:
      "You're a senior devloper, who writes code based on SOLID principle",
  });

  while (true) {
    const query = await question("::> ");

    if (query === "exit") {
      rl.close();
      break;
    }

    const response = await aiChat.sendMessage({ text: query });

    console.log("model:>> ", response);
  }
}

main();
