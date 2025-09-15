import { faker } from '@faker-js/faker';

export const generateRandomHorseName = (): string => {
  const name = faker.animal.horse()
  return name.split(' ').slice(0, 2).join(' ')
}

export const generateRandomColor = (): string => {
  // Generate a vibrant HSL color for better visual distinction
  const hue = Math.floor(Math.random() * 360);
  const saturation = 60 + Math.floor(Math.random() * 30); // 60-90%
  const lightness = 40 + Math.floor(Math.random() * 20);  // 40-60%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export const generateRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const generateHorses = (count: number) => {
  const usedColors = new Set<string>();
  const usedNames = new Set<string>();
  return Array.from({ length: count }, (_, index) => {
    let color;
    let attempts = 0;
    do {
      color = generateRandomColor();
      attempts++;
    } while (usedColors.has(color) && attempts < 100);
    usedColors.add(color);

    let name;
    attempts = 0;
    do {
      name = generateRandomHorseName();
      attempts++;
    } while (usedNames.has(name) && attempts < 100);
    usedNames.add(name);

    return {
      id: index + 1,
      name,
      condition: generateRandomNumber(1, 100),
      color,
    };
  });
}
