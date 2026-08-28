import { expect } from "@playwright/test";
import { BasePage } from "../pages/BasePage";

/**
 * Shared cross-page helper function.
 * Demonstrates polymorphism: accepts any page class that extends BasePage.
 */
export async function navigateAndVerifyHeader(pageObject: BasePage): Promise<void> {
  // Invokes the concrete page's navigation flow + readiness check (isLoaded)
  await pageObject.open();

  // Verifies the shared header locator defined on BasePage
  await expect(pageObject.primaryHeader).toBeVisible();
}
