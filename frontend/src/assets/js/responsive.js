function numberOfCards(n) {
  if (window.innerWidth <= 767) return 4;
  else if (window.innerWidth <= 1199 && n % 2 === 1) return n - 1;
  else if (window.innerWidth > 1199 && n % 3 === 1) return n + 1;
  else return n;
}

export { numberOfCards };
