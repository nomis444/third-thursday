"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import type { Attendee } from "@/lib/types";

function getThirdThursday(y: number, m: number): Date {
  const first = new Date(y, m, 1);
  const dayOfWeek = first.getDay();
  const firstThursday = dayOfWeek <= 4 ? 5 - dayOfWeek : 12 - dayOfWeek;
  return new Date(y, m, firstThursday + 14);
}

function getVisibleEventDate(): string | null {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  let eventDate = getThirdThursday(now.getFullYear(), now.getMonth());

  if (eventDate > today) {
    let m = now.getMonth() - 1;
    let y = now.getFullYear();
    if (m < 0) { m = 11; y--; }
    eventDate = getThirdThursday(y, m);
  }

  const diffDays = (today.getTime() - eventDate.getTime()) / (1000 * 60 * 60 * 24);

  if (diffDays >= 0 && diffDays <= 3) {
    return eventDate.toISOString().split("T")[0];
  }

  return null;
}

function formatEventDate(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function DirectoryList() {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const eventDate = getVisibleEventDate();

  useEffect(() => {
    if (!eventDate) {
      setLoading(false);
      return;
    }

    const sb = getSupabase();

    async function fetchAttendees() {
      const { data } = await sb
        .from("attendees")
        .select("*")
        .eq("event_date", eventDate)
        .order("created_at", { ascending: true });

      setAttendees(data || []);
      setLoading(false);
    }

    fetchAttendees();

    const channel = sb
      .channel("attendees-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "attendees" },
        (payload) => {
          const newAttendee = payload.new as Attendee;
          if (newAttendee.event_date === eventDate) {
            setAttendees((prev) => [...prev, newAttendee]);
          }
        }
      )
      .subscribe();

    return () => {
      sb.removeChannel(channel);
    };
  }, [eventDate]);

  const filtered = attendees.filter((a) => {
    const q = search.toLowerCase();
    const fullName = `${a.first_name} ${a.last_name}`.toLowerCase();
    return (
      fullName.includes(q) ||
      a.company.toLowerCase().includes(q) ||
      (a.title && a.title.toLowerCase().includes(q)) ||
      (a.bio && a.bio.toLowerCase().includes(q))
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!eventDate) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-text text-lg mb-2">
          The attendee directory is available during and for 3 days after each event.
        </p>
        <p className="text-slate-muted text-sm">
          See you at the next Third Thursday!
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-sm font-medium text-slate-text">
            {formatEventDate(eventDate)}
          </h2>
          <p className="text-slate-muted text-sm">
            {attendees.length} attendee{attendees.length !== 1 ? "s" : ""} registered
          </p>
        </div>
        <input
          type="text"
          placeholder="Search name, company, or title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 bg-navy-700 border border-navy-600 rounded-lg text-sm focus:outline-none focus:border-gold-500 transition-colors w-full sm:w-64"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slate-muted text-lg">
            {attendees.length === 0
              ? "No one has registered yet. Be the first!"
              : "No results match your search."}
          </p>
          {attendees.length === 0 && (
            <a
              href="/"
              className="inline-block mt-4 bg-gold-500 hover:bg-gold-400 text-navy-900 font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Register Now
            </a>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((attendee) => (
            <div
              key={attendee.id}
              className="bg-navy-800 border border-navy-600 rounded-xl p-5 hover:border-gold-600 transition-colors"
            >
              <h3 className="text-lg font-bold text-white">{attendee.first_name} {attendee.last_name}</h3>
              <p className="text-gold-500 font-medium">{attendee.company}</p>
              {attendee.title && (
                <p className="text-slate-text text-sm mt-0.5">{attendee.title}</p>
              )}
              {attendee.bio && (
                <p className="text-slate-text text-sm mt-2 leading-relaxed">{attendee.bio}</p>
              )}

              <div className="mt-4 space-y-1.5">
                {attendee.email && (
                  <a
                    href={`mailto:${attendee.email}`}
                    className="flex items-center gap-2 text-slate-text hover:text-gold-400 text-sm transition-colors"
                  >
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    {attendee.email}
                  </a>
                )}
                {attendee.phone && (
                  <a
                    href={`tel:${attendee.phone}`}
                    className="flex items-center gap-2 text-slate-text hover:text-gold-400 text-sm transition-colors"
                  >
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                    {attendee.phone}
                  </a>
                )}
                {attendee.website && (
                  <a
                    href={attendee.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-slate-text hover:text-gold-400 text-sm transition-colors"
                  >
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A9 9 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                    </svg>
                    {attendee.website.replace(/^https?:\/\//, "")}
                  </a>
                )}
                {attendee.linkedin && (
                  <a
                    href={attendee.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-slate-text hover:text-gold-400 text-sm transition-colors"
                  >
                    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
