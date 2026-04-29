# Lecture 02 – Semantic HTML & Structure

## 1. What I implemented this lecture

- Created a semantic HTML portfolio page with proper document structure
- Implemented skip navigation for keyboard accessibility
- Used semantic elements: header, main, section, article, figure, figcaption, nav, footer
- Added embedded video using iframe with proper accessibility attributes
- Created logical heading hierarchy (h1 → h2 → h3)
- Added alt text for all images describing content and context
- Structured portfolio works with figure/figcaption combinations
- Organized interests into semantic sections with lists

## 2. Semantic decisions I made (REQUIRED)

### Decision 1

- **Element(s) used:** `&lt;article&gt;` for individual portfolio projects
- **Where in the page:** Inside the Portfolio section, wrapping each project (Circuit Analysis and Sensor Network)
- **Why this element is semantically correct:** The `&lt;article&gt;` element represents a self-contained composition that could stand alone. Each project has its own heading, content, images, and links. If syndicated, each article would make sense independently. This is more appropriate than `&lt;div&gt;` because it conveys that this is a distinct piece of content.

### Decision 2

- **Element(s) used:** `&lt;figure&gt;` and `&lt;figcaption&gt;` for images and video
- **Where in the page:** Wrapping project images and the embedded YouTube video in the portfolio section
- **Why this element is semantically correct:** These elements create a semantic relationship between media content and its caption. The `&lt;figcaption&gt;` provides context that is explicitly associated with the image/video, helping screen readers understand the connection. This is better than placing images in `&lt;div&gt;` with separate text paragraphs because it programmatically links the content to its description.

### Decision 3

- **Element(s) used:** `&lt;section&gt;` with `aria-labelledby` attributes
- **Where in the page:** Portfolio/Works section and Areas of Interest section
- **Why this element is semantically correct:** I used `&lt;section&gt;` to group related content thematically (projects vs. interests) rather than generic `&lt;div&gt;` containers. The `aria-labelledby` attribute explicitly associates each section with its heading, improving navigation for assistive technologies. This helps screen reader users understand the document outline and jump between major content areas.

### Decision 4 (Bonus)

- **Element(s) used:** `&lt;nav&gt;` in the footer for social links
- **Where in the page:** Footer section containing social media links
- **Why this element is semantically correct:** The `&lt;nav&gt;` element identifies a block of navigation links. Since the social media links are a distinct navigation block (different from the skip link), wrapping them in `&lt;nav&gt;` with an `aria-label` helps assistive technology users identify this as a navigation landmark. This is more semantic than a generic `&lt;ul&gt;` alone.

## 3. Accessibility considerations

- **Skip link:** Added "Skip to content" link at the top of the page that jumps to the `&lt;main&gt;` element. This allows keyboard users to bypass repetitive navigation and jump directly to content.
- **Alt text:** All images include descriptive alt text that conveys the purpose and content of the image, not just "image of circuit" but describes what the circuit shows.
- **Heading hierarchy:** Proper nesting (h1 for name, h2 for major sections, h3 for subsections) creates a logical document outline for screen readers.
- **ARIA labels:** Used `aria-labelledby` to connect sections with their headings, and `aria-label` on navigation elements to provide context.
- **Language attribute:** Added `lang="en"` to the HTML element for proper pronunciation by screen readers.
- **Semantic structure:** Using proper HTML5 elements allows assistive technologies to identify landmarks (header, main, footer, nav) and provide navigation shortcuts.

## 4. What I learned

- The importance of semantic HTML for both accessibility and SEO
- How to properly use `&lt;figure&gt;` and `&lt;figcaption&gt;` for media content
- The difference between `&lt;section&gt;` and `&lt;article&gt;` (article is self-contained, section is thematic grouping)
- How ARIA attributes can enhance semantic meaning without changing visual appearance
- Proper heading hierarchy is crucial for screen reader navigation
- Skip links are essential for keyboard accessibility compliance

## 5. What I still need to improve

- Understanding when to use `&lt;article&gt;` vs `&lt;section&gt;` vs `&lt;div&gt;` in complex layouts
- Learning more ARIA attributes for dynamic content
- Implementing focus indicators and keyboard navigation patterns
- Testing with actual screen readers (NVDA, JAWS, VoiceOver)
- Understanding landmark regions beyond the basic semantic elements

## 6. Notes about AI usage (if any)

- **Tool used:** GitHub Copilot for HTML structure suggestions
- **What I accepted as-is:** Basic HTML5 boilerplate template
- **What I modified manually:**
  - All semantic element choices (section vs article decisions)
  - Alt text descriptions
  - ARIA attributes and their values
  - Content and structure of portfolio sections
  - Heading hierarchy decisions
  - Accessibility feature implementations
