
import { GoogleGenAI, Type } from "@google/genai";
import { UserPreferences, Fragrance, RecommendationResponse } from "../types";

export const recommendFragrances = async (prefs: UserPreferences, count: number, isPremium: boolean): Promise<RecommendationResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    As a master perfumer (a "Nose"), perform two tasks:
    1. Create a "Fragrance Personality" title and 2-sentence summary based on the user's choices.
    2. Recommend EXACTLY ${count} luxury fragrances based on:
    
    Scent Families: ${prefs.scentFamily.join(', ')}
    Occasions: ${prefs.occasions.join(', ')}
    ${isPremium ? `Target Moods: ${prefs.moods?.join(', ') || 'N/A'}` : ''}
    Projection Style: ${prefs.projectionPreference}
    Season/Climate: ${prefs.seasonClimate.join(', ')}
    Budget: ${prefs.budgetRange}
    Preferred Notes: ${prefs.lovedNotes.join(', ')}
    Hated Notes: ${prefs.hatedNotes.join(', ')}

    Return a selection of high-end perfumes.
    ${isPremium ? 'CRITICAL: For each fragrance, include "layeringSuggestions" as an array of objects. Each object must have a "note" (the scent to layer with) and a "reason" (a short 1-sentence explanation of why it complements the perfume).' : ''}
    
    Rules:
    1. Provide name, brand, family, notes, poetic description, match reason, longevity, projection, bestSeason, and bestOccasion.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            personalitySummary: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["title", "description"]
            },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  brand: { type: Type.STRING },
                  family: { type: Type.STRING },
                  notes: {
                    type: Type.OBJECT,
                    properties: {
                      top: { type: Type.ARRAY, items: { type: Type.STRING } },
                      middle: { type: Type.ARRAY, items: { type: Type.STRING } },
                      base: { type: Type.ARRAY, items: { type: Type.STRING } },
                    }
                  },
                  description: { type: Type.STRING },
                  matchReason: { type: Type.STRING },
                  priceEstimate: { type: Type.STRING },
                  longevity: { type: Type.STRING },
                  projection: { type: Type.STRING },
                  bestSeason: { type: Type.STRING },
                  bestOccasion: { type: Type.STRING },
                  layeringSuggestions: { 
                    type: Type.ARRAY, 
                    items: { 
                      type: Type.OBJECT,
                      properties: {
                        note: { type: Type.STRING },
                        reason: { type: Type.STRING }
                      },
                      required: ["note", "reason"]
                    } 
                  }
                },
                required: ["name", "brand", "family", "notes", "description", "matchReason", "longevity", "projection", "bestSeason", "bestOccasion"]
              }
            }
          },
          required: ["personalitySummary", "recommendations"]
        }
      }
    });

    const jsonStr = response.text;
    if (!jsonStr) throw new Error("Empty response from AI");
    
    const data = JSON.parse(jsonStr);
    
    const finalRecs = data.recommendations.slice(0, count).map((item: any, index: number) => ({
      ...item,
      id: item.id || `frag-${index}-${Date.now()}`,
      imagePlaceholder: `https://picsum.photos/seed/${item.name.replace(/\s/g, '')}/400/500`
    }));
    
    return {
      personalitySummary: data.personalitySummary,
      recommendations: finalRecs
    };
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    throw error;
  }
};
