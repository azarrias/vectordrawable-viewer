# VectorDrawable Viewer

A real‑time VectorDrawable previewer for VS Code.  
Render Android VectorDrawable XML instantly as SVG, with support for groups, clip paths, transforms, tinting, mirroring, and all core path attributes.

Ideal for Android developers, designers, and anyone working with XML‑based vector graphics.

## Features

### Real‑time preview  
- Automatically updates the SVG preview whenever the XML document changes.  
- Opens beside your editor for a smooth workflow.

### Full VectorDrawable support  
The viewer supports the majority of the VectorDrawable specification, including:

#### **Core path attributes**
- `android:pathData`  
- `android:fillColor`  
- `android:fillAlpha`  
- `android:strokeColor`  
- `android:strokeWidth`  
- `android:strokeAlpha`  
- `android:fillType` (`nonZero`, `evenOdd`)  
- `android:trimPathStart`  
- `android:trimPathEnd`  
- `android:trimPathOffset`

#### **Group transformations**
- `android:rotation`  
- `android:pivotX` / `android:pivotY`  
- `android:scaleX` / `android:scaleY`  
- `android:translateX` / `android:translateY`  
- Full support for nested groups with correct transform composition.

#### **Clip paths**
- `<clip-path>` elements  
- Proper SVG `clipPath` generation  
- Transform inheritance for clipped shapes  
- Support for nested clip paths

#### **Tinting**
- `android:tint`  
- `android:tintMode` (`src_in`, `multiply`, `screen`)  
- Applied using SVG blend modes

#### **Mirroring**
- `android:autoMirrored`  
- Optional configurable default (`defaultAutoMirrored`)  
- Implemented via `scale(-1, 1)` + `translate(...)` for accurate RTL mirroring

## Configuration

All supported attributes have configurable fallback values.  
You can customize defaults in your VS Code settings:

```
"vectordrawableViewer.defaultWidth": "24",
"vectordrawableViewer.defaultHeight": "24",
"vectordrawableViewer.defaultAlpha": "1",
"vectordrawableViewer.defaultTint": "",
"vectordrawableViewer.defaultTintMode": "src_in",
"vectordrawableViewer.defaultFillColor": "#00000000",
"vectordrawableViewer.defaultFillAlpha": "1",
"vectordrawableViewer.defaultStrokeColor": "#00000000",
"vectordrawableViewer.defaultStrokeWidth": "0",
"vectordrawableViewer.defaultStrokeAlpha": "1",
"vectordrawableViewer.defaultStrokeLineCap": "butt",
"vectordrawableViewer.defaultStrokeLineJoin": "miter",
"vectordrawableViewer.defaultStrokeMiterLimit": "4",
"vectordrawableViewer.defaultTrimStart": "0",
"vectordrawableViewer.defaultTrimEnd": "1",
"vectordrawableViewer.defaultTrimOffset": "0",
"vectordrawableViewer.defaultFillType": "nonZero",
"vectordrawableViewer.defaultAutoMirrored": false
```

## Usage
Open any .xml file containing a `<vector>` drawable.

Run the command:
```
Show VectorDrawable Viewer
```
A preview panel will open beside your editor.

Edit your XML - the preview updates instantly.

## Requirements
- Visual Studio Code 1.60.0 or newer
- No external dependencies
- Works on Windows, macOS, and Linux

## Known limitations
The following VectorDrawable features are not yet supported:
- AnimatedVectorDrawable (`<animated-vector>`)
- Path morphing animations
- Gradient fills (`<aapt:attr>` with `<gradient>`)
- Resource resolution (@color/..., @drawable/...)
- `<group>` name-based animation targets

## License
This project is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (CC BY-NC-SA 4.0).

You may share and adapt the code for non-commercial purposes, but any derivative work must remain open-source under the same license.

Full license text:
https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
