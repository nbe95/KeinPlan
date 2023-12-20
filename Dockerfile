FROM python:3-slim

WORKDIR /keinplan/

RUN apt-get update && apt-get install -y --no-install-recommends \
    texlive \
    lmodern \
    pandoc \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY templates/ templates/

EXPOSE 80

CMD pandoc -o ./out.pdf ./templates/timesheet.jinja.md
