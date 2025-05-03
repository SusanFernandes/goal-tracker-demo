
# 🎯 Goal Tracker Dashboard

A visually engaging and interactive **Goal Tracker Dashboard** built with **Next.js**, **Framer Motion**, **Recharts**, and **Lucide-react**. Celebrate your achievements with confetti, monitor progress using beautiful charts, and track milestones — all in one place.

---

## 📌 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Usage](#-usage)
- [Confetti Integration](#-confetti-integration)
- [Folder Structure](#-folder-structure)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

- ✅ **Goal Progress Bars** for ongoing and completed goals
- 📊 **Pie and Bar Charts** using `Recharts`
- 🎉 **Animated Confetti Celebration** with `canvas-confetti`
- 🧩 **Modular Component Design** (Cards, Milestones, Charts, etc.)
- 🔄 **Smooth UI Transitions** using `Framer Motion`
- 🌗 **Iconography** with `Lucide-react`
- 🧪 **Mock Data Integration** for quick prototyping

---

## 🧱 Tech Stack

| Tech                | Description                                  |
|---------------------|----------------------------------------------|
| [Next.js](https://nextjs.org) | React Framework for production-ready apps |
| [Framer Motion](https://www.framer.com/motion/) | Declarative animations and transitions |
| [Recharts](https://recharts.org/) | Library for building chart components |
| [Lucide-react](https://lucide.dev) | Beautiful, consistent icon library |
| [canvas-confetti](https://www.npmjs.com/package/canvas-confetti) | Light-weight confetti animation |

---

## ⚙️ Getting Started

Clone the repository:

```bash
git clone https://github.com/your-username/goal-tracker-dashboard.git
cd goal-tracker-dashboard
```

Install the dependencies:

```bash
npm install
```

Install confetti type support:

```bash
npm i --save-dev @types/canvas-confetti
```

Start the development server:

```bash
npm run dev
```

Visit: `http://localhost:3000`

---

## 🧠 Usage

This dashboard is structured to show:
- Ongoing goals
- Completed goals
- Weekly goal tracking (bar chart)
- Goal type distribution (pie chart)
- Confetti animation on reaching 100% progress

> All data is currently mocked in the file and can be connected to a backend or API.

---

## 🎉 Confetti Integration

The celebration effect is triggered when progress reaches `100%`.

```ts
import confetti from "canvas-confetti";

const triggerCelebration = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
};
```

Don’t forget to install its types for TypeScript support:

```bash
npm i --save-dev @types/canvas-confetti
```

---

## 📁 Folder Structure (Typical Setup)

```
.
├── components/
│   ├── Charts/
│   ├── Cards/
│   └── Milestones/
├── pages/
│   └── index.tsx  ← Main Dashboard Page
├── styles/
│   └── globals.css
├── public/
├── tsconfig.json
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a new branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature-name`)
5. Open a pull request

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

## 📬 Contact

Have questions or suggestions?

- [LinkedIn](https://linkedin.com/in/your-profile)
- [Twitter](https://twitter.com/your-handle)
- 📧 Email: your.email@example.com

---

> Built with ❤️ using React, Next.js & Confetti 🚀
