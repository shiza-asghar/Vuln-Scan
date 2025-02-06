# 🚀 VSCode Vulnerability Scanner  

A **VSCode extension** that **scans for security vulnerabilities** in **C/C++, Python, JavaScript, and TypeScript** code and underlines potential issues like syntax errors. It also provides **quick fixes** for common vulnerabilities.  

---

## ✨ Features  
✅ **Real-time Vulnerability Detection** – Scans code on **save & edit**.  
✅ **Supports Multiple Languages** – Works with **C/C++, Python, JavaScript, and TypeScript**.  
✅ **Underlines Vulnerable Code** – Similar to **syntax errors** in VSCode.  
✅ **Quick Fixes** – Provides **fix suggestions** for common vulnerabilities.  

---

## 🔧 Installation  
1. Clone the repository:  
   ```sh
   git clone https://github.com/yourusername/vscode-vulnerability-scanner.git
   cd vscode-vulnerability-scanner
   ```  
2. Install dependencies:  
   ```sh
   npm install
   ```  
3. Open in **VSCode** and press `F5` to launch the extension in a new window.  

---

## 🚀 How to Use  
1. Open a **C/C++, Python, JavaScript, or TypeScript** file in VSCode.  
2. Make **edits** or **save** the file to trigger a security scan.  
3. **Vulnerable lines** will be **underlined in red**.  
4. Right-click the highlighted code and select **Quick Fix** to apply a suggested fix.  

---

## 🛠 Supported Vulnerability Scanners  
| Language      | Scanner  | Fixes Provided? |
|--------------|----------|----------------|
| **C/C++**    | `cppcheck`  | ✅ Yes |
| **Python**   | `bandit`  | ✅ Yes |
| **JavaScript/TypeScript** | `eslint` | ✅ Yes |

---

## 🔍 Example Vulnerabilities & Fixes  
| Vulnerability | Language | Auto Fix |
|--------------|----------|----------|
| `gets()` function (unsafe input) | C/C++ | ✅ Replaces with `fgets()` |
| `eval()` usage | Python | ✅ Replaces with `safe_eval()` |
| `innerHTML` usage | JavaScript | ✅ Replaces with `textContent` |

---

## ⚠️ Requirements  
Make sure the following tools are installed for full functionality:  
- **C/C++:** `cppcheck` → Install via `sudo apt install cppcheck` (Linux)  
- **Python:** `bandit` → Install via `pip install bandit`  
- **JavaScript/TypeScript:** `eslint` → Install via `npm install -g eslint`  

---

## 🛠 Development & Debugging  
1. Open the project in **VSCode**.  
2. Press `F5` to launch a **new VSCode window** with the extension activated.  
3. Open the **"Output" panel** (`View → Output`) and select **"Vulnerability Scanner"** for logs.  

---

## 💡 Future Improvements  
🔹 Support for **more languages** (e.g., Java, Go, Rust)  
🔹 **Custom rule definitions** for vulnerability scanning  
🔹 **Advanced AI-powered fixes** using LLMs  

