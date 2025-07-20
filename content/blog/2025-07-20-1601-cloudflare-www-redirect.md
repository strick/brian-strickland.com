---
title: "Fixed Non-WWW Redirects Using Cloudflare on Azure Static Web Apps"
date: "2025-07-20T15:12:00"
slug: "cloudflare-www-redirect"
tags: [cloudflare, azure, hugo, static-site, dns]
---

<p>I ran into an issue where <code>cyberreadykids.com/thelink</code> would fail, even though the base URL <code>cyberreadykids.com</code> redirected properly to <code>www.cyberreadykids.com</code>. Since I’m hosting my static site using Hugo on Azure Static Web Apps and using GoDaddy for domain registration, the issue came down to path handling and SSL.</p>

<h2>The Problem</h2>
<p>GoDaddy’s default forwarding doesn’t preserve paths — it only forwards the root domain. So <code>cyberreadykids.com</code> would redirect, but anything like <code>/thelink</code> would break. Worse, there was no SSL certificate for the root domain when accessed without www, resulting in an <strong>ERR_SSL_VERSION_OR_CIPHER_MISMATCH</strong> error on some devices.</p>

<h2>The Solution</h2>
<p>I moved DNS from GoDaddy to <strong>Cloudflare</strong> and set up a wildcard redirect that preserves both the path and the query string.</p>

<h3>Cloudflare Redirect Rule</h3>
<ul>
  <li><strong>Request URL:</strong> <code>https://cyberreadykids.com/*</code></li>
  <li><strong>Target URL:</strong> <code>https://www.cyberreadykids.com/${1}</code></li>
  <li><strong>Status Code:</strong> 301 (Permanent Redirect)</li>
  <li><strong>Preserve query string:</strong> ✅ Enabled</li>
</ul>

<h2>Additional Fix: Azure SSL for Root Domain</h2>
<p>Cloudflare handled the redirect, but I also needed to add <code>cyberreadykids.com</code> as a custom domain in the Azure Static Web App to provision a valid SSL cert. Once added and verified, HTTPS started working properly for the non-www version as well.</p>

<h2>Lessons Learned</h2>
<ul>
  <li>GoDaddy DNS forwarding is extremely limited — it doesn’t handle paths or query strings.</li>
  <li>Azure Static Web Apps doesn’t support hostname-based redirects out of the box.</li>
  <li>Cloudflare gives full control over redirects, query strings, and SSL termination.</li>
  <li>Mobile devices may take longer to pick up DNS changes due to aggressive caching — toggling airplane mode helps.</li>
</ul>

<h2>Now It Just Works™</h2>
<p>All URLs, including paths and query parameters, now redirect perfectly from <code>cyberreadykids.com</code> to <code>www.cyberreadykids.com</code>. SSL is valid, the static site is fully functional, and I’ve got better DNS control moving forward thanks to Cloudflare.</p>
