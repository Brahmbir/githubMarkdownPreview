"use client";
import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { copilot } from "@uiw/codemirror-theme-copilot";

export default function CodeEditor() {
  return (
    <div className="h-full w-full grid">
      <CodeMirror
        value={"# Hello World \n\nThis is a markdown editor."}
        height="100%"
        theme={copilot}
        extensions={[
          markdown({ base: markdownLanguage, codeLanguages: languages }),
        ]}
        //   onChange={onChange}
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          highlightActiveLineGutter: true,
          highlightActiveLine: true,
          drawSelection: true,
          dropCursor: true,
          bracketMatching: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          syntaxHighlighting: true,
          closeBrackets: true,
          autocompletion: true,
          rectangularSelection: true,
          highlightSelectionMatches: true,
          closeBracketsKeymap: true,
          defaultKeymap: true,
          history: true,
          searchKeymap: true,
          historyKeymap: true,
          foldKeymap: true,
          completionKeymap: true,
          lintKeymap: true,
        }}
      />
    </div>
  );
}
