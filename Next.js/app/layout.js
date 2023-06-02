import "./globals.scss";

import { Josefin_Sans } from "next/font/google";
import { Alerts } from "@/app/_components/alert";
import { cookies } from "next/dist/client/components/headers";
const josefin_sans = Josefin_Sans({ subsets: ["latin"] });

export const metadata = {
  title: {
    template: "%s | Leaf ID",
  },
};

export default function RootLayout({ children }) {
  const theme = cookies().get("theme");
  return (
    <html lang="en" className={theme?.value !== "none" ? theme?.value : ""}>
      <body className={`${josefin_sans.className} bgcw`}>
        <Alerts></Alerts>
        {children}
      </body>
    </html>
  );
}
