"use client";

import { useState } from "react";
import { getSupabase } from "@/lib/supabase";

function getCurrentEventDate(): string {
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth();

  function getThirdThursday(y: number, m: number): Date {
    const first = new Date(y, m, 1);
    const dayOfWeek = first.getDay();
    const firstThursday = dayOfWeek <= 4 ? 5 - dayOfWeek : 12 - dayOfWeek;
    return new Date(y, m, firstThursday + 14);
  }

  let eventDate = getThirdThursday(year, month);
  if (now > new Date(eventDate.getTime() + 24 * 60 * 60 * 1000)) {
    month++;
    if (month > 11) {
      month = 0;
      year++;
    }
    eventDate = getThirdThursday(year, month);
  }

  return eventDate.toISOString().split("T")[0];
}

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    company: "",
    title: "",
    email: "",
    phone: "",
    website: "",
    linkedin: "",
    bio: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const eventDate = getCurrentEventDate();

    const { error } = await getSupabase().from("attendees").insert({
      ...formData,
      event_date: eventDate,
    });

    if (error) {
      if (error.code === "23505") {
        setErrorMsg("You've already registered for this event.");
      } else {
        setErrorMsg("Something went wrong. Please try again.");
      }
      setStatus("error");
      return;
    }

    setStatus("success");
  }

  if (status === "success") {
    return (
      <div className="text-center py-12 px-6">
        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gold-500 mb-2">You&apos;re In!</h2>
        <p className="text-slate-text mb-6">
          Your info has been shared with tonight&apos;s attendees.
        </p>
        <a
          href="/directory"
          className="inline-block bg-gold-500 hover:bg-gold-400 text-navy-900 font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          View Attendee Directory
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="first_name" className="block text-sm font-medium text-slate-text mb-1">
            First Name *
          </label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            required
            value={formData.first_name}
            onChange={handleChange}
            placeholder="John"
            className="w-full px-4 py-3 bg-navy-700 border border-navy-600 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
          />
        </div>
        <div>
          <label htmlFor="last_name" className="block text-sm font-medium text-slate-text mb-1">
            Last Name *
          </label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            required
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Smith"
            className="w-full px-4 py-3 bg-navy-700 border border-navy-600 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
          />
        </div>
      </div>

      <div>
        <label htmlFor="company" className="block text-sm font-medium text-slate-text mb-1">
          Company *
        </label>
        <input
          type="text"
          id="company"
          name="company"
          required
          value={formData.company}
          onChange={handleChange}
          placeholder="Acme Corp"
          className="w-full px-4 py-3 bg-navy-700 border border-navy-600 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
        />
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-text mb-1">
          Title / Role
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Owner, VP of Sales, etc."
          className="w-full px-4 py-3 bg-navy-700 border border-navy-600 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-text mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="john@acme.com"
            className="w-full px-4 py-3 bg-navy-700 border border-navy-600 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-slate-text mb-1">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(716) 555-1234"
            className="w-full px-4 py-3 bg-navy-700 border border-navy-600 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="website" className="block text-sm font-medium text-slate-text mb-1">
            Website
          </label>
          <input
            type="url"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://acme.com"
            className="w-full px-4 py-3 bg-navy-700 border border-navy-600 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
          />
        </div>
        <div>
          <label htmlFor="linkedin" className="block text-sm font-medium text-slate-text mb-1">
            LinkedIn
          </label>
          <input
            type="url"
            id="linkedin"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/johnsmith"
            className="w-full px-4 py-3 bg-navy-700 border border-navy-600 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
          />
        </div>
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-slate-text mb-1">
          What do you do &amp; who are you looking to connect with?
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={3}
          value={formData.bio}
          onChange={handleChange}
          placeholder="E.g. We provide commercial HVAC services and are looking to connect with property managers and general contractors."
          className="w-full px-4 py-3 bg-navy-700 border border-navy-600 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors resize-none"
        />
      </div>

      {status === "error" && (
        <p className="text-red-400 text-sm">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-navy-900 font-bold py-3 px-6 rounded-lg text-lg transition-colors cursor-pointer"
      >
        {status === "submitting" ? "Submitting..." : "Share My Info"}
      </button>

      <p className="text-slate-muted text-xs text-center">
        Your info will be visible to other attendees of this event only.
      </p>
    </form>
  );
}
