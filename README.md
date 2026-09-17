# 🎓 CCC Guru — NIELIT CCC Exam Preparation Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ecf8e?style=flat-square&logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**CCC Guru** (`cccguru.in`) is a high-performance, full-stack educational web application and SEO-driven platform dedicated to helping students and job aspirants across India prepare for the **NIELIT CCC (Course on Computer Concepts)** examination.

---

## 🚀 Key Features

### 🧪 1. Interactive CCC Online Test Simulator
- **Real Exam Simulation**: Practice full-length (100 questions / 90 minutes) and chapter-wise mock tests simulating the official NIELIT exam interface.
- **Bilingual Question Bank**: Seamlessly switch between **Hindi & English** with persistent language preference storage (`localStorage`).
- **Interactive Question Navigator**: Track answered, flagged, and unattempted questions in real time.
- **Instant Result Analytics & Review**: Comprehensive scorecards with percentage calculation, accuracy rates, time-spent metrics, and question-by-question explanations.

### 📚 2. Downloadable PDF Study Notes
- Chapter-wise and topic-wise bilingual study notes covering LibreOffice (Writer, Calc, Impress), Computer Fundamentals, Operating Systems, Networking, Cyber Security, and Digital Financial Services.
- Fast direct PDF download links with file size and page count metadata.

### 📖 3. Complete Updated CCC Syllabus (2024–2025)
- Structured breakdown of all 9 official NIELIT CCC chapters.
- Topic-wise syllabus coverage, marks distribution, and exam pattern guidelines.

### ✍️ 4. Educational Blog & Exam Strategy
- Articles, exam tips, study plans, and latest NIELIT updates.
- Bilingual article reader with Markdown rendering (`react-markdown` + `remark-gfm`) and estimated reading time.

### 🛒 5. Recommended Books Directory
- Curated list of top-rated CCC preparation books with direct Amazon & Flipkart buy links and author/publisher details.

### 🔍 6. Global Fast Search & Category Filtering
- Instant search across mock tests, notes, blog posts, and recommended books.
- Category filters for quick resource discovery.

### 🌓 7. Premium Dark & Light Mode
- Modern glassmorphic design system tailored with purple/lavender brand accents.
- Seamless Dark, Light, and System theme switching powered by `next-themes`.

### 🎯 8. Search Engine Optimization (SEO Ready)
- **Dynamic XML Sitemap** (`/sitemap.xml`) indexing all static and dynamic routes.
- **Structured Data (JSON-LD)**: `Organization`, `WebSite` (with Sitelinks Searchbox), `BreadcrumbList`, `Article`, `LearningResource` (Quiz), `DigitalDocument`, and `Book` schemas.
- **Optimized Metadata**: Custom title templates, OpenGraph tags, Twitter Cards, and canonical tags for ranking on high-intent keywords like *"CCC online test"*.
- **PWA Web App Manifest** (`/manifest.webmanifest`).

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **UI Library** | [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + Custom Design Tokens |
| **Database & Auth** | [Supabase](https://supabase.com/) (PostgreSQL + PostgREST + SSR Client) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Content Rendering** | [React Markdown](https://github.com/remarkjs/react-markdown) + [Remark GFM](https://github.com/remarkjs/remark-gfm) |
| **Theming** | [Next-Themes](https://github.com/pacocoursey/next-themes) |

---

## 📂 Project Structure

```bash
website/
├── public/                  # Static assets (favicons, SVGs)
├── src/
│   ├── app/                 # Next.js App Router routes & layouts
│   │   ├── about/           # About CCC Guru
│   │   ├── blogs/           # Blog listing & [slug] post pages
│   │   ├── books/           # Recommended books & [id] detail
│   │   ├── ccc-syllabus/    # Interactive CCC exam syllabus
│   │   ├── chapters/        # Syllabus chapters & [id] study pages
│   │   ├── contact/         # Contact & feedback form
│   │   ├── download/        # Mobile app download landing page
│   │   ├── notes/           # Study notes library & [id] detail
│   │   ├── search/          # Universal search page
│   │   ├── test-series/     # [id] Series detail & [itemId]/exam test engine
│   │   ├── tests/           # CCC Online Tests landing page
│   │   ├── layout.tsx       # Root layout with theme provider & metadata
│   │   ├── manifest.ts      # Web App Manifest generator
│   │   ├── robots.ts        # Dynamic robots.txt
│   │   └── sitemap.ts       # Dynamic sitemap.xml generator
│   ├── components/
│   │   ├── blogs/           # Blog content reader & language toggle
│   │   ├── layout/          # Navbar, Footer, MobileDrawer, Breadcrumbs, ThemeSwitcher
│   │   ├── providers/       # ThemeProvider wrapper
│   │   ├── tests/           # ExamInterface (test engine, timer, navigator, result review)
│   │   └── ui/              # Reusable UI primitives (Badge, Skeleton, EmptyState, etc.)
│   ├── lib/
│   │   ├── data/            # Supabase query functions (tests, notes, blogs, books, chapters)
│   │   ├── supabase/        # Supabase client singletons
│   │   └── utils.ts         # Formatting, timers, and URL helpers
│   └── types/
│       └── database.ts      # Supabase TypeScript schema definitions
├── .env.local               # Local environment variables
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🗄️ Database Architecture (Supabase)

The platform is backed by Supabase PostgreSQL tables:
- `test_categories`: Categorization for test series (Full-length, Chapter-wise, Topic-wise).
- `test_series`: Test series packages with pricing, total sets, and enrollment metrics.
- `test_series_items`: Individual test sets with question counts and time durations.
- `questions`: Question bank with bilingual questions (`question_en`, `question_hi`), 4 options, correct answer, and bilingual explanations.
- `notes` & `note_categories`: Study notes metadata, PDF URLs, page counts, and categories.
- `blogs` & `blog_categories`: Blog posts with markdown content in English and Hindi.
- `books` & `book_categories`: Recommended books with buy links and pricing.
- `chapters`: Official NIELIT syllabus chapters and topic lists.

---

## 🚦 Getting Started

### Prerequisites
- **Node.js**: `v18.17.0` or higher
- **npm**, **pnpm**, or **yarn**
- A **Supabase** account and project

### 1. Clone the Repository
```bash
git clone https://github.com/GauravJha79/ccc-guru.git
cd ccc-guru/website
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Production Site URL (used for canonical URLs and sitemaps)
NEXT_PUBLIC_SITE_URL=https://cccguru.in
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
npm run start
```

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contact & Support

For queries, feedback, or collaborations:
- **Website**: [https://cccguru.in](https://cccguru.in)
- **Email**: [hello@cccguru.in](mailto:hello@cccguru.in)
