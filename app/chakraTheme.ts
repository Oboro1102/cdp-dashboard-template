import {
  createSystem,
  defaultConfig,
  defineConfig,
  defineRecipe,
  defineSlotRecipe,
} from "@chakra-ui/react";

const buttonRecipe = defineRecipe({
  className: "chakra-button",
  base: {
    fontWeight: "semibold",
    borderRadius: "crisp",
    transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
  },
  variants: {
    variant: {
      nexusPrimary: {
        bg: "linear-gradient(90deg, var(--chakra-colors-nexus-emerald) 0%, #14b8a6 100%)",
        color: "nexus.obsidian",
        boxShadow: "emeraldGlow",
        _hover: {
          opacity: 0.92,
          transform: "translateY(-1px)",
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
        borderColor: "whiteAlpha.100",
        color: "slate.300",
        _hover: {
          bg: "whiteAlpha.50",
          borderColor: "whiteAlpha.200",
          color: "white",
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
      bg: "rgba(10, 14, 28, 0.92)",
      borderWidth: "1px",
      borderColor: "whiteAlpha.100",
      borderRadius: "crisp",
      boxShadow: "cyberGlow",
      color: "white",
      overflow: "hidden",
    },
    header: {
      borderBottomWidth: "1px",
      borderColor: "whiteAlpha.100",
    },
    footer: {
      borderTopWidth: "1px",
      borderColor: "whiteAlpha.100",
    },
  },
  variants: {
    variant: {
      cyber: {
        root: {
          bg: "rgba(8, 11, 22, 0.92)",
          borderColor: "rgba(16, 185, 129, 0.16)",
          boxShadow: "cyberGlow",
        },
      },
    },
  },
  defaultVariants: {
    variant: "cyber",
  },
});

const inputRecipe = defineRecipe({
  className: "chakra-input",
  base: {
    borderRadius: "crisp",
    bg: "nexus.obsidian",
    borderColor: "whiteAlpha.200",
    color: "white",
    _placeholder: {
      color: "slate.500",
    },
    _hover: {
      borderColor: "whiteAlpha.300",
    },
    _focusVisible: {
      borderColor: "nexus.emerald",
      boxShadow: "0 0 0 1px var(--chakra-colors-nexus-emerald)",
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
      bg: "nexus.obsidian",
      borderWidth: "1px",
      borderColor: "whiteAlpha.200",
      color: "white",
      cursor: "pointer",
      _hover: {
        borderColor: "whiteAlpha.300",
      },
      _focusVisible: {
        borderColor: "nexus.emerald",
        boxShadow: "0 0 0 1px var(--chakra-colors-nexus-emerald)",
      },
      _disabled: {
        opacity: 0.55,
        cursor: "not-allowed",
      },
    },
    indicator: {
      color: "slate.400",
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
      color: "slate.400",
      fontSize: "sm",
      marginBottom: "2",
    },
    control: {
      width: "full",
    },
    trigger: {
      width: "full",
      borderRadius: "crisp",
      bg: "nexus.obsidian",
      borderWidth: "1px",
      borderColor: "whiteAlpha.200",
      color: "white",
      _hover: {
        borderColor: "whiteAlpha.300",
        bg: "nexus.slate",
      },
      _focusVisible: {
        borderColor: "nexus.emerald",
        boxShadow: "0 0 0 1px var(--chakra-colors-nexus-emerald)",
      },
    },
    valueText: {
      color: "slate.200",
    },
    indicatorGroup: {
      color: "slate.400",
    },
    indicator: {
      color: "slate.400",
    },
    positioner: {
      zIndex: 1400,
    },
    content: {
      bg: "nexus.slate",
      borderWidth: "1px",
      borderColor: "whiteAlpha.200",
      borderRadius: "crisp",
      boxShadow: "cyberGlow",
      p: 1,
      color: "slate.200",
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
      color: "slate.200",
      borderRadius: "10px",
      _highlighted: {
        bg: "whiteAlpha.100",
        color: "white",
      },
      _selected: {
        bg: "nexus.emeraldAlpha",
        color: "nexus.emerald",
      },
    },
    itemText: {
      color: "inherit",
      flex: 1,
    },
    itemIndicator: {
      color: "nexus.emerald",
    },
    itemGroupLabel: {
      color: "slate.400",
    },
    clearTrigger: {
      color: "slate.400",
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
      borderColor: "whiteAlpha.100",
      bg: "rgba(8, 11, 22, 0.92)",
      boxShadow: "cyberGlow",
    },
    indicator: {
      alignSelf: "flex-start",
      marginTop: "1",
    },
    content: {
      color: "white",
    },
    title: {
      fontWeight: "semibold",
    },
    description: {
      color: "slate.300",
    },
  },
});

const badgeRecipe = defineRecipe({
  className: "chakra-badge",
  base: {
    borderRadius: "full",
    textTransform: "none",
    fontFamily: "mono",
    fontSize: "10px",
    px: "2",
    py: "0.5",
    letterSpacing: "0.04em",
  },
  variants: {
    variant: {
      emeraldSubtle: {
        bg: "nexus.emeraldAlpha",
        color: "nexus.emerald",
        borderWidth: "1px",
        borderColor: "rgba(16, 185, 129, 0.2)",
      },
    },
  },
});

const tableRecipe = defineSlotRecipe({
  className: "chakra-table",
  slots: ["root", "header", "body", "footer", "row", "cell", "columnHeader", "caption"],
  base: {
    root: {
      color: "slate.200",
      borderColor: "whiteAlpha.100",
    },
    header: {
      bg: "transparent",
    },
    row: {
      bg: "transparent",
      _hover: {
        bg: "whiteAlpha.50",
      },
    },
    cell: {
      borderColor: "whiteAlpha.50",
    },
    columnHeader: {
      color: "slate.400",
      borderColor: "whiteAlpha.100",
    },
    caption: {
      color: "slate.400",
    },
  },
});

const drawerRecipe = defineSlotRecipe({
  className: "chakra-drawer",
  slots: ["backdrop", "positioner", "content", "header", "body", "footer"],
  base: {
    backdrop: {
      bg: "blackAlpha.800",
      backdropFilter: "blur(4px)",
    },
    positioner: {
      zIndex: 1500,
    },
    content: {
      bg: "nexus.slate",
      color: "white",
      borderColor: "whiteAlpha.100",
      boxShadow: "cyberGlow",
    },
    header: {
      borderBottomWidth: "1px",
      borderColor: "whiteAlpha.100",
    },
    body: {
      color: "white",
    },
    footer: {
      borderTopWidth: "1px",
      borderColor: "whiteAlpha.100",
    },
  },
});

const popoverRecipe = defineSlotRecipe({
  className: "chakra-popover",
  slots: ["content", "body"],
  base: {
    content: {
      bg: "nexus.slate",
      borderColor: "whiteAlpha.100",
      boxShadow: "xl",
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
          obsidian: { value: "#070913" },
          slate: { value: "#101424" },
          slateLight: { value: "#1e293b" },
          emerald: { value: "#10B981" },
          emeraldAlpha: { value: "rgba(16, 185, 129, 0.1)" },
          cyberBg: { value: "#030212" },
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
        sans: { value: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif" },
        body: { value: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif" },
        heading: { value: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif" },
        mono: { value: "'JetBrains Mono', monospace" },
      },
      radii: {
        sharp: { value: "0px" },
        crisp: { value: "12px" },
        smooth: { value: "24px" },
      },
      shadows: {
        emeraldGlow: { value: "0 0 30px -5px rgba(16, 185, 129, 0.15)" },
        cyberGlow: { value: "0 0 30px -5px rgba(20, 184, 166, 0.15)" },
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
