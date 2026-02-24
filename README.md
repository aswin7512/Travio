Here is a detailed, professional `README.md` for your project. You can copy and paste this directly into your `README.md` file.

# Travio ✈️ - AI-Powered Travel Planner

Travio is a modern, responsive React application that leverages the power of Google's Gemini AI to generate personalized travel itineraries. Simply enter your desired destination and budget, and Travio will instantly plan your flights, hotels, places to visit, and even provide emergency contact info and weather forecasts.

## ✨ Features

- **🤖 AI-Generated Itineraries:** Uses the `gemini-2.5-flash` model to create highly realistic travel plans tailored to your budget.
- **🛫 Flight & Hotel Options:** Provides curated lists of flights and hotels complete with pricing, ratings, and amenities.
- **🗺️ Tourist Attractions:** Recommends popular places to visit with descriptions and ratings.
- **🌦️ Weather & Alerts:** Gives typical weather forecasts for the destination and simulates travel obstructions (e.g., road closures, weather alerts) to keep you prepared.
- **🚨 Emergency Contacts:** Automatically fetches local emergency numbers (police, hospital, helplines) for your safety.
- **✨ Beautiful UI/UX:** Built with Tailwind CSS and Framer Motion for sleek, modern animations and a fully responsive mobile-first design.
- **🧭 Seamless Navigation:** Includes a bottom navigation bar to easily switch between your Home, Hotels, Places, and Emergency screens.

## 🛠️ Tech Stack

- **Frontend Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite 6](https://vitejs.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Routing:** [React Router DOM](https://reactrouter.com/)
- **Animations:** [Motion (Framer Motion)](https://motion.dev/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **AI Integration:** [Google GenAI SDK](https://www.npmjs.com/package/@google/genai) (`@google/genai`)
- **Language:** TypeScript

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn installed
- A Google Gemini API Key. Get one from [Google AI Studio](https://aistudio.google.com/).

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd travio
   ```


2. **Install dependencies:**
   ```bash
   npm install
   ```


3. **Set up Environment Variables:**
Create a `.env` file in the root directory of your project (next to `package.json`) and add your Gemini API key.
   ```env
   GEMINI_API_KEY="your_google_gemini_api_key_here"
   ```


4. **Start the development server:**
   ```bash
   npm run dev
   ```


The app will typically be available at `http://localhost:3000`.

## 📂 Project Structure

```text
Travio/
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable UI components (e.g., BottomNav)
│   ├── lib/              # Utility functions and API configs (gemini.ts)
│   ├── pages/            # Application screens (Home, Loading, Results, etc.)
│   ├── App.tsx           # Main application router and layout
│   ├── main.tsx          # React entry point
│   └── index.css         # Global styles and Tailwind imports
├── .env                  # Environment variables (Create this!)
├── package.json          # Project dependencies and scripts
├── tailwind.config.ts    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite configuration

```

## 🧠 AI Integration details

This project uses the official `@google/genai` SDK. To ensure the AI returns data in a predictable format that our UI can render without crashing, we utilize **Structured Outputs (JSON Schema)**.

The API requests are strictly typed using `Type.OBJECT` and `Type.ARRAY` to guarantee the model returns exact fields for flights, hotels, places, weather, and emergencies.

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request if you have ideas for new features, bug fixes, or UI improvements.

## Find the Hosted website [Here](https://aswin7512.github.io/Travio)

## 📝 License

This project is licensed under the MIT License.

```
Copyright (c) 2026 Aswin P

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```