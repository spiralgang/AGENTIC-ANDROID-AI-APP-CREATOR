import React, { useState, useEffect, useRef } from "react";
import { Terminal, Send, Play, Sparkles, ShieldAlert, Cpu } from "lucide-react";

interface TerminalLine {
  text: string;
  type: "input" | "output" | "error" | "success" | "gemini";
  timestamp: string;
}

interface TerminalSimulatorProps {
  onExecuteCommand: (cmd: string, args: string[]) => void;
  terminalLogs: TerminalLine[];
  addLog: (text: string, type: "input" | "output" | "error" | "success" | "gemini") => void;
  isSuperUser: boolean;
  setIsSuperUser: (val: boolean) => void;
}

export default function TerminalSimulator({
  onExecuteCommand,
  terminalLogs,
  addLog,
  isSuperUser,
  setIsSuperUser,
}: TerminalSimulatorProps) {
  const [inputVal, setInputVal] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of terminal
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [terminalLogs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim();
    if (!cmd) return;

    // Add to terminal history
    setHistory((prev) => [cmd, ...prev]);
    setHistoryIndex(-1);

    // Write input line to terminal logs
    addLog(`$ ${cmd}`, "input");

    // Parse command
    const parts = cmd.split(" ");
    const primaryCmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    onExecuteCommand(primaryCmd, args);
    setInputVal("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0 && historyIndex < history.length - 1) {
        const nextIndex = historyIndex + 1;
        setHistoryIndex(nextIndex);
        setInputVal(history[nextIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInputVal(history[nextIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal("");
      }
    }
  };

  return (
    <div className={`flex flex-col h-full bg-[#0A0A0B] rounded-xl border ${isSuperUser ? 'border-rose-500/30 shadow-rose-950/20' : 'border-white/10 shadow-2xl'} overflow-hidden font-mono text-sm text-slate-300 transition-all duration-300`}>
      {/* Terminal Title Bar */}
      <div className={`flex items-center justify-between px-4 py-2 ${isSuperUser ? 'bg-[#181113] border-b border-rose-500/20' : 'bg-[#111113] border-b border-white/10'} select-none transition-colors duration-300`}>
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 block duration-100 hover:scale-110 cursor-pointer"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 block duration-100 hover:scale-110 cursor-pointer"></span>
            <span className="w-3 h-3 rounded-full bg-green-500/80 block duration-100 hover:scale-110 cursor-pointer"></span>
          </div>
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 ml-2">
            {isSuperUser ? (
              <>
                <ShieldAlert size={13} className="text-rose-500 animate-pulse" />
                <span className="text-rose-400 font-extrabold">root@container-sandbox:~# (LIVE SHIELD)</span>
              </>
            ) : (
              <>
                <Terminal size={13} className="text-orange-400" />
                ai-apk-generator-cli v1.1.0 (local)
              </>
            )}
          </span>
        </div>

        {/* Superuser live mode switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-black/40 border border-white/5 rounded px-2 py-0.5">
            <input
              type="checkbox"
              id="super-user-checkbox"
              checked={isSuperUser}
              onChange={(e) => {
                const checked = e.target.checked;
                setIsSuperUser(checked);
                addLog(
                  checked
                    ? "⚠️ [SYSTEM WARNING] Superuser Mode engaged. Live Container Sandbox terminal shell active. Commands execute directly inside Node environment workspace."
                    : "ℹ️ [SYSTEM] Superuser Mode disengaged. Default Android Studio compiler simulation mode restored.",
                  checked ? "error" : "output"
                );
              }}
              className="rounded accent-rose-600 border-zinc-800 bg-zinc-900 focus:ring-0 w-3 h-3 cursor-pointer"
            />
            <label htmlFor="super-user-checkbox" className={`text-[9px] font-bold tracking-wider cursor-pointer uppercase select-none ${isSuperUser ? 'text-rose-400' : 'text-slate-500 hover:text-slate-300'}`}>
              SUPERUSER SHELL
            </label>
          </div>

          <div className="text-[10px] text-slate-500 flex items-center gap-1">
            <span className={`inline-block w-1.5 h-1.5 rounded-full ${isSuperUser ? 'bg-rose-500' : 'bg-emerald-500'} animate-pulse`}></span>
            {isSuperUser ? 'container shell ready' : 'online-compiles ready'}
          </div>
        </div>
      </div>

      {/* Terminal Logs Canvas */}
      <div 
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent selection:bg-orange-500/30"
      >
        <div className="text-slate-500 text-xs mb-3 border-b border-white/5 pb-2">
          {isSuperUser ? (
            <>
              ⚠️ <span className="text-rose-400 font-bold">SUPERUSER ACTIVE</span>: You have full sandbox shell, internet, and package execution rights.
              <br />
              Execute Node scripts, examine file directory trees, check <span className="text-orange-400 font-mono">npm run build</span> outputs, or use custom git functions.
            </>
          ) : (
            <>
              Welcome to the APK Generator shell.
              <br />
              Type <span className="text-orange-400">help</span> to explore available SDK compiler scripts.
              <br />
              Ready to synthesize full Gradle trees and simulate Android compiler environments.
            </>
          )}
        </div>

        {terminalLogs.map((log, index) => {
          let textClass = "text-slate-300";
          if (log.type === "input") textClass = "text-orange-400 font-semibold";
          if (log.type === "error") textClass = "text-rose-400 font-medium";
          if (log.type === "success") textClass = "text-emerald-400 font-medium";
          if (log.type === "gemini") textClass = "text-orange-300 italic flex items-start gap-1 bg-orange-950/20 p-1.5 rounded-md border border-orange-900/20";

          return (
            <div key={index} className="flex flex-col text-xs leading-5">
              {log.type === "gemini" ? (
                <div className={textClass}>
                  <Sparkles size={14} className="text-orange-400 shrink-0 mt-0.5" />
                  <pre className="whitespace-pre-wrap font-mono">{log.text}</pre>
                </div>
              ) : (
                <span className={textClass}>{log.text}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Terminal Input Box */}
      <form onSubmit={handleSubmit} className={`flex border-t ${isSuperUser ? 'border-rose-950 bg-[#140D0E]' : 'border-white/10 bg-[#0C0C0E]'} p-2.5 transition-colors duration-300`}>
        <div className={`flex items-center ${isSuperUser ? 'text-rose-400' : 'text-orange-400'} font-bold px-1.5 mr-1 select-none text-xs`}>
          {isSuperUser ? "root@sandbox-core:/workspace#" : "jonathan@workspace:~#"}
        </div>
        <input
          id="cli-input-field"
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-grow bg-transparent text-slate-200 focus:outline-none font-mono text-xs caret-orange-400"
          placeholder={isSuperUser ? "Enter bash command (e.g. 'ls -la', 'npm run build', 'df -h') or query..." : "Type 'help' list or 'new [prompt]'..."}
          autoComplete="off"
          spellCheck="false"
        />
        <button
          type="submit"
          className={`p-1 px-3 bg-white/5 border border-white/10 ${isSuperUser ? 'hover:bg-rose-600 hover:border-rose-500 hover:text-white' : 'hover:bg-orange-600 hover:border-orange-500 hover:text-white'} rounded text-slate-400 transition-colors flex items-center justify-center text-xs cursor-pointer`}
        >
          <Send size={11} />
        </button>
      </form>
    </div>
  );
}
