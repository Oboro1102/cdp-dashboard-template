import {
  createSystem,
  defaultConfig,
  defineConfig,
  defineRecipe,
  defineSlotRecipe,
} from "@chakra-ui/react";

/**
 * 核心品牌視覺 Token 設定
 * 採用 Premium Dark Tech 語彙，底色更為深邃，搭配高飽和琥珀金與極客青雙主色。
 */
export const brand = {
  colors: {
    // 頁面背景底色系列
    bg0: "#090a0f", // 極致黑曜石背景 (底層)
    bg1: "#111420", // 卡片與工作區背景
    bg2: "#161a29", // 懸浮面板、下拉選單
    bg3: "#1f2438", // 作用中、懸浮高亮區

    // 精緻線條系列 (符合極細微光與高透光質感)
    line: "rgba(255, 255, 255, 0.08)",
    lineSoft: "rgba(255, 255, 255, 0.05)",

    // 文字層級體系
    text: "#f3f4f6", // 高對比主文字
    textMuted: "#a1a1aa", // 次要說明文字
    textDim: "#52525b", // 停用、暗化標籤

    // 核心雙主色 1：琥珀金 (Amber Gold)
    amber: "#ff9f1c",
    amberLight: "#ffb74d",
    amberDeep: "#e65100",
    amberAlpha: "rgba(255, 159, 28, 0.12)",
    amberGlow: "rgba(255, 159, 28, 0.24)",

    // 核心雙主色 2：極客青 (Teal Blue)
    teal: "#00f5d4",
    tealLight: "#64ffda",
    tealDeep: "#00bfa5",
    tealAlpha: "rgba(0, 245, 212, 0.12)",
    tealGlow: "rgba(0, 245, 212, 0.24)",

    // 狀態語意色
    success: "#10b981", // 翡翠綠
    warning: "#f59e0b",
    danger: "#ef4444", // 珊瑚紅
  },
  radii: {
    crisp: "12px", // 輸入框、小按鈕
    panel: "16px", // 標準卡片、彈出視窗
    shell: "24px", // 大型總覽區、外殼
    pill: "999px", // 分段控制器、膠囊按鈕
  },
  shadows: {
    panel: "0 8px 24px rgba(0, 0, 0, 0.12)",
    panelSoft: "0 4px 12px rgba(0, 0, 0, 0.06)",

    // 霓虹邊際折射光優化：透過「物理暗部遮蔽核心」+「雙層柔和色散」來達到自然的融合度，避免產生浮躁的噴漆感。
    amberGlow: "0 4px 12px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 159, 28, 0.12), 0 0 0 1px rgba(255, 159, 28, 0.08)",
    amberHalo: "0 16px 40px rgba(0, 0, 0, 0.6), 0 2px 8px rgba(255, 159, 28, 0.15), 0 12px 32px rgba(255, 159, 28, 0.08), 0 0 0 1px rgba(255, 159, 28, 0.2)",

    tealGlow: "0 4px 12px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 245, 212, 0.12), 0 0 0 1px rgba(0, 245, 212, 0.08)",
    tealHalo: "0 16px 40px rgba(0, 0, 0, 0.6), 0 2px 8px rgba(0, 245, 212, 0.15), 0 12px 32px rgba(0, 245, 212, 0.08), 0 0 0 1px rgba(0, 245, 212, 0.2)",

    inset: "inset 0 1px 0 rgba(255, 255, 255, 0.05), inset 0 -1px 0 rgba(0, 0, 0, 0.24)",
    focusRing: "0 0 0 1px rgba(255, 159, 28, 0.4), 0 0 0 5px rgba(255, 159, 28, 0.12)",
  },
  motion: {
    soft: "cubic-bezier(0.16, 1, 0.3, 1)",
    premium: "cubic-bezier(0.32, 0.72, 0, 1)",
  },
  surfaces: {
    glass: "rgba(17, 20, 32, 0.85)",
    glassStrong: "rgba(9, 10, 15, 0.95)",
    surfaceCard: "rgba(17, 20, 32, 0.98)",
    surfaceElevated: "rgba(22, 26, 41, 0.98)",
    overlay: "rgba(4, 5, 10, 0.85)",
    heroGlow: "rgba(255, 159, 28, 0.06)",
    heroGlowSoft: "rgba(255, 159, 28, 0.04)",
    bgDeepSoft: "rgba(9, 10, 15, 0.60)",
    amberHover: "rgba(255, 159, 28, 0.04)",
    amberHoverStrong: "rgba(255, 159, 28, 0.08)",
    tealHover: "rgba(0, 245, 212, 0.04)",
    tealHoverStrong: "rgba(0, 245, 212, 0.08)",
    successSoft: "rgba(16, 185, 129, 0.12)",
    dangerSoft: "rgba(239, 68, 68, 0.12)",
    dangerHover: "rgba(239, 68, 68, 0.08)",
    dangerHoverStrong: "rgba(239, 68, 68, 0.12)",
    mutedSoft: "rgba(161, 161, 170, 0.12)",
    chartGrid: "rgba(255, 255, 255, 0.04)",
    chartCursor: "rgba(255, 159, 28, 0.06)",
  },
  fonts: {
    sans: "'TASA Explorer', 'Noto Sans TC', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    heading: "'TASA Explorer', 'Noto Sans TC', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  },
} as const;

/**
 * 按鈕元件配方 (Button Recipe)
 * 重新定義琥珀金與極客青按鈕的高保真動態回饋
 */
const buttonRecipe = defineRecipe({
  className: "chakra-button",
  base: {
    fontWeight: "semibold",
    borderRadius: "pill",
    transition:
      "transform 220ms cubic-bezier(0.16, 1, 0.3, 1), background-color 220ms cubic-bezier(0.16, 1, 0.3, 1), border-color 220ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 220ms cubic-bezier(0.16, 1, 0.3, 1)",
    _active: {
      transform: "scale(0.975)", // 輕微按壓物理反饋
    },
  },
  variants: {
    variant: {
      // 琥珀金主按鈕
      nexusPrimary: {
        bg: "linear-gradient(90deg, #d88a1a 0%, #ff9f1c 50%, #ffb74d 100%)",
        backgroundColor: "nexus.amber",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
        color: "nexus.bg0",
        boxShadow: "amberGlow",
        _hover: {
          opacity: 0.95,
          boxShadow: "amberHalo",
        },
        _disabled: {
          opacity: 0.4,
          transform: "none",
        },
      },
      // 極客青主按鈕 (雙頁配置時供特定操作搭配使用)
      nexusTeal: {
        bg: "linear-gradient(90deg, #00bfa5 0%, #00f5d4 50%, #64ffda 100%)",
        backgroundColor: "nexus.teal",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
        color: "nexus.bg0",
        boxShadow: "tealGlow",
        _hover: {
          opacity: 0.95,
          boxShadow: "tealHalo",
        },
        _disabled: {
          opacity: 0.4,
          transform: "none",
        },
      },
      // 科技感外框按鈕
      nexusOutline: {
        bg: "transparent",
        borderWidth: "1px",
        borderColor: "nexus.line",
        color: "nexus.textMuted",
        _hover: {
          bg: "nexus.amberAlpha",
          borderColor: "nexus.amber",
          color: "nexus.text",
        },
        _disabled: {
          opacity: 0.4,
        },
      },
    },
  },
  defaultVariants: {
    variant: "nexusPrimary",
  },
});

/**
 * 卡片元件多插槽配方 (Card Slot Recipe)
 * 建立細緻的毛玻璃與高質感投影容器
 */
const cardRecipe = defineSlotRecipe({
  className: "chakra-card",
  slots: ["root", "header", "body", "footer"],
  base: {
    root: {
      borderWidth: "1px",
      borderColor: "nexus.lineSoft",
      borderRadius: "panel",
      color: "nexus.text",
      overflow: "hidden",
      backdropFilter: "blur(20px)",
    },
    header: {
      borderBottomWidth: "1px",
      borderColor: "nexus.lineSoft",
      p: 5,
    },
    body: {
      p: 5,
    },
    footer: {
      borderTopWidth: "1px",
      borderColor: "nexus.lineSoft",
      p: 5,
    },
  },
  variants: {
    variant: {
      nexusSurface: {
        root: {
          bg: "nexus.surfaceCard",
          boxShadow: "panel",
        },
      },
    },
  },
  defaultVariants: {
    variant: "nexusSurface",
  },
});

/**
 * 輸入框配方 (Input Recipe)
 */
const inputRecipe = defineRecipe({
  className: "chakra-input",
  base: {
    borderRadius: "crisp",
    bg: "nexus.bg1",
    borderWidth: "1px",
    borderColor: "nexus.lineSoft",
    color: "nexus.text",
    px: 4,
    py: 2.5,
    transition: "border-color 200ms ease, box-shadow 200ms ease",
    _placeholder: {
      color: "nexus.textDim",
    },
    _hover: {
      borderColor: "nexus.line",
    },
    _focusVisible: {
      borderColor: "nexus.amber",
      boxShadow: "focusRing",
      outline: "none",
    },
    _disabled: {
      opacity: 0.55,
      cursor: "not-allowed",
    },
  },
});

/**
 * 下拉選單配方 (Select Slot Recipe)
 */
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
      borderStyle: "solid",
      borderColor: "nexus.lineSoft",
      color: "nexus.text",
      px: 4,
      py: 2.5,
      _hover: {
        borderColor: "nexus.line",
        bg: "nexus.bg2",
      },
      _focusVisible: {
        borderColor: "nexus.amber",
        boxShadow: "focusRing",
        outline: "none",
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
      bg: "nexus.bg2",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "nexus.lineSoft",
      borderRadius: "crisp",
      boxShadow: "panelSoft",
      p: 1.5,
      color: "nexus.text",
    },
    list: {
      bg: "transparent",
      gap: 1,
    },
    item: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 2,
      width: "full",
      px: 3,
      py: 2,
      color: "nexus.text",
      bg: "transparent",
      borderRadius: "10px",
      transition: "background-color 160ms ease, color 160ms ease",
      _hover: {
        background: "nexus.bg3",
        color: "nexus.text",
      },
      _highlighted: {
        background: "nexus.bg3",
        color: "nexus.text",
      },
      _selected: {
        background: "rgba(255, 159, 28, 0.14)",
        color: "nexus.amberLight",
        boxShadow: "inset",
        _highlighted: {
          background: "rgba(255, 159, 28, 0.18)",
        },
      },
    },
    itemText: {
      color: "nexus.text",
      flex: 1,
    },
    itemIndicator: {
      color: "nexus.amberLight",
    },
    itemGroupLabel: {
      color: "nexus.textDim",
      px: 3,
      py: 1.5,
    },
    clearTrigger: {
      color: "nexus.textDim",
    },
  },
});

/**
 * 警示框配方 (Alert Recipe)
 */
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
      p: 4,
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

/**
 * 徽章配方 (Badge Recipe)
 */
const badgeRecipe = defineRecipe({
  className: "chakra-badge",
  base: {
    borderRadius: "pill",
    textTransform: "none",
    fontSize: "xs",
    px: '2.5',
    py: "0.5",
  },
  variants: {
    variant: {
      emeraldSubtle: {
        bg: "nexus.amberAlpha",
        color: "nexus.amberLight",
        borderWidth: "1px",
        borderColor: "rgba(255, 159, 28, 0.22)",
      },
      tealSubtle: {
        bg: "nexus.tealAlpha",
        color: "nexus.tealLight",
        borderWidth: "1px",
        borderColor: "rgba(0, 245, 212, 0.22)",
      },
    },
  },
});

/**
 * 表格配方 (Table Recipe)
 */
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
      px: 4,
      py: 3.5,
    },
    columnHeader: {
      color: "nexus.textMuted",
      borderColor: "nexus.lineSoft",
      px: 4,
      py: 3,
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
          transition: "background-color 150ms ease",
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
/**
 * 系統配置聚合與整合
 */
const nexusConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        nexus: {
          bg0: { value: brand.colors.bg0 },
          bg1: { value: brand.colors.bg1 },
          bg2: { value: brand.colors.bg2 },
          bg3: { value: brand.colors.bg3 },
          surfaceCard: { value: brand.surfaces.surfaceCard },
          surfaceElevated: { value: brand.surfaces.surfaceElevated },
          glass: { value: brand.surfaces.glass },
          glassStrong: { value: brand.surfaces.glassStrong },
          overlay: { value: brand.surfaces.overlay },
          heroGlow: { value: brand.surfaces.heroGlow },
          heroGlowSoft: { value: brand.surfaces.heroGlowSoft },
          bgDeepSoft: { value: brand.surfaces.bgDeepSoft },
          amberHover: { value: brand.surfaces.amberHover },
          amberHoverStrong: { value: brand.surfaces.amberHoverStrong },
          tealHover: { value: brand.surfaces.tealHover },
          tealHoverStrong: { value: brand.surfaces.tealHoverStrong },
          successSoft: { value: brand.surfaces.successSoft },
          dangerSoft: { value: brand.surfaces.dangerSoft },
          dangerHover: { value: brand.surfaces.dangerHover },
          dangerHoverStrong: { value: brand.surfaces.dangerHoverStrong },
          mutedSoft: { value: brand.surfaces.mutedSoft },
          chartGrid: { value: brand.surfaces.chartGrid },
          chartCursor: { value: brand.surfaces.chartCursor },
          line: { value: brand.colors.line },
          lineSoft: { value: brand.colors.lineSoft },
          text: { value: brand.colors.text },
          textMuted: { value: brand.colors.textMuted },
          textDim: { value: brand.colors.textDim },
          amber: { value: brand.colors.amber },
          amberLight: { value: brand.colors.amberLight },
          amberDeep: { value: brand.colors.amberDeep },
          amberAlpha: { value: brand.colors.amberAlpha },
          amberGlow: { value: brand.colors.amberGlow },
          teal: { value: brand.colors.teal },
          tealLight: { value: brand.colors.tealLight },
          tealDeep: { value: brand.colors.tealDeep },
          tealAlpha: { value: brand.colors.tealAlpha },
          tealGlow: { value: brand.colors.tealGlow },
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
        tealGlow: { value: brand.shadows.tealGlow },
        tealHalo: { value: brand.shadows.tealHalo },
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
    },
    slotRecipes: {
      card: cardRecipe,
      table: tableRecipe,
      select: selectRecipe,
      drawer: drawerRecipe,
      popover: popoverRecipe,
    },
  },
});

export const system = createSystem(defaultConfig, nexusConfig);