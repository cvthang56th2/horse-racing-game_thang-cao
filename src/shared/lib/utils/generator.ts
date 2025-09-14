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
