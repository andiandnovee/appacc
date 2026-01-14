import {
    LayoutDashboardIcon,
    UserIcon,
    UsersRoundIcon,
    WalletCardsIcon,
    ReceiptIcon,
    ArrowUpDownIcon,
    FileBarChartIcon,
    ArrowDownCircleIcon,
    ArrowUpCircleIcon,
    ActivityIcon,
    ShieldIcon,
    AlbumIcon,
    ListChecksIcon,
    BookOpenIcon
} from 'lucide-vue-next'

export const menuItems = [
    {
        group: 'Anggota',
        children: [
            {
                name: 'Dashboard',
                route: '/dashboard',
                icon: LayoutDashboardIcon,
                permissions: []
            },
            {
                name: 'Profil Saya',
                route: '/anggota-saya',
                icon: UserIcon,
                permissions: ['AnggotaSelf.View', 'KeluargaSelf.View']
            }
        ]
    },

    {
        group: 'Bendahara',
        children: [
            {
                name: 'Referensi Iuran',
                route: '/ref-iuran',
                icon: ListChecksIcon,
                permissions: ['RefIuran.View', 'RefIuran.Manage']
            },
            {
                name: 'Iuran Anggota',
                route: '/iuran/anggota',
                icon: ReceiptIcon,
                permissions: ['Iuran.View', 'Iuran.Manage']
            },
            {
                name: 'Daftar Akun',
                route: '/accounting/accounts',
                icon: BookOpenIcon,
                permissions: ['Account.View', 'Account.Manage']
            },
            {
                name: 'Jurnal',
                route: '/accounting/journal',
                icon: BookOpenIcon,
                permissions: ['Account.View']
            },
            {
                name: 'Terima Setoran',
                route: '/bendahara/terima-setoran',
                icon: ArrowDownCircleIcon,
                permissions: ['Kas.View', 'Kas.Manage']
            },
            {
                name: 'Posisi Kas',
                route: '/bendahara/kas-position',
                icon: WalletCardsIcon,
                permissions: ['Kas.View']
            },
            {
                name: 'Laporan Keuangan',
                route: '/laporan-kas',
                icon: FileBarChartIcon,
                permissions: ['Laporan.View', 'Kas.View']
            }
        ]
    },

    {
        group: 'Kasir',
        children: [
            {
                name: 'Kas Masuk',
                route: '/kas/masuk',
                icon: ArrowDownCircleIcon,
                permissions: ['Kas.View', 'Kas.Manage']
            },
            {
                name: 'Kas Keluar',
                route: '/kas/keluar',
                icon: ArrowUpCircleIcon,
                permissions: ['Kas.View', 'Kas.Manage']
            }
        ]
    },

    {
        group: 'Sekretariat',
        children: [
            {
                name: 'Request Anggota',
                route: '/anggota-requests',
                icon: UsersRoundIcon,
                permissions: ['Anggota.Manage']
            },

            {
                name: 'Data Anggota',
                route: '/anggota',
                icon: UsersRoundIcon,
                permissions: ['Anggota.View', 'Keluarga.View']
            }
        ]
    },

    {
        group: 'Kolektor',
        children: [
            {
                name: 'Terima Iuran',
                route: '/terima-iuran',
                icon: ArrowDownCircleIcon,
                permissions: ['IuranSetor.View']
            },
            {
                name: 'Setor ke bendahara',
                route: '/setor-iuran',
                icon: ArrowUpCircleIcon,
                permissions: ['IuranSetor.View']
            }
        ]
    },

    {
        group: 'Ketua',
        children: [
            {
                name: 'Monitoring',
                route: '/ketua/monitoring',
                icon: ActivityIcon,
                permissions: ['Monitoring.View', 'AssignRole.View']
            }
        ]
    },

    {
        group: 'Administrasi',
        children: [
            {
                name: 'Manajemen Peran',
                route: '/assign-role',
                icon: ShieldIcon,
                permissions: ['AssignRole.View', 'AssignRole.Manage']
            }
        ]
    }
]
