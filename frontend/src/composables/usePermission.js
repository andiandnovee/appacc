import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

export function usePermission() {
    const auth = useAuthStore()

    const hasPermission = (permission) => {
        return auth.userPermissions.includes(permission)
    }

    const hasRole = (role) => {
        return auth.userRoles.includes(role)
    }

    const hasAnyPermission = (permissions) => {
        if (Array.isArray(permissions)) {
            return permissions.some((p) => auth.userPermissions.includes(p))
        }
        return false
    }

    const hasAllPermissions = (permissions) => {
        if (Array.isArray(permissions)) {
            return permissions.every((p) => auth.userPermissions.includes(p))
        }
        return false
    }

    return {
        hasPermission,
        hasRole,
        hasAnyPermission,
        hasAllPermissions,
    }
}
