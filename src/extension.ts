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

  const defaultWidth = config.get("defaultWidth") || "24";
  const defaultHeight = config.get("defaultHeight") || "24";
  const defaultAlpha = config.get("defaultAlpha") || "1";
  const defaultTint = config.get("defaultTint") || "";
  const defaultTintMode = config.get("defaultTintMode") || "src_in";
  const defaultFillColor = config.get("defaultFillColor") || "#00000000";
  const defaultFillAlpha = config.get("defaultFillAlpha") || "1";
  const defaultStrokeColor = config.get("defaultStrokeColor") || "#00000000";
  const defaultStrokeWidth = config.get("defaultStrokeWidth") || "0";
  const defaultStrokeAlpha = config.get("defaultStrokeAlpha") || "1";
  const defaultStrokeLineCap = config.get("defaultStrokeLineCap") || "butt";
  const defaultStrokeLineJoin = config.get("defaultStrokeLineJoin") || "miter";
  const defaultStrokeMiterLimit = config.get("defaultStrokeMiterLimit") || "4";
  const defaultTrimStart = config.get("defaultTrimStart") || "0";
  const defaultTrimEnd = config.get("defaultTrimEnd") || "1";
  const defaultTrimOffset = config.get("defaultTrimOffset") || "0";
  const defaultFillType = config.get("defaultFillType") || "nonZero";
  const defaultAutoMirrored = config.get("defaultAutoMirrored") || false;

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

const DEFAULT_WIDTH = "${defaultWidth}";
const DEFAULT_HEIGHT = "${defaultHeight}";
const DEFAULT_ALPHA = "${defaultAlpha}";
const DEFAULT_TINT = "${defaultTint}";
const DEFAULT_TINT_MODE = "${defaultTintMode}";
const DEFAULT_FILL_COLOR = "${defaultFillColor}";
const DEFAULT_FILL_ALPHA = "${defaultFillAlpha}";
const DEFAULT_STROKE_COLOR = "${defaultStrokeColor}";
const DEFAULT_STROKE_WIDTH = "${defaultStrokeWidth}";
const DEFAULT_STROKE_ALPHA = "${defaultStrokeAlpha}";
const DEFAULT_TRIM_START = "${defaultTrimStart}";
const DEFAULT_TRIM_END = "${defaultTrimEnd}";
const DEFAULT_TRIM_OFFSET = "${defaultTrimOffset}";
const DEFAULT_FILL_TYPE = "${defaultFillType}";
const DEFAULT_STROKE_LINE_CAP = "${defaultStrokeLineCap}";
const DEFAULT_STROKE_LINE_JOIN = "${defaultStrokeLineJoin}";
const DEFAULT_STROKE_MITER_LIMIT = "${defaultStrokeMiterLimit}";
const DEFAULT_AUTO_MIRRORED = ${defaultAutoMirrored};

function computeGroupTransform(g) {
  const rotation = parseFloat(g.getAttribute("android:rotation") || 0);
  const pivotX = parseFloat(g.getAttribute("android:pivotX") || 0);
  const pivotY = parseFloat(g.getAttribute("android:pivotY") || 0);
  const scaleX = parseFloat(g.getAttribute("android:scaleX") || 1);
  const scaleY = parseFloat(g.getAttribute("android:scaleY") || 1);
  const translateX = parseFloat(g.getAttribute("android:translateX") || 0);
  const translateY = parseFloat(g.getAttribute("android:translateY") || 0);

  let transform = "";

  if (translateX !== 0 || translateY !== 0) {
    transform += \` translate(\${translateX}, \${translateY})\`;
  }

  if (rotation !== 0) {
    transform += \` rotate(\${rotation}, \${pivotX}, \${pivotY})\`;
  }

  if (scaleX !== 1 || scaleY !== 1) {
    transform += \` scale(\${scaleX}, \${scaleY})\`;
  }

  return transform.trim();
}

function renderClipPath(node, inheritedTransform) {
  const pathData = node.getAttribute("android:pathData");
  const clipId = "clip_" + performance.now().toString(36);

  return {
    id: clipId,
    svg: \`
      <clipPath id="\${clipId}">
        <path d="\${pathData}" \${inheritedTransform ? \`transform="\${inheritedTransform}"\` : ""}/>
      </clipPath>
    \`
  };
}

function renderPath(p, inheritedTransform) {
  const pathData = p.getAttribute("android:pathData");

  const fillColor = p.getAttribute("android:fillColor") || DEFAULT_FILL_COLOR;
  const fillAlpha = p.getAttribute("android:fillAlpha") || DEFAULT_FILL_ALPHA;

  const strokeColor = p.getAttribute("android:strokeColor") || DEFAULT_STROKE_COLOR;
  const strokeWidth = p.getAttribute("android:strokeWidth") || DEFAULT_STROKE_WIDTH;
  const strokeAlpha = p.getAttribute("android:strokeAlpha") || DEFAULT_STROKE_ALPHA;

  const strokeLineCap = p.getAttribute("android:strokeLineCap") || DEFAULT_STROKE_LINE_CAP;
  const strokeLineJoin = p.getAttribute("android:strokeLineJoin") || DEFAULT_STROKE_LINE_JOIN;
  const strokeMiterLimit = p.getAttribute("android:strokeMiterLimit") || DEFAULT_STROKE_MITER_LIMIT;

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
      \${inheritedTransform ? \`transform="\${inheritedTransform}"\` : ""}
      fill="\${fillColor}"
      fill-opacity="\${fillAlpha}"
      stroke="\${strokeColor}"
      stroke-width="\${strokeWidth}"
      stroke-opacity="\${strokeAlpha}"
      stroke-linecap="\${strokeLineCap}"
      stroke-linejoin="\${strokeLineJoin}"
      stroke-miterlimit="\${strokeMiterLimit}"
      fill-rule="\${svgFillRule}"
      \${trimAttrs}
    />
  \`;
}

function processNode(node, parentTransform = "") {
  const tag = node.tagName.toLowerCase();

  if (tag === "group") {
    const transform = computeGroupTransform(node);
    const combinedTransform = (parentTransform + " " + transform).trim();

    let clip = null;

    const children = Array.from(node.childNodes)
      .filter(n => n.nodeType === 1)
      .map(child => {
        const childTag = child.tagName.toLowerCase();

        if (childTag === "clip-path") {
          clip = renderClipPath(child, combinedTransform);
          return "";
        }

        return processNode(child, combinedTransform);
      })
      .join("");

    const clipAttr = clip ? \`clip-path="url(#\${clip.id})"\` : "";

    return \`
      \${clip ? clip.svg : ""}
      <g \${combinedTransform ? \`transform="\${combinedTransform}"\` : ""} \${clipAttr}>
        \${children}
      </g>
    \`;
  }

  if (tag === "clip-path") {
    return "";
  }

  if (tag === "path") {
    return renderPath(node, parentTransform);
  }

  return "";
}

function parseVectorDrawable(xml) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "application/xml");

  const vector = doc.querySelector("vector");
  if (!vector) return "<p>No <vector> tag found.</p>";

  const width = vector.getAttribute("android:width") || DEFAULT_WIDTH;
  const height = vector.getAttribute("android:height") || DEFAULT_HEIGHT;
  const alpha = vector.getAttribute("android:alpha") || DEFAULT_ALPHA;

  const tint = vector.getAttribute("android:tint") || DEFAULT_TINT;
  const tintMode = vector.getAttribute("android:tintMode") || DEFAULT_TINT_MODE;

  const autoMirroredAttr = vector.getAttribute("android:autoMirrored");
  const autoMirrored = autoMirroredAttr === "true" || (autoMirroredAttr === null && DEFAULT_AUTO_MIRRORED);

  const viewportWidth = vector.getAttribute("android:viewportWidth") || 24;
  const viewportHeight = vector.getAttribute("android:viewportHeight") || 24;

  let blendMode = "normal";
  if (tintMode === "multiply") blendMode = "multiply";
  else if (tintMode === "screen") blendMode = "screen";

  let tintedGroupStart = "";
  let tintedGroupEnd = "";

  if (tint) {
    tintedGroupStart = \`<g fill="\${tint}" style="mix-blend-mode: \${blendMode}">\`;
    tintedGroupEnd = \`</g>\`;
  }

  const svgContent = processNode(vector);

  let autoMirrorTransform = "";
  if (autoMirrored) {
    autoMirrorTransform = \`transform="scale(-1, 1) translate(-\${viewportWidth}, 0)"\`;
  }

  return \`
    <svg
      viewBox="0 0 \${viewportWidth} \${viewportHeight}"
      width="\${width}"
      height="\${height}"
      opacity="\${alpha}"
      \${autoMirrorTransform}
    >
      \${tint ? tintedGroupStart : ""}
        \${svgContent}
      \${tint ? tintedGroupEnd : ""}
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
