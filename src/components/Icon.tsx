export function Icon({ name, size = 16 }: { name: string; size?: number }) {
  return (
    <img
      src={`./icons/${name}.png`}
      alt=""
      className="icon"
      style={{ width: size, height: size }}
    />
  );
}
