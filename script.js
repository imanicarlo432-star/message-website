const homeScreen = document.querySelector('[data-screen="home"]');
const letterScreen = document.querySelector('[data-screen="letter"]');
const memberGrid = document.querySelector("[data-member-grid]");
const stage = document.querySelector("[data-letter-stage]");
const recipientName = document.querySelector("[data-recipient-name]");
const paperImage = document.querySelector("[data-paper-image]");
const closedEnvelope = document.querySelector("[data-envelope-closed]");
const openEnvelope = document.querySelector("[data-envelope-open]");
const letterSeal = document.querySelector("[data-letter-seal]");
const openLetterButton = document.querySelector("[data-open-letter]");
const backButton = document.querySelector("[data-back]");

const members = window.LIT_MEMBERS || [];
const bySlug = new Map(members.map((member) => [member.slug, member]));

function renderHome() {
  memberGrid.innerHTML = "";
  members.forEach((member) => {
    const button = document.createElement("button");
    button.className = "member-button";
    button.type = "button";
    button.dataset.slug = member.slug;
    button.setAttribute("aria-label", `打开${member.name}的信封`);

    const img = document.createElement("img");
    img.src = member.seal;
    img.alt = "";

    const label = document.createElement("span");
    label.textContent = member.name;

    button.append(img, label);
    memberGrid.append(button);
  });
}

function showHome() {
  letterScreen.classList.remove("is-active");
  homeScreen.classList.add("is-active");
  stage.classList.remove("is-open");
  window.history.replaceState(null, "", window.location.pathname);
}

function showLetter(member, shouldOpen = false) {
  recipientName.textContent = member.name;
  closedEnvelope.src = member.closed;
  openEnvelope.src = member.open;
  letterSeal.src = member.seal;
  paperImage.src = member.paper;
  stage.style.setProperty("--seal-y", `${member.sealY || 0}px`);
  stage.style.setProperty("--seal-scale", member.sealScale || 1);
  stage.classList.remove("is-open");

  homeScreen.classList.remove("is-active");
  letterScreen.classList.add("is-active");
  window.history.replaceState(null, "", `#${member.slug}`);

  if (shouldOpen) {
    window.setTimeout(() => {
      stage.classList.add("is-open");
    }, 180);
  }
}

memberGrid.addEventListener("click", (event) => {
  const button = event.target.closest(".member-button");
  if (!button) return;
  const member = bySlug.get(button.dataset.slug);
  if (member) {
    showLetter(member);
  }
});

openLetterButton.addEventListener("click", () => {
  stage.classList.add("is-open");
});

backButton.addEventListener("click", showHome);

renderHome();

const hash = decodeURIComponent(window.location.hash.replace("#", ""));
if (hash) {
  const slug = hash.replace("-open", "");
  const member = bySlug.get(slug);
  if (member) {
    showLetter(member, hash.endsWith("-open"));
  }
}
