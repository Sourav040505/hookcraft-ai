# HookCraft AI ⚡

HookCraft AI is a modern, premium, and highly responsive web application designed for content creators, marketers, and social media managers to brainstorm highly viral hook variations for short-form video platforms (TikTok, YouTube Shorts, and Instagram Reels).

Built with **React**, **Vite**, **TypeScript**, and **Tailwind CSS v4**, the dashboard features a premium dark-mode theme, glassmorphism containers, custom ambient glow effects, responsive side-by-side inputs, and clipboard automation.

## 🚀 Key Features

* **Strict Premium Dark Theme**: Built around sleek `#0B0F19` color palettes with electric indigo and emerald retention highlights.
* **Ambient Glow Spheres**: Soft, breathing gradients that animate dynamically in the background for a modern aesthetic.
* **Exclusionary Refresh Engine**: Shuffles hook formulas and randomized engagement scores. Clicking "Refresh" guarantees a completely new set of hooks that are distinct from what's currently shown.
* **Niche Context Analysis**: Automatically parses input niches (Tech, Fitness, Finance, Productivity, Design) and serves highly customized templates tailored to that specific industry.
* **Clipboard Automation**: Copy text hooks with immediate visual checkmarks and temporary toast indicator feedback.
* **Vercel Ready**: Preconfigured routing configurations in `vercel.json` for single page app (SPA) host resolution.

## 🛠️ Tech Stack

* **Framework**: React 19 (TypeScript)
* **Build Tool**: Vite 8
* **Styling**: Tailwind CSS v4 (using the `@tailwindcss/vite` compiler plugin)
* **Icons**: Lucide React + brand SVG inline overrides

## 💻 Local Development

1. **Clone & Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Dev Server**:
   ```bash
   npm run dev
   ```

3. **Open Browser**:
   Navigate to [http://localhost:5173](http://localhost:5173)

4. **Production Build**:
   ```bash
   npm run build
   ```

## 🌐 Connecting to Live AI (Gemini / OpenAI)

HookCraft AI is preconfigured to drop in live LLM inference.
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open your `.env` file and insert your key:
   ```env
   VITE_GEMINI_API_KEY=your_actual_api_key
   ```
3. Swap the generator function in `src/App.tsx` from `generateMockHooks` to `generateLiveHooks` (defined inside `src/utils/hookGenerator.ts`).

## 📦 Deployment to Vercel

The application is completely configured for Vercel deployment:
1. Ensure your code is committed to Git:
   ```bash
   git add .
   ```
2. Connect your repository to Vercel.
3. Vercel will auto-detect the Vite configuration.
4. (Optional) Provide your API keys inside Vercel's Environment Variables dashboard.
