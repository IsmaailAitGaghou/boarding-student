export type ThemeMode = 'light' | 'dark';

export type AppTheme = {
  mode: ThemeMode;
};

export const defaultTheme: AppTheme = {
  mode: 'light',
};
