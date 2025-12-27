
import { GoogleGenAI, Type } from "@google/genai";
import { Event, UserProfile } from "../types";
import { calculateDistance } from "../utils/geoUtils";

export const getAIRecommendations = async (user: UserProfile, events: Event[], userLocation?: {lat: number, lng: number} | null) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Enrich event data with distance if location is available
    const eventsWithDistance = events.map(e => {
      const dist = userLocation ? calculateDistance(userLocation.lat, userLocation.lng, e.lat, e.lng) : null;
      return {
        id: e.id,
        title: e.title,
        description: e.description,
        distance: dist !== null ? `${dist.toFixed(1)}km away` : 'Unknown distance'
      };
    });

    const prompt = `Based on the following user profile and enriched list of events, recommend the top 3 events that match their skills and interests. Proximity is important: if an event is closer, give it a slight priority unless another event is a much better skill match.
    
    User Profile:
    - Skills: ${user.skills.join(', ')}
    - Interests: ${user.interests.join(', ')}
    ${userLocation ? "- User's current location is active and proximity should be considered." : ""}
    
    Enriched Events:
    ${eventsWithDistance.map(e => `ID: ${e.id}, Title: ${e.title}, Proximity: ${e.distance}, Description: ${e.description}`).join('\n')}
    
    Return ONLY a JSON array of event IDs.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const recommendedIds = JSON.parse(response.text || "[]");
    return recommendedIds;
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
};

export const getVolunteerRoleMatch = async (user: UserProfile, event: Event) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `The student ${user.name} with skills [${user.skills.join(', ')}] wants to volunteer for the event "${event.title}".
    The event is described as: "${event.description}".
    
    Suggest the best role for them among: [Organizer, Helper, Coordinator].
    Provide a short 1-sentence reasoning.
    Return as JSON: { "role": "string", "reason": "string" }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            role: { type: Type.STRING },
            reason: { type: Type.STRING }
          }
        }
      }
    });

    return JSON.parse(response.text || '{"role": "Helper", "reason": "General match"}');
  } catch (error) {
    return { role: "Helper", reason: "Standard assignment" };
  }
};
