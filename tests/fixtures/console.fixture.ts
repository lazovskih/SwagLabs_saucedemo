import { expect as baseExpect, test as baseTest, type Page, type ConsoleMessage } from "@playwright/test";

class PageConsole {
  readonly messages: ConsoleMessage[] = [];
  constructor(page: Page) {
    page.on("console", (message) => this.messages.push(message));
  }
}

export const test = baseTest.extend<{ pageConsole: PageConsole }>({
  pageConsole: async ({ page }, use) => {
    console.log("[Console Fixture] 1. Initializing page console.");
    const pageConsole = new PageConsole(page);

    await use(pageConsole);
    await expect(pageConsole).toHaveNoConsoleErrors();
  },
});

export const expect = baseExpect.extend({
  async toHaveNoConsoleErrors(pageConsole: PageConsole) {
    console.log("[Console Fixture] 2. Checking for console errors.");
    const errors = pageConsole.messages.filter((message) => message.type() === "error");
    const pass = errors.length === 0;
    const message = () =>
      this.utils.matcherHint("toHaveNoConsoleErrors", undefined, "") +
      "\n\n" +
      `Errors: ${this.utils.stringify(errors.map((e) => e.text()))}\n`;
    return {
      message,
      pass,
      name: "toHaveNoConsoleErrors",
      actual: errors,
    };
  },
});
