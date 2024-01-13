---
geometry: a4paper,margin=1.5cm
font-size: 11pt
header-includes:
  - \renewcommand\familydefault\sfdefault
  - \usepackage{setspace}
  - \onehalfspacing
  - \usepackage{hyperref}
  - \hypersetup{colorlinks,urlcolor=blue}
---
# Dokumentation der täglichen Arbeitszeit nach §17 MiLoG

**Wichtig:** Die Aufzeichnungen sind wöchentlich zu führen. Dabei sind der
Beginn, das Ende und die Dauer der täglichen Arbeitszeit spätestens bis zum
Ablauf des siebten auf den Tag der Arbeitsleistung folgenden Kalendertages
aufzuzeichnen.

---

* Dienstgeber: **{{ employer }}**
* Name, Vorname des Mitarbeiters: **{{ employee }}**
* Aufzeichnung für die **Kalenderwoche {{ date_start.strftime("%V/%Y") }}** ({{ date_start.strftime("%d.%m.%Y") }} bis {{ date_end.strftime("%d.%m.%Y") }})
\

{% if entries %}
|**Datum**|**Anlass, Ort**|**Tätigkeit**|**Zeitraum**|**Pause**|**Stunden**|
|:---|:--------|:-|:-:|:-:|-:|
{% for entry in entries -%}
  |
  {{- entry.time_span.begin.strftime("%a. %d.%m.%Y") }}|
  {{- entry.title }}, {{ entry.location }}|
  {{- entry.role }}|
  {{- entry.time_span.begin.strftime("%-H:%M") }} - {{ entry.time_span.end.strftime("%-H:%M") }}|
  {%- if entry.break_span -%}
    {{- entry.break_span.begin.strftime("%-H:%M") }} - {{ entry.break_span.end.strftime("%-H:%M") }}|
  {%- else -%}
    –|
  {%- endif -%}
  {{- "%.2f"|format_locale(entry.calc_hours()) }}|
{% endfor %}
Summe Dienste: **{{ entries|length }}**\
Summe Stunden: **{{ "%.2f"|format_locale(total_hours) }}**\

{% else -%}
*Keine Dienste in diesem Zeitraum vorhanden.*\

{% endif %}
{% if footer -%}
    Generiert {{ generation_time.strftime("am %d.%m.%Y um %-H:%M Uhr") }}
    {% if hyperlink -%}
        von _[KeinPlan]({{ hyperlink }})_
        {%- if version %}
            _v{{ version }}_
        {% endif-%}
    {%- endif-%}.
{%- endif %}
