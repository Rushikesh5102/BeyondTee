
export default function PrivacyPage() {
    return (
        <article>
            <h1 className="text-3xl font-bold font-outfit mb-6">Privacy Policy</h1>

            <section className="mb-8">
                <h3 className="text-xl font-bold mb-4 text-foreground">1. Information We Collect</h3>
                <p className="text-muted">
                    We collect information you provide directly to us: name, email address, shipping address, and payment information.
                    We also collect the designs you upload or create using our 3D tool.
                </p>
            </section>

            <section className="mb-8">
                <h3 className="text-xl font-bold mb-4 text-foreground">2. How We Use Your Data</h3>
                <p className="text-muted">
                    We use your data to process orders, communicate about your shipment, and improve our 3D customization experience.
                    We do not sell your personal data to third parties.
                </p>
            </section>

            <section className="mb-8">
                <h3 className="text-xl font-bold mb-4 text-foreground">3. Security</h3>
                <p className="text-muted">
                    We use industry-standard encryption to protect your data during transmission and storage.
                    Our payment processing is handled by secure third-party providers (Stripe).
                </p>
            </section>

            <p className="text-sm text-muted mt-12">
                Last Updated: December 2025
            </p>
        </article>
    );
}
