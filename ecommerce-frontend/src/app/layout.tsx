import Providers from "./provider";
import Navabar from "./components/Navabar";
import "./globals.css";

export const metadata = {
  title: "E-Shop | Premium E-commerce Platform",
  description: "Discover amazing products with our professional e-commerce platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-secondary-50 text-secondary-900 antialiased">
        <Providers>
          <Navabar />
          <main className="site-container min-h-[calc(100vh-4rem)] py-6 sm:py-10">
            {children}
          </main>

          <footer className="mt-auto border-t border-secondary-200 bg-white">
            <div className="site-container py-12">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <h3 className="mb-3 text-lg font-bold text-primary-700">E-Shop</h3>
                  <p className="text-sm leading-relaxed text-secondary-500">
                    Your premium destination for quality products with secure checkout and fast delivery.
                  </p>
                </div>
                <div>
                  <h4 className="mb-3 text-sm font-semibold text-secondary-900">Shop</h4>
                  <ul className="space-y-2 text-sm text-secondary-500">
                    <li><a href="/products" className="hover:text-primary-700 transition-colors">All Products</a></li>
                    <li><a href="/cart" className="hover:text-primary-700 transition-colors">Shopping Cart</a></li>
                    <li><a href="/orders" className="hover:text-primary-700 transition-colors">My Orders</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="mb-3 text-sm font-semibold text-secondary-900">Support</h4>
                  <ul className="space-y-2 text-sm text-secondary-500">
                    <li><a href="#" className="hover:text-primary-700 transition-colors">Help Center</a></li>
                    <li><a href="#" className="hover:text-primary-700 transition-colors">Contact Us</a></li>
                    <li><a href="#" className="hover:text-primary-700 transition-colors">FAQ</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="mb-3 text-sm font-semibold text-secondary-900">Legal</h4>
                  <ul className="space-y-2 text-sm text-secondary-500">
                    <li><a href="#" className="hover:text-primary-700 transition-colors">Privacy Policy</a></li>
                    <li><a href="#" className="hover:text-primary-700 transition-colors">Terms of Service</a></li>
                    <li><a href="#" className="hover:text-primary-700 transition-colors">Cookies</a></li>
                  </ul>
                </div>
              </div>
              <div className="mt-10 border-t border-secondary-200 pt-6 text-center text-sm text-secondary-500">
                <p>&copy; {new Date().getFullYear()} E-Shop. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
