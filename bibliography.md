---
layout: page
title: Bibliography
permalink: /bibliography/
---

References
==========
{% assign max_year = site.time | date: '%Y' %}
{% for year in (site.data.bib.min_year..max_year) reversed %}
  {{ year }}
  {% bibliography --file all --query @*[year={{year}}] %}
{% endfor %}
