/*
 * Site configuration. Every element with data-link="..." is resolved from
 * LINKS, so each external address only needs changing here. A value of ""
 * falls back to the contact page.
 */
window.NOVA_CONFIG = {
  brand: "Found Fluency",
  product: "Found Fluency AI",
  email: "daniel.lambert01@gmail.com",

  // Sprach-Roadmap answers are delivered to this Gmail inbox via FormSubmit.
  // The first submission sends a one-time activation email that must be confirmed.
  formEndpoint: "https://formsubmit.co/ajax/daniel.lambert01@gmail.com",

  LINKS: {
    // Calendly: free discovery call, e.g. "https://calendly.com/your-name/erstgespraech".
    // When set, book.html shows the Calendly calendar directly on the page.
    discovery: "https://calendly.com/daniel-lambert01/erstgespraech",
    // Calendly event for paid sessions (optional; falls back to the discovery link)
    sessions: "",
    // Card payment incl. Apple Pay / Google Pay / SEPA: a Stripe Payment Link
    stripe: "",
    // PayPal: optional direct link (e.g. a PayPal.Me link). Leave "" to let clients
    // request a PayPal invoice through the contact form instead.
    paypal: "",
    linkedin: "https://www.linkedin.com/in/daniel-p-lambert-8b853037"
  },

  // Programme names used by the personal Executive Check
  PROGRAMMES: {
    executive: "Found Fluency Executive · 1:1 Coaching",
    presentation: "Found Fluency Executive · Presentation & Pitch",
    corporate: "Found Fluency · Team Training",
    interview: "Found Fluency Executive · Interview & Career"
  },

  // Rates for the plan calculator (EUR). Session prices are the school's price
  // list; the support and platform fees come from the SpeakUp concept deck.
  PRICING: {
    groupBase: 55,        // group session of 45 min: first person
    groupPerExtra: 7.5,   // each additional person in the group session
    oneToOne: 60,         // 1:1 session of 45 min
    oneToOneExec: 65,     // executive 1:1 session of 45 min
    aiLicence: 30,        // AI coach licence per person per month
    evaluation: 220,      // monthly trainer evaluation (cockpit)
    checkIns: 110,        // check-ins in M1, M3 and M6, spread per month
    kickoff: 440,         // one-time: kick-off & user training (only charged when the AI coach is used)
    setup: 2000,          // one-time: setting up the AI platform for a company
    setupFrom: 5,         // the set-up fee applies from this many AI licences (company plans)
    travel: 0             // per on-site session (in person / hybrid); 0 = by arrangement
  }
};
