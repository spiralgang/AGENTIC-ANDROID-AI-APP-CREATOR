import React, { useState } from "react";
import { 
  Smartphone, Activity, Terminal, ExternalLink, RefreshCw, Layers, 
  HelpCircle, CheckCircle2, AlertTriangle, ShieldCheck, Zap 
} from "lucide-react";

// Dynamic charts or visual timing trackers using simple markup to keep Recharts bugs free, 
// or clean Canvas-based SVG lines
interface RightTabsPaneProps {
  activeRightTab: "preview" | "terminal" | "brain";
  setActiveRightTab: (tab: "preview" | "terminal" | "brain") => void;
  // Project / state hooks
  currentProject: {
    appName: string;
    packageName: string;
    files: Array<{ path: string; content: string }>;
  };
  terminalLogs: any[];
  addLog: (text: string, type: "input" | "output" | "error" | "success") => void;
  selectedBrainNode: string;
  setSelectedBrainNode: (node: string) => void;
  // Simulated android variables
  simNotesList: string[];
  setSimNotesList: (notes: string[]) => void;
  simFlashlightState: boolean;
  setSimFlashlightState: (on: boolean) => void;
  simCalcFormula: string;
  setSimCalcFormula: (f: string) => void;
  simNoteInput: string;
  setSimNoteInput: (val: string) => void;
}

export default function RightTabsPane({
  activeRightTab,
  setActiveRightTab,
  currentProject,
  terminalLogs,
  addLog,
  selectedBrainNode,
  setSelectedBrainNode,
  simNotesList,
  setSimNotesList,
  simFlashlightState,
  setSimFlashlightState,
  simCalcFormula,
  setSimCalcFormula,
  simNoteInput,
  setSimNoteInput
}: RightTabsPaneProps) {
  
  // Local state for calculator, scratchpad, or simple toggle variables
  const handleCalcClick = (val: string) => {
    if (val === "C") {
      setSimCalcFormula("");
    } else if (val === "=") {
      try {
        // Safe evaluation helper
        const sanitized = simCalcFormula.replace(/[^0-9+\-*/.]/g, "");
        const res = Function(`"use strict"; return (${sanitized})`)();
        setSimCalcFormula(String(res));
        addLog(`[Device Play] Evaluated calculator string: ${sanitized} = ${res}`, "success");
      } catch (err) {
        setSimCalcFormula("Error");
      }
    } else {
      setSimCalcFormula(simCalcFormula + val);
    }
  };

  const handleCreateNote = () => {
    if (simNoteInput.trim()) {
      setSimNotesList([...simNotesList, simNoteInput.trim()]);
      addLog(`[Device Play] Added a local database text note entry.`, "success");
      setSimNoteInput("");
    }
  };

  const handleDeleteNote = (idx: number) => {
    setSimNotesList(simNotesList.filter((_, i) => i !== idx));
    addLog(`[Device Play] Pruned target row index ${idx} from local table index.`, "output");
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0F0F11] h-full overflow-hidden">
      {/* Segmented pane tabs selector */}
      <div className="h-10 border-b border-white/10 bg-black/50 px-3 flex items-center justify-between shrink-0 select-none">
        <div className="flex gap-1.5 h-full items-center">
          <button
            onClick={() => setActiveRightTab("preview")}
            className={`text-xs px-3 h-8 rounded-md flex items-center gap-1.5 transition-all ${
              activeRightTab === "preview" 
                ? "bg-white/5 border border-white/15 text-white shadow-inner font-extrabold" 
                : "text-slate-500 hover:text-slate-300 font-medium"
            }`}
          >
            <Smartphone size={12} className={activeRightTab === "preview" ? "text-orange-500" : ""} />
            <span>PLAYGROUND LIVE VIEW</span>
          </button>
          
          <button
            onClick={() => setActiveRightTab("terminal")}
            className={`text-xs px-3 h-8 rounded-md flex items-center gap-1.5 transition-all ${
              activeRightTab === "terminal" 
                ? "bg-white/5 border border-white/15 text-white shadow-inner font-extrabold" 
                : "text-slate-500 hover:text-slate-300 font-medium"
            }`}
          >
            <Terminal size={12} className={activeRightTab === "terminal" ? "text-orange-500" : ""} />
            <span>TERMINAL & LOG TRACES</span>
          </button>

          <button
            onClick={() => setActiveRightTab("brain")}
            className={`text-xs px-3 h-8 rounded-md flex items-center gap-1.5 transition-all ${
              activeRightTab === "brain" 
                ? "bg-white/5 border border-white/15 text-white shadow-inner font-extrabold" 
                : "text-slate-500 hover:text-slate-300 font-medium"
            }`}
          >
            <Activity size={12} className={activeRightTab === "brain" ? "text-orange-500" : ""} />
            <span>AGENTIC BRAIN FLOW</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-500 uppercase">SYS STAGE:</span>
          <span className="text-[10px] font-mono font-bold text-orange-400 bg-orange-500/10 px-1.5 border border-orange-500/10 rounded">COHERENT</span>
        </div>
      </div>

      {/* Pane Content router container */}
      <div className="flex-grow overflow-hidden relative">
        
        {/* TAB 1: SMARTPHONE DEVICE SIMULATOR */}
        {activeRightTab === "preview" && (
          <div className="h-full w-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#111113] to-[#0A0A0B] overflow-y-auto">
            
            {/* Phone Container Box carefully mimicking high end Android Shell */}
            <div className="w-64 h-[440px] bg-[#141416] border-[6px] border-[#202024] rounded-[30px] shadow-[0_20px_45px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden relative">
              
              {/* Device Dynamic Island / Speaker */}
              <div className="absolute top-1 left-1/2 -translate-x-1/2 w-16 h-3.5 bg-black rounded-full z-20 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#18181A] ml-auto mr-2"></div>
              </div>

              {/* Simulated Device Header Info */}
              <div className="h-7 bg-[#1A1A1E] px-4 pt-1 flex justify-between items-center text-[8px] font-sans font-medium text-slate-500 z-10 select-none">
                <span>10:30 AM</span>
                <span className="text-[7.5px] text-orange-400 font-mono tracking-widest">{currentProject.appName.toUpperCase()}</span>
                <div className="flex items-center gap-1">
                  <span>94%</span>
                  <div className="w-3.5 h-2 border border-slate-600 rounded-sm p-px flex">
                    <div className="w-full h-full bg-emerald-500 rounded-xs"></div>
                  </div>
                </div>
              </div>

              {/* Dynamic Simulated Application Screen Frame */}
              <div className="flex-1 bg-zinc-900 text-slate-200 p-3 flex flex-col overflow-hidden text-xs">
                
                {/* Simulated Notepad SQLite database interface */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  <span className="text-[10px] uppercase font-bold text-orange-400 select-none tracking-widest mb-1.5">📂 SQLite Note Binder</span>
                  
                  {/* Notes Add Input */}
                  <div className="flex gap-1 mb-2">
                    <input
                      type="text"
                      className="flex-grow bg-black/40 border border-white/10 p-1 text-[9px] rounded text-white focus:outline-none"
                      placeholder="Add row data..."
                      value={simNoteInput}
                      onChange={(e) => setSimNoteInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleCreateNote(); }}
                    />
                    <button 
                      onClick={handleCreateNote}
                      className="bg-orange-500 hover:bg-orange-400 text-black px-2 py-0.5 rounded font-bold text-[9px]"
                    >
                      ADD
                    </button>
                  </div>

                  {/* Notes Rows list */}
                  <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5 scrollbar-thin">
                    {simNotesList.length === 0 ? (
                      <div className="text-[9px] text-slate-600 italic text-center mt-4">Database table schema is empty.</div>
                    ) : (
                      simNotesList.map((note, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-black/50 p-1.5 rounded border border-white/5 font-sans leading-relaxed">
                          <span className="text-[9px] truncate text-slate-200">{note}</span>
                          <button
                            onClick={() => handleDeleteNote(idx)}
                            className="text-stone-500 hover:text-red-400 text-[8px] px-1 font-bold"
                          >
                            ✕
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Simulated Tool Module: SQLite Flashlight Widget */}
                <div className="border-t border-white/5 mt-2 pt-2 flex items-center justify-between select-none">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 block tracking-tight uppercase">SQLite Cipher</span>
                    <span className="text-[8px] text-slate-600 font-mono block">AES-256 Enabled</span>
                  </div>
                  <button 
                    onClick={() => {
                      setSimFlashlightState(!simFlashlightState);
                      addLog(`[Device Play] Toggle cryptographic chip cipher lock: ${!simFlashlightState ? "LOCKED" : "UNLOCKED"}`, "output");
                    }}
                    className={`py-1 px-2.5 rounded text-[9px] font-bold tracking-wider ${
                      simFlashlightState 
                        ? "bg-purple-500 text-white animate-pulse" 
                        : "bg-zinc-800 text-slate-400 hover:text-slate-300"
                    }`}
                  >
                    {simFlashlightState ? "🔑 SECURE" : "🔓 KEYLESS"}
                  </button>
                </div>

                {/* Simulated Mini Calculator */}
                <div className="border-t border-white/5 mt-2 pt-2 flex flex-col select-none">
                  <div className="bg-black/80 p-1 rounded border border-white/5 text-right font-mono text-[10px] h-5 truncate mb-1 text-orange-400">
                    {simCalcFormula || "0"}
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    {["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "C", "0", "=", "+"].map((k) => (
                      <button
                        key={k}
                        onClick={() => handleCalcClick(k)}
                        className={`py-1 rounded text-[9px] font-bold font-mono transition-all ${
                          k === "=" 
                            ? "bg-orange-500 text-black hover:bg-orange-400" 
                            : k === "C" ? "bg-red-950 text-red-400 hover:bg-red-900 border border-red-900/10"
                            : "bg-zinc-800 hover:bg-zinc-700 text-slate-300"
                        }`}
                      >
                        {k}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Navigation Home Bar */}
              <div className="h-4 bg-[#121214] flex justify-center items-center z-10 select-none">
                <div className="w-16 h-1 bg-slate-700 rounded-full"></div>
              </div>
            </div>

            {/* Simulated Specs Diagnostics */}
            <div className="mt-4 w-64 bg-zinc-950 border border-white/5 p-2 rounded-lg text-[9px] font-mono text-slate-500 grid grid-cols-3 text-center divide-x divide-zinc-900 select-none">
              <div>
                <span className="block text-white font-extrabold uppercase">60 FPS</span>
                <span>COMPOSITOR</span>
              </div>
              <div>
                <span className="block text-emerald-400 font-extrabold uppercase">34 MB</span>
                <span>HEAP UTIL</span>
              </div>
              <div>
                <span className="block text-orange-400 font-extrabold uppercase">0.05ms</span>
                <span>MUT CALLBACK</span>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: TERMINAL CLI & build traces Console */}
        {activeRightTab === "terminal" && (
          <div className="h-full w-full flex flex-col overflow-hidden bg-[#0A0A0B] font-mono text-slate-300">
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-thin scrollbar-thumb-zinc-800 text-[10.5px]">
              <div className="text-zinc-500 text-[9px] uppercase tracking-wider select-none mb-1 border-b border-white/5 pb-1">
                🖥️ Active CLI trace stream buffer
              </div>
              {terminalLogs.length === 0 ? (
                <div className="text-zinc-600 italic select-none">No active log buffer entries. Trigger compile actions or FSM bot deployments to stream traces...</div>
              ) : (
                terminalLogs.map((log, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-zinc-600 shrink-0">[{log.timestamp}]</span>
                    <span className={
                      log.type === "success" ? "text-emerald-400 font-bold" :
                      log.type === "error" ? "text-rose-400 font-bold" :
                      log.type === "input" ? "text-orange-400 font-medium" : "text-slate-300"
                    }>{log.text}</span>
                  </div>
                ))
              )}
            </div>
            
            {/* Build delay performance timeline chart using dynamic styled SVG */}
            <div className="h-32 border-t border-white/10 bg-[#0C0C0E] p-3 flex flex-col justify-between select-none">
              <div>
                <span className="text-[9px] text-slate-500 uppercase font-mono tracking-widest block font-bold">FSM SWARM SYNCHRONOUS CYCLE LATENCY</span>
                <span className="text-[10px] text-slate-400">Total duration trend across sequential edits</span>
              </div>
              <div className="flex-1 flex items-end gap-1 px-2 pt-2">
                {[120, 80, 240, 150, 60, 310, 190, 70, 420, 210, 85].map((val, idx) => {
                  const hPercent = Math.min(100, Math.max(10, (val / 450) * 100));
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center group relative cursor-pointer">
                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-1 bg-black text-white border border-white/10 text-[8px] px-1 rounded-sm opacity-0 group-hover:opacity-100 transition-all font-mono pointer-events-none">
                        {val}ms
                      </div>
                      <div 
                        className="w-full bg-gradient-to-t from-orange-600/80 to-amber-500 rounded-t-sm transition-all duration-300 group-hover:opacity-80"
                        style={{ height: `${hPercent}%` }}
                      ></div>
                      <span className="text-[8px] text-slate-600 font-mono mt-1">E{idx+1}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DYNAMIC INTELLECTUAL AGENTIC BRAIN Graph */}
        {activeRightTab === "brain" && (
          <div className="h-full w-full flex flex-col md:flex-row overflow-hidden bg-[#0A0A0B] select-none">
            
            {/* Interactive Neural SVG node mapping */}
            <div className="flex-grow relative border-r border-white/10 flex items-center justify-center p-4 bg-black/40">
              <div className="absolute top-3 left-3 flex flex-col gap-0.5">
                <span className="text-[9px] uppercase font-mono font-bold text-orange-400">🧠 Cognitive Synteny Network</span>
                <span className="text-[8px] text-slate-500 font-mono">Select a node to review intelligence loops & dependency details</span>
              </div>

              {/* Dynamic SVG with line connections & hover triggers */}
              <svg viewBox="0 0 320 280" className="w-full max-w-xs h-auto">
                {/* SVG Connecting lines representing cognitive weights */}
                <line x1="80" y1="60" x2="160" y2="140" stroke="#f97316" strokeWidth="1.5" strokeDasharray="2,2" />
                <line x1="240" y1="60" x2="160" y2="140" stroke="#a855f7" strokeWidth="1.2" />
                <line x1="80" y1="220" x2="160" y2="140" stroke="#10b981" strokeWidth="1" />
                <line x1="240" y1="220" x2="160" y2="140" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3,3" />

                <line x1="80" y1="60" x2="240" y2="60" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="1" />
                <line x1="80" y1="220" x2="240" y2="220" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="1" />
                
                {/* Node Circles */}
                {/* Top Left: Linter FSM Bot */}
                <g className="cursor-pointer group" onClick={() => setSelectedBrainNode("Linter Bot")}>
                  <circle cx="80" cy="60" r="16" fill="#141416" stroke={selectedBrainNode === "Linter Bot" ? "#f97316" : "#2d2d34"} strokeWidth="1.5" />
                  <circle cx="80" cy="60" r="4" fill="#f97316" />
                  <text x="80" y="85" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace">Linter Bot</text>
                </g>

                {/* Top Right: SQLite Schema FSM Bot */}
                <g className="cursor-pointer group" onClick={() => setSelectedBrainNode("Schema Bot")}>
                  <circle cx="240" cy="60" r="16" fill="#141416" stroke={selectedBrainNode === "Schema Bot" ? "#a855f7" : "#2d2d34"} strokeWidth="1.5" />
                  <circle cx="240" cy="60" r="4" fill="#a855f7" />
                  <text x="240" y="85" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace">Schema Bot</text>
                </g>

                {/* Bottom Left: JUnit Tester Bot */}
                <g className="cursor-pointer group" onClick={() => setSelectedBrainNode("JUnit Tester")}>
                  <circle cx="80" cy="220" r="16" fill="#141416" stroke={selectedBrainNode === "JUnit Tester" ? "#10b981" : "#2d2d34"} strokeWidth="1.5" />
                  <circle cx="80" cy="220" r="4" fill="#10b981" />
                  <text x="80" y="244" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace">JUnit Tester</text>
                </g>

                {/* Bottom Right: Manifest Bot */}
                <g className="cursor-pointer group" onClick={() => setSelectedBrainNode("Manifest Bot")}>
                  <circle cx="240" cy="220" r="16" fill="#141416" stroke={selectedBrainNode === "Manifest Bot" ? "#3b82f6" : "#2d2d34"} strokeWidth="1.5" />
                  <circle cx="240" cy="220" r="4" fill="#3b82f6" />
                  <text x="240" y="244" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace">Manifest Bot</text>
                </g>

                {/* Central Brain Coordinator Core Hub */}
                <g className="cursor-pointer group" onClick={() => setSelectedBrainNode("Core Memory Hub")}>
                  <circle cx="160" cy="140" r="22" fill="#1A1A1E" stroke={selectedBrainNode === "Core Memory Hub" ? "#ea580c" : "#3e3e4a"} strokeWidth="2" strokeDasharray={selectedBrainNode === "Core Memory Hub" ? "4,1" : "0"} className="animate-spin-slow origin-center" />
                  <circle cx="160" cy="140" r="10" fill="#ea580c" fillOpacity="0.2" />
                  <text x="160" y="143" textAnchor="middle" fill="#ea580c" fontSize="8" fontWeight="bold">HUB</text>
                  <text x="160" y="172" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">Watchdog Core</text>
                </g>
              </svg>
            </div>

            {/* Selected Node Intelligence telemetry details */}
            <div className="w-full md:w-56 bg-zinc-950 border-t md:border-t-0 md:border-l border-white/10 p-3.5 flex flex-col justify-between overflow-y-auto shrink-0 space-y-3">
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-orange-400 block pb-1 border-b border-white/5">COGNITIVE CONTEXT</span>
                
                <div>
                  <span className="text-[8px] font-mono text-slate-500 uppercase">Selected Active Node</span>
                  <div className="text-xs text-white uppercase font-bold tracking-tight mt-0.5">{selectedBrainNode}</div>
                </div>

                <div>
                  <span className="text-[8px] font-mono text-slate-500 uppercase">Neural Coherence Scope</span>
                  <div className="flex gap-1.5 flex-wrap mt-1">
                    {selectedBrainNode === "Linter Bot" && (
                      <>
                        <span className="bg-orange-500/10 text-orange-400 px-1.5 py-0.5 rounded border border-orange-500/20 text-[9px] font-mono">ASTChecker</span>
                        <span className="bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded text-[9px] font-mono">StyleFixer</span>
                      </>
                    )}
                    {selectedBrainNode === "Schema Bot" && (
                      <>
                        <span className="bg-purple-500/10 text-purple-400 px-1.5 py-0.5 rounded border border-purple-500/20 text-[9px] font-mono">CipherMapper</span>
                        <span className="bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded text-[9px] font-mono">SQLiteModel</span>
                      </>
                    )}
                    {selectedBrainNode === "JUnit Tester" && (
                      <>
                        <span className="bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 text-[9px] font-mono">AssertValidator</span>
                        <span className="bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded text-[9px] font-mono">RegressCheck</span>
                      </>
                    )}
                    {selectedBrainNode === "Manifest Bot" && (
                      <>
                        <span className="bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20 text-[9px] font-mono">PermsReconciler</span>
                        <span className="bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded text-[9px] font-mono">XmlSynthesizer</span>
                      </>
                    )}
                    {selectedBrainNode === "Core Memory Hub" && (
                      <>
                        <span className="bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded border border-amber-500/20 text-[9px] font-mono">Coordinator</span>
                        <span className="bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded text-[9px] font-mono">VirtFileSystem</span>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-[8px] font-mono text-slate-500 uppercase">Cognitive Node Weight</span>
                  <div className="flex items-center gap-2 mt-1 font-mono">
                    <div className="flex-grow h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-orange-500 transition-all duration-300"
                        style={{ width: selectedBrainNode === "Core Memory Hub" ? "100%" : "70%" }}
                      ></div>
                    </div>
                    <span className="text-[9px] font-extrabold text-white">{selectedBrainNode === "Core Memory Hub" ? "1.00 (Max)" : "0.75"}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[8px] font-mono text-slate-500 uppercase block mb-1">Functional Description</span>
                  <p className="text-[10px] leading-relaxed text-slate-400">
                    {selectedBrainNode === "Linter Bot" && "Scans source file characters on manual save. Automatically formats abstract syntax tags, drops unused packages and verifies Java compilation structures."}
                    {selectedBrainNode === "Schema Bot" && "Maps persistent SQLite database states. Automatically matches local cipher modules when security mode is triggered in options list."}
                    {selectedBrainNode === "JUnit Tester" && "Invokes Mockito runtime scaffolds and assertions automatically to run deep dependency audits against java class models."}
                    {selectedBrainNode === "Manifest Bot" && "Synthesizes intent filters, coordinates background thread permissions and integrates custom service declarations inside AndroidManifest.xml."}
                    {selectedBrainNode === "Core Memory Hub" && "Central Watchdog broker of the FSM system. Listens to file changes, indexes memory nodes, and signals chore bots sequentially to secure setup safety."}
                  </p>
                </div>
              </div>

              <div className="bg-[#0A0A0B] p-2 rounded border border-white/5 space-y-1 text-[8px] font-mono text-slate-500 mt-2 select-text">
                <div className="text-slate-300 uppercase font-black text-[9px] pb-1 border-b border-white/5 mb-1.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  Watchdog Diagnostics
                </div>
                <div>NODE ADDR: 0xDBC3F9A</div>
                <div>AUTOPILOT: DUAL_FSM</div>
                <div>COHERENCE LEVEL: 94.6%</div>
                <div>ACTIVE INODES: {currentProject.files.length + 4} LINKS</div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
