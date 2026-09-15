# CCC Prep Public Website — SRS

## 1. Project Overview

Build a production-ready public website for CCC Prep, a NIELIT CCC preparation platform.

The website will act as the public SEO and learning platform connected to the same Supabase backend used by the mobile app.

Primary goals:

- Rank CCC-related educational pages in Google.
- Provide searchable CCC preparation resources.
- Let visitors discover tests, notes, blogs and books.
- Convert visitors into app users.
- Provide professional online test experiences.
- Support future authenticated user progress and enrolled series.

## 2. Technology Stack

Mandatory:

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase PostgreSQL
- Supabase Storage
- Supabase Auth for future authenticated features
- Inter font

Do NOT use:

- Vite
- Hygraph
- Mock APIs
- Dummy JSON
- Hardcoded fake content

Supabase must be the current single source of truth.

Use Server Components by default and Client Components only when interaction requires them.

## 3. Visual Design System

### Typography

Use **Inter** throughout the complete website.

Create a consistent type scale:

- Display
- H1/H2/H3
- Body
- Caption
- Button
- Metadata

### Theme

Support both:

- Dark theme
- Light theme

Theme preference:

- Light
- Dark
- System

Persist theme preference locally.

### Color Direction

Primary:

- Lavender / purple accent

Dark:

- Near-black background
- Dark elevated surfaces
- Soft borders

Light:

- White/near-white background
- Light cards
- Soft gray borders

Maintain accessible contrast.

## 4. Design Language

The interface should feel:

- Professional
- Educational
- Trustworthy
- Modern
- Fast
- Focused

The exam interface can take UX inspiration from professional competitive-exam platforms such as Testbook, but the implementation must have its own visual identity and design system.

Avoid:

- Excessive glassmorphism
- Overly colorful dashboards
- Childish illustrations
- Excessive gradients
- Heavy animations
- Generic template-like UI

## 5. Primary Navigation

Desktop navbar:

Logo:
CCC Prep

Navigation:

- Home
- Tests
- Notes
- Blogs
- Books

Additional:

- CCC Syllabus
- Search
- Theme switcher
- Login/Profile
- Download App CTA

Mobile:

- Logo
- Search
- Theme
- Hamburger menu

Mobile drawer contains:

- Home
- Tests
- Notes
- Blogs
- Books
- CCC Syllabus
- About
- Contact
- Privacy
- Terms
- Download App

## 6. Homepage

Sections:

1. Hero

- CCC preparation headline
- Short supporting text
- Start Preparing CTA
- Mock Test CTA

2. Test Categories
   Fetch `test_categories`.

3. Featured Test Series
   Fetch `test_series` where featured/active.

4. Popular Tests
   Fetch published `test_series_items`.

5. CCC Notes
   Fetch active `notes`.

6. Latest Blogs
   Fetch published `blogs`.

7. Recommended Books
   Fetch featured `books` and available `book_links`.

8. CCC Preparation Benefits

9. FAQ

10. App Download CTA

Never use dummy cards when database data is empty.

Show appropriate empty states.

## 7. Tests

### Tests Listing

Route:
`/tests`

Display:

- Test categories
- Search
- Category filtering
- Featured series
- Free/Paid badges
- Difficulty
- Number of sets
- CTA

Data:

- `test_categories`
- `test_series`

### Test Series Detail

Route:
`/test-series/[id-or-slug]`

Show:

- Series title
- Description
- Featured tag
- Free/Paid status
- Price
- Total sets
- Enrollment count where appropriate
- Series progress for authenticated users
- Set list
- Difficulty
- Questions
- Duration

Fetch:
`test_series`
`test_series_items`

CTA:

- Enroll
- Continue
- Start Test

### Test Set

Show:

- Test title
- Number of questions
- Duration
- Difficulty
- Total marks
- Negative marking
- Instructions
- Start button

## 8. Professional Exam Interface

The test interface must feel like a professional competitive-exam platform.

Layout:

- Sticky top header
- Test title
- Timer
- Question progress
- Question area
- Bilingual question
- Answer options
- Flag question
- Previous/Next controls
- Question navigator
- Submit button

Question panel should support:

- English
- Hindi
- English + Hindi

Question states:

- Current
- Answered
- Unanswered
- Flagged

Navigator:

- Numbered questions
- Scrollable/paginated question grid
- Clear state indicators

Result page:

- Score
- Accuracy
- Correct
- Wrong
- Skipped
- Time taken
- Review answers
- Reattempt

## 9. Chapters

Route:
`/chapters`

Data:
`chapters`

Individual:
`/chapters/[slug-or-id]`

Show:

- Chapter title
- Hindi title
- Description
- Related test content
- Related notes
- Related questions
- Related blogs

## 10. Notes

Routes:

- `/notes`
- `/notes/[category]`
- `/notes/[id]`

Data:

- `note_categories`
- `notes`

Features:

- Category filters
- Search
- Featured notes
- PDF preview/download
- Page count
- File size
- Thumbnail
- Related content

Categories:

- All
- CCC Notes
- Syllabus
- Revision Notes
- Important Topics
- Short Notes
- Other

`All` is a frontend filter, not a database category.

## 11. Blogs

For now, use Supabase only.

Data:

- `blog_categories`
- `blogs`

Routes:

- `/blogs`
- `/blogs/[category]`
- `/blogs/[slug]`

Features:

- Category filters
- Search
- Featured articles
- Article page
- Related posts
- Published date
- Author
- Featured image
- Bilingual title/content

Do not integrate Hygraph yet.

## 12. Books

Routes:

- `/books`
- `/books/[category]`
- `/books/[id]`

Data:

- `book_categories`
- `books`
- `book_links`

Book detail:

- Cover
- Title
- Author
- Description
- Language
- Pages
- Edition
- Publisher
- ISBN
- Available retailers

Retailer CTA examples:

- Buy from Amazon
- Buy from Flipkart

Only display links where `is_available = true`.

Include affiliate disclosure.

## 13. User Enrollment

Use:
`series_enrollments`

Public users can see series information.

Authenticated users can:

- Enroll
- View enrolled series
- Continue series
- View progress

Do not expose private enrollment data publicly.

## 14. Search

Global search should eventually search:

- Test series
- Notes
- Blogs
- Chapters
- Books

For initial version:

- Separate page-level search
- Server-side filtering
- Pagination

Avoid huge client-side datasets.

## 15. SEO Requirements

SEO is a first-class feature.

Implement:

### Technical SEO

- Server-rendered pages
- Semantic HTML
- Clean URLs
- Canonical URLs
- robots.txt
- XML sitemap
- Dynamic sitemap for blogs
- Dynamic sitemap for tests
- Dynamic sitemap for notes
- Dynamic sitemap for chapters
- Dynamic sitemap for books
- 404 page
- Redirect strategy

### Metadata

Every indexable route must have:

- Unique title
- Unique meta description
- Canonical
- Open Graph
- Social image

Use Next.js Metadata API.

### Structured Data

Use appropriate JSON-LD:

- Organization
- WebSite
- BreadcrumbList
- Article
- FAQPage only when real FAQs exist
- Book where appropriate

Never create misleading structured data.

## 16. Internal Linking

Create contextual linking between:

Blogs → Tests
Blogs → Notes
Blogs → Chapters
Chapters → Tests
Chapters → Notes
Notes → Tests
Tests → Notes
Books → Related topics
Related blogs → Related blogs

Avoid orphan pages.

## 17. URL Structure

Use human-readable URLs.

Examples:

- `/ccc-syllabus`
- `/ccc-exam-pattern`
- `/tests`
- `/test-series/ccc-full-mock-test`
- `/chapters/operating-system`
- `/notes/ccc-complete-notes`
- `/blogs/ccc-exam-date-2026`
- `/books/ccc-complete-guide`

Avoid unnecessary query parameters for indexable content.

## 18. Performance

Target excellent Core Web Vitals.

Requirements:

- `next/image`
- Correct image dimensions
- Lazy loading
- Minimal client JavaScript
- Server Components
- Streaming/Suspense where useful
- Pagination
- Proper caching
- Avoid unnecessary dependencies

## 19. Responsive Design

Mobile-first.

Desktop:

- Wide content container
- Sidebar where helpful
- Multi-column cards

Tablet:

- Two-column layouts

Mobile:

- Single-column
- Horizontal chips
- Sticky important actions
- Large touch targets
- No horizontal overflow

## 20. Accessibility

Implement:

- Keyboard navigation
- Visible focus states
- Semantic buttons
- Proper labels
- Accessible contrast
- Alt text
- ARIA only when required

## 21. Error States

All dynamic pages must have:

- Loading state
- Error state
- Empty state
- Not found state

Custom pages:

- 404
- 500

## 22. Security

- Respect Supabase RLS.
- Never expose service-role keys.
- Use server-side environment variables for secrets.
- Validate route parameters.
- Do not expose correct answers unnecessarily.
- Protect future paid content.
- Do not trust client-side enrollment/payment state.

## 23. Project Architecture

Recommended:

src/
├── app/
├── components/
│ ├── ui/
│ ├── layout/
│ ├── tests/
│ ├── notes/
│ ├── blogs/
│ └── books/
├── lib/
│ ├── supabase/
│ └── utils/
├── services/
├── hooks/
├── types/
├── constants/
└── config/

Keep database queries separate from UI components.

## 24. Acceptance Criteria

The final website must:

- Use real Supabase data only.
- Have no dummy/mock content.
- Have Home, Tests, Notes, Blogs and Books navigation.
- Support dark/light themes.
- Use Inter.
- Provide professional exam UI.
- Be fully responsive.
- Have dynamic SEO metadata.
- Have sitemap and robots.
- Have structured data.
- Have clean URLs.
- Have Supabase-connected content pages.
- Be deployable to Vercel.
