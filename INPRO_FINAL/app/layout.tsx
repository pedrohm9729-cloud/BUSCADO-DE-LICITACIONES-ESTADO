import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import TopBar from "@/components/ui/TopBar";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import QuoteModal from "@/components/ui/QuoteModal";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.inprometal.com.pe'),
  title: {
    default: 'INPROMETAL | Ingeniería y Fabricación Metalmecánica - Lima, Perú',
    template: '%s | INPROMETAL'
  },
  description: 'Empresa líder en ingeniería y fabricación metalmecánica en Lima, Perú. Soluciones estructurales para minería, construcción e industria. Diseño, fabricación, montaje y mantenimiento industrial.',
  keywords: [
    'metalmecánica Lima',
    'fabricación estructuras metálicas',
    'ingeniería metalmecánica Perú',
    'soldadura industrial',
    'montaje industrial',
    'tanques industriales',
    'estructuras minería',
    'mantenimiento industrial Lima'
  ],
  authors: [{ name: 'INPROMETAL' }],
  creator: 'INPROMETAL',
  publisher: 'INPROMETAL',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'es_PE',
    url: 'https://www.inprometal.com.pe',
    title: 'INPROMETAL | Ingeniería y Fabricación Metalmecánica',
    description: 'Soluciones metalmecánicas integrales para minería, construcción e industria en Lima, Perú.',
    siteName: 'INPROMETAL',
    images: [
      {
        url: '/logos/logo-inprometal-2.svg',
        width: 800,
        height: 600,
        alt: 'INPROMETAL - Ingeniería Metalmecánica',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'INPROMETAL | Ingeniería y Fabricación Metalmecánica',
    description: 'Soluciones metalmecánicas integrales para minería, construcción e industria en Lima, Perú.',
    images: ['/logos/logo-inprometal-2.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "INPROMETAL",
              "legalName": "H & V DESARROLLO Y FABRICACIÓN DE PROYECTOS METALMECÁNICOS S.A.C",
              "description": "Ingeniería, desarrollo y fabricación de proyectos metalmecánicos",
              "image": "https://www.inprometal.com.pe/logos/logo-inprometal-2.svg",
              "@id": "https://www.inprometal.com.pe",
              "url": "https://www.inprometal.com.pe",
              "telephone": "+51-966-060-911",
              "email": "contacto@inprometal.com.pe",
              "taxID": "20609746328",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Lima",
                "addressRegion": "Lima",
                "addressCountry": "PE"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": -12.0464,
                "longitude": -77.0428
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday"
                ],
                "opens": "08:00",
                "closes": "18:00"
              },
              "sameAs": [
                "https://www.facebook.com/inprometal",
                "https://www.linkedin.com/company/inprometal"
              ]
            })
          }}
        />
      </head>
      <body className="font-sans">
        <TopBar />
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
        <QuoteModal />

        {/* Google tag (gtag.js) - Google Ads AW-17968652793 */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=AW-17968652793" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer=window.dataLayer||[];
            function gtag(){dataLayer.push(arguments);}
            gtag('js',new Date());
            gtag('config','AW-17968652793');
          `}
        </Script>
      </body>
    </html>
  );
}
