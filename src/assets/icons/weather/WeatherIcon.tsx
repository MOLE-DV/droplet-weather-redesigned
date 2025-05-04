type props = {
  name: string;
  className?: string;
};

const modules = import.meta.glob("./**/*.svg", { eager: true }) as {
  [key: string]: { default: string };
};

const icons = Object.fromEntries(
  Object.entries(modules).map(([path, mod]) => {
    const filename = path.split("/").pop()?.split(".")[0].toLowerCase();
    return [filename, mod.default];
  })
);

export const WeatherIcon = ({ name, className }: props) => {
  return (
    <img
      className={className}
      src={icons[name && Object.keys(icons).includes(name) ? name : "unknown"]}
    />
  );
};
