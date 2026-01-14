import { defineStore } from "pinia"


export const useUiStore = defineStore("ui", {
    state: () => ({
        layoutMode: localStorage.getItem("layoutMode") || "sidebar",
        sidebarCollapsed: true,
        sidebarLocked: false,
        mobileSidebarOpen: false,
        mobileTopbarMenuOpen: false,

    }),
    actions: {
        setLayoutMode(mode) {
            this.layoutMode = mode
            localStorage.setItem("layoutMode", mode)
        },
        toggleLayout() {
            this.layoutMode =
                this.layoutMode === "sidebar" ? "topbar" : "sidebar"
            localStorage.setItem("layoutMode", this.layoutMode)
        }
    }
})
