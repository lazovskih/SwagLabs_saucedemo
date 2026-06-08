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

  async fillShippingInformation(shippingInfo: ShippingData, clickContinue: boolean = true) {
    await this.firstNameField.fill(shippingInfo.FirstName);
    await this.lastNameField.fill(shippingInfo.LastName);
    await this.postalCodeField.fill(shippingInfo.PostalCode);
    if (clickContinue) {
      await this.continueButton.click();
    }
  }

  async finishOrder() {
    await this.finishButton.click();
  }

  async getCompleteHeaderText() {
    return await this.completeHeader.textContent();
  }

  async clickContinue() {
    await this.continueButton.click();
  }
}
