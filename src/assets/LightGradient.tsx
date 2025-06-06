export const LightGradient = () => (
  <svg
    style={{ width: 0, height: 0, position: "absolute" }}
    aria-hidden="true"
    focusable="false"
  >
    <linearGradient id="light-gradient" x2="1" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#B3B3B3" />
    </linearGradient>
  </svg>
);
