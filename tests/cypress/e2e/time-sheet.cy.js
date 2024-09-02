let icsDebugUrl = new URL(Cypress.config("baseUrl"));
icsDebugUrl.pathname = "test-kaplan-debug.ics";

let icsEmptyUrl = new URL(Cypress.config("baseUrl"));
icsEmptyUrl.pathname = "test-kaplan-empty.ics";

const regexpEscape = (str) => str.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");

describe("check time sheet generation", () => {
  beforeEach(() => {
    cy.visit("/");

    cy.fixture("form-data.json").then((data) => {
      cy.get('input[name="first_name"]').type(data.firstName);
      cy.get('input[name="last_name"]').type(data.lastName);
      cy.get('input[name="employer"]').type(data.employer);

      cy.get("#btn-next").click();

      cy.get('input[name="target_date"]').type(data.targetDate);
    });
  });

  it("should generate a proper time sheet", () => {
    var strftime = require("strftime");
    var strftimeGer = strftime.localizeByIdentifier("de_DE");

    cy.get('input[name="kaplan_ics"]').type(icsDebugUrl.toString());
    cy.get("#btn-next").click();

    cy.get("#btn-next").click();

    cy.fixture("form-data.json").then((data) => {
      cy.get("#download-pdf a")
        .invoke("attr", "download")
        .then((fileName) => {
          cy.get("#download-pdf").click();

          const targetDate = new Date(Date.parse(data.targetDate));
          const content = cy.task("readPdf", `cypress/downloads/${fileName}`);
          content
            .should(
              "match",
              new RegExp(`Dienstgeber:\\s*?${regexpEscape(data.employer.substring(0, 100))}`),
            )
            .should(
              "match",
              new RegExp(
                `Mitarbeiter:\\s*?${regexpEscape(data.lastName.substring(0, 45))}, ${regexpEscape(data.firstName.substring(0, 45))}`,
              ),
            )
            .should(
              "match",
              new RegExp(
                `Aufzeichnung für:\\s*?KW ${regexpEscape(strftimeGer("%W/%Y", targetDate))}`,
              ),
            );

          cy.fixture("dates.json").then((dates) => {
            cy.wrap(dates).each((date) => {
              const dateStart = new Date(Date.parse(date.start));
              const dateEnd = new Date(Date.parse(date.end));

              var dateLine = regexpEscape(strftimeGer("%a. %d.%m.%Y", dateStart)) + "\\s*?";
              dateLine += regexpEscape(date.title.substring(0, 50)) + "\\s*?";
              if (date.role) {
                dateLine += `\\(${regexpEscape(date.role.substring(0, 50))}\\)\\s*?`;
              }
              if (date.location) {
                dateLine += regexpEscape(date.location.substring(0, 50)) + "\\s*?";
              }
              dateLine += `${regexpEscape(strftimeGer("%H:%M", dateStart))}\\s*?–\\s*?${regexpEscape(strftimeGer("%H:%M", dateEnd))}\\s*?`;
              dateLine += "–\\s*?";
              dateLine += "[\\d,]+";

              content.should("match", new RegExp(dateLine, "s"));
            });

            content.should("match", new RegExp(`Summe Dienste:\\s*?${dates.length}`));
          });
        });
    });
  });

  it("should generate a proper empty time sheet", () => {
    var strftime = require("strftime");
    var strftimeGer = strftime.localizeByIdentifier("de_DE");

    cy.get('input[name="kaplan_ics"]').type(icsEmptyUrl.toString());
    cy.get("#btn-next").click();

    cy.get("#btn-next").click();

    cy.fixture("form-data.json").then((data) => {
      cy.get("#download-pdf a")
        .invoke("attr", "download")
        .then((fileName) => {
          cy.get("#download-pdf").click();

          const targetDate = new Date(Date.parse(data.targetDate));
          const content = cy.task("readPdf", `cypress/downloads/${fileName}`);
          content
            .should(
              "match",
              new RegExp(`Dienstgeber:\\s*?${regexpEscape(data.employer.substring(0, 100))}`),
            )
            .should(
              "match",
              new RegExp(
                `Mitarbeiter:\\s*?${regexpEscape(data.lastName.substring(0, 45))}, ${regexpEscape(data.firstName.substring(0, 45))}`,
              ),
            )
            .should(
              "match",
              new RegExp(
                `Aufzeichnung für:\\s*?KW ${regexpEscape(strftimeGer("%W/%Y", targetDate))}`,
              ),
            )
            .should("match", new RegExp(`Keine Dienste`))
            .should("match", new RegExp(`Summe Dienste:\\s*?0`));
        });
    });
  });
});

describe("check time sheet API", () => {
  it("should yield an error without proper week and year", () => {
    const endpoint = new URL("/api/v1/time-sheet/weekly/pdf", Cypress.env("BACKEND_URL"));
    cy.request({
      method: "POST",
      url: endpoint.toString(),
      body: {},
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.include("Year is out of range");
    });
  });

  it("should yield an error with implausible dates", () => {
    const endpoint = new URL("/api/v1/time-sheet/weekly/pdf", Cypress.env("BACKEND_URL"));
    cy.request({
      method: "POST",
      url: endpoint.toString(),
      body: {
        year: 2000,
        week: 1,
        dates: [{ time: { begin: "2000-01-01T10:00:00+0200", end: "2000-01-01T09:00:00+0200" } }],
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.include("invalid time entry");
    });
  });

  it("should yield an error with dates outside specified range", () => {
    const endpoint = new URL("/api/v1/time-sheet/weekly/pdf", Cypress.env("BACKEND_URL"));
    cy.request({
      method: "POST",
      url: endpoint.toString(),
      body: {
        year: 2024,
        week: 1,
        dates: [{ time: { begin: "1970-01-01T00:00:00+0200", end: "1970-01-01T01:00:00+0200" } }],
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.include("outside the calendar week's range");
    });
  });
});
