ARG PYTHON_BASE=3.12-slim


# Build stage for pdm modules
FROM python:$PYTHON_BASE AS builder

WORKDIR /keinplan-backend

RUN pip install -U pdm
ENV PDM_CHECK_UPDATE=false

COPY pyproject.toml pdm.lock ./
COPY src/ ./src

RUN pdm install --check --prod --no-editable


# Run stage
FROM python:$PYTHON_BASE

WORKDIR /keinplan-backend

RUN apt-get update && apt-get install -y --no-install-recommends \
    texlive \
    texlive-science \
    lmodern \
    locales \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN sed -i '/de_DE.UTF-8/s/^# //g' /etc/locale.gen \
    && locale-gen
ENV LC_ALL=de_DE.utf8

# Retrieve installed python packages from build stage
COPY --from=builder /keinplan-backend/.venv/ ./.venv
ENV PATH="/keinplan-backend/.venv/bin:$PATH"

COPY src/ ./src/

EXPOSE 8080

ARG VERSION
ARG VERSION_SHA
ENV KEINPLAN_VERSION="${VERSION}"
ENV KEINPLAN_VERSION_SHA="${VERSION_SHA}"

CMD ["waitress-serve", "--port", "8080", "src.keinplan_backend.main:backend"]
