import React from "react";
import { 
  X, Sparkles, Shield, Cpu, Zap, Settings, HelpCircle, 
  FolderOpen, Code, RefreshCw, Key, Image, HelpCircle as HelpIcon, Play
} from "lucide-react";
import WorkspaceExplorer from "./WorkspaceExplorer";
import { AndroidFile } from "../types";

interface OptionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  // Support AI props
  supportAIStatusMessage: string;
  onClearHighlight: () => void;
  highLightedOption: string | null;
  setHighLightedOption: (val: string | null) => void;
  // Persona Behaviors Selectors
  agentPersona: string;
  setAgentPersona: (p: string) => void;
  // Workspace properties
  files: AndroidFile[];
  activeFile: AndroidFile | null;
  onSetActiveFile: (file: AndroidFile) => void;
  onUpdateFileContent: (path: string, content: string) => void;
  appName: string;
  // Compiler specs
  arch: string;
  setArch: (val: string) => void;
  minSdk: number;
  setMinSdk: (val: number) => void;
  targetSdk: number;
  setTargetSdk: (val: number) => void;
  optimization: string;
  setOptimization: (val: string) => void;
  modelName: string;
  setModelName: (val: string) => void;
  huggingfaceToken: string;
  setHuggingfaceToken: (val: string) => void;
  // Custom asset bundle variables
  customIcon: string;
  setCustomIcon: (val: string) => void;
  newAssetInput: string;
  setNewAssetInput: (val: string) => void;
  customAssets: string[];
  setCustomAssets: (assets: string[]) => void;
  // Executions FSM bot statuses
  fsmBotStates: Record<string, { currentState: string; logs: string[]; isRunning: boolean; hasRun: boolean }>;
  onDeployFsmBot: (botId: string) => void;
  // Complements Compile triggers
  isCompiling: boolean;
  onCompile: () => void;
  // Spot Connection rename variables
  oldJavaFileClass: string;
  setOldJavaFileClass: (val: string) => void;
  newJavaFileClass: string;
  setNewJavaFileClass: (val: string) => void;
  isRenamePatching: boolean;
  onExecuteClassRename: () => void;
  renameLogs: string[];
  // Keystore and version management
  signingConfig: "debug" | "release";
  setSigningConfig: (val: "debug" | "release") => void;
  versionCode: number;
  setVersionCode: (val: number) => void;
  versionName: string;
  setVersionName: (val: string) => void;
  estimatedSizeMB: string;
}

export default function OptionsDrawer({
  isOpen,
  onClose,
  supportAIStatusMessage,
  onClearHighlight,
  highLightedOption,
  setHighLightedOption,
  agentPersona,
  setAgentPersona,
  files,
  activeFile,
  onSetActiveFile,
  onUpdateFileContent,
  appName,
  arch,
  setArch,
  minSdk,
  setMinSdk,
  targetSdk,
  setTargetSdk,
  optimization,
  setOptimization,
  modelName,
  setModelName,
  huggingfaceToken,
  setHuggingfaceToken,
  customIcon,
  setCustomIcon,
  newAssetInput,
  setNewAssetInput,
  customAssets,
  setCustomAssets,
  fsmBotStates,
  onDeployFsmBot,
  isCompiling,
  onCompile,
  oldJavaFileClass,
  setOldJavaFileClass,
  newJavaFileClass,
  setNewJavaFileClass,
  isRenamePatching,
  onExecuteClassRename,
  renameLogs,
  signingConfig,
  setSigningConfig,
  versionCode,
  setVersionCode,
  versionName,
  setVersionName,
  estimatedSizeMB
}: OptionsDrawerProps) {
  
  if (!isOpen) return null;

  const personasList = [
    {
      id: "security",
      name: "Security Architect",
      desc: "Hardens binders, injects cipher columns and blocks unencrypted socket callbacks.",
      icon: Shield,
      color: "border-purple-500/30 text-purple-400 focus:ring-purple-500"
    },
    {
      id: "performance",
      name: "Performance Optimizer",
      desc: "Crunches background JVM overhead, trims Proguard shrinking bounds and refactors variables.",
      icon: Zap,
      color: "border-amber-500/30 text-amber-500 focus:ring-amber-500"
    },
    {
      id: "designer",
      name: "UI/UX Specialist",
      desc: "Injects gorgeous custom color themes, designs material templates and adjusts fluid paddings.",
      icon: Sparkles,
      color: "border-sky-500/30 text-sky-400 focus:ring-sky-500"
    }
  ];

  return (
    <>
      {/* Backdrop shade overlay */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-xs z-40 transition-opacity" 
        onClick={onClose}
      />

      {/* Main Drawer Shell */}
      <div className="fixed inset-y-0 right-0 w-full sm:w-[540px] bg-[#0E0E10] border-l border-white/10 shadow-[0_0_55px_rgba(0,0,0,0.9)] z-50 flex flex-col overflow-hidden text-xs">
        
        {/* Drawer Header Section */}
        <div className="h-12 border-b border-white/10 px-4 bg-[#141417] flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <Settings size={14} className="text-orange-500 animate-spin-slow" />
            <span className="font-extrabold text-white uppercase tracking-widest text-[11px]">STUDIO WORKSPACE CONFIGS</span>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-full cursor-pointer transition-colors"
          >
            <X size={13} />
          </button>
        </div>

        {/* Content Body Pane (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 select-none scrollbar-thin scrollbar-thumb-zinc-800">
          
          {/* 1. SUPPORT AI ASSISTANCE PANEL */}
          <div className="bg-gradient-to-r from-blue-950/20 to-indigo-950/10 border border-blue-500/35 p-3.5 rounded-xl space-y-2.5">
            <div className="flex justify-between items-center pb-1.5 border-b border-blue-500/20">
              <span className="text-[10px] font-mono font-black text-blue-400 uppercase flex items-center gap-1">
                🧭 Compass Support AI Navigator
              </span>
              {highLightedOption && (
                <button
                  onClick={onClearHighlight}
                  className="text-[9px] text-[#f97316] font-bold hover:underline bg-white/5 px-2 py-0.5 rounded cursor-pointer"
                >
                  Prune Focus Highlights
                </button>
              )}
            </div>
            
            <p className="text-[10.5px] leading-relaxed text-blue-100 font-sans">{supportAIStatusMessage}</p>
            
            {/* Quick Actions Support Bot Buttons to Highlight elements */}
            <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px]">
              <button
                onClick={() => {
                  setHighLightedOption("security");
                  onSetActiveFile(files.find(f => f.path.includes("SQLiteHelp")) || files[0]);
                }}
                className={`py-1.5 px-2 rounded-lg text-left transition-all ${
                  highLightedOption === "security" 
                    ? "bg-purple-900/40 border border-purple-500 text-white" 
                    : "bg-white/[0.02] border border-white/5 text-slate-400 hover:bg-white/10"
                }`}
              >
                🔒 Highlight SQLite Cipher
              </button>

              <button
                onClick={() => {
                  setHighLightedOption("MainActivity.java");
                  onSetActiveFile(files.find(f => f.path.includes("MainActivity")) || files[0]);
                }}
                className={`py-1.5 px-2 rounded-lg text-left transition-all ${
                  highLightedOption === "MainActivity.java" 
                    ? "bg-orange-950/40 border border-[#f97316] text-white" 
                    : "bg-white/[0.02] border border-white/5 text-slate-400 hover:bg-white/10"
                }`}
              >
                📝 Highlight Main Entry
              </button>
            </div>
          </div>

          {/* 2. AGENT PERSONA BEHAVIORS SELECTOR */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pb-1 border-b border-white/5">
              🎓 Autonomous Persona Behaviors Mode
            </h4>
            <div className="space-y-2 pt-1 text-slate-300">
              {personasList.map((p) => {
                const Icon = p.icon;
                const isSelected = agentPersona === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      setAgentPersona(p.id);
                      setHighLightedOption(p.id);
                    }}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex gap-3 items-start ${
                      isSelected 
                        ? "bg-white/[0.03] border-orange-500 shadow-lg shadow-orange-500/5 text-white" 
                        : "bg-black/40 border-white/5 text-slate-400 hover:border-white/10"
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg bg-zinc-900/60 shrink-0 border border-white/5`}>
                      <Icon size={14} className={isSelected ? "text-orange-500" : "text-slate-500"} />
                    </div>
                    <div>
                      <div className="font-extrabold text-[10.5px] tracking-tight">{p.name}</div>
                      <p className="text-[9.5px] text-slate-500 mt-0.5 leading-snug">{p.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. SPOT CONNECTION HEALING (rename class) */}
          <div className="bg-zinc-950 border border-white/5 p-3 rounded-xl space-y-2.5">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#ea580c] font-black block">
                🔄 Spot-Connection Healing Logic
              </span>
              <p className="text-[9.5px] text-slate-600 font-sans mt-0.5">
                Automatically scans AST trees & heals references across the workspace on class rename.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div>
                <label className="text-[9px] text-slate-500 block mb-1">Old Java Class Name</label>
                <input
                  type="text"
                  className="w-full bg-black/60 border border-white/10 p-1.5 rounded text-slate-200 font-mono text-[9px]"
                  value={oldJavaFileClass}
                  onChange={(e) => setOldJavaFileClass(e.target.value)}
                />
              </div>
              <div>
                <label className="text-[9px] text-slate-500 block mb-1">New Java Class Name</label>
                <input
                  type="text"
                  className="w-full bg-black/60 border border-white/10 p-1.5 rounded text-slate-200 font-mono text-[9px]"
                  value={newJavaFileClass}
                  onChange={(e) => setNewJavaFileClass(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={onExecuteClassRename}
              disabled={isRenamePatching}
              className="w-full bg-[#f97316]/10 hover:bg-[#f97316]/20 border border-[#f97316]/30 text-[#f97316] py-1.5 rounded text-[10px] font-black cursor-pointer tracking-wider"
            >
              {isRenamePatching ? "SCANNING AST REFERENCES..." : "RUN DEEP DEPENDENCY SCAN & PATCH"}
            </button>

            {renameLogs.length > 0 && (
              <div className="bg-black/80 rounded p-2 text-[8.5px] font-mono text-[#ea580c] border border-orange-500/10 space-y-0.5 max-h-16 overflow-y-auto pr-1">
                {renameLogs.map((rl, index) => (
                  <div key={index} className="truncate">{rl}</div>
                ))}
              </div>
            )}
          </div>

          {/* 4. CHORE BOTS PIPELINE OR AUTOPILOT STATS */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pb-1 border-b border-white/5">
              🤖 Autonomous Chore Bot Pipeline
            </h4>
            <div className="grid grid-cols-2 gap-2.5 pt-1 text-[10.5px]">
              {[
                { id: "linter", name: "FSM Linter Bot", color: "from-orange-500 to-amber-500" },
                { id: "schema", name: "SQLite Schema Bot", color: "from-purple-500 to-indigo-500" },
                { id: "testing", name: "JUnit Testing Bot", color: "from-emerald-500 to-teal-500" },
                { id: "manifest", name: "XML Manifest Bot", color: "from-blue-500 to-cyan-500" }
              ].map((b) => {
                const state = fsmBotStates[b.id] || { currentState: "IDLE", logs: [], isRunning: false };
                return (
                  <div key={b.id} className="bg-black/40 border border-white/5 rounded-xl p-2.5 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-extrabold text-white text-[10px]">{b.name}</span>
                        <span className={`text-[8.5px] px-1 py-0.2 rounded font-mono font-bold ${
                          state.currentState === "RUNNING" ? "bg-orange-500/20 text-orange-400 animate-pulse" 
                          : state.currentState === "COMPLETED" ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-zinc-800 text-slate-500"
                        }`}>{state.currentState}</span>
                      </div>
                      <p className="text-[9px] text-slate-500 truncate">{state.logs[0] || "Waiting for cycle trigger"}</p>
                    </div>
                    
                    <button
                      onClick={() => onDeployFsmBot(b.id)}
                      disabled={state.isRunning || isCompiling}
                      className="mt-2 text-[9px] w-full text-center py-1 bg-white/[0.02] hover:bg-white/5 border border-white/5 rounded font-mono text-slate-400 hover:text-white cursor-pointer"
                    >
                      🚀 DEPLOY BOT
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5. ACTUAL SOURCE GRADLE WORKSPACE COMPONENT EDITOR */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pb-1 border-b border-white/5 flex justify-between">
              <span>📂 Virtual Code Workspace Explorer</span>
              <span className="text-[9px] text-orange-400 font-mono font-bold lowercase">Direct AST Injection</span>
            </h4>
            
            <div className="border border-white/10 rounded-xl overflow-hidden bg-black/60 h-[320px]">
              <WorkspaceExplorer
                files={files}
                activeFile={activeFile}
                onSetActiveFile={onSetActiveFile}
                onUpdateFileContent={onUpdateFileContent}
                appName={appName}
                isCompiling={isCompiling}
                onCompile={onCompile}
              />
            </div>
          </div>

          {/* 6. GRADLE TARGETS & BUILD SYSTEMS CONFIGURATION */}
          <div className="space-y-3.5 pt-2">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pb-1 border-b border-white/5">
              ⚙️ Gradle Build Targets Specs
            </h4>
            
            <div className="grid grid-cols-2 gap-3.5 text-[10px]">
              <div className="flex flex-col gap-1.5">
                <span className="text-slate-500 uppercase font-bold text-[8.5px]">ABI Compliance Matrix</span>
                <select
                  value={arch}
                  onChange={(e) => setArch(e.target.value)}
                  className="w-full bg-black/80 border border-white/10 p-2 rounded text-slate-200 focus:outline-none"
                >
                  <option value="arm64-v8a">ARM64 (arm64-v8a) - Native</option>
                  <option value="armeabi-v7a">ARMv7 (armeabi-v7a)</option>
                  <option value="x86_64">Intel Emulator (x86_64)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-slate-500 uppercase font-bold text-[8.5px]">Optimizer Shrunk Rules</span>
                <select
                  value={optimization}
                  onChange={(e) => setOptimization(e.target.value)}
                  className="w-full bg-black/80 border border-white/10 p-2 rounded text-slate-200 focus:outline-none"
                >
                  <option value="Zipalign & ProGuard">Zipalign & ProGuard (Recommended)</option>
                  <option value="None (Debug Mode Only)">No Shrunk bounds (Fast build)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5 text-[10px]">
              <div className="flex flex-col gap-1.5">
                <span className="text-slate-500 uppercase font-bold text-[8.5px]">API Target Level (Min)</span>
                <select
                  value={minSdk}
                  onChange={(e) => setMinSdk(Number(e.target.value))}
                  className="w-full bg-black/80 border border-white/10 p-2 rounded text-slate-200 focus:outline-none"
                >
                  <option value={19}>API 19 (KitKat)</option>
                  <option value={21}>API 21 (Lollipop)</option>
                  <option value={26}>API 26 (Oreo)</option>
                  <option value={30}>API 30 (Android 11)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-slate-500 uppercase font-bold text-[8.5px]">Target SDK Level (Max)</span>
                <select
                  value={targetSdk}
                  onChange={(e) => setTargetSdk(Number(e.target.value))}
                  className="w-full bg-black/80 border border-white/10 p-2 rounded text-slate-200 focus:outline-none"
                >
                  <option value={30}>API 30 (Android 11)</option>
                  <option value={33}>API 33 (Tiramisu)</option>
                  <option value={34}>API 34 (Upside Down Cake)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5 text-[10px]">
              <div className="flex flex-col gap-1.5">
                <span className="text-slate-500 uppercase font-bold text-[8.5px]">Core Launcher Style Icon</span>
                <select
                  value={customIcon}
                  onChange={(e) => setCustomIcon(e.target.value)}
                  className="w-full bg-black/80 border border-white/10 p-2 rounded text-slate-200 focus:outline-none"
                >
                  <option value="icon_rocket.webp">🚀 Rocket Launcher Style</option>
                  <option value="icon_flame.webp">🔥 Power Flame Style</option>
                  <option value="icon_gear.webp">⚙️ Core Engine Style</option>
                  <option value="icon_shield.webp">🛡️ Safe Guard Style</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-slate-500 uppercase font-bold text-[8.5px]">Local Inference Engine</span>
                <select
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  className="w-full bg-black/80 border border-white/10 p-2 rounded text-slate-200 focus:outline-none"
                >
                  <option value="gemini-3.5-flash">Gemini 3.5 Flash (SOTA)</option>
                  <option value="facebook/incoder-1B">facebook/incoder-1B</option>
                  <option value="codegen-350M">Salesforce/codegen-350M</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 text-[10px]">
              <div className="flex justify-between">
                <span className="text-slate-500 uppercase font-bold text-[8.5px]">Hugging Face credentials key Token</span>
                <span className="text-[8px] text-orange-500 font-bold uppercase">aes security cypher encrypted bound</span>
              </div>
              <input
                type="password"
                placeholder="hf_xxxxxxxxxxxxxxxxx"
                value={huggingfaceToken}
                onChange={(e) => setHuggingfaceToken(e.target.value)}
                className="w-full bg-black/80 border border-white/10 p-2 rounded text-xs text-slate-200 focus:outline-none focus:border-orange-500/50"
              />
            </div>

            {/* Assets Matrix bundles list */}
            <div className="flex flex-col gap-2 text-[10px]">
              <span className="text-slate-500 uppercase font-bold text-[8.5px]">Custom Asset Bundles</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. secure_constants.json"
                  value={newAssetInput}
                  onChange={(e) => setNewAssetInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newAssetInput.trim()) {
                      const val = newAssetInput.trim();
                      if (!customAssets.includes(val)) setCustomAssets([...customAssets, val]);
                      setNewAssetInput("");
                    }
                  }}
                  className="flex-grow bg-black/80 border border-white/10 p-2 rounded text-slate-200 focus:outline-none text-[11px]"
                />
                <button
                  onClick={() => {
                    if (newAssetInput.trim()) {
                      const val = newAssetInput.trim();
                      if (!customAssets.includes(val)) setCustomAssets([...customAssets, val]);
                      setNewAssetInput("");
                    }
                  }}
                  className="bg-orange-500 hover:bg-orange-400 text-black px-3.5 rounded font-bold cursor-pointer font-sans"
                >
                  Add
                </button>
              </div>
              
              <div className="flex flex-wrap gap-1 md:max-h-20 overflow-y-auto pr-1">
                {customAssets.length === 0 ? (
                  <span className="text-zinc-600 text-[9px] italic">No extra custom static assets indexed in manifest.</span>
                ) : (
                  customAssets.map((as, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 bg-black p-1.5 px-2.5 rounded-lg border border-white/5 font-mono text-[9.5px]">
                      <span className="text-slate-300">{as}</span>
                      <button 
                        onClick={() => setCustomAssets(customAssets.filter((_, i) => i !== idx))}
                        className="text-stone-500 hover:text-red-400 font-extrabold cursor-pointer text-[9px]"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 7. SIMULATED KEYSTORE & VERSION METADATA */}
            <div className="border border-white/5 bg-zinc-950 p-3.5 rounded-xl space-y-3.5">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-[10px] uppercase font-mono tracking-wider text-orange-400 font-extrabold flex items-center gap-1.5">
                  🔑 Keystore &amp; Version Configuration
                </span>
                <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 text-[9px] px-2 py-0.5 rounded-full font-mono font-bold">
                  {estimatedSizeMB} MB Est. APK
                </span>
              </div>

              {/* Version Controls */}
              <div className="grid grid-cols-2 gap-3 text-[10px]">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Version Code (Integer)</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full bg-black/60 border border-white/10 p-2 rounded text-slate-200 font-mono text-xs focus:outline-none focus:border-orange-500/50"
                    value={versionCode}
                    onChange={(e) => setVersionCode(Math.max(1, Number(e.target.value)))}
                  />
                  <p className="text-[8px] text-slate-600 mt-1">Numerical identifier for updates</p>
                </div>
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Version Name (String)</label>
                  <input
                    type="text"
                    className="w-full bg-black/60 border border-white/10 p-2 rounded text-slate-200 font-mono text-xs focus:outline-none focus:border-orange-500/50"
                    value={versionName}
                    onChange={(e) => setVersionName(e.target.value)}
                  />
                  <p className="text-[8px] text-slate-600 mt-1">User-facing version, e.g. 1.0.4</p>
                </div>
              </div>

              {/* Keystore Config Selection */}
              <div className="space-y-2">
                <label className="text-slate-400 font-bold block">Signing Configurations Signature</label>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <button
                    onClick={() => setSigningConfig("debug")}
                    className={`py-2 px-3 rounded-lg border text-center transition-all cursor-pointer font-bold ${
                      signingConfig === "debug"
                        ? "bg-slate-900 border-orange-500/60 text-orange-400"
                        : "bg-black/40 border-white/5 text-slate-500 hover:border-white/10"
                    }`}
                  >
                    🚧 Debug keystore
                  </button>
                  <button
                    onClick={() => setSigningConfig("release")}
                    className={`py-2 px-3 rounded-lg border text-center transition-all cursor-pointer font-bold ${
                      signingConfig === "release"
                        ? "bg-[#ea580c]/10 border-[#ea580c] text-[#f97316]"
                        : "bg-black/40 border-white/5 text-slate-500 hover:border-white/10"
                    }`}
                  >
                    🛡️ Release keystore
                  </button>
                </div>

                {/* Simulated Certificate Parameters */}
                <div className="bg-black/80 rounded p-2.5 text-[9px] font-mono text-slate-400 space-y-1 mt-2 border border-white/5">
                  <div className="flex justify-between">
                    <span className="text-zinc-600 font-semibold">Key Alias:</span>
                    <span className="text-slate-300 font-extrabold">{signingConfig === "debug" ? "androiddebugkey" : `${appName.toLowerCase()}_release_key`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600 font-semibold">Certificate Hash (SHA-256):</span>
                    <span className="text-slate-400 tracking-tight text-[8px] select-all">
                      {signingConfig === "debug" 
                        ? "9A:E6:AA:2F:5C:38:A2:3B:EE:75" 
                        : "47:FD:A2:BC:60:F1:DA:EE:99:A5"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600 font-semibold">Encryption Method:</span>
                    <span className="text-emerald-400">RSA-4096 Secure PKCS12</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Compile Executer sticky strip at the bottom of the drawer */}
        <div className="p-3 bg-[#111114] border-t border-white/10 flex gap-2 pt-3 shrink-0">
          <button
            onClick={onCompile}
            disabled={isCompiling}
            className={`w-full py-2.5 rounded-lg text-black font-extrabold text-xs transition-transform shadow-lg active:scale-95 cursor-pointer flex items-center justify-center gap-2 ${
              isCompiling
                ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-400 text-black"
            }`}
          >
            <Play size={12} className={isCompiling ? "animate-spin" : ""} fill="currentColor" />
            <span>{isCompiling ? "SIMULATING COMPILATION..." : "TRIGGER COMPILE ACTION (BUILDS APK)"}</span>
          </button>
        </div>

      </div>
    </>
  );
}
