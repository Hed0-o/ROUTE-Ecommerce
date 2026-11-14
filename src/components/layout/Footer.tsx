import Link from "next/link";

const shopLinks = [
  ["All products", "/products"],
  ["Categories", "/categories"],
  ["Brands", "/brands"],
];

const accountLinks = [
  ["Sign in", "/login"],
  ["Create account", "/register"],
  ["Forgot password", "/forgot-password"],
  ["Change password", "/change-password"],
  ["Wishlist", "/wishlist"],
  ["My cart", "/cart"],
  ["Order history", "/orders"],
];

export default function Footer() {
  return (
    <footer className="mt-16 bg-[#f1f5f9] text-[#50616b]">
      <div className="page-shell grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-bold text-[#21313c]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2563eb] text-white">
              U
            </span>
            UrbanNest
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6">
            A thoughtful mix of home finds, men's and women's fashion, and
            useful electronics for everyday living.
          </p>
        </div>
        <div>
          <h2 className="font-semibold text-[#21313c]">Shop</h2>
          <ul className="mt-4 space-y-3">
            {shopLinks.map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="text-sm hover:text-[#2563eb]">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-semibold text-[#21313c]">Your account</h2>
          <ul className="mt-4 space-y-3">
            {accountLinks.map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="text-sm hover:text-[#2563eb]">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-200">
        <div className="page-shell flex flex-col gap-3 py-5 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 UrbanNest. All rights reserved.</p>
          <p>Secure checkout · Cash and card payment</p>
        </div>
      </div>
    </footer>
  );
}
