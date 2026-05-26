# 👾 PIXEL.FM - 16-Bit Pixel Art Spotify Web Player 📻

Welcome to **PIXEL.FM**! A visually stunning, fully functional Spotify Web Player styled with a retro 8-bit/16-bit vintage gaming arcade look and feel. The entire system is dressed in an gorgeous, eye-safe **hot pink, deep magenta, and bubblegum pink** theme, fitted with CRT scanline overlays, pixelated layout frames, custom retro loading meters, bounces equalizers, volume sliders, and floating sparkles.

---

## 🕹️ Visual & Functional Highlights

- **8-Bit Aesthetic**: Clean styling utilizing double solid pixel outlines, crisp edges, custom cassette walking animations, and glowing text.
- **CRT Scanlines**: Repeating viewport screen shaders to emulate retro arcade hardware monitors.
- **Press Start 2P Font**: Google's legendary gaming retro font loaded for all textual HUD indicators.
- **Wedge Volume Meter**: Styled after retro speaker display systems with 10 click-interactive volume steps and adaptive graphics.
- **Real-Time Client Tracking**: Synchronizes playback position with custom 1s timers and polls current queue listings dynamically.
- **Active Channel Selection (Device Selector)**: Switch streaming channels between Spotify on your phone, laptop, or the built-in Web Playback player direct from the console!

---

## 📋 Standard First-Time Setup Instructions

To hook this player to your Spotify account, you must register a developer application on Spotify and write your credentials to the applet keys.

### Step 1: Create a Spotify Developer App
1. Navigate to the **[Spotify Developer Dashboard](https://developer.spotify.com/dashboard)** and log in.
2. Click **Create App** at the top right of your panel.
3. Configure the app settings:
   - **App Name**: `PixelFM`
   - **App Description**: `16-Bit Retro Spotify Player Cabin`
   - **Redirect URI**: Add the exact dynamic development URL of your workspace applet:
     ```text
     https://ais-dev-rg3if4acvkvt7cu4cohavw-257552207713.asia-southeast1.run.app/
     ```
     *(Be sure to include the trailing slash `/` exactly! If you ever deploy or share, also whitelist the Shared App URL!)*
   - **Web Playback SDK**: Ensure this checkbox is **checked**
   - **Web API**: Ensure this checkbox is **checked**
4. Review and accept terms, then click **Save**.

### Step 2: Configure Environment Secrets inside AI Studio
1. In your Spotify App Dashboard, navigate to **Settings** and copy your **Client ID**.
2. Open the **Secrets / Env panel** inside the constructor of **AI Studio**.
3. Create/Update these environment variables:
   - `VITE_SPOTIFY_CLIENT_ID` - Paste your Spotify client ID here.
   - `VITE_SPOTIFY_REDIRECT_URI` - Enter your redirect URL:
     ```text
     https://ais-dev-rg3if4acvkvt7cu4cohavw-257552207713.asia-southeast1.run.app/
     ```
4. Restart your development preview so Vite re-reads the updated values!

### Step 3: Run and Connect!
1. Start the web builder environment:
   ```bash
   npm run dev
   ```
2. Your preview console will compile and present the walking cassette logo.
3. Click **CONNECT SPOTIFY**.
4. Log in and authorize your account inside the popup channel. 
5. Once authenticated, your player deck is active!

---

## 🎵 Spotify Compatibility Notes

- **Premium Account Required for Web Player Streaming**: The official **Spotify Web Playback SDK** built into this player requires high-fidelity streams which are exclusive to **Spotify Premium** accounts. 
- **Free Account Remote Control Fallback**: If you have a Free account, you can still use PIXEL.FM! Simply launch Spotify on your official desktop or mobile application, start a song, and click **SYNC AUDIO STREAM** in PIXEL.FM. You will be able to view currently playing artwork, titles, volumes, active status, skip/previous songs and sync your queue remotely!

---

## 👾 Tech Stack

- **Framework**: React 19 + TypeScript + Vite 6
- **Styling**: Tailwind CSS v4 + Space-saving CRT overlay layers
- **API Protocol**: Spotify Web Playback SDK + REST API + Cryptographic PKCE state generation
- **Font Face**: Google Fonts *Press Start 2P*
- **Vector Icons**: Lucide-React
