export interface HookResult {
  id: string;
  hook: string;
  visual: string;
  retentionScore: number;
}

// Categorization helper based on topic input keyword analysis
function categorizeTopic(topic: string): 'tech' | 'fitness' | 'finance' | 'productivity' | 'design' | 'generic' {
  const t = topic.toLowerCase();
  if (/\b(code|coding|dev|developer|python|js|react|programming|software|tech|git|github|web|apps|application|api)\b/.test(t)) return 'tech';
  if (/\b(gym|workout|fitness|muscle|diet|health|calories|run|cardio|exercise|gains|stretch|body|training)\b/.test(t)) return 'fitness';
  if (/\b(money|finance|rich|invest|stocks|crypto|income|budget|save|cash|wealth|passive|business|sales|marketing)\b/.test(t)) return 'finance';
  if (/\b(productive|procrastinate|focus|time|habit|lazy|schedule|routines|study|work|productivity|morning|sleep)\b/.test(t)) return 'productivity';
  if (/\b(design|art|ui|ux|aesthetic|photo|video|minimalist|creative|color|illustration|font|website|render)\b/.test(t)) return 'design';
  return 'generic';
}

interface RawTemplate {
  hook: string;
  visual: string;
  scoreRange: [number, number];
}

// Predefined Niche Template Databases
const TechTemplates: Record<string, Record<string, RawTemplate[]>> = {
  hype: {
    tiktok: [
      { hook: "Stop writing boilerplate code. Use this insane {topic} hack instead.", visual: "Zoom in fast on IDE editor window highlighting a clean 3-line function.", scoreRange: [95, 99] },
      { hook: "This one debug tool for {topic} feels literally illegal to know.", visual: "Fast pan over browser developer tools console printing a success message.", scoreRange: [94, 98] },
      { hook: "How Senior Developers actually implement {topic} in production.", visual: "Creator smiling, pointing at whiteboard with clean architecture blocks.", scoreRange: [92, 97] },
      { hook: "Stop using heavy libraries! Do this for your {topic} project instead.", visual: "Creator dramatically clicking a mouse, zooming in on clean dependency list.", scoreRange: [91, 96] },
      { hook: "This 10-second keyboard shortcut will save you hours of {topic} coding.", visual: "Hand slamming down keys, showing terminal running tests at lightspeed.", scoreRange: [93, 98] }
    ],
    "youtube-shorts": [
      { hook: "The biggest lie junior developers believe about {topic}.", visual: "High-contrast text reading 'JUNIOR' vs 'SENIOR' with green glow.", scoreRange: [91, 96] },
      { hook: "I automated my entire {topic} workflow in under 30 seconds. Here's how.", visual: "Speed-run screen recording of terminal script execution completing instantly.", scoreRange: [93, 98] }
    ]
  }
};

const FitnessTemplates: Record<string, Record<string, RawTemplate[]>> = {
  hype: {
    tiktok: [
      { hook: "Stop scrolling if you want to double your progress in {topic} by next week.", visual: "Fast transition: creator tightening weight lifting belt under neon violet light.", scoreRange: [96, 99] },
      { hook: "The absolute worst mistake you are making with your {topic} routine.", visual: "Split screen showing 'Wrong form' (red X) vs 'Perfect form' (green check).", scoreRange: [94, 98] }
    ]
  }
};

const FinanceTemplates: Record<string, Record<string, RawTemplate[]>> = {
  hype: {
    tiktok: [
      { hook: "This simple side hustle using {topic} makes beginners $200 a day.", visual: "High-contrast text blinking rapidly above a clean dashboard displaying charts.", scoreRange: [95, 99] },
      { hook: "The secret banking trick that completely changes {topic} strategy.", visual: "Extreme close-up of a finger swiping on a investment graph app screen.", scoreRange: [93, 97] }
    ]
  }
};

const ProductivityTemplates: Record<string, Record<string, RawTemplate[]>> = {
  hype: {
    tiktok: [
      { hook: "How to cure procrastination and finally master your {topic} system.", visual: "Satisfying time-lapse of sunlight entering a room, workspace getting cleaned.", scoreRange: [94, 98] },
      { hook: "This lazy 3-step checklist makes {topic} almost effortless.", visual: "Writing down three simple bullet points on a clean note app on iPad.", scoreRange: [92, 97] }
    ]
  }
};

const DesignTemplates: Record<string, Record<string, RawTemplate[]>> = {
  hype: {
    tiktok: [
      { hook: "Your projects look amateur because you ignore this {topic} principle.", visual: "Side-by-side aesthetic design layouts shifting colors rapidly.", scoreRange: [95, 99] },
      { hook: "My secret system to generate beautiful palettes for {topic}.", visual: "Clicking clean color palette swatches shifting themes instantly.", scoreRange: [93, 98] }
    ]
  }
};

const GenericTemplates: Record<string, Record<string, RawTemplate[]>> = {
  hype: {
    tiktok: [
      { hook: "Stop scrolling if you want to double your progress in {topic} by next week.", visual: "Fast transition: high-contrast text flashing on screen with a bass drop.", scoreRange: [93, 98] },
      { hook: "I was today years old when I found out this insane {topic} hack...", visual: "Zoom in fast on hand gesturing to a laptop screen showing a progress bar.", scoreRange: [94, 99] },
      { hook: "This one {topic} secret is literally illegal to know. Watch before it gets taken down.", visual: "Extreme close-up of face looking nervously side-to-side, whispering into mic.", scoreRange: [92, 97] }
    ],
    "youtube-shorts": [
      { hook: "The biggest lie you've been told about {topic} is costing you thousands.", visual: "Dramatic split-screen: 'Fake' vs 'Real' labeled with bright red and green overlays.", scoreRange: [91, 96] },
      { hook: "How 1% of creators master {topic} without burning out.", visual: "Cinematic pan of a clean workstation transitioning to a dark neon chart.", scoreRange: [92, 98] }
    ],
    "instagram-reels": [
      { hook: "Unpopular opinion: Everything you think you know about {topic} is completely wrong.", visual: "Elegant text overlay over a premium slow-motion city view or coffee pour.", scoreRange: [90, 95] },
      { hook: "If you are still doing this in {topic}, please stop immediately.", visual: "First-person perspective looking down, head shaking, pointer finger waving 'No'.", scoreRange: [93, 97] }
    ]
  },
  educational: {
    tiktok: [
      { hook: "Here is the exact framework I used to master {topic} in under 30 days.", visual: "Pointing up at 3 big text bullets appearing with pop sound effects.", scoreRange: [89, 94] }
    ]
  }
};

const FallbackTemplates: Array<{ hook: string; visual: string; scoreRange: [number, number] }> = [
  { hook: "How to master {topic} in 2026 without making these 3 massive mistakes.", visual: "Bold text highlight zooming in rapidly as creator points to the screen.", scoreRange: [91, 96] },
  { hook: "The absolute fastest way to get started in {topic} starting from zero.", visual: "High-speed screen recording showing code/designs being assembled instantly.", scoreRange: [90, 95] }
];

// Mock Generation Engine
export function generateMockHooks(
  topic: string, 
  platform: string, 
  tone: string, 
  excludeHooks?: string[]
): Promise<HookResult[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const topicLower = topic.trim() || "content creation";
      const category = categorizeTopic(topicLower);
      
      let library = GenericTemplates;
      if (category === 'tech') library = TechTemplates;
      else if (category === 'fitness') library = FitnessTemplates;
      else if (category === 'finance') library = FinanceTemplates;
      else if (category === 'productivity') library = ProductivityTemplates;
      else if (category === 'design') library = DesignTemplates;
      
      const toneMap = library[tone] || GenericTemplates[tone] || GenericTemplates["hype"];
      const platformList = toneMap[platform] || GenericTemplates[tone]?.[platform] || FallbackTemplates;
      
      let filteredList = platformList;
      if (excludeHooks && excludeHooks.length > 0) {
        filteredList = platformList.filter(tpl => {
          const formattedTplText = tpl.hook.replace(/{topic}/g, topicLower);
          return !excludeHooks.includes(formattedTplText);
        });
      }
      
      if (filteredList.length < 3) {
        const genericToneMap = GenericTemplates[tone] || GenericTemplates["hype"];
        const genericList = genericToneMap[platform] || FallbackTemplates;
        const filteredGeneric = genericList.filter(tpl => {
          const formattedTplText = tpl.hook.replace(/{topic}/g, topicLower);
          return !excludeHooks?.includes(formattedTplText);
        });
        filteredList = [...filteredList, ...filteredGeneric];
      }
      
      const shuffledTemplates = [...filteredList].sort(() => Math.random() - 0.5);
      const resultTemplates = shuffledTemplates.slice(0, 3);
      
      while (resultTemplates.length < 3) {
        const fallbackItem = FallbackTemplates[resultTemplates.length % FallbackTemplates.length];
        resultTemplates.push(fallbackItem);
      }
      
      const hooks = resultTemplates.map((tpl, index) => {
        const hookText = tpl.hook.replace(/{topic}/g, topicLower);
        const minScore = tpl.scoreRange ? tpl.scoreRange[0] : 90;
        const maxScore = tpl.scoreRange ? tpl.scoreRange[1] : 98;
        const score = Math.floor(Math.random() * (maxScore - minScore + 1)) + minScore;
        
        return {
          id: `${platform}-${tone}-${index}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          hook: hookText,
          visual: tpl.visual,
          retentionScore: score
        };
      });
      
      resolve(hooks);
    }, 1500);
  });
}

export async function generateLiveHooks(
  topic: string,
  platform: string,
  tone: string,
  apiKey?: string,
  excludeHooks?: string[]
): Promise<HookResult[]> {
  try {
    const formattedTopic = topic.trim() || "content creation";

    if (apiKey && apiKey.trim()) {
      // Front-end direct call option (if developer pastes custom key in Settings Panel)
      const promptText = `You are an expert short-form viral scriptwriter specialized in hooks for ${platform}.
Generate exactly 3 hook concepts for a video about "${formattedTopic}" with a "${tone}" tone.
Make the hooks highly creative, engaging, and unique.

${excludeHooks && excludeHooks.length > 0 ? `DO NOT repeat or suggest any hooks similar to these: ${JSON.stringify(excludeHooks)}` : ''}

You MUST return your response as a valid JSON object matching this exact structure:
{
  "hooks": [
    {
      "hook": "Sleek, attention-grabbing hook text",
      "visual": "Description of the first 2 seconds of visual screen action (highly descriptive)",
      "retentionScore": 95
    }
  ]
}
Return only JSON. Do not include markdown wraps like \`\`\`json.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: promptText
            }]
          }],
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API responded with status ${response.status}`);
      }

      const data = await response.json();
      const cleanText = data.candidates[0].content.parts[0].text.trim();
      const parsed = JSON.parse(cleanText);

      return parsed.hooks.map((h: any, idx: number) => ({
        id: `live-direct-${idx}-${Date.now()}`,
        hook: h.hook,
        visual: h.visual,
        retentionScore: h.retentionScore || Math.floor(Math.random() * (98 - 90 + 1)) + 90
      }));
    } else {
      // Secure fallback: Route through serverless Vercel function using the backend secret key
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          topic: formattedTopic,
          platform,
          tone,
          excludeHooks
        })
      });

      if (!response.ok) {
        throw new Error(`Vercel API proxy responded with status ${response.status}`);
      }

      const data = await response.json();
      return data.hooks.map((h: any, idx: number) => ({
        id: `live-proxy-${idx}-${Date.now()}`,
        hook: h.hook,
        visual: h.visual,
        retentionScore: h.retentionScore || Math.floor(Math.random() * (98 - 90 + 1)) + 90
      }));
    }
  } catch (error) {
    console.error("Live Gemini fetch failed, falling back to mock engine:", error);
    return generateMockHooks(topic, platform, tone, excludeHooks);
  }
}
