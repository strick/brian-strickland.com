---
title: "How I Rebuilt My Home Network with Pi-hole and Killed ISP DNS Leaks for Good"
date: "2025-06-18T21:12:00"
slug: "pi-hole-home-network-rebuild"
---

---
title: "How I Rebuilt My Home Network with Pi-hole and Killed ISP DNS Leaks for Good"
date: 2025-06-18
slug: "pi-hole-home-network-rebuild"
---

Like many home lab enthusiasts, I wanted more control over my network � not just to block ads, but to make sure every device in my house used a secure, filtered DNS resolver. That meant one thing: rebuilding my network around **Pi-hole**, disabling my ISP's DNS, and turning a cluttered setup into a clean, reliable, ad-free environment.

## ? My Goals

- Replace AT&T router's DNS and DHCP with Pi-hole  
- Set up a headless Pi-hole server on an old Mac Mini  
- Use my WAVLINK router as a pure Access Point  
- Disable IPv6 DNS leaks (AT&T is notorious for this)  
- Have full visibility and control over DNS activity  

## ? Hardware & Network Details

- **Mac Mini**: Debian 12 (headless, static IP)  
- **WAVLINK**: Bridged Access Point Mode  
- **AT&T Router**: Gateway only, DHCP/IPv6 off  

## ? Step-by-Step Setup

### 1. Rebuilt Pi-hole on Mac Mini

- Installed Debian 12 headless with LVM  
- Set static IP: `192.168.1.2`  
- Installed Pi-hole and configured upstream DNS (Cloudflare)  
- Enabled DHCP in Pi-hole with range: `192.168.1.100 � 192.168.1.200`  

### 2. Disabled DHCP on AT&T Router

- Logged into `192.168.1.254`  
- Turned off DHCP under Subnets & DHCP  

### 3. Configured WAVLINK as Access Point

- Switched to AP mode (LAN Bridge)  
- Set static IP: `192.168.1.3`  
- Disabled DHCP and pointed DNS to Pi-hole  

### 4. IPv6 Hardening

- Disabled IPv6 on AT&T router  
- Disabled IPv6 on Windows PC to stop fallback DNS leaks  
- Confirmed `nslookup` queries now resolve through `192.168.1.2`  

## ? Final IP Layout

| Device        | IP Address       | Notes                       |
|---------------|------------------|-----------------------------|
| AT&T Router   | `192.168.1.254`  | Gateway only                |
| Pi-hole       | `192.168.1.2`    | DNS + DHCP server           |
| WAVLINK AP    | `192.168.1.3`    | Bridge/AP mode only         |
| Clients       | `192.168.1.100+` | DHCP from Pi-hole           |

## ? What's Next?

- Set up DNS-over-HTTPS with `cloudflared`  
- Add malware + tracking blocklists  
- Eventually introduce VLANs and a proper firewall (pfSense?)  

---

This setup gives me a fast, clean, ad-free network with visibility over every device � no more random smart TVs talking to unknown domains, and no more AT&T DNS leaking around my filters. **Total control feels good.**

[? Back to Blog Index](/blog)
