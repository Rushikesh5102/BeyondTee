import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
      apiVersion: '2025-12-15.clover',
    });
  }

  async createIntent(amount: number, originalOrderId: string) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to paisa for INR
        currency: 'inr',
        metadata: {
          orderId: originalOrderId,
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        status: 'success',
        clientSecret: paymentIntent.client_secret,
        amount,
        currency: 'inr',
      };
    } catch (error) {
      console.error('Stripe Error:', error);
      throw error;
    }
  }
}
