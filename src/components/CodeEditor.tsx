import Editor from '@monaco-editor/react';

const PLACEHOLDER = '// The generated p5.js sketch appears here. Edit it and press Run Edits.';

export function CodeEditor({ code, onChange }: { code: string; onChange: (next: string) => void }) {
  return (
    <div className="win-sunken h-full min-h-0">
      <Editor
        height="100%"
        language="javascript"
        theme="light"
        value={code || PLACEHOLDER}
        onChange={(next) => onChange(next ?? '')}
        options={{
          readOnly: code === '',
          domReadOnly: code === '',
          minimap: { enabled: false },
          fontFamily: 'IBM Plex Mono, JetBrains Mono, SF Mono, Menlo, monospace',
          fontSize: 12,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          renderLineHighlight: 'none',
          wordWrap: 'on',
          padding: { top: 8, bottom: 8 },
        }}
      />
    </div>
  );
}
