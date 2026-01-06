import React from "react";

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Navigation from "../components/navigation/Navigation";
import ScrollToTop from "../utils/ScrollToTop";

export default function TC() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Navigation />
      <div className="max-w-5xl mx-auto px-4 py-12 text-gray-800">
        <h1 className="text-4xl font-semibold mb-4 text-center">
          Privacy Policy
        </h1>

        <p className="text-sm text-gray-500 text-center mb-10">
          Last updated: December 2025
        </p>

        {/* Intro */}
        <section className="space-y-5">
          <p>
            Your privacy is important to us. This Privacy Policy describes how
            we collect, use, and protect your information when you use our
            website, applications, and related services (collectively, the
            “Service”).
          </p>

          <p>
            By accessing or using our Service, you agree to the collection and
            use of information in accordance with this Privacy Policy.
          </p>
        </section>

        {/* 1 */}
        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">1. Information We Collect</h2>

          <h3 className="text-lg font-medium">Personal Information</h3>
          <p>
            When you sign in using Google, we may collect your name, email
            address, and profile image. We do not collect or store your Google
            password at any time.
          </p>

          <h3 className="text-lg font-medium">Automatically Collected Data</h3>
          <p>
            We may automatically collect information such as your IP address,
            device type, browser type, pages visited, and interaction data to
            improve platform performance and security.
          </p>
        </section>

        {/* 2 */}
        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">
            2. How We Use Your Information
          </h2>

          <ul className="list-disc pl-6 space-y-2">
            <li>Authenticate users securely using Google Sign-In</li>
            <li>Provide, operate, and maintain our services</li>
            <li>Improve user experience and platform performance</li>
            <li>Detect and prevent fraud, abuse, or security issues</li>
            <li>Send important service-related notifications</li>
          </ul>
        </section>

        {/* 3 */}
        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">
            3. Cookies and Tracking Technologies
          </h2>
          <p>
            We use cookies and similar technologies to maintain sessions,
            analyze usage, and improve our services. You can disable cookies in
            your browser settings, but some features may not function properly.
          </p>
        </section>

        {/* 4 */}
        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">
            4. Data Sharing and Disclosure
          </h2>
          <p>
            We do not sell, trade, or rent your personal information. We may
            share data only when required by law, to protect user safety, or to
            comply with legal obligations.
          </p>
        </section>

        {/* 5 */}
        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">5. Data Security</h2>
          <p>
            We use industry-standard security measures including HTTPS
            encryption and restricted access controls. However, no method of
            transmission over the internet is completely secure.
          </p>
        </section>

        {/* 6 */}
        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">6. Data Retention</h2>
          <p>
            We retain your information only for as long as necessary to provide
            services or comply with legal obligations. You may request deletion
            of your data at any time.
          </p>
        </section>

        {/* 7 */}
        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">7. Your Rights</h2>
          <p>
            You have the right to access, update, or delete your personal
            information. You may also withdraw consent for certain data
            processing activities.
          </p>
        </section>

        {/* 8 */}
        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">8. Children’s Privacy</h2>
          <p>
            Our services are not intended for children under the age of 13. We
            do not knowingly collect personal information from children.
          </p>
        </section>

        {/* 9 */}
        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will be
            posted on this page with an updated effective date.
          </p>
        </section>

        {/* 10 */}
        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">10. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or our data
            practices, please contact us:
          </p>

          <p className="font-medium">Email: support@plutointero.com</p>
        </section>
      </div>
      <Footer />
    </>
  );
}
