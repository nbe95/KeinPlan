---
geometry: a4paper,margin=1.5cm
font-size: 12pt
header-includes:
  - \renewcommand\familydefault\sfdefault
  - \usepackage{setspace}
  - \onehalfspacing
  - \usepackage{hyperref}
  - \hypersetup{colorlinks,urlcolor=blue}
  - \usepackage{color}
  - \usepackage{fancyhdr}
  - \hypersetup{pdftex,
      pdftitle={Arbeitszeit {{ employee }} - KW {{ date_start.strftime("%V/%Y") }}},
      pdfcreator={KeinPlan{% if version %} v{{ version }}{% endif%}}}
---
# Dokumentation der täglichen Arbeitszeit nach §17 MiLoG

{% macro texbold(text) -%}
\textbf{{ "{" }}{{ text }}{{ "}" }}
{%- endmacro -%}

\bigskip
\fcolorbox{white}{gray!20}{
  \parbox{\linewidth-2\fboxsep-1\tabcolsep}{
    \begin{tabular}{ll}
      Dienstgeber: & {{ texbold(employer) }} \\
      Mitarbeiter: & {{ texbold(employee) }} \\
      Aufzeichnung für: & \textbf{KW {{ date_start.strftime("%V/%Y") }} } {\small ({{ date_start.strftime("%d.%m.%Y") }} -- {{ date_end.strftime("%d.%m.%Y") }})}
    \end{tabular}
  }
}
\
**Wichtig:** Die Aufzeichnungen sind wöchentlich zu führen. Dabei sind der Beginn, das Ende und die
Dauer der täglichen Arbeitszeit spätestens bis zum Ablauf des siebten auf den Tag der
Arbeitsleistung folgenden Kalendertages aufzuzeichnen.
\

{% if entries %}
|**Datum**|**Anlass**|**Ort**|**Zeitraum**|**Pause**|**Stunden**|
|:-----|:----------|:------|:---:|:---:|--:|
{% for entry in entries -%}
  |
  {{- entry.time_span.begin.strftime("%a. %d.%m.%Y") }}|
  {{- entry.title }}{% if entry.role %} ({{ entry.role }}{% endif %})|
  {{- entry.location }}|
  {{- entry.time_span.begin.strftime("%-H:%M") }} - {{ entry.time_span.end.strftime("%-H:%M") }}|
  {%- if entry.break_span -%}
    {{- entry.break_span.begin.strftime("%-H:%M") }} - {{ entry.break_span.end.strftime("%-H:%M") }}|
  {%- else -%}
    –|
  {%- endif -%}
  {{- "%.2f"|format_locale(entry.calc_hours()) }}|
{% endfor %}
{% endif %}

Alle Stundenangaben sind auf jeweils 15 Minuten auf- oder abgerundet.
\hfill
\fcolorbox{black}{gray!5}{
  \begin{tabular}{ll}
    Summe Dienste: & {{ texbold(entries|length) }} \\
    Summe Stunden: & {{ texbold("%.2f"|format_locale(total_hours)) }} \\
  \end{tabular}
}

\pagestyle{fancy}
\fancyhf{}
\fancyfoot[R]{(\thepage)}
\renewcommand{\headrulewidth}{0pt}
{% if footer -%}
  \fancyfoot[L]{\small
    Generiert {{ generation_time.strftime("am %d.%m.%Y um %-H:%M Uhr") }}
    {% if hyperlink -%}
      von \href{{ "{" }}{{ hyperlink }}{{ "}" }}{KeinPlan} {%- if version %} v{{ version }} {%- endif-%}
    {%- endif-%}.
  }
{%- endif %}
