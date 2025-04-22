export const DarkGradient = () => (
  <svg
    style={{ width: 0, height: 0, position: "absolute" }}
    aria-hidden="true"
    focusable="false"
  >
    <linearGradient id="dark-gradient" x2="1" y2="1">
      <stop offset="0%" stop-color="#222222" />
      <stop offset="100%" stop-color="#303030" />
    </linearGradient>
  </svg>
);
