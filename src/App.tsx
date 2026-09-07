import { useState } from "react";
import { FileCode, FolderOpen, Copy, Check, ChevronRight, ChevronDown } from "lucide-react";

interface FileItem {
  name: string;
  path: string;
  language: string;
  content: string;
}

const files: FileItem[] = [
  {
    name: "App.tsx",
    path: "src/App.tsx",
    language: "tsx",
    content: [
      'import { useState } from "react";',
      'import { FileCode, FolderOpen, Copy, Check, ChevronRight, ChevronDown } from "lucide-react";',
      '',
      'interface FileItem {',
      '  name: string;',
      '  path: string;',
      '  language: string;',
      '  content: string;',
      '}',
      '',
      'const files: FileItem[] = [',
      '  // ... file definitions',
      '];',
      '',
      'export default function App() {',
      '  const [activeFile, setActiveFile] = useState(0);',
      '  const [copied, setCopied] = useState(false);',
      '  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({',
      '    src: true,',
      '  });',
      '',
      '  const handleCopy = () => {',
      '    navigator.clipboard.writeText(files[activeFile].content);',
      '    setCopied(true);',
      '    setTimeout(() => setCopied(false), 2000);',
      '  };',
      '',
      '  const toggleFolder = (folder: string) => {',
      '    setExpandedFolders((prev) => ({ ...prev, [folder]: !prev[folder] }));',
      '  };',
      '',
      '  return (',
      '    <div className="h-screen flex flex-col bg-gray-950 text-gray-100">',
      '      {/* Header */}',
      '      <header className="bg-gray-900 border-b border-gray-800 px-4 py-3">',
      '        <h1 className="text-lg font-semibold">Code Viewer</h1>',
      '      </header>',
      '      {/* ... rest of component */}',
      '    </div>',
      '  );',
      '}',
    ].join('\n'),
  },
  {
    name: "main.tsx",
    path: "src/main.tsx",
    language: "tsx",
    content: [
      'import React from "react";',
      'import ReactDOM from "react-dom/client";',
      'import "./index.css";',
      'import App from "./App.tsx";',
      '',
      'ReactDOM.createRoot(document.getElementById("root")!).render(<App />);',
    ].join('\n'),
  },
  {
    name: "index.css",
    path: "src/index.css",
    language: "css",
    content: '@import "tailwindcss";',
  },
  {
    name: "index.html",
    path: "index.html",
    language: "html",
    content: [
      '<!doctype html>',
      '<html lang="zh-CN">',
      '  <head>',
      '    <meta charset="UTF-8" />',
      '    <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
      '    <title>Code Viewer - Tampilan Kode Aplikasi</title>',
      '    <link',
      '      rel="stylesheet"',
      '      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"',
      '    />',
      '    <style>',
      '      html, body {',
      '        margin: 0;',
      '        padding: 0;',
      '        width: 100%;',
      '        height: 100%;',
      '      }',
      '      html.light, html.light body {',
      '        background-color: #ffffff !important;',
      '        color: #000000;',
      '      }',
      '      html.dark, html.dark body {',
      '        background-color: #1a1a1a !important;',
      '        color: #ffffff;',
      '      }',
      '    </style>',
      '  </head>',
      '  <body>',
      '    <div id="root"></div>',
      '    <script type="module" src="/src/main.tsx"></script>',
      '  </body>',
      '</html>',
    ].join('\n'),
  },
  {
    name: "package.json",
    path: "package.json",
    language: "json",
    content: [
      '{',
      '  "name": "sandbox-workspace",',
      '  "private": true,',
      '  "type": "module",',
      '  "scripts": {',
      '    "dev": "vite",',
      '    "build": "vite build",',
      '    "typecheck": "tsc --noEmit"',
      '  },',
      '  "dependencies": {',
      '    "@dnd-kit/core": "^6.1.0",',
      '    "@dnd-kit/sortable": "^8.0.0",',
      '    "@dnd-kit/utilities": "^3.2.2",',
      '    "@supabase/supabase-js": "^2.98.0",',
      '    "canvas-confetti": "^1.9.3",',
      '    "date-fns": "^2.30.0",',
      '    "framer-motion": "^11.16.1",',
      '    "lucide-react": "^0.294.0",',
      '    "react": "^18.2.0",',
      '    "react-dom": "^18.2.0",',
      '    "react-router-dom": "^6.8.0",',
      '    "recharts": "^2.10.0",',
      '    "uuid": "^9.0.1"',
      '  },',
      '  "devDependencies": {',
      '    "@tailwindcss/vite": "^4.1.7",',
      '    "@types/canvas-confetti": "^1.6.4",',
      '    "@types/react": "^18.2.0",',
      '    "@types/react-dom": "^18.2.0",',
      '    "@types/uuid": "^9.0.7",',
      '    "@vitejs/plugin-react": "^4.3.4",',
      '    "tailwindcss": "^4.1.7",',
      '    "typescript": "^5.7.0",',
      '    "vite": "^6.3.5"',
      '  }',
      '}',
    ].join('\n'),
  },
  {
    name: "vite.config.js",
    path: "vite.config.js",
    language: "javascript",
    content: [
      'import { defineConfig } from "vite";',
      'import react from "@vitejs/plugin-react";',
      'import tailwindcss from "@tailwindcss/vite";',
      '',
      'export default defineConfig({',
      '  plugins: [react(), tailwindcss()],',
      '  server: {',
      '    host: "0.0.0.0",',
      '    port: 3000,',
      '    strictPort: true,',
      '    hmr: {',
      '      port: 3000,',
      '    },',
      '  },',
      '});',
    ].join('\n'),
  },
  {
    name: "tsconfig.json",
    path: "tsconfig.json",
    language: "json",
    content: [
      '{',
      '  "compilerOptions": {',
      '    "target": "ES2020",',
      '    "module": "ESNext",',
      '    "lib": ["ES2020", "DOM", "DOM.Iterable"],',
      '    "jsx": "react-jsx",',
      '    "moduleResolution": "bundler",',
      '    "strict": true,',
      '    "skipLibCheck": true,',
      '    "esModuleInterop": true,',
      '    "isolatedModules": true,',
      '    "noEmit": true,',
      '    "allowImportingTsExtensions": true',
      '  },',
      '  "include": ["src"]',
      '}',
    ].join('\n'),
  },
];

export default function App() {
  const [activeFile, setActiveFile] = useState(0);
  const [copied, setCopied] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    src: true,
    root: true,
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(files[activeFile].content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleFolder = (folder: string) => {
    setExpandedFolders((prev) => ({ ...prev, [folder]: !prev[folder] }));
  };

  const srcFiles = files.filter((f) => f.path.startsWith("src/"));
  const rootFiles = files.filter((f) => !f.path.startsWith("src/"));

  return (
    <div className="h-screen flex flex-col bg-gray-950 text-gray-100 overflow-hidden">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <FileCode className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Code Viewer
          </h1>
        </div>
        <span className="text-gray-600">|</span>
        <span className="text-gray-400 text-sm hidden sm:block">Tampilan Kode Aplikasi</span>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
            {files.length} files
          </span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900/80 border-r border-gray-800 overflow-y-auto shrink-0">
          <div className="p-3">
            <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wider mb-3 font-medium">
              <FolderOpen className="w-3.5 h-3.5" />
              Explorer
            </div>

            {/* Root files */}
            <div className="space-y-0.5">
              <div
                className="flex items-center gap-1 px-2 py-1 rounded cursor-pointer hover:bg-gray-800 text-sm"
                onClick={() => toggleFolder("root")}
              >
                {expandedFolders.root ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
                <span className="text-gray-300 font-medium text-xs">root</span>
              </div>

              {expandedFolders.root &&
                rootFiles.map((file) => {
                  const fileIndex = files.indexOf(file);
                  return (
                    <div
                      key={file.path}
                      className={`flex items-center gap-2 pl-7 pr-2 py-1.5 rounded cursor-pointer text-sm transition-all duration-150 ${
                        activeFile === fileIndex
                          ? "bg-blue-500/15 text-blue-300 border-l-2 border-blue-400"
                          : "text-gray-400 hover:bg-gray-800/70 hover:text-gray-200"
                      }`}
                      onClick={() => setActiveFile(fileIndex)}
                    >
                      <FileIcon name={file.name} />
                      <span className="truncate">{file.name}</span>
                    </div>
                  );
                })}
            </div>

            {/* src folder */}
            <div className="mt-3 space-y-0.5">
              <div
                className="flex items-center gap-1 px-2 py-1 rounded cursor-pointer hover:bg-gray-800 text-sm"
                onClick={() => toggleFolder("src")}
              >
                {expandedFolders.src ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
                <span className="text-gray-300 font-medium text-xs">src</span>
              </div>

              {expandedFolders.src &&
                srcFiles.map((file) => {
                  const fileIndex = files.indexOf(file);
                  return (
                    <div
                      key={file.path}
                      className={`flex items-center gap-2 pl-7 pr-2 py-1.5 rounded cursor-pointer text-sm transition-all duration-150 ${
                        activeFile === fileIndex
                          ? "bg-blue-500/15 text-blue-300 border-l-2 border-blue-400"
                          : "text-gray-400 hover:bg-gray-800/70 hover:text-gray-200"
                      }`}
                      onClick={() => setActiveFile(fileIndex)}
                    >
                      <FileIcon name={file.name} />
                      <span className="truncate">{file.name}</span>
                    </div>
                  );
                })}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* File Tab Bar */}
          <div className="bg-gray-900/50 border-b border-gray-800 px-4 py-2 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <FileIcon name={files[activeFile].name} />
              <span className="text-sm text-gray-300 truncate">
                {files[activeFile].path}
              </span>
              <span className="text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded-full shrink-0">
                {files[activeFile].content.split("\n").length} lines
              </span>
              <span className="text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded-full shrink-0">
                {files[activeFile].language}
              </span>
            </div>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-all duration-200 shrink-0 ${
                copied
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Salin</span>
                </>
              )}
            </button>
          </div>

          {/* Code Display */}
          <div className="flex-1 overflow-auto bg-gray-950">
            <pre className="text-sm leading-6 font-mono">
              <code>
                {files[activeFile].content.split("\n").map((line, i) => (
                  <div
                    key={i}
                    className="flex hover:bg-gray-800/30 transition-colors group"
                  >
                    <span className="inline-block w-14 text-right pr-4 text-gray-700 select-none border-r border-gray-800/50 mr-4 group-hover:text-gray-500 shrink-0">
                      {i + 1}
                    </span>
                    <span className="flex-1 whitespace-pre-wrap break-all">
                      <CodeLine line={line} language={files[activeFile].language} />
                    </span>
                  </div>
                ))}
              </code>
            </pre>
          </div>
        </main>
      </div>
    </div>
  );
}

function FileIcon({ name }: { name: string }) {
  const ext = name.split(".").pop()?.toLowerCase();
  let icon = "📄";

  switch (ext) {
    case "tsx":
    case "ts":
      icon = "⚛️";
      break;
    case "css":
      icon = "🎨";
      break;
    case "html":
      icon = "🌐";
      break;
    case "json":
      icon = "📋";
      break;
    case "js":
      icon = "⚡";
      break;
  }

  return <span className="text-xs">{icon}</span>;
}

function CodeLine({ line, language }: { line: string; language: string }) {
  const highlighted = highlightSyntax(line, language);
  return <span dangerouslySetInnerHTML={{ __html: highlighted }} />;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function highlightSyntax(line: string, _language: string): string {
  let result = escapeHtml(line);

  // Store strings and replace with placeholders
  const strings: string[] = [];
  
  // Double-quoted strings
  result = result.replace(/"([^"\\]|\\.)*"/g, (match) => {
    strings.push(`<span class="text-green-400">${match}</span>`);
    return `__STR${strings.length - 1}__`;
  });
  
  // Single-quoted strings
  result = result.replace(/'([^'\\]|\\.)*'/g, (match) => {
    strings.push(`<span class="text-green-400">${match}</span>`);
    return `__STR${strings.length - 1}__`;
  });

  // Comments (single line)
  result = result.replace(/(\/\/.*$)/gm, '<span class="text-gray-500 italic">$1</span>');

  // Keywords
  const keywords = [
    "import", "export", "from", "const", "let", "var", "function", "return",
    "if", "else", "for", "while", "class", "interface", "type", "extends",
    "implements", "new", "this", "default", "async", "await", "try", "catch",
    "throw", "switch", "case", "break", "continue", "typeof", "instanceof",
  ];
  keywords.forEach((kw) => {
    const regex = new RegExp(`\\b(${kw})\\b`, "g");
    result = result.replace(regex, '<span class="text-purple-400 font-medium">$1</span>');
  });

  // React hooks
  const hooks = ["useState", "useEffect", "useRef", "useCallback", "useMemo", "useContext"];
  hooks.forEach((hook) => {
    const regex = new RegExp(`\\b(${hook})\\b`, "g");
    result = result.replace(regex, '<span class="text-cyan-400">$1</span>');
  });

  // Types and booleans
  const types = ["string", "number", "boolean", "any", "null", "undefined", "true", "false", "Record"];
  types.forEach((t) => {
    const regex = new RegExp(`\\b(${t})\\b`, "g");
    result = result.replace(regex, '<span class="text-blue-400">$1</span>');
  });

  // Numbers
  result = result.replace(/\b(\d+\.?\d*)\b/g, '<span class="text-orange-400">$1</span>');

  // Restore strings
  strings.forEach((str, i) => {
    result = result.replace(`__STR${i}__`, str);
  });

  return result;
}
