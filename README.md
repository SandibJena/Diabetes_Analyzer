# Diabetes Analyzer

A hybrid C++ and web-based diabetes screening project that follows a structured 3-level decision flow for symptom-based risk assessment.

## Overview

Diabetes Analyzer provides two ways to run the same core logic:
- A C++ console application (`src/cpp/Diabetes_Analyzer.cpp`)
- A browser application (`web/index.html`, `web/script.js`, `web/styles.css`)

The project is intended for awareness and educational use. It is not a medical diagnostic system.

## Features

- 3-stage screening workflow:
  - Level 1: Initial risk pattern check
  - Level 2: Primary vs secondary pattern check
  - Level 3: Insulin-dependent vs non-insulin-dependent orientation
- Unit-flexible personal input support in web UI:
  - Height: cm or feet/inches
  - Weight: kg or lbs
  - Sex options: male, female, trans
- Combination Explorer to enumerate and filter symptom combinations
- Clear result explanations and medical disclaimer in UI

## Project Structure

- `src/cpp/Diabetes_Analyzer.cpp`: Console implementation
- `web/index.html`: Main web page
- `web/script.js`: Screening and combination logic
- `web/styles.css`: UI styling
- `docs/CHANGELOG.md`: Release history
- `.github/`: Issue and PR templates

## Run Locally

### Web App

From the project folder, start a static server:

```powershell
python -m http.server 5500
```

Open:

`http://127.0.0.1:5500/web/index.html`

### C++ Console App

Compile (example with `g++`):

```powershell
g++ -std=c++17 -O2 -o Diabetes_Analyzer.exe src/cpp/Diabetes_Analyzer.cpp
```

Run:

```powershell
.\Diabetes_Analyzer.exe
```

## Important Disclaimer

Results are approximate and depend on user-provided inputs. Always consult a qualified medical professional for accurate diagnosis and treatment decisions.

## License

This project is licensed under the MIT License. See `LICENSE`.
