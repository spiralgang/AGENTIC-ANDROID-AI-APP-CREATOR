import React, { useState, useEffect, useRef } from "react";
import { Folder, File, Code, Save, Play, Search, Replace, RefreshCw, FileText } from "lucide-react";
import { AndroidFile } from "../types";

// Lightweight regex-based syntax highlighter for XML and Java
export function highlightCode(code: string, filepath: string): string {
  if (!code) return "";
  const isXml = filepath.endsWith(".xml") || filepath.endsWith(".html");
  const isJava = filepath.endsWith(".java") || filepath.endsWith(".kt") || filepath.endsWith(".gradle");
  
  // 1. Always escape HTML first to prevent security issues and code execution
  let escaped = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  
  if (isXml) {
    // Comments: &lt;!-- ... --&gt;
    escaped = escaped.replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="text-green-500 font-normal italic">$1</span>');
    
    // Tag boundaries and names begin with < or </ and end with >
    escaped = escaped.replace(/(&lt;\/?[a-zA-Z0-9_\.\:\-]+)/g, '<span class="text-sky-400 font-bold">$1</span>');
    escaped = escaped.replace(/(\/?&gt;)/g, '<span class="text-sky-400 font-bold">$1</span>');
    
    // Attributes: key=
    escaped = escaped.replace(/(\s+[a-zA-Z0-9_:\-]+=)/g, '<span class="text-amber-400 font-medium">$1</span>');
    
    // Attribute values in double quotes
    escaped = escaped.replace(/(&quot;[\s\S]*?&quot;)/g, '<span class="text-emerald-400">$1</span>');
    
    return escaped;
  }

  if (isJava) {
    // Strings in double quotes placeholder to prevent coloring keywords inside them
    const strings: string[] = [];
    escaped = escaped.replace(/(&quot;[\s\S]*?&quot;)/g, (match) => {
      const id = `___STRING_PLACEHOLDER_${strings.length}___`;
      strings.push(match);
      return id;
    });

    // Multi-line and single-line Java comments placeholders
    const comments: string[] = [];
    escaped = escaped.replace(/(\/\*[\s\S]*?\*\/)/g, (match) => {
      const id = `___MCOMMENT_PLACEHOLDER_${comments.length}___`;
      comments.push(match);
      return id;
    });

    escaped = escaped.replace(/(\/\/.*)/g, (match) => {
      const id = `___SCOMMENT_PLACEHOLDER_${comments.length}___`;
      comments.push(match);
      return id;
    });

    // Keywords
    const keywords = [
      "package", "import", "public", "private", "protected", "class", "extends", 
      "implements", "void", "int", "String", "boolean", "new", "return", "if", 
      "else", "for", "while", "super", "this", "try", "catch", "final", "static",
      "override", "double", "float", "char", "long", "short", "byte", "break", "continue"
    ];
    
    keywords.forEach(kw => {
      const regex = new RegExp(`\\b(${kw})\\b`, 'g');
      escaped = escaped.replace(regex, '<span class="text-orange-400 font-semibold">$1</span>');
    });

    // Annotations: @Override, @NonNull, etc.
    escaped = escaped.replace(/(@[a-zA-Z0-9_]+)/g, '<span class="text-yellow-400 font-medium font-semibold">$1</span>');

    // Class name matches (starting with capital letter)
    escaped = escaped.replace(/\b([A-Z][a-zA-Z0-9_]+)\b/g, '<span class="text-cyan-400 font-medium">$1</span>');

    // Numbers
    escaped = escaped.replace(/\b(\d+)\b/g, '<span class="text-amber-300">$1</span>');

    // Restore comments and strings
    comments.forEach((comment, idx) => {
      const mId = `___MCOMMENT_PLACEHOLDER_${idx}___`;
      const sId = `___SCOMMENT_PLACEHOLDER_${idx}___`;
      escaped = escaped.replace(new RegExp(mId, 'g'), `<span class="text-green-500 font-normal italic">${comment}</span>`);
      escaped = escaped.replace(new RegExp(sId, 'g'), `<span class="text-green-500 font-normal italic">${comment}</span>`);
    });

    strings.forEach((str, idx) => {
      const id = `___STRING_PLACEHOLDER_${idx}___`;
      escaped = escaped.replace(new RegExp(id, 'g'), `<span class="text-emerald-400">${str}</span>`);
    });

    return escaped;
  }

  return escaped;
}

interface WorkspaceExplorerProps {
  files: AndroidFile[];
  activeFile: AndroidFile | null;
  onSetActiveFile: (file: AndroidFile) => void;
  onUpdateFileContent: (path: string, content: string) => void;
  onCompile: () => void;
  isCompiling: boolean;
  appName: string;
}

export default function WorkspaceExplorer({
  files,
  activeFile,
  onSetActiveFile,
  onUpdateFileContent,
  onCompile,
  isCompiling,
  appName,
}: WorkspaceExplorerProps) {
  const [editorText, setEditorText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [replaceQuery, setReplaceQuery] = useState("");
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [isSaved, setIsSaved] = useState(true);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  // Sync editor with active file
  useEffect(() => {
    if (activeFile) {
      setEditorText(activeFile.content);
      setIsSaved(true);
    } else if (files.length > 0) {
      onSetActiveFile(files[0]);
    }
  }, [activeFile, files]);

  // Handle bidirectional scroll locking
  const handleScroll = () => {
    if (textareaRef.current) {
      if (preRef.current) {
        preRef.current.scrollTop = textareaRef.current.scrollTop;
        preRef.current.scrollLeft = textareaRef.current.scrollLeft;
      }
      if (lineNumbersRef.current) {
        lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
      }
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditorText(e.target.value);
    setIsSaved(false);
  };

  const handleSave = () => {
    if (activeFile) {
      onUpdateFileContent(activeFile.path, editorText);
      setIsSaved(true);
    }
  };

  const executeReplace = () => {
    if (!searchQuery) return;
    const re = new RegExp(searchQuery.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "g");
    const updated = editorText.replace(re, replaceQuery);
    setEditorText(updated);
    setIsSaved(false);
  };

  // Group files into simulated folder hierarchies
  const groupedFolders: { [key: string]: AndroidFile[] } = {};
  files.forEach((file) => {
    const parts = file.path.split("/");
    const folderName = parts.slice(0, parts.length - 1).join("/") || "root";
    if (!groupedFolders[folderName]) {
      groupedFolders[folderName] = [];
    }
    groupedFolders[folderName].push(file);
  });

  return (
    <div className="flex flex-col md:flex-row h-full rounded-xl border border-white/10 bg-[#0A0A0B] shadow-lg overflow-hidden min-h-[500px]">
      {/* File Tree Left Rail */}
      <div className="w-full md:w-64 bg-[#0C0C0E] border-r border-white/10 flex flex-col shrink-0 text-slate-300 select-none">
        <div className="p-4 bg-black/40 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Folder className="text-orange-400 w-5 h-5 fill-orange-400/10" />
            <span className="font-bold text-xs tracking-wider text-white uppercase truncate">
              {appName ? `${appName}_Workspace` : "AndroidProject"}
            </span>
          </div>
          <span className="text-[10px] bg-orange-600 px-2 py-0.5 rounded text-white font-medium">
            SDK v34
          </span>
        </div>

        {/* Directory Explorer Scroll List */}
        <div className="flex-grow p-2 overflow-y-auto space-y-4 text-xs scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {Object.entries(groupedFolders).map(([folder, folderFiles]) => (
            <div key={folder} className="space-y-1">
              <div className="flex items-center space-x-1.5 px-2 py-1 text-slate-400 font-semibold cursor-pointer hover:text-slate-200 transition-colors">
                <Folder size={14} className="text-yellow-500 fill-yellow-500/10 shrink-0" />
                <span className="truncate">{folder === "root" ? "App Structure" : folder}</span>
              </div>
              <div className="pl-4 space-y-0.5 border-l border-white/10 ml-3 py-1">
                {folderFiles.map((f) => {
                  const isActive = activeFile?.path === f.path;
                  const parts = f.path.split("/");
                  const filename = parts[parts.length - 1];
                  return (
                    <button
                      key={f.path}
                      onClick={() => onSetActiveFile(f)}
                      className={`w-full text-left flex items-center space-x-1.5 px-2 py-1.5 rounded transition-colors group cursor-pointer ${
                        isActive
                          ? "bg-orange-600 text-white font-medium"
                          : "text-slate-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <File size={13} className={isActive ? "text-white shrink-0" : "text-slate-500 shrink-0 group-hover:text-slate-300"} />
                      <span className="truncate text-[11px]">{filename}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Compile trigger rail button */}
        <div className="p-3 bg-black/60 border-t border-white/10">
          <button
            onClick={onCompile}
            disabled={isCompiling}
            className={`w-full flex items-center justify-center space-x-1.5 p-2 rounded text-xs select-none font-bold text-white shadow-md transition-all cursor-pointer ${
              isCompiling
                ? "bg-slate-700 cursor-not-allowed"
                : "bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 hover:shadow-orange-500/10 active:scale-95"
            }`}
          >
            {isCompiling ? (
              <>
                <RefreshCw size={13} className="animate-spin" />
                <span>COMPILING APK...</span>
              </>
            ) : (
              <>
                <Play size={13} className="fill-white" />
                <span>SIMULATE APK BUILD</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Editor Right Workspace */}
      <div className="flex-grow flex flex-col bg-[#0A0A0B] relative min-w-0">
        {activeFile ? (
          <>
            {/* Editor Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 bg-[#111113] border-b border-white/10 shrink-0 gap-2">
              <div className="min-w-0">
                <div className="flex items-center space-x-2 text-white font-semibold text-xs truncate">
                  <Code size={14} className="text-slate-500 shrink-0" />
                  <span className="truncate">{activeFile.path}</span>
                  {!isSaved && (
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0 animate-pulse" title="Unsaved changes"></span>
                  )}
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                  Edit XML layout controls, Java methods, or project scripts here.
                </p>
              </div>

              <div className="flex items-center space-x-2 self-start sm:self-auto shrink-0">
                {/* Search replace trigger */}
                <button
                  onClick={() => setShowFindReplace(!showFindReplace)}
                  className={`p-1.5 rounded border text-slate-300 transition-colors cursor-pointer ${
                    showFindReplace ? "bg-orange-500/10 border-orange-500/25 text-orange-400" : "border-white/10 hover:bg-white/5"
                  }`}
                  title="Find & Replace"
                >
                  <Search size={14} />
                </button>

                {/* Save button */}
                <button
                  onClick={handleSave}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-semibold shadow-sm transition-all cursor-pointer ${
                    isSaved
                      ? "bg-white/5 text-slate-500 border border-white/5 cursor-default"
                      : "bg-emerald-600 hover:bg-emerald-500 text-white hover:shadow-emerald-500/10 active:scale-95"
                  }`}
                >
                  <Save size={13} />
                  <span>{isSaved ? "Saved" : "Save Changes"}</span>
                </button>
              </div>
            </div>

            {/* Find & Replace Bar */}
            {showFindReplace && (
              <div className="bg-[#111113] border-b border-white/10 p-2.5 flex flex-wrap gap-2 items-center shrink-0">
                <div className="relative flex-grow max-w-xs">
                  <span className="absolute left-2.5 top-2 text-slate-500"><Search size={12} /></span>
                  <input
                    type="text"
                    placeholder="Find expression..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-7 pr-3 py-1 text-xs rounded border border-white/10 focus:outline-none focus:border-orange-500 bg-black/40 text-white"
                  />
                </div>
                <div className="relative flex-grow max-w-xs">
                  <span className="absolute left-2.5 top-2 text-slate-500"><Replace size={12} /></span>
                  <input
                    type="text"
                    placeholder="Replace with..."
                    value={replaceQuery}
                    onChange={(e) => setReplaceQuery(e.target.value)}
                    className="w-full pl-7 pr-3 py-1 text-xs rounded border border-white/10 focus:outline-none focus:border-orange-500 bg-black/40 text-white"
                  />
                </div>
                <button
                  onClick={executeReplace}
                  className="px-2.5 py-1 bg-orange-600 hover:bg-orange-500 text-black font-extrabold rounded text-xs transition-colors cursor-pointer"
                >
                  Replace All
                </button>
              </div>
            )}

            {/* Code Text Grid */}
            <div className="flex-grow flex overflow-hidden min-h-[350px]">
              {/* Line Numbers column */}
              <div 
                ref={lineNumbersRef}
                className="w-12 bg-black/20 border-r border-white/5 text-slate-600 text-right pr-2.5 py-4 font-mono text-[11px] leading-6 select-none shrink-0 overflow-hidden h-full"
              >
                {editorText.split("\n").map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>

              {/* Editing Area Container */}
              <div className="flex-grow relative h-full overflow-hidden">
                <textarea
                  ref={textareaRef}
                  onScroll={handleScroll}
                  value={editorText}
                  onChange={handleTextChange}
                  className="absolute inset-0 w-full h-full p-4 bg-transparent text-transparent caret-white font-mono text-xs leading-6 focus:outline-none resize-none overflow-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent z-10 whitespace-pre"
                  spellCheck="false"
                  autoCapitalize="off"
                  autoComplete="off"
                  autoCorrect="off"
                />
                
                {/* Syntax Highlighted Overlay */}
                <pre
                  ref={preRef}
                  className="absolute inset-0 w-full h-full p-4 bg-[#0A0A0B] font-mono text-xs leading-6 overflow-hidden pointer-events-none whitespace-pre text-slate-300"
                  dangerouslySetInnerHTML={{ __html: highlightCode(editorText, activeFile.path) }}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center p-8 text-center bg-[#0C0C0E]">
            <div className="p-4 bg-white/5 border border-white/10 rounded-full text-slate-500 mb-3 animate-pulse">
              <FileText size={32} />
            </div>
            <h4 className="font-bold text-slate-300 text-sm">No Active File</h4>
            <p className="text-xs text-slate-500 max-w-xs mt-1">
              Construct a project using CLI prompts or select a file in the workspace list to edit its raw manifest or classes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
