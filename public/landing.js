const roleCards = document.querySelectorAll(".role-card[data-target]");

function openRole(card) {
  const target = card.dataset.target;

  if (target) {
    window.location.href = target;
  }
}

roleCards.forEach((card) => {
  card.addEventListener("click", () => openRole(card));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openRole(card);
    }
  });
});
