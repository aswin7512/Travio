import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

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

export async function generateTripPlan(destination: string, budget: string): Promise<TripData> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Generate a realistic travel itinerary for a trip to ${destination} with a budget of ${budget} INR.
    Provide 3 flight options, 3 hotel options, and 3 popular places to visit.
    Include realistic prices in INR.
    For weather, provide a current typical forecast for this time of year.
    For emergency, provide the names of a major hospital and police station in ${destination}.
    Randomly decide if there is a travel obstruction (e.g., road closure, weather alert) with a 20% chance.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          flights: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                airline: { type: Type.STRING },
                flightNumber: { type: Type.STRING },
                duration: { type: Type.STRING },
                price: { type: Type.NUMBER },
                type: { type: Type.STRING },
              },
              required: ["airline", "flightNumber", "duration", "price", "type"],
            },
          },
          hotels: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                rating: { type: Type.NUMBER },
                amenities: { type: Type.ARRAY, items: { type: Type.STRING } },
                pricePerNight: { type: Type.NUMBER },
              },
              required: ["name", "rating", "amenities", "pricePerNight"],
            },
          },
          places: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                rating: { type: Type.NUMBER },
              },
              required: ["name", "description", "rating"],
            },
          },
          weather: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              temperature: { type: Type.STRING },
              condition: { type: Type.STRING },
            },
            required: ["summary", "temperature", "condition"],
          },
          emergency: {
            type: Type.OBJECT,
            properties: {
              hospital: { type: Type.STRING },
              police: { type: Type.STRING },
              helpline: { type: Type.STRING },
            },
            required: ["hospital", "police", "helpline"],
          },
          obstruction: {
            type: Type.OBJECT,
            properties: {
              hasObstruction: { type: Type.BOOLEAN },
              message: { type: Type.STRING },
            },
            required: ["hasObstruction", "message"],
          },
        },
        required: ["flights", "hotels", "places", "weather", "emergency", "obstruction"],
      },
    },
  });

  if (response.text) {
    return JSON.parse(response.text) as TripData;
  }
  throw new Error("Failed to generate trip plan");
}

export async function getHotels(location: string): Promise<TripData['hotels']> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Find 5 popular hotels in ${location}. Include rating, amenities, and price per night in INR.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            rating: { type: Type.NUMBER },
            amenities: { type: Type.ARRAY, items: { type: Type.STRING } },
            pricePerNight: { type: Type.NUMBER },
          },
          required: ["name", "rating", "amenities", "pricePerNight"],
        },
      },
    },
  });

  if (response.text) {
    return JSON.parse(response.text) as TripData['hotels'];
  }
  throw new Error("Failed to fetch hotels");
}

export async function getPlaces(location: string): Promise<TripData['places']> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `List 5 popular tourist attractions in ${location}. Include a description and rating.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            rating: { type: Type.NUMBER },
          },
          required: ["name", "description", "rating"],
        },
      },
    },
  });

  if (response.text) {
    return JSON.parse(response.text) as TripData['places'];
  }
  throw new Error("Failed to fetch places");
}

export async function getEmergencyInfo(location: string): Promise<TripData['emergency']> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Provide emergency contact information for ${location}, including a major hospital, police station, and general emergency helpline.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          hospital: { type: Type.STRING },
          police: { type: Type.STRING },
          helpline: { type: Type.STRING },
        },
        required: ["hospital", "police", "helpline"],
      },
    },
  });

  if (response.text) {
    return JSON.parse(response.text) as TripData['emergency'];
  }
  throw new Error("Failed to fetch emergency info");
}

export async function getFlights(from: string, to: string, date: string): Promise<TripData['flights']> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Find 5 flight options from ${from} to ${to} on ${date}. Include airline, flight number, duration, price in INR, and type (Direct/1 Stop).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            airline: { type: Type.STRING },
            flightNumber: { type: Type.STRING },
            duration: { type: Type.STRING },
            price: { type: Type.NUMBER },
            type: { type: Type.STRING },
          },
          required: ["airline", "flightNumber", "duration", "price", "type"],
        },
      },
    },
  });

  if (response.text) {
    return JSON.parse(response.text) as TripData['flights'];
  }
  throw new Error("Failed to fetch flights");
}

