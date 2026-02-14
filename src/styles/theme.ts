// Mantine theme configuration — dynamic primary color

import { createTheme, MantineColorsTuple } from "@mantine/core";
import { generateColors } from "@mantine/colors-generator";

export function buildTheme(primaryColor: string) {
  const colors: MantineColorsTuple = generateColors(primaryColor);

  return createTheme({
    primaryColor: "primary",
    colors: {
      primary: colors,
    },
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
    headings: {
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
      fontWeight: "600",
    },
    defaultRadius: "md",
    cursorType: "pointer",
  });
}

// Preset color palette options
export const COLOR_PRESETS = [
  { name: "Tomato", hex: "#E03131" },
  { name: "Blue", hex: "#228BE6" },
  { name: "Violet", hex: "#7950F2" },
  { name: "Teal", hex: "#12B886" },
  { name: "Orange", hex: "#FD7E14" },
  { name: "Pink", hex: "#E64980" },
  { name: "Indigo", hex: "#4C6EF5" },
  { name: "Cyan", hex: "#15AABF" },
] as const;
