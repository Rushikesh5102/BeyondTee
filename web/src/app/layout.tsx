import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/ui/SmoothScroll";
import CustomCursor from "@/components/ui/CustomCursor";
import FloatingContacts from "@/components/ui/FloatingContacts";
import Providers from "@/components/Providers";
import Script from "next/script";


const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "BEYONDTEE | Next-Gen 3D Custom Apparel",
  description: "Experience the future of custom apparel. Design your own high-quality apparel with our real-time 3D customization engine. Born in the digital age, made for reality.",
  keywords: ["apparel", "3D customization", "custom t-shirts", "fashion tech", "personalized fashion"],
  authors: [{ name: "Beyondtee Team" }],
  openGraph: {
    title: "BEYONDTEE | Design Your Reality",
    description: "Premium custom apparel with real-time 3D previews.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
      <body className={`${inter.variable} ${outfit.variable} cursor-none`} suppressHydrationWarning>
        <CustomCursor />
        <Providers>
          <SmoothScroll>
            <main className="min-h-screen">
              {children}
            </main>
          </SmoothScroll>
        </Providers>
      </body>
    </html >
  );
}
