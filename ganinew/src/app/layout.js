import "./globals.css";
import { Header } from "@/components/header";
import { Toaster } from 'react-hot-toast';
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
