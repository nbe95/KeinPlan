ARG PYTHON_BASE=3.12-slim


# Build stage for pdm modules
FROM python:$PYTHON_BASE AS builder

WORKDIR /app

RUN pip install -U pdm
ENV PDM_CHECK_UPDATE=false

COPY pyproject.toml pdm.lock ./
COPY src/ ./src

RUN pdm install --check --prod --no-editable


# Run stage (uses heave texlive base image for slim deployments)
FROM nbe95/keinplan-texlive:latest

WORKDIR /app

# Retrieve installed python packages from build stage
COPY --from=builder /app/.venv/ ./.venv
ENV PATH="/app/.venv/bin:$PATH"

COPY src/ ./src/

EXPOSE 8080

ARG VERSION
ARG VERSION_SHA
ENV KEINPLAN_VERSION="${VERSION}"
ENV KEINPLAN_VERSION_SHA="${VERSION_SHA}"

CMD ["waitress-serve", "--port", "8080", "src.keinplan_backend:backend"]
