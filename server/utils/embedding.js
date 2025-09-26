// utils/embedding.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export async function generateEmbedding(summary) {
  const model = genAI.getGenerativeModel({
    model: "text-embedding-004",
  });
  const result = await model.embedContent(summary);
  return result.embedding.values; // float[]
}
