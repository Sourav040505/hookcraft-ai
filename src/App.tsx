import { useState, useEffect } from 'react'
import { 
  Sparkles, 
  Copy, 
  Check, 
  TrendingUp, 
  Flame, 
  Zap, 
  Tv, 
  RefreshCw,
  Video,
  ExternalLink,
  MessageSquareCode,
  Settings,
  Download,
  Eye,
  EyeOff,
  Sliders,
  AlertCircle
} from 'lucide-react'
import { generateMockHooks, generateLiveHooks } from './utils/hookGenerator'
import type { HookResult } from './utils/hookGenerator'

// Custom high-quality SVG elements for brand logos to avoid version mismatches in Lucide
const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mb-1">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
)

const YoutubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mb-1">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
    <polygon points="10 15 15 12 10 9" />
  </svg>
)


const RetentionGraph = ({ score }: { score: number }) => {
  const y3 = 32 - ((score - 70) / 30) * 24; // map 70%-100% score to 32px-8px range
  const path = `M 0,4 C 40,8 80,${y3 - 4} 120,${y3}`;
  return (
    <div className="flex flex-col items-end">
      <svg className="w-24 h-8 text-emerald-500 overflow-visible" viewBox="0 0 120 36" fill="none">
        <path d={path} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d={path} stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="opacity-15 blur-[2px]" />
        <circle cx="120" cy={y3} r="3" fill="#34D399" />
      </svg>
      <span className="text-[9px] text-gray-500 mt-1">0s ➜ 3s Retention</span>
    </div>
  );
};

function App() {
  // Input states
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState('tiktok')
  const [tone, setTone] = useState('hype')
  
  // App UI states
  const [isGenerating, setIsGenerating] = useState(false)
  const [hooks, setHooks] = useState<HookResult[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [hasGeneratedOnce, setHasGeneratedOnce] = useState(false)

  // API Config settings
  const [isLiveMode, setIsLiveMode] = useState(() => sessionStorage.getItem('hc_live_mode') === 'true')
  const [apiKey, setApiKey] = useState(() => sessionStorage.getItem('hc_api_key') || '')
  const [showSettings, setShowSettings] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)

  // Sync settings to session storage
  useEffect(() => {
    sessionStorage.setItem('hc_live_mode', String(isLiveMode))
    sessionStorage.setItem('hc_api_key', apiKey)
  }, [isLiveMode, apiKey])

  // Auto-generate some default hooks on mount so dashboard isn't completely empty initially
  useEffect(() => {
    const loadInitial = async () => {
      setIsGenerating(true)
      try {
        const initial = await generateMockHooks('productivity hacks', 'tiktok', 'hype')
        setHooks(initial)
        setHasGeneratedOnce(true)
      } catch (err) {
        console.error(err)
      } finally {
        setIsGenerating(false)
      }
    }
    loadInitial()
  }, [])

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)
    try {
      let results;
      if (isLiveMode && apiKey.trim()) {
        results = await generateLiveHooks(topic, platform, tone, apiKey)
      } else {
        results = await generateMockHooks(topic, platform, tone)
      }
      setHooks(results)
      setHasGeneratedOnce(true)
    } catch (err) {
      console.error("Generation error:", err)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRefresh = async () => {
    setIsGenerating(true)
    try {
      const currentHookTexts = hooks.map(h => h.hook)
      let results;
      if (isLiveMode && apiKey.trim()) {
        results = await generateLiveHooks(topic, platform, tone, apiKey, currentHookTexts)
      } else {
        results = await generateMockHooks(topic, platform, tone, currentHookTexts)
      }
      setHooks(results)
    } catch (err) {
      console.error("Refresh error:", err)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = (hookText: string, id: string) => {
    navigator.clipboard.writeText(hookText)
    setCopiedId(id)
    setTimeout(() => {
      setCopiedId(null)
    }, 2000)
  }

  const handleExport = () => {
    const content = `HookCraft AI - Generated Hook Variations\n` +
      `Topic/Niche: ${topic || 'Default'}\n` +
      `Platform: ${platform.toUpperCase()}\n` +
      `Tone: ${tone.toUpperCase()}\n` +
      `Engine Mode: ${isLiveMode ? 'Live Gemini AI' : 'Offline Demo Heuristics'}\n` +
      `==========================================\n\n` +
      hooks.map((item, idx) => 
        `Variation #${idx + 1} [Retention Score: ${item.retentionScore}%]\n` +
        `Hook: "${item.hook}"\n` +
        `Visual Scene: ${item.visual}\n` +
        `------------------------------------------`
      ).join('\n\n');
      
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `hookcraft-ai-hooks-${Date.now()}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-height-screen bg-[#0B0F19] text-gray-100 flex flex-col relative overflow-hidden font-sans pb-12 selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Decorative Blur Spheres for Premium Glassmorphism Look */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/15 pointer-events-none animate-glow-1 z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-900/15 pointer-events-none animate-glow-2 z-0"></div>
      
      {/* Sleek Header */}
      <header className="border-b border-gray-800/80 bg-[#0B0F19]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-500 to-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
                HookCraft
              </span>
              <span className="font-bold text-xl tracking-tight text-indigo-400"> AI</span>
            </div>
            <span className="ml-3 px-2.5 py-0.5 text-xs font-semibold tracking-wider text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
              v1.0 Live
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-lg hover:bg-gray-800/50 transition-colors duration-200 cursor-pointer ${showSettings ? 'text-indigo-400' : 'text-gray-400 hover:text-white'}`}
              title="API & Engine Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800/50 transition-colors duration-200"
              title="GitHub Repository"
            >
              <GithubIcon />
            </a>
            <a 
              href="#" 
              className="hidden sm:flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-gray-900 hover:bg-gray-800 border border-gray-800 text-sm font-medium transition-all duration-200"
            >
              <span>Portfolio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* API Configuration Drawer Overlay */}
      {showSettings && (
        <div className="border-b border-gray-800/80 bg-[#121826]/95 backdrop-blur-lg relative z-40 transition-all duration-300">
          <div className="max-w-3xl mx-auto px-6 py-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800/60 pb-3">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-sm text-white">Engine Configuration</h3>
              </div>
              <button 
                onClick={() => setShowSettings(false)}
                className="text-xs text-gray-500 hover:text-gray-300 cursor-pointer"
              >
                Close Settings
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Toggle Switch */}
              <div className="space-y-2">
                <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Generation Mode
                </span>
                <div className="flex items-center justify-between p-3.5 bg-[#0B0F19]/60 border border-gray-800 rounded-xl">
                  <div className="pr-4">
                    <p className="text-xs font-bold text-gray-200">
                      {isLiveMode ? 'Live AI Mode (Gemini)' : 'Offline Demo Mode'}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      {isLiveMode ? 'Fetches real-time hooks from Gemini LLM' : 'Uses highly optimized mock presets'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!apiKey.trim() && !isLiveMode) {
                        alert("Please paste a Gemini API Key to enable Live Mode!");
                        return;
                      }
                      setIsLiveMode(!isLiveMode);
                    }}
                    className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:ring-offset-0 bg-gray-800"
                    style={{ backgroundColor: isLiveMode ? '#6366F1' : '#1F2937' }}
                  >
                    <span
                      className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                      style={{ transform: isLiveMode ? 'translateX(20px)' : 'translateX(0px)' }}
                    />
                  </button>
                </div>
              </div>

              {/* API Key Input */}
              <div className="space-y-2">
                <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Gemini API Key
                </span>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => {
                      setApiKey(e.target.value);
                      if (!e.target.value.trim()) setIsLiveMode(false);
                    }}
                    placeholder="Enter AIzaSy... API key"
                    className="w-full pl-4 pr-10 py-3 bg-[#0B0F19]/60 border border-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-xs text-gray-200 placeholder-gray-600 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-gray-300 cursor-pointer"
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[9px] text-gray-500">
                  Keys are stored locally in your browser's session storage and never shared. Get one from Google AI Studio.
                </p>
              </div>
            </div>

            {isLiveMode && (
              <div className="flex items-center space-x-2 text-[10px] text-indigo-300 bg-indigo-500/5 border border-indigo-500/10 rounded-lg p-2.5">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Live Mode is active. The engine will request real responses. If quota is exceeded, it falls back to mock presets.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 w-full mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 flex-grow">
        
        {/* Left Column - Input Panel (4 columns wide on lg) */}
        <section className="lg:col-span-5">
          <div className="bg-[#121826]/90 border border-gray-800/80 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden group">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 to-violet-500"></div>

            <div className="flex items-center space-x-2.5 mb-6">
              <MessageSquareCode className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-bold tracking-tight text-white">Brainstorm Settings</h2>
            </div>

            <form onSubmit={handleGenerate} className="space-y-6">
              {/* Video Topic / Niche */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Video Topic or Niche
                </label>
                <div className="relative">
                  <textarea
                    id="video-topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. 5 Coding hacks for lazy developers, Gym motivation strategies, Minimalist design tips..."
                    required
                    rows={3}
                    maxLength={150}
                    className="w-full px-4 py-3 bg-[#0B0F19]/60 border border-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-gray-200 placeholder-gray-500 transition-all duration-300 resize-none outline-none text-sm leading-relaxed"
                  />
                  <div className="absolute bottom-2.5 right-3 text-[10px] text-gray-500">
                    {topic.length}/150
                  </div>
                </div>
              </div>

              {/* Target Platform */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Target Platform
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPlatform('tiktok')}
                    className={`flex flex-col items-center justify-center py-3 rounded-xl border text-sm font-medium transition-all duration-200 cursor-pointer ${
                      platform === 'tiktok' 
                        ? 'border-indigo-500 bg-indigo-500/10 text-white' 
                        : 'border-gray-800 bg-[#0B0F19]/40 text-gray-400 hover:text-gray-200 hover:border-gray-700'
                    }`}
                  >
                    <Tv className="w-4 h-4 mb-1" />
                    <span>TikTok</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlatform('youtube-shorts')}
                    className={`flex flex-col items-center justify-center py-3 rounded-xl border text-sm font-medium transition-all duration-200 cursor-pointer ${
                      platform === 'youtube-shorts' 
                        ? 'border-indigo-500 bg-indigo-500/10 text-white' 
                        : 'border-gray-800 bg-[#0B0F19]/40 text-gray-400 hover:text-gray-200 hover:border-gray-700'
                    }`}
                  >
                    <YoutubeIcon />
                    <span>Shorts</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlatform('instagram-reels')}
                    className={`flex flex-col items-center justify-center py-3 rounded-xl border text-sm font-medium transition-all duration-200 cursor-pointer ${
                      platform === 'instagram-reels' 
                        ? 'border-indigo-500 bg-indigo-500/10 text-white' 
                        : 'border-gray-800 bg-[#0B0F19]/40 text-gray-400 hover:text-gray-200 hover:border-gray-700'
                    }`}
                  >
                    <InstagramIcon />
                    <span>Reels</span>
                  </button>
                </div>
              </div>

              {/* Tone of Video */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Tone of Video
                </label>
                <div className="relative">
                  <select
                    id="video-tone"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0B0F19]/60 border border-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-gray-200 transition-all duration-300 outline-none text-sm cursor-pointer appearance-none"
                  >
                    <option value="hype">Hype / Energetic (Fast-paced, hooky)</option>
                    <option value="educational">Educational / Value (Tutorial, structured)</option>
                    <option value="dramatic">Dramatic / Storytelling (Emotional, mysterious)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                    <Video className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Generate CTA Button */}
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full flex items-center justify-center py-3.5 px-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-white text-sm font-bold tracking-wide rounded-xl shadow-xl shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:cursor-not-allowed group/btn"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2.5 animate-spin" />
                    <span>Crafting Hooks...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2.5 text-indigo-200 group-hover/btn:rotate-12 transition-transform duration-200" />
                    <span>Generate Viral Hooks</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </section>

        {/* Right Column - Output Dashboard (7 columns wide on lg) */}
        <section className="lg:col-span-7 flex flex-col space-y-6">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-bold tracking-tight text-white">Viral Variations</h2>
            </div>
            
            {hasGeneratedOnce && (
              <div className="flex items-center space-x-3">
                {!isGenerating && (
                  <span className="text-xs text-gray-400 hidden md:inline">
                    Based on <strong className="text-indigo-400 capitalize">{tone}</strong> tone
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={isGenerating}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gray-900/80 hover:bg-gray-800 border border-gray-800 text-xs font-semibold text-gray-300 hover:text-white transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group/refresh"
                  title="Generate new scores and variations"
                >
                  <RefreshCw className={`w-3.5 h-3.5 group-hover/refresh:rotate-180 transition-transform duration-500 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
                <button
                  type="button"
                  onClick={handleExport}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gray-900/80 hover:bg-gray-800 border border-gray-800 text-xs font-semibold text-gray-300 hover:text-white transition-all duration-200 cursor-pointer group/export"
                  title="Export all hooks to a text file"
                >
                  <Download className="w-3.5 h-3.5 group-hover/export:translate-y-0.5 transition-transform duration-200" />
                  <span>Export</span>
                </button>
              </div>
            )}
          </div>

          {/* Core States: Loading, Empty, or List */}
          {isGenerating ? (
            <div className="flex-grow flex flex-col items-center justify-center py-24 bg-[#121826]/40 border border-gray-800/50 rounded-2xl min-h-[350px] backdrop-blur-sm">
              <div className="relative mb-6">
                <div className="w-14 h-14 rounded-full border-t-2 border-r-2 border-indigo-500 animate-spin"></div>
                <Zap className="w-5 h-5 text-indigo-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="text-sm font-medium text-gray-300">HookCraft Engine compiling hooks...</p>
              <p className="text-xs text-gray-500 mt-1">Analyzing engagement metrics and audio hooks</p>
            </div>
          ) : !hasGeneratedOnce ? (
            <div className="flex-grow flex flex-col items-center justify-center py-20 bg-[#121826]/30 border border-dashed border-gray-800 rounded-2xl min-h-[350px] text-center px-6">
              <div className="w-12 h-12 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5 text-gray-500" />
              </div>
              <h3 className="text-sm font-semibold text-gray-300">No Hooks Generated Yet</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm">
                Enter your topic, choose your platform and target tone, and click "Generate Viral Hooks" to start brainstorming.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {hooks.map((item, index) => {
                const isCopied = copiedId === item.id;
                return (
                  <div 
                    key={item.id}
                    className="group bg-[#121826]/90 hover:bg-[#151D2F] border border-gray-800/80 hover:border-indigo-500/30 rounded-2xl p-5 md:p-6 transition-all duration-300 shadow-lg relative overflow-hidden"
                  >
                    {/* Glass card lighting highlight */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full filter blur-xl pointer-events-none group-hover:bg-indigo-500/10 transition-all duration-300"></div>
                    
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-grow">
                        {/* Meta Tags: Card Label, Score & Visual Graph */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/10">
                              Variation #0{index + 1}
                            </span>
                            <span className="flex items-center text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/10">
                              <Flame className="w-3.5 h-3.5 mr-1" />
                              {item.retentionScore}% Retention
                            </span>
                          </div>
                          <div className="hidden sm:block">
                            <RetentionGraph score={item.retentionScore} />
                          </div>
                        </div>

                        {/* The Hook text */}
                        <p className="text-base font-semibold leading-relaxed text-gray-100 mb-4 group-hover:text-white transition-colors duration-200 select-all">
                          "{item.hook}"
                        </p>

                        {/* Visual directions */}
                        <div className="mt-4 pt-3.5 border-t border-gray-800/80 flex items-start space-x-2.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2"></div>
                          <p className="text-xs text-gray-400 leading-normal italic">
                            <span className="font-semibold text-gray-300 not-italic uppercase tracking-wider text-[9px] mr-1.5">Visual Scene:</span>
                            {item.visual}
                          </p>
                        </div>
                      </div>

                      {/* Copy Action Button */}
                      <button
                        onClick={() => handleCopy(item.hook, item.id)}
                        className={`p-3.5 rounded-xl border flex items-center justify-center transition-all duration-200 relative cursor-pointer group-hover:opacity-100 ${
                          isCopied 
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400' 
                            : 'bg-[#0B0F19]/80 border-gray-800 hover:border-gray-700 text-gray-400 hover:text-white'
                        }`}
                        title="Copy hook to clipboard"
                      >
                        {isCopied ? (
                          <Check className="w-4.5 h-4.5 animate-scale-up" />
                        ) : (
                          <Copy className="w-4.5 h-4.5" />
                        )}
                        {isCopied && (
                          <span className="absolute -top-8 right-0 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg animate-fade-in whitespace-nowrap">
                            Copied!
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

      </main>

      {/* Footer info */}
      <footer className="max-w-7xl mx-auto px-6 w-full text-center mt-12 pt-8 border-t border-gray-900/60 z-10">
        <p className="text-xs text-gray-600">
          © 2026 HookCraft AI. Powered by engagement-focused content heuristics. 
        </p>
      </footer>
    </div>
  )
}

export default App
