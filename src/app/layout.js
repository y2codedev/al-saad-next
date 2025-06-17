import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import "./globals.css";
import { ThemeProvider } from "@/theme";
import ToastProvider from "@/components/ToastProvider";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
export const generateMetadata = async ({ params }) => {
  const { locale } = await params;

  return {
    title: "Alsaad Home",
    description: "This is a description of your site or page content.",
    metadataBase: new URL("https://staging.alsaadhome.com/en/aed"),
    alternates: {
      canonical: "/",
      languages: {
        en: "/en",
        ar: "/ar",
      },
    },
    openGraph: {
      title: "Alsaad Home",
      description: "This is a description of your site or page content.",
      url: "https://staging.alsaadhome.com/en/aed",
      siteName: "Your Site Name",
      images: [
        {
          url: "https://next-alsaad.vercel.app/_next/static/media/logo.d9892975.avif",
          width: 200,
          height: 200,
          alt: "Og Image Alt Text",
        },
      ],
      locale,
      type: "website",
    },
    twitter: {
      card: "https://next-alsaad.vercel.app/_next/static/media/logo.d9892975.avif",
      title: "Alsaad Home",
      description: "Twitter card description.",
      images: [
        "https://next-alsaad.vercel.app/_next/static/media/logo.d9892975.avif",
      ],
    },
    icons: {
      icon: "https://next-alsaad.vercel.app/_next/static/media/logo.d9892975.avif",
      shortcut:
        "https://next-alsaad.vercel.app/_next/static/media/logo.d9892975.avif",
      apple:
        "https://next-alsaad.vercel.app/_next/static/media/logo.d9892975.avif",
    },
  };
};

export default async function LocaleLayout({ children, params }) {
  const { locale } = params;

  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider messages={messages}>
      <ThemeProvider>
        {children}
        <ToastProvider />
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
