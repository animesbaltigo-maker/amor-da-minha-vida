(function () {
  const config = window.DEAR_YOU_CONFIG;
  const revealScreen = document.getElementById("revealScreen");
  const quizForm = document.getElementById("quizForm");
  const quizTitle = document.getElementById("quizTitle");
  const quizPrompt = document.getElementById("quizPrompt");
  const quizAnswer = document.getElementById("quizAnswer");
  const quizFeedback = document.getElementById("quizFeedback");
  const quizProgress = document.getElementById("quizProgress");
  const quizHint = document.getElementById("quizHint");
  const quizButtonText = document.getElementById("quizButtonText");
  const siteShell = document.getElementById("siteShell");
  const spotifyPlayer = document.getElementById("spotifyPlayer");
  const galleryImage = document.getElementById("galleryImage");
  const galleryCount = document.getElementById("galleryCount");
  const galleryDots = document.getElementById("galleryDots");
  const thumbs = document.getElementById("thumbs");
  const timeline = document.getElementById("timeline");
  const closingSection = document.getElementById("closingSection");
  let currentPhoto = 0;
  let galleryTimer;
  let quizStep = 0;

  const quizSteps = [
    {
      title: "Primeira lembrança",
      prompt: "Quando a gente se viu pela primeira vez?",
      hint: "Dica: foi em novembro, e essa data virou parte da nossa história.",
      type: "date",
      answer: "2023-11-11",
      success: "Sim. Copacabana guarda esse comecinho."
    },
    {
      title: "Presente internacional",
      prompt: "Qual animal tinha no seu primeiro presente internacional?",
      hint: "Dica: pequeno, delicado e com asas.",
      type: "text",
      placeholder: "Digite o animal",
      answers: ["borboleta", "uma borboleta"],
      success: "Acertou. Uma borboleta, do jeitinho que essa memória merece."
    },
    {
      title: "Complete a frase",
      prompt: "O amor só parece inútil porque...",
      hint: "Escolhe com o coração. Aqui tem pegadinha bonita.",
      type: "choice",
      options: [
        "ele ensina sem explicar e fica mesmo quando a lógica vai embora",
        "ele não precisa fazer sentido pra ser real",
        "ele transforma qualquer lugar comum em casa"
      ],
      answer: 1,
      success: "Era essa. Algumas coisas são reais justamente antes de fazerem sentido."
    }
  ];

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
  window.scrollTo(0, 0);

  document.getElementById("mainTitle").textContent = config.title;
  document.getElementById("sinceLine").textContent = `Juntos desde ${config.startDateLabel}`;
  document.getElementById("loveLetter").textContent = config.letter;
  spotifyPlayer.src = config.music.spotifyUrl;

  function unlockSite() {
    revealScreen.classList.add("is-hidden");
    siteShell.classList.add("is-visible");
    siteShell.removeAttribute("aria-hidden");
    setTimeout(() => {
      revealScreen.setAttribute("hidden", "");
    }, 720);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function normalizeAnswer(value) {
    return value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[.,]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function renderQuizStep() {
    const step = quizSteps[quizStep];
    quizTitle.textContent = step.title;
    quizPrompt.textContent = step.prompt;
    quizHint.textContent = step.hint;
    quizFeedback.textContent = "";
    quizFeedback.className = "quiz-feedback";
    quizButtonText.textContent = quizStep === quizSteps.length - 1 ? "Abrir surpresa" : "Responder";
    quizProgress.innerHTML = quizSteps
      .map((_, index) => `<span class="${index <= quizStep ? "active" : ""}"></span>`)
      .join("");

    if (step.type === "choice") {
      quizAnswer.innerHTML = step.options
        .map(
          (option, index) => `
            <label class="choice-option">
              <input type="radio" name="quizChoice" value="${index}">
              <span>${option}</span>
            </label>
          `
        )
        .join("");
      return;
    }

    if (step.type === "date") {
      quizAnswer.innerHTML = `
        <label class="date-picker-wrap">
          <span>Escolha no calendário</span>
          <input
            class="quiz-input date-input"
            id="quizInput"
            name="quizInput"
            type="date"
            min="2023-01-01"
            max="2026-12-31"
            aria-label="${step.prompt}">
        </label>
      `;
      document.getElementById("quizInput").focus({ preventScroll: true });
      return;
    }

    quizAnswer.innerHTML = `
      <input
        class="quiz-input"
        id="quizInput"
        name="quizInput"
        type="text"
        inputmode="text"
        placeholder="${step.placeholder}"
        aria-label="${step.prompt}">
    `;
    document.getElementById("quizInput").focus({ preventScroll: true });
  }

  function answerIsCorrect(step) {
    if (step.type === "choice") {
      const selected = quizAnswer.querySelector("input:checked");
      return selected && Number(selected.value) === step.answer;
    }

    const input = quizAnswer.querySelector("input");
    if (step.type === "date") {
      return input.value === step.answer;
    }

    const value = normalizeAnswer(input.value);
    return step.answers.some((answer) => normalizeAnswer(answer) === value);
  }

  quizForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const step = quizSteps[quizStep];

    if (!answerIsCorrect(step)) {
      quizFeedback.textContent = "Quase, minha pinguim. Tenta de novo com calma.";
      quizFeedback.className = "quiz-feedback is-wrong";
      document.getElementById("quizCard").animate(
        [
          { transform: "translateX(0)" },
          { transform: "translateX(-8px)" },
          { transform: "translateX(8px)" },
          { transform: "translateX(0)" }
        ],
        { duration: 260, easing: "ease-out" }
      );
      return;
    }

    quizFeedback.textContent = step.success;
    quizFeedback.className = "quiz-feedback is-right";

    if (quizStep === quizSteps.length - 1) {
      setTimeout(unlockSite, 820);
      return;
    }

    quizStep += 1;
    setTimeout(renderQuizStep, 850);
  });

  function updateCounter() {
    const start = new Date(config.startDate);
    const now = new Date();
    const diffMs = Math.max(0, now - start);
    const totalDays = Math.floor(diffMs / 86400000);
    const months = monthDiff(start, now);
    const anchor = new Date(start);
    anchor.setMonth(anchor.getMonth() + months);
    const daysAfterMonth = Math.max(0, Math.floor((now - anchor) / 86400000));
    const totalHours = Math.floor(diffMs / 3600000);

    document.getElementById("monthsCount").textContent = months;
    document.getElementById("daysRemainder").textContent = daysAfterMonth;
    document.getElementById("timeCount").textContent = totalHours.toLocaleString("pt-BR");
    document.getElementById("totalDays").textContent = `São ${totalDays} dias de amor`;
  }

  function monthDiff(start, end) {
    let months = (end.getFullYear() - start.getFullYear()) * 12;
    months += end.getMonth() - start.getMonth();
    if (end.getDate() < start.getDate()) months -= 1;
    return Math.max(0, months);
  }

  function renderGallery() {
    thumbs.innerHTML = "";
    galleryDots.innerHTML = "";
    config.photos.forEach((photo, index) => {
      const thumbButton = document.createElement("button");
      thumbButton.type = "button";
      thumbButton.setAttribute("aria-label", `Thumbnail ${index + 1}`);
      const img = document.createElement("img");
      img.src = photo;
      img.alt = `Thumbnail ${index + 1}`;
      thumbButton.appendChild(img);
      thumbButton.addEventListener("click", () => {
        showPhoto(index);
        startGalleryAutoplay();
      });
      thumbs.appendChild(thumbButton);

      const dot = document.createElement("span");
      galleryDots.appendChild(dot);
    });
    showPhoto(0);
    startGalleryAutoplay();
  }

  function showPhoto(index) {
    currentPhoto = (index + config.photos.length) % config.photos.length;
    galleryImage.src = config.photos[currentPhoto];
    galleryImage.alt = "Foto do casal";
    galleryCount.textContent = `${currentPhoto + 1} / ${config.photos.length}`;
    [...thumbs.children].forEach((button, idx) => button.classList.toggle("active", idx === currentPhoto));
    [...galleryDots.children].forEach((dot, idx) => dot.classList.toggle("active", idx === currentPhoto));
  }

  document.getElementById("prevPhoto").addEventListener("click", () => {
    showPhoto(currentPhoto - 1);
    startGalleryAutoplay();
  });
  document.getElementById("nextPhoto").addEventListener("click", () => {
    showPhoto(currentPhoto + 1);
    startGalleryAutoplay();
  });

  function startGalleryAutoplay() {
    clearInterval(galleryTimer);
    galleryTimer = setInterval(() => showPhoto(currentPhoto + 1), 4200);
  }

  function renderTimeline() {
    timeline.innerHTML = "";
    config.timeline.forEach((item) => {
      const row = document.createElement("article");
      row.className = "timeline-item";
      row.innerHTML = `
        <div class="timeline-marker" aria-hidden="true">♡</div>
        <div class="timeline-card glass-card">
          <time>${item.date}</time>
          <h3>${item.title}</h3>
          <p>${item.description}</p>
          <img src="${item.image}" alt="${item.title}">
        </div>
      `;
      timeline.appendChild(row);
    });
  }

  function renderClosing() {
    const highlights = config.closing.highlights
      .map(([label, value]) => `<article><span>${label}</span><strong>${value}</strong></article>`)
      .join("");
    closingSection.innerHTML = `
      <span class="closing-eyebrow">${config.closing.eyebrow}</span>
      <h2>${config.closing.title}</h2>
      <p>${config.closing.text}</p>
      <div class="closing-grid">${highlights}</div>
    `;
  }

  updateCounter();
  setInterval(updateCounter, 1000);
  renderQuizStep();
  renderGallery();
  renderTimeline();
  renderClosing();
})();
