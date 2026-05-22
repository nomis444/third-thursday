import Image from "next/image";
import RegistrationForm from "./registration-form";
import UpcomingCrawl from "./upcoming-crawl";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-start">
      <UpcomingCrawl />
      <div className="w-full max-w-lg px-4 py-8">
        <div className="text-center mb-8">
          <Image
            src="/logo.png"
            alt="Third Thursday Open Networking"
            width={280}
            height={200}
            className="mx-auto mb-4"
            priority
          />
          <p className="text-slate-text text-lg">
            Share your info with tonight&apos;s attendees
          </p>
        </div>

        <a
          href="/directory"
          className="block w-full bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold py-4 px-6 rounded-xl text-center text-lg transition-colors mb-3"
        >
          View Tonight&apos;s Attendee Directory &rarr;
        </a>

        <div className="flex items-center justify-center gap-1.5 mb-6 opacity-70">
          <span className="text-slate-muted text-xs">powered by</span>
          <Image
            src="/midpoint-logo.png"
            alt="Midpoint AI"
            width={80}
            height={25}
            className="inline-block"
          />
        </div>

        <div className="bg-navy-800 rounded-2xl p-6 sm:p-8 border border-navy-600">
          <RegistrationForm />
        </div>
      </div>
    </main>
  );
}
