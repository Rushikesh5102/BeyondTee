
export default function ShippingPage() {
    return (
        <article>
            <h1 className="text-3xl font-bold font-outfit mb-6">Shipping & Returns</h1>

            <section className="mb-8">
                <h3 className="text-xl font-bold mb-4 text-foreground">1. Processing Times</h3>
                <p className="text-muted">
                    Since every item is custom-made, please allow 3-5 business days for production before shipping.
                    You will receive a tracking number once your order is on its way.
                </p>
            </section>

            <section className="mb-8">
                <h3 className="text-xl font-bold mb-4 text-foreground">2. Domestic Shipping (India)</h3>
                <ul className="list-disc list-inside text-muted space-y-2">
                    <li>Standard Shipping: 5-7 business days (Free on orders above ₹2000)</li>
                    <li>Express Shipping: 2-3 business days</li>
                </ul>
            </section>

            <section className="mb-8">
                <h3 className="text-xl font-bold mb-4 text-foreground">3. Returns & Replacements</h3>
                <p className="text-muted">
                    Because your products are customized and made-to-order, we generally do not accept returns.
                    However, if your item arrives damaged or there is a manufacturing defect, please contact us within 48 hours.
                </p>
                <p className="text-muted mt-4">
                    To initiate a replacement, email us at <span className="text-accent">support@beyondtee.com</span> with your order number and photos of the defect.
                </p>
            </section>

            <p className="text-sm text-muted mt-12">
                Last Updated: December 2025
            </p>
        </article>
    );
}
