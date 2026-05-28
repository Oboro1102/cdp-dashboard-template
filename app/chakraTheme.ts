import {
  createSystem,
  defaultConfig,
  defineConfig,
  defineRecipe,
  defineSlotRecipe,
} from "@chakra-ui/react";

export const brand = {
  colors: {
    bg0: "#060913",
    bg1: "#0A1020",
    bg2: "#0E1320",
    bg3: "#151C2B",
    line: "#273244",
    lineSoft: "rgba(39, 50, 68, 0.72)",
    text: "#E5E7EB",
    textMuted: "#A8B2C3",
    textDim: "#718096",
    amber: "#D88A1A",
    amberLight: "#E8A84D",
    amberDeep: "#A8650F",
    amberAlpha: "rgba(216, 138, 26, 0.14)",
    amberGlow: "rgba(216, 138, 26, 0.26)",
    success: "#6AD39A",
    warning: "#E8A84D",
    danger: "#E86C6C",
  },
  radii: {
    crisp: "14px",
    panel: "20px",
    shell: "28px",
    pill: "999px",
  },
  shadows: {
    panel: "0 24px 80px rgba(0, 0, 0, 0.42)",
    panelSoft: "0 14px 40px rgba(0, 0, 0, 0.28)",
    amberGlow:
      "0 0 0 1px rgba(216, 138, 26, 0.18), 0 0 48px rgba(216, 138, 26, 0.12)",
    amberHalo:
      "0 0 0 1px rgba(216, 138, 26, 0.12), 0 18px 52px rgba(0, 0, 0, 0.38)",
    inset:
      "inset 0 1px 0 rgba(255, 255, 255, 0.05), inset 0 -1px 0 rgba(0, 0, 0, 0.16)",
    focusRing:
      "0 0 0 1px rgba(216, 138, 26, 0.4), 0 0 0 6px rgba(216, 138, 26, 0.12)",
  },
  motion: {
    soft: "cubic-bezier(0.16, 1, 0.3, 1)",
    premium: "cubic-bezier(0.32, 0.72, 0, 1)",
  },
  surfaces: {
    glass: "rgba(14, 18, 32, 0.84)",
    glassStrong: "rgba(10, 16, 32, 0.92)",
    surfaceCard: "rgba(14, 19, 32, 0.98)",
    overlay: "rgba(2, 4, 11, 0.78)",
  },
  fonts: {
    sans:
      "'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    heading:
      "'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
  },
} as const;

const buttonRecipe = defineRecipe({
  className: "chakra-button",
  base: {
    fontWeight: "semibold",
    borderRadius: "pill",
    transition:
      "transform 220ms cubic-bezier(0.16, 1, 0.3, 1), background-color 220ms cubic-bezier(0.16, 1, 0.3, 1), border-color 220ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 220ms cubic-bezier(0.16, 1, 0.3, 1)",
  },
  variants: {
    variant: {
      nexusPrimary: {
        bg: "linear-gradient(90deg, var(--chakra-colors-nexus-amber-deep) 0%, var(--chakra-colors-nexus-amber) 55%, var(--chakra-colors-nexus-amber-light) 100%)",
        color: "nexus.bg0",
        boxShadow: "amberGlow",
        _hover: {
          opacity: 0.98,
          transform: "translateY(-1px)",
          boxShadow: "amberHalo",
        },
        _active: {
          transform: "translateY(0)",
        },
        _disabled: {
          opacity: 0.5,
        },
      },
      nexusOutline: {
        bg: "transparent",
        borderWidth: "1px",
        borderColor: "nexus.lineSoft",
        color: "nexus.textMuted",
        _hover: {
          bg: "nexus.amberAlpha",
          borderColor: "nexus.amber",
          color: "nexus.text",
        },
        _active: {
          transform: "translateY(0)",
        },
        _disabled: {
          opacity: 0.5,
        },
      },
    },
  },
  defaultVariants: {
    variant: "nexusPrimary",
  },
});

const cardRecipe = defineSlotRecipe({
  className: "chakra-card",
  slots: ["root", "header", "body", "footer"],
  base: {
    root: {
      bg: "nexus.surfaceCard",
      borderWidth: "1px",
      borderColor: "nexus.lineSoft",
      borderRadius: "panel",
      boxShadow: "panel",
      color: "nexus.text",
      overflow: "hidden",
      backdropFilter: "blur(20px)",
    },
    header: {
      borderBottomWidth: "1px",
      borderColor: "nexus.lineSoft",
    },
    footer: {
      borderTopWidth: "1px",
      borderColor: "nexus.lineSoft",
    },
  },
});

const inputRecipe = defineRecipe({
  className: "chakra-input",
  base: {
    borderRadius: "crisp",
    bg: "nexus.bg1",
    borderColor: "nexus.lineSoft",
    color: "nexus.text",
    _placeholder: {
      color: "nexus.textDim",
    },
    _hover: {
      borderColor: "nexus.line",
    },
    _focusVisible: {
      borderColor: "nexus.amber",
      boxShadow: "focusRing",
    },
    _disabled: {
      opacity: 0.55,
      cursor: "not-allowed",
    },
  },
});

const nativeSelectRecipe = defineSlotRecipe({
  className: "chakra-native-select",
  slots: ["root", "field", "indicator"],
  base: {
    root: {
      width: "full",
      position: "relative",
    },
    field: {
      width: "full",
      borderRadius: "crisp",
      bg: "nexus.bg1",
      borderWidth: "1px",
      borderColor: "nexus.lineSoft",
      color: "nexus.text",
      cursor: "pointer",
      _hover: {
        borderColor: "nexus.line",
      },
      _focusVisible: {
        borderColor: "nexus.amber",
        boxShadow: "focusRing",
      },
      _disabled: {
        opacity: 0.55,
        cursor: "not-allowed",
      },
    },
    indicator: {
      color: "nexus.textDim",
    },
  },
});

const selectRecipe = defineSlotRecipe({
  className: "chakra-select",
  slots: [
    "root",
    "label",
    "control",
    "trigger",
    "valueText",
    "indicatorGroup",
    "indicator",
    "content",
    "positioner",
    "item",
    "itemText",
    "itemIndicator",
    "itemGroup",
    "itemGroupLabel",
    "clearTrigger",
    "list",
  ],
  base: {
    root: {
      width: "full",
    },
    label: {
      color: "nexus.textMuted",
      fontSize: "sm",
      marginBottom: "2",
    },
    control: {
      width: "full",
    },
    trigger: {
      width: "full",
      borderRadius: "crisp",
      bg: "nexus.bg1",
      borderWidth: "1px",
      borderColor: "nexus.lineSoft",
      color: "nexus.text",
      _hover: {
        borderColor: "nexus.line",
        bg: "nexus.bg2",
      },
      _focusVisible: {
        borderColor: "nexus.amber",
        boxShadow: "focusRing",
      },
    },
    valueText: {
      color: "nexus.text",
    },
    indicatorGroup: {
      color: "nexus.textDim",
    },
    indicator: {
      color: "nexus.textDim",
    },
    positioner: {
      zIndex: 1400,
    },
    content: {
      background: "nexus.surfaceCard",
      borderWidth: "1px",
      borderColor: "nexus.lineSoft",
      borderRadius: "crisp",
      boxShadow: "panelSoft",
      p: 1,
      color: "nexus.text",
    },
    list: {
      gap: 1,
    },
    item: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 2,
      width: "full",
      color: "nexus.text",
      borderRadius: "10px",
      _highlighted: {
        background: "nexus.bg3",
        color: "nexus.text",
      },
      _selected: {
        background: "nexus.bg3",
        color: "nexus.amberLight",
        boxShadow: "inset",
      },
    },
    itemText: {
      color: "inherit",
      flex: 1,
    },
    itemIndicator: {
      color: "nexus.amber",
    },
    itemGroupLabel: {
      color: "nexus.textDim",
    },
    clearTrigger: {
      color: "nexus.textDim",
    },
  },
});

const alertRecipe = defineSlotRecipe({
  className: "chakra-alert",
  slots: ["root", "indicator", "content", "title", "description"],
  base: {
    root: {
      borderRadius: "crisp",
      borderWidth: "1px",
      borderColor: "nexus.lineSoft",
      bg: "nexus.bg2",
      boxShadow: "panelSoft",
    },
    indicator: {
      alignSelf: "flex-start",
      marginTop: "1",
    },
    content: {
      color: "nexus.text",
    },
    title: {
      fontWeight: "semibold",
    },
    description: {
      color: "nexus.textMuted",
    },
  },
});

const badgeRecipe = defineRecipe({
  className: "chakra-badge",
  base: {
    borderRadius: "pill",
    textTransform: "none",
    fontFamily: "mono",
    fontSize: "10px",
    px: "2",
    py: "0.5",
    letterSpacing: "0.08em",
  },
  variants: {
    variant: {
      emeraldSubtle: {
        bg: "nexus.amberAlpha",
        color: "nexus.amberLight",
        borderWidth: "1px",
        borderColor: "rgba(216, 138, 26, 0.22)",
      },
      amberSubtle: {
        bg: "nexus.amberAlpha",
        color: "nexus.amberLight",
        borderWidth: "1px",
        borderColor: "rgba(216, 138, 26, 0.22)",
      },
    },
  },
});

const tableRecipe = defineSlotRecipe({
  className: "chakra-table",
  slots: ["root", "header", "body", "footer", "row", "cell", "columnHeader", "caption"],
  base: {
    root: {
      bg: "nexus.surfaceCard",
      color: "nexus.text",
      borderColor: "nexus.lineSoft",
    },
    cell: {
      borderColor: "nexus.lineSoft",
    },
    columnHeader: {
      color: "nexus.textMuted",
      borderColor: "nexus.lineSoft",
    },
    caption: {
      color: "nexus.textMuted",
    },
  },
  variants: {
    variant: {
      line: {
        root: {
          bg: "nexus.surfaceCard",
        },
        header: {
          bg: "nexus.bg2",
        },
        body: {
          bg: "nexus.surfaceCard",
        },
        row: {
          bg: "nexus.surfaceCard",
          _hover: {
            bg: "nexus.bg3",
          },
          _selected: {
            bg: "nexus.bg3",
          },
        },
        columnHeader: {
          borderBottomWidth: "1px",
          bg: "nexus.bg2",
        },
        cell: {
          borderBottomWidth: "1px",
        },
      },
      outline: {
        root: {
          bg: "nexus.surfaceCard",
          boxShadow: "0 0 0 1px {colors.border}",
        },
        header: {
          bg: "nexus.bg2",
        },
        body: {
          bg: "nexus.surfaceCard",
        },
        row: {
          bg: "nexus.surfaceCard",
          "&:not(:last-of-type)": {
            borderBottomWidth: "1px",
          },
          _hover: {
            bg: "nexus.bg3",
          },
        },
        columnHeader: {
          borderBottomWidth: "1px",
          bg: "nexus.bg2",
        },
        cell: {
          borderBottomWidth: "1px",
        },
      },
    },
  },
});

const drawerRecipe = defineSlotRecipe({
  className: "chakra-drawer",
  slots: ["backdrop", "positioner", "content", "header", "body", "footer"],
  base: {
    backdrop: {
      bg: "blackAlpha.800",
      backdropFilter: "blur(10px)",
    },
    positioner: {
      zIndex: 1500,
    },
    content: {
      bg: "nexus.bg2",
      color: "nexus.text",
      borderColor: "nexus.lineSoft",
      boxShadow: "panel",
    },
    header: {
      borderBottomWidth: "1px",
      borderColor: "nexus.lineSoft",
    },
    body: {
      color: "nexus.text",
    },
    footer: {
      borderTopWidth: "1px",
      borderColor: "nexus.lineSoft",
    },
  },
});

const popoverRecipe = defineSlotRecipe({
  className: "chakra-popover",
  slots: ["content", "body"],
  base: {
    content: {
      bg: "nexus.bg2",
      borderColor: "nexus.lineSoft",
      boxShadow: "panelSoft",
      borderRadius: "xl",
    },
    body: {
      p: 3,
    },
  },
});

const nexusConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        nexus: {
          obsidian: { value: brand.colors.bg0 },
          bg0: { value: brand.colors.bg0 },
          bg1: { value: brand.colors.bg1 },
          slate: { value: brand.colors.bg2 },
          bg2: { value: brand.colors.bg2 },
          slateLight: { value: brand.colors.bg3 },
          bg3: { value: brand.colors.bg3 },
          surfaceCard: { value: brand.surfaces.surfaceCard },
          line: { value: brand.colors.line },
          lineSoft: { value: brand.colors.lineSoft },
          text: { value: brand.colors.text },
          textMuted: { value: brand.colors.textMuted },
          textDim: { value: brand.colors.textDim },
          emerald: { value: brand.colors.amber },
          emeraldAlpha: { value: brand.colors.amberAlpha },
          cyberBg: { value: brand.colors.bg1 },
          amber: { value: brand.colors.amber },
          amberLight: { value: brand.colors.amberLight },
          amberDeep: { value: brand.colors.amberDeep },
          amberAlpha: { value: brand.colors.amberAlpha },
          amberGlow: { value: brand.colors.amberGlow },
          success: { value: brand.colors.success },
          warning: { value: brand.colors.warning },
          danger: { value: brand.colors.danger },
        },
        slate: {
          50: { value: "#f8fafc" },
          100: { value: "#f1f5f9" },
          200: { value: "#e2e8f0" },
          300: { value: "#cbd5e1" },
          400: { value: "#94a3b8" },
          500: { value: "#64748b" },
          600: { value: "#475569" },
          700: { value: "#334155" },
          800: { value: "#1e293b" },
          900: { value: "#0f172a" },
        },
      },
      fonts: {
        sans: { value: brand.fonts.sans },
        body: { value: brand.fonts.sans },
        heading: { value: brand.fonts.heading },
        mono: { value: brand.fonts.mono },
      },
      radii: {
        sharp: { value: "0px" },
        crisp: { value: brand.radii.crisp },
        panel: { value: brand.radii.panel },
        shell: { value: brand.radii.shell },
        pill: { value: brand.radii.pill },
      },
      shadows: {
        amberGlow: { value: brand.shadows.amberGlow },
        amberHalo: { value: brand.shadows.amberHalo },
        emeraldGlow: { value: brand.shadows.amberGlow },
        cyberGlow: { value: brand.shadows.panelSoft },
        panel: { value: brand.shadows.panel },
        panelSoft: { value: brand.shadows.panelSoft },
        inset: { value: brand.shadows.inset },
        focusRing: { value: brand.shadows.focusRing },
      },
    },
    recipes: {
      button: buttonRecipe,
      input: inputRecipe,
      badge: badgeRecipe,
      alert: alertRecipe,
      select: selectRecipe,
      nativeSelect: nativeSelectRecipe,
    },
    slotRecipes: {
      card: cardRecipe,
      table: tableRecipe,
      drawer: drawerRecipe,
      popover: popoverRecipe,
    },
  },
});

export const system = createSystem(defaultConfig, nexusConfig);
