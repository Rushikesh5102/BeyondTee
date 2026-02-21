import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendOrderConfirmation(
    email: string,
    orderId: string,
    totalAmount: number,
    items: { quantity: number; productId: string; size?: string }[],
  ) {
    try {
      await this.mailerService.sendMail({
        to: email,
        // from: defaults to config
        subject: `Order Confirmation #${orderId.slice(0, 8).toUpperCase()}`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h1 style="color: #000;">Thank you for your order!</h1>
            <p>Your order <strong>#${orderId}</strong> has been successfully placed.</p>
            
            <h3>Order Summary</h3>
            <ul>
              ${items.map((item) => `<li>${item.quantity}x ${item.productId} (Size: ${item.size})</li>`).join('')}
            </ul>
            
            <p><strong>Total: ₹${totalAmount}</strong></p>
            
            <p>We will notify you when your order ships.</p>
            <br>
            <p>Best regards,<br>The Beyondtee Team</p>
          </div>
        `,
      });
      console.log(`Order confirmation sent to ${email}`);
    } catch (error) {
      console.error('Error sending order confirmation email:', error);
      // Don't throw error to prevent blocking order creation flow
    }
  }
}
