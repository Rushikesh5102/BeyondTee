import { Injectable, BadRequestException } from '@nestjs/common';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  private razorpay: Razorpay;

  constructor() {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder',
    });
  }

  async createOrder(amount: number, receiptId: string) {
    try {
      const options = {
        amount: Math.round(amount * 100), // Amount in paisa
        currency: 'INR',
        receipt: receiptId,
      };

      const order = await this.razorpay.orders.create(options);
      return order;
    } catch (error) {
      console.error('Razorpay Create Order Error:', error);
      throw new BadRequestException('Failed to create Razorpay order');
    }
  }

  verifyPayment(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    signature: string,
  ) {
    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder';

    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(razorpayOrderId + '|' + razorpayPaymentId)
      .digest('hex');

    if (generatedSignature === signature) {
      return { status: 'success', message: 'Payment verified' };
    } else {
      throw new BadRequestException('Invalid payment signature');
    }
  }
}
