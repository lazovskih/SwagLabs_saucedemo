import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CartPage extends BasePage {
  pageTitleText = "Your Cart";
  pageUrl = "/cart.html"; 
  
  // Page locators
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator(".cart_item");
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  /**
   * Get product count
   * @param productName
   * @returns Promise<number>
   */
  async getProductCount(productName: string) {
    return await this.cartItems.filter({ hasText: productName }).count();
  }

  /**
   * Get item count
   * @returns Promise<number>
   */
  async getItemCount() {
    return await this.cartItems.count();
  }

  /**
   * Start checkout
   */
  async startCheckout() {
    await this.checkoutButton.click();
  }

  /**
   * Remove product
   * @param productName
   */
  async removeProduct(productName: string) {
    const productId = productName.toLowerCase().replace(/\s+/g, "-");
    await this.page.locator(`[data-test="remove-${productId}"]`).click();
  }

  /**
   * Continue shopping
   */
  async continueShopping() {
    await this.continueShoppingButton.click();
  }
}
