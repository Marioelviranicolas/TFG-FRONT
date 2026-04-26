import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../api';
import './AdminPanel.css';

const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating % 1 !== 0;
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - Math.ceil(rating));
};

export default function AdminPanel() {
    const navigate    = useNavigate();
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

    // Pestaña activa
    const [activeTab, setActiveTab] = useState('users'); // 'users' | 'reviews'

    // Usuarios
    const [users, setUsers]     = useState([]);
    const [search, setSearch]   = useState('');
    const [filter, setFilter]   = useState('all');

    // Reviews
    const [reviews, setReviews]           = useState([]);
    const [reviewSearch, setReviewSearch] = useState('');
    const [reviewsLoading, setReviewsLoading] = useState(false);

    // Compartidos
    const [loading, setLoading] = useState(true);
    const [confirm, setConfirm] = useState(null);
    const [toast, setToast]     = useState(null);

    // Redirige si no es admin
    useEffect(() => {
        if (!currentUser || currentUser.role !== 'ADMIN') {
            navigate('/user-home');
        }
    }, []);

    useEffect(() => { loadUsers(); }, []);

    // ── Carga usuarios ──
    const loadUsers = async () => {
        setLoading(true);
        try {
            const res  = await apiFetch('/user/todos', { skipRedirect: true });
            const data = await res.json();
            setUsers(data);
        } catch {
            showToast('Error al cargar usuarios', false);
        } finally {
            setLoading(false);
        }
    };

    // ── Carga reviews ──
    const loadReviews = async () => {
        setReviewsLoading(true);
        try {
            const res  = await apiFetch('/reviews/todos', { skipRedirect: true });
            const data = await res.json();
            setReviews(data || []);
        } catch {
            showToast('Error al cargar comentarios', false);
        } finally {
            setReviewsLoading(false);
        }
    };

    // Carga reviews al cambiar de pestaña
    useEffect(() => {
        if (activeTab === 'reviews' && reviews.length === 0) {
            loadReviews();
        }
    }, [activeTab]);

    const showToast = (msg, ok = true) => {
        setToast({ msg, ok });
        setTimeout(() => setToast(null), 3000);
    };

    // ── Eliminar usuario ──
    const handleDeleteUser = async (username) => {
        try {
            const res = await apiFetch(`/user/delete/${username}`, { method: 'DELETE', skipRedirect: true });
            if (res.ok) {
                setUsers(prev => prev.filter(u => u.username !== username));
                showToast(`Usuario "${username}" eliminado`);
            } else {
                showToast('No tienes permisos para esta acción', false);
            }
        } catch {
            showToast('Error al eliminar el usuario', false);
        } finally {
            setConfirm(null);
        }
    };

    // ── Cambiar rol ──
    const handleRoleChange = async (username, currentRole) => {
        const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
        try {
            const res = await apiFetch(`/user/role/${username}?role=${newRole}`, { method: 'PUT', skipRedirect: true });
            if (res.ok) {
                setUsers(prev => prev.map(u => u.username === username ? { ...u, role: newRole } : u));
                showToast(`Rol de "${username}" cambiado a ${newRole}`);
            } else {
                showToast('No tienes permisos para esta acción', false);
            }
        } catch {
            showToast('Error al cambiar el rol', false);
        } finally {
            setConfirm(null);
        }
    };

    // ── Eliminar review ──
    const handleDeleteReview = async (id) => {
        try {
            const res = await apiFetch(`/reviews/delete/${id}`, { method: 'DELETE', skipRedirect: true });
            if (res.ok || res.status === 200) {
                setReviews(prev => prev.filter(r => r.id !== id));
                showToast('Comentario eliminado');
            } else {
                showToast('Error al eliminar el comentario', false);
            }
        } catch {
            showToast('Error al eliminar el comentario', false);
        } finally {
            setConfirm(null);
        }
    };

    // ── Filtrado usuarios ──
    const filteredUsers = users.filter(u => {
        const matchSearch = u.username.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === 'all' || u.role === filter;
        return matchSearch && matchFilter;
    });

    // ── Filtrado reviews ──
    const filteredReviews = reviews.filter(r => {
        const q = reviewSearch.toLowerCase();
        return (
            r.user?.username?.toLowerCase().includes(q) ||
            r.album?.title?.toLowerCase().includes(q) ||
            r.album?.artist?.toLowerCase().includes(q) ||
            r.comment?.toLowerCase().includes(q)
        );
    }).filter(r => r.comment && r.comment.trim()); // solo los que tienen comentario

    const totalAdmins = users.filter(u => u.role === 'ADMIN').length;
    const totalUsers  = users.filter(u => u.role === 'USER').length;
    const totalReviewsWithComment = reviews.filter(r => r.comment && r.comment.trim()).length;

    if (loading) return (
        <div className="adm-loading">
            <div className="adm-spinner" />
            <p>Cargando panel...</p>
        </div>
    );

    return (
        <div className="adm-page">

            {/* Toast */}
            {toast && (
                <div className={`adm-toast ${toast.ok ? 'adm-toast--ok' : 'adm-toast--err'}`}>
                    {toast.msg}
                </div>
            )}

            {/* Modal de confirmación */}
            {confirm && (
                <div className="adm-modal-overlay" onClick={() => setConfirm(null)}>
                    <div className="adm-modal" onClick={e => e.stopPropagation()}>
                        <h3 className="adm-modal__title">
                            {confirm.type === 'deleteUser'   && '¿Eliminar usuario?'}
                            {confirm.type === 'role'         && '¿Cambiar rol?'}
                            {confirm.type === 'deleteReview' && '¿Eliminar comentario?'}
                        </h3>
                        <p className="adm-modal__body">
                            {confirm.type === 'deleteUser' &&
                                `Esta acción eliminará permanentemente a "${confirm.username}" y todos sus datos.`}
                            {confirm.type === 'role' &&
                                `Se cambiará el rol de "${confirm.username}" a ${confirm.currentRole === 'ADMIN' ? 'USER' : 'ADMIN'}.`}
                            {confirm.type === 'deleteReview' &&
                                `Se eliminará el comentario de "${confirm.username}" permanentemente.`}
                        </p>
                        <div className="adm-modal__actions">
                            <button className="adm-btn adm-btn--ghost" onClick={() => setConfirm(null)}>
                                Cancelar
                            </button>
                            <button
                                className={`adm-btn ${confirm.type === 'role' ? 'adm-btn--primary' : 'adm-btn--danger'}`}
                                onClick={() => {
                                    if (confirm.type === 'deleteUser')   handleDeleteUser(confirm.username);
                                    if (confirm.type === 'role')         handleRoleChange(confirm.username, confirm.currentRole);
                                    if (confirm.type === 'deleteReview') handleDeleteReview(confirm.id);
                                }}
                            >
                                {confirm.type === 'role' ? 'Confirmar' : 'Eliminar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Navbar */}
            <nav className="adm-navbar">
                <button className="adm-back" onClick={() => navigate('/user-home')}>← Volver</button>
                <h1 className="adm-navbar__title">Panel de Administración</h1>
                <span className="adm-navbar__badge">ADMIN</span>
            </nav>

            <div className="adm-content">

                {/* Métricas */}
                <div className="adm-metrics">
                    <div className="adm-metric">
                        <span className="adm-metric__value">{users.length}</span>
                        <span className="adm-metric__label">Usuarios totales</span>
                    </div>
                    <div className="adm-metric">
                        <span className="adm-metric__value">{totalUsers}</span>
                        <span className="adm-metric__label">Usuarios</span>
                    </div>
                    <div className="adm-metric adm-metric--accent">
                        <span className="adm-metric__value">{totalAdmins}</span>
                        <span className="adm-metric__label">Admins</span>
                    </div>
                    <div className="adm-metric">
                        <span className="adm-metric__value">{reviews.length}</span>
                        <span className="adm-metric__label">Reviews totales</span>
                    </div>
                    <div className="adm-metric">
                        <span className="adm-metric__value">{totalReviewsWithComment}</span>
                        <span className="adm-metric__label">Con comentario</span>
                    </div>
                </div>

                {/* Pestañas */}
                <div className="adm-tabs">
                    <button
                        className={`adm-tab ${activeTab === 'users' ? 'adm-tab--active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        Usuarios <span className="adm-tab-count">{users.length}</span>
                    </button>
                    <button
                        className={`adm-tab ${activeTab === 'reviews' ? 'adm-tab--active' : ''}`}
                        onClick={() => setActiveTab('reviews')}
                    >
                        Comentarios <span className="adm-tab-count">{totalReviewsWithComment}</span>
                    </button>
                </div>

                {/* ── PESTAÑA USUARIOS ── */}
                {activeTab === 'users' && (
                    <>
                        <div className="adm-toolbar">
                            <div className="adm-search-wrap">
                                <span className="adm-search-icon">🔍</span>
                                <input
                                    type="text"
                                    className="adm-search"
                                    placeholder="Buscar usuario..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                                {search && (
                                    <button className="adm-search-clear" onClick={() => setSearch('')}>✕</button>
                                )}
                            </div>
                            <div className="adm-filters">
                                {[
                                    { key: 'all',   label: 'Todos'  },
                                    { key: 'USER',  label: 'Users'  },
                                    { key: 'ADMIN', label: 'Admins' },
                                ].map(f => (
                                    <button
                                        key={f.key}
                                        className={`adm-filter-btn ${filter === f.key ? 'adm-filter-btn--active' : ''}`}
                                        onClick={() => setFilter(f.key)}
                                    >
                                        {f.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="adm-table-wrap">
                            <table className="adm-table">
                                <thead>
                                    <tr>
                                        <th>Usuario</th>
                                        <th>Email</th>
                                        <th>Rol</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.length === 0 ? (
                                        <tr><td colSpan={4} className="adm-empty">No hay usuarios que coincidan</td></tr>
                                    ) : filteredUsers.map(user => (
                                        <tr key={user.idUser} className={user.username === currentUser?.username ? 'adm-row--self' : ''}>
                                            <td>
                                                <div className="adm-user-cell">
                                                    <img
                                                        className="adm-avatar"
                                                        src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.username}&size=200&background=ff5500&color=fff`}
                                                        alt={user.username}
                                                        onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${user.username}&size=200&background=ff5500&color=fff`; }}
                                                    />
                                                    <div>
                                                        <p className="adm-username">{user.username}</p>
                                                        {user.username === currentUser?.username && (
                                                            <span className="adm-self-badge">Tú</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="adm-email">{user.email}</td>
                                            <td>
                                                <span className={`adm-role-badge ${user.role === 'ADMIN' ? 'adm-role-badge--admin' : ''}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="adm-actions">
                                                    <button className="adm-btn adm-btn--sm adm-btn--ghost" onClick={() => navigate(`/profile/${user.username}`)}>
                                                        Ver perfil
                                                    </button>
                                                    {user.username !== currentUser?.username && (
                                                        <button
                                                            className="adm-btn adm-btn--sm adm-btn--primary"
                                                            onClick={() => setConfirm({ type: 'role', username: user.username, currentRole: user.role })}
                                                        >
                                                            {user.role === 'ADMIN' ? '→ USER' : '→ ADMIN'}
                                                        </button>
                                                    )}
                                                    {user.username !== currentUser?.username && (
                                                        <button
                                                            className="adm-btn adm-btn--sm adm-btn--danger"
                                                            onClick={() => setConfirm({ type: 'deleteUser', username: user.username })}
                                                        >
                                                            Eliminar
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {/* ── PESTAÑA COMENTARIOS ── */}
                {activeTab === 'reviews' && (
                    <>
                        <div className="adm-toolbar">
                            <div className="adm-search-wrap">
                                <span className="adm-search-icon">🔍</span>
                                <input
                                    type="text"
                                    className="adm-search"
                                    placeholder="Buscar por usuario, álbum o comentario..."
                                    value={reviewSearch}
                                    onChange={e => setReviewSearch(e.target.value)}
                                />
                                {reviewSearch && (
                                    <button className="adm-search-clear" onClick={() => setReviewSearch('')}>✕</button>
                                )}
                            </div>
                        </div>

                        {reviewsLoading ? (
                            <div className="adm-loading-inline">
                                <div className="adm-spinner" />
                                <p>Cargando comentarios...</p>
                            </div>
                        ) : (
                            <div className="adm-table-wrap">
                                <table className="adm-table">
                                    <thead>
                                        <tr>
                                            <th>Usuario</th>
                                            <th>Álbum</th>
                                            <th>Puntuación</th>
                                            <th>Comentario</th>
                                            <th>Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredReviews.length === 0 ? (
                                            <tr><td colSpan={5} className="adm-empty">No hay comentarios que coincidan</td></tr>
                                        ) : filteredReviews.map(review => (
                                            <tr key={review.id}>
                                                <td>
                                                    <div className="adm-user-cell">
                                                        <img
                                                            className="adm-avatar"
                                                            src={review.user?.avatarUrl || `https://ui-avatars.com/api/?name=${review.user?.username}&size=200&background=ff5500&color=fff`}
                                                            alt={review.user?.username}
                                                            onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${review.user?.username}&size=200&background=ff5500&color=fff`; }}
                                                        />
                                                        <p className="adm-username">{review.user?.username}</p>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="adm-album-cell">
                                                        {review.album?.coverUrl && (
                                                            <img src={review.album.coverUrl} alt={review.album.title} className="adm-album-cover" />
                                                        )}
                                                        <div>
                                                            <p className="adm-album-title">{review.album?.title}</p>
                                                            <p className="adm-album-artist">{review.album?.artist}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="adm-stars">{renderStars(review.rating)}</span>
                                                </td>
                                                <td>
                                                    <p className="adm-comment-text">"{review.comment}"</p>
                                                </td>
                                                <td>
                                                    <button
                                                        className="adm-btn adm-btn--sm adm-btn--danger"
                                                        onClick={() => setConfirm({
                                                            type: 'deleteReview',
                                                            id: review.id,
                                                            username: review.user?.username
                                                        })}
                                                    >
                                                        Eliminar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
