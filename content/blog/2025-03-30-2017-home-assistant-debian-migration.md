---
title: "Migrated and Hardened My Home Assistant Setup on Debian"
date: "2025-03-30T20:17:00"
slug: "home-assistant-debian-migration"
tags: [home-assistant, debian, home-automation, security]
---

<p>I started my Home Assistant journey by installing it directly on my <strong>Beelink SER5 Pro</strong>. This initial install was a supervised version, but I quickly realized I wanted a more modular and future-proof setup, so I created a full backup and reinstalled Home Assistant on a clean <strong>Debian OS</strong> running on the same Beelink box.</p>

<h2>Initial Setup</h2>
<p>The first version of Home Assistant was deployed directly on the base OS. While it worked fine, I wanted better separation of concerns and system control, especially for integrations with my smart home and future AI assistant setup.</p>

<h2>Backup and OS Transition</h2>
<p>To move from the generic install to a cleaner supervised install, I performed a full snapshot backup from the original HA UI. Then I installed a fresh copy of <code>Debian 12</code> on the Beelink.</p>

<h2>Installing Home Assistant Supervised on Debian</h2>
<p>I followed the official HA supervised install instructions. Steps included:</p>
<ul>
  <li>Installing dependencies: <code>network-manager</code>, <code>systemd-resolved</code>, and others</li>
  <li>Configuring the required OS-level settings like AppArmor and NetworkManager</li>
  <li>Running the installer script provided by HA</li>
</ul>
<p>After installation, I restored my snapshot and everything came back up seamlessly: integrations, dashboards, automations — all intact.</p>

<h2>Why Supervised on Debian?</h2>
<p>This approach gives me:</p>
<ul>
  <li>Access to Home Assistant Add-ons (like ESPHome, File Editor, etc.)</li>
  <li>Improved system-level control for better automation integrations</li>
  <li>A clean foundation for my off-grid AI survival buddy system</li>
</ul>

<h2>Final Architecture</h2>
<p>My setup now includes:</p>
<ul>
  <li><strong>Beelink SER5 Pro</strong> running Debian 12 with HA Supervised</li>
  <li><strong>Jackery Explorer 500</strong> and <strong>SolarSaga 100</strong> for backup/off-grid power</li>
  <li><strong>Samsung monitor</strong> and <strong>Logitech K400</strong> for input</li>
  <li>HA integrations with Zigbee devices, Alexa, and security sensors</li>
</ul>
<p>Everything is now running smoothly with automated backups and a clear recovery path in case of failure. This build also lays the groundwork for my long-term smart survival system that leverages local AI, Home Assistant, and solar power.</p>
