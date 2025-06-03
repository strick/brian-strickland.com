---
title: "Segmented Home Network Lab Setup with VLANs"
date: "2025-02-22T20:12:00"
slug: "segmented-home-network-lab"
---

### Segmented Home Network Lab Setup with VLANs

After weeks of tinkering, I finalized a segmented home network lab that supports IoT isolation, Home Assistant control, and smart device access to the internet while maintaining traffic boundaries. This post documents my final setup, port configurations, VLAN assignments, and key learnings.

---

#### 🧠 Network Design Goals
- Isolate IoT devices (like Alexa, smart lights, etc.) from main devices
- Provide a secure path for Home Assistant to control IoT devices
- Allow Alexa and others to access the internet
- Support multiple subnets via VLANs
- Enable future scalability and visibility for SOC experiments

---

#### 🛠️ Equipment Overview

| Device                     | IP Address       | Purpose                                 |
|---------------------------|------------------|-----------------------------------------|
| AT&T Router               | 192.168.1.254    | Primary Internet Gateway (VLAN 1)       |
| TP-Link 8-Port Switch     | 192.168.1.104    | Main switch for routing tagged traffic  |
| TP-Link 5-Port Switch     | 192.168.1.105    | IoT/VLAN uplink + WAVLINK bridge        |
| WAVLINK Router            | 192.168.10.1     | IoT Router for 192.168.10.0/24 subnet   |
| Home Assistant (Beelink) | 192.168.1.113 / 192.168.10.2 | Main automation server (dual VLAN access) |

---

#### 🧩 VLAN Summary

| VLAN ID | Purpose         | Subnet             |
|---------|------------------|---------------------|
| 1       | Main Network    | 192.168.1.0/24      |
| 10      | IoT Devices     | 192.168.10.0/24     |

---

#### 🔌 TP-Link 5-Port Switch (192.168.1.105)

| Port | Description             | VLANs  | Tagged | Untagged |
|------|--------------------------|--------|--------|----------|
| 1    | Uplink to AT&T Router    | 1, 10  | No     | Yes      |
| 3    | To WAVLINK LAN port      | 10     | No     | Yes      |
| 4    | To WAVLINK WAN port      | 1      | No     | Yes      |
| 5    | Uplink to 8-Port Switch  | 1, 10  | 10     | 1        |

---

#### 🔌 TP-Link 8-Port Switch (192.168.1.104)

| Port | Description              | VLANs  | Tagged | Untagged |
|------|---------------------------|--------|--------|----------|
| 1    | General Devices/PCs       | 1      | No     | Yes      |
| 4    | Home Assistant (HA)       | 1, 10  | No     | Yes (1)  |
| 7    | IoT Devices / Alexa       | 10     | No     | Yes      |
| 8    | From 5-Port Switch (uplink)| 1, 10 | 10     | 1        |

---

#### 🔄 Traffic Flow Breakdown
- **VLAN 1 (Main)** is the core network. It routes to the AT&T router and provides general internet access.
- **VLAN 10 (IoT)** is isolated from VLAN 1, routed internally by the WAVLINK router, and all IoT traffic stays here unless routed via HA.
- **Tagged traffic** on uplink ports ensures inter-VLAN communication only where needed.
- **HA device** is dual-homed using a VLAN subinterface (`enp1s0.10`) to access both VLAN 1 and VLAN 10.
- **Alexa devices** get internet access through VLAN 10 + NAT on WAVLINK.

---

#### 🧪 Lessons Learned
- Getting VLAN tagging and switch port isolation right took many iterations
- WAVLINK needs to stay in **router mode** to provide NAT for IoT
- **Tagged VLAN uplinks** are essential for proper segmentation
- `tcpdump` is a lifesaver when debugging inter-VLAN ping failures
- **mDNS doesn’t always cross VLANs** — direct IP control for devices like Kasa works better

---

This setup gives me a strong foundation for building secure, scalable smart home automations while isolating potentially insecure devices. Next step? Integrate firewall rules and logging for SOC visibility!

---

<small>Created: June 2, 2025</small>
