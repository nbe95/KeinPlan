let icsDebugUrl = new URL(Cypress.config("baseUrl"));
icsDebugUrl.pathname = "test-kaplan-debug.ics";

let icsEmptyUrl = new URL(Cypress.config("baseUrl"));
icsEmptyUrl.pathname = "test-kaplan-empty.ics";

const regexpEscape = (str) => str.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
const formatInput = (str, maxLen = undefined) => regexpEscape(str.substr(0, maxLen));
const makeRegExp = (regexp) => new RegExp(regexp.replaceAll(/\s+/g, "\\s*?"));

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
          let endDate = new Date();
          endDate.setDate(targetDate.getDate() + 6);
          cy.task("readPdf", `cypress/downloads/${fileName}`).then((pdf) => {
            cy.wrap(pdf.text)
              .should("match", makeRegExp(`Dienstgeber: ${formatInput(data.employer, 100)}`))
              .should(
                "match",
                makeRegExp(
                  `Mitarbeiter: ${formatInput(data.lastName, 45)}, ${formatInput(data.firstName, 45)}`,
                ),
              )
              .should(
                "match",
                makeRegExp(
                  `Aufzeichnung für: ${formatInput(strftimeGer("KW %W/%Y", targetDate))} \\(${strftimeGer("%d.%m.%Y", targetDate)} \u0015 ${strftimeGer("%d.%m.%Y", endDate)}\\)`,
                ),
              );

            cy.fixture("dates.json").then((dates) => {
              cy.wrap(dates).each((date) => {
                const dateStart = new Date(Date.parse(date.start));
                const dateEnd = new Date(Date.parse(date.end));

                const headLine = `${formatInput(strftimeGer("%A, %d.%m.%Y", dateStart))} [\\d,]+ h`;
                var dateLine = `${formatInput(strftimeGer("%H:%M", dateStart))} \u0015 ${formatInput(strftimeGer("%H:%M", dateEnd))} `;
                if (date.location) {
                  dateLine += formatInput(date.location, 50) + " ";
                }
                dateLine += formatInput(date.title, 50) + " ";
                if (date.role) {
                  dateLine += `\\(${formatInput(date.role, 50)}\\) `;
                }
                dateLine += "[\\d,]+ h";

                cy.wrap(pdf.text)
                  .should("match", makeRegExp(headLine))
                  .should("match", makeRegExp(dateLine));
              });

              cy.wrap(pdf.text).should("match", makeRegExp(`Summe Dienste: ${dates.length}`));
            });
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
          let endDate = new Date();
          endDate.setDate(targetDate.getDate() + 6);
          cy.task("readPdf", `cypress/downloads/${fileName}`).then((pdf) => {
            cy.wrap(pdf.text)
              .should("match", makeRegExp(`Dienstgeber: ${formatInput(data.employer, 100)}`))
              .should(
                "match",
                makeRegExp(
                  `Mitarbeiter: ${formatInput(data.lastName, 45)}, ${formatInput(data.firstName, 45)}`,
                ),
              )
              .should(
                "match",
                makeRegExp(
                  `Aufzeichnung für: ${formatInput(strftimeGer("KW %W/%Y", targetDate))} \\(${strftimeGer("%d.%m.%Y", targetDate)} \u0015 ${strftimeGer("%d.%m.%Y", endDate)}\\)`,
                ),
              )
              .should("match", makeRegExp(`Keine Dienste`))
              .should("match", makeRegExp(`Summe Dienste: 0`));
          });
        });
    });
  });

  it("should generate correct metadata", () => {
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
          cy.task("readPdf", `cypress/downloads/${fileName}`).then((pdf) => {
            cy.wrap(pdf.info).its("Author").should("equal", `${data.lastName}, ${data.firstName}`);
            cy.wrap(pdf.info).its("Creator").should("include", "KeinPlan");
            cy.wrap(pdf.info)
              .its("Title")
              .should(
                "equal",
                `Arbeitszeit ${data.lastName}, ${data.firstName} - ${strftimeGer("KW %W/%Y", targetDate)}`,
              );
          });
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

  it("should yield an error with invalid dates", () => {
    const endpoint = new URL("/api/v1/time-sheet/weekly/pdf", Cypress.env("BACKEND_URL"));
    cy.request({
      method: "POST",
      url: endpoint.toString(),
      body: {
        year: 2000,
        week: 1,
        dates: [{ start_date: "foo", end_date: "2000-01-01T09:00:00+0200" }],
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.include("Invalid time entry");
    });
  });

  it("should yield an error with incomplete dates", () => {
    const endpoint = new URL("/api/v1/time-sheet/weekly/pdf", Cypress.env("BACKEND_URL"));
    cy.request({
      method: "POST",
      url: endpoint.toString(),
      body: {
        year: 2000,
        week: 1,
        dates: [{ end_date: "2000-01-01T09:00:00+0200" }],
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.include("Invalid time entry");
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
        dates: [{ start_date: "2000-01-01T10:00:00+0200", end_date: "2000-01-01T09:00:00+0200" }],
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.include("Invalid time entry");
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
        dates: [{ start_date: "1970-01-01T00:00:00+0200", end_date: "1970-01-01T01:00:00+0200" }],
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.include("outside the calendar week's range");
    });
  });
});
