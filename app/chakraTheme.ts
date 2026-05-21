import { createSystem, defineConfig, defaultConfig, defineRecipe, defineSlotRecipe } from "@chakra-ui/react";

const nexusConfig = defineConfig({
    theme: {
        // 1. 全域語意與基礎設計標記 (Design Tokens)
        tokens: {
            colors: {
                nexus: {
                    obsidian: { value: "#070913" },     // 主背景 (Obsidian Base)
                    slate: { value: "#101424" },        // 卡片背景 (Card Slate)
                    slateLight: { value: "#1e293b" },   // 次要背景
                    emerald: { value: "#10B981" },      // 強調色 (Volt Emerald)
                    emeraldAlpha: { value: "rgba(16, 185, 129, 0.1)" },
                    cyberBg: { value: "#030212" },      // 賽博模式背景
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
                crisp: { value: "12px" },   // Nexus 精緻圓角
                smooth: { value: "24px" },  // 舒適大圓角
            },
            shadows: {
                emeraldGlow: { value: "0 0 30px -5px rgba(16, 185, 129, 0.15)" },
                cyberGlow: { value: "0 0 30px -5px rgba(20, 184, 166, 0.15)" },
            }
        },

        // 2. 自訂元件樣式
        // 在 v3 中，元件樣式由傳統的 component overrides 改為「Recipes (食譜)」架構。
        recipes: {
            // 擴充 Button 元件樣式
            button: defineRecipe({
                className: "chakra-button",
                base: {
                    fontWeight: "bold",
                    transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                },
                variants: {
                    variant: {
                        nexusPrimary: {
                            bg: "linear-gradient(to r, {colors.nexus.emerald}, #14b8a6)",
                            color: "{colors.nexus.obsidian}",
                            fontSize: "xs",
                            boxShadow: "{shadows.emeraldGlow}",
                            _hover: {
                                opacity: 0.9,
                                transform: "scale(1.02)",
                            },
                            _active: {
                                transform: "scale(0.98)",
                            }
                        },
                        nexusOutline: {
                            bg: "transparent",
                            border: "1px solid",
                            borderColor: "whiteAlpha.200",
                            color: "{colors.slate.300}",
                            fontSize: "xs",
                            _hover: {
                                bg: "whiteAlpha.50",
                                borderColor: "whiteAlpha.300",
                            },
                        }
                    }
                }
            }),
            // 狀態微章 (Badge)
            badge: defineRecipe({
                className: "chakra-badge",
                base: {
                    textTransform: "none",
                    fontFamily: "{fonts.mono}",
                    fontSize: "10px",
                    px: "2",
                    py: "0.5",
                },
                variants: {
                    variant: {
                        emeraldSubtle: {
                            bg: "{colors.nexus.emeraldAlpha}",
                            color: "{colors.nexus.emerald}",
                            border: "1px solid",
                            borderColor: "rgba(16, 185, 129, 0.2)",
                        }
                    }
                }
            })
        },

        // 針對複合元件 (如 Card) 使用 slotRecipes
        slotRecipes: {
            card: defineSlotRecipe({
                className: "chakra-card",
                slots: ["root", "header", "body", "footer"],
                base: {
                    root: {
                        bg: "{colors.nexus.slate}",
                        borderColor: "whiteAlpha.50",
                        borderWidth: "1px",
                        borderRadius: "{radii.crisp}",
                        p: "5",
                        overflow: "hidden",
                        position: "relative",
                        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                        _hover: {
                            transform: "translateY(-2px)",
                            borderColor: "whiteAlpha.100",
                        },
                    }
                },
                variants: {
                    variant: {
                        light: {
                            root: {
                                bg: "white",
                                borderColor: "{colors.slate.200}",
                                boxShadow: "sm",
                            }
                        },
                        cyber: {
                            root: {
                                bg: "rgba(18, 14, 46, 0.4)",
                                borderColor: "teal.500/15",
                                boxShadow: "{shadows.cyberGlow}",
                            }
                        }
                    }
                }
            })
        }
    }
});

// 3. 合併預設配置並導出全新 System
export const system = createSystem(defaultConfig, nexusConfig);