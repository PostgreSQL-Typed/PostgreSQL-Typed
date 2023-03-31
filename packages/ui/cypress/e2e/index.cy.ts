describe("data spinner", () => {
	it("show spinner", () => {
		cy.visit("/");
		cy.get('[text-2xl=""]').should("have.text", "No Data");
		cy.get('[text-lg=""]').should("include.text", "Could not connect to database!");
	});

	it("show spinner when empty array", () => {
		cy.visit("/");

		cy.intercept(
			{
				method: "GET",
				url: "/api/*",
			},
			[]
		);
		cy.get('[text-2xl=""]').should("have.text", "No Data");
		cy.get('[text-lg=""]').should("include.text", "Check your terminal");
	});

	it("should not show spinner", () => {
		mockData();

		cy.visit("/");

		cy.get('[text-2xl=""]').should("not.exist");
		cy.get('[text-lg=""]').should("not.exist");
	});
});

describe("functionalities", () => {
	it("should reload data", () => {
		mockData();

		cy.visit("/");

		cy.get(".text-lg > :nth-child(2)").click();
		cy.wait("@getData");
	});

	it("should toggle darkmode", () => {
		mockData();

		cy.visit("/");

		cy.get(".text-lg > :nth-child(3)").click();
		cy.get("html").should("have.class", "dark");

		cy.get(".text-lg > :nth-child(3)").click();
		cy.get("html").should("not.have.class", "dark");
	});

	it("should only show searched items", () => {
		mockData();

		cy.visit("/");

		cy.get("div:nth-child(1) > div > div.scrolls").children().should("have.length.above", 1);
		cy.get("input").click().type("addresses");

		cy.get("div:nth-child(1) > div > div.scrolls").children().should("have.length", 1);
		cy.get('[flex="~ row"] > div > [text-sm=""]').should("have.text", "public.addresses");

		cy.get("div:nth-child(2) > button").click();
		cy.get("div:nth-child(1) > div > div.scrolls").children().should("have.length.above", 1);
	});

	describe("dashboard info", () => {
		it("should show correct data", () => {
			mockData();

			cy.visit("/");

			cy.get('[text-4xl=""]').should("have.text", "postgres");

			cy.get("#schemaCount").should("have.text", "1");
			cy.get("#tableCount").should("have.text", "11");
			cy.get("#dbSize").should("have.text", "147 kB");
		});
	});

	describe("dashboard button", () => {
		it("should not show", () => {
			mockData();

			cy.visit("/");

			cy.get(".text-lg > :nth-child(1)").should("not.be.visible");
		});

		it("should show", () => {
			mockData();

			cy.visit("/");

			cy.get('.scrolls > :nth-child(1) > div > [text-sm=""]').click();

			cy.get(".text-lg > :nth-child(1)").should("exist");
		});

		it("should go back to dashboard", () => {
			mockData();

			cy.visit("/");

			cy.get('.scrolls > :nth-child(1) > div > [text-sm=""]').click();

			cy.get(".text-lg > :nth-child(1)").should("exist");

			cy.get(".text-lg > :nth-child(1)").click();

			cy.get(".text-lg > :nth-child(1)").should("not.be.visible");
		});
	});
});

describe("Table", () => {
	it("should not show button", () => {
		mockData();

		cy.visit("/");

		cy.get("#tableBtn").should("not.exist");
	});

	it("should show correct data", () => {
		mockData();

		cy.visit("/");

		cy.get("#tableBtn").should("not.exist");
		cy.get('.scrolls > :nth-child(1) > div > [text-sm=""]').click();
		cy.get("#tableBtn").should("exist");

		cy.get("#dataTable > thead > tr").children().should("have.length", 5);
		cy.get("#dataTable > tbody").children().should("have.length", 4);

		cy.get("#dataTable > tbody > tr:nth-child(1) > td:nth-child(1)").should("have.text", "city");
		cy.get("#dataTable > tbody > tr:nth-child(1) > td:nth-child(2)").should("have.text", "character varying(30)");
		cy.get("#dataTable > tbody > tr:nth-child(1) > td:nth-child(3)").should("have.text", "");
		cy.get("#dataTable > tbody > tr:nth-child(1) > td:nth-child(4)").should("have.text", "false");
		cy.get("#dataTable > tbody > tr:nth-child(1) > td:nth-child(5)").should("have.text", "");
	});
});

describe("Relation Graph", () => {
	it("should not show button", () => {
		mockData();

		cy.visit("/");

		cy.get("#graphBtn").should("not.exist");
	});

	it("should show correct data", () => {
		mockData();

		cy.visit("/");

		cy.get("#graphBtn").should("not.exist");
		cy.get('.scrolls > :nth-child(2) > div > [text-sm=""]').click();
		cy.get("#graphBtn").should("exist");
		cy.get("#graphBtn").click();

		cy.get("#type-outgoing").should("be.checked");
		cy.get(".node").should("have.length", 2);
		cy.get("#type-outgoing").uncheck();
		cy.get(".node").should("have.length", 1);
		cy.get("#type-outgoing").check();

		cy.get("#show-label").should("not.be.checked");
		cy.get(".link__label").should("have.css", "opacity", "0");
		cy.get("#show-label").check();
		cy.get(".link__label").should("have.css", "opacity", "1");
		cy.get(".link__label").should("have.text", "oid* → id");
		cy.get("#resetController").click();
		cy.get("#show-label").should("not.be.checked");

		cy.get(".node").should("have.length", 2);
		cy.get(".nodes .node__label").should("have.text", "usersaircraft");
		cy.get(".link").should("have.length", 1);
	});
});

function mockData() {
	cy.intercept(
		{
			method: "GET",
			url: "/api/data",
		},
		{ fixture: "data.json" }
	).as("getData");
}
