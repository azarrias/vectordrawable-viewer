# Changelog

## 0.1.0 – 24/08/2026
- Added full support for `android:autoMirrored`, including a new configurable default (`defaultAutoMirrored`) for vectors that omit the attribute.
- Implemented complete `<group>` handling with inherited transformations:
  - `android:rotation`
  - `android:pivotX` / `android:pivotY`
  - `android:scaleX` / `android:scaleY`
  - `android:translateX` / `android:translateY`
- Added recursive rendering of nested groups with proper transform composition.
- Introduced support for `<clip-path>` elements, including:
  - Correct SVG `clipPath` generation
  - Transform inheritance for clipped shapes
  - Safe handling of multiple and nested clip-paths
- Improved internal rendering pipeline:
  - Normalized tag parsing (`tagName.toLowerCase()`)
  - More robust DOM traversal using `childNodes` filtering
  - Avoided empty `transform=""` attributes
  - More stable clip-path IDs
- Extended configuration system with new defaults and improved consistency across all attributes.
- No breaking changes; existing VectorDrawable previews continue to work as before.

## 0.0.2 – 23/08/2026
- Updated minimum VS Code compatibility to ^1.60.0 for broader support across stable releases.
- Downgraded @types/vscode to 1.60.0 to align with the new compatibility target.
- Improved Marketplace categorization by switching from Other to Visualization.
- Updated extension metadata and versioning for republishing.
- No functional changes to the viewer logic; this release focuses on compatibility and metadata improvements.

## 0.0.1 – 22/08/2026
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
