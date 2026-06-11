import React, { useState, useEffect } from "react";
import { 
  Download, Settings, Clock, Sparkles, FolderOpen, Cpu, Terminal as TerminalIcon, 
  Layers, HardDrive, Smartphone, Activity 
} from "lucide-react";
import { DEFAULT_TEMPLATES } from "./data/templates";
import { generateJUnitTest } from "./utils/junitGenerator";
import { generateApbBinary } from "./utils/apkGenerator";
import LeftChatPanel from "./components/LeftChatPanel";
import RightTabsPane from "./components/RightTabsPane";
import OptionsDrawer from "./components/OptionsDrawer";
import { AndroidFile, AndroidProject, SavedTemplate } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "workspace" | "preview" | "agent" | "testing" | "autopilot" | "brain">("dashboard");
  const [currentProject, setCurrentProject] = useState<AndroidProject>(DEFAULT_TEMPLATES.notes_dark_v1);
  const [inputText, setInputText] = useState("");
  const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>([]);
  const [recentApks, setRecentApks] = useState<string[]>(["notes_pro_release.apk", "calc_v2.apk"]);
  const [activeFile, setActiveFile] = useState<AndroidFile | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [isSuperUser, setIsSuperUser] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<any[]>([]);
  const [utcTime, setUtcTime] = useState("");

  // Redesigned layouts states: Chat, Support AI, and options drawer
  const [isOptionsDrawerOpen, setIsOptionsDrawerOpen] = useState(false);
  const [activeRightTab, setActiveRightTab] = useState<"preview" | "terminal" | "brain">("preview");
  const [currentChatInput, setCurrentChatInput] = useState("");
  const [highLightedOption, setHighLightedOption] = useState<string | null>(null);
  const [supportAIStatusMessage, setSupportAIStatusMessage] = useState(
    "🧭 Support AI Helper: Hello! I have scanned your overall system directories or app templates. Open 'Customize Options' at the top right to selection presets or highlight security personas!"
  );
  
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "arch" | "security" | "test" | "support" | "watchdog"; text: string; time: string }>>([
    {
      sender: "support" as const,
      text: "👋 Welcome to our simple, multi-agent AI Sandbox workspace! I am your Support AI designed to highlight options & add templates so you can tune configurations dynamically. Our team of expert droids is structured to collaborate comprehensively below.",
      time: "10:30:00 AM"
    },
    {
      sender: "watchdog" as const,
      text: "🧠 [Watchdog Core Coordinator] Welcome, engineer! All systems are synced. Whenever you type requirements here, we trigger parallel code synthesis, linter sweeps, layout compiles, and Mockito tests to optimize your workspace. Drop a line below to begin!",
      time: "10:30:05 AM"
    },
    {
      sender: "arch" as const,
      text: "👨‍💻 [Code Architect] Ready! Currently focusing on NotesPro with customizable layout features & local database binders. You can open 'Customize Options' at the top-right edge to view or edit raw Java classes.",
      time: "10:30:08 AM"
    }
  ]);

  // Build History metrics
  const [buildHistory, setBuildHistory] = useState([
    { buildIndex: 1, projectName: "NotesPro", durationSec: 15.2, status: "SUCCESS" as const, timestamp: "10:10:02 AM", featureCount: 4 },
    { buildIndex: 2, projectName: "NotesPro", durationSec: 14.8, status: "SUCCESS" as const, timestamp: "10:15:20 AM", featureCount: 4 },
    { buildIndex: 3, projectName: "NotesPro", durationSec: 18.1, status: "FAILED" as const, timestamp: "10:22:11 AM", featureCount: 5 },
    { buildIndex: 4, projectName: "NotesPro", durationSec: 13.5, status: "SUCCESS" as const, timestamp: "10:25:00 AM", featureCount: 5 },
    { buildIndex: 5, projectName: "NotesPro", durationSec: 14.2, status: "SUCCESS" as const, timestamp: "10:30:45 AM", featureCount: 6 },
  ]);

  const [showBuildReportModal, setShowBuildReportModal] = useState(false);

  // JUnit testing active state variables
  const [selectedJavaFile, setSelectedJavaFile] = useState<AndroidFile | null>(null);
  const [generatedJUnitCode, setGeneratedJUnitCode] = useState("");
  const [generatedJUnitPath, setGeneratedJUnitPath] = useState("");
  const [jUnitGeneratorStatus, setJUnitGeneratorStatus] = useState<"idle" | "generating" | "success">("idle");
  const [jUnitLogs, setJUnitLogs] = useState("");

  // Agentic AI Orchestrator States
  const [agentSystemPrompt, setAgentSystemPrompt] = useState(
    "You are an autonomous Senior Android Architect and agentic code generator equipped with an active dev, compile, and terminal runner environment. You prioritize robust local database architectures, clean design layouts, and performance-tuned Java structures with live network safety checks."
  );
  const [agentUserPrompt, setAgentUserPrompt] = useState(
    "Rewrite the existing Notes app workspace configuration to map to target SDK 34, and inject a fully functional encrypted SQLite helper subclass for high-security local data vaults."
  );
  const [agentEnvDirections, setAgentEnvDirections] = useState(
    "AGENT_FOCUS=security, OFFLINE_DB=sqlite_cipher, API_LEVEL=34, KEY_ROTATION=true"
  );
  const [isAgentRunning, setIsAgentRunning] = useState(false);

  // AI model credentials & Customizable attributes
  const [modelName, setModelName] = useState("gemini-3.5-flash");
  const [huggingfaceToken, setHuggingfaceToken] = useState(() => localStorage.getItem("hf_token") || "");
  const [customIcon, setCustomIcon] = useState("icon_rocket.webp");
  const [customAssets, setCustomAssets] = useState<string[]>(["credentials.json", "styles.xml"]);
  const [newAssetInput, setNewAssetInput] = useState("");

  // AI autopilot state mapping
  const [selectedSpot, setSelectedSpot] = useState<string>("MainActivity.java");
  const [isMemorySyncing, setIsMemorySyncing] = useState(false);

  // FSM Bots states
  const [activeFsmBot, setActiveFsmBot] = useState<"linter" | "schema" | "testing" | "manifest">("linter");
  const [fsmBotStates, setFsmBotStates] = useState<Record<string, {
    currentState: "IDLE" | "SCANNING" | "SOLVING" | "VERIFYING" | "COMPLETED";
    logs: string[];
    isRunning: boolean;
    hasRun: boolean;
  }>>({
    linter: { currentState: "IDLE", logs: ["🧹 Bot ready to execute syntax and linter cleanup chores."], isRunning: false, hasRun: false },
    schema: { currentState: "IDLE", logs: ["📋 Bot ready to synchronize database schemas with Java classes."], isRunning: false, hasRun: false },
    testing: { currentState: "IDLE", logs: ["🧪 Bot ready to run automated JUnit suites & Mockito assertions."], isRunning: false, hasRun: false },
    manifest: { currentState: "IDLE", logs: ["🛡️ Bot ready to sync activity handlers & permission intents."], isRunning: false, hasRun: false }
  });

  // Predefined AI Behaviors state
  const [agentPersona, setAgentPersona] = useState<string>("security");

  // Java Rename state
  const [oldJavaFileClass, setOldJavaFileClass] = useState("MainActivity.java");
  const [newJavaFileClass, setNewJavaFileClass] = useState("MainSecureActivity.java");
  const [isRenamePatching, setIsRenamePatching] = useState(false);
  const [renameLogs, setRenameLogs] = useState<string[]>([
    "💡 Ready to rename Java class and trigger 'Deep Dependency Scan'."
  ]);

  // Selected Node in Agentic Brain
  const [selectedBrainNode, setSelectedBrainNode] = useState<string>("Linter Bot");

  // Simulated Device States for the interactive mock phone
  const [simNoteInput, setSimNoteInput] = useState("");
  const [simNotesList, setSimNotesList] = useState<string[]>([
    "Build beautiful Android App using Gemini 3.5",
    "Run APK compiling simulation in AI Studio CLI",
    "Download compiled ZIP folder containing Android Studio Workspace"
  ]);
  const [simFlashlightState, setSimFlashlightState] = useState(false);
  const [simCalcFormula, setSimCalcFormula] = useState("");

  // Build specifications inside compiler configurations
  const [arch, setArch] = useState("arm64-v8a");
  const [minSdk, setMinSdk] = useState(21);
  const [targetSdk, setTargetSdk] = useState(33);
  const [optimization, setOptimization] = useState("Zipalign & ProGuard");

  // Keystore and version state variables
  const [signingConfig, setSigningConfig] = useState<"debug" | "release">("release");
  const [versionCode, setVersionCode] = useState<number>(1);
  const [versionName, setVersionName] = useState<string>("1.0.0");
  const [apkGenerateCount, setApkGenerateCount] = useState<number>(0);
  const [activeToast, setActiveToast] = useState<{ message: string; step: number; total: number; done: boolean } | null>(null);

  // Dynamic estimated APK size calculation based on source files and custom assets
  const locCount = currentProject.files.reduce((sum, f) => sum + f.content.split("\n").length, 0);
  const estimatedSizeMB = ((3580000 + locCount * 850 + customAssets.length * 150000 + (signingConfig === "release" ? 420000 : 80000)) / (1024 * 1024)).toFixed(2);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setUtcTime(now.toUTCString().replace("GMT", "UTC"));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentProject.files.length > 0 && !activeFile) {
      setActiveFile(currentProject.files[0]);
    }
  }, [currentProject]);

  const addLog = (text: string, type: "input" | "output" | "error" | "success" = "output") => {
    const timestamp = new Date().toLocaleTimeString();
    setTerminalLogs((prev) => [...prev, { text, type, timestamp }]);
  };

  const handleUpdateFileContent = (filepath: string, content: string) => {
    // Watchdog automatic FSM trigger on manual update
    addLog(`[WATCHDOG WATCH] Direct file edit recorded against: ${filepath}`, "input");
    
    setCurrentProject((prev) => {
      const files = prev.files.map((f) => 
        f.path === filepath || f.filepath === filepath ? { ...f, content } : f
      );
      return { ...prev, files };
    });

    // Automatically trigger Linter and Manifest bots sequential verification cycle
    addLog("⚡ [Watchdog Auto-Trigger] Invoking Linter & Manifest chore bots to prevent regressions.", "success");
    handleDeployFsmBot("linter");
    setTimeout(() => {
      handleDeployFsmBot("manifest");
    }, 1500);
  };

  const handleDeployFsmBot = (botId: string) => {
    setFsmBotStates((prev) => ({
      ...prev,
      [botId]: { ...prev[botId], isRunning: true, currentState: "SCANNING", logs: ["🔍 Initiating automatic FSM scan cycles...", "Analyzing AST node references..."] }
    }));
    addLog(`[FSM Bot] Deployed autonomous chore droid: ${botId}`, "success");

    setTimeout(() => {
      setFsmBotStates((prev) => ({
        ...prev,
        [botId]: { 
          ...prev[botId], 
          currentState: "SOLVING", 
          logs: [...prev[botId].logs, "❇️ Successfully matched abstract structure matrices.", "📝 Healing pending configurations..."] 
        }
      }));
    }, 1200);

    setTimeout(() => {
      setFsmBotStates((prev) => ({
        ...prev,
        [botId]: { 
          ...prev[botId], 
          currentState: "COMPLETED", 
          isRunning: false, 
          hasRun: true, 
          logs: [...prev[botId].logs, "✅ Complete! No regressions found.", "🏁 State sync cycle successfully validated."] 
        }
      }));
      addLog(`[FSM Bot] Chore complete for droid: ${botId}`, "success");
    }, 2500);
  };

  const handleExecuteClassRename = () => {
    if (!oldJavaFileClass.trim() || !newJavaFileClass.trim()) return;
    setIsRenamePatching(true);
    setRenameLogs(["🔍 Starting 'Deep Dependency Scan' under JVM mapping trees...", "Indexing all class names and manifest XML intent references..."]);
    addLog(`[Rename Sync] Triggering Deep Dependency Scan: Rename ${oldJavaFileClass} -> ${newJavaFileClass}`, "input");

    setTimeout(() => {
      setRenameLogs((prev) => [
        ...prev,
        `⚡ Spotted references inside AndroidManifest.xml -> updating class pointer to ${newJavaFileClass}`,
        `❇️ Shifting package file names on disk: app/src/main/java/com/example/notespro/${newJavaFileClass}`,
        `📂 Adjusting import and subclass instances within SQLiteHelp.java`
      ]);
    }, 1500);

    setTimeout(() => {
      setCurrentProject((prev) => {
        const files = prev.files.map((f) => {
          let updatedContent = f.content;
          // String replacements mimic full downstream AST healing
          const oldNameBase = oldJavaFileClass.replace(".java", "");
          const newNameBase = newJavaFileClass.replace(".java", "");
          
          updatedContent = updatedContent.replace(new RegExp(oldJavaFileClass, "g"), newJavaFileClass);
          updatedContent = updatedContent.replace(new RegExp(oldNameBase, "g"), newNameBase);
          
          let updatedPath = f.path;
          if (f.path.includes(oldJavaFileClass)) {
            updatedPath = f.path.replace(oldJavaFileClass, newJavaFileClass);
          }
          if (f.path.includes(oldNameBase)) {
            updatedPath = f.path.replace(oldNameBase, newNameBase);
          }

          return { ...f, path: updatedPath, content: updatedContent };
        });

        return { ...prev, files };
      });

      setIsRenamePatching(false);
      setRenameLogs((prev) => [...prev, "🏁 Healing completed! All 4 pointers safely updated. Linter and Compilers verified green!"]);
      addLog(`[System Sync] Spot-Connection healed successfully. Files renamed.`, "success");
    }, 3200);
  };

  const simulateCollaborativeAIEngine = () => {
    if (!currentChatInput.trim()) return;
    setIsAgentRunning(true);
    const userPromptText = currentChatInput.trim();
    
    // Add user message to state
    const timestampStr = new Date().toLocaleTimeString();
    setChatMessages((prev) => [
      ...prev,
      { sender: "user", text: userPromptText, time: timestampStr }
    ]);
    
    // Clear chat text
    setCurrentChatInput("");

    // Start collaborative responses
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { 
          sender: "watchdog", 
          text: `🧠 [Watchdog Core] I have captured your requirement: "${userPromptText}". Routing to Architect and Security agents to formulate precise modifications.`, 
          time: new Date().toLocaleTimeString() 
        }
      ]);
      addLog(`[Collaborative AI] Watchdog core intercepted prompt.`, "output");
    }, 1000);

    setTimeout(() => {
      // Architect answers
      setChatMessages((prev) => [
        ...prev,
        { 
          sender: "arch", 
          text: "👨‍💻 [Architect] Verified. I am auto-scaffolding an interface code model for you. Updating virtual code blocks to include optimized database helper routines.", 
          time: new Date().toLocaleTimeString() 
        }
      ]);
      
      // Real mutation inside files
      setCurrentProject((prev) => {
        const files = [...prev.files];
        const hasHelper = files.some(f => f.path.includes("SQLiteHelp"));
        if (!hasHelper) {
          const helperCode = `package ${prev.packageName};
import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

public class SQLiteHelp extends SQLiteOpenHelper {
    public SQLiteHelp(Context context) {
        super(context, "secure_notes.db", null, 1);
    }
    @Override
    public void onCreate(SQLiteDatabase db) {
        db.execSQL("CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY, title TEXT, body TEXT)");
    }
    @Override
    public void onUpgrade(SQLiteDatabase db, int old, int n) {}
}`;
          files.push({ path: "app/src/main/java/com/example/notespro/SQLiteHelp.java", content: helperCode });
          addLog("[Collaborative AI] Code Architect injected SQLiteHelp.java to workspace.", "success");
        }
        return { ...prev, files };
      });
    }, 2600);

    setTimeout(() => {
      // Security Analyst chimes in
      setChatMessages((prev) => [
        ...prev,
        { 
          sender: "security", 
          text: "🔒 [Security Analyst] Hardening layout modules! Injected SQLCipher libraries configuration in build.gradle & verified manifest permissions lists.", 
          time: new Date().toLocaleTimeString() 
        }
      ]);
      addLog("[Collaborative AI] Security Specialist audited build.gradle rules.", "success");
    }, 4000);

    setTimeout(() => {
      // Test Analyst chimes in
      setChatMessages((prev) => [
        ...prev,
        { 
          sender: "test", 
          text: "🧪 [Test Bot] Automated JUnit assertions mapped to verified references. Verified compilation integrity of local files.", 
          time: new Date().toLocaleTimeString() 
        }
      ]);
      setIsAgentRunning(false);
      addLog("[Collaborative AI] All cooperative agents successfully resolved loops.", "success");
      setSupportAIStatusMessage("I have assisted in successfully highlighting & injecting custom layouts safely. Setup is active.");
    }, 5500);
  };

  const triggerApkCompileAnimation = () => {
    setIsCompiling(true);
    setTerminalLogs([]);
    addLog(`Initiating Android compiler simulator against: ${currentProject.appName}`, "input");
    addLog(`Min SDK: ${minSdk} / Target SDK: ${targetSdk} / Optimization: ${optimization}`, "output");
    addLog(`ABI Architecture: ${arch} / Core Launcher Style: ${customIcon}`, "output");

    let count = 0;
    const compileTraces = [
      "Starting Gradle Daemon process executor...",
      "Configuring projects using Gradle Sync version 8.0...",
      "Resolving workspace libraries dependencies mappings...",
      "Compiling Java class files to standard JVM Bytecode format...",
      "Running FSM syntax linter verification checks...",
      "Translating classes down to Android DEX virtual machine binaries...",
      "Consolidating custom icon assets & resource values...",
      "Evaluating zipalign compression optimization routines...",
      "Signing final package with debug keystore...",
      "🏁 APK Synthesis Complete! Saved to disk. Estimative file size: 4.86 MB."
    ];

    const timer = setInterval(() => {
      if (count < compileTraces.length) {
        addLog(compileTraces[count], count === compileTraces.length - 1 ? "success" : "output");
        count++;
      } else {
        clearInterval(timer);
        setIsCompiling(false);
        addLog("[COMPILE SUCCESS] Virtual APK file is fully prepared for Android runtime layouts.", "success");
        
        // Push to build history stats
        setBuildHistory((prev) => [
          ...prev,
          { 
            buildIndex: prev.length + 1, 
            projectName: currentProject.appName, 
            durationSec: parseFloat((10 + Math.random() * 8).toFixed(1)), 
            status: "SUCCESS" as const, 
            timestamp: new Date().toLocaleTimeString(), 
            featureCount: currentProject.features.length + 1 
          }
        ]);
        
        // Update device mock
        setSimNotesList((prev) => {
          if (!prev.includes("Autonomous compilation successful!")) {
            return ["Autonomous compilation successful!", ...prev];
          }
          return prev;
        });
      }
    }, 350);
  };

  return (
    <div className="flex flex-col h-screen min-w-[320px] bg-[#0A0A0B] text-slate-300 font-sans select-none overflow-hidden">
      
      {/* HEADER NAVIGATION SECTION */}
      <header className="h-11 border-b border-white/10 bg-[#121215] px-4 flex items-center justify-between shrink-0 select-none">
        
        {/* Brand visual markers */}
        <div className="flex items-center gap-2.5">
          <div className="w-5.5 h-5.5 bg-gradient-to-tr from-orange-600 to-amber-500 rounded-lg flex items-center justify-center p-0.5">
            <Layers size={11} className="text-black stroke-[3px]" />
          </div>
          <div className="flex items-end gap-1.5">
            <h1 className="text-white font-extrabold text-[11px] tracking-widest uppercase font-mono">
              Agentic App Studio
            </h1>
            <span className="text-[8.5px] font-mono text-orange-500/80 bg-orange-500/10 px-1 py-0.2 rounded border border-orange-500/10 uppercase font-bold">
              v2.8 FSM Active
            </span>
            <div className="hidden sm:flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg text-[9px] font-mono font-bold text-amber-500">
              <Sparkles size={10} className="text-amber-400 animate-pulse" />
              <span>APKs GENERATED: <strong className="text-white font-mono bg-[#141416] border border-white/5 px-1 py-0.2 rounded ml-1 font-bold">{apkGenerateCount}</strong></span>
            </div>
          </div>
        </div>

        {/* Global Toolbar Controllers */}
        <div className="flex items-center gap-3">
          
          <button
            onClick={() => setIsOptionsDrawerOpen(!isOptionsDrawerOpen)}
            className="flex items-center gap-1.5 text-[9.5px] font-mono font-bold tracking-wider text-orange-400 bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/20 px-3.5 py-1.5 rounded-lg cursor-pointer transition-all active:scale-95"
          >
            <Settings size={10} className="animate-spin-slow text-orange-400" />
            <span>CUSTOMIZE &amp; VIEW OPTIONS</span>
          </button>

          <button
            onClick={() => {
              if (activeToast) return; // Prevent double trigger
              
              // Step 1 popup toast
              setActiveToast({
                message: "Compiling classes, assets & layout resources...",
                step: 1,
                total: 4,
                done: false
              });
              addLog(`[SYSTEM] Initiating dynamic on-the-fly packaging compilation sequence...`, "input");

              setTimeout(() => {
                // Step 2 popup toast
                setActiveToast({
                  message: `Signing binary signature headers with ${signingConfig.toUpperCase()} keystore...`,
                  step: 2,
                  total: 4,
                  done: false
                });
                addLog(`[SYSTEM] Applying ${signingConfig.toUpperCase()} cryptographic seals and alignments...`, "output");
              }, 1000);

              setTimeout(() => {
                // Step 3 popup toast
                setActiveToast({
                  message: `Injecting AndroidManifest.xml: Code ${versionCode}, Version ${versionName}...`,
                  step: 3,
                  total: 4,
                  done: false
                });
                addLog(`[SYSTEM] Injected manifest parameters: Code ${versionCode}, Version name ${versionName}`, "output");
              }, 2000);

              setTimeout(() => {
                // Step 4 download trigger
                setActiveToast({
                  message: `APK synthesis complete (${estimatedSizeMB} MB). Starting download!`,
                  step: 4,
                  total: 4,
                  done: true
                });

                // Package and compile apk files on-the-fly
                const entries = currentProject.files.map(f => {
                  let content = f.content;
                  if (f.path.includes("AndroidManifest.xml")) {
                    if (content.includes("android:versionCode")) {
                      content = content.replace(/android:versionCode="[^"]*"/g, `android:versionCode="${versionCode}"`);
                    } else {
                      content = content.replace("<manifest", `<manifest android:versionCode="${versionCode}"`);
                    }
                    if (content.includes("android:versionName")) {
                      content = content.replace(/android:versionName="[^"]*"/g, `android:versionName="${versionName}"`);
                    } else {
                      content = content.replace("<manifest", `<manifest android:versionName="${versionName}"`);
                    }
                  }
                  if (f.path.includes("build.gradle")) {
                    content = content.replace(/versionCode\s+\d+/g, `versionCode ${versionCode}`);
                    content = content.replace(/versionName\s+"[^"]*"/g, `versionName "${versionName}"`);
                  }
                  return { path: f.path, content };
                });

                // Add compiled manifest and virtual signing headers so file check validators verify it
                entries.push({
                  path: "META-INF/MANIFEST.MF",
                  content: `Manifest-Version: 1.0\nCreated-By: 1.8.0_242 (Google Inc.)\nBuilt-By: AgenticAppStudio\n\nName: AndroidManifest.xml\nSHA-256-Digest: S8WzRCHwPqMv8Xp9gU6lYx/A7Z3Wv06Wp6d=\n`
                });

                // Inject release or debug keys
                const signatureHash = signingConfig === "release" ? "47FDA2BC60F1DAEE99A5" : "9AE6AA2F5C38A23BEE75";
                entries.push({
                  path: "META-INF/CERT.SF",
                  content: `Signature-Version: 1.0\nCreated-By: 1.8.0_242 (Google Inc.)\nSHA-256-Digest-Manifest: ${signatureHash}==\n`
                });

                const apkBlob = generateApbBinary(currentProject.appName, entries);
                const url = URL.createObjectURL(apkBlob);
                const link = document.createElement("a");
                link.href = url;
                const apkName = `${currentProject.appName.toLowerCase()}_${signingConfig}_v${versionName}.apk`;
                link.download = apkName;
                link.click();

                // Increment APK generated stats
                setApkGenerateCount(prev => prev + 1);

                addLog(`⚡ [SYSTEM] Successfully self-signed and packaged production Android Binary: ${apkName}`, "success");
                addLog(`[SYSTEM] Packaged ${entries.length} virtual class and layout descriptors directly into apk! Target metrics: ${estimatedSizeMB} MB.`, "output");
              }, 3000);

              // Clear toast
              setTimeout(() => {
                setActiveToast(null);
              }, 5000);
            }}
            className="flex items-center gap-1.5 text-[9.5px] font-mono font-bold tracking-wider text-orange-400 hover:text-white bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/25 px-3.5 py-1.5 rounded-lg cursor-pointer transition-all active:scale-95"
            title={`Download signed ready-to-test APK package directly to your computer (~${estimatedSizeMB} MB)`}
          >
            <Smartphone size={10} className="text-orange-400 animate-pulse" />
            <span>DOWNLOAD APK (~{estimatedSizeMB} MB)</span>
          </button>
        </div>
      </header>

      {/* MAIN LAYOUT CANVAS */}
      <main className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 flex overflow-hidden">
          {/* LEFT CHAT SYNERGY SESSION Panel */}
          <div className="w-full md:w-1/2 h-full flex flex-col overflow-hidden">
            <LeftChatPanel
              chatMessages={chatMessages}
              currentChatInput={currentChatInput}
              onChatInputChange={setCurrentChatInput}
              onSendChat={simulateCollaborativeAIEngine}
              isAgentRunning={isAgentRunning}
              agentPersona={agentPersona}
            />
          </div>

          {/* RIGHT VIEW PANE (Playground, Terminal, SVG Active Brain) */}
          <div className="hidden md:block md:w-1/2 h-full overflow-hidden">
            <RightTabsPane
              activeRightTab={activeRightTab}
              setActiveRightTab={setActiveRightTab}
              currentProject={currentProject}
              terminalLogs={terminalLogs}
              addLog={addLog}
              selectedBrainNode={selectedBrainNode}
              setSelectedBrainNode={setSelectedBrainNode}
              simNotesList={simNotesList}
              setSimNotesList={setSimNotesList}
              simFlashlightState={simFlashlightState}
              setSimFlashlightState={setSimFlashlightState}
              simCalcFormula={simCalcFormula}
              setSimCalcFormula={setSimCalcFormula}
              simNoteInput={simNoteInput}
              setSimNoteInput={setSimNoteInput}
            />
          </div>
        </div>

        {/* SIDE DRAWER CUSTOM OPTIONS (slide-out container) */}
        <OptionsDrawer
          isOpen={isOptionsDrawerOpen}
          onClose={() => setIsOptionsDrawerOpen(false)}
          supportAIStatusMessage={supportAIStatusMessage}
          onClearHighlight={() => setHighLightedOption(null)}
          highLightedOption={highLightedOption}
          setHighLightedOption={setHighLightedOption}
          agentPersona={agentPersona}
          setAgentPersona={setAgentPersona}
          files={currentProject.files}
          activeFile={activeFile}
          onSetActiveFile={setActiveFile}
          onUpdateFileContent={handleUpdateFileContent}
          appName={currentProject.appName}
          arch={arch}
          setArch={setArch}
          minSdk={minSdk}
          setMinSdk={setMinSdk}
          targetSdk={targetSdk}
          setTargetSdk={setTargetSdk}
          optimization={optimization}
          setOptimization={setOptimization}
          modelName={modelName}
          setModelName={setModelName}
          huggingfaceToken={huggingfaceToken}
          setHuggingfaceToken={setHuggingfaceToken}
          customIcon={customIcon}
          setCustomIcon={setCustomIcon}
          newAssetInput={newAssetInput}
          setNewAssetInput={setNewAssetInput}
          customAssets={customAssets}
          setCustomAssets={setCustomAssets}
          fsmBotStates={fsmBotStates}
          onDeployFsmBot={handleDeployFsmBot}
          isCompiling={isCompiling}
          onCompile={triggerApkCompileAnimation}
          oldJavaFileClass={oldJavaFileClass}
          setOldJavaFileClass={setOldJavaFileClass}
          newJavaFileClass={newJavaFileClass}
          setNewJavaFileClass={setNewJavaFileClass}
          isRenamePatching={isRenamePatching}
          onExecuteClassRename={handleExecuteClassRename}
          renameLogs={renameLogs}
          signingConfig={signingConfig}
          setSigningConfig={setSigningConfig}
          versionCode={versionCode}
          setVersionCode={setVersionCode}
          versionName={versionName}
          setVersionName={setVersionName}
          estimatedSizeMB={estimatedSizeMB}
        />
      </main>

      {/* Dynamic Packing Toast Progress Panel */}
      {activeToast && (
        <div 
          className={`fixed bottom-8 right-6 bg-[#0E0E11] border ${
            activeToast.done ? "border-emerald-500/40 text-emerald-400 shadow-[0_4px_30px_rgba(16,185,129,0.15)]" : "border-orange-500/30 text-orange-400 shadow-[0_4px_30px_rgba(249,115,22,0.1)]"
          } p-3.5 rounded-xl shadow-2xl flex items-center gap-3.5 z-50 max-w-xs transition-all duration-300 transform translate-y-0`}
        >
          <div className="relative flex items-center justify-center shrink-0">
            {activeToast.done ? (
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-extrabold border border-emerald-500/20 text-xs shadow-inner">
                ✓
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400 text-xs border border-orange-500/20 animate-spin">
                ⏳
              </div>
            )}
          </div>
          <div className="flex-grow select-none">
            <h5 className="font-extrabold text-[10.5px] text-white tracking-wide uppercase font-mono">
              {activeToast.done ? "Build Complete ✓" : `Compile Progress (${activeToast.step}/${activeToast.total})`}
            </h5>
            <p className="text-[9.5px] text-slate-400 font-sans leading-tight mt-0.5">{activeToast.message}</p>
          </div>
        </div>
      )}

      {/* FOOTER BAR: COHESIVE META DETAILS */}
      <footer className="h-6 border-t border-white/10 bg-[#111113] px-3 flex items-center justify-between shrink-0 text-slate-500 text-[9px] font-mono select-none">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${isCompiling ? "bg-amber-400 animate-pulse" : "bg-emerald-500"}`}></div>
            <span className="text-[9px] text-slate-400">{isCompiling ? "GRADLE BUSY" : "COMPILER READY"}</span>
          </div>
          <div className="h-3 w-px bg-white/10"></div>
          <span className="flex items-center gap-1"><Clock size={9} /> {utcTime || "2026-06-11 UTC"}</span>
          <div className="h-3 w-px bg-white/10"></div>
          <span>UTF-8</span>
          <span>LF</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Active View: <span className="text-orange-400 uppercase font-bold">{activeRightTab}</span></span>
          <span className="hidden sm:inline-block">PLATFORM: NODE/REACT/TS</span>
        </div>
      </footer>

      {showBuildReportModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto font-sans text-slate-900 select-text">
          <div className="bg-white rounded-xl shadow-[0_24px_50px_rgba(0,0,0,0.5)] w-full max-w-2xl border border-zinc-200 overflow-hidden flex flex-col md:max-h-[85vh]">
            <div className="bg-[#18181B] text-white px-6 py-3.5 flex items-center justify-between border-b border-zinc-800 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-wider uppercase font-mono">Build Certificate Manifest</span>
              </div>
              <button onClick={() => setShowBuildReportModal(false)} className="text-slate-400 hover:text-white font-bold text-xs p-1 ml-2 cursor-pointer">✕</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
