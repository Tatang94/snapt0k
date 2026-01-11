
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, VideoData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

/**
 * Menggunakan API TikWM (Free API) untuk mendapatkan link download nyata
 */
export const getTikTokVideoData = async (url: string): Promise<any> => {
  try {
    const response = await fetch(`https://www.tikwm.com/api/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        url: url,
        hd: '1'
      })
    });
    const result = await response.json();
    if (result.code === 0 && result.data) {
      return result.data;
    }
    throw new Error(result.msg || "Gagal mengambil data dari API");
  } catch (error) {
    console.error("TikWM API Error:", error);
    throw error;
  }
};

export const analyzeTikTokContent = async (url: string, description: string): Promise<AnalysisResult> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analisis video TikTok ini. 
               Deskripsi Video: ${description}
               URL: ${url}
               
               Berikan ringkasan, hashtag yang relevan, sentimen, dan tips agar video seperti ini bisa viral.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
          sentiment: { type: Type.STRING },
          engagementTips: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["summary", "hashtags", "sentiment", "engagementTips"]
      }
    }
  });

  return JSON.parse(response.text || "{}") as AnalysisResult;
};
