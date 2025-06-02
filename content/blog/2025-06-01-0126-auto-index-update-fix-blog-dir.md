---
title: "Fixing Auto Index Updates for Blog Directory"
date: 2025-06-01T00:00:00
slug: fixing-auto-index-updates
---

After implementing auto-blog publishing with a secure Azure Function and GitHub integration, I realized the blog post list wasn't updating correctly. The issue? I was accidentally updating `/index.html` instead of `/blog/index.html`.

Today I corrected the path in the API script to commit updates to the right file. Now, every blog post automatically adds a link to `blog/index.html` and each post includes a "Back to blog" link for smooth navigation. With this fix, the blog workflow is fully automated from content creation to listing!
