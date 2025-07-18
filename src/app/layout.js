import "./globals.css";
import Providers from "../components/Providers";

export const metadata = {
  title: "Bespoke Carat - Premium Lab-Grown Diamonds",
  description:
    "Discover our exquisite collection of lab-grown diamonds. From precision star melee to stunning colored stones, we offer the finest quality diamonds with complete transparency and certification.",
  keywords:
    "lab-grown diamonds, star melee, colored diamonds, diamond jewelry, certified diamonds",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased" suppressHydrationWarning={true}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
