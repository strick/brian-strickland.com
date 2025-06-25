---
title: "Building a Lightweight Home SOC with Kibana, Zeek, and Suricata"
date: "2025-03-21T20:20:00"
slug: "home-soc-kibana-zeek-suricata"
tags: [soc, kibana, zeek, suricata, security]
---

<p>As part of my home cybersecurity lab, I set out to build a streamlined, resource-conscious Security Operations Center (SOC) using <strong>Zeek</strong>, <strong>Suricata</strong>, and <strong>Kibana</strong>. The goal was to get visibility into network activity, detect suspicious behavior, and eventually enrich the logs with GeoIP and custom dashboards.</p>

<h2>System Overview</h2>
<ul>
  <li><strong>Kibana + Elasticsearch</strong>: Deployed and running on local hardware</li>
  <li><strong>Zeek</strong>: Passive network monitoring and protocol analysis</li>
  <li><strong>Suricata</strong>: IDS/IPS engine for threat detection</li>
</ul>

<h2>Setup Process</h2>
<ol>
  <li>Installed Zeek and Suricata on the same box to monitor mirrored traffic from my network switch</li>
  <li>Configured Zeek to generate connection logs, DNS, HTTP, and SSL traffic analysis</li>
  <li>Enabled EVE JSON output in Suricata for compatibility with log shippers</li>
  <li>Deployed Filebeat as the log shipper to forward both Zeek and Suricata logs into Elasticsearch</li>
</ol>

<h2>Next Steps</h2>
<ul>
  <li><strong>GeoIP enrichment</strong> – Plan to enrich IP logs with location data using Logstash or ingest pipelines</li>
  <li><strong>Dashboards</strong> – Working on building visualizations for top talkers, anomalies, and event correlation</li>
  <li><strong>Alerting</strong> – Looking into ElastAlert or native Kibana alerts for suspicious events</li>
</ul>

<h2>Why This Setup?</h2>
<p>This stack offers great flexibility and transparency for home lab security monitoring. Zeek gives me deep packet-level inspection, Suricata provides threat signatures, and Kibana lets me explore, visualize, and ultimately automate response logic — all with full control and zero reliance on the cloud.</p>

<p>More to come as I refine the setup with additional enrichment, automation, and tuning.</p>
