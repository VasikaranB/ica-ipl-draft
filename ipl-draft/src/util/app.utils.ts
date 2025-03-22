import { masterData2023, masterData2024, masterData2025 } from './playerslist';

export const getMasterData = (year: string) => {
  switch (year) {
    case '2023':
      return masterData2023;
    case '2024':
      return masterData2024;
    case '2025':
      return masterData2025;
    default:
      return masterData2025;
  }
};

export const getId = (year: string) => {
  switch (year) {
    case '2023':
      return 107;
    case '2024':
      return 148;
    case '2025':
      return 203;
    default:
      return 203;
  }
};
