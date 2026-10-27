/* Shared behaviour for the Found Fluency website and the Found Fluency AI platform:
   language switch, header, footer, external links and scroll reveal. */
(function () {
  var cfg = window.NOVA_CONFIG || { LINKS: {} };
  var body = document.body;
  var base = body.getAttribute("data-base") || "";
  var page = body.getAttribute("data-page") || "";
  var isApp = body.hasAttribute("data-app");

  // ---------- Language ----------
  function storedLang() {
    var q = new URLSearchParams(location.search).get("lang");
    if (q === "de" || q === "en") return q;
    try { return localStorage.getItem("nova-lang") || "de"; } catch (e) { return "de"; }
  }
  window.NOVA_LANG = storedLang();

  window.setLang = function (lang) {
    window.NOVA_LANG = lang;
    document.documentElement.setAttribute("data-lang", lang);
    document.documentElement.lang = lang;
    try { localStorage.setItem("nova-lang", lang); } catch (e) { /* storage unavailable */ }
    // Attributes that cannot be switched with CSS
    document.querySelectorAll("[data-de-placeholder]").forEach(function (el) {
      el.placeholder = el.getAttribute("data-" + lang + "-placeholder") || "";
    });
    document.querySelectorAll("[data-de-alt]").forEach(function (el) {
      el.alt = el.getAttribute("data-" + lang + "-alt") || "";
    });
    document.querySelectorAll("option[data-de]").forEach(function (el) {
      el.textContent = el.getAttribute("data-" + lang);
    });
    var title = document.querySelector("title");
    if (title && title.getAttribute("data-" + lang)) title.textContent = title.getAttribute("data-" + lang);
    document.querySelectorAll(".lang-toggle button").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-set-lang") === lang);
    });
    document.dispatchEvent(new CustomEvent("langchange", { detail: lang }));
  };

  // Bilingual helper for strings built in JavaScript
  window.L = function (de, en) { return window.NOVA_LANG === "en" ? en : de; };
  window.bi = function (de, en) { return '<span lang="de">' + de + '</span><span lang="en">' + en + "</span>"; };
  var bi = window.bi;

  // ---------- Header ----------
  var NAV = isApp ? [
    { href: base + "app/index.html", de: "Start", en: "Start", id: "app-home" },
    { href: base + "app/learner.html", de: "Lernende", en: "Learner", id: "learner" },
    { href: base + "app/trainer.html", de: "Trainer-Cockpit", en: "Trainer cockpit", id: "trainer" },
    { href: base + "app/insights.html", de: "L&amp;D (anonym)", en: "L&amp;D (anonymous)", id: "insights" },
    { href: base + "index.html", de: "← Website", en: "← Website", id: "site" }
  ] : [
    { href: base + "courses.html", de: "Kurse", en: "Courses", id: "courses" },
    { href: base + "solution.html", de: "KI-Coach", en: "AI coach", id: "solution" },
    { href: base + "executive.html", de: "Executive", en: "Executive", id: "executive" },
    { href: base + "process.html", de: "Ablauf", en: "Process", id: "process" },
    { href: base + "pricing.html", de: "Preise", en: "Pricing", id: "pricing" },
    { href: base + "roadmap.html", de: "Roadmap", en: "Roadmap", id: "roadmap" },
    { href: base + "app/index.html", de: "Demo", en: "Demo", id: "app" },
    { href: base + "contact.html", de: "Kontakt", en: "Contact", id: "contact" }
  ];

  var markSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" aria-hidden="true">' +
    '<line x1="5" y1="10" x2="5" y2="14"/><line x1="9.5" y1="7" x2="9.5" y2="17"/><line x1="14.5" y1="5" x2="14.5" y2="19"/><line x1="19" y1="9" x2="19" y2="15"/></svg>';

  var header = document.createElement("header");
  header.className = "site-header";
  header.innerHTML =
    '<div class="container nav">' +
      '<a class="logo" href="' + base + 'index.html"><span class="logo-mark">' + markSvg + "</span>" +
        "<span>Found Fluency<small>" + (isApp ? "Found Fluency AI · " + bi("Plattform-Demo", "Platform demo") : bi("Sprachschule", "Language school")) + "</small></span></a>" +
      '<ul class="nav-links" id="nav-links">' +
        NAV.map(function (n) {
          return '<li><a href="' + n.href + '"' + (n.id === page ? ' aria-current="page"' : "") + ">" + bi(n.de, n.en) + "</a></li>";
        }).join("") +
      "</ul>" +
      '<div class="nav-actions">' +
        '<div class="lang-toggle" role="group" aria-label="Sprache / Language">' +
          '<button type="button" data-set-lang="de">DE</button><button type="button" data-set-lang="en">EN</button></div>' +
        (isApp ? "" : '<a class="btn btn--sm hide-mobile" data-link="discovery">' + bi("Gespräch buchen", "Book a call") + "</a>") +
        '<button class="menu-btn" aria-label="Menu" aria-expanded="false" aria-controls="nav-links"><span></span></button>' +
      "</div>" +
    "</div>";
  body.prepend(header);

  header.querySelectorAll(".lang-toggle button").forEach(function (b) {
    b.addEventListener("click", function () { window.setLang(b.getAttribute("data-set-lang")); });
  });
  var menuBtn = header.querySelector(".menu-btn");
  menuBtn.addEventListener("click", function () {
    var open = body.classList.toggle("menu-open");
    menuBtn.setAttribute("aria-expanded", open);
  });
  header.querySelectorAll(".nav-links a").forEach(function (a) {
    a.addEventListener("click", function () { body.classList.remove("menu-open"); });
  });
  window.addEventListener("scroll", function () { header.classList.toggle("scrolled", window.scrollY > 8); }, { passive: true });

  // ---------- Footer ----------
  if (isApp) {
    var mini = document.createElement("footer");
    mini.className = "small";
    mini.style.cssText = "text-align:center;padding:24px 16px 40px";
    mini.innerHTML = '<a href="' + base + 'impressum.html">Impressum</a> · <a href="' + base + 'datenschutz.html">' + bi("Datenschutz", "Privacy") + "</a>";
    body.appendChild(mini);
  }
  if (!isApp) {
    var footer = document.createElement("footer");
    footer.className = "site-footer";
    footer.innerHTML =
      '<div class="container"><div class="footer-grid">' +
        '<div><a class="logo" href="' + base + 'index.html"><span class="logo-mark">' + markSvg + "</span><span>Found Fluency</span></a>" +
          '<p style="margin-top:16px;max-width:38ch">' + bi("Sprachschule für Berufstätige und Unternehmen: online, in Präsenz oder hybrid, mit Found Fluency AI.",
            "Language school for professionals and companies: online, in person or hybrid, with Found Fluency AI.") + "</p>" +
          '<a class="btn btn--sm" data-link="discovery">' + bi("Gespräch buchen", "Book a call") + "</a></div>" +
        "<div><h4>" + bi("Ablauf", "Process") + "</h4><ul>" +
          '<li><a href="' + base + 'roadmap.html">01 ' + bi("Sprach-Roadmap", "Language Roadmap") + "</a></li>" +
          '<li><a href="' + base + 'process.html#training">02 ' + bi("Schulung", "Training") + "</a></li>" +
          '<li><a href="' + base + 'process.html#adoption">03 ' + bi("Einführung", "Adoption") + "</a></li>" +
          '<li><a href="' + base + 'process.html#pilot">04 ' + bi("Pilot &amp; Rollout", "Pilot &amp; rollout") + "</a></li>" +
          '<li><a href="' + base + 'process.html#care">05 ' + bi("Betreuung", "Ongoing care") + "</a></li>" +
        "</ul></div>" +
        "<div><h4>Found Fluency</h4><ul>" +
          NAV.map(function (n) { return '<li><a href="' + n.href + '">' + bi(n.de, n.en) + "</a></li>"; }).join("") +
          '<li><a href="' + base + 'about.html">' + bi("Über uns", "About us") + "</a></li>" +
          '<li><a href="' + base + 'trust.html">' + bi("Datenschutz &amp; KI", "Privacy &amp; AI") + "</a></li>" +
          '<li><a href="' + base + 'book.html">' + bi("Buchen &amp; bezahlen", "Book &amp; pay") + "</a></li>" +
          '<li><a data-link="linkedin">LinkedIn</a></li>' +
        "</ul></div>" +
      '</div><div class="footer-bottom"><span>© ' + new Date().getFullYear() + " Found Fluency · Speak up. Get heard.</span>" +
        '<span><a href="' + base + 'impressum.html">Impressum</a> · <a href="' + base + 'datenschutz.html">' + bi("Datenschutz", "Privacy") + '</a> · <a href="mailto:' + cfg.email + '">' + cfg.email + "</a></span></div></div>";
    body.appendChild(footer);
  }

  // Executive Check results, reused to prefill booking links and the booking page
  window.loadAssessment = function () {
    try { return JSON.parse(localStorage.getItem("nova-check") || "null"); } catch (e) { return null; }
  };
  window.saveAssessment = function (data) {
    try { localStorage.setItem("nova-check", JSON.stringify(data)); } catch (e) { /* storage unavailable */ }
  };

  // ---------- Links ----------
  window.resolveLinks = function (root) {
    (root || document).querySelectorAll("[data-link]").forEach(function (el) {
      var key = el.getAttribute("data-link");
      var url = cfg.LINKS[key] || (key === "sessions" ? cfg.LINKS.discovery : "");
      if (url) {
        // Calendly accepts name/email query parameters to prefill its booking form
        var a = window.loadAssessment();
        if (a && a.email && /calendly\.com/.test(url)) {
          url += (url.indexOf("?") === -1 ? "?" : "&") + "name=" + encodeURIComponent(a.name || "") + "&email=" + encodeURIComponent(a.email);
        }
        el.href = url;
        if (/^https?:/.test(url)) { el.target = "_blank"; el.rel = "noopener"; }
      } else {
        el.href = base + "contact.html?topic=" + encodeURIComponent(el.getAttribute("data-link"));
      }
    });
  };

  // ---------- Reveal on scroll ----------
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce && !isApp && "IntersectionObserver" in window) {
    document.documentElement.classList.add("js");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });
    document.querySelectorAll(".section-head, .card, .stage, .step-row, .lvl, .faq details, .hero-art, .flow, .gantt, .dots").forEach(function (el) {
      var i = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.classList.add("reveal");
      el.style.setProperty("--d", (i % 4) * 80 + "ms");
      io.observe(el);
    });
  }

  window.setLang(window.NOVA_LANG);
  window.resolveLinks();
})();
