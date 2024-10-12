import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "./Providers";
import Image from "next/image";
import backgroundImage from "../../public/wallpaper.jpg"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Access Control",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <div className="h-screen w-full flex justify-center items-center">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
