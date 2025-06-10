"use client";

import { motion } from "framer-motion";
import React, { forwardRef, useState, useEffect } from "react";
import { useGlobalContext } from "@/context/GlobalContext";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ContactSectionProps {}

const socialLinks = [
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
    name: "X",
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
];

const ContactSection = forwardRef<HTMLElement, ContactSectionProps>((props, ref) => {
  const { setCurrentScene } = useGlobalContext();

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        setCurrentScene(3);
      }
    };

    const handleScroll = (e: WheelEvent) => {
      if (e.deltaY < -20) {
        setCurrentScene(3);
      }
    };

    window.addEventListener("keydown", handleKey);
    window.addEventListener("wheel", handleScroll);

    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("wheel", handleScroll);
    };
  }, [setCurrentScene]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
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

  return (
    <section
      ref={ref}
      id="contact"
      className="h-screen text-center flex flex-col justify-between px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="max-w-xl mx-auto mt-12"
      >
        <h2 className="text-3xl font-bold mb-4">Contact Me</h2>
        <p className="text-gray-400 mb-8">Feel free to reach out!</p>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 text-green-500 font-semibold"
          >
            Thanks for reaching out! I will get back to you soon.
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-6 text-left">
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
                className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? "border-red-500" : "border-gray-300"
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
                className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? "border-red-500" : "border-gray-300"
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
                className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.message ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
            </div>

            <div className="flex items-center justify-center gap-x-10">
              <motion.button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-transform transform focus:outline-none focus:ring-2 focus:ring-blue-500"
                whileHover={{ scale: 1.05 }}
              >
                Send Message
              </motion.button>

              <motion.a
                href="mailto:kirankalluri@gmail.com"
                className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-transform transform focus:outline-none focus:ring-2 focus:ring-blue-500"
                whileHover={{ scale: 1.05 }}
              >
                Say Hello 👋
              </motion.a>
            </div>
          </form>
        )}

        <div className="mt-20 flex justify-center space-x-20 text-gray-200">
          {socialLinks.map(({ name, url, svg }) => (
            <a
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={name}
              className="hover:text-blue-500 transition-colors"
            >
              {svg}
            </a>
          ))}
        </div>
      </motion.div>

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
