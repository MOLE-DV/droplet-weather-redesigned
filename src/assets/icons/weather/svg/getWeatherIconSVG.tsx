const modules = import.meta.glob("./**/*.svg", { eager: true }) as {
  [key: string]: { default: string };
};

const weatherIconsSVG = Object.fromEntries(
  Object.entries(modules).map(([path, mod]) => {
    const filename = path.split("/").pop()?.split(".")[0].toLowerCase();
    return [filename, mod.default];
  })
);

export default weatherIconsSVG;
