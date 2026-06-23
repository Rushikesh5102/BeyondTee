
export default function TermsPage() {
    return (
        <article>
            <h1 className="text-3xl font-bold font-outfit mb-6">Terms of Service</h1>
            <p className="lead text-xl text-muted mb-8">
                Welcome to Beyondtee. By accessing our website, you agree to these terms.
            </p>

            <h3>1. Customization & Orders</h3>
            <p>
                Our 3D customization tool provides a visual representation of the final product.
                Slight variations in color and placement may occur during the printing process.
                Each item is made-to-order specifically for you.
            </p>

            <h3>2. User Content</h3>
            <p>
                You retain ownership of any designs or images you upload.
                However, by uploading, you grant us a license to print these designs onto your apparel.
                You must ensure you have the rights to use any uploaded content.
                We reserve the right to refuse orders containing offensive or illegal content.
            </p>

            <h3>3. Payments</h3>
            <p>
                All prices are in INR (₹). Payment is required at the time of order placement.
                We use secure third-party payment processors.
            </p>

            <p className="text-sm text-muted mt-12">
                Last Updated: December 2025
            </p>
        </article>
    );
}
