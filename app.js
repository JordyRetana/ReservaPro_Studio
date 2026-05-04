document.querySelectorAll('.panel,.kpis article').forEach((card, index) => {
  card.style.animation = `fade .35s ease ${index * 25}ms both`;
});
