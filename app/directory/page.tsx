import Image from "next/image";
import DirectoryList from "./directory-list";
import UpcomingCrawl from "../upcoming-crawl";

export default function DirectoryPage() {
  return (
    <main className="flex-1 flex flex-col items-center">
      <UpcomingCrawl />
      <div className="w-full max-w-5xl px-4 py-8">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Image
              src="/logo.png"
              alt="Third Thursday"
              width={100}
              height={70}
              className="shrink-0"
            />
            <div>
              <h1 className="text-2xl font-bold text-white">Attendee Directory</h1>
              <p className="text-slate-text text-sm">
                Connect with everyone at tonight&apos;s event
              </p>
            </div>
          </div>
          <a
            href="/"
            className="bg-gold-500 hover:bg-gold-400 text-navy-900 font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
          >
            Register
          </a>
        </div>

        <DirectoryList />
      </div>
    </main>
  );
}
