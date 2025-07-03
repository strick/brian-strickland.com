---
title: "Adding a Clean Tag System to My Hugo Blog with a Sidebar Tag Cloud"
date: "2025-06-24T20:49:00"
tags: [hugo, sidebar, tag, cloud]
slug: "hugo-sidebar-tag-cloud"
---

<p>I recently added a tag system to my Hugo blog and wanted to keep things clean without cluttering the post list. Rather than listing tags inline under each post, I created a tag cloud in the sidebar. This made the blog more scannable, helped surface recurring themes, and aligned with a minimalist layout.</p>

<p>Here's what I implemented:</p>

<ol>
  <li><strong>Front Matter Tags</strong>: Each post now has a <code>tags:</code> array in the YAML front matter, like:</li>
</ol>

<pre><code class="language-yaml">tags: [hugo, static-sites, devops]
</code></pre>

<ol start="2">
  <li><strong>Taxonomy Setup</strong>: In <code>config.toml</code>, I defined:</li>
</ol>

<pre><code class="language-toml">[taxonomies]
  tag = "tags"
</code></pre>

<ol start="3">
  <li><strong>Tag Index Pages</strong>: I added <code>_default/terms.html</code> to list all tags and <code>_default/taxonomy.html</code> to show all posts per tag.</li>
  <li><strong>Sidebar Partial</strong>: I created <code>layouts/partials/tags-sidebar.html</code> with sorted tag links and counts. This was then included on the blog list page as a second column.</li>
  <li><strong>Sorted by Popularity</strong>: Tags in the sidebar are sorted by usage:</li>
</ol>

<pre><code class="language-html">{{ range sort site.Taxonomies.tags "Count" "desc" }}
</code></pre>

<h3>Result</h3>
<p>Clean main content. Navigable tags. Useful structure that doesn't overwhelm the page.</p>

<p>This is a great pattern if you're using Hugo for a personal blog or project site and want lightweight taxonomy without a plugin system.</p>

<p>Let me know if you'd like to see the exact source snippets I used!</p>
