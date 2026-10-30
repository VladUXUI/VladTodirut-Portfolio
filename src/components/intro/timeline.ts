/*
 * Shared intro timeline (seconds from page load). The hero text and the
 * portrait rings both read from here so they stay in sync.
 */
export const INTRO = {
  name: 0.1, // "Vlad" letters slide up
  rings: 0.25, // rings start rising and reveal the portrait
  surname: 0.55, // "Todirut" types out
  tagline: 1.05, // tagline words slide up
  subtitle: 1.35, // short line about me slides up
  since: 1.7, // "Since 2010" types out
  squiggle: 2.2, // squiggle draws on
  menu: 2.3, // main menu fades in
} as const;

export const EASE_OUT = [0.2, 0.8, 0.2, 1] as const;
