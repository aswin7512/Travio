export async function handler(event: any) {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

  try {
    const { action, payload } = JSON.parse(event.body);
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

    if (!OPENROUTER_API_KEY) {
      return { statusCode: 500, body: JSON.stringify({ error: "Missing OpenRouter API Key" }) };
    }

    // You can change this to any OpenRouter model (e.g., "meta-llama/llama-3.3-70b-instruct")
    // "google/gemini-2.5-flash" via OpenRouter is extremely fast and cheap
    const MODEL_NAME = "google/gemini-2.5-flash"; 

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
        Return an array of objects. Each object MUST have keys: "airline", "flightNumber", "duration", "price" [number in INR], "type".`;
        break;

      case 'hotels':
        prompt = `Find 5 popular hotels in ${payload.location}. 
        Return an array of objects. Each object MUST have keys: "name", "rating", "amenities" [array of strings], "pricePerNight" [number in INR].`;
        break;

      case 'places':
        prompt = `List 5 popular tourist attractions in ${payload.location}. 
        Return an array of objects. Each object MUST have keys: "name", "description", "rating".`;
        break;

      case 'emergency':
        prompt = `Provide emergency contact information for ${payload.location}. 
        Return an object with keys: "hospital", "police", "helpline".`;
        break;

      default:
        return { statusCode: 400, body: JSON.stringify({ error: "Invalid action" }) };
    }

    // Call OpenRouter API
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://travio-app.netlify.app", // Required by OpenRouter
        "X-Title": "Travio Travel App", // Optional but good for your dashboard
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
        // Force JSON format if the model supports it
        response_format: { type: "json_object" },
        temperature: 0.1,
        max_tokens: 2500
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[OpenRouter Error]:", errText);
      throw new Error("Failed to communicate with OpenRouter");
    }

    const data = await response.json();
    let finalResponse = data.choices[0].message.content;

    // Clean up just in case the AI wraps it in backticks anyway
    if (finalResponse.includes("```")) {
      finalResponse = finalResponse.replace(/```json|```/g, "").trim();
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: finalResponse,
    };

  } catch (error: any) {
    console.error("[Backend Error]:", error.message);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
}