Here's a simple, clear README.md for Skynox Weather. It includes how to install, run, and notes about the SWC issue you faced.
# 🌤️ Skynox Weather

A sleek, modern, and responsive weather web application built using **Next.js**.

---

## 📦 Tech Stack

- ⚙️ **Framework:** Next.js (v15+)
- 🎨 **Styling:** CSS / Tailwind (if applicable)
- 🌐 **API:** OpenWeatherMap or similar (configurable)
- ⚡ **Bundler:** SWC (WASM fallback for Windows compatibility)

---

## 🚀 Getting Started

### ✅ Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [pnpm](https://pnpm.io/) or npm

---

### 🔧 Installation Steps

#### 1. Clone the Repository

```bash
git clone https://github.com/your-username/skynox-weather.git
cd skynox-weather
```

#### 2. Install Dependencies

Using **pnpm** (recommended):

```bash
pnpm install
```

Or using **npm**:

```bash
npm install
```

> ⚠️ If you see dependency errors, try:
> ```bash
> npm install --legacy-peer-deps
> ```

#### 3. Set Up Environment Variables

Create a file named `.env.local` and add:

```env
NEXT_FORCE_SWc_WASM=true
```

This will ensure compatibility on Windows by using the SWC WASM fallback.

---

## 🧪 Run the App

```bash
npm run dev
```

or

```bash
pnpm run dev
```

The app will be available at:

```
http://localhost:3000
```

---

## 🛠️ Troubleshooting

### ❌ SWC Error on Windows

If you get this error:

```
next-swc.win32-x64-msvc.node is not a valid Win32 application
```

✅ Fix: Add this to `.env.local`:

```env
NEXT_FORCE_SWc_WASM=true
```

---

### ❌ `pnpm` is not recognized

Make sure `pnpm` is installed globally:

```bash
npm install -g pnpm
```

Also ensure `C:\Users\<YourName>\AppData\Roaming\npm` is in your system PATH.

---

### ❌ PowerShell Script Execution Disabled

If you get this error while running `pnpm`:

```
running scripts is disabled on this system
```

✅ Fix: Temporarily allow scripts in PowerShell:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

---

## 📁 Project Structure

```
Skynox-Weather/
├── public/
├── pages/
├── styles/
├── components/
├── .env.local
├── package.json
└── README.md
```

---

## 📄 License

This project is licensed under the **MIT License**. Feel free to use and modify it.

---

## 🙋‍♂️ Author

**Ali Hassan**

---

> ⭐ If you find this project useful, consider starring it on GitHub!
