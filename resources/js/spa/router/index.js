// resources/js/spa/router/index.js

if (typeof window !== 'undefined') {
  window.isProcessingCallback = false
}

import { createRouter, createWebHistory } from 'vue-router'
import api from '@/utils/axios'
import RefIuranIndex from '@/Pages/RefIuran/Index.vue'
import IuranSaya from '@/Pages/Iuran/IuranSaya.vue'
import IuranAnggotaList from '@/Pages/Iuran/IuranAnggotaList.vue'
import IuranAnggota from '@/Pages/Iuran/IuranAnggota.vue'

import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: () => import('@/Pages/Landing/Guest.vue'),
    meta: { requiresAuth: false },
  },

  {
    path: '/auth/callback',
    name: 'auth.callback',
    component: () => import('@/Pages/Auth/GoogleCallback.vue'),
    meta: { requiresAuth: false, skipAuthCheck: true },
  },

  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/Pages/Dashboard.vue'),
    meta: { requiresAuth: true },
  },

  {
    path: '/ref-iuran',
    name: 'ref-iuran.index',
    component: RefIuranIndex,
    meta: { requiresAuth: true },
  },

  {
    path: '/ref-iuran/create',
    name: 'ref-iuran.create',
    component: () => import('@/Pages/RefIuran/CreateEdit.vue'),
    meta: { requiresAuth: true },
  },

  {
    path: '/ref-iuran/:id/edit',
    name: 'ref-iuran.edit',
    component: () => import('@/Pages/RefIuran/CreateEdit.vue'),
    meta: { requiresAuth: true },
  },

  {
    path: '/anggota',
    name: 'anggota.index',
    component: () => import('@/Pages/Anggota/Index.vue'),
    meta: { requiresAuth: true },
  },

  {
    path: '/anggota/:id',
    name: 'anggota.show',
    component: () => import('@/Pages/Anggota/Show.vue'),
    meta: { requiresAuth: true },
  },

  {
    path: '/anggota/:id/edit',
    name: 'anggota.edit',
    component: () => import('@/Pages/Anggota/Edit.vue'),
    meta: { requiresAuth: true },
  },

  {
    path: '/anggota-saya',
    name: 'anggota.saya',
    component: () => import('@/Pages/Anggota/Show.vue'),
    meta: { requiresAuth: true },
  },

  {
    path: '/iuran-saya',
    name: 'iuran.saya',
    component: IuranSaya,
    meta: { requiresAuth: true },
  },

  {
    path: '/iuran/anggota',
    name: 'iuran.anggota.index',
    component: IuranAnggotaList,
    meta: { requiresAuth: true },
  },

  {
    path: '/iuran/anggota/:anggotaId',
    name: 'iuran.anggota.show',
    component: IuranAnggota,
    meta: { requiresAuth: true },
  },

  {
    path: '/terima-iuran',
    name: 'kolektor.terima-iuran',
    component: () => import('@/Pages/Kolektor/TerimaIuran.vue'),
    meta: { requiresAuth: true },
  },

  {
    path: '/setor-iuran',
    name: 'kolektor.setor-iuran',
    component: () => import('@/Pages/Kolektor/SetorIuran.vue'),
    meta: { requiresAuth: true },
  },

  {
    path: '/bendahara/terima-setoran',
    name: 'bendahara.terima-setoran',
    component: () => import('@/Pages/Bendahara/TerimaSetoran.vue'),
    meta: { requiresAuth: true },
  },

  {
    path: '/kas/masuk',
    name: 'kas.masuk',
    component: () => import('@/Pages/Kasir/KasMasuk.vue'),
    meta: { requiresAuth: true },
  },

  {
    path: '/kas/keluar',
    name: 'kas.keluar',
    component: () => import('@/Pages/Kasir/KasKeluar.vue'),
    meta: { requiresAuth: true },
  },

  {
    path: '/bendahara/kas-position',
    name: 'bendahara.kas-position',
    component: () => import('@/Pages/Bendahara/KasPosition.vue'),
    meta: { requiresAuth: true },
  },

  {
    path: '/anggota-requests',
    name: 'anggota-requests.index',
    component: () => import('@/Pages/Anggota/AnggotaRequests.vue'),
    meta: { requiresAuth: true },
  },

  {
    path: '/assign-role',
    name: 'admin.assign-role',
    component: () => import('@/Pages/Admin/AssignRole.vue'),
    meta: { requiresAuth: true },
  },

  // Accounting - Accounts
  {
    path: '/accounting/accounts',
    name: 'accounting.accounts.index',
    component: () => import('@/Pages/Accounting/Accounts/Index.vue'),
    meta: { requiresAuth: true },
  },

  {
    path: '/accounting/accounts/create',
    name: 'accounting.accounts.create',
    component: () => import('@/Pages/Accounting/Accounts/CreateEdit.vue'),
    meta: { requiresAuth: true },
  },

  {
    path: '/accounting/accounts/:id',
    name: 'accounting.accounts.show',
    component: () => import('@/Pages/Accounting/Accounts/Show.vue'),
    meta: { requiresAuth: true },
  },

  {
    path: '/accounting/accounts/:id/edit',
    name: 'accounting.accounts.edit',
    component: () => import('@/Pages/Accounting/Accounts/CreateEdit.vue'),
    meta: { requiresAuth: true },
  },

  // Accounting - Journal
  {
    path: '/accounting/journal',
    name: 'accounting.journal.index',
    component: () => import('@/Pages/Accounting/Journal/Index.vue'),
    meta: { requiresAuth: true },
  },

  {
    path: '/accounting/journal/:id',
    name: 'accounting.journal.show',
    component: () => import('@/Pages/Accounting/Journal/Show.vue'),
    meta: { requiresAuth: true },
  }


]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()
  const token = localStorage.getItem('bskm_token')

  if (window.isProcessingCallback || to.meta.skipAuthCheck) {
    return next()
  }

  // Jika user logout (token hilang), pastikan auth state juga clear
  if (!token && auth.isAuthenticated) {
    auth.clearAuth()
  }

  // Belum login → tidak boleh akses protected route
  if (to.meta.requiresAuth && !token) {
    return next({ name: 'Landing' })
  }

  // Sudah login → jangan ke halaman Landing
  if (to.name === 'Landing' && token) {
    return next({ name: 'Dashboard' })
  }

  // Ambil token ke store
  if (token) {
    auth.initFromStorage()

    // Validasi token masih valid
    if (to.meta.requiresAuth && !auth.isAuthenticated) {
      return next({ name: 'Landing' })
    }

    // Fetch user hanya sekali
    if (!auth.loaded) {
      try {
        await auth.fetchUser()
      } catch (e) {
        auth.clearAuth()
        localStorage.removeItem('bskm_token')
        return next({ name: 'Landing' })
      }
    }
  }

  next()
})



export default router
