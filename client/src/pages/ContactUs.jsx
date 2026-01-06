import { motion } from "framer-motion";
import React from "react";
import {
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhone,
  FaLeaf,
  FaHandshake,
  FaClock,
} from "react-icons/fa";

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Navigation from "../components/navigation/Navigation";

/* ---------------- Animations ---------------- */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

function ContactUs() {
  return (
    <div className="bg-white text-black min-h-screen overflow-hidden">
      <Navbar />
      <Navigation />

      {/* ================= HERO ================= */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.6 }}
        className="text-center mt-14 px-6"
      >
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          Get in Touch with Us
        </h1>
        <p className="max-w-3xl mx-auto text-gray-600 text-sm md:text-base">
          Whether you have questions about our Ayurvedic products, business
          partnerships, bulk orders, or wellness consultations — we’re here to
          help you.
        </p>
      </motion.section>

      {/* ================= WHY CONTACT ================= */}
      <motion.section
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mt-16 px-6 md:px-24 grid md:grid-cols-3 gap-6"
      >
        <InfoCard
          icon={FaLeaf}
          title="Ayurvedic Guidance"
          desc="Get expert guidance on choosing the right Ayurvedic products for your lifestyle."
        />
        <InfoCard
          icon={FaHandshake}
          title="Business & Retail"
          desc="For dealerships, wholesale, and retail collaborations across India."
        />
        <InfoCard
          icon={FaClock}
          title="Customer Support"
          desc="Quick resolution for orders, shipping, and product-related queries."
        />
      </motion.section>

      {/* ================= CONTACT CARD ================= */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-20 flex justify-center px-6"
      >
        <div className=" bg-green-300 rounded-md p-8 md:p-10 max-w-full w-full text-black space-y-6">
          <h2 className="text-2xl font-semibold">Contact Information</h2>
          <p className="text-sm opacity-80">
            Reach us during business hours for faster response.
          </p>

          <div className="space-y-4">
            <ContactRow
              icon={FaMapMarkerAlt}
              text="Ayurvedic Wellness Center, Jaipur, Rajasthan, India"
            />
            <ContactRow
              icon={FaPhone}
              text="+91 12345 67890 (Mon–Sat | 10 AM – 6 PM)"
            />
            <ContactRow
              icon={FaEnvelope}
              text="support@agastiveda.com"
            />
          </div>

          {/* Social Icons */}
          <div className="flex gap-5 pt-4">
            <SocialIcon
              href="https://www.facebook.com/"
              icon={FaFacebookF}
              color="text-blue-400"
            />
            <SocialIcon
              href="https://www.instagram.com/"
              icon={FaInstagram}
              color="text-pink-400"
            />
            <SocialIcon
              href="https://www.linkedin.com/"
              icon={FaLinkedinIn}
              color="text-blue-300"
            />
          </div>
        </div>
      </motion.section>

      {/* ================= DISCLAIMER ================= */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mt-20 px-6 md:px-24"
      >
        <div className="border rounded-xl p-6 bg-[#F6EEDB]">
          <h3 className="font-semibold mb-2">Important Note</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            Our products are based on traditional Ayurvedic formulations and are
            not intended to diagnose, treat, cure, or prevent any disease.
            Please consult a qualified healthcare professional before use,
            especially if you are pregnant or under medication.
          </p>
        </div>
      </motion.section>

      {/* ================= CTA ================= */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mt-20 mb-24 px-6 md:px-24"
      >
        <div className="rounded-2xl bg-gradient-to-r from-black to-zinc-800 text-white p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-medium">
              Let’s Build a Healthier Tomorrow 🌿
            </h3>
            <p className="text-sm opacity-80">
              Connect with us and experience authentic Ayurveda.
            </p>
          </div>
          <a
            href="/products"
            className="px-6 py-2 bg-white text-black rounded-lg font-medium hover:opacity-90 transition"
          >
            Explore Products
          </a>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}

/* ================= Reusable Components ================= */

function InfoCard({ icon: Icon, title, desc }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6 }}
      className="border rounded-xl p-6 text-center shadow-sm bg-white"
    >
      <Icon className="mx-auto mb-3 text-green-700" size={22} />
      <h4 className="font-semibold mb-2">{title}</h4>
      <p className="text-sm text-gray-600">{desc}</p>
    </motion.div>
  );
}

function ContactRow({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-4">
      <Icon className="text-white" />
      <p className="font-medium text-sm">{text}</p>
    </div>
  );
}

function SocialIcon({ href, icon: Icon, color }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`${color} hover:opacity-70 transition`}
    >
      <Icon size={20} />
    </a>
  );
}

export default ContactUs;
