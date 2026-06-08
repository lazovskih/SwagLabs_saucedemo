import { Locator, Page } from "@playwright/test";

export abstract class BasePage {
  readonly page: Page;
  abstract pageTitleText: string;
  abstract pageUrl: string;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('[data-test="title"]');
  }

  async open() {
    await this.page.goto(this.pageUrl);
  }

  async getPageTitle() {
    return await this.pageTitle.textContent();
  }

  async getCurrentUrl() {
    return this.page.url();
  }
}
