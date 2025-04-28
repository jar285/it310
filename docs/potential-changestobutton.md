The Sage archetype is all about wisdom, learning and clarity---so let's lean into a calm, confident palette, generous whitespace, refined type and tactile details that feel "academic but approachable." Here are some concrete steps:

* * * * *

1\. Color palette
-----------------

-   **Primary --- Deep Indigo/Navy:** conveys seriousness and trust (e.g. `#1F2D4B`).

-   **Accent --- Muted Sage Green:** a nod to "sage," knowledge, growth (e.g. `#7D9D9C`).

-   **Neutral Backgrounds:** soft parchment--off-white (`#F8F5F0`) or very pale gray (`#F4F4F4`).

-   **Text:** charcoal (`#2D2D2D`) for body, near-black (`#111827`) for headings.

css

CopyEdit

`:root {
  --color-primary: #1F2D4B;
  --color-accent: #7D9D9C;
  --color-bg: #F8F5F0;
  --color-heading: #111827;
  --color-body: #2D2D2D;
}`

In Tailwind you'd extend these in your `tailwind.config.js` under `theme.colors`.

* * * * *

2\. Typography pairing
----------------------

You want one typeface that feels scholarly for your headings and a friendly, highly-legible companion for body text:

| Role | Typeface | Why? |
| --- | --- | --- |
| **Heading** | *Merriweather* or *Playfair Display* | A classic serif with stroke contrast---evokes print books & prestige. |
| **Body** | *Source Sans Pro* or *Open Sans* | Neutral, open forms; very readable at small sizes even on mobile. |
| **Code/Monospace** (for snippets) | *Fira Code* | Clean, modern; ligatures for a polished look. |

### Example font-face import

css

CopyEdit

`@import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@700&family=Source+Sans+Pro:wght@400;600&display=swap');`

html

CopyEdit

`<html class="font-sans">
  <body class="bg-bg text-body leading-relaxed">
    <h1 class="font-serif text-4xl text-heading">Ready to Start Learning?</h1>
    <p class="mt-2 text-lg">...</p>
  </body>
</html>`

js

CopyEdit

`// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        serif: ['Merriweather', 'serif'],
        sans: ['Source Sans Pro', 'sans-serif'],
      },
      colors: {
        primary: 'var(--color-primary)',
        accent: 'var(--color-accent)',
        bg: 'var(--color-bg)',
        heading: 'var(--color-heading)',
        body: 'var(--color-body)',
      },
    }
  }
}`

* * * * *

3\. Button & Card styling
-------------------------

-   **Buttons**

    -   **Primary**: `bg-accent text-white hover:bg-accent/90`

    -   **Secondary**: `border-accent text-accent hover:bg-accent/10`

    -   **Radius**: use `rounded-md` or even `rounded-lg` for a more "soft" feel.

    -   **Padding**: `px-6 py-3` to feel substantial and book-leaf--like.

-   **Cards**

    -   Background: `bg-white` with a **very subtle** drop-shadow (e.g. `shadow-sm`).

    -   Rounded corners: `rounded-lg`.

    -   On hover: lift slightly, `hover:shadow-md` + `hover:translate-y-[-2px]`.

* * * * *

4\. Layout & whitespace
-----------------------

-   Generous margins between sections (`py-16` for major sections).

-   Content width kept to ~`max-w-3xl` or `max-w-5xl` so lines don't get overly long.

-   Clear hierarchy: headings `text-4xl`, subheads `text-2xl`, body `text-base`--`text-lg`.

* * * * *

5\. Iconography & details
-------------------------

-   Swap generic icons for something that hints at "learning": e.g. a book icon alongside your filter's `<Filter>` icon in a muted accent color.

-   Use **underline-on-hover** for links rather than colored text---feels more scholarly.

-   Tiny separators (a thin rule under headings) can echo chapter headings in textbooks:

    html

    CopyEdit

    `<h2 class="text-2xl font-serif mb-2">Courses</h2>
    <hr class="border-t border-gray-200 mb-6"/>`

* * * * *

### Putting it in context

tsx

CopyEdit

`<section className="bg-bg py-16">
  <div className="mx-auto max-w-3xl px-4 text-center">
    <h2 className="font-serif text-4xl text-heading">Ready to Start Learning?</h2>
    <p className="mt-4 text-lg text-body">Join thousands ...</p>

    <div className="mt-8 flex justify-center gap-6">
      <Link href="/auth/register">
        <button className="bg-accent text-white rounded-lg px-6 py-3 font-medium hover:bg-accent/90 transition">
          Sign Up -- It's Free
        </button>
      </Link>
      <Link href="/courses">
        <button className="border border-accent text-accent rounded-lg px-6 py-3 font-medium hover:bg-accent/10 transition">
          Browse Courses
        </button>
      </Link>
    </div>
  </div>
</section>`

With these adjustments you'll be channeling the Sage: a calm, book-inspired aesthetic, carefully structured typography and plenty of breathing room so your content---and your user's curiosity---can shine.