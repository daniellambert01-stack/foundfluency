/* Found Fluency AI demo data. Everything is kept in this browser's localStorage and
   never leaves the device; the "Reset demo" button restores the seed data. */
(function () {
  var KEY = "speakup-demo-v1";

  var PERSONAS = {
    markus: { name: "Markus", age: 47, img: "markus.jpg", color: "var(--teal)",
      role: ["Engineer · US-Kunden", "Engineer · US customers"], mix: { live: 30, ai: 70 },
      goal: { scenario: "us-call", de: "US-Call: Preis & Lieferzeit verhandeln", en: "US call: negotiate price & lead time" },
      quote: ["„Übung ohne Publikum.“", "“Practice without an audience.”"] },
    sabine: { name: "Sabine", age: 41, img: "sabine.jpg", color: "var(--yellow)",
      role: ["Controlling", "Controlling"], mix: { live: 50, ai: 50 },
      goal: { scenario: "numbers", de: "Quartalszahlen auf Englisch erklären", en: "Explain quarterly figures in English" },
      quote: ["„Sicherheit bei Zahlen.“", "“Confidence with numbers.”"] },
    leila: { name: "Leila", age: 29, img: "leila.jpg", color: "var(--coral)",
      role: ["Vertrieb", "Sales"], mix: { live: 70, ai: 30 },
      goal: { scenario: "meeting", de: "Kundenmeeting souverän eröffnen", en: "Open a customer meeting confidently" },
      quote: ["„Gesprächspartner.“", "“A conversation partner.”"] },
    klaus: { name: "Klaus", age: 58, img: "klaus.jpg", color: "var(--purple)",
      role: ["CEO · Investoren", "CEO · investors"], mix: { live: 75, ai: 25 },
      goal: { scenario: "investor", de: "Investor-Pitch ohne Notizen", en: "Investor pitch without notes" },
      quote: ["„Einen Menschen – diskret.“", "“A person – discreetly.”"] }
  };

  var SCENARIOS = {
    "us-call": {
      de: "US-Call: Preis & Lieferzeit", en: "US call: price & lead time", minutes: 15,
      partner: "US buyer",
      turns: [
        { say: "Hi, thanks for joining. Let's get straight to it: your lead time of twelve weeks is too long for us.",
          model: "I understand. Twelve weeks is our standard, but we can look at options to bring that down for you." },
        { say: "And to be honest, the unit price is about fifteen percent above our target. How can you help us there?",
          model: "If you can commit to a larger volume, we can review the unit price and offer a better rate." },
        { say: "Okay. What exactly would you need from us to make that work?",
          model: "We can cut lead time to nine weeks if you commit to a minimum order quantity of five thousand units." },
        { say: "That sounds interesting. Can you put that in writing by Friday?",
          model: "Absolutely. I'll send you a written proposal by Friday with the new lead time and pricing." }
      ],
      vocab: ["lead time", "weeks", "unit price", "minimum order", "quantity", "commit", "volume", "discount", "delivery", "proposal", "offer", "in writing"]
    },
    "meeting": {
      de: "Meeting auf Englisch eröffnen", en: "Open a meeting in English", minutes: 10,
      partner: "Customer team",
      turns: [
        { say: "Hi everyone, I think we're all here now. Would you like to kick us off?",
          model: "Thanks, and welcome everyone. Let me start by going through today's agenda." },
        { say: "Great. What are the main goals for today's meeting?",
          model: "Our main objective today is to agree on the timeline, and then we'll look at the budget." },
        { say: "How much time should we spend on each point?",
          model: "Let's take about twenty minutes for the timeline and fifteen minutes for the budget." },
        { say: "Sounds good. Anything else before we start?",
          model: "Just one thing: I'll send a short summary after the meeting. Let's get started." }
      ],
      vocab: ["welcome", "agenda", "objective", "goal", "first", "then", "finally", "minutes", "point", "summary", "timeline", "agree"]
    },
    "numbers": {
      de: "Zahlen erklären (Controlling)", en: "Explain the numbers (controlling)", minutes: 12,
      partner: "Head of finance, US",
      turns: [
        { say: "Could you walk us through the third quarter figures, please?",
          model: "Of course. Revenue increased by six percent compared to the second quarter, to twelve point four million euros." },
        { say: "Why is the margin lower than in the last quarter?",
          model: "The margin decreased by two percentage points, mainly because material costs went up." },
        { say: "What do you expect for the fourth quarter?",
          model: "Our forecast for the fourth quarter is stable revenue and a slight recovery of the margin." },
        { say: "Thanks, that's very clear. Any risks we should be aware of?",
          model: "The main risk is the exchange rate, which could reduce revenue by around one percent." }
      ],
      vocab: ["percent", "increase", "decrease", "margin", "revenue", "costs", "quarter", "compared", "forecast", "million", "risk", "trend"]
    },
    "investor": {
      de: "Investor-Pitch", en: "Investor pitch", minutes: 15,
      partner: "Investor",
      turns: [
        { say: "Tell me in one minute: what does your company do?",
          model: "We build precision components for medical devices, and we deliver faster than anyone in our market." },
        { say: "What makes you different from your competitors?",
          model: "Our competitive advantage is speed: our lead time is thirty percent shorter, with the same quality." },
        { say: "Where do you see the company in three years?",
          model: "In three years we want to double revenue, with half of our customers outside Europe." },
        { say: "And what exactly do you need from investors?",
          model: "We are raising five million euros to expand production and build our sales team in the US." }
      ],
      vocab: ["market", "growth", "customers", "revenue", "competitive", "advantage", "strategy", "invest", "return", "team", "expand", "double"]
    }
  };

  function daysAgo(n) { var d = new Date(); d.setDate(d.getDate() - n); return d.toISOString(); }

  function seed() {
    return {
      current: "markus",
      goals: {
        markus: { date: (function () { var d = new Date(); d.setDate(d.getDate() + 26); return d.toISOString().slice(0, 10); })() }
      },
      sessions: [
        { who: "markus", date: daysAgo(6), scenario: "us-call", minutes: 18, scores: { fluency: 3, vocab: 3, clarity: 4 },
          release: { topic: true, time: true, scores: true, wish: true, oneToOne: true, transcript: false },
          wish: "Einwände zur Lieferzeit / objections on lead time", transcript: [] },
        { who: "markus", date: daysAgo(3), scenario: "us-call", minutes: 20, scores: { fluency: 3, vocab: 4, clarity: 4 },
          release: { topic: true, time: true, scores: false, wish: false, oneToOne: false, transcript: false }, transcript: [] },
        { who: "sabine", date: daysAgo(4), scenario: "numbers", minutes: 15, scores: { fluency: 3, vocab: 4, clarity: 3 },
          release: { topic: true, time: true, scores: true, wish: true, oneToOne: false, transcript: false },
          wish: "Prozente & Vergleiche / percentages & comparisons", transcript: [] },
        { who: "leila", date: daysAgo(2), scenario: "meeting", minutes: 12, scores: { fluency: 5, vocab: 3, clarity: 4 },
          release: { topic: true, time: true, scores: true, wish: true, oneToOne: false, transcript: false },
          wish: "Fachbegriffe Produkt / product terminology", transcript: [] },
        { who: "klaus", date: daysAgo(9), scenario: "investor", minutes: 16, scores: { fluency: 3, vocab: 3, clarity: 3 },
          release: { topic: false, time: true, scores: false, wish: false, oneToOne: true, transcript: false }, transcript: [] }
      ],
      // Anonymous pilot figures for the L&D view (12 participants, demo values)
      pilot: {
        participants: 12,
        hoursPerMonth: [6.1, 7.4, 8.6, 9.2],
        activeShare: [0.42, 0.58, 0.67, 0.75],
        satisfaction: 4.3,
        levels: { M0: { B1: 5, B2: 5, C1: 2 }, M3: { B1: 3, B2: 6, C1: 3 } },
        bigDay: 4.4,
        costPerPerson: 201
      }
    };
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* storage unavailable: fall back to seed data in memory */ }
    return seed();
  }

  var state = load();

  window.NovaApp = {
    PERSONAS: PERSONAS,
    SCENARIOS: SCENARIOS,
    get: function () { return state; },
    save: function () { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* demo still works in memory */ } },
    reset: function () { state = seed(); this.save(); },
    me: function () { return state.current; },
    setMe: function (id) { state.current = id; this.save(); },
    sessionsOf: function (who) { return state.sessions.filter(function (s) { return s.who === who; }); },
    addSession: function (s) { state.sessions.push(s); this.save(); },
    minutesThisMonth: function (who) {
      var now = new Date();
      return this.sessionsOf(who).filter(function (s) {
        var d = new Date(s.date); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }).reduce(function (sum, s) { return sum + s.minutes; }, 0);
    },
    scenarioName: function (id) { var s = SCENARIOS[id]; return s ? window.L(s.de, s.en) : id; }
  };
})();
