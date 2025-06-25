---
title: "Quick Win: Using Nmap to Track Down a Rebooted Pi"
date: "2025-06-21T20:35:00"
slug: "nmap-find-pi-after-reboot"
tags: [nmap, raspberry-pi, networking, troubleshooting]
---

<p>Today I put my basic <code>nmap</code> skills to practical use after getting unexpectedly kicked out of a <code>PuTTY</code> session. My Raspberry Pi 2 must have rebooted and grabbed a new IP via DHCP, which broke the connection.</p><p>Instead of diving into the router to dig around, I ran:</p><pre><code>nmap -p 22 --open 192.168.1.0/24</code></pre><p>This scanned my whole subnet for hosts with SSH (port 22) open. A few seconds later-boom-I had my Pi back. Even better, I discovered a few devices I didnt realize had SSH enabled. So, mini audit complete.</p><p>Lesson learned: Ill set a static IP for that Pi soon. But hey, it was a good reminder that quick terminal chops can save you time and expose some blind spots in your network.</p>
