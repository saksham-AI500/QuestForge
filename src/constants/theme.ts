export const darkTheme = {
  mode: 'dark' as const,
  bg: '#0F0B1E',
  bgElevated: '#181228',
  card: '#1E1836',
  cardAlt: '#251E40',
  border: '#332A54',
  primary: '#7C4DFF',
  primaryMuted: '#4A3580',
  secondary: '#00E5C7',
  accent: '#FFB74D',
  danger: '#FF5C7A',
  success: '#4ADE80',
  textPrimary: '#F5F3FF',
  textSecondary: '#B0A8CC',
  textMuted: '#736A94',
  gradientStart: '#7C4DFF',
  gradientEnd: '#00B8D9',
  shadow: '#000000',
};

export const lightTheme = {
  mode: 'light' as const,
  bg: '#F6F4FC',
  bgElevated: '#FFFFFF',
  card: '#FFFFFF',
  cardAlt: '#EFEBFB',
  border: '#E0D9F5',
  primary: '#6A3DE8',
  primaryMuted: '#D9CCF7',
  secondary: '#00A896',
  accent: '#F59E42',
  danger: '#E03A5B',
  success: '#22A366',
  textPrimary: '#211A38',
  textSecondary: '#5C5478',
  textMuted: '#8D84A8',
  gradientStart: '#6A3DE8',
  gradientEnd: '#00A896',
  shadow: '#B0A8CC',
};

export interface Theme {
  mode: 'dark' | 'light';
  bg: string;
  bgElevated: string;
  card: string;
  cardAlt: string;
  border: string;
  primary: string;
  primaryMuted: string;
  secondary: string;
  accent: string;
  danger: string;
  success: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  gradientStart: string;
  gradientEnd: string;
  shadow: string;
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
};

export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  xxxl: 36,
};
