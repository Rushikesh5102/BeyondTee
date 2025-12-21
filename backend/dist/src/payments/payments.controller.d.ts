import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    createIntent(body: {
        amount: number;
        originalOrderId: string;
    }): Promise<{
        status: string;
        clientSecret: string | null;
        amount: number;
        currency: string;
    }>;
}
