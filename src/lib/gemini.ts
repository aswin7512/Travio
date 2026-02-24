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

// 2. The core fetcher utility that safely talks to your Netlify Function
async function callNetlifyFunction(action: string, payload: any) {
  try {
    const response = await fetch('/.netlify/functions/generateTrip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, payload }),
    });

    const text = await response.text();

    if (!response.ok) {
      // Catch Netlify timeouts cleanly
      if (text.includes("Timeout")) {
        throw new Error("The AI is taking a bit longer than usual. Please try again in a moment.");
      }
      throw new Error(text || "API request failed");
    }

    // Safely parse the JSON, catching the "Unexpected token H" error
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error("AI returned invalid JSON:", text);
      throw new Error("The AI response was not in the correct format. Please try again.");
    }
  } catch (error) {
    console.error(`Fetch Error on action [${action}]:`, error);
    throw error; // Re-throw so your React components can catch and display it
  }
}

// 3. The wrapped helper functions your React components will use

export async function generateTripPlan(destination: string, budget: string): Promise<TripData> {
  return callNetlifyFunction('fullPlan', { destination, budget });
}

export async function getHotels(location: string): Promise<TripData['hotels']> {
  return callNetlifyFunction('hotels', { location });
}

export async function getPlaces(location: string): Promise<TripData['places']> {
  return callNetlifyFunction('places', { location });
}

export async function getEmergencyInfo(location: string): Promise<TripData['emergency']> {
  return callNetlifyFunction('emergency', { location });
}

export async function getFlights(from: string, to: string, date: string): Promise<TripData['flights']> {
  return callNetlifyFunction('flights', { from, to, date });
}