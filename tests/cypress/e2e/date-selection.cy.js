describe("check date selection", () => {
  beforeEach(() => {
    cy.visit("/");

    cy.fixture("form-data.json").then((data) => {
      cy.get('input[name="first_name"]').type(data.firstName);
      cy.get('input[name="last_name"]').type(data.lastName);
      cy.get('input[name="employer"]').type(data.employer);

      cy.get("#btn-next").click();
    });
  });

  it("should handle overlapping calendar week", () => {
    cy.get('input[name="target_date"]').type("2022-12-30").blur().next().contains("KW 52/2022");
    cy.get('input[name="target_date"]').type("2022-12-31").blur().next().contains("KW 52/2022");
    cy.get('input[name="target_date"]').type("2023-01-01").blur().next().contains("KW 52/2022");
    cy.get('input[name="target_date"]').type("2023-01-02").blur().next().contains("KW 1/2023");
    cy.get('input[name="target_date"]').type("2023-01-03").blur().next().contains("KW 1/2023");

    cy.get('input[name="target_date"]').type("2024-12-28").blur().next().contains("KW 52/2024");
    cy.get('input[name="target_date"]').type("2024-12-29").blur().next().contains("KW 52/2024");
    cy.get('input[name="target_date"]').type("2024-12-30").blur().next().contains("KW 1/2025");
    cy.get('input[name="target_date"]').type("2024-12-31").blur().next().contains("KW 1/2025");
    cy.get('input[name="target_date"]').type("2025-01-01").blur().next().contains("KW 1/2025");
    cy.get('input[name="target_date"]').type("2025-01-02").blur().next().contains("KW 1/2025");
  });

  it("should be able to move a week forward/backward", () => {
    // backward
    cy.get('input[name="target_date"]').type("2025-01-01").blur();

    cy.get('input[name="target_date"]').next().contains("KW 1/2025").find("button:first-child").click();
    cy.get('input[name="target_date"]').should("have.value", "2024-12-23");

    cy.get('input[name="target_date"]').next().contains("KW 52/2024").find("button:first-child").click();
    cy.get('input[name="target_date"]').should("have.value", "2024-12-16");

    cy.get('input[name="target_date"]').next().contains("KW 51/2024");

    // forward
    cy.get('input[name="target_date"]').type("2025-01-01").blur();

    cy.get('input[name="target_date"]').next().contains("KW 1/2025").find("button:last-child").click();
    cy.get('input[name="target_date"]').should("have.value", "2025-01-06");

    cy.get('input[name="target_date"]').next().contains("KW 2/2025").find("button:last-child").click();
    cy.get('input[name="target_date"]').should("have.value", "2025-01-13");

    cy.get('input[name="target_date"]').next().contains("KW 3/2025");
  });
});
