export default function Footer() {
  const year = new Date().getFullYear();
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer
      className="relative py-16 px-6"
      style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
    >
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(4,5,14,0) 0%, rgba(2,3,9,1) 100%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div
              className="font-display text-xl font-light tracking-[0.25em] mb-2"
              style={{
                background: "linear-gradient(135deg, #4a7ef7, #8ab4ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              STEMONEF
            </div>
            <div
              className="font-mono-geist text-[9px] tracking-[0.35em] uppercase mb-4"
              style={{ color: "rgba(212,160,23,0.6)" }}
            >
              ENTERPRISES
            </div>
            <p
              className="text-xs leading-relaxed"
              style={{
                color: "rgba(255,255,255,0.3)",
                fontFamily: "Sora, sans-serif",
                maxWidth: "200px",
              }}
            >
              For a Better Tomorrow.
            </p>
          </div>

          {/* Pillars */}
          <div>
            <div
              className="font-mono-geist text-[9px] tracking-[0.35em] uppercase mb-4"
              style={{ color: "rgba(255,255,255,0.25)" }}
            >
              STRUCTURAL PILLARS
            </div>
            <div className="space-y-2">
              {[
                "EPOCHS",
                "HUMANON",
                "STEAMI",
                "NOVA",
                "TERRA",
                "EQUIS",
                "ETHOS",
              ].map((pillar) => (
                <div
                  key={pillar}
                  className="font-mono-geist text-xs"
                  style={{
                    color: "rgba(255,255,255,0.35)",
                    letterSpacing: "0.15em",
                  }}
                >
                  {pillar}
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <div
              className="font-mono-geist text-[9px] tracking-[0.35em] uppercase mb-4"
              style={{ color: "rgba(255,255,255,0.25)" }}
            >
              INSTITUTIONAL
            </div>
            <div className="space-y-2">
              {[
                "Ethics Charter",
                "Accountability Report",
                "Impact Fund",
                "Talent Pipeline",
                "Intelligence Feed",
                "Privacy Policy",
              ].map((item) => (
                <div
                  key={item}
                  className="font-mono-geist text-xs cursor-pointer transition-colors duration-200"
                  style={{
                    color: "rgba(255,255,255,0.35)",
                    letterSpacing: "0.1em",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.color =
                      "rgba(212,160,23,0.7)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.color =
                      "rgba(255,255,255,0.35)";
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <p
            className="font-mono-geist text-[10px]"
            style={{ color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em" }}
          >
            © {year} STEMONEF ENTERPRISES. All Rights Reserved.
          </p>

          <a
            href={utmLink}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono-geist text-[10px] transition-colors duration-200"
            style={{
              color: "rgba(255,255,255,0.2)",
              letterSpacing: "0.1em",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color =
                "rgba(212,160,23,0.5)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color =
                "rgba(255,255,255,0.2)";
            }}
          >
            Built with ♥ using caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
