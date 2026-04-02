import { createTheme, alpha } from '@mui/material/styles'

export const getCfmsTheme = (mode: 'light' | 'dark') => {
  const isDark = mode === 'dark'

  // --- Palette tokens ---
  const primary = isDark ? '#29b6f6' : '#0277bd'
  const secondary = isDark ? '#7dd3fc' : '#0288d1'
  const bgDefault = isDark ? '#07101a' : '#f4f7fa'
  const bgPaper = isDark ? '#0f1d2e' : '#ffffff'
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'
  // const headerBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'
  const hoverBg = isDark ? 'rgba(41,182,246,0.08)' : 'rgba(2,119,189,0.04)'
  const textPrimary = isDark ? '#e4edf5' : '#1a2332'
  const textSecondary = isDark ? 'rgba(228,237,245,0.65)' : 'rgba(26,35,50,0.6)'

  return createTheme({
    palette: {
      mode,
      primary: { main: primary },
      secondary: { main: secondary },
      background: {
        default: bgDefault,
        paper: bgPaper,
      },
      text: {
        primary: textPrimary,
        secondary: textSecondary,
      },
      success: { main: '#14b8a6' },
      warning: { main: '#f59e0b' },
      error: { main: '#ef4444' },
      divider: borderColor,
    },

    shape: { borderRadius: 12 },

    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica Neue", Arial, sans-serif',
      h4: { fontWeight: 700, letterSpacing: '-0.02em' },
      h5: { fontWeight: 700, letterSpacing: '-0.01em' },
      h6: { fontWeight: 600 },
      body2: { color: textSecondary },
      overline: { 
        fontWeight: 600, 
        letterSpacing: '0.08em',
        color: textSecondary,
      },
    },

    components: {
      /* ── CssBaseline body color ─────────────────────── */
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: bgDefault,
            transition: 'background-color 0.3s ease',
          },
        },
      },

      /* ── Cards ─────────────────────────────────────── */
      MuiCard: {
        styleOverrides: {
          root: {
            border: `1px solid ${borderColor}`,
            backgroundImage: 'none',
            boxShadow: isDark
              ? '0 4px 24px rgba(0,0,0,0.4)'
              : '0 1px 8px rgba(0,0,0,0.06)',
            transition: 'box-shadow 0.25s ease, border-color 0.25s ease',
            '&:hover': {
              boxShadow: isDark
                ? '0 8px 32px rgba(0,0,0,0.5)'
                : '0 4px 20px rgba(0,0,0,0.1)',
            },
          },
        },
      },

      /* ── Paper ─────────────────────────────────────── */
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            border: `1px solid ${borderColor}`,
            boxShadow: isDark
              ? '0 2px 16px rgba(0,0,0,0.35)'
              : '0 1px 6px rgba(0,0,0,0.05)',
          },
        },
      },

      /* ── AppBar ────────────────────────────────────── */
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isDark
              ? 'rgba(15, 29, 46, 0.8)'
              : 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(16px) saturate(180%)',
            WebkitBackdropFilter: 'blur(16px) saturate(180%)',
            borderBottom: `1px solid ${borderColor}`,
            boxShadow: 'none',
            color: textPrimary,
          },
        },
      },

      /* ── Drawer ────────────────────────────────────── */
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: isDark ? '#0a1624' : '#fafcfe',
            borderRight: `1px solid ${borderColor}`,
            backgroundImage: 'none',
          },
        },
      },

      /* ── Toolbar ───────────────────────────────────── */
      MuiToolbar: {
        styleOverrides: {
          root: {
            minHeight: '64px !important',
          },
        },
      },

      /* ── ListItemButton (sidebar nav) ──────────────── */
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            marginInline: 8,
            marginBlock: 2,
            paddingInline: 16,
            transition: 'all 0.2s ease',
            '&.active': {
              backgroundColor: alpha(primary, 0.12),
              color: primary,
              '& .MuiListItemIcon-root': {
                color: primary,
              },
            },
            '&:hover': {
              backgroundColor: hoverBg,
            },
          },
        },
      },

      /* ── TextField / OutlinedInput ─────────────────── */
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.15)',
              transition: 'border-color 0.2s ease',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.3)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: primary,
            },
          },
        },
      },

      /* ── Button ────────────────────────────────────── */
      MuiButton: {
        styleOverrides: {
          contained: {
            textTransform: 'none' as const,
            fontWeight: 600,
            boxShadow: 'none',
            background: isDark
              ? `linear-gradient(135deg, ${primary} 0%, #0288d1 100%)`
              : `linear-gradient(135deg, ${primary} 0%, #01579b 100%)`,
            '&:hover': {
              boxShadow: `0 4px 16px ${alpha(primary, 0.35)}`,
              background: isDark
                ? `linear-gradient(135deg, #4fc3f7 0%, #29b6f6 100%)`
                : `linear-gradient(135deg, #0288d1 0%, #01579b 100%)`,
            },
          },
          outlined: {
            textTransform: 'none' as const,
            fontWeight: 600,
            borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
          },
        },
      },

      /* ── Chip ──────────────────────────────────────── */
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 500,
            borderRadius: 6,
          },
        },
      },

      /* ── DataGrid ──────────────────────────────────── */
      // MuiDataGrid: {
      //   styleOverrides: {
      //     root: {
      //       border: 'none',
      //       fontSize: '0.875rem',
      //       '& .MuiDataGrid-withBorderColor': {
      //         borderColor,
      //       },
      //     },
      //     columnHeaders: {
      //       backgroundColor: headerBg,
      //       borderBottom: `1px solid ${borderColor}`,
      //     },
      //     columnHeader: {
      //       fontWeight: 700,
      //       fontSize: '0.75rem',
      //       textTransform: 'uppercase' as const,
      //       letterSpacing: '0.05em',
      //       color: textSecondary,
      //       '&:focus, &:focus-within': {
      //         outline: 'none',
      //       },
      //     },
      //     columnSeparator: {
      //       display: 'none',
      //     },
      //     row: {
      //       transition: 'background-color 0.15s ease',
      //       '&:hover': {
      //         backgroundColor: hoverBg,
      //       },
      //       '&.Mui-selected': {
      //         backgroundColor: alpha(primary, 0.1),
      //         '&:hover': {
      //           backgroundColor: alpha(primary, 0.15),
      //         },
      //       },
      //     },
      //     cell: {
      //       borderBottom: `1px solid ${borderColor}`,
      //       '&:focus, &:focus-within': {
      //         outline: 'none',
      //       },
      //     },
      //     footerContainer: {
      //       borderTop: `1px solid ${borderColor}`,
      //       backgroundColor: headerBg,
      //     },
      //     overlay: {
      //       backgroundColor: alpha(bgPaper, 0.8),
      //     },
      //   },
      // },

      /* ── Switch (dark/light toggle) ────────────────── */
      MuiSwitch: {
        styleOverrides: {
          switchBase: {
            '&.Mui-checked': {
              color: primary,
              '& + .MuiSwitch-track': {
                backgroundColor: primary,
                opacity: 0.5,
              },
            },
          },
        },
      },

      /* ── Divider ───────────────────────────────────── */
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor,
          },
        },
      },

      /* ── LinearProgress (SLA bars) ─────────────────── */
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: 4,
            height: 6,
            backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
          },
        },
      },

      /* ── Dialog ──────────────────────────────────────── */
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundImage: 'none',
            backgroundColor: bgPaper,
            border: `1px solid ${borderColor}`,
            boxShadow: isDark
              ? '0 24px 64px rgba(0,0,0,0.6)'
              : '0 16px 48px rgba(0,0,0,0.12)',
          },
        },
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            fontSize: '1.15rem',
            fontWeight: 700,
          },
        },
      },

      /* ── Badge ───────────────────────────────────────── */
      MuiBadge: {
        styleOverrides: {
          badge: {
            fontWeight: 700,
          },
        },
      },

      /* ── Tooltip ─────────────────────────────────────── */
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            fontSize: '0.75rem',
            fontWeight: 500,
            borderRadius: 6,
          },
        },
      },
    },
  })
}
