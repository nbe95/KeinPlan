describe("check version", () => {
  const version = Cypress.env("TEST_VERSION");
  const sha = Cypress.env("TEST_VERSION_SHA");

  it("check frontend version", () => {
    cy.visit("/");

    cy.get("footer #version")
      .invoke("attr", "title")
      .should("equal", !!sha ? sha : "");
    cy.get("footer #version").contains(
      "KeinPlan " + (!!version ? `v${version}` : "(unbekannte Version)"),
    );
  });

  it("check backend version", () => {
    let versionUrl = new URL(Cypress.env("BACKEND_URL"));
    versionUrl.pathname = "api/v1/version";
    cy.request(versionUrl.toString())
      .its("body")
      .its("KeinPlan")
      .its("backend")
      .should("include", { version: version ?? null, sha: sha ?? null });
  });
});
