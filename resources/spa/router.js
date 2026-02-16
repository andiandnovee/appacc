import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from './pages/Dashboard.vue'
import Components from './pages/Components.vue'
import Analytics from './pages/Analytics.vue'
import Reports from './pages/Reports.vue'
import Users from './pages/Users.vue'
import Permissions from './pages/Permissions.vue'
import Settings from './pages/Settings.vue'
import Profile from './pages/Profile.vue'
import NotFound from './pages/NotFound.vue'

const routes = [
    {
        path: '/',
        redirect: '/dashboard'
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard
    },
    {
        path: '/components',
        name: 'Components',
        component: Components
    },
    {
        path: '/analytics',
        name: 'Analytics',
        component: Analytics
    },
    {
        path: '/reports',
        name: 'Reports',
        component: Reports
    },
    {
        path: '/users',
        name: 'Users',
        component: Users
    },
    {
        path: '/permissions',
        name: 'Permissions',
        component: Permissions
    },
    {
        path: '/settings',
        name: 'Settings',
        component: Settings
    },
    {
        path: '/profile',
        name: 'Profile',
        component: Profile
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router
