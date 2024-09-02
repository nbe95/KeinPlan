describe("test cookie handling", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should set cookie", () => {
    cy.getCookie("user-data").should("not.exist");

    cy.fixture("cookie1.json").then((cookie) => {
      cy.get('input[name="first_name"]').type(cookie.firstName);
      cy.get('input[name="last_name"]').type(cookie.lastName);
      cy.get('input[name="employer"]').type(cookie.employer);

      cy.get('input[name="use_cookie"]').should("not.be.checked").check();
      cy.get(".Toastify .Toastify__toast-container").should("be.visible");

      cy.get("#btn-next").click();

      cy.getCookie("user-data")
        .should("exist")
        .its("value")
        .then((value) => {
          const obj = JSON.parse(decodeURIComponent(value));
          cy.wrap(obj).should("deep.equal", cookie);
        });
    });

    cy.fixture("cookie2.json").then((cookie) => {
      cy.get('input[name="kaplan_ics"]').type(cookie.kaPlanIcs);

      cy.get("#btn-next").click();

      cy.getCookie("user-data")
        .should("exist")
        .its("value")
        .then((value) => {
          const obj = JSON.parse(decodeURIComponent(value));
          cy.wrap(obj).should("deep.equal", cookie);
        });
    });
  });

  it("should remove cookie", () => {
    cy.fixture("cookie2.json").then((cookie) => {
      cy.setCookie("user-data", JSON.stringify(cookie));
    });

    cy.getCookie("user-data").should("exist");

    cy.get('input[name="use_cookie"]').should("be.checked").uncheck();
    cy.get(".Toastify .Toastify__toast-container").should("be.visible");
    cy.get(".Toastify .Toastify__toast-container", { timeout: 10000 }).should("not.exist");

    cy.getCookie("user-data").should("not.exist");
  });

  it("should use a cookie's data", () => {
    cy.fixture("cookie2.json").then((cookie) => {
      cy.setCookie("user-data", JSON.stringify(cookie));

      cy.get('input[name="first_name"]').should("have.value", cookie.firstName);
      cy.get('input[name="last_name"]').should("have.value", cookie.lastName);
      cy.get('input[name="employer"]').should("have.value", cookie.employer);
      cy.get('input[name="use_cookie"]').should("be.checked");

      cy.get("#btn-next").click();

      cy.get('input[name="kaplan_ics"]').should("have.value", cookie.kaPlanIcs);
    });
  });
});
