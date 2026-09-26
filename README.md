# Peraliya '26 — Official Web Portal

**All-Island Inter-School Media Competition & Annual Media Day**  
Organized by the **Sisuvisara Media Unit** of **Sirimavo Bandaranaike Vidyalaya, Colombo 07**, Sri Lanka.

---

## 🌟 Overview

**Peraliya '26** (පෙරළිය 2026) is the premier trilingual school media competition in Sri Lanka. It serves as an inspiring national platform uniting tradition with technological revolution, celebrating fearless journalism, broadcasting excellence, cinematic arts, and digital innovation.

- **Institution**: Sirimavo Bandaranaike Vidyalaya, Colombo 07
- **Organized By**: Sisuvisara Media Unit (සිසුවිසර මාධ්‍ය ඒකකය)
- **Tagline**: The Voice of Transformation (පෙරළියක හඬ)

---

## 🚀 Key Features

- **School Registration Portal**: Multi-step institutional accreditation system.
- **Dynamic Sequential School Codes**: Automatically generates official identification codes (`SC001`, `SC002`, `SC003`...).
- **Google Sheets Database Backend**: Two-way integration via Google Apps Script web app endpoint for real-time tracking of registrations and contact inquiries.
- **Node.js Local Server**: Built-in HTTP server with local JSON database fallback and safe cloud synchronization.
- **Interactive UI/UX**: Cyberpunk/academic aesthetic with dynamic glowing elements, custom audio synthesizer feedback, interactive countdown timers, and responsive design.
- **Official Rulebook**: Comprehensive rules and category guidelines in [`guidelines.html`](guidelines.html).

---

## 📁 Project Structure

```
Peraliya '26/
├── assets/                  # Logos, crests, posters, and media assets
├── data/                    # Local JSON database storage
│   ├── registrations.json   # Confirmed school registrations
│   └── contacts.json        # Contact inquiries
├── app.js                   # Client-side logic, form validation, and audio FX
├── config.js                # Central configuration (Google Sheet ID & Webhook)
├── GoogleAppsScript.js      # Backend script for Google Sheets (Apps Script)
├── guidelines.html          # Official Competition Rulebook & Guidelines
├── index.html               # Main landing page & registration portal
├── server.js                # Node.js backend server & API endpoints
├── styles.css               # Core design system and responsive styles
└── README.md                # Documentation
```

---

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)

### Running Locally

1. Clone or open the repository:
   ```bash
   git clone https://github.com/akensanketh/peraliya.git
   cd peraliya
   ```

2. Start the local server:
   ```bash
   node server.js
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:3000/
   ```

---

## 📊 Backend API Endpoints

- `GET /api/next-school-code` — Returns the current last school code and the next sequential code.
- `POST /api/register` — Registers a school, assigns an official `SC` code, saves locally, and syncs to Google Sheets.
- `POST /api/contact` — Submits contact/inquiry messages.
- `GET /api/registrations` — Lists registered schools.
- `GET /api/status` — Health check endpoint.

---

## 👨‍💻 Credits & Copyright

- **Event**: Peraliya '26 — Sisuvisara Media Unit, Sirimavo Bandaranaike Vidyalaya
- **Design & Development**: Aken Sanketh
- © 2026 Sisuvisara Media Unit. All Rights Reserved.
