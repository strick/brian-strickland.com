---
title: "Setting Up Pi-hole with DHCP and Static IP on a Debian Mac Mini"
date: "2025-10-25T17:31:00"
slug: "pihole-dhcp-static-ip-debian-mac-mini"
---

## Setting Up Pi-hole with DHCP and Static IP on a Debian Mac Mini

### Goal
Transform an old Mac Mini into a dedicated Pi-hole server with full DNS and DHCP control. Ensure the system has a static IPv4 address to avoid losing connectivity on reboot or DHCP lease issues.

### Environment
- Mac Mini (Intel) running Debian 12
- Pi-hole installed via curl method
- AT&T BGW320 router
- Pi-hole to serve DNS and DHCP

### Install Pi-hole
```bash
curl -sSL https://install.pi-hole.net | bash
```

**Selected options during guided setup:**
- Interface: `enp1s0f0`
- IPv4 only (initially)
- Upstream DNS: OpenDNS + Cloudflare
- Enabled web UI and logging

### Enable DHCP in Pi-hole
1. Log into `http://pi.hole/admin`
2. Go to Settings → DHCP
3. Enable DHCP server
4. Set range: `192.168.1.100` to `192.168.1.150`
5. Gateway: `192.168.1.254`

Disabled DHCP on the AT&T BGW320 router as much as allowed.

### Bug Encountered: No IPv4 After Reboot
After rebooting the Mac Mini, Pi-hole failed to serve DNS. `ip a` showed only a `169.254.x.x` address (self-assigned).

#### Diagnosis:
- Cause: Debian minimal install didn’t have `dhcpcd`
- Static IP config wasn’t applying
- DHCP fallback failed because Pi-hole was its own DHCP server

### Fix: Install DHCP Client and Static IP Config

#### Step 1: Install dhcpcd
```bash
sudo apt update
sudo apt install dhcpcd5
```

#### Step 2: Edit `/etc/dhcpcd.conf`
At the bottom of the file:
```ini
interface enp1s0f0
static ip_address=192.168.1.78/24
static routers=192.168.1.254
static domain_name_servers=127.0.0.1
```

#### Step 3: Mistake I Made
Originally wrote:
```ini
static routers=192.168.1.254/24
```
This failed silently. Removing `/24` fixed it.

#### Step 4: Restart DHCP Client
```bash
sudo systemctl enable dhcpcd
sudo systemctl restart dhcpcd
```

### Confirmed Working
After reboot:
```bash
ip a
```
Showed:
```bash
inet 192.168.1.78/24 scope global enp1s0f0
```

Also confirmed:
```bash
nslookup google.com 192.168.1.78
```
Resolved correctly through Pi-hole.

### Lessons Learned
- Always double-check interface names with `ip a`
- `dhcpcd` is not always installed by default on Debian minimal
- Syntax errors in `dhcpcd.conf` won’t necessarily throw errors — always verify with `ip a`
- Setting up DNS + DHCP on the same box is reliable with proper ordering and config

_Written by Brian, for future reference and anyone troubleshooting Pi-hole static IPs on Debian._
