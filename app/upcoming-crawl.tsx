"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";

interface Event {
  event_date: string;
  venue_name: string;
  venue_address: string;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function UpcomingCrawl() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    async function fetchEvents() {
      const today = new Date().toISOString().split("T")[0];
      const { data } = await getSupabase()
        .from("events")
        .select("event_date, venue_name, venue_address")
        .gte("event_date", today)
        .order("event_date", { ascending: true })
        .limit(3);

      setEvents(data || []);
    }

    fetchEvents();
  }, []);

  if (events.length === 0) return null;

  const items = events.map((e) => (
    `${formatDate(e.event_date)} — ${e.venue_name}${e.venue_address ? `, ${e.venue_address}` : ""}`
  ));

  const repeated = [...items, ...items];

  return (
    <div className="w-full overflow-hidden bg-navy-800/60 border-y border-navy-600 py-2.5">
      <div className="flex animate-crawl whitespace-nowrap">
        {repeated.map((text, i) => (
          <span key={i} className="inline-flex items-center mx-8 text-sm">
            <span className="text-gold-500 font-semibold">UPCOMING</span>
            <span className="mx-2 text-navy-600">|</span>
            <span className="text-slate-text">{text}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
