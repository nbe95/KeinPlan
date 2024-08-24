export const getViewport = (): string => {
  // https://stackoverflow.com/a/8876069
  const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  if (width <= 576) return "xs";
  if (width <= 768) return "sm";
  if (width <= 992) return "md";
  if (width <= 1200) return "lg";
  if (width <= 1400) return "xl";
  return "xxl";
};

export const scrollToElement = (elementId: string, mobileOnly: boolean = false): void => {
  if (!mobileOnly || getViewport() == "xs") {
    document.getElementById(elementId)?.scrollIntoView();
  }
};
