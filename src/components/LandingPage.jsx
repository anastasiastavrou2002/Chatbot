import React from "react";
import { Rocket, Shield, Sparkles, ArrowRight } from "lucide-react";

export default function LandingPage({ onStart, onSignIn }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50 text-gray-900">
      <header className="sticky top-0 z-30 bg-white/70 backdrop-blur border-b border-gray-100">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600" />
            <span className="text-lg font-bold tracking-tight">YourBrand</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#features" className="hover:text-indigo-600">Features</a>
            <a href="#pricing" className="hover:text-indigo-600">Pricing</a>
            <a href="#contact" className="hover:text-indigo-600">Contact</a>
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={onSignIn}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm"
            >
              Sign in
            </button>
            <button
              onClick={onStart}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-sm flex items-center gap-1"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-purple-200/40 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />
          </div>
          <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                New: Faster onboarding
              </div>
              <h1 className="mt-4 text-4xl md:text-6xl font-extrabold tracking-tight">
                Build delightful experiences in minutes.
              </h1>
              <p className="mt-4 text-lg md:text-xl text-gray-600">
                Launch a polished product site with a clean design, responsive layout, and zero fuss.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onStart}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 font-medium"
                >
                  Start for Free
                </button>
                <button
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 font-medium"
                >
                  Live Demo
                </button>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Everything you need</h2>
            <p className="mt-3 text-gray-600">
              A minimal set of features to get you online fast, with room to grow.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-indigo-600" />
              </div>
              <h3 className="mt-4 font-semibold">Clean Design</h3>
              <p className="mt-2 text-sm text-gray-600">
                Modern typography, soft shadows, and a balanced layout that looks great on any device.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                <Shield className="h-5 w-5 text-indigo-600" />
              </div>
              <h3 className="mt-4 font-semibold">Secure & Fast</h3>
              <p className="mt-2 text-sm text-gray-600">
                Built with best practices and lightweight assets for fast load times and reliability.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                <Rocket className="h-5 w-5 text-indigo-600" />
              </div>
              <h3 className="mt-4 font-semibold">Easy to Launch</h3>
              <p className="mt-2 text-sm text-gray-600">
                Copy, paste, and ship. Customize colors and content in seconds.
              </p>
            </div>
          </div>
        </section>

        <section id="pricing" className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 p-1">
            <div className="rounded-3xl bg-white p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight">Simple pricing</h3>
                  <p className="mt-2 text-gray-600">Start free. Upgrade when you’re ready.</p>
                  <div className="mt-6 flex items-end gap-2">
                    <span className="text-4xl font-extrabold">$0</span>
                    <span className="text-gray-600 mb-1">/month</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Unlimited pages
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Responsive layout
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    SEO-friendly
                  </div>
                  <button
                    onClick={onStart}
                    className="mt-4 w-full md:w-auto px-6 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
            <h3 className="text-2xl font-bold tracking-tight">Contact us</h3>
            <p className="mt-2 text-gray-600">Have questions? Send a message and we’ll get back to you.</p>
            <form className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Name" />
              <input className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Email" />
              <textarea className="md:col-span-2 w-full rounded-lg border border-gray-300 px-4 py-3 h-28 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Your message" />
              <div className="md:col-span-2">
                <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200">
        <div className="mx-auto max-w-6xl px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} YourBrand. All rights reserved.</p>
          <div className="flex items-center gap-4 text-sm">
            <a href="#" className="text-gray-600 hover:text-indigo-600">Privacy</a>
            <a href="#" className="text-gray-600 hover:text-indigo-600">Terms</a>
            <a href="#" className="text-gray-600 hover:text-indigo-600">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
