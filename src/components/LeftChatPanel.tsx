import React, { useRef, useEffect } from "react";
import { Send, Sparkles, Cpu, AlertCircle, ShieldAlert, BadgeCheck, MessageSquare } from "lucide-react";

interface LeftChatPanelProps {
  chatMessages: Array<{
    sender: "user" | "arch" | "security" | "test" | "support" | "watchdog";
    text: string;
    time: string;
  }>;
  currentChatInput: string;
  onChatInputChange: (val: string) => void;
  onSendChat: (text: string) => void;
  isAgentRunning: boolean;
  agentPersona: string;
}

export default function LeftChatPanel({
  chatMessages,
  currentChatInput,
  onChatInputChange,
  onSendChat,
  isAgentRunning,
  agentPersona
}: LeftChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentChatInput.trim()) {
      onSendChat(currentChatInput.trim());
      onChatInputChange("");
    }
  };

  const getSenderStyle = (sender: string) => {
    switch (sender) {
      case "support":
        return {
          bg: "bg-blue-500/10 border-blue-500/20 text-blue-400",
          title: "🧭 Support AI Helper",
          border: "border-l-2 border-l-blue-500"
        };
      case "watchdog":
        return {
          bg: "bg-amber-500/10 border-amber-500/20 text-amber-500",
          title: "🧠 Global Watchdog",
          border: "border-l-2 border-l-amber-500"
        };
      case "arch":
        return {
          bg: "bg-orange-500/10 border-orange-500/20 text-orange-400",
          title: "👨‍💻 Lead Code Architect",
          border: "border-l-2 border-l-orange-500"
        };
      case "security":
        return {
          bg: "bg-purple-500/10 border-purple-500/20 text-purple-400",
          title: "🛡️ Security Analyst Bot",
          border: "border-l-2 border-l-purple-500"
        };
      case "test":
        return {
          bg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
          title: "🧪 Multi-JUnit Test Bot",
          border: "border-l-2 border-l-emerald-500"
        };
      default:
        return {
          bg: "bg-zinc-800 text-zinc-100",
          title: "👤 You",
          border: ""
        };
    }
  };

  const recommendedPills = [
    "🔒 Inject SQLiteCipher integration & verify credentials safety",
    "📝 Highlight MainActivity.java constraints & run syntactical cleanup",
    "🔁 Execute class rename and run Deep Dependency healing",
    "🚀 Trigger full release build simulation with optimization"
  ];

  return (
    <section className="flex-1 flex flex-col bg-[#0A0A0B] h-full border-r border-white/10 overflow-hidden">
      {/* Dynamic Agent active status ribbon */}
      <div className="h-10 border-b border-white/10 bg-black/40 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <MessageSquare size={13} className="text-orange-500" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">COLLABORATIVE CO-PILOT ROOM</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[10px] bg-[#111113] border border-white/5 py-0.5 px-2 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
            <span className="text-slate-400">Persona: <strong className="text-white uppercase">{agentPersona || "standard"}</strong></span>
          </div>
          {isAgentRunning && (
            <div className="flex items-center gap-1.5 text-[9px] text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded px-1.5 py-0.5 animate-pulse">
              <Sparkles size={10} className="animate-spin" />
              <span>SWARM SOLVING ACTIVE</span>
            </div>
          )}
        </div>
      </div>

      {/* Message scroll list */}
      <div 
        ref={scrollRef}
        className="flex-grow p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-zinc-800"
      >
        {chatMessages.map((msg, idx) => {
          const style = getSenderStyle(msg.sender);
          const isUser = msg.sender === "user";
          return (
            <div 
              key={idx} 
              className={`flex flex-col max-w-[85%] ${isUser ? "ml-auto items-end" : "mr-auto items-start animate-fade-in"}`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[10px] text-slate-500 font-mono tracking-wider">{msg.time}</span>
                <span className={`text-[10px] font-bold ${isUser ? "text-orange-400" : "text-white"}`}>
                  {style.title}
                </span>
              </div>
              
              <div className={`p-3 rounded-lg text-xs leading-relaxed border ${style.bg} ${style.border} font-sans shadow-md`}>
                <p className="whitespace-pre-wrap select-text">{msg.text}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Suggested Command Capsules */}
      <div className="p-3 bg-black/20 border-t border-white/5 flex flex-wrap gap-1.5 select-none shrink-0 max-h-28 overflow-y-auto">
        {recommendedPills.map((pill, i) => (
          <button
            key={i}
            onClick={() => {
              // Strip emojis for simple chat send
              const plain = pill.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD00-\uDFFF]/g, "").trim();
              onSendChat(plain);
            }}
            className="text-[10px] bg-white/[0.02] border border-white/10 hover:border-orange-500/40 hover:bg-white/[0.05] p-1.5 px-2.5 rounded-full text-slate-400 hover:text-orange-400 transition-all text-left truncate max-w-full cursor-pointer"
          >
            {pill}
          </button>
        ))}
      </div>

      {/* Chat input box */}
      <div className="p-3 border-t border-white/10 bg-[#0C0C0E] flex gap-3 items-center shrink-0">
        <input
          type="text"
          placeholder="Ask droids to heal codes, rename dependencies, or refactor layouts..."
          value={currentChatInput}
          onChange={(e) => onChatInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isAgentRunning}
          className="flex-1 bg-black/60 border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-orange-500/50"
        />
        <button
          onClick={() => {
            if (currentChatInput.trim()) {
              onSendChat(currentChatInput.trim());
              onChatInputChange("");
            }
          }}
          disabled={isAgentRunning || !currentChatInput.trim()}
          className="bg-orange-500 hover:bg-orange-400 disabled:bg-zinc-800 disabled:text-slate-600 text-black p-2.5 rounded-lg font-bold text-xs flex items-center justify-center cursor-pointer transition-colors shrink-0"
        >
          <Send size={13} />
        </button>
      </div>
    </section>
  );
}
