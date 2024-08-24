---
geometry: a4paper,margin=1.5cm
font-size: 13pt
header-includes:
  - \renewcommand\familydefault\sfdefault
  - \usepackage{setspace}
  - \onehalfspacing
  - \usepackage{hyperref}
  - \hypersetup{colorlinks,urlcolor=blue}
  - \usepackage{array}
  - \usepackage{calc}
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
\def\arraystretch{1.3}
\begin{tabular}{ll}
  Dienstgeber: & {{ texbold(employer) }} \\
  Mitarbeiter: & {{ texbold(employee) }} \\
  Aufzeichnung für: & \textbf{KW {{ date_start.strftime("%V/%Y") }} } {\small ({{ date_start.strftime("%d.%m.%Y") }} -- {{ date_end.strftime("%d.%m.%Y") }})}
\end{tabular}
\bigskip
\def\arraystretch{1.2}

{% if entries %}
|**Datum**|**Anlass**|**Ort**|**Zeitraum**|**Pause**|**Stunden**|
|:-----|:----------|:------|:---:|:---:|--:|
{% for entry in entries -%}
  |
  {{- entry.time_span.begin.strftime("%a. %d.%m.%Y") }}|
  {{- entry.title }}{% if entry.role %} ({{ entry.role }}{% endif %})|
  {{- entry.location }}|
  {{- entry.time_span.begin.strftime("%-H:%M") }} – {{ entry.time_span.end.strftime("%-H:%M") }}|
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
\def\arraystretch{1.0}
\mbox{
  \setlength{\tabcolsep}{10pt}
  \begin{tabular}{rr<{\hspace{-\tabcolsep}}}
    Summe Dienste: & {{ texbold(entries|length) }} \\
    Summe Stunden: & {{ texbold("%.2f"|format_locale(total_hours)) }} \\
  \end{tabular}
}

\vfill
**Wichtig:** Die Aufzeichnungen sind wöchentlich zu führen. Dabei sind der Beginn, das Ende und die
Dauer der täglichen Arbeitszeit spätestens bis zum Ablauf des siebten auf den Tag der
Arbeitsleistung folgenden Kalendertages aufzuzeichnen.

\pagestyle{fancy}
\fancyhf{}
\fancyfoot[R]{(\thepage)}
\renewcommand{\headrulewidth}{0pt}
{% if footer -%}
  \fancyfoot[L]{\small
    Generiert
    {{ generation_time.strftime("am %d.%m.%Y um %-H:%M Uhr") }}
    von
    {%- if hyperlink %}
      \href{{ "{" }}{{ hyperlink }}{{ "}" }}{KeinPlan}
    {%- else %}
      KeinPlan
    {%- endif -%}
    {%- if version %}
      v{{ version }}
    {%- endif -%}.
  }
{%- endif %}
