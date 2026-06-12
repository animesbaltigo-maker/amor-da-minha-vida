(function () {
  const config = window.DEAR_YOU_CONFIG;
  const revealScreen = document.getElementById("revealScreen");
  const revealButton = document.getElementById("revealButton");
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

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
  window.scrollTo(0, 0);

  document.getElementById("mainTitle").textContent = config.title;
  document.getElementById("sinceLine").textContent = `Juntos desde ${config.startDateLabel}`;
  document.getElementById("loveLetter").textContent = config.letter;
  spotifyPlayer.src = config.music.spotifyUrl;

  revealButton.addEventListener("click", () => {
    revealScreen.classList.add("is-hidden");
    siteShell.classList.add("is-visible");
    siteShell.removeAttribute("aria-hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
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
  renderGallery();
  renderTimeline();
  renderClosing();
})();
