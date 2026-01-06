"use client";

import { motion } from "framer-motion";
import { forwardRef, useState } from "react";
import { useGlobalContext } from "@/context/GlobalContext";
import type { ContactForm, FormErrors, SocialLink } from "@/types";

import Tooltip from "./Tooltip";

type ContactSectionProps = Record<string, never>;

const socialLinks: SocialLink[] = [
  {
    name: "GitHub",
    url: "https://github.com/KiranKalluri268",
    svg: (
      <svg
        className="w-8 h-8"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.754-1.333-1.754-1.09-.745.083-.73.083-.73 1.205.085 1.838 1.237 1.838 1.237 1.07 1.835 2.807 1.305 3.492.997.107-.776.42-1.305.763-1.605-2.665-.3-5.467-1.334-5.467-5.932 0-1.31.468-2.382 1.236-3.222-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.52 11.52 0 0 1 3-.405c1.02.005 2.045.138 3 .405 2.29-1.552 3.296-1.23 3.296-1.23.655 1.653.243 2.873.12 3.176.77.84 1.236 1.913 1.236 3.222 0 4.61-2.807 5.63-5.48 5.92.43.37.815 1.1.815 2.22 0 1.606-.015 2.898-.015 3.292 0 .32.216.694.825.576C20.565 21.796 24 17.297 24 12c0-6.63-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/saikiran-kalluri",
    svg: (
      <svg
        className="w-8 h-8"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.29c-.97 0-1.75-.79-1.75-1.76 0-.98.78-1.75 1.75-1.75s1.75.77 1.75 1.75c0 .97-.78 1.76-1.75 1.76zm13.5 10.29h-3v-4.99c0-1.19-.02-2.72-1.66-2.72-1.67 0-1.93 1.31-1.93 2.67v5.04h-3v-9h2.88v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.6v4.71z" />
      </svg>
    ),
  },
  {
    name: "X (Twitter)",
    url: "https://x.com/KiranKalluri_08",
    svg: (
      <svg
        className="w-8 h-8"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 50 50"
        fill="currentColor"
      >
        <path d="M 5.9199219 6 L 20.582031 27.375 L 6.2304688 44 L 9.4101562 44 L 21.986328 29.421875 L 31.986328 44 L 44 44 L 28.681641 21.669922 L 42.199219 6 L 39.029297 6 L 27.275391 19.617188 L 17.933594 6 L 5.9199219 6 z M 9.7167969 8 L 16.880859 8 L 40.203125 42 L 33.039062 42 L 9.7167969 8 z" />
      </svg>
    ),
  },
  {
    name: "Gmail",
    url: "mailto:kirankalluri@gmail.com",
    svg: (
      <svg
        className="w-8 h-8"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
      </svg>
    ),
  },
];

const ContactSection = forwardRef<HTMLElement, ContactSectionProps>((props, ref) => {
  const { currentScene, prevScene } = useGlobalContext();

  // Determine navigation direction
  // Forward: prevScene < currentScene (moving down, e.g., 3→4 or 0→4)
  // Backward: prevScene > currentScene (moving up, e.g., 4→3)
  const isForward = prevScene < currentScene;

  const [form, setForm] = useState<ContactForm>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email.trim()))
      newErrors.email = "Invalid email address";
    if (!form.message.trim()) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
    setForm({ name: "", email: "", message: "" });
  };

  // Z-index: active scene on top, exiting scene below
  const zIndex = currentScene === 4 ? 10 : 1;

  return (
    <section
      ref={ref}
      id="contact"
      className="h-screen text-white text-center flex flex-col justify-end gap-25 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{ zIndex }}
    >
      <motion.div
        initial={{
          // Forward navigation (top→bottom): entry from bottom
          // Backward navigation (bottom→top): entry from top
          y: isForward ? "100%" : "-100%",
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        exit={{
          // Forward navigation: exit to top (moving up in viewport)
          // Backward navigation: exit to bottom (moving down in viewport)
          y: isForward ? "-100%" : "100%",
          opacity: 0,
        }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
        }}
        className="absolute sm:left-1/4 left-1/9 top-[20%] sm:max-w-xl max-w-xs"
      >
        <h2 className="text-3xl font-bold sm:mb-4 mb-2">Contact Me</h2>
        <p className="text-gray-400 mb-8">Feel free to reach out!</p>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 text-green-500 font-semibold"
            role="status"
            aria-live="polite"
          >
            Thanks for reaching out! I will get back to you soon.
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-6 text-left" aria-label="Contact form">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                className={`w-full rounded-md border sm:px-3 sm:py-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                required
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className={`w-full rounded-md border sm:px-3 sm:py-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                required
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={form.message}
                onChange={handleChange}
                className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.message ? "border-red-500" : "border-gray-300"
                  }`}
                required
              />
              {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
            </div>

            <div className="flex items-center justify-center gap-x-25">
              <motion.button
                type="submit"
                className="bg-white text-black px-6 py-3 rounded-lg hover:bg-black hover:text-white transition-transform transform focus:outline-none focus:ring-2 focus:ring-blue-500"
                whileHover={{ scale: 1.05 }}
              >
                Send Message
              </motion.button>


            </div>
          </form>
        )}

        <div className="mt-20 flex justify-center sm:space-x-20 space-x-16 text-gray-200">
          {socialLinks.map(({ name, url, svg }) => (
            <a
              key={name}
              href={url}
              target={url.startsWith("mailto") ? undefined : "_blank"}
              rel={url.startsWith("mailto") ? undefined : "noopener noreferrer"}
              aria-label={name}
              className="hover:text-blue-500 transition-colors"
              onMouseEnter={() => setHoveredLink(name)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              {svg}
            </a>
          ))}
        </div>
      </motion.div>
      <Tooltip text={hoveredLink || ""} isVisible={!!hoveredLink} />

      <motion.footer
        className="w-full text-gray-500 text-sm py-4 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        © {new Date().getFullYear()} Kiran. All Rights Reserved.
      </motion.footer>
    </section>
  );
});

ContactSection.displayName = "ContactSection";

export default ContactSection;
