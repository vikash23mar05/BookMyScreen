import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaPinterestP,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-background text-on-surface-variant text-sm py-12 border-t border-outline-variant/30">
      <div className="max-w-screen-xl mx-auto px-6 flex flex-col items-center">
        {/* Brand Logo */}
        <div className="text-3xl font-black text-white tracking-tighter mb-4 select-none">
          Book<span className="text-primary-container">My</span>Screen
        </div>

        {/* Social Icons */}
        <div className="flex space-x-4 mb-6">
          <a href="#" className="w-10 h-10 rounded-full bg-surface-container-low border border-outline-variant/50 flex items-center justify-center text-on-surface hover:text-primary-container hover:border-primary-container transition-all">
            <FaFacebookF />
          </a>
          <a href="#" className="w-10 h-10 rounded-full bg-surface-container-low border border-outline-variant/50 flex items-center justify-center text-on-surface hover:text-primary-container hover:border-primary-container transition-all">
            <FaTwitter />
          </a>
          <a href="#" className="w-10 h-10 rounded-full bg-surface-container-low border border-outline-variant/50 flex items-center justify-center text-on-surface hover:text-primary-container hover:border-primary-container transition-all">
            <FaInstagram />
          </a>
          <a href="#" className="w-10 h-10 rounded-full bg-surface-container-low border border-outline-variant/50 flex items-center justify-center text-on-surface hover:text-primary-container hover:border-primary-container transition-all">
            <FaYoutube />
          </a>
          <a href="#" className="w-10 h-10 rounded-full bg-surface-container-low border border-outline-variant/50 flex items-center justify-center text-on-surface hover:text-primary-container hover:border-primary-container transition-all">
            <FaPinterestP />
          </a>
          <a href="#" className="w-10 h-10 rounded-full bg-surface-container-low border border-outline-variant/50 flex items-center justify-center text-on-surface hover:text-primary-container hover:border-primary-container transition-all">
            <FaLinkedinIn />
          </a>
        </div>

        {/* Copyright */}
        <p className="text-center text-xs leading-relaxed max-w-2xl text-on-surface-variant/60 mb-2">
          Copyright 2026 © bookMyScreen Pvt Ltd. All Rights Reserved.
        </p>
        <p className="text-center text-[11px] leading-relaxed max-w-4xl text-on-surface-variant/40">
          The content and images used on this site are copyright protected and
          copyrights vests with the respective owners. The usage of the content
          and images on this website is intended to promote the works and no
          endorsement of the artist shall be implied.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

