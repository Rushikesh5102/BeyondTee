import { Controller, Post, Body } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }

  @Post('create-intent')
  createIntent(@Body() body: { amount: number; originalOrderId: string }) {
    return this.paymentsService.createIntent(body.amount, body.originalOrderId);
  }
}
