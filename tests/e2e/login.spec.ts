import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { ProductsPage } from "../pages/ProductsPage";
// import { navigateAndVerifyHeader } from "../utilities/navigation"; // TODO: Remove this line if not needed
import { AxeBuilder } from "@axe-core/playwright";

/**
 * Login Test Scenarios for SauceDemo
 */
test.describe("Login page", () => {
  let loginPage: LoginPage;
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);

    // Navigate to login page
    await loginPage.open();
  });

  test("Accessibility check: Login page", async ({}) => {
    // Perform accessibility check on the products page
    const accessibilityScanLoginPage = await new AxeBuilder({ page: loginPage.page }).analyze();
    expect(accessibilityScanLoginPage.violations, "Accessibility violations found: login page").toEqual([]);
  });

  /**
   * Scenario 1: Login as standard user with valid password - successful
   * Verify "Products" page opened
   */
  test("Login with valid credentials - successful", async ({ page }) => {
    // Navigate to login page
    // await navigateAndVerifyHeader(loginPage); // TODO: Remove this line if not needed

    // Login with valid credentials
    await loginPage.login(process.env.STANDARD_USER!, process.env.DEMO_PASSWORD!);

    // Verify Products page is displayed
    expect(await productsPage.getCurrentUrl()).toContain(productsPage.pageUrl);

    // Verify Products page title
    expect(await productsPage.getPageTitle()).toBe(productsPage.pageTitleText);
  });

  /**
   * Scenario 2: Login as standard user with invalid password - unsuccessful
   * Verify error message displayed
   */
  test("Login with invalid password - unsuccessful", async ({ page }) => {
    // Navigate to login page
    // await loginPage.open(); // TODO: Remove this line if not needed

    // Login with invalid password
    await loginPage.usernameField.fill(process.env.STANDARD_USER!);
    await loginPage.passwordField.fill("invalid_password");
    await page.waitForLoadState();
    await loginPage.loginButton.click();

    // Verify error message is displayed
    expect(await loginPage.isErrorMessageVisible(), "Error message should be visible").toBe(true);
    expect(await loginPage.getErrorMessageText(), "Error message text should match").toBe(loginPage.errorMessageText);

    // Verify still on login page
    await expect(page, "Should be redirected to login page").toHaveURL(/.*\/$/);
  });

  /**
   * Scenario 3: Login as standard user, logout, verify Products page not accessible
   */
  test("Login, logout, verify Products page not accessible", async ({ page }) => {
    // Navigate to login page
    // await loginPage.open(); // TODO: Remove this line if not needed

    // Login with valid credentials
    await loginPage.login(process.env.STANDARD_USER!, process.env.DEMO_PASSWORD!);

    // Verify Products page is displayed
    await expect(page).toHaveURL(/.*inventory.html/);

    // Click logout
    await productsPage.clickLogoutMenu();

    // Verify redirected to login page
    await expect(page).toHaveURL(/.*\/$/);

    // Try to navigate directly to Products page
    await page.goto(process.env.URL + productsPage.pageUrl);

    // Verify redirected back to login page (not accessible)
    await expect(page).toHaveURL(/.*\/$/);
  });
});
