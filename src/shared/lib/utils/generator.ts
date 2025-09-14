import { faker } from '@faker-js/faker';

export const generateRandomHorseName = (): string => {
  return faker.animal.horse();
}

export const generateRandomColor = (): string => {
  return faker.color.rgb({ prefix: '#' });
}

export const generateRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const generateHorses = (count: number) => {
  const uniqueColors = new Set<string>();
  return Array.from({ length: count }, (_, index) => {
    let color;
    do {
      color = generateRandomColor();
    } while (uniqueColors.has(color));
    uniqueColors.add(color);
    return {
      id: index + 1,
      name: generateRandomHorseName(),
      speed: generateRandomNumber(40, 100),
      position: 0,
      color,
    };
  });
}
