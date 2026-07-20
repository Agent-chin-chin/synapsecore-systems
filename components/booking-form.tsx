"use client";

import { useState } from "react";

export default function BookingForm() {
  const [formData, setFormData] = useState({
    serviceType: "",
    description: "",
    priority: "medium",
    attachments: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );

   const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const { name, value, type } = target;
    
    if (type === "file") {
      const input = target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: input.files }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/incidents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          incidentType: formData.serviceType,
          description: formData.description,
          priority: formData.priority,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit incident");
      }

      setSubmitStatus("success");
      // Reset form after successful submission
      setFormData({
        serviceType: "",
        description: "",
        priority: "medium",
        attachments: null,
      });
    } catch (error) {
      console.error("Error submitting incident:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Report an Incident
      </h2>
      {submitStatus === "success" && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
          Incident report submitted successfully! Our team will respond shortly.
        </div>
      )}
      {submitStatus === "error" && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded">
          Failed to submit incident report. Please try again.
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Service Type
          </label>
          <select
            id="serviceType"
            name="serviceType"
            value={formData.serviceType}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          >
            <option value="">Select a service</option>
            <option value="bug-fixing">Bug Fixing</option>
            <option value="malware-removal">Malware Removal</option>
            <option value="website-recovery">Website Recovery</option>
            <option value="wordpress">WordPress Security</option>
            <option value="payment-gateway">Payment Gateway Issues</option>
            <option value="emergency-support">Emergency Support</option>
          </select>
        </div>
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
        </div>
        <div>
          <label htmlFor="attachments" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Attachments (screenshots, reports, etc.)
          </label>
          <input
            type="file"
            id="attachments"
            name="attachments"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Max 5 files, each up to 10MB. Accepted formats: JPG, PNG, PDF, ZIP.
          </p>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit Incident"}
        </button>
      </form>
    </div>
  );
}