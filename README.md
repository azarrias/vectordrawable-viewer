# VectorDrawable Viewer

A lightweight Visual Studio Code extension that renders **Android VectorDrawable XML** files in real time.  
Perfect for Android developers who want to iterate quickly on icons, shapes, and vector assets without switching to Android Studio.

## Features

- Live preview of VectorDrawable XML.
- Automatic re-rendering as you edit the file.
- Supports the most commonly used VectorDrawable attributes:
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
- Configurable fallback values for all supported attributes.
- Clean, centered SVG preview.

## Current limitations

The following features are not yet supported:
- `<group>` transformations (rotate, scale, translate, pivot)
- `clipPathData` -> SVG `<clipPath>`
- Gradients (`<gradient>`, `aapt:attr`)
- Layered rendering or named paths (`android:name`)

## Installation

You can install the extension directly from the VS Code Marketplace:

1. Open **VS Code**.
2. Go to **Extensions** (`Ctrl+Shift+X`).
3. Search for **VectorDrawable Viewer**.
4. Click **Install**.

## License
This project is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (CC BY-NC-SA 4.0).

You may share and adapt the code for non-commercial purposes, but any derivative work must remain open-source under the same license.

Full license text:
https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
