// Ensure your .env file has: VITE_OPENROUTER_API_KEY=your_key_here
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

// You can easily swap this out later if needed
const MODEL_NAME = "google/gemini-2.5-flash"; 

export interface TripData {
  flights: {
    airline: string;
    flightNumber: string;
    duration: string;
    price: number;
    type: string;
  }[];
  hotels: {
    name: string;
    rating: number;
    amenities: string[];
    pricePerNight: number;
  }[];
  places: {
    name: string;
    description: string;
    rating: number;
  }[];
  weather: {
    summary: string;
    temperature: string;
    condition: string;
  };
  emergency: {
    hospital: string;
    police: string;
    helpline: string;
  };
  obstruction: {
    hasObstruction: boolean;
    message: string;
  };
}

/**
 * Centralized function to handle all OpenRouter API requests.
 * Uses the native fetch API to communicate with OpenRouter.
 */
async function fetchOpenRouterData(action: string, payload: any): Promise<any> {
  if (!OPENROUTER_API_KEY) {
    console.error("Missing VITE_OPENROUTER_API_KEY in environment variables.");
    throw new Error("API configuration error. Please check your environment variables.");
  }

  let prompt = "";

  switch (action) {
    case 'fullPlan':
      prompt = `Generate a realistic travel itinerary for ${payload.destination} (Budget: ${payload.budget} INR).
      Your JSON MUST contain EXACTLY these 6 top-level keys:
      1. "flights": Array of exactly 3 flight objects (keys: "airline", "flightNumber", "duration", "price" [number], "type").
      2. "hotels": Array of exactly 3 hotel objects (keys: "name", "rating", "amenities" [array of strings], "pricePerNight" [number]).
      3. "places": Array of exactly 3 tourist places (keys: "name", "description", "rating").
      4. "weather": An object (keys: "summary", "temperature", "condition").
      5. "emergency": An object (keys: "hospital", "police", "helpline").
      6. "obstruction": An object (keys: "hasObstruction" [boolean], "message" [string]).`;
      break;

    case 'flights':
      prompt = `Find 5 real flight options from ${payload.from} to ${payload.to} on ${payload.date}. 
      Return a JSON object with a single key "flights" containing an array of objects. Each object MUST have keys: "airline", "flightNumber", "duration", "price" [number in INR], "type".`;
      break;

    case 'hotels':
      prompt = `Find 5 popular hotels in ${payload.location}. 
      Return a JSON object with a single key "hotels" containing an array of objects. Each object MUST have keys: "name", "rating", "amenities" [array of strings], "pricePerNight" [number in INR].`;
      break;

    case 'places':
      prompt = `List 5 popular tourist attractions in ${payload.location}. 
      Return a JSON object with a single key "places" containing an array of objects. Each object MUST have keys: "name", "description", "rating".`;
      break;

    case 'emergency':
      prompt = `Provide emergency contact information for ${payload.location}. 
      Return a JSON object with keys: "hospital", "police", "helpline".`;
      break;

    default:
      throw new Error(`Invalid action provided to API fetcher: ${action}`);
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.origin, 
        "X-Title": "Travio App", 
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [
          { 
            role: "system", 
            content: "You are a strict travel data API. You MUST return ONLY valid JSON. Do not include markdown formatting, backticks, or any conversational text. Use the exact keys requested." 
          },
          { 
            role: "user", 
            content: prompt 
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.1,
        max_tokens: 3000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[OpenRouter HTTP Error ${response.status}]:`, errorText);
      throw new Error(`API returned status ${response.status}`);
    }

    const data = await response.json();
    let finalResponse = data.choices[0]?.message?.content || "{}";

    // Fallback cleanup if the AI includes markdown code blocks despite instructions
    if (finalResponse.includes("```")) {
      finalResponse = finalResponse.replace(/```json|```/g, "").trim();
    }

    return JSON.parse(finalResponse);

  } catch (error) {
    console.error("[gemini.ts] Fetch Error:", error);
    throw error; 
  }
}

// --- Public Interface Functions ---

export async function generateTripPlan(destination: string, budget: string): Promise<TripData> {
  return await fetchOpenRouterData('fullPlan', { destination, budget }) as TripData;
}

export async function getHotels(location: string): Promise<TripData['hotels']> {
  const result = await fetchOpenRouterData('hotels', { location });
  return result.hotels || [];
}

export async function getPlaces(location: string): Promise<TripData['places']> {
  const result = await fetchOpenRouterData('places', { location });
  return result.places || [];
}

export async function getEmergencyInfo(location: string): Promise<TripData['emergency']> {
  return await fetchOpenRouterData('emergency', { location }) as TripData['emergency'];
}

export async function getFlights(from: string, to: string, date: string): Promise<TripData['flights']> {
  const result = await fetchOpenRouterData('flights', { from, to, date });
  return result.flights || [];
}