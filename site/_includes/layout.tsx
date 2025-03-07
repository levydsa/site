import * as md from "react-icons/md";

export default ({ title, children }: Lume.Data, helpers: Lume.Helpers) => (
  <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width" />
      <link rel="stylesheet" href="/styles.css" />
      <title>{title}</title>
      <script
        dangerouslySetInnerHTML={{
          __html: `
(() => {
  const theme = localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", theme);
})()
      `,
        }}
      />
    </head>
    <body className="flex h-screen flex-col items-center bg-zinc-100 text-zinc-800 duration-200
      dark:bg-zinc-950 dark:text-zinc-200">
      <button
        id="scheme-toggle"
        className="fixed right-3 top-3 flex h-6 w-6 items-center justify-center text-5xl transition-colors print:hidden"
        type="button"
        aria-label="Toggle color scheme"
      >
        <md.MdSunny />
      </button>

      {children}
      <script src="/scheme.js" defer />
    </body>
  </html>
);
