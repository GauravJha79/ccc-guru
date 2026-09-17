import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "CCC Syllabus 2024-25 — Complete NIELIT CCC Exam Syllabus",
  description:
    "Complete and updated NIELIT CCC exam syllabus for 2024-25. Download PDF, chapter-wise topics, marks distribution and exam pattern for CCC preparation.",
  alternates: { canonical: "/ccc-syllabus" },
  openGraph: {
    title: "CCC Syllabus 2024-25 — Complete NIELIT CCC Exam Syllabus",
    description:
      "Complete NIELIT CCC syllabus with chapter-wise topics and marks distribution.",
    url: "/ccc-syllabus",
  },
};

const syllabusJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "CCC Syllabus 2024-25 — Complete NIELIT CCC Exam Syllabus",
  description:
    "Complete NIELIT CCC exam syllabus with all chapters and topics.",
  author: { "@type": "Organization", name: "CCC Guru" },
  publisher: { "@type": "Organization", name: "CCC Guru" },
  url: `${process.env.NEXT_PUBLIC_SITE_URL}/ccc-syllabus`,
};

const SYLLABUS_CHAPTERS = [
  {
    no: 1,
    title: "Introduction to Computer",
    hindi: "कम्प्यूटर का परिचय",
    topics: [
      "Characteristics of a Computer",
      "Basic Applications of Computer",
      "Components of a Computer System",
      "Concept of Hardware and Software",
      "Representation of Data/Information",
      "Applications of IECT",
    ],
  },
  {
    no: 2,
    title: "Introduction to Operating System",
    hindi: "ऑपरेटिंग सिस्टम का परिचय",
    topics: [
      "Basics of Operating System",
      "User Interface of OS — GUI and CUI",
      "Microsoft Windows",
      "File/Folder Management",
      "Desktop, Task Bar and Start Menu",
    ],
  },
  {
    no: 3,
    title: "Word Processing",
    hindi: "वर्ड प्रोसेसिंग",
    topics: [
      "Basics of Word Processing",
      "Opening and Closing of MS Word",
      "Working with Text",
      "Formatting Text and Paragraphs",
      "Working with Tables",
      "Mail Merge",
    ],
  },
  {
    no: 4,
    title: "Spread Sheet",
    hindi: "स्प्रेड शीट",
    topics: [
      "Basics of Spreadsheet",
      "Working with MS Excel",
      "Formatting and Formulas",
      "Functions: SUM, AVERAGE, IF, etc.",
      "Charts and Graphs",
    ],
  },
  {
    no: 5,
    title: "Presentation",
    hindi: "प्रस्तुतिकरण",
    topics: [
      "Basics of PowerPoint",
      "Creating and Editing Presentations",
      "Slide Layouts and Themes",
      "Animations and Transitions",
      "Slide Show",
    ],
  },
  {
    no: 6,
    title: "Introduction to Internet and WWW",
    hindi: "इंटरनेट और WWW का परिचय",
    topics: [
      "Basics of Internet",
      "Services on the Internet",
      "Web Browsers",
      "Search Engines",
      "Email and Netiquette",
    ],
  },
  {
    no: 7,
    title: "E-mail, Social Networking & e-Governance Services",
    hindi: "ई-मेल, सोशल नेटवर्किंग और ई-गवर्नेंस",
    topics: [
      "Email — Compose, Send, Receive",
      "Social Networking Websites",
      "Introduction to e-Governance",
      "Mobile/Smartphone use in e-Governance",
    ],
  },
  {
    no: 8,
    title: "Future Skills & Cyber Security",
    hindi: "भविष्य के कौशल और साइबर सुरक्षा",
    topics: [
      "Artificial Intelligence",
      "Big Data",
      "Machine Learning",
      "Internet of Things (IoT)",
      "Cyber Security Threats and Measures",
      "Strong Passwords and Safe Browsing",
    ],
  },
];

export default function CCCSyllabusPage() {
  return (
    <div className="container-page py-8 ">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(syllabusJsonLd) }}
      />

      <Breadcrumbs items={[{ label: "CCC Syllabus" }]} />

      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
            CCC Syllabus 2024-25
          </h1>
          <p className="text-text-secondary leading-relaxed">
            Complete NIELIT CCC (Course on Computer Concepts) exam syllabus with
            all chapters, topics, and marks distribution. The CCC exam consists
            of <strong>100 MCQ questions</strong> to be completed in{" "}
            <strong>90 minutes</strong>.
          </p>
        </div>

        {/* Exam pattern card */}
        <div className="card-elevated rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-text-primary mb-4">
            Exam Pattern
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Total Questions", value: "100" },
              { label: "Duration", value: "90 Minutes" },
              { label: "Passing Marks", value: "50 / 100" },
              { label: "Negative Marking", value: "None" },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <div className="text-xl font-bold text-primary-600 dark:text-primary-400">
                  {value}
                </div>
                <div className="text-xs text-text-muted mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Chapters */}
        <h2 className="text-2xl font-bold text-text-primary mb-5">
          Chapter-wise Syllabus
        </h2>

        <div className="space-y-4">
          {SYLLABUS_CHAPTERS.map((chapter) => (
            <details key={chapter.no} className="card" name="syllabus">
              <summary className="flex items-center gap-3 p-5 cursor-pointer list-none">
                <span className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 flex items-center justify-center text-sm font-bold shrink-0">
                  {chapter.no}
                </span>
                <div className="flex-1">
                  <h3 className="font-semibold text-text-primary">
                    {chapter.title}
                  </h3>
                  <p className="text-sm text-text-muted" lang="hi">
                    {chapter.hindi}
                  </p>
                </div>
                <span className="text-primary-500 text-lg">+</span>
              </summary>
              <div className="px-5 pb-5">
                <ul className="space-y-1.5">
                  {chapter.topics.map((topic) => (
                    <li
                      key={topic}
                      className="flex items-start gap-2 text-sm text-text-secondary"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-2 shrink-0" />
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 card p-6 text-center">
          <h3 className="font-bold text-text-primary mb-2">
            Ready to Practice?
          </h3>
          <p className="text-text-muted text-sm mb-4">
            Take chapter-wise mock tests based on this syllabus.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/tests" className="btn-primary">
              Start Mock Test
            </Link>
            <Link href="/notes" className="btn-secondary">
              Download Notes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
