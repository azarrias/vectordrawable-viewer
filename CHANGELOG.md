# Changelog

## 0.0.2 - 23/08/2026
- Updated minimum VS Code compatibility to ^1.60.0 for broader support across stable releases.
- Downgraded @types/vscode to 1.60.0 to align with the new compatibility target.
- Improved Marketplace categorization by switching from Other to Visualization.
- Updated extension metadata and versioning for republishing.
- No functional changes to the viewer logic; this release focuses on compatibility and metadata improvements.

## 0.0.1 - 22/08/2026
- Added real-time VectorDrawable XML rendering.
- Implemented automatic preview updates on document changes.
- Added support for core VectorDrawable attributes:
  - `android:pathData`
  - `android:fillColor`
  - `android:fillAlpha`
  - `android:strokeColor`
  - `android:strokeWidth`
  - `android:strokeAlpha`
  - `android:fillType`
  - `android:trimPathStart`
  - `android:trimPathEnd`
  - `android:trimPathOffset`
- Added configurable fallback values for all supported attributes.
- Introduced clean SVG preview panel with centered layout.
- Included extension icon and Marketplace metadata.
