describe("check handling of KaPlan dates", () => {
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
    });
  });

  it("should display dates correctly", () => {
    var strftime = require("strftime");
    var strftimeGer = strftime.localizeByIdentifier("de_DE");

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
          const dateStart = new Date(Date.parse(date.start));
          const dateEnd = new Date(Date.parse(date.end));
          card.should(
            "contain.text",
            `${strftimeGer("%H:%M", dateStart)} – ${strftimeGer("%H:%M", dateEnd)}`,
          );
          card.should("contain.text", `${strftimeGer("%a%d%b", dateStart)}`);
        }
      });
    });
  });

  it("should be possible to filter dates", () => {
    var strftime = require("strftime");
    var strftimeGer = strftime.localizeByIdentifier("de_DE");

    cy.fixture("dates.json").then((dates) => {
      cy.get(`main div[data-uid*="KAPLAN-ID-TEST"]`).should("have.length", dates.length);
      cy.get("main .nav-tabs .nav-item")
        .contains("Alle" + dates.length.toString())
        .should("not.have.class", "disabled")
        .should("have.class", "active");

      cy.fixture("form-data.json").then((data) => {
        let day = new Date(Date.parse(data.targetDate));
        for (var i = 0; i < 7; i++) {
          day.setDate(day.getDate() + 1);
          const filtered = dates.filter((item) => {
            const date = new Date(Date.parse(item.start));
            return (
              date.getDay() == day.getDay() &&
              date.getMonth() == day.getMonth() &&
              date.getFullYear() == day.getFullYear()
            );
          });

          if (filtered.length > 0) {
            cy.get("main .nav-tabs .nav-item")
              .contains(strftimeGer("%A", day) + filtered.length.toString())
              .should("not.have.class", "disabled")
              .should("not.have.class", "active")
              .click()
              .should("have.class", "active");

            cy.get(`main div[data-uid*="KAPLAN-ID-TEST"]`).should("have.length", filtered.length);
          } else {
            cy.get("main .nav-tabs .nav-item")
              .contains(strftimeGer("%A", day))
              .should("have.class", "disabled")
              .should("not.have.class", "active");
          }
        }
      });

      cy.get("main .nav-tabs .nav-item:first-child a")
        .should("not.have.class", "active")
        .click()
        .should("have.class", "active");
      cy.get(`main div[data-uid*="KAPLAN-ID-TEST"]`).should("have.length", dates.length);
    });
  });
});

describe("check handling of no dates", () => {
  let icsUrl = new URL(Cypress.config("baseUrl"));
  icsUrl.pathname = "test-kaplan-empty.ics";

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
    });
  });

  it("should give note on no dates", () => {
    cy.get("main .date-card").should("not.exist");
    cy.get('main div[role="alert"]').should("exist").contains("keine Termine");
  });
});
