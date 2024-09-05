describe("test step functionalities", () => {
  let icsUrl = new URL(Cypress.config("baseUrl"));
  icsUrl.pathname = "test-kaplan-debug.ics";

  beforeEach(() => {
    cy.visit("/");
  });

  it("should be possible to navigate forward and backward", () => {
    cy.get("#stepper ol li:nth-child(1)").should("have.class", "active");
    cy.get("#stepper ol li:not(:nth-child(1)").should("not.have.class", "active");

    cy.get('input[name="first_name"]').type("foo");
    cy.get('input[name="last_name"]').type("foo");
    cy.get('input[name="employer"]').type("foo");

    cy.get("#btn-next").click();

    cy.get("#stepper ol li:nth-child(2)").should("have.class", "active");
    cy.get("#stepper ol li:not(:nth-child(2)").should("not.have.class", "active");

    cy.get('input[name="target_date"]').type("2000-01-01");
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
    cy.fixture("form-data.json").then((data) => {
      cy.get('input[name="first_name"]').should("have.value", "");
      cy.get('input[name="last_name"]').should("have.value", "");
      cy.get('input[name="employer"]').should("have.value", "");

      cy.get('input[name="first_name"]').type(data.firstName);
      cy.get('input[name="last_name"]').type(data.lastName);
      cy.get('input[name="employer"]').type(data.employer);

      cy.get("#btn-next").click();

      cy.get('input[name="kaplan_ics"]').should("have.value", "");

      cy.get('input[name="target_date"]').type(data.targetDate);
      cy.get('input[name="kaplan_ics"]').type(icsUrl.toString());

      cy.get("#btn-next").click();

      cy.get("#btn-prev").click();
      cy.get("#btn-prev").click();

      cy.get('input[name="first_name"]').should("have.value", data.firstName);
      cy.get('input[name="last_name"]').should("have.value", data.lastName);
      cy.get('input[name="employer"]').should("have.value", data.employer);

      cy.get("#btn-next").click();

      cy.get('input[name="target_date"]').should("have.value", data.targetDate);
      cy.get('input[name="kaplan_ics"]').should("have.value", icsUrl.toString());
    });
  });
});
