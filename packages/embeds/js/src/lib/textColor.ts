export const textColor = (background: string) => {
  // Simple luminance calculation for hex/rgb(a) backgrounds
  let bg = background.trim();

  // Handle hex
  if (bg.startsWith("#")) {
    let hex = bg.replace("#", "");

    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const luminance =
      (0.2126 * r) / 255 + (0.7152 * g) / 255 + (0.0722 * b) / 255;

    return luminance > 0.6 ? "#222" : "#fff";
  }

  // Handle rgb/rgba
  if (bg.startsWith("rgb")) {
    const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);

    if (match) {
      const r = parseInt(match[1], 10);
      const g = parseInt(match[2], 10);
      const b = parseInt(match[3], 10);
      const luminance =
        (0.2126 * r) / 255 + (0.7152 * g) / 255 + (0.0722 * b) / 255;

      return luminance > 0.6 ? "#222" : "#fff";
    }
  }

  // fallback
  return "#777";
};
