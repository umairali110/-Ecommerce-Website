import Link from 'next/link';

export default function Home() {
  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8">
      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <div className="site-container py-16 sm:py-24 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="animate-fade-in">
              <span className="mb-4 inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-800">
                New arrivals
              </span>
              <h1 className="mb-5 text-4xl font-extrabold leading-tight tracking-tight text-secondary-900 sm:text-5xl lg:text-6xl">
                Shop premium products with{' '}
                <span className="text-primary-700">confidence</span>
              </h1>
              <p className="mb-8 max-w-lg text-base leading-relaxed text-secondary-500 sm:text-lg">
                Curated quality, secure checkout, and fast delivery — everything you need for a
                seamless shopping experience.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center rounded-xl bg-primary-700 px-6 py-3 text-base font-semibold text-white shadow-soft transition-all hover:bg-primary-600"
                >
                  Shop now →
                </Link>
                <Link
                  href="/cart"
                  className="inline-flex items-center justify-center rounded-xl border border-primary-700 px-6 py-3 text-base font-semibold text-primary-700 transition-all hover:bg-primary-50"
                >
                  View cart
                </Link>
              </div>
              <div className="mt-12 grid grid-cols-3 gap-6 border-t border-secondary-200 pt-8">
                {[
                  { value: '1000+', label: 'Products' },
                  { value: '50K+', label: 'Customers' },
                  { value: '99%', label: 'Satisfaction' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-bold text-primary-700 sm:text-3xl">{stat.value}</p>
                    <p className="text-sm text-secondary-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-primary-50 to-secondary-100 shadow-elevated">
                <div className="flex h-full flex-col items-center justify-center p-12 text-center">
                  <span className="mb-4 text-7xl">📦</span>
                  <p className="text-xl font-bold text-secondary-900">Premium Quality</p>
                  <p className="mt-2 text-secondary-500">100% authentic products</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-secondary-200 bg-secondary-50 py-16 sm:py-20">
        <div className="site-container">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-secondary-900 sm:text-4xl">Why choose E-Shop?</h2>
            <p className="mx-auto mt-3 max-w-xl text-secondary-500">
              Built for modern shoppers who expect speed, security, and quality.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: '⚡',
                title: 'Fast Delivery',
                desc: 'Reliable shipping with real-time tracking on every order.',
              },
              {
                icon: '🛡️',
                title: 'Secure Payment',
                desc: 'Industry-standard encryption and trusted payment gateways.',
              },
              {
                icon: '💯',
                title: 'Quality Assured',
                desc: 'Every product verified before it reaches your door.',
              },
            ].map((f) => (
              <div key={f.title} className="card-base p-6 sm:p-8">
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-2xl">
                  {f.icon}
                </span>
                <h3 className="mb-2 text-lg font-semibold text-secondary-900">{f.title}</h3>
                <p className="text-sm leading-relaxed text-secondary-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-800 py-16 sm:py-20">
        <div className="site-container text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to start shopping?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-primary-100">
            Browse our collection and find exactly what you need.
          </p>
          <Link
            href="/products"
            className="mt-8 inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-base font-semibold text-primary-800 shadow-soft transition-all hover:bg-primary-50"
          >
            Explore products →
          </Link>
        </div>
      </section>
    </div>
  );
}
