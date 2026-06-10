import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { ShippingData } from "../utilities/dataLoader";

export class CheckoutStepOnePage extends BasePage {
  pageTitleText = "Checkout: Your Information";
  pageUrl = "/checkout-step-one.html";

  // Page locators
  readonly firstNameField: Locator;
  readonly lastNameField: Locator;
  readonly postalCodeField: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly completeHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameField = page.locator('[data-test="firstName"]');
    this.lastNameField = page.locator('[data-test="lastName"]');
    this.postalCodeField = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.completeHeader = page.locator('[data-test="complete-header"]');
  }

  /**
   * Fill shipping information
   * @param firstName
   * @param lastName
   * @param postalCode
   */
  async fillShippingInformation(shippingData: ShippingData) {
    await this.firstNameField.fill(shippingData.FirstName);
    await this.lastNameField.fill(shippingData.LastName);
    await this.postalCodeField.fill(shippingData.PostalCode);
    await this.continueButton.click();
  }

  /**
   * Finish order
   */
  async finishOrder() {
    await this.finishButton.click();
  }

  /**
   * Get complete header text
   * @returns Promise<string | null>
   */
  async getCompleteHeaderText() {
    return await this.completeHeader.textContent();
  }

  async clickContinue() {
    await this.continueButton.click();
  }
}
