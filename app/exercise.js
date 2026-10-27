/* Found Fluency AI exercise: the 4 steps of the AI coach.
   1 set a goal · 2 speak (Web Speech API, typing as fallback) · 3 rule-based
   feedback · 4 the learner chooses what the trainer may see. */
(function () {
  var S = window.NovaApp, L = window.L;
  var params = new URLSearchParams(location.search);
  var scenarioId = S.SCENARIOS[params.get("s")] ? params.get("s") : S.PERSONAS[S.me()].goal.scenario;
  var sc, turn = 0, answers = [], startedAt = 0, result = null;

  var sel = document.getElementById("scenario");
  var chat = document.getElementById("chat");
  var mic = document.getElementById("mic");
  var micStatus = document.getElementById("mic-status");

  // ---------- Step navigation ----------
  function go(step) {
    document.querySelectorAll(".ex-step").forEach(function (el) { el.hidden = Number(el.getAttribute("data-step")) !== step; });
    document.querySelectorAll(".stepper > div").forEach(function (el) {
      var n = Number(el.getAttribute("data-step"));
      el.classList.toggle("active", n === step);
      el.classList.toggle("done", n < step);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function fillScenarios() {
    var lang = window.NOVA_LANG;
    sel.innerHTML = Object.keys(S.SCENARIOS).map(function (k) {
      return '<option value="' + k + '"' + (k === scenarioId ? " selected" : "") + ">" + S.SCENARIOS[k][lang] + "</option>";
    }).join("");
    document.getElementById("title").textContent = S.SCENARIOS[scenarioId][lang];
  }
  sel.addEventListener("change", function () { scenarioId = sel.value; fillScenarios(); });
  document.getElementById("goal").value = S.PERSONAS[S.me()].goal.scenario === scenarioId ? S.PERSONAS[S.me()].goal[window.NOVA_LANG] : "";

  // ---------- Speech output ----------
  var synth = window.speechSynthesis;
  function speak(text) {
    if (!synth) return;
    synth.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US"; u.rate = 0.95;
    var v = synth.getVoices().filter(function (x) { return /^en(-|_)US/i.test(x.lang); })[0];
    if (v) u.voice = v;
    synth.speak(u);
  }

  function bubble(cls, label, text, replay) {
    var b = document.createElement("div");
    b.className = "bubble " + cls;
    var s = document.createElement("small"); s.textContent = label;
    b.appendChild(s);
    b.appendChild(document.createTextNode(text));
    if (replay) {
      var r = document.createElement("button");
      r.className = "replay"; r.type = "button"; r.textContent = "🔊"; r.setAttribute("aria-label", "Replay");
      r.addEventListener("click", function () { speak(text); });
      b.appendChild(r);
    }
    chat.appendChild(b);
    b.scrollIntoView({ behavior: "smooth", block: "nearest" });
    return b;
  }

  function partnerTurn() {
    var t = sc.turns[turn];
    bubble("them", sc.partner, t.say, true);
    speak(t.say);
  }

  document.getElementById("start").addEventListener("click", function () {
    sc = S.SCENARIOS[scenarioId];
    turn = 0; answers = []; chat.innerHTML = ""; startedAt = Date.now();
    go(1);
    setTimeout(partnerTurn, 300);
  });

  // ---------- Speech input ----------
  var Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
  var rec = null, listening = false, finalText = "", confs = [], recStart = 0, interimEl = null;

  if (!Rec) {
    mic.disabled = true;
    micStatus.textContent = L("Spracherkennung ist in diesem Browser nicht verfügbar. Bitte tippen Sie Ihre Antwort (oder nutzen Sie Chrome/Edge).",
      "Speech recognition isn't available in this browser. Please type your answer (or use Chrome/Edge).");
  }

  function startListening() {
    if (synth) synth.cancel();
    rec = new Rec();
    rec.lang = "en-US"; rec.interimResults = true; rec.continuous = true;
    finalText = ""; confs = []; recStart = Date.now();
    interimEl = document.createElement("div"); interimEl.className = "interim"; chat.appendChild(interimEl);
    rec.onresult = function (e) {
      var interim = "";
      for (var i = e.resultIndex; i < e.results.length; i++) {
        var r = e.results[i];
        if (r.isFinal) { finalText += r[0].transcript + " "; if (r[0].confidence) confs.push(r[0].confidence); }
        else interim += r[0].transcript;
      }
      interimEl.textContent = (finalText + interim).trim() || "…";
    };
    rec.onerror = function (e) {
      micStatus.textContent = e.error === "not-allowed"
        ? L("Mikrofon nicht erlaubt. Bitte im Browser freigeben oder tippen.", "Microphone not allowed. Please allow it in your browser, or type.")
        : L("Spracherkennung unterbrochen (" + e.error + "). Bitte erneut versuchen oder tippen.", "Speech recognition stopped (" + e.error + "). Please try again or type.");
    };
    rec.onend = function () {
      listening = false; mic.classList.remove("listening");
      if (interimEl) { interimEl.remove(); interimEl = null; }
      var text = finalText.trim();
      if (text) answer(text, (Date.now() - recStart) / 1000, confs.slice());
    };
    rec.start();
    listening = true; mic.classList.add("listening");
    micStatus.textContent = L("Ich höre zu … Zum Beenden erneut auf das Mikrofon tippen.", "Listening… Tap the microphone again to finish.");
  }

  mic.addEventListener("click", function () {
    if (!Rec) return;
    if (listening) { rec.stop(); micStatus.textContent = ""; } else startListening();
  });

  document.getElementById("typed").addEventListener("submit", function (e) {
    e.preventDefault();
    var input = document.getElementById("typed-input");
    var text = input.value.trim();
    if (!text) return;
    input.value = "";
    answer(text, null, []);
  });

  function answer(text, seconds, conf) {
    bubble("me", S.PERSONAS[S.me()].name, text);
    answers.push({ text: text, seconds: seconds, conf: conf });
    turn++;
    if (turn < sc.turns.length) setTimeout(partnerTurn, 600);
    else setTimeout(function () {
      bubble("them", sc.partner, L("(Ende des Rollenspiels)", "(End of role-play)") + " Thanks, that was great. Talk soon!", false);
      setTimeout(showFeedback, 1200);
    }, 600);
  }

  document.getElementById("hint").addEventListener("click", function () {
    if (!sc || turn >= sc.turns.length) return;
    var m = sc.turns[turn].model;
    bubble("them", L("Beispielantwort", "Sample answer"), m, true).style.background = "rgba(61,214,181,.25)";
    speak(m);
  });
  document.getElementById("finish-early").addEventListener("click", function () {
    if (listening && rec) rec.stop();
    if (answers.length) showFeedback(); else go(0);
  });

  // ---------- Feedback ----------
  function words(t) { return (t.match(/[A-Za-z']+/g) || []).length; }
  function clamp(n) { return Math.max(1, Math.min(5, Math.round(n))); }

  function showFeedback() {
    if (synth) synth.cancel();
    var all = answers.map(function (a) { return a.text; }).join(" ");
    var lower = " " + all.toLowerCase() + " ";
    var total = words(all);
    var voice = answers.filter(function (a) { return a.seconds; });
    var voiceWords = voice.reduce(function (s, a) { return s + words(a.text); }, 0);
    var voiceSecs = voice.reduce(function (s, a) { return s + a.seconds; }, 0);
    var wpm = voiceSecs > 3 ? Math.round(voiceWords / (voiceSecs / 60)) : null;
    var fillers = (all.match(/\b(u+m+|u+h+|e+r+m*|ehm|hmm+|you know|i mean|basically)\b/gi) || []).length;
    var fillerRate = total ? fillers / total * 100 : 0;
    var used = sc.vocab.filter(function (v) { return lower.indexOf(v) !== -1; });
    var allConf = [].concat.apply([], answers.map(function (a) { return a.conf; }));
    var conf = allConf.length ? allConf.reduce(function (s, c) { return s + c; }, 0) / allConf.length : null;
    var perAnswer = total / answers.length;

    var fluency;
    if (wpm) fluency = 3 + (wpm >= 100 && wpm <= 170 ? 1 : wpm < 80 ? -1 : 0) + (fillerRate < 2 ? 1 : fillerRate > 6 ? -1 : 0);
    else fluency = perAnswer >= 15 ? 4 : perAnswer >= 8 ? 3 : 2;
    var vocabScore = clamp(1 + used.length / Math.min(6, sc.vocab.length) * 4);
    var clarity = conf === null ? null : conf >= 0.9 ? 5 : conf >= 0.8 ? 4 : conf >= 0.7 ? 3 : conf >= 0.6 ? 2 : 1;

    result = {
      minutes: Math.max(1, Math.round((Date.now() - startedAt) / 60000)),
      scores: { fluency: clamp(fluency), vocab: vocabScore, clarity: clarity || 3 },
      wpm: wpm, fillers: fillers, used: used, conf: conf, transcript: answers.map(function (a) { return a.text; })
    };

    function row(label, val, color, note) {
      return '<div class="score-row"><b>' + label + '</b><div class="meter" style="--c:' + color + '"><span style="width:' + (val ? val * 20 : 0) + '%"></span></div><b>' +
        (val ? val + "/5" : "—") + "</b></div>" + (note ? '<p class="small" style="margin:-4px 0 8px">' + note + "</p>" : "");
    }
    document.getElementById("scores").innerHTML =
      row(L("Flüssigkeit", "Fluency"), result.scores.fluency, "var(--coral)",
        wpm ? L(wpm + " Wörter/Min. · " + fillers + " Füllwörter", wpm + " words/min · " + fillers + " filler words")
            : L("Getippt: bewertet nach Antwortlänge", "Typed: scored by answer length")) +
      row(L("Fachwörter", "Vocabulary"), result.scores.vocab, "var(--orange)", used.length + " / " + sc.vocab.length) +
      row(L("Verständlichkeit", "Clarity"), clarity, "var(--teal)",
        conf !== null ? L("Erkennungssicherheit " + Math.round(conf * 100) + " %", "Recognition confidence " + Math.round(conf * 100) + " %")
                      : L("Nur bei Spracheingabe", "Voice input only"));

    document.getElementById("vocab").innerHTML = sc.vocab.map(function (v) {
      return '<span class="' + (used.indexOf(v) !== -1 ? "used" : "") + '">' + (used.indexOf(v) !== -1 ? "✓ " : "") + v + "</span>";
    }).join("");

    var tips = [];
    if (wpm && wpm > 170) tips.push(L("Etwas langsamer sprechen und Pausen nach Zahlen machen.", "Slow down a little and pause after numbers."));
    if (wpm && wpm < 90) tips.push(L("Mehr am Stück sprechen: lieber einfache Sätze als lange Pausen.", "Speak in longer stretches: simple sentences beat long pauses."));
    if (fillerRate > 4) tips.push(L("Füllwörter durch eine kurze Pause ersetzen.", "Replace filler words with a short pause."));
    var missing = sc.vocab.filter(function (v) { return used.indexOf(v) === -1; }).slice(0, 3);
    if (missing.length) tips.push(L("Diese Begriffe beim nächsten Mal einbauen: ", "Try to use these terms next time: ") + missing.join(", "));
    if (perAnswer < 8) tips.push(L("Antworten ausbauen: Aussage + Grund + nächster Schritt.", "Build longer answers: statement + reason + next step."));
    if (!tips.length) tips.push(L("Sehr gut! Nächster Schritt: dieselbe Übung mit schwierigeren Einwänden.", "Very good! Next step: the same exercise with tougher objections."));
    document.getElementById("tips").innerHTML = tips.map(function (t) { return "<li>" + t + "</li>"; }).join("");
    go(2);
  }

  // ---------- Release ----------
  document.getElementById("to-release").addEventListener("click", function () {
    document.getElementById("r-topic-v").textContent = "· " + S.scenarioName(scenarioId);
    document.getElementById("r-time-v").textContent = "· " + result.minutes + " " + L("Min.", "min");
    go(3);
  });

  document.getElementById("save").addEventListener("click", function () {
    var r = function (id) { return document.getElementById("r-" + id).checked; };
    var wish = document.getElementById("wish").value.trim();
    S.addSession({
      who: S.me(), date: new Date().toISOString(), scenario: scenarioId, minutes: result.minutes, scores: result.scores,
      release: { topic: r("topic"), time: r("time"), scores: r("scores"), wish: !!wish, oneToOne: r("oneToOne"), transcript: r("transcript") },
      wish: wish, transcript: result.transcript
    });
    location.href = "learner.html";
  });

  document.addEventListener("langchange", fillScenarios);
  fillScenarios();
  go(0);
})();
