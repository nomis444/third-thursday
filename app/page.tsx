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

        <div className="bg-navy-800 rounded-2xl p-6 sm:p-8 border border-navy-600">
          <RegistrationForm />
        </div>

        <div className="mt-6 text-center">
          <a
            href="/directory"
            className="text-gold-400 hover:text-gold-500 text-sm font-medium transition-colors"
          >
            View Tonight&apos;s Attendee Directory &rarr;
          </a>
        </div>
      </div>
    </main>
  );
}
