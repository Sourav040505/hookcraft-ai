import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { topic, platform, tone, excludeHooks, model } = req.body;
    
    // Retrieve API key securely from Vercel Serverless Environment
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'Gemini API key is not configured on the server environment. Please configure GEMINI_API_KEY in Vercel settings.' 
      });
    }

    const selectedModel = model || 'gemini-2.5-flash';
    const formattedTopic = topic ? String(topic).trim() : "content creation";
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

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`, {
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
      const errorText = await response.text();
      return res.status(response.status).json({ error: `Gemini API error: ${errorText}` });
    }

    const data = await response.json();
    const cleanText = data.candidates[0].content.parts[0].text.trim();
    const parsed = JSON.parse(cleanText);

    return res.status(200).json(parsed);
  } catch (error: any) {
    console.error("Serverless API generation failed:", error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
