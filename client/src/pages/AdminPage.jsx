import { useEffect, useState } from 'react';
import api from '../api';
import blogPosts from '../data/blogPosts';

const emptyExercise = {
  name: '',
  category: 'gym',
  muscleGroup: '',
  level: 'beginner',
  videoUrl: '',
  sourceName: 'YouTube public video',
  sourceUrl: '',
  description: '',
  sets: 3,
  reps: '10-12 lần',
  restSeconds: 60,
  needWatchAd: false
};

const categoryLabels = {
  gym: 'Gym',
  calisthenics: 'Calisthenics',
  yoga: 'Yoga',
  stretching: 'Giãn cơ',
  kegel: 'Kegel'
};

const levelLabels = {
  beginner: 'Mới bắt đầu',
  medium: 'Trung bình',
  advanced: 'Nâng cao'
};

function AdminPage({ user, onLogout }) {
  const [exercises, setExercises] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [newUserIds, setNewUserIds] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyExercise);
  const [editingId, setEditingId] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [formMessage, setFormMessage] = useState('');

  async function loadExercises() {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/exercises');
      setExercises(response.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Không thể tải danh sách bài tập');
    } finally {
      setLoading(false);
    }
  }

  async function loadUsers() {
    setUsersLoading(true);

    try {
      const response = await api.get('/users');
      const nextUsers = response.data;
      const storageKey = 'fitness-ai-admin-last-user-view';
      const lastViewedAt = Number(window.localStorage.getItem(storageKey));
      const newestUserTime = nextUsers.reduce((latest, item) => {
        const createdTime = new Date(item.createdAt || 0).getTime();
        return Math.max(latest, createdTime);
      }, 0);

      if (lastViewedAt) {
        setNewUserIds(nextUsers
          .filter((item) => new Date(item.createdAt || 0).getTime() > lastViewedAt)
          .map((item) => item._id));
      } else {
        setNewUserIds([]);
      }

      window.localStorage.setItem(storageKey, String(Math.max(Date.now(), newestUserTime)));
      setUsers(nextUsers);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Không thể tải danh sách người dùng');
    } finally {
      setUsersLoading(false);
    }
  }

  useEffect(() => {
    loadExercises();
    loadUsers();
  }, []);

  function updateForm(event) {
    const { name, value, type, checked } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  function startCreate() {
    setEditingId('');
    setForm(emptyExercise);
    setFormMessage('');
  }

  function startEdit(exercise) {
    setEditingId(exercise._id);
    setForm({
      ...emptyExercise,
      ...exercise,
      needWatchAd: Boolean(exercise.needWatchAd)
    });
    setFormMessage('');
    document.getElementById('form-bai-tap')?.scrollIntoView({ behavior: 'smooth' });
  }

  async function saveExercise(event) {
    event.preventDefault();
    setFormMessage('');

    if (!form.name.trim() || !form.muscleGroup.trim() || !form.videoUrl.trim()) {
      setFormMessage('Vui lòng nhập tên bài, nhóm cơ và đường dẫn video.');
      return;
    }

    setFormLoading(true);

    try {
      const payload = {
        ...form,
        name: form.name.trim(),
        muscleGroup: form.muscleGroup.trim(),
        videoUrl: form.videoUrl.trim(),
        sourceUrl: form.sourceUrl.trim(),
        description: form.description.trim(),
        sets: Number(form.sets),
        restSeconds: Number(form.restSeconds)
      };
      const response = editingId
        ? await api.put(`/exercises/${editingId}`, payload)
        : await api.post('/exercises', payload);

      setExercises((currentExercises) => editingId
        ? currentExercises.map((exercise) => exercise._id === editingId ? response.data : exercise)
        : [response.data, ...currentExercises]);
      setFormMessage(editingId ? 'Đã cập nhật bài tập.' : 'Đã thêm bài tập mới.');
      setEditingId('');
      setForm(emptyExercise);
    } catch (requestError) {
      setFormMessage(requestError.response?.data?.message || 'Không thể lưu bài tập.');
    } finally {
      setFormLoading(false);
    }
  }

  async function removeExercise(exercise) {
    if (!window.confirm(`Xóa bài “${exercise.name}”?`)) {
      return;
    }

    try {
      await api.delete(`/exercises/${exercise._id}`);
      setExercises((currentExercises) => currentExercises.filter((item) => item._id !== exercise._id));
      if (editingId === exercise._id) {
        startCreate();
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Không thể xóa bài tập.');
    }
  }

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <div>
          <p className="admin-brand">Fitness AI</p>
          <span className="admin-role-label">Khu vực quản trị</span>
        </div>

        <nav className="admin-nav" aria-label="Menu quản trị">
          <a className="admin-nav-active" href="#tong-quan">Tổng quan</a>
          <a href="#bai-tap">Bài tập & video</a>
          <a href="#noi-dung">Nội dung Blog</a>
          <a href="#nguoi-dung">Member & Visitor</a>
        </nav>

        <div className="admin-account">
          <span>Đang đăng nhập</span>
          <strong>{user.fullName}</strong>
          <small>{user.email}</small>
          <button type="button" onClick={onLogout}>Đăng xuất</button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar" id="tong-quan">
          <div>
            <p className="eyebrow">ADMIN DASHBOARD</p>
            <h1>Quản lý Fitness AI</h1>
            <p>Theo dõi nội dung, bài tập và dữ liệu người dùng trong hệ thống.</p>
          </div>
          <span className="admin-status">Admin đang hoạt động</span>
        </header>

        <section className="admin-stat-grid" aria-label="Tổng quan hệ thống">
          <article className="admin-stat-card admin-stat-green">
            <span>Video bài tập</span>
            <strong>{loading ? '...' : exercises.length}</strong>
            <small>Nội dung đang có trong thư viện</small>
          </article>
          <article className="admin-stat-card admin-stat-gold">
            <span>Bài viết Blog</span>
            <strong>{blogPosts.length}</strong>
            <small>Bài viết và cập nhật kiến thức</small>
          </article>
          <article className="admin-stat-card admin-stat-blue">
            <span>Người dùng</span>
            <strong>{usersLoading ? '...' : users.length}</strong>
            <small>Tài khoản đang có trong hệ thống</small>
          </article>
        </section>

        <section className="admin-panel" id="form-bai-tap">
          <div className="admin-panel-heading">
            <div>
              <p className="eyebrow">QUẢN LÝ BÀI TẬP & VIDEO</p>
              <h2>{editingId ? 'Chỉnh sửa video bài tập' : 'Thêm video bài tập'}</h2>
            </div>
            {editingId && <button className="admin-refresh-button" type="button" onClick={startCreate}>Tạo bài mới</button>}
          </div>

          <form className="admin-exercise-form" onSubmit={saveExercise}>
            <label>Tên bài tập<input name="name" value={form.name} onChange={updateForm} placeholder="Ví dụ: Hít đất cơ bản" /></label>
            <label>Nhóm bài<select name="category" value={form.category} onChange={updateForm}>{Object.entries(categoryLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <label>Nhóm cơ<input name="muscleGroup" value={form.muscleGroup} onChange={updateForm} placeholder="Ví dụ: Ngực, vai, tay sau" /></label>
            <label>Trình độ<select name="level" value={form.level} onChange={updateForm}>{Object.entries(levelLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <label>Link video nhúng<input name="videoUrl" value={form.videoUrl} onChange={updateForm} placeholder="https://www.youtube.com/embed/..." /></label>
            <label>Tên nguồn video<input name="sourceName" value={form.sourceName} onChange={updateForm} placeholder="Ví dụ: YouTube - Fitness Blender" /></label>
            <label>Link nguồn<input name="sourceUrl" value={form.sourceUrl} onChange={updateForm} placeholder="https://www.youtube.com/watch?v=..." /></label>
            <label>Mô tả<textarea name="description" value={form.description} onChange={updateForm} rows="3" placeholder="Mô tả ngắn cho người tập" /></label>
            <div className="admin-form-grid admin-form-grid-small">
              <label>Số hiệp<input name="sets" type="number" min="1" value={form.sets} onChange={updateForm} /></label>
              <label>Số lần / thời gian<input name="reps" value={form.reps} onChange={updateForm} /></label>
              <label>Nghỉ (giây)<input name="restSeconds" type="number" min="0" value={form.restSeconds} onChange={updateForm} /></label>
            </div>
            <label className="admin-checkbox-label"><input name="needWatchAd" type="checkbox" checked={form.needWatchAd} onChange={updateForm} /> Nội dung phụ yêu cầu xem quảng cáo</label>
            {formMessage && <p className="admin-form-message">{formMessage}</p>}
            <button type="submit" disabled={formLoading}>{formLoading ? 'Đang lưu...' : editingId ? 'Lưu thay đổi' : 'Thêm video mới'}</button>
          </form>
        </section>

        <section className="admin-panel" id="bai-tap">
          <div className="admin-panel-heading">
            <div>
              <p className="eyebrow">NỘI DUNG ĐANG QUẢN LÝ</p>
              <h2>Danh sách bài tập & video</h2>
            </div>
            <button className="admin-refresh-button" type="button" onClick={loadExercises} disabled={loading}>
              {loading ? 'Đang tải...' : 'Tải lại danh sách'}
            </button>
          </div>

          {error && <p className="form-error">{error}</p>}

          {!loading && !error && exercises.length === 0 && (
            <div className="admin-empty-state">Chưa có bài tập nào trong thư viện.</div>
          )}

          {!loading && !error && exercises.length > 0 && (
            <div className="admin-exercise-list">
              {exercises.map((exercise) => (
                <article key={exercise._id} className="admin-exercise-row">
                  <div>
                    <strong>{exercise.name}</strong>
                    <span>{exercise.description || 'Chưa có mô tả'}</span>
                  </div>
                  <div className="admin-exercise-meta">
                    <span>{categoryLabels[exercise.category] || exercise.category}</span>
                    <span>{levelLabels[exercise.level] || exercise.level}</span>
                    {exercise.needWatchAd && <span className="admin-ad-tag">Có quảng cáo</span>}
                    <a href={exercise.sourceUrl || exercise.videoUrl} target="_blank" rel="noreferrer">Xem video</a>
                    <button type="button" onClick={() => startEdit(exercise)}>Sửa</button>
                    <button type="button" className="admin-delete-button" onClick={() => removeExercise(exercise)}>Xóa</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="admin-coming-grid">
          <article className="admin-coming-card" id="noi-dung">
            <span className="admin-card-index">02</span>
            <h2>Quản lý Blog</h2>
            <p>Danh sách bài viết hiện lấy từ nguồn đã kiểm duyệt. Bước tiếp theo sẽ thêm form để Admin đăng và cập nhật bài.</p>
          </article>
          <article className="admin-coming-card admin-users-card" id="nguoi-dung">
            <div className="admin-panel-heading">
              <div>
                <span className="admin-card-index">03</span>
                <h2>Quản lý Member & Visitor</h2>
              </div>
              <button className="admin-refresh-button" type="button" onClick={loadUsers} disabled={usersLoading}>
                {usersLoading ? 'Đang tải...' : 'Tải lại'}
              </button>
            </div>
            <div className="admin-user-summary">
              <span>Member: <strong>{users.filter((item) => item.role !== 'admin' && item.membershipStatus === 'active').length}</strong></span>
              <span>Visitor: <strong>{users.filter((item) => item.role !== 'admin' && item.membershipStatus !== 'active').length}</strong></span>
              <span className="admin-new-user-count">Mới đăng ký: <strong>{newUserIds.length}</strong></span>
            </div>
            {usersLoading ? (
              <p className="admin-users-empty">Đang tải danh sách tài khoản...</p>
            ) : users.length === 0 ? (
              <p className="admin-users-empty">Chưa có tài khoản nào.</p>
            ) : (
              <div className="admin-user-list">
                {users.map((item) => {
                  const accountType = item.role === 'admin'
                    ? 'Admin'
                    : item.membershipStatus === 'active' ? 'Member' : 'Visitor';

                  return (
                    <div className="admin-user-row" key={item._id}>
                      <div>
                        <strong>{item.fullName}</strong>
                        <span>{item.email}</span>
                      </div>
                      <div className="admin-user-meta">
                        <b className={`admin-user-badge admin-user-${accountType.toLowerCase()}`}>{accountType}</b>
                        {newUserIds.includes(item._id) && <b className="admin-new-user-badge">Mới đăng ký</b>}
                        <small>{item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : 'Chưa rõ ngày đăng ký'}</small>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </article>
        </section>
      </main>
    </div>
  );
}

export default AdminPage;
