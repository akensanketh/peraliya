# Running Peraliya '26 on WordPress with Elementor

This folder contains the complete, ready-to-use **HTML, CSS, and JS embed code** to run [https://akensanketh.github.io/peraliya](https://akensanketh.github.io/peraliya) inside your WordPress site on any domain.

---

## 🚀 Quick Setup Instructions in Elementor

### Step 1: Create or Edit a Page
1. Go to your WordPress Admin dashboard (`wp-admin`).
2. Navigate to **Pages** > **Add New**.
3. Set your page title (e.g., `Home` or `Peraliya 2026`).
4. Click **Edit with Elementor**.

### Step 2: Configure Page Layout (Full-Screen)
1. In the bottom-left corner of the Elementor panel, click the **Gear (Settings)** icon.
2. Under **Page Layout**, select:
   - **Elementor Canvas** *(Recommended)*: Removes the default WordPress theme header and footer, giving the website a clean, native, 100% full-screen landing page experience.
   - *OR* **Elementor Full Width**: Keeps your WordPress theme header & footer and embeds the site between them.

### Step 3: Configure the Section / Container
1. Add a new **Container** (or **Section** if using classic sections).
2. Set **Content Width**: `Full Width` (100%).
3. Set **Min Height**: `100vh`.
4. In the **Advanced** tab of the container/section:
   - Set **Padding**: `0` on all sides.
   - Set **Margin**: `0` on all sides.

### Step 4: Add the Code
1. In the Elementor widget search bar, search for **HTML**.
2. Drag and drop the **HTML Widget** into your section/container.
3. Open [`elementor-code.html`](./elementor-code.html) and copy its entire content.
4. Paste it into the **HTML Code** box in Elementor.
5. Click **Publish** or **Update**.

---

## 🛠 Features Included in the Embed Code

- **Responsive Viewport Fitting**: Automatically handles mobile dynamic viewport units (`100dvh` and dynamic resize) so navigation and buttons fit properly on smartphones (iOS Safari / Android Chrome).
- **Smooth Preloader**: Displays a sleek dark loader with progress animation while the site renders, preventing visual jumps.
- **Hardware Acceleration & Permissions**: Configured with `allow="clipboard-write; fullscreen; geolocation"` so all interactive modals, copy-to-clipboard buttons, and forms continue to work without restriction.
- **Scroll Optimization**: `-webkit-overflow-scrolling: touch;` enabled for smooth mobile scrolling.
