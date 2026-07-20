"use client";

import { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit support ticket");
      }

      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting support ticket:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-green-400/30 p-8">
      <h2 className="text-2xl font-bold text-green-400 mb-6">
        Send us a Message
      </h2>
      {submitStatus === "success" && (
        <div className="mb-4 p-4 bg-green-900/30 border border-green-400/50 text-green-300 rounded-lg">
          ✅ Support ticket submitted successfully! We'll get back to you soon.
        </div>
      )}
      {submitStatus === "error" && (
        <div className="mb-4 p-4 bg-red-900/30 border border-red-400/50 text-red-300 rounded-lg">
          ❌ Failed to submit support ticket. Please try again.
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-gray-900 border border-green-400/30 rounded-md text-white focus:outline-none focus:border-green-400 transition-colors"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-gray-900 border border-green-400/30 rounded-md text-white focus:outline-none focus:border-green-400 transition-colors"
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-gray-900 border border-green-400/30 rounded-md text-white focus:outline-none focus:border-green-400 transition-colors"
            placeholder="What is this about?"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-gray-900 border border-green-400/30 rounded-md text-white focus:outline-none focus:border-green-400 transition-colors resize-none"
            placeholder="Tell us more..."
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-400 hover:bg-green-300 text-black font-bold py-3 px-4 rounded-md transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}