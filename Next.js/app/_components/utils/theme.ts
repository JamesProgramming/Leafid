import { ValueOf } from "next/dist/shared/lib/constants";

const updateTheme = function (theme: string) {
  const themes = [
    "light-mode",
    "dark-mode",
    "high-contrast-light-mode",
    "high-contrast-dark-mode",
  ];

  const html = document.getElementsByTagName("html")[0];
  themes.forEach((themeName) => html.classList.remove(themeName));
  html.classList.add(theme);
};

export { updateTheme };
