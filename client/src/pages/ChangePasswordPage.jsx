import { useState } from 'react';
import api from '../api';

function ChangePasswordPage({ user, onPasswordChanged, onLogout }) {
  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');

    if (form.newPassword.length < 6) {
      setMessage('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setMessage('Mật khẩu xác nhận không khớp.');
      return;
    }

    setSaving(true);

    try {
      const response = await api.post('/auth/change-password', form);
      onPasswordChanged(response.data.user);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Không thể đổi mật khẩu lúc này.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="forced-password-page">
      <section className="forced-password-card">
        <span className="plan-label">Fitness AI</span>
        <p className="eyebrow">BẢO MẬT TÀI KHOẢN</p>
        <h1>Đặt mật khẩu riêng cho bạn</h1>
        <p>
          Xin chào {user.fullName}. Admin vừa cấp mật khẩu tạm thời cho tài khoản của bạn.
          Hãy tạo mật khẩu mới trước khi tiếp tục sử dụng hệ thống.
        </p>

        <form onSubmit={handleSubmit}>
          <label>
            Mật khẩu mới
            <input
              name="newPassword"
              type="password"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="Ít nhất 6 ký tự"
              required
            />
          </label>
          <label>
            Xác nhận mật khẩu mới
            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Nhập lại mật khẩu mới"
              required
            />
          </label>
          {message && <p className="form-error">{message}</p>}
          <button type="submit" disabled={saving}>
            {saving ? 'Đang lưu...' : 'Lưu mật khẩu mới'}
          </button>
        </form>

        <button className="text-button" type="button" onClick={onLogout}>
          Đăng xuất
        </button>
      </section>
    </main>
  );
}

export default ChangePasswordPage;
