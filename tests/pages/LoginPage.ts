import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { ProductsPage } from "./ProductsPage";

export class LoginPage extends BasePage {
  pageTitleText = "Swag Labs";
  pageUrl = "/";

  // Page locators
  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameField = page.locator('[data-test="username"]');
    this.passwordField = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async login(username: string, password: string) {
    await this.open();
    await this.page.waitForLoadState();

    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
    await this.page.waitForLoadState();
    await this.loginButton.click();

    const productsPage = new ProductsPage(this.page);
    await productsPage.inventoryItems.first().waitFor();
  }

  async loginAsStandardUser() {
    await this.login(process.env.STANDARD_USER!, process.env.DEMO_PASSWORD!);
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }
}
