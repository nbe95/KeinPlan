FROM python:3-slim

WORKDIR /keinplan-backend/

RUN apt-get update && apt-get install -y --no-install-recommends \
    texlive \
    lmodern \
    pandoc \
    locales \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN sed -i '/de_DE.UTF-8/s/^# //g' /etc/locale.gen \
    && locale-gen
ENV LC_ALL de_DE.utf8

COPY requirements.txt .
COPY src/ src/

RUN python -m pip install -r requirements.txt

EXPOSE 8080

ARG VERSION
ENV KEINPLAN_VERSION ${VERSION}
ENV GITHUB_LINK https://github.com/nbe95/KeinPlan

CMD waitress-serve --port 8080 src.main:backend
