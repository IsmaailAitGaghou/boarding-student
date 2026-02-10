import { createTheme } from "@mui/material/styles";
import type { Shadows } from "@mui/material/styles";

export type ThemeMode = "light" | "dark";

export type AppTheme = {
  mode: ThemeMode;
};

export const defaultTheme: AppTheme = {
  mode: "light",
};

/**
 * Semantic design tokens.
 *
 * Rules (enforced by usage, not code):
 * - Use `primary` + neutrals + semantic statuses only.
 * - Buttons/links/focus rings must reference these tokens (no random colors).
 */
export const tokens = {
  color: {
    // Brand
    primary: {
      900: "#005461",
      700: "#0C7779",
      500: "#249E94",
      300: "#3BC1A8",
    },

  background: "#F3F4F6", // app background
  surface: "#FFFFFF", // cards/surfaces
  border: "#E5E7EB", // dividers/borders

    text: {
      primary: "#1F2937",
      secondary: "#374151",
      muted: "#6B7280",
    },

    success: "#16A34A",
    warning: "#D97706",
    error: "#DC2626",
    info: "#2563EB",
  },

  typography: {
    h1: { fontSize: "2rem", fontWeight: 800, lineHeight: 1.25 },
    h2: { fontSize: "1.5rem", fontWeight: 800, lineHeight: 1.3 },
    h3: { fontSize: "1.25rem", fontWeight: 700, lineHeight: 1.35 },
    body: { fontSize: "1rem", fontWeight: 400, lineHeight: 1.5 },
    bodySmall: { fontSize: "0.875rem", fontWeight: 400, lineHeight: 1.57 },
    caption: { fontSize: "0.75rem", fontWeight: 400, lineHeight: 1.5 },
    button: { fontSize: "0.875rem", fontWeight: 700, lineHeight: 1.2 },
    label: { fontSize: "0.75rem", fontWeight: 700, lineHeight: 1.5, textTransform: "uppercase" },
  },

  spacing: [4, 8, 12, 16, 24, 32, 40] as const,

  radius: {
    card: 12,
    control: 10,
    modal: 16,
  },

  // Two shadow levels only.
  shadow: {
    sm: "0px 1px 2px rgba(16, 24, 40, 0.06), 0px 1px 3px rgba(16, 24, 40, 0.10)",
    md: "0px 4px 8px rgba(16, 24, 40, 0.08), 0px 8px 16px rgba(16, 24, 40, 0.10)",
  },
} as const;



export function createAppMuiTheme(mode: ThemeMode = defaultTheme.mode) {
  const isDark = mode === "dark";

  const background = isDark ? "#0B1220" : tokens.color.background;
  const surface = isDark ? "#0F172A" : tokens.color.surface;
  const border = isDark ? "#243042" : tokens.color.border;
  const textPrimary = isDark ? "#E5E7EB" : tokens.color.text.primary;
  const textSecondary = isDark ? "#CBD5E1" : tokens.color.text.secondary;

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: tokens.color.primary[700],
        dark: tokens.color.primary[900],
        light: tokens.color.primary[300],
        contrastText: "#FFFFFF",
      },
      success: { main: tokens.color.success },
      warning: { main: tokens.color.warning },
      error: { main: tokens.color.error },
      info: { main: tokens.color.info },
      background: {
        default: background,
        paper: surface,
      },
      text: {
        primary: textPrimary,
        secondary: textSecondary,
      },
      divider: border,
    },
    typography: {
      fontFamily:
        'Montserrat, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
      h1: { fontFamily: 'Satoshi, Montserrat, sans-serif', ...tokens.typography.h1 },
      h2: { fontFamily: 'Satoshi, Montserrat, sans-serif', ...tokens.typography.h2 },
      h3: { fontFamily: 'Satoshi, Montserrat, sans-serif', ...tokens.typography.h3 },
      body1: tokens.typography.body,
      body2: tokens.typography.bodySmall,
      caption: tokens.typography.caption,
      button: {
        fontFamily: 'Satoshi, Montserrat, sans-serif',
        ...tokens.typography.button,
        textTransform: "unset",
      },
      overline: tokens.typography.label,
    },
    spacing: (factor: number) => {
      const scale = tokens.spacing;
      if (Number.isInteger(factor) && factor >= 0 && factor < scale.length) {
        return `${scale[factor]}px`;
      }
      return `${factor * 8}px`;
    },
    shape: { borderRadius: tokens.radius.control },
    shadows: [
      "none",
      tokens.shadow.sm,
      tokens.shadow.md,
      ...Array.from({ length: 22 }, () => "none"),
    ] as unknown as Shadows,
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: background,
            color: textPrimary,
          },
        },
      },
      MuiLink: {
        defaultProps: { underline: "hover" },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderRadius: tokens.radius.control,
            textTransform: "unset",
            minHeight: 44,
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: tokens.radius.control,
            minHeight: 44,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: tokens.radius.card,
            boxShadow: tokens.shadow.sm,
            border: `1px solid ${border}`,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: tokens.radius.modal,
          },
        },
      },
    },
  });

  return theme;
}
