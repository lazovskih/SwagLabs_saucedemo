import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CheckoutStepTwoPage extends BasePage {
  pageTitleText = "Checkout: Overview";
  pageUrl = "/checkout-step-two.html";

  // Page title element and text
  protected pageTitleElement: Locator;

  // Checkout page elements - Step Two (overview)
  private readonly summaryInfo: Locator;
  private readonly summarySubtotal: Locator;
  private readonly summaryTax: Locator;
  private readonly summaryTotal: Locator;
  private readonly finishButton: Locator;
  private readonly cancelLink: Locator;

  // Checkout complete page elements
  private readonly completeHeader: Locator;
  private readonly completeText: Locator;
  private readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators using data-test attribute - Step One
    this.pageTitleElement = page.locator('[data-test="title"]');

    // Step Two locators
    this.summaryInfo = page.locator('[data-test="summary-info"]');
    this.summarySubtotal = page.locator('[data-test="subtotal-label"]');
    this.summaryTax = page.locator('[data-test="tax-label"]');
    this.summaryTotal = page.locator('[data-test="total-label"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelLink = page.locator('[data-test="cancel"]');

    // Complete page locators
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.completeText = page.locator('[data-test="complete-text"]');
    this.backHomeButton = page.locator('[data-test="back-home"]');
  }
  // ===== Step Two: Overview =====

  /**
   * Get summary subtotal text
   */
  async getSubtotal(): Promise<string> {
    const subtotalText = await this.summarySubtotal.textContent();
    // Extract numeric part from "Item total: $39.98" -> "39.98"
    const match = subtotalText?.match(/\$(\d+\.?\d*)/);
    return match ? match[1] : "";
  }

  /**
   * Get summary tax text
   */
  async getTax(): Promise<string> {
    const taxText = await this.summaryTax.textContent();
    // Extract numeric part from "Tax: $1.92" -> "1.92"
    const match = taxText?.match(/\$(\d+\.?\d*)/);
    return match ? match[1] : "";
  }

  /**
   * Get summary total text
   */
  async getTotal(): Promise<string> {
    const totalText = await this.summaryTotal.textContent();
    // Extract numeric part from "Total: $41.90" -> "41.90"
    const match = totalText?.match(/\$(\d+\.?\d*)/);
    return match ? match[1] : "";
  }

  /**
   * Click finish button
   */
  async clickFinish(): Promise<void> {
    await this.finishButton.click();
  }

  // ===== Step Three: Complete =====

  /**
   * Get complete header text
   */
  async getCompleteHeader(): Promise<string> {
    return (await this.completeHeader.textContent()) ?? "";
  }

  /**
   * Get complete text
   */
  async getCompleteText(): Promise<string> {
    return (await this.completeText.textContent()) ?? "";
  }

  /**
   * Click back home button
   */
  async clickBackHome(): Promise<void> {
    await this.backHomeButton.click();
  }

  /**
   * Check if checkout is complete
   */
  async isCheckoutComplete(): Promise<boolean> {
    return await this.completeHeader.isVisible();
  }

  /**
   * Finish the order by clicking the finish button
   */
  async finishOrder() {
    await this.finishButton.click();
  }

  /**
   * Get the complete header text after finishing the order
   */
  async getCompleteHeaderText() {
    return await this.completeHeader.textContent();
  }
}
