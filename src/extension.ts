import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand("vectordrawable.viewer", () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage("No active editor.");
      return;
    }

    const xml = editor.document.getText();

    const panel = vscode.window.createWebviewPanel(
      "vectordrawableViewer",
      "VectorDrawable Viewer",
      vscode.ViewColumn.Beside,
      { enableScripts: true }
    );

    panel.webview.html = getWebviewContent(xml);

    vscode.workspace.onDidChangeTextDocument(event => {
      if (event.document === editor.document) {
        panel.webview.postMessage({ xml: event.document.getText() });
      }
    });
  });

  context.subscriptions.push(disposable);
}

function getWebviewContent(xml: string): string {
  const escaped = xml.replace(/`/g, "\\`");

  const config = vscode.workspace.getConfiguration("vectordrawableViewer");
  const defaultFill = config.get("defaultFillColor") || "#000000";

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
body {
  background: #f5f5f5;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
svg {
  width: 80%;
  height: auto;
}
</style>
</head>
<body>
<div id="container"></div>

<script>
const vscode = acquireVsCodeApi();
const DEFAULT_FILL = "${defaultFill}";

function parseVectorDrawable(xml) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "application/xml");

  const vector = doc.querySelector("vector");
  if (!vector) return "<p>No <vector> tag found.</p>";

  const viewportWidth = vector.getAttribute("android:viewportWidth") || 24;
  const viewportHeight = vector.getAttribute("android:viewportHeight") || 24;

  const paths = Array.from(doc.querySelectorAll("path"));
  if (paths.length === 0) return "<p>No <path> tags found.</p>";

  const svgPaths = paths.map(p => {
    const d = p.getAttribute("android:pathData");
    const fill = p.getAttribute("android:fillColor") || DEFAULT_FILL;
    return \`<path d="\${d}" fill="\${fill}" />\`;
  }).join("");

  return \`
    <svg viewBox="0 0 \${viewportWidth} \${viewportHeight}">
      \${svgPaths}
    </svg>
  \`;
}

function render(xml) {
  document.getElementById("container").innerHTML = parseVectorDrawable(xml);
}

window.addEventListener("message", event => {
  render(event.data.xml);
});

render(\`${escaped}\`);
</script>
</body>
</html>
`;
}
