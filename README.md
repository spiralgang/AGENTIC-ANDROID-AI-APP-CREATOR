# 🤖 AI APK Generator CLI & Packaging Studio

A high-fidelity standalone Android compilation environment and APK generator that harnesses local & cloud AI models to synthesize fully-functional Java code, XML layout definitions, Gradle build scripts, and `buildozer.spec` deployment configurations from basic natural language specifications.

---

## ✨ Features

- **Natural Language to APK Synthesis**  
  Describe your application requirements (e.g., *"A responsive calc with a golden matrix"*), and get a compiled suite.
- **Multiple AI Code-Gen Models**  
  Select from a variety of state-of-the-art transformers locally or in the cloud:
  - `Salesforce/codegen-350M-mono` (Standard Local Optimization)
  - `facebook/incoder-1B` (Production Quality Java & Python)
  - `V-X/polycoder-400m` (Highly flexible multi-language backend)
  - `EleutherAI/gpt-j-6B` (Cloud-based hyper-synthesis)
  - `Google Gemini 3.5 Flash` (SOTA context understanding & full-graph production)
- **High-Fidelity Virtual Device Preview**  
  Instantly boot your synthesized app in an interactive simulated smartphone bezel. Click buttons, append inputs, dispatch alerts, and test logic actions in real-time.
- **Buildozer Integrations**  
  Automatic construction of `buildozer.spec` featuring customized domains, package IDs, SDK targets, and lightweight WebP icon overrides.
- **Custom Asset Synchronization & Resource Injector**  
  Upload launcher icons or custom file bundles, and see them visualised inside the static directories.

---

## 🚀 Installation & Standard Usage

### 📦 Prerequisites
- python >= 3.8
- openjdk-17-jdk
- Android SDK & NDK 23b+ (for full APK compilation)
- Buildozer (`pip install buildozer`)

### CLI Command Reference
Create, align, sign, and build projects straight from your terminal console:

| Command | Description |
|---|---|
| `help` | Outputs standard command manual instructions. |
| `list` | Displays active bookmarked workspaces. |
| `new [description]` | Triggers generative model to assemble files. |
| `template [template_id]` | Directly reloads classic templates. |
| `compile` | Simulates high-density APK compiling pipelines. |
| `buildozer -v android debug` | Synthesizes a release APK target using Buildozer configs. |
| `huggingface-cli login` | Syncs Hugging Face token variables. |

---

## 🛠️ Configuration & Customization

### Buildozer Deployments
Tweak the generated `buildozer.spec` inside the Workspace editor to include special android rules:
```ini
[app]
title = AI APK Generator
package.name = aiapkgenerator
package.domain = com.yourdomain
source.dir = .
source.include_exts = py,png,webp,jpg,kv,atlas,json,txt,xml,java,gradle
version = 1.0.0
requirements = python3,kivy,requests
orientation = portrait
icon.filename = icon.webp

# Size & Architecture Tuning
android.arch = arm64-v8a
android.api = 30
android.minapi = 21
android.ndk = 23b
android.sdk = 30
```

### API Inference
Configure your personal **Hugging Face Token** inside the interface to enable cloud models directly. The API proxies requests securely across encrypted end-points.

---

## 🏛️ License
This project is licensed under the **MIT License**. Distributed freely for creators and engineers.
