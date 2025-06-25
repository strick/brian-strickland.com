---
title: "How I Rebuilt My Home Network with Pi-hole and Killed ISP DNS Leaks for Good"
date: "2025-06-18T21:12:00"
slug: "pi-hole-home-network-rebuild"
tags: [networking, pi-hole, dns, home-lab]
---

Like many home lab enthusiasts, I wanted more control over my network, not just to block ads, but to make sure every device in my house used a secure, filtered DNS resolver. That meant one thing: rebuilding my network around **Pi-hole**, disabling my ISP's DNS, and turning a cluttered setup into a clean, reliable, ad-free environment.

## My Goals

- Replace AT&T router's DNS and DHCP with Pi-hole  
- Set up a headless Pi-hole server on an old Mac Mini  
- Use my WAVLINK router as a pure Access Point  
- Disable IPv6 DNS leaks (AT&T is notorious for this)  
- Have full visibility and control over DNS activity  
- Encrypt all DNS using DNS-over-HTTPS (DoH) with Cloudflare

## Hardware & Network Details

- **Mac Mini**: Debian 12 (headless, static IP)  
- **WAVLINK**: Bridged Access Point Mode  
- **AT&T Router**: Gateway only, DHCP/IPv6 off  

## Step-by-Step Setup

### 1. Rebuilt Pi-hole on Mac Mini

- Installed Debian 12 headless with LVM  
- Set static IP: `192.168.1.2`  
- Installed Pi-hole using:
  ```bash
  curl -sSL https://install.pi-hole.net | bash
  ```
- Set upstream DNS to `127.0.0.1#5053` (we’ll configure DoH next)  
- Enabled Web UI and query logging  
- Enabled DHCP in Pi-hole with range: `192.168.1.100 – 192.168.1.200`

### 2. Disabled DHCP on AT&T Router

- Logged into `192.168.1.254`  
- Turned off DHCP under Subnets & DHCP

### 3. Configured WAVLINK as Access Point

- Switched to AP mode (LAN Bridge)  
- Set static IP: `192.168.1.3`  
- Disabled DHCP and set DNS to Pi-hole (`192.168.1.2`)

### 4. Installed and Configured `cloudflared` for DoH

Installed Cloudflare’s official DoH proxy:

```bash
sudo apt install curl gnupg lsb-release -y
curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg | sudo gpg --dearmor -o /usr/share/keyrings/cloudflare-main.gpg
echo "deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/cloudflared.list
sudo apt update
sudo apt install cloudflared -y
```

Created a system user for cloudflared:

```bash
sudo useradd -r -s /usr/sbin/nologin cloudflared
```

Created and enabled a systemd service to run DoH on port 5053:

```bash
sudo tee /etc/systemd/system/cloudflared.service > /dev/null <<EOF
[Unit]
Description=cloudflared DNS over HTTPS proxy
After=network.target

[Service]
User=cloudflared
ExecStart=/usr/bin/cloudflared proxy-dns --port 5053 \
  --upstream https://1.1.1.1/dns-query \
  --upstream https://1.0.0.1/dns-query
AmbientCapabilities=CAP_NET_BIND_SERVICE
NoNewPrivileges=true
Restart=on-failure
RestartSec=5s

[Install]
WantedBy=multi-user.target
EOF
```

Started and enabled the service:

```bash
sudo systemctl daemon-reexec
sudo systemctl daemon-reload
sudo systemctl enable cloudflared
sudo systemctl start cloudflared
```

Tested the local DoH proxy:

```bash
dig @127.0.0.1 -p 5053 google.com
```

### 5. Locked DNS Resolution to Pi-hole

Updated `/etc/resolv.conf`:

```conf
nameserver 127.0.0.1
```

Locked it to prevent overwrite:

```bash
sudo chattr +i /etc/resolv.conf
```

### 6. IPv6 Hardening

- Disabled IPv6 in AT&T router settings  
- Disabled IPv6 on Windows PCs  
- Confirmed `dig` now resolves strictly via Pi-hole + DoH

## Final IP Layout

| Device        | IP Address       | Notes                       |
|---------------|------------------|-----------------------------|
| AT&T Router   | `192.168.1.254`  | Gateway only                |
| Pi-hole       | `192.168.1.2`    | DNS + DHCP + DoH            |
| WAVLINK AP    | `192.168.1.3`    | Bridge/AP mode only         |
| Clients       | `192.168.1.100+` | DHCP from Pi-hole           |

## What's Next?

- Add malware + tracking blocklists  
- Introduce VLANs and firewall (maybe pfSense)  
- Set up a failover DNS or backup filtering node  

---

This setup gives me a fast, encrypted, ad-free network with full visibility and no ISP DNS leaks. Every device on my network is now filtered through Pi-hole and all DNS is encrypted using Cloudflare DoH. **It just works — and it feels awesome.**

[Back to Blog Index](/blog)
