import { useState, useEffect, useCallback } from 'react';
import styles from './UserManagement.module.css';

// ─── API helpers ─────────────────────────────────────────────
const api = (path, options = {}) => {
  const token = localStorage.getItem('token');
  return fetch(`/api/admin${path}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    ...options,
  }).then((r) => {
    if (!r.ok) throw new Error(r.statusText);
    return r.json();
  });
};

// ─── Role Badge ───────────────────────────────────────────────
function RoleBadge({ role }) {
  const map = {
    superadmin: 'badge-red',
    admin:      'badge-orange',
    manager:    'badge-blue',
    staff:      'badge-green',
    viewer:     'badge-gray',
  };
  const cls = map[role] ?? 'badge-gray';
  return <span className={`${styles.badge} ${styles[cls]}`}>{role}</span>;
}

// ─── Avatar ───────────────────────────────────────────────────
function Avatar({ name, src }) {
  if (src) return <img className={styles.avatar} src={src} alt={name} />;
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
  return <span className={styles.avatar}>{initials}</span>;
}

// ─── Assign Role Modal ────────────────────────────────────────
function AssignRoleModal({ user, allRoles, onClose, onSaved }) {
  const [selected, setSelected] = useState(user.roles);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  const toggle = (role) =>
    setSelected((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );

  const handleSave = async () => {
    if (selected.length === 0) {
      setError('Pilih minimal satu role.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api(`/users/${user.id}/roles`, {
        method: 'PUT',
        body: JSON.stringify({ roles: selected }),
      });
      onSaved(res.data);
    } catch (e) {
      setError('Gagal menyimpan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalUser}>
            <Avatar name={user.name} src={user.avatar} />
            <div>
              <p className={styles.modalName}>{user.name}</p>
              <p className={styles.modalEmail}>{user.email}</p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Role chips */}
        <p className={styles.modalLabel}>Assign Roles</p>
        <div className={styles.roleGrid}>
          {allRoles.map((role) => {
            const active = selected.includes(role.name);
            return (
              <button
                key={role.id}
                className={`${styles.roleChip} ${active ? styles.roleChipActive : ''}`}
                onClick={() => toggle(role.name)}
              >
                {active && <span className={styles.checkmark}>✓</span>}
                {role.name}
              </button>
            );
          })}
        </div>

        {error && <p className={styles.errorText}>{error}</p>}

        {/* Footer */}
        <div className={styles.modalFooter}>
          <button className={styles.btnSecondary} onClick={onClose} disabled={loading}>
            Batal
          </button>
          <button className={styles.btnPrimary} onClick={handleSave} disabled={loading}>
            {loading ? 'Menyimpan…' : 'Simpan Roles'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function UserManagement() {
  const [users, setUsers]       = useState([]);
  const [allRoles, setAllRoles] = useState([]);
  const [meta, setMeta]         = useState({});
  const [page, setPage]         = useState(1);
  const [search, setSearch]     = useState('');
  const [query, setQuery]       = useState('');
  const [loading, setLoading]   = useState(true);
  const [target, setTarget]     = useState(null);   // user being edited
  const [toast, setToast]       = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = useCallback(() => {
    setLoading(true);
    api(`/users?page=${page}&search=${query}`)
      .then((res) => {
        setUsers(res.data);
        setMeta(res.meta);
      })
      .finally(() => setLoading(false));
  }, [page, query]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  useEffect(() => {
    api('/roles').then((res) => setAllRoles(res.data));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setQuery(search);
  };

  const handleRoleSaved = (updated) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updated.id ? { ...u, roles: updated.roles } : u))
    );
    setTarget(null);
    showToast(`Role ${updated.name} berhasil diperbarui.`);
  };

  const handleDelete = async (user) => {
    if (!confirm(`Hapus akun ${user.name}?`)) return;
    try {
      await api(`/users/${user.id}`, { method: 'DELETE' });
      fetchUsers();
      showToast(`${user.name} dihapus.`, 'danger');
    } catch {
      showToast('Gagal menghapus user.', 'danger');
    }
  };

  return (
    <div className={styles.page}>
      {/* Toast */}
      {toast && (
        <div className={`${styles.toast} ${styles[`toast-${toast.type}`]}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>User Management</h1>
          <p className={styles.pageSubtitle}>
            {meta.total ?? '—'} pengguna terdaftar
          </p>
        </div>

        {/* Search */}
        <form className={styles.searchBar} onSubmit={handleSearch}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Cari nama atau email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className={styles.btnPrimary} type="submit">Cari</button>
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
                  <td colSpan={4} className={styles.empty}>
                    Tidak ada pengguna ditemukan.
                  </td>
                </tr>
              )
              : users.map((user) => (
                <tr key={user.id} className={styles.row}>
                  <td>
                    <div className={styles.userCell}>
                      <Avatar name={user.name} src={user.avatar} />
                      <div>
                        <p className={styles.userName}>{user.name}</p>
                        <p className={styles.userEmail}>{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={styles.roleList}>
                      {user.roles.length
                        ? user.roles.map((r) => <RoleBadge key={r} role={r} />)
                        : <span className={styles.noRole}>—</span>}
                    </div>
                  </td>
                  <td className={styles.dateCell}>{user.created_at}</td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.btnAction}
                        onClick={() => setTarget(user)}
                        title="Assign Role"
                      >
                        🔑 Role
                      </button>
                      <button
                        className={`${styles.btnAction} ${styles.btnDanger}`}
                        onClick={() => handleDelete(user)}
                        title="Hapus User"
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta.last_page > 1 && (
        <div className={styles.pagination}>
          {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`${styles.pageBtn} ${p === meta.current_page ? styles.pageBtnActive : ''}`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}
        </div>
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
  );
}
