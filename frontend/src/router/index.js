import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
    {
        path: '/login',
        component: () => import('@/views/auth/LoginView.vue'),
        meta: { layout: 'auth' },
    },
    {
        path: '/auth/callback',
        component: () => import('@/views/auth/CallbackView.vue'),
        meta: { layout: 'auth' },
    },
    {
        path: '/dashboard',
        component: () => import('@/views/dashboard/DashboardView.vue'),
        meta: { requiresAuth: true, layout: 'dashboard' },
    },
    {
        path: '/users',
        component: () => import('@/views/users/UsersView.vue'),
        meta: { requiresAuth: true, requiresPermission: 'view users', layout: 'dashboard' },
    },
    {
        path: '/roles',
        component: () => import('@/views/roles/RolesView.vue'),
        meta: { requiresAuth: true, requiresPermission: 'view roles', layout: 'dashboard' },
    },
    {
        path: '/settings',
        component: () => import('@/views/settings/SettingsView.vue'),
        meta: { requiresAuth: true, requiresPermission: 'view settings', layout: 'dashboard' },
    },
    {
        path: '/debug',
        component: () => import('@/views/DebugPage.vue'),
        meta: { requiresAuth: true, layout: 'dashboard' },
    },
    {
        path: '/',
        redirect: '/dashboard',
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/dashboard',
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach(async (to, from, next) => {
    const auth = useAuthStore()

    // Initialize user from backend if token exists but user data is missing
    if (auth.token && !auth.user) {
        try {
            await auth.fetchMe()
        } catch (error) {
            auth.setToken(null)
        }
    }

    // Check if route requires authentication
    if (to.meta.requiresAuth && !auth.isAuthenticated) {
        return next('/login')
    }

    // Check if route requires specific permission
    if (to.meta.requiresPermission) {
        if (!auth.userPermissions.includes(to.meta.requiresPermission)) {
            return next('/dashboard')
        }
    }

    // Redirect to dashboard if already authenticated and going to login
    if (to.path === '/login' && auth.isAuthenticated) {
        return next('/dashboard')
    }

    next()
})

export default router
