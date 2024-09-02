describe("check KaPlan date handling", () => {
  let icsDebugUrl = new URL(Cypress.config("baseUrl"));
  icsDebugUrl.pathname = "test-kaplan-debug.ics";

  let icsEmptyUrl = new URL(Cypress.config("baseUrl"));
  icsEmptyUrl.pathname = "test-kaplan-empty.ics";

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

  it("should display dates correctly", () => {
    var strftime = require("strftime");
    var strftimeGer = strftime.localizeByIdentifier("de_DE");

    cy.get('input[name="kaplan_ics"]').type(icsDebugUrl.toString());

    cy.get("#btn-next").click();

    cy.get('main div[role="alert"]').should("not.exist");

    cy.fixture("dates.json").then((dates) => {
      cy.wrap(dates).each((date) => {
        const card = cy.get(`main div[data-uid="${date.uid}"]`).should("exist");

        card.should("contain.text", date.title ?? "Gottesdienst");
        if (date.role) {
          card.should("contain.text", date.role);
        }
        if (date.location) {
          card.should("contain.text", date.location);
        }
        if (date.start && date.end) {
          const start = new Date(Date.parse(date.start));
          const end = new Date(Date.parse(date.end));
          card.should(
            "contain.text",
            `${strftimeGer("%H:%M", start)} – ${strftimeGer("%H:%M", end)}`,
          );
          card.should("contain.text", `${strftimeGer("%a%d%b", start)}`);
        }
      });
    });
  });

  it("should give note when no dates", () => {
    cy.get('input[name="kaplan_ics"]').type(icsEmptyUrl.toString());

    cy.get("#btn-next").click();

    cy.get("main .date-card").should("not.exist");
    cy.get('main div[role="alert"]').should("exist").contains("keine Termine");
  });
});
