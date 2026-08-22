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
  const defaultFillColor = config.get("defaultFillColor") || "#00000000";
  const defaultFillAlpha = config.get("defaultFillAlpha") || "1";
  const defaultStrokeColor = config.get("defaultStrokeColor") || "#00000000";
  const defaultStrokeWidth = config.get("defaultStrokeWidth") || "0";
  const defaultStrokeAlpha = config.get("defaultStrokeAlpha") || "1";
  const defaultTrimStart = config.get("defaultTrimStart") || "0";
  const defaultTrimEnd = config.get("defaultTrimEnd") || "1";
  const defaultTrimOffset = config.get("defaultTrimOffset") || "0";
  const defaultFillType = config.get("defaultFillType") || "nonZero";

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
const DEFAULT_FILL_COLOR = "${defaultFillColor}";
const DEFAULT_FILL_ALPHA = "${defaultFillAlpha}";
const DEFAULT_STROKE_COLOR = "${defaultStrokeColor}";
const DEFAULT_STROKE_WIDTH = "${defaultStrokeWidth}";
const DEFAULT_STROKE_ALPHA = "${defaultStrokeAlpha}";
const DEFAULT_TRIM_START = "${defaultTrimStart}";
const DEFAULT_TRIM_END = "${defaultTrimEnd}";
const DEFAULT_TRIM_OFFSET = "${defaultTrimOffset}";
const DEFAULT_FILL_TYPE = "${defaultFillType}";

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
    const pathData = p.getAttribute("android:pathData");

    const fillColor = p.getAttribute("android:fillColor") || DEFAULT_FILL_COLOR;
    const fillAlpha = p.getAttribute("android:fillAlpha") || DEFAULT_FILL_ALPHA;

    const strokeColor = p.getAttribute("android:strokeColor") || DEFAULT_STROKE_COLOR;
    const strokeWidth = p.getAttribute("android:strokeWidth") || DEFAULT_STROKE_WIDTH;
    const strokeAlpha = p.getAttribute("android:strokeAlpha") || DEFAULT_STROKE_ALPHA;

    const trimStart = parseFloat(p.getAttribute("android:trimPathStart") || DEFAULT_TRIM_START);
    const trimEnd = parseFloat(p.getAttribute("android:trimPathEnd") || DEFAULT_TRIM_END);
    const trimOffset = parseFloat(p.getAttribute("android:trimPathOffset") || DEFAULT_TRIM_OFFSET);

    const fillType = p.getAttribute("android:fillType") || DEFAULT_FILL_TYPE;
    const svgFillRule = fillType === "evenOdd" ? "evenodd" : "nonzero";

    let trimAttrs = "";
    if (trimStart !== 0 || trimEnd !== 1 || trimOffset !== 0) {
      const length = 1;
      const start = (trimStart + trimOffset) % 1;
      const end = (trimEnd + trimOffset) % 1;

      const dashStart = start * length;
      const dashEnd = end * length;
      const dashArray = \`\${dashEnd - dashStart} \${length - (dashEnd - dashStart)}\`;
      const dashOffset = dashStart;

      trimAttrs = \`stroke-dasharray="\${dashArray}" stroke-dashoffset="\${dashOffset}"\`;
    }

  return \`
    <path
      d="\${pathData}"
      fill="\${fillColor}"
      fill-opacity="\${fillAlpha}"
      stroke="\${strokeColor}"
      stroke-width="\${strokeWidth}"
      stroke-opacity="\${strokeAlpha}"
      fill-rule="\${svgFillRule}"
      \${trimAttrs}
    />
  \`;

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
