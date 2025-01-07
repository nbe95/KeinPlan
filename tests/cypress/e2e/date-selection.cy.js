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
});
