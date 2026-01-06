import React from "react";
import { motion } from "framer-motion";
import {
  Leaf,
  HeartPulse,
  ShieldCheck,
  Globe,
  Factory,
  Award,
  Users,
  Sparkles,
  BookOpen,
  Droplets,
  Sun,
  Puzzle,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Navigation from "../components/navigation/Navigation";
import Footer from "../components/Footer";
import TeamCard from "../components/Landing/TeamCard";

import { team } from "../utils/data";
import { companyName } from "../utils/owner";

/* ----------------- Animations ----------------- */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

function AboutUs() {
  return (
    <section className="w-full bg-white overflow-hidden">
      <Navbar />
      <Navigation />

      {/* ================= HERO ================= */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.7 }}
        className="px-6 md:px-24 pt-14 pb-20"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#F6EEDB] flex items-center justify-center">
            <Sparkles size={22} />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold">
              {companyName}
            </h1>
            <p className="text-gray-600">
              Ancient Ayurveda • Modern Wellness • Conscious Living
            </p>
          </div>
        </div>

        <p className="max-w-3xl text-lg text-gray-700 leading-relaxed">
          At <strong>{companyName}</strong>, we revive the timeless science of
          Ayurveda to create safe, effective, and natural wellness solutions.
          Our mission is to make preventive health and holistic living an
          effortless part of everyday life.
        </p>
      </motion.section>

      {/* ================= AYURVEDA FOUNDATION ================= */}
      <motion.section
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="px-6 md:px-24 grid md:grid-cols-2 gap-14 items-start"
      >
        <motion.div variants={fadeUp} className="space-y-6">
          <h2 className="text-2xl font-semibold">
            Rooted in Ayurveda
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Ayurveda, the ancient Indian system of holistic healing, teaches us
            that health is not merely the absence of disease but a state of
            balance between body, mind, and environment.
          </p>
          <p className="text-gray-600 leading-relaxed">
            At Agastiveda, we follow this philosophy by formulating products
            based on classical Ayurvedic texts, traditional household remedies,
            and modern scientific understanding of medicinal herbs.
          </p>
          <blockquote className="border-l-4 border-green-600 pl-4 italic text-gray-600">
            “Swasthasya Swasthya Rakshanam” — Protect the health of the healthy.
          </blockquote>
        </motion.div>

        <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4">
          <AyurvedaCard icon={Leaf} title="Natural Herbs" desc="Pure, plant-based ingredients" />
          <AyurvedaCard icon={BookOpen} title="Classical Texts" desc="Inspired by ancient scriptures" />
          <AyurvedaCard icon={HeartPulse} title="Holistic Healing" desc="Mind, body & lifestyle balance" />
          <AyurvedaCard icon={Sun} title="Preventive Care" desc="Wellness before illness" />
        </motion.div>
      </motion.section>

      {/* ================= VALUES ================= */}
      <motion.section
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mt-20 px-6 md:px-24"
      >
        <motion.h2 variants={fadeUp} className="text-2xl font-semibold mb-8">
          Our Core Values
        </motion.h2>

        <div className="grid md:grid-cols-4 gap-6">
          <Value icon={ShieldCheck} title="Purity" desc="No harmful chemicals or shortcuts" />
          <Value icon={Award} title="Authenticity" desc="True to Ayurvedic principles" />
          <Value icon={Factory} title="Quality" desc="GMP manufacturing & testing" />
          <Value icon={Globe} title="Responsibility" desc="Ethical sourcing & sustainability" />
        </div>
      </motion.section>

      {/* ================= PRODUCTS ================= */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-20 px-6 md:px-24"
      >
        <h2 className="text-2xl font-semibold mb-4">
          Our Ayurvedic Product Ecosystem
        </h2>
        <p className="text-gray-600 max-w-4xl leading-relaxed mb-6">
          Agastiveda offers a comprehensive range of Ayurvedic solutions designed
          for everyday use. From immunity and nutrition to personal and oral
          care, our products are formulated to support long-term wellness.
        </p>

        <div className="flex flex-wrap gap-3">
          <Chip>Ayurvedic Medicines</Chip>
          <Chip>Herbal Supplements</Chip>
          <Chip>Hair & Skin Care Oils</Chip>
          <Chip>Oral Care (Datun, Tooth Powder)</Chip>
          <Chip>Immunity & Nutrition</Chip>
          <Chip>Traditional Wellness Oils</Chip>
        </div>
      </motion.section>

      {/* ================= PROCESS ================= */}
      <motion.section
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mt-20 px-6 md:px-24"
      >
        <motion.h2 variants={fadeUp} className="text-2xl font-semibold mb-6">
          Our Ayurvedic Process
        </motion.h2>

        <motion.ul variants={fadeUp} className="space-y-4 text-gray-700">
          <li>• Ethical sourcing of medicinal plants</li>
          <li>• Traditional purification (Shodhana)</li>
          <li>• Balanced formulation & dosage</li>
          <li>• GMP-compliant manufacturing</li>
          <li>• Quality testing & safe packaging</li>
        </motion.ul>

        <div className="flex gap-4 flex-wrap mt-6">
          <ProcessBadge icon={Factory} text="GMP Facilities" />
          <ProcessBadge icon={ShieldCheck} text="Quality Assured" />
          <ProcessBadge icon={Droplets} text="Clean Processing" />
        </div>
      </motion.section>

      {/* ================= TEAM ================= */}
      <section className="mt-20 px-6 md:px-24 text-center">
        <h2 className="text-3xl font-bold mb-4">Our Team</h2>
        <p className="text-gray-600  mx-auto mb-14">
          A collective of wellness advocates, researchers, and professionals
          committed to reviving authentic Ayurveda.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
          {team.map((member, index) => (
            <div
              key={index}
              className={team.length === 1 ? "md:col-span-5 flex justify-center" : ""}
            >
              <TeamCard member={member} />
            </div>
          ))}
        </div>
      </section>

      {/* ================= VISION ================= */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mt-20 px-6 md:px-24 bg-[#F6EEDB] rounded-2xl p-10"
      >
        <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
        <p className="text-gray-700 max-w-4xl leading-relaxed">
          We envision a world where Ayurveda is trusted globally as a science of
          preventive care and balanced living. Our goal is to build a reliable
          Ayurvedic ecosystem that blends tradition, transparency, and modern
          wellness needs.
        </p>
      </motion.section>

      {/* ================= CTA ================= */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mt-20 mb-24 px-6 md:px-24"
      >
        <div className="rounded-2xl bg-black text-white p-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="text-xl font-medium">Join the Agastiveda Journey</h3>
            <p className="text-sm opacity-80">
              Be part of a movement that brings authentic Ayurveda to everyday life.
            </p>
          </div>
          <div className="flex gap-3">
            <a href="/contact" className="px-5 py-2 bg-white text-black rounded-lg flex items-center gap-2">
              <Puzzle size={16} /> Contact Us
            </a>
            <a href="/products" className="px-5 py-2 border border-white rounded-lg flex items-center gap-2">
              <Users size={16} /> Explore Products
            </a>
          </div>
        </div>
      </motion.section>

      <Footer />
    </section>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

function AyurvedaCard({ icon: Icon, title, desc }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="p-5 rounded-xl border bg-white hover:bg-black hover:text-white shadow-sm space-y-2"
    >
      <Icon size={22} />
      <div className="font-medium">{title}</div>
      <div className="text-sm ">{desc}</div>
    </motion.div>
  );
}

function Value({ icon: Icon, title, desc }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="p-5 rounded-xl border bg-white shadow-sm hover:bg-black hover:text-white"
    >
      <Icon size={20} />
      <div className="mt-2 font-medium">{title}</div>
      <div className="text-sm mt-1">{desc}</div>
    </motion.div>
  );
}

function ProcessBadge({ icon: Icon, text }) {
  return (
    <span className="flex items-center gap-2 px-4 py-2 border rounded-full text-sm hover:bg-black hover:text-white">
      <Icon size={14} /> {text}
    </span>
  );
}

function Chip({ children }) {
  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      className="px-4 py-2 border rounded-full text-sm hover:bg-black hover:text-white"
    >
      {children}
    </motion.span>
  );
}

export default AboutUs;
