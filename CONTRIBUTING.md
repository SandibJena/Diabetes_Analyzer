# Contributing

Thanks for your interest in improving Diabetes Analyzer.

## Development Setup

1. Clone the repository.
2. Web app: run `python -m http.server 5500` and open `http://127.0.0.1:5500/index.html`.
3. C++ app: compile `Diabetes_Analyzer.cpp` with a C++17 compiler.

## Coding Guidelines

- Keep logic consistent between C++ and web implementations.
- Prefer clear, readable conditions over compact but unclear expressions.
- Use descriptive names for symptoms, options, and result states.
- Keep UI text direct and medically cautious.

## Pull Request Checklist

- Update relevant docs when behavior changes.
- Verify no generated artifacts are committed.
- Ensure the web flow still works across all three levels.
- Validate input handling and result messages.

## Medical Disclaimer

This project is for awareness and educational use only. Do not present it as a medical diagnosis tool.
