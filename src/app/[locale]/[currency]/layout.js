import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Header from "@/components/header";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";
import BottomNav from "@/components/BottomNav/BottomNav";
import Newsletter from "@/components/Newsletter";
import ScrollToTop from "@/components/ScrollToTop";
import useLoaderStore from "@/store/loaderStore";
import Loading from "@/components/Loading";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default async function LocaleLayout({ children, params }) {
  let { locale } = await params;
  const messages = await getMessages({ locale });
  const direction = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={direction}>
      <body suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <div className="hidden sm:block">
            <Newsletter />
          </div>
          <BottomNav />
          <Footer />
          <div className="hidden md:block">
            <ScrollToTop />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
