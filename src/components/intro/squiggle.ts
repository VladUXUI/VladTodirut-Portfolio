/* Figma "Group 3" squiggle (15 half-circles) as one continuous path, left → right */
export const SQUIGGLE_VIEWBOX = "0 0 123 11";

export const SQUIGGLE_PATH =
  "M1.5 5.5" +
  Array.from({ length: 15 }, (_, k) => `A4 4 0 0 ${k % 2} ${1.5 + 8 * (k + 1)} 5.5`).join("");
