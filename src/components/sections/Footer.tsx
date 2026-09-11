const links = [
  { label: "GitHub", href: "https://github.com/oscar301099" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/oscar-oros-duran-02b815244" },
  { label: "Email", href: "mailto:oros.duran.oscar@gmail.com" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#050816] px-6 py-8 text-zinc-300 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <p className="text-sm">© {year} Oscar Oros Duran</p>

        <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="transition hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        <p className="text-sm text-zinc-400">Desde Santa Cruz, Bolivia 🇧🇴</p>
      </div>
    </footer>
  );
}
