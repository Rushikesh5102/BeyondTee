export declare class PaymentsService {
    private stripe;
    constructor();
    createIntent(amount: number, originalOrderId: string): Promise<{
        status: string;
        clientSecret: string | null;
        amount: number;
        currency: string;
    }>;
}
