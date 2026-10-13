import localFont from "next/font/local";

export const abcDiatype = localFont({
  src: [
    {
      path: "../assets/fonts/ABCDiatypeCyrillic/ABCDiatypeCyrillic-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/ABCDiatypeCyrillic/ABCDiatypeCyrillic-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/ABCDiatypeCyrillic/ABCDiatypeCyrillic-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  display: "fallback",
  variable: "--font-abc-diatype",
});
