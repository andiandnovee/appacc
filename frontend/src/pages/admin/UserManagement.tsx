import { FC, ReactNode, ReactElement, useState, useEffect, useCallback } from 'react'
import Tabs from '../../components/ui/Tabs'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { Avatar } from '../../components/ui/Avatar'
import Input from '../../components/ui/Input'
import Pagination from '../../components/ui/Pagination'
import EmptyState from '../../components/ui/EmptyState'
import { useToast } from '../../components/ui/Toast'
import { Users, KeyRound, ShieldCheck, Trash2, Pencil } from 'lucide-react'
import styles from './UserManagement.module.css'

interface UserManagementProps {
  user?: any
  allRoles?: any
  onClose?: any
  onSaved?: any
}


// ─── API helper ───────────────────────────────────────────────
const api = (path, options = {}) => {
  const token =
    localStorage.getItem('appacc_token') ??
    sessionStorage.getItem('appacc_token')
  return fetch(`/api/admin${path}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    ...options,
  }).then((r) => {
    if (!r.ok) throw new Error(r.statusText)
    return r.json()
  })
}

// ─── Role → Badge variant mapping ─────────────────────────────
const roleVariant = (role) => {
  const map = {
    superadmin: 'danger',
    admin:      'warning',
    manager:    'primary',
    staff:      'success',
    viewer:     'default',
  }
  return map[role] ?? 'default'
}

// ─── Assign Role Modal ────────────────────────────────────────
function AssignRoleModal({ user, allRoles, onClose, onSaved }) {
  const [selected, setSelected] = useState([...user.roles])
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  const toggle = (role) =>
    setSelected((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    )

  const handleSave = async () => {
    if (selected.length === 0) { setError('Pilih minimal satu role.'); return }
    setLoading(true); setError(null)
    try {
      const res = await api(`/users/${user.id}/roles`, {
        method: 'PUT',
        body: JSON.stringify({ roles: selected }),
      })
      onSaved(res.data)
    } catch { setError('Gagal menyimpan. Coba lagi.') }
    finally { setLoading(false) }
  }

  return (
    <Modal isOpen onClose={onClose} size="sm">
      <Modal.Header
        onClose={onClose}
        title={`Assign Role — ${user.name}`}
        subtitle={user.email}
      />
      <Modal.Body>
        <p className={styles.chipLabel}>Pilih roles (bisa lebih dari satu)</p>
        <div className={styles.chipGrid}>
          {allRoles.map((role) => {
            const active = selected.includes(role.name)
            return (
              <button
                key={role.id}
                className={`${styles.chip} ${active ? styles.chipActive : ''}`}
                onClick={() => toggle(role.name)}
              >
                {active && <span>✓ </span>}
                {role.name}
              </button>
            )
          })}
        </div>
        {error && <p className={styles.errorText}>{error}</p>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="ghost" onClick={onClose} disabled={loading}>Batal</Button>
        <Button variant="primary" onClick={handleSave} loading={loading}>
          Simpan Roles
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

// ─── Role Form Modal (Add / Edit) ─────────────────────────────
function RoleFormModal({ role, onClose, onSaved }) {
  const isEdit = Boolean(role)
  const [name, setName]       = useState(role?.name ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const handleSave = async () => {
    if (!name.trim()) { setError('Nama role tidak boleh kosong.'); return }
    setLoading(true); setError(null)
    try {
      const res = isEdit
        ? await api(`/roles/${role.id}`, { method: 'PUT', body: JSON.stringify({ name }) })
        : await api('/roles', { method: 'POST', body: JSON.stringify({ name }) })
      onSaved(res.data, isEdit)
    } catch {
      setError(isEdit ? 'Gagal mengubah role.' : 'Nama role sudah ada atau tidak valid.')
    } finally { setLoading(false) }
  }

  return (
    <Modal isOpen onClose={onClose} size="sm">
      <Modal.Header
        onClose={onClose}
        title={isEdit ? `Edit Role: ${role.name}` : 'Tambah Role Baru'}
      />
      <Modal.Body>
        <Input
          label="Nama Role"
          placeholder="contoh: kasir, head-admin…"
          value={name}
          onChange={(e) => setName(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
          hint="Huruf kecil, gunakan tanda hubung untuk spasi."
          error={error}
          autoFocus
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="ghost" onClick={onClose} disabled={loading}>Batal</Button>
        <Button variant="primary" onClick={handleSave} loading={loading}>
          {isEdit ? 'Simpan Perubahan' : 'Buat Role'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

// ─── Users Tab ────────────────────────────────────────────────
function UsersTab({ allRoles, toast }) {
  const [users, setUsers]     = useState([])
  const [meta, setMeta]       = useState({})
  const [page, setPage]       = useState(1)
  const [search, setSearch]   = useState('')
  const [query, setQuery]     = useState('')
  const [loading, setLoading] = useState(true)
  const [target, setTarget]   = useState(null)

  const fetchUsers = useCallback(() => {
    setLoading(true)
    api(`/users?page=${page}&search=${query}`)
      .then((res) => { setUsers(res.data); setMeta(res.meta) })
      .finally(() => setLoading(false))
  }, [page, query])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    setQuery(search)
  }

  const handleRoleSaved = (updated) => {
    setUsers((prev) => prev.map((u) => u.id === updated.id ? { ...u, roles: updated.roles } : u))
    setTarget(null)
    toast({ variant: 'success', title: `Role ${updated.name} diperbarui.` })
  }

  const handleDelete = async (user) => {
    if (!confirm(`Hapus akun ${user.name}?`)) return
    try {
      await api(`/users/${user.id}`, { method: 'DELETE' })
      fetchUsers()
      toast({ variant: 'danger', title: `${user.name} dihapus.` })
    } catch {
      toast({ variant: 'danger', title: 'Gagal menghapus user.' })
    }
  }

  return (
    <div className={styles.tabPane}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <span className={styles.info}>{meta.total ?? '—'} pengguna terdaftar</span>
        <form className={styles.searchRow} onSubmit={handleSearch}>
          <Input
            type="search"
            placeholder="Cari nama atau email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="sm"
          />
          <Button type="submit" size="sm">Cari</Button>
        </form>
      </div>

      {/* Table */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Pengguna</th>
              <th>Roles</th>
              <th>Bergabung</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 4 }).map((_, j) => (
                      <td key={j}><div className={styles.skeleton} /></td>
                    ))}
                  </tr>
                ))
              : users.length === 0
              ? (
                <tr>
                  <td colSpan={4}>
                    <EmptyState
                      title="Tidak ada pengguna ditemukan"
                      description={query ? `Tidak ada hasil untuk "${query}"` : 'Belum ada pengguna terdaftar.'}
                    />
                  </td>
                </tr>
              )
              : users.map((user) => (
                <tr key={user.id} className={styles.row}>
                  <td>
                    <div className={styles.userCell}>
                      <Avatar name={user.name} src={user.avatar} size="sm" />
                      <div>
                        <p className={styles.userName}>{user.name}</p>
                        <p className={styles.userEmail}>{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={styles.badgeRow}>
                      {user.roles.length
                        ? user.roles.map((r) => (
                            <Badge key={r} variant={roleVariant(r)} pill size="sm">{r}</Badge>
                          ))
                        : <span className={styles.muted}>—</span>}
                    </div>
                  </td>
                  <td className={styles.muted}>{user.created_at}</td>
                  <td>
                    <div className={styles.actions}>
                      <Button
                        variant="outline"
                        size="sm"
                        iconLeft={<KeyRound size={13} />}
                        onClick={() => setTarget(user)}
                      >
                        Role
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        iconLeft={<Trash2 size={13} />}
                        onClick={() => handleDelete(user)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta.last_page > 1 && (
        <Pagination
          page={meta.current_page}
          totalPages={meta.last_page}
          totalRows={meta.total}
          pageSize={meta.per_page}
          onChange={(p) => setPage(p)}
        />
      )}

      {/* Modal */}
      {target && (
        <AssignRoleModal
          user={target}
          allRoles={allRoles}
          onClose={() => setTarget(null)}
          onSaved={handleRoleSaved}
        />
      )}
    </div>
  )
}

// ─── Roles Tab ────────────────────────────────────────────────
function RolesTab({ roles, setRoles, toast }) {
  const [formTarget, setFormTarget] = useState(undefined)
  const [search, setSearch]         = useState('')

  const filtered = roles.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleSaved = (data, isEdit) => {
    if (isEdit) {
      setRoles((prev) => prev.map((r) => r.id === data.id ? data : r))
      toast({ variant: 'success', title: `Role "${data.name}" diperbarui.` })
    } else {
      setRoles((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)))
      toast({ variant: 'success', title: `Role "${data.name}" dibuat.` })
    }
    setFormTarget(undefined)
  }

  const handleDelete = async (role) => {
    if (role.users_count > 0) {
      toast({ variant: 'warning', title: `Role "${role.name}" masih dipakai ${role.users_count} user.` })
      return
    }
    if (!confirm(`Hapus role "${role.name}"?`)) return
    try {
      await api(`/roles/${role.id}`, { method: 'DELETE' })
      setRoles((prev) => prev.filter((r) => r.id !== role.id))
      toast({ variant: 'info', title: `Role "${role.name}" dihapus.` })
    } catch {
      toast({ variant: 'danger', title: 'Gagal menghapus role.' })
    }
  }

  return (
    <div className={styles.tabPane}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <span className={styles.info}>{roles.length} role terdaftar</span>
        <div className={styles.searchRow}>
          <Input
            type="search"
            placeholder="Filter role…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="sm"
          />
          <Button
            size="sm"
            iconLeft={<ShieldCheck size={14} />}
            onClick={() => setFormTarget(null)}
          >
            Tambah Role
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nama Role</th>
              <th>Guard</th>
              <th style={{ textAlign: 'center' }}>Users</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0
              ? (
                <tr>
                  <td colSpan={4}>
                    <EmptyState title="Tidak ada role" description="Buat role baru untuk memulai." />
                  </td>
                </tr>
              )
              : filtered.map((role) => (
                <tr key={role.id} className={styles.row}>
                  <td>
                    <Badge variant={roleVariant(role.name)} pill>{role.name}</Badge>
                  </td>
                  <td>
                    <Badge variant="default" size="sm">{role.guard_name}</Badge>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <Badge variant={role.users_count > 0 ? 'primary' : 'default'} size="sm">
                      {role.users_count}
                    </Badge>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <Button
                        variant="outline"
                        size="sm"
                        iconLeft={<Pencil size={13} />}
                        onClick={() => setFormTarget(role)}
                        disabled={role.name === 'superadmin'}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        iconLeft={<Trash2 size={13} />}
                        onClick={() => handleDelete(role)}
                        disabled={role.name === 'superadmin' || role.users_count > 0}
                        title={role.users_count > 0 ? 'Masih ada user dengan role ini' : ''}
                      />
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {formTarget !== undefined && (
        <RoleFormModal
          role={formTarget}
          onClose={() => setFormTarget(undefined)}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────
export default function UserManagement() {
  const [allRoles, setAllRoles] = useState([])
  const { addToast }            = useToast()

  useEffect(() => {
    api('/roles').then((res) => setAllRoles(res.data))
  }, [])

  const tabs = [
    {
      key:     'users',
      label:   'Pengguna',
      icon:    <Users size={14} />,
      content: <UsersTab allRoles={allRoles} toast={addToast} />,
    },
    {
      key:     'roles',
      label:   'Roles',
      icon:    <KeyRound size={14} />,
      count:   allRoles.length,
      content: <RolesTab roles={allRoles} setRoles={setAllRoles} toast={addToast} />,
    },
  ]

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>User Management</h1>
        <p className={styles.pageSubtitle}>Kelola pengguna dan hak akses sistem</p>
      </div>
      <Tabs tabs={tabs} defaultTab="users" />
    </div>
  )
}