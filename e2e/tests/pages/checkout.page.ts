import type { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export interface PaymentDetails {
  nameOnCard: string;
  cardNumber: string;
  cvc: string;
  expiryMonth: string;
  expiryYear: string;
}

export class CheckoutPage extends BasePage {
  // No data-qa or label on this textarea; name attribute is the only stable hook.
  readonly orderCommentTextarea: Locator;
  readonly placeOrderButton: Locator;

  readonly nameOnCardInput: Locator;
  readonly cardNumberInput: Locator;
  readonly cvcInput: Locator;
  readonly expiryMonthInput: Locator;
  readonly expiryYearInput: Locator;
  readonly payButton: Locator;

  readonly orderPlacedHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.orderCommentTextarea = page.locator('textarea[name="message"]');
    this.placeOrderButton = page.getByRole('link', { name: 'Place Order' });

    this.nameOnCardInput = page.getByTestId('name-on-card');
    this.cardNumberInput = page.getByTestId('card-number');
    this.cvcInput = page.getByTestId('cvc');
    this.expiryMonthInput = page.getByTestId('expiry-month');
    this.expiryYearInput = page.getByTestId('expiry-year');
    this.payButton = page.getByTestId('pay-button');

    this.orderPlacedHeading = page.getByTestId('order-placed');
  }

  async placeOrder(): Promise<void> {
    await this.placeOrderButton.click();
  }

  async fillPaymentDetails({
    nameOnCard,
    cardNumber,
    cvc,
    expiryMonth,
    expiryYear,
  }: PaymentDetails): Promise<void> {
    await this.nameOnCardInput.fill(nameOnCard);
    await this.cardNumberInput.fill(cardNumber);
    await this.cvcInput.fill(cvc);
    await this.expiryMonthInput.fill(expiryMonth);
    await this.expiryYearInput.fill(expiryYear);
  }

  async confirmPayment(): Promise<void> {
    await this.payButton.click();
  }
}
