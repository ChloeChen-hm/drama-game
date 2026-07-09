const moods = [
  { id: "happy", label: "Happy", avatar: { name: "Sunlit Double", note: "It carries bright energy and helps turn joy into expression.", shape: "sun", color: "#ffd84d", mouth: "smile" } },
  { id: "calm", label: "Calm", avatar: { name: "Blue Lake Double", note: "It breathes slowly and helps bring your attention back.", shape: "cloud", color: "#6fa8ff", mouth: "soft" } },
  { id: "anxious", label: "Anxious", avatar: { name: "Violet Fog Double", note: "It protects your boundaries. You only need to try a little.", shape: "shield", color: "#a88cff", mouth: "line" } },
  { id: "angry", label: "Angry", avatar: { name: "Red Flame Double", note: "It allows strength to exist and helps it find an outlet.", shape: "spark", color: "#ff5a5f", mouth: "line" } },
  { id: "tired", label: "Tired", avatar: { name: "Gray Moon Double", note: "It lets you move slowly and allows half-finished work to count.", shape: "moon", color: "#a7aab3", mouth: "soft" } },
  { id: "excited", label: "Excited", avatar: { name: "Orange Fire Double", note: "It turns awkwardness into material and impulse into performance.", shape: "spark", color: "#ff9f43", mouth: "smile" } },
  { id: "confused", label: "Unsure", avatar: { name: "Green Mist Double", note: "It does not rush for answers. It stays with you in the unknown.", shape: "cloud", color: "#35c9b5", mouth: "soft" } },
  { id: "sad", label: "Sad", avatar: { name: "Deep Sea Double", note: "It catches heaviness so sadness can be quietly seen.", shape: "moon", color: "#1f4f99", mouth: "soft" } }
];

const games = [
  { id: "story-sculpture", title: "Story Sculpture", archiveShapeLabel: "Sculpture shape", purpose: "Freeze a key image from a story using your body.", action: "New story", promptLabel: "Story", prompts: ["Yesterday I was late.", "I found a letter in the rain.", "During the blackout, only one beam of light remained.", "A friend suddenly said, 'I know the truth.'", "I opened the door and everyone was waiting."], steps: ["Read the story out loud.", "Choose the moment with the most tension.", "Freeze your body for 10 seconds without explaining it. Let others guess what happened."] },
  { id: "empty-chair", title: "Empty Chair", archiveShapeLabel: "Chair outline", purpose: "Turn a chair into a person, feeling, or inner voice.", action: "New prompt", promptLabel: "Direction", prompts: ["Say one sentence you have never said out loud.", "Ask a question whose answer scares you.", "Let it speak your objection for you.", "Debate with it: what do I actually want?", "Thank it for one way it once protected you."], steps: ["Name the chair first.", "Choose what or who it represents.", "Speak to it for 60 seconds. Switch seats if it needs to answer."] },
  { id: "analogy", title: "Analogy Game", archiveShapeLabel: "Connected nodes", purpose: "Force the mind to link unrelated things.", action: "New pair", promptLabel: "Find what they share", prompts: ["Phone + Book", "Umbrella + Secret", "Elevator + Friendship", "Alarm Clock + Ocean Waves", "Map + Bread", "Mirror + Meeting"], steps: ["Read the two words.", "Quickly write 3 shared qualities.", "Choose one shared quality and turn it into a character line."] },
  { id: "paradox", title: "5-Minute Paradox", archiveShapeLabel: "Triangle", purpose: "Practice understanding both sides of a common belief.", action: "New belief", promptLabel: "Common belief", prompts: ["Hard work always leads to success.", "Early risers are more productive.", "Honesty is always the best choice.", "Friends should have no secrets.", "Being emotional is immature.", "The busier someone is, the more important they are."], hasTimer: true, seconds: 300, timerButton: "Start 5 minutes", steps: ["List supporting evidence for 1 minute.", "Argue against it for 2 minutes.", "Use the final 2 minutes to make a more accurate and kinder version."] },
  { id: "if-i-were", title: "If I Were", archiveShapeLabel: "Leaf shape", purpose: "Enter a character from a non-human or unusual point of view.", action: "Draw card", promptLabel: "Role card", prompts: ["If I were a tree", "If I were a bird", "If I were a streetlight with low battery", "If I were a door everyone ignores", "If I were a cup of cooling water", "If I were an old ticket"], steps: ["Find its body center first.", "Use 3 movements to show how it sees the world.", "Say one sentence only it would say."] },
  { id: "emotion-exchange", title: "Emotion Exchange", archiveShapeLabel: "Flowing drop", purpose: "Blend two emotions into a new physical state.", action: "Draw emotions", promptLabel: "Emotion blend", prompts: ["Jealousy + Ecstasy", "Shame + Pride", "Fear + Curiosity", "Anger + Tenderness", "Loss + Excitement", "Boredom + Anticipation"], hasTimer: true, seconds: 30, timerButton: "Start 30 seconds", steps: ["Let the first emotion fill 70% of your body.", "Slowly add the second emotion.", "Blend them without words for 30 seconds."] },
  { id: "fake-expert", title: "Fake Expert", archiveShapeLabel: "Soft star", purpose: "Practice accepting a premise, inventing quickly, and staying confident.", action: "New identity", promptLabel: "Expert identity", prompts: ["Garden designer on the moon", "Dream traffic planner", "Therapist for shadows", "Underwater library curator", "Lost-and-found philosopher", "Time wrinkle repair specialist"], steps: ["Draw a wildly specific expert identity.", "Answer questions in a professional tone.", "The more specific and absurd the answer, the more believable it becomes."] }
];

const expertQuestionBank = [
  "What is the most common mistake in this field?",
  "What tool should a beginner prepare on day one?",
  "What was your hardest case?",
  "Is there a secret only insiders understand?",
  "What would you do with a budget of only $10?",
  "Predict the future of this field in one sentence."
];

const chairOptions = [
  "A hurt I have not said out loud",
  "Someone who makes me nervous",
  "Today's fatigue",
  "The voice that keeps criticizing me",
  "Someone I want to approach but fear approaching",
  "My hesitation",
  "My younger self",
  "Someone I have always wanted to thank",
  "An emotion that needs comfort",
  "An expectation I am afraid to admit"
];

const state = {
  route: "mood",
  selectedMoodId: "happy",
  activeGameId: "story-sculpture",
  currentPrompt: "",
  timer: null,
  remainingSeconds: 0,
  selectedDate: todayKey(),
  archiveMonth: new Date(),
  answers: {},
  drawing: null
};

const app = document.querySelector("#app");

function storageGet(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function storageSet(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function mediaDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("theaterGamesMedia", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("media");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveMediaBlob(blob) {
  const db = await mediaDb();
  const key = `media-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  await new Promise((resolve, reject) => {
    const tx = db.transaction("media", "readwrite");
    tx.objectStore("media").put(blob, key);
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
  db.close();
  return key;
}

async function getMediaBlob(key) {
  if (!key) return null;
  const db = await mediaDb();
  const blob = await new Promise((resolve, reject) => {
    const request = db.transaction("media", "readonly").objectStore("media").get(key);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
  db.close();
  return blob;
}

function todayKey() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

function findMood(id) {
  return moods.find((mood) => mood.id === id) || moods[0];
}

function findGame(id) {
  return games.find((game) => game.id === id) || games[0];
}

function dailyMoodMap() {
  return storageGet("webDailyMoodMap", {});
}

function records() {
  return storageGet("webEmotionArchiveRecords", []);
}

function setDailyMood(id, date = todayKey()) {
  const map = dailyMoodMap();
  if (!map[date]) {
    map[date] = id;
    storageSet("webDailyMoodMap", map);
  }
  return findMood(map[date]);
}

function saveRecord(record) {
  const next = {
    id: `${Date.now()}-${Math.floor(Math.random() * 100000)}`,
    practiceDate: todayKey(),
    createdAt: new Date().toISOString(),
    ...record
  };
  storageSet("webEmotionArchiveRecords", [next, ...records()]);
  return next;
}

function randomFrom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
}

function avatarHtml(mood, size = "") {
  const avatar = mood.avatar;
  return `
    <div class="avatar ${size} ${avatar.shape}" style="background:${avatar.color}">
      <div class="avatar-face">
        <span class="eye left"></span>
        <span class="eye right"></span>
        <span class="mouth ${avatar.mouth}"></span>
      </div>
    </div>
  `;
}

function setRoute(route, options = {}) {
  state.route = route;
  if (options.gameId) state.activeGameId = options.gameId;
  if (options.date) state.selectedDate = options.date;
  render();
}

function render() {
  clearInterval(state.timer);
  state.timer = null;
  document.querySelectorAll(".nav-tabs button").forEach((button) => {
    button.classList.toggle("active", button.dataset.route === state.route);
  });
  const routes = {
    mood: renderMood,
    games: renderGames,
    play: renderPlay,
    draw: renderDraw,
    archive: renderArchive
  };
  routes[state.route]();
}

function renderMood() {
  const savedMood = dailyMoodMap()[todayKey()];
  const mood = findMood(savedMood || state.selectedMoodId);
  app.innerHTML = `
    <section class="layout">
      <div class="hero-copy">
        <span class="eyebrow">Opening Warm-Up</span>
        <h1>Start by stepping into a safe character.</h1>
        <p class="subtitle">Choose how you feel right now. The web app creates a “double” to accompany you into the theater games.</p>
        <div class="mood-grid">
          ${moods.map((item) => `<button class="mood-chip ${mood.id === item.id ? "active" : ""}" data-mood="${item.id}">${item.label}</button>`).join("")}
        </div>
        <div class="actions">
          <button class="primary" data-action="continue">Continue With This Double</button>
          <button class="plain" data-route="archive">Emotion Archive</button>
        </div>
      </div>
      <aside class="panel avatar-stage">
        ${avatarHtml(mood)}
        <h2 class="avatar-name">${mood.avatar.name}</h2>
        <p class="avatar-note">${mood.avatar.note}</p>
        ${savedMood ? `<span class="locked-note">Today's mood double is locked. You can choose again tomorrow.</span>` : `<span class="locked-note">Choose once to lock today's entry mood.</span>`}
      </aside>
    </section>
  `;
  app.querySelectorAll("[data-mood]").forEach((button) => {
    button.addEventListener("click", () => {
      if (dailyMoodMap()[todayKey()]) return toast("Today's mood is already locked.");
      state.selectedMoodId = button.dataset.mood;
      setDailyMood(button.dataset.mood);
      renderMood();
    });
  });
  app.querySelector("[data-action='continue']").addEventListener("click", () => {
    const moodForToday = setDailyMood(mood.id);
    state.selectedMoodId = moodForToday.id;
    setRoute("games");
  });
}

function renderGames() {
  const mood = findMood(dailyMoodMap()[todayKey()] || state.selectedMoodId);
  app.innerHTML = `
    <section class="top-card panel">
      ${avatarHtml(mood, "small")}
      <div class="top-card-copy">
        <span class="eyebrow">Your Double</span>
        <h2>${mood.avatar.name}</h2>
        <p class="help-text">${mood.avatar.note}</p>
      </div>
      <span class="pill">Locked Today</span>
    </section>
    <section>
      <div class="section-head">
        <div>
          <h1>Choose a game.</h1>
          <p class="subtitle">Enter one practice at a time so your attention has somewhere clear to land.</p>
        </div>
        <button class="primary" data-action="random-game">Random Game</button>
      </div>
      <div class="game-list">
        ${games.map((game) => `
          <button class="game-card" data-game="${game.id}">
            <span>
              <h3>${game.title}</h3>
              <p>${game.purpose}</p>
            </span>
            <span class="game-action">Enter</span>
          </button>
        `).join("")}
      </div>
      <div class="actions">
        <button class="plain" data-route="draw">End Today and Draw Your Current Mood</button>
      </div>
    </section>
  `;
  app.querySelector("[data-action='random-game']").addEventListener("click", () => startGame(randomFrom(games).id));
  app.querySelectorAll("[data-game]").forEach((button) => button.addEventListener("click", () => startGame(button.dataset.game)));
}

function startGame(id) {
  const game = findGame(id);
  state.activeGameId = game.id;
  state.currentPrompt = randomFrom(game.prompts);
  state.remainingSeconds = game.seconds || 0;
  state.answers = {
    chair: randomFrom(chairOptions),
    commonPoints: ["", "", ""],
    support: "",
    against: "",
    questions: game.id === "fake-expert" ? [randomFrom(expertQuestionBank)] : [],
    feeling: "",
    newEmotionName: ""
  };
  setRoute("play");
}

function renderPlay() {
  const mood = findMood(dailyMoodMap()[todayKey()] || state.selectedMoodId);
  const game = findGame(state.activeGameId);
  if (!state.currentPrompt) state.currentPrompt = randomFrom(game.prompts);
  app.innerHTML = `
    <section class="top-card panel">
      ${avatarHtml(mood, "small")}
      <p class="help-text"><strong>${mood.avatar.name}</strong> is practicing with you.</p>
    </section>
    <section class="play-card panel">
      <div class="play-head">
        <div>
          <h1>${game.title}</h1>
          <p class="subtitle">${game.purpose}</p>
        </div>
        <button class="primary" data-action="new-prompt">${game.action}</button>
      </div>
      <div class="steps">
        <span class="answer-title">How To Play</span>
        ${game.steps.map((step) => `<div class="step">${step}</div>`).join("")}
      </div>
      <div class="prompt-box">
        <span class="prompt-label">${game.promptLabel}</span>
        <div class="prompt-text">${escapeHtml(state.currentPrompt)}</div>
      </div>
      ${gameControlsHtml(game)}
      <div class="record-panel">
        <div>
          <h3>Save to Emotion Archive</h3>
          <p class="record-note">${recordNote(game)}</p>
        </div>
        <div class="row-actions record-actions">
          ${mediaTypeForGame(game.id) ? `<button class="primary" data-action="capture-media">${mediaActionLabel(game.id)}</button>` : ""}
          <button class="${mediaTypeForGame(game.id) ? "secondary" : "primary"}" data-action="save-record">Save Notes</button>
        </div>
      </div>
      <button class="plain" data-route="draw">End Today and Draw Your Current Mood</button>
    </section>
  `;
  bindPlay(game, mood);
}

function gameControlsHtml(game) {
  if (game.id === "empty-chair") {
    return `
      <div class="chair-builder">
        <div class="chair-preview"><div class="chair-shape"></div></div>
        <label class="field-group">
          <span class="field-label">This chair represents</span>
          <input class="input" data-answer="chair" value="${escapeHtml(state.answers.chair || "")}" placeholder="A person, emotion, or another part of yourself" />
        </label>
      </div>
    `;
  }
  if (game.hasTimer) {
    return `
      <div class="timer-panel">
        <div>
          <div class="timer-number" id="timer-text">${formatTime(state.remainingSeconds)}</div>
          <p class="help-text" id="timer-caption">Start when you are ready.</p>
        </div>
        <div class="row-actions">
          <button class="secondary" data-action="start-timer">${game.timerButton}</button>
          <button class="plain" data-action="reset-timer">Reset</button>
        </div>
      </div>
      ${game.id === "paradox" ? `
        <div class="answer-area">
          <span class="answer-title">Support, Then Challenge</span>
          <textarea class="textarea" data-answer="support" placeholder="1 minute: why might it be true?">${escapeHtml(state.answers.support || "")}</textarea>
          <textarea class="textarea" data-answer="against" placeholder="2 minutes: where does it fall apart?">${escapeHtml(state.answers.against || "")}</textarea>
        </div>` : ""}
      ${game.id === "emotion-exchange" ? `
        <div class="answer-area">
          <span class="answer-title">Name the blended emotion</span>
          <input class="input" data-answer="newEmotionName" value="${escapeHtml(state.answers.newEmotionName || "")}" placeholder="Example: glowing hesitation" />
        </div>` : ""}
    `;
  }
  if (game.id === "analogy") {
    return `
      <div class="answer-area">
        <span class="answer-title">Write 3 shared qualities</span>
        ${[0, 1, 2].map((index) => `<input class="input" data-common="${index}" value="${escapeHtml(state.answers.commonPoints[index] || "")}" placeholder="Shared quality ${index + 1}" />`).join("")}
      </div>
    `;
  }
  if (game.id === "fake-expert") {
    return `
      <div class="answer-area">
        <span class="answer-title">Audience Questions</span>
        <div id="questions">${state.answers.questions.map((q) => `<div class="question-bubble">${q}</div>`).join("")}</div>
        <button class="secondary" data-action="ask-question">Ask Another Question</button>
      </div>
    `;
  }
  if (game.id === "if-i-were") {
    return `
      <div class="answer-area">
        <span class="answer-title">After performing, what changed?</span>
        <textarea class="textarea" data-answer="feeling" placeholder="What did this role reveal? What changed in your body?">${escapeHtml(state.answers.feeling || "")}</textarea>
      </div>
    `;
  }
  return "";
}

function bindPlay(game, mood) {
  app.querySelector("[data-action='new-prompt']").addEventListener("click", () => {
    state.currentPrompt = randomFrom(game.prompts);
    if (game.id === "fake-expert") state.answers.questions = [randomFrom(expertQuestionBank)];
    if (game.id === "empty-chair") state.answers.chair = randomFrom(chairOptions);
    state.remainingSeconds = game.seconds || 0;
    renderPlay();
  });
  app.querySelectorAll("[data-answer]").forEach((field) => field.addEventListener("input", () => {
    state.answers[field.dataset.answer] = field.value;
  }));
  app.querySelectorAll("[data-common]").forEach((field) => field.addEventListener("input", () => {
    state.answers.commonPoints[Number(field.dataset.common)] = field.value;
  }));
  const ask = app.querySelector("[data-action='ask-question']");
  if (ask) ask.addEventListener("click", () => {
    state.answers.questions = [...state.answers.questions, randomFrom(expertQuestionBank)].slice(-4);
    renderPlay();
  });
  const startTimerButton = app.querySelector("[data-action='start-timer']");
  if (startTimerButton) startTimerButton.addEventListener("click", startTimer);
  const resetTimerButton = app.querySelector("[data-action='reset-timer']");
  if (resetTimerButton) resetTimerButton.addEventListener("click", () => {
    state.remainingSeconds = game.seconds || 0;
    renderPlay();
  });
  const captureButton = app.querySelector("[data-action='capture-media']");
  if (captureButton) captureButton.addEventListener("click", () => capturePracticeMedia(game, mood));
  app.querySelector("[data-action='save-record']").addEventListener("click", () => {
    saveRecord({
      moodId: mood.id,
      moodLabel: mood.label,
      moodColor: mood.avatar.color,
      gameId: game.id,
      gameTitle: game.title,
      prompt: state.currentPrompt,
      mediaType: "web-note",
      answers: cleanAnswers(game.id)
    });
    toast("Saved to the emotion archive.");
  });
}

function mediaTypeForGame(gameId) {
  if (gameId === "story-sculpture") return "photo";
  if (gameId === "if-i-were" || gameId === "emotion-exchange") return "video";
  if (gameId === "empty-chair" || gameId === "paradox" || gameId === "fake-expert") return "audio";
  return "";
}

function mediaActionLabel(gameId) {
  const type = mediaTypeForGame(gameId);
  if (type === "photo") return "Take Photo";
  if (type === "video") return "Record Video";
  if (type === "audio") return "Record Audio";
  return "Capture";
}

function mediaCopy(gameId) {
  const copy = {
    "story-sculpture": {
      title: "Capture Your Story Sculpture",
      hint: "Allow camera access, freeze your body, then take a photo."
    },
    "if-i-were": {
      title: "Record Your Role Performance",
      hint: "Allow camera and microphone access, then record up to 60 seconds."
    },
    "emotion-exchange": {
      title: "Record the Emotion Blend",
      hint: "Allow camera and microphone access, then record up to 60 seconds."
    },
    "empty-chair": {
      title: "Record the Empty Chair Dialogue",
      hint: "Allow microphone access, speak to the chair, then save the recording."
    },
    paradox: {
      title: "Record Your Paradox Thinking",
      hint: "Allow microphone access and speak through support, challenge, and revision."
    },
    "fake-expert": {
      title: "Record Your Expert Answer",
      hint: "Allow microphone access and answer in your most confident expert voice."
    }
  };
  return copy[gameId] || { title: "Capture Practice", hint: "Record this practice and save it to the archive." };
}

async function capturePracticeMedia(game, mood) {
  const type = mediaTypeForGame(game.id);
  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder && type !== "photo") {
    toast("Camera and microphone access requires a modern browser over HTTPS or localhost.");
    return;
  }
  const copy = mediaCopy(game.id);
  const modal = document.createElement("div");
  modal.className = "capture-layer";
  modal.innerHTML = `
    <section class="capture-card" role="dialog" aria-modal="true" aria-label="${copy.title}">
      <div class="capture-head">
        <div>
          <h2>${copy.title}</h2>
          <p class="help-text" data-status>${copy.hint}</p>
        </div>
        <button class="plain" data-capture="close">Close</button>
      </div>
      <div class="capture-stage">
        ${type === "audio" ? `<div class="audio-orb"><div class="audio-core"></div><strong data-audio-state>Ready to record</strong></div>` : `<video class="live-preview" autoplay muted playsinline></video>`}
        <div class="preview-slot"></div>
      </div>
      <div class="capture-actions">
        ${type === "photo" ? `<button class="primary" data-capture="photo">Take Photo</button>` : `<button class="primary" data-capture="start">Start Recording</button><button class="secondary" data-capture="stop" disabled>Stop</button>`}
        <button class="plain" data-capture="retake" disabled>Retake</button>
        <button class="primary" data-capture="save" disabled>Save to Archive</button>
      </div>
    </section>
  `;
  document.body.appendChild(modal);

  let stream = null;
  let recorder = null;
  let chunks = [];
  let capturedBlob = null;
  let capturedUrl = "";
  let startedAt = 0;
  let duration = 0;
  const status = modal.querySelector("[data-status]");
  const previewSlot = modal.querySelector(".preview-slot");
  const liveVideo = modal.querySelector(".live-preview");
  const startButton = modal.querySelector("[data-capture='start']");
  const stopButton = modal.querySelector("[data-capture='stop']");
  const retakeButton = modal.querySelector("[data-capture='retake']");
  const saveButton = modal.querySelector("[data-capture='save']");
  const audioState = modal.querySelector("[data-audio-state]");

  const close = () => {
    if (recorder?.state === "recording") recorder.stop();
    if (capturedUrl) URL.revokeObjectURL(capturedUrl);
    stream?.getTracks().forEach((track) => track.stop());
    modal.remove();
  };

  const showPreview = (blob) => {
    if (capturedUrl) URL.revokeObjectURL(capturedUrl);
    capturedUrl = URL.createObjectURL(blob);
    if (type === "photo") {
      previewSlot.innerHTML = `<img class="media-preview" alt="Captured practice photo" src="${capturedUrl}" />`;
    } else if (type === "video") {
      previewSlot.innerHTML = `<video class="media-preview" src="${capturedUrl}" controls></video>`;
    } else {
      previewSlot.innerHTML = `<audio class="audio-preview" src="${capturedUrl}" controls></audio>`;
    }
    retakeButton.disabled = false;
    saveButton.disabled = false;
  };

  const startStream = async () => {
    stream?.getTracks().forEach((track) => track.stop());
    const constraints = type === "audio" ? { audio: true } : { video: { facingMode: "user" }, audio: type === "video" };
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    if (liveVideo) liveVideo.srcObject = stream;
  };

  try {
    await startStream();
  } catch (error) {
    status.textContent = "Permission was blocked or no camera/microphone was found.";
    toast("Permission was blocked or no device was found.");
    return;
  }

  modal.querySelector("[data-capture='close']").addEventListener("click", close);
  retakeButton.addEventListener("click", async () => {
    capturedBlob = null;
    previewSlot.innerHTML = "";
    retakeButton.disabled = true;
    saveButton.disabled = true;
    status.textContent = copy.hint;
    if (audioState) audioState.textContent = "Ready to record";
    await startStream();
  });

  if (type === "photo") {
    modal.querySelector("[data-capture='photo']").addEventListener("click", async () => {
      const canvas = document.createElement("canvas");
      canvas.width = liveVideo.videoWidth || 1280;
      canvas.height = liveVideo.videoHeight || 720;
      canvas.getContext("2d").drawImage(liveVideo, 0, 0, canvas.width, canvas.height);
      capturedBlob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.9));
      stream.getTracks().forEach((track) => track.stop());
      status.textContent = "Photo captured. Save it or retake.";
      showPreview(capturedBlob);
    });
  } else {
    startButton.addEventListener("click", () => {
      chunks = [];
      capturedBlob = null;
      duration = 0;
      const preferredMime = type === "video" && MediaRecorder.isTypeSupported("video/webm") ? "video/webm" : "";
      recorder = new MediaRecorder(stream, preferredMime ? { mimeType: preferredMime } : undefined);
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };
      recorder.onstop = () => {
        duration = Math.round((Date.now() - startedAt) / 1000);
        capturedBlob = new Blob(chunks, { type: recorder.mimeType || (type === "audio" ? "audio/webm" : "video/webm") });
        stream.getTracks().forEach((track) => track.stop());
        status.textContent = "Recording captured. Save it or retake.";
        if (audioState) audioState.textContent = `${duration} seconds recorded`;
        showPreview(capturedBlob);
        startButton.disabled = false;
        stopButton.disabled = true;
      };
      startedAt = Date.now();
      recorder.start();
      status.textContent = "Recording now.";
      if (audioState) audioState.textContent = "Recording...";
      startButton.disabled = true;
      stopButton.disabled = false;
      setTimeout(() => {
        if (recorder?.state === "recording") recorder.stop();
      }, 60000);
    });
    stopButton.addEventListener("click", () => {
      if (recorder?.state === "recording") recorder.stop();
    });
  }

  saveButton.addEventListener("click", async () => {
    if (!capturedBlob) return;
    saveButton.disabled = true;
    status.textContent = "Saving media to this browser...";
    const mediaKey = await saveMediaBlob(capturedBlob);
    saveRecord({
      moodId: mood.id,
      moodLabel: mood.label,
      moodColor: mood.avatar.color,
      gameId: game.id,
      gameTitle: game.title,
      prompt: state.currentPrompt,
      mediaType: type,
      mediaKey,
      mediaMime: capturedBlob.type,
      mediaDuration: duration,
      answers: cleanAnswers(game.id)
    });
    toast("Media saved to the emotion archive.");
    close();
  });
}

function startTimer() {
  const text = app.querySelector("#timer-text");
  const caption = app.querySelector("#timer-caption");
  if (!text || state.timer) return;
  caption.textContent = "Practice in progress.";
  if (state.remainingSeconds <= 0) state.remainingSeconds = findGame(state.activeGameId).seconds || 0;
  state.timer = setInterval(() => {
    state.remainingSeconds -= 1;
    text.textContent = formatTime(state.remainingSeconds);
    if (state.remainingSeconds <= 0) {
      clearInterval(state.timer);
      state.timer = null;
      caption.textContent = "Time is up.";
      toast("Time is up.");
    }
  }, 1000);
}

function cleanAnswers(gameId) {
  if (gameId === "analogy") return { commonPoints: state.answers.commonPoints };
  if (gameId === "paradox") return { support: state.answers.support, against: state.answers.against };
  if (gameId === "empty-chair") return { represents: state.answers.chair };
  if (gameId === "fake-expert") return { questions: state.answers.questions };
  if (gameId === "if-i-were") return { feeling: state.answers.feeling };
  if (gameId === "emotion-exchange") return { newEmotionName: state.answers.newEmotionName };
  return {};
}

function recordNote(game) {
  const notes = {
    "story-sculpture": "Take a photo of today's body sculpture, or save only the prompt and notes.",
    "if-i-were": "Record a short video of the role performance, or save only the reflection.",
    "emotion-exchange": "Record a short video of the blended emotion, or save only the name and prompt.",
    "empty-chair": "Record the dialogue, or save only what the chair represented.",
    paradox: "Record your spoken thinking, or save only your support and challenge notes.",
    "fake-expert": "Record your expert answer, or save only the identity and audience questions."
  };
  return notes[game.id] || "Save today's prompt, answers, and reflection.";
}

function formatTime(seconds) {
  const value = Math.max(0, seconds || 0);
  return `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
}

function renderDraw() {
  const mood = findMood(dailyMoodMap()[todayKey()] || state.selectedMoodId);
  app.innerHTML = `
    <section class="layout">
      <div class="hero-copy">
        <span class="eyebrow">Before You Leave</span>
        <h1>Draw your current mood.</h1>
        <p class="subtitle">It does not need to be good. Leave a trace of this moment and store it with today's entry mood.</p>
        <div class="mood-card">
          <span class="mood-dot" style="background:${mood.avatar.color}"></span>
          <div>
            <span class="prompt-label">Mood at entry</span>
            <h3>${mood.label} · ${mood.avatar.name}</h3>
          </div>
        </div>
      </div>
      <section class="drawing-card">
        <div class="canvas-wrap"><canvas id="mood-canvas"></canvas></div>
        <div class="tool-row">
          <button class="color-button" data-color="${mood.avatar.color}" style="background:${mood.avatar.color}" aria-label="Mood color"></button>
          <button class="color-button" data-color="#202231" style="background:#202231" aria-label="Ink color"></button>
          <button class="color-button" data-color="#f58eb5" style="background:#f58eb5" aria-label="Pink color"></button>
          <button class="plain" data-action="clear-canvas">Clear</button>
        </div>
        <div class="actions">
          <button class="primary" data-action="save-drawing">Save Drawing to Archive</button>
          <button class="plain" data-route="archive">View Emotion Archive</button>
        </div>
      </section>
    </section>
  `;
  setupCanvas(mood);
}

function setupCanvas(mood) {
  const canvas = app.querySelector("#mood-canvas");
  const ctx = canvas.getContext("2d");
  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const image = canvas.width ? ctx.getImageData(0, 0, canvas.width, canvas.height) : null;
    canvas.width = Math.floor(rect.width * window.devicePixelRatio);
    canvas.height = Math.floor(rect.height * window.devicePixelRatio);
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, rect.width, rect.height);
    if (image) ctx.putImageData(image, 0, 0);
  };
  resize();
  let drawing = false;
  let color = mood.avatar.color;
  let last = null;
  const point = (event) => {
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };
  canvas.addEventListener("pointerdown", (event) => {
    drawing = true;
    last = point(event);
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener("pointermove", (event) => {
    if (!drawing || !last) return;
    const next = point(event);
    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(next.x, next.y);
    ctx.stroke();
    last = next;
  });
  canvas.addEventListener("pointerup", () => {
    drawing = false;
    last = null;
  });
  app.querySelectorAll("[data-color]").forEach((button) => button.addEventListener("click", () => {
    color = button.dataset.color;
  }));
  app.querySelector("[data-action='clear-canvas']").addEventListener("click", () => {
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, rect.width, rect.height);
  });
  app.querySelector("[data-action='save-drawing']").addEventListener("click", () => {
    saveRecord({
      recordType: "exit-drawing",
      moodId: mood.id,
      moodLabel: mood.label,
      moodColor: mood.avatar.color,
      gameId: "exit-drawing",
      gameTitle: "Exit Mood Drawing",
      prompt: "Current mood after playing",
      mediaType: "drawing",
      mediaPath: canvas.toDataURL("image/png"),
      answers: {}
    });
    toast("Drawing saved to the emotion archive.");
  });
}

function renderArchive() {
  const year = state.archiveMonth.getFullYear();
  const month = state.archiveMonth.getMonth();
  const monthRecords = records();
  const moodMap = dailyMoodMap();
  const selectedRecords = monthRecords.filter((record) => record.practiceDate === state.selectedDate);
  const selectedMood = moodMap[state.selectedDate] ? findMood(moodMap[state.selectedDate]) : null;
  app.innerHTML = `
    <section class="hero-copy">
      <span class="eyebrow">Emotion Archive</span>
      <h1>Archive</h1>
      <p class="subtitle">Not a completion checklist, but a map of feelings that grows day by day.</p>
    </section>
    <section class="calendar-shell">
      <div class="month-card">
        <div class="month-head">
          <button class="icon-button" data-action="prev-month" aria-label="Previous month">‹</button>
          <div class="month-label">${new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(state.archiveMonth)}</div>
          <button class="icon-button" data-action="next-month" aria-label="Next month">›</button>
        </div>
        <div class="week-row">${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => `<span>${day}</span>`).join("")}</div>
        <div class="calendar-grid">${calendarDays(year, month, monthRecords, moodMap).join("")}</div>
      </div>
      <aside class="day-detail">
        <span class="eyebrow">Archive Detail</span>
        <h2>${state.selectedDate}</h2>
        <p class="help-text">Entry mood, saved game records, and exit drawings for this day.</p>
        ${selectedMood ? `<div class="daily-mood-card"><span class="mood-dot" style="background:${selectedMood.avatar.color}"></span><div><span class="prompt-label">Mood at entry</span><h3>${selectedMood.label} · ${selectedMood.avatar.name}</h3></div></div>` : ""}
        <div class="record-list">${selectedRecords.length ? selectedRecords.map(recordHtml).join("") : `<div class="empty-card"><h3>No saved records yet.</h3><p class="help-text">Complete and save a practice to see it here.</p></div>`}</div>
      </aside>
    </section>
    <section class="archive-note">
      <h3>How to read the map</h3>
      <p class="help-text">Each marked day uses the color of the mood you chose when entering the theater. Select a date to view its practice records and drawings.</p>
    </section>
  `;
  app.querySelector("[data-action='prev-month']").addEventListener("click", () => {
    state.archiveMonth = new Date(year, month - 1, 1);
    renderArchive();
  });
  app.querySelector("[data-action='next-month']").addEventListener("click", () => {
    state.archiveMonth = new Date(year, month + 1, 1);
    renderArchive();
  });
  app.querySelectorAll("[data-date]").forEach((button) => button.addEventListener("click", () => {
    state.selectedDate = button.dataset.date;
    renderArchive();
  }));
  hydrateMediaRecords();
}

function calendarDays(year, month, allRecords, moodMap) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: firstDay }, () => "<span></span>");
  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dateRecords = allRecords.filter((record) => record.practiceDate === date);
    const mood = moodMap[date] ? findMood(moodMap[date]) : null;
    const color = mood?.avatar.color || dateRecords[0]?.moodColor || "";
    const hasRecord = dateRecords.length > 0 || !!mood;
    cells.push(`
      <button class="day-button ${hasRecord ? "has-record" : ""}" data-date="${date}" style="${color ? `border-color:${color}` : ""}">
        <span class="day-number">${day}</span>
        ${color ? `<span class="mood-dot" style="background:${color}"></span>` : ""}
        ${dateRecords.length > 1 ? `<span class="count-dot">${dateRecords.length}</span>` : ""}
      </button>
    `);
  }
  return cells;
}

function recordHtml(record) {
  const answers = answerLines(record.answers || {});
  return `
    <article class="record-card">
      <div class="record-head">
        <span class="record-color" style="background:${record.moodColor}"></span>
        <div>
          <h3>${escapeHtml(record.gameTitle)}</h3>
          <p class="meta">Mood: ${escapeHtml(record.moodLabel)}</p>
        </div>
      </div>
      <div class="answer-card">
        <span class="answer-title">Prompt</span>
        <span class="answer-line">${escapeHtml(record.prompt)}</span>
      </div>
      ${record.mediaType === "drawing" && record.mediaPath ? `<img class="media-preview" alt="Saved mood drawing" src="${record.mediaPath}" />` : ""}
      ${record.mediaType === "photo" && record.mediaKey ? `<img class="media-preview" data-media-key="${record.mediaKey}" alt="Saved practice photo" />` : ""}
      ${record.mediaType === "video" && record.mediaKey ? `<video class="media-preview" data-media-key="${record.mediaKey}" controls></video>` : ""}
      ${record.mediaType === "audio" && record.mediaKey ? `<audio class="audio-preview" data-media-key="${record.mediaKey}" controls></audio>` : ""}
      ${record.mediaDuration ? `<p class="meta">Duration: ${record.mediaDuration} seconds</p>` : ""}
      ${answers.length ? `<div class="answer-card"><span class="answer-title">Game Record</span>${answers.map((line) => `<span class="answer-line">${escapeHtml(line)}</span>`).join("")}</div>` : ""}
    </article>
  `;
}

async function hydrateMediaRecords() {
  const nodes = [...app.querySelectorAll("[data-media-key]")];
  await Promise.all(nodes.map(async (node) => {
    const blob = await getMediaBlob(node.dataset.mediaKey);
    if (!blob) {
      const missing = document.createElement("p");
      missing.className = "help-text";
      missing.textContent = "This media file is not available in this browser.";
      node.replaceWith(missing);
      return;
    }
    node.src = URL.createObjectURL(blob);
  }));
}

function answerLines(answers) {
  const lines = [];
  if (answers.commonPoints) answers.commonPoints.forEach((point, index) => point && lines.push(`Shared quality ${index + 1}: ${point}`));
  if (answers.support) lines.push(`Support: ${answers.support}`);
  if (answers.against) lines.push(`Challenge: ${answers.against}`);
  if (answers.represents) lines.push(`Empty chair represents: ${answers.represents}`);
  if (answers.feeling) lines.push(`Reflection: ${answers.feeling}`);
  if (answers.newEmotionName) lines.push(`New emotion name: ${answers.newEmotionName}`);
  if (answers.questions) answers.questions.forEach((question) => lines.push(`Asked: ${question}`));
  return lines;
}

function toast(message) {
  document.querySelector(".toast")?.remove();
  const node = document.createElement("div");
  node.className = "toast";
  node.textContent = message;
  document.body.appendChild(node);
  setTimeout(() => node.remove(), 2200);
}

document.body.addEventListener("click", (event) => {
  const routeButton = event.target.closest("[data-route]");
  if (!routeButton) return;
  setRoute(routeButton.dataset.route);
});

startGame("story-sculpture");
setRoute("mood");
