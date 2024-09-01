describe("test step functionalities", () => {
  let icsUrl = new URL(Cypress.config("baseUrl"));
  icsUrl.pathname = "test-kaplan-debug.ics";

  beforeEach(() => {
    cy.visit("/");
  });

  it("should be possible to navigate forward and backward", () => {
    cy.get("#stepper ol li:nth-child(1)").should("have.class", "active");
    cy.get("#stepper ol li:not(:nth-child(1)").should("not.have.class", "active");

    cy.get('input[name="first_name"]').type("der Vorname");
    cy.get('input[name="last_name"]').type("der Nachname");
    cy.get('input[name="employer"]').type("der Dienstgeber");

    cy.get("#btn-next").click();

    cy.get("#stepper ol li:nth-child(2)").should("have.class", "active");
    cy.get("#stepper ol li:not(:nth-child(2)").should("not.have.class", "active");
    cy.get('input[name="target_date"]').type("2024-09-02");
    cy.get('input[name="kaplan_ics"]').type(icsUrl.toString());

    cy.get("#btn-next").click();

    cy.get("#stepper ol li:nth-child(3)").should("have.class", "active");
    cy.get("#stepper ol li:not(:nth-child(3)").should("not.have.class", "active");

    cy.get("#btn-next").click();

    cy.get("#stepper ol li:nth-child(4)").should("have.class", "active");
    cy.get("#stepper ol li:not(:nth-child(4)").should("not.have.class", "active");

    cy.get("#btn-prev").click();

    cy.get("#stepper ol li:nth-child(3)").should("have.class", "active");
    cy.get("#stepper ol li:not(:nth-child(3)").should("not.have.class", "active");

    cy.get("#btn-prev").click();

    cy.get("#stepper ol li:nth-child(2)").should("have.class", "active");
    cy.get("#stepper ol li:not(:nth-child(2)").should("not.have.class", "active");

    cy.get("#btn-prev").click();

    cy.get("#stepper ol li:nth-child(1)").should("have.class", "active");
    cy.get("#stepper ol li:not(:nth-child(1)").should("not.have.class", "active");
  });

  it("data should be persisted between steps", () => {
    cy.get('input[name="first_name"]').should("have.value", "");
    cy.get('input[name="last_name"]').should("have.value", "");
    cy.get('input[name="employer"]').should("have.value", "");

    cy.get('input[name="first_name"]').type("der Vorname");
    cy.get('input[name="last_name"]').type("der Nachname");
    cy.get('input[name="employer"]').type("der Dienstgeber");

    cy.get("#btn-next").click();

    cy.get('input[name="kaplan_ics"]').should("have.value", "");

    cy.get('input[name="target_date"]').type("1995-09-06");
    cy.get('input[name="kaplan_ics"]').type(icsUrl.toString());

    cy.get("#btn-next").click();

    cy.get("#btn-prev").click();
    cy.get("#btn-prev").click();

    cy.get('input[name="first_name"]').should("have.value", "der Vorname");
    cy.get('input[name="last_name"]').should("have.value", "der Nachname");
    cy.get('input[name="employer"]').should("have.value", "der Dienstgeber");

    cy.get("#btn-next").click();

    cy.get('input[name="target_date"]').should("have.value", "1995-09-06");
    cy.get('input[name="kaplan_ics"]').should("have.value", icsUrl.toString());
  });
});
