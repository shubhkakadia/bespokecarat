import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Bespoke Carat</h3>
            <p className="text-gray-400">
              Premium lab-grown diamonds with uncompromising quality and
              transparency.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Products</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/products/melee" className="hover:text-white transition duration-200">
                  Star Melee
                </Link>
              </li>
              <li>
                <Link href="/products/colored" className="hover:text-white transition duration-200">
                  Colored Diamonds
                </Link>
              </li>
              <li>
                <Link href="/products/antique" className="hover:text-white transition duration-200">
                  Antique Shapes
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/aboutus" className="hover:text-white transition duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contactus" className="hover:text-white transition duration-200">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/certifications" className="hover:text-white transition duration-200">
                  Certifications
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/support" className="hover:text-white transition duration-200">
                  Customer Support
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-white transition duration-200">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-white transition duration-200">
                  Returns
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Bespoke Carat. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 