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
  readonly errorMessageText = "Epic sadface: Username and password do not match any user in this service";
  readonly noAccessMessageText = "Epic sadface: You can only access '/inventory.html' when you are logged in.";

  constructor(page: Page) {
    super(page);
    this.usernameField = page.locator('[data-test="username"]');
    this.passwordField = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  /**
   * Login with username and password
   * @param username
   * @param password
   */
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

  /**
   * Login as locked out user
   */
  async loginAsLockedOutUser() {
    await this.login(process.env.LOCKED_OUT_USER!, process.env.DEMO_PASSWORD!);
  }

  /**
   * Check if error message is visible
   */
  async isErrorMessageVisible() {
    return await this.errorMessage.isVisible();
  }

  async getErrorMessageText() {
    return await this.errorMessage.textContent();
  }

  /**
   * Clear username field
   */
  async clearUsername(): Promise<void> {
    await this.usernameField.clear();
  }

  /**
   * Clear password field
   */
  async clearPassword(): Promise<void> {
    await this.passwordField.clear();
  }
}
