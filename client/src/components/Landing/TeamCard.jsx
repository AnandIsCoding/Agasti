import React from "react";
import {
  FaLinkedinIn,
  FaInstagram,
  FaFacebookF,
  FaWhatsapp,
} from "react-icons/fa";

const TeamCard = ({ member }) => {
  return (
    <div className="md:w-[280px]  bg-white rounded-3xl shadow-lg p-4 transition hover:shadow-xl">
      {/* Image */}
      <div className="rounded-2xl overflow-hidden h-[220px]">
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="mt-4 px-1">
        <h3 className="text-xl font-semibold">{member.name}</h3>
        <p className="text-gray-500 text-sm">{member.role}</p>

        <p className="text-gray-600 text-sm mt-2 min-h-10">{member.desc}</p>
      </div>

      {/* Footer */}
      <div className="mt-4 flex justify-center">
        <div className="flex  justify-between gap-8">
          {member.socials.whatsapp && (
            <a
              href={member.socials.whatsapp}
              target="_blank"
              className="w-9 h-9 border rounded-full flex items-center justify-center hover:bg-green-100"
            >
              <FaWhatsapp size={14} color="green" />
            </a>
          )}

          {member.socials.linkedin && (
            <a
              href={member.socials.linkedin}
              target="_blank"
              className="w-9 h-9 border rounded-full flex items-center justify-center hover:bg-blue-100"
            >
              <FaLinkedinIn size={14} color="blue" />
            </a>
          )}

          {member.socials.instagram && (
            <a
              href={member.socials.instagram}
              target="_blank"
              className="w-9 h-9 border rounded-full flex items-center justify-center hover:bg-red-100 "
            >
              <FaInstagram size={14} color="red" />
            </a>
          )}

          {member.socials.facebook && (
            <a
              href={member.socials.facebook}
              target="_blank"
              className="w-9 h-9 border rounded-full flex items-center justify-center hover:bg-blue-100"
            >
              <FaFacebookF size={14} color="blue" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
