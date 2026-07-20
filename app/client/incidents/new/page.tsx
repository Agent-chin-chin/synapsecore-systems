'use client'
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { incidentCreateSchema } from "@/lib/validation";
import { z } from "zod";

export default function NewIncidentForm() {
  const [formData, setFormData] = useState({
    incidentType: "",
    description: "",
    priority: "medium",
    severity: "medium",
    attachments: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const { name, value, type } = target;
    
    if (type === "file") {
      const input = target as HTMLInputElement;
      setFormData((prev) => ({ 
        ...prev, 
        [name]: Array.from(input.files ?? []).map(file => file.name) 
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setFormErrors({});

    try {
      // Validate form data using Zod schema
      const parsed = incidentCreateSchema.safeParse(formData);
      
      if (!parsed.success) {
        // Convert Zod errors to our format
        const errors: Record<string, string[]> = {};
        parsed.error.issues.forEach(error => {
          const field = error.path[0] as string;
          if (!errors[field]) {
            errors[field] = [];
          }
          errors[field].push(error.message);
        });
        setFormErrors(errors);
        setSubmitStatus("error");
        return;
      }

      // Prepare data for API (convert file names to mock URLs for demo)
      const apiData = {
        incidentType: formData.incidentType,
        description: formData.description,
        priority: formData.priority,
        severity: formData.severity,
        attachments: formData.attachments.map(name => `/uploads/${name}`)
      };

      const response = await fetch("/api/incidents", {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit incident");
      }

      setSubmitStatus("success");
      // Reset form after successful submission
      setFormData({
        incidentType: "",
        description: "",
        priority: "medium",
        severity: "medium",
        attachments: [],
      });
      
      // Redirect to incidents page after success
      setTimeout(() => {
        router.push("/client/incidents");
      }, 1500);
    } catch (error: any) {
      console.error("Error submitting incident:", error);
      setSubmitStatus("error");
      
      // If we have field-specific errors from API, display them
      if (error.response?.data?.errors) {
        setFormErrors(error.response.data.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Report a Security Incident
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Please provide details about the security incident you're experiencing.
        Our team will respond promptly to help resolve the issue.
      </p>
      
      {submitStatus === "success" && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
          Incident report submitted successfully! Our team will respond shortly.
        </div>
      )}
      {submitStatus === "error" && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded">
          Failed to submit incident report. Please check the form for errors and try again.
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <label htmlFor="incidentType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Incident Type
          </label>
          <select
            id="incidentType"
            name="incidentType"
            value={formData.incidentType}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          >
            <option value="">Select incident type</option>
            <option value="bug-fixing">Bug Fixing</option>
            <option value="malware-removal">Malware Removal</option>
            <option value="website-recovery">Website Recovery</option>
            <option value="wordpress">WordPress Security</option>
            <option value="payment-gateway">Payment Gateway Issues</option>
            <option value="server-security">Server Security</option>
            <option value="database-repair">Database Repair</option>
            <option value="emergency-support">Emergency Support</option>
          </select>
          {formErrors.incidentType && (
            <div className="mt-1 text-sm text-red-600 dark:text-red-400">
              {formErrors.incidentType[0]}
            </div>
          )}
        </motion.div>
        
        <motion.div
          className="grid grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
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
            {formErrors.priority && (
              <div className="mt-1 text-sm text-red-600 dark:text-red-400">
                {formErrors.priority[0]}
              </div>
            )}
          </div>
          
          <div>
            <label htmlFor="severity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Severity
            </label>
            <select
              id="severity"
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
            {formErrors.severity && (
              <div className="mt-1 text-sm text-red-600 dark:text-red-400">
                {formErrors.severity[0]}
              </div>
            )}
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
          {formErrors.description && (
            <div className="mt-1 text-sm text-red-600 dark:text-red-400">
              {formErrors.description[0]}
            </div>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Please describe the incident in detail including when it started, what you've observed, and any impact on your systems.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <label htmlFor="attachments" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Attachments (screenshots, logs, reports)
          </label>
          <input
            type="file"
            id="attachments"
            name="attachments"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            multiple
          />
          {formErrors.attachments && (
            <div className="mt-1 text-sm text-red-600 dark:text-red-400">
              {formErrors.attachments[0]}
            </div>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Max 5 files, each up to 10MB. Accepted formats: JPG, PNG, PDF, ZIP, LOG, TXT.
          </p>
        </motion.div>
        
        <motion.button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSubmitting ? "Submitting..." : "Report Incident"}
        </motion.button>
      </form>
    </motion.div>
  );
}
