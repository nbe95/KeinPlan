describe("test if all steps are reachable", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("iterate forward and backward", () => {
    cy.get("#stepper ol li:nth-child(1)").should("have.class", "active");
    cy.get("#stepper ol li:not(:nth-child(1)").should("not.have.class", "active");

    cy.get('input[name="first_name"]').type("Der Vorname");
    cy.get('input[name="last_name"]').type("Der Nachname");
    cy.get('input[name="employer"]').type("Der Dienstgeber");
    cy.get("#btn-next").click();

    cy.get("#stepper ol li:nth-child(2)").should("have.class", "active");
    cy.get("#stepper ol li:not(:nth-child(2)").should("not.have.class", "active");

    cy.get('input[name="kaplan_ics"]').type("_debug");
    cy.get("#btn-next").click();
  });
});
