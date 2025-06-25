---
title: "Built a Live Cyberpunk Kiosk Dashboard with Raspberry Pi"
date: 2025-06-20T13:08:31
slug: "raspberry-pi-cyberpunk-dashboard"
tags: [raspberry-pi, kiosk, dashboard, home-lab]
---

Last night I turned an idle monitor and a Raspberry Pi into a **fully animated cyberpunk kiosk dashboard** — and honestly, it looks like something straight out of a sci-fi command center.

## 🧰 Setup Highlights

- 💻 **Device:** Raspberry Pi Zero 2 W  
- 🖥 **Display:** Top-mounted screen above my ultrawide  
- 🌐 **Browser:** Chromium in Kiosk mode  
- ⚙️ **Startup:** Autostarts on boot using LXDE autostart  
- 🗂 **Page:** Local `dashboard.html` file — no internet required beyond APIs  

---

<div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
  <a href="/images/kiosk-cyberpunk-setup-1.jpg" target="_blank">
    <img src="/images/kiosk-cyberpunk-setup-1.jpg" alt="Cyberpunk Pi Display" style="max-width: 300px; border: 1px solid #333; border-radius: 8px;">
  </a>
  <a href="/images/kiosk-cyberpunk-setup-2.jpg" target="_blank">
    <img src="/images/kiosk-cyberpunk-setup-2.jpg" alt="Full Lab Setup" style="max-width: 300px; border: 1px solid #333; border-radius: 8px;">
  </a>
</div>

--- 

## 🧠 Dashboard Features

- **📈 Live Stock + Crypto Ticker**  
  Powered by [Twelve Data](https://twelvedata.com) and [CoinGecko](https://coingecko.com)  
  - TSLA, BBAI, SEDG with real-time pricing  
  - BTC, ETH, DOGE tracked in parallel

- **📰 Vertical Scrolling Headlines**  
  - Pulls top Hacker News stories  
  - Fetches latest CISA security bulletins  
  - Styled with terminal-like glow and neon sections

- **🌦 Weather Radar**  
  - Embedded Windy radar map for real-time storm activity

- **🌍 Cyber Threat Globe**  
  - Live threat tracking from Kaspersky's global map widget

- **🖥 System Stats Panel**  
  - Displays CPU Temp, RAM usage, network activity (currently static, upgradeable later)

- **🎨 Matrix Rain Background**  
  - Full-screen green katakana "digital rain" via HTML5 canvas

## ⚡️ Chromium Kiosk Mode

```bash
@chromium-browser --noerrdialogs --disable-infobars --kiosk file:///home/pi/dashboard.html
```

Autoloads at boot using:
```bash
~/.config/lxsession/LXDE-pi/autostart
```

## 📝 What's Next?

- Feed in real system stats using Python backend or shell scripts  
- Add cyber alerts from CVE feeds, Shodan, or NIST  
- Optional camera panel for "sentry mode" vibes  
- Weather alerts, geo IP logs, local device scanner (nmap)

---

This started as a fun experiment — but it’s quickly becoming my favorite always-on display.

> Feels like I'm monitoring the grid from Zion.  
>  
> 💬 Want the full HTML file? I’ll share the repo soon.

---

*Built with Hugo, fueled by caffeine, inspired by cyberpunk aesthetics.*  
