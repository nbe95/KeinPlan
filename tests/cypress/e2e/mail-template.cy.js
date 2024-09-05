describe("check email template", () => {
  let icsUrl = new URL(Cypress.config("baseUrl"));
  icsUrl.pathname = "test-kaplan-debug.ics";

  beforeEach(() => {
    cy.visit("/");

    cy.fixture("form-data.json").then((data) => {
      cy.get('input[name="first_name"]').type(data.firstName);
      cy.get('input[name="last_name"]').type(data.lastName);
      cy.get('input[name="employer"]').type(data.employer);

      cy.get("#btn-next").click();

      cy.get('input[name="target_date"]').type(data.targetDate);
      cy.get('input[name="kaplan_ics"]').type(icsUrl.toString());

      cy.get("#btn-next").click();

      cy.get("#btn-next").click();
    });
  });

  it("should give correct mailto link", () => {
    var strftime = require("strftime");
    var strftimeGer = strftime.localizeByIdentifier("de_DE");

    cy.fixture("form-data.json").then((data) => {
      cy.get("#open-mail-template")
        .invoke("attr", "href")
        .then((href) => {
          const url = new URL(href);
          cy.wrap(url.protocol).should("equal", "mailto:");
          cy.wrap(url.host).should("exist"); // Cannot manipulate env var when testing
          cy.wrap(url.searchParams.get("subject"))
            .should("exist")
            .should("include", data.firstName)
            .should("include", data.lastName)
            .should("include", strftimeGer("%W/%Y"));
          cy.wrap(url.searchParams.get("body"))
            .should("exist")
            .should("include", data.firstName)
            .should("include", data.lastName)
            .should("include", strftimeGer("%W/%Y"));
        });
    });
  });
});
