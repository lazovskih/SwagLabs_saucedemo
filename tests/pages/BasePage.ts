import { Locator, Page } from "@playwright/test";

export abstract class BasePage {
  readonly page: Page;
  abstract pageTitleText: string;
  abstract pageUrl: string;
  readonly pageTitle: Locator;

  private readonly mainMenuButton: Locator;
  private readonly sideMenu: Locator;
  private readonly allItemsMenu: Locator;
  private readonly AboutMenu: Locator;
  private readonly logoutMenu: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('[data-test="title"]');
    this.mainMenuButton = page.locator('[data-test="open-menu"]');
    this.sideMenu = page.locator(".bm-menu");
    this.allItemsMenu = page.locator('[data-test="inventory-sidebar-link"]');
    this.AboutMenu = page.locator('[data-test="about-sidebar-link"]');
    this.logoutMenu = page.locator('#logout_sidebar_link');
  }

  async open() {
    await this.page.goto(process.env.URL + this.pageUrl, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Get page title text
   * @returns Promise<string | null>
   */
  async getPageTitle() {
    return await this.pageTitle.textContent();
  }

  /**
   * Get current URL
   * @returns Promise<string>
   */
  async getCurrentUrl() {
    return this.page.url();
  }

  /**
   * Click on menu button
   */
  async clickMenuButton(): Promise<void> {
    await this.mainMenuButton.click({ delay: 100, force: true });
    await this.sideMenu.isVisible();
  }

  /**
   * Click on "Logout" menu link
   */
  async clickLogoutMenu(): Promise<void> {
    await this.clickMenuButton();
    await this.logoutMenu.click();
  }
}
