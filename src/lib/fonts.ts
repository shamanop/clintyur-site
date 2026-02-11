import localFont from "next/font/local";

export const clashDisplay = localFont({
  src: [
    {
      path: "../../public/fonts/ClashDisplay-Variable.woff2",
      style: "normal",
    },
  ],
  variable: "--font-display",
  display: "swap",
});

export const satoshi = localFont({
  src: [
    {
      path: "../../public/fonts/Satoshi-Variable.woff2",
      style: "normal",
    },
  ],
  variable: "--font-body",
  display: "swap",
});
