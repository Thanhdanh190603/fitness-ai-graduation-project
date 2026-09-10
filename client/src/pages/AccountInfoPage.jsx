import { useState } from 'react';
import api from '../api';

function formatDate(value) {
  if (!value) {
    return 'Chưa cập nhật';
  }

  return new Intl.DateTimeFormat('vi-VN').format(new Date(value));
}

function AccountInfoPage({ user, onEditProfile, onUserUpdated }) {
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarMessage, setAvatarMessage] = useState('');
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const avatarUrl = user.avatar ? `http://localhost:5000${user.avatar}` : '';

  async function uploadAvatar() {
    if (!avatarFile) {
      return;
    }

    setAvatarLoading(true);
    setAvatarMessage('');
    const formData = new FormData();
    formData.append('avatar', avatarFile);

    try {
      const response = await api.put('/users/avatar', formData);
      onUserUpdated(response.data.user);
      setAvatarFile(null);
      setAvatarMessage('Đã cập nhật ảnh avatar.');
    } catch (error) {
      setAvatarMessage(error.response?.data?.message || 'Không thể cập nhật avatar.');
    } finally {
      setAvatarLoading(false);
    }
  }

  function handlePasswordChange(event) {
    setPasswordForm({
      ...passwordForm,
      [event.target.name]: event.target.value
    });
  }

  async function changePassword(event) {
    event.preventDefault();
    setPasswordMessage('');

    if (passwordForm.newPassword.length < 6) {
      setPasswordMessage('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage('Mật khẩu xác nhận không khớp.');
      return;
    }

    setPasswordLoading(true);

    try {
      const response = await api.post('/auth/change-password', passwordForm);
      onUserUpdated(response.data.user);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordMessage('Đã đổi mật khẩu thành công.');
    } catch (error) {
      setPasswordMessage(error.response?.data?.message || 'Không thể đổi mật khẩu.');
    } finally {
      setPasswordLoading(false);
    }
  }

  return (
    <section className="account-page">
      <div className="account-page-heading">
        <div>
          <p className="eyebrow">TÀI KHOẢN CỦA BẠN</p>
          <h2>Thông tin tài khoản</h2>
          <p>Thông tin đăng ký và nhận diện tài khoản Member.</p>
        </div>
      </div>

      <div className="account-info-layout">
        <div className="account-avatar-card">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Ảnh avatar của người dùng" />
          ) : (
            <span aria-hidden="true">◉</span>
          )}
          <strong>{user.fullName || 'Chưa cập nhật'}</strong>
          <small>{user.accountType === 'admin' ? 'Admin' : 'Member'}</small>
          <label className="account-avatar-select">
            Chọn ảnh avatar
            <input
              type="file"
              accept="image/*"
              onChange={(event) => {
                setAvatarFile(event.target.files?.[0] || null);
                setAvatarMessage('');
              }}
            />
          </label>
          {avatarFile && (
            <button
              className="account-avatar-upload"
              type="button"
              onClick={uploadAvatar}
              disabled={avatarLoading}
            >
              {avatarLoading ? 'Đang tải...' : 'Upload ảnh avatar'}
            </button>
          )}
          {avatarMessage && <small className="account-avatar-message">{avatarMessage}</small>}
        </div>

        <div className="account-details-grid">
          <div>
            <span>Họ và tên</span>
            <strong>{user.fullName || 'Chưa cập nhật'}</strong>
          </div>
          <div>
            <span>Tên đăng nhập</span>
            <strong>{user.username || 'Chưa cập nhật'}</strong>
          </div>
          <div>
            <span>Email</span>
            <strong>{user.email || 'Chưa cập nhật'}</strong>
          </div>
          <div>
            <span>Số điện thoại</span>
            <strong>{user.phone || 'Chưa cập nhật'}</strong>
          </div>
          <div>
            <span>Ngày sinh</span>
            <strong>{formatDate(user.dateOfBirth)}</strong>
          </div>
          <div>
            <span>Trạng thái tài khoản</span>
            <strong>{user.accountType === 'admin' ? 'Admin' : 'Member'}</strong>
          </div>
        </div>
      </div>

      <div className="account-page-actions">
        <button type="button" onClick={onEditProfile}>
          Chỉnh sửa hồ sơ thể trạng
        </button>
      </div>

      <section className={`account-security-section ${showPasswordForm ? 'is-open' : ''}`}>
        <div>
          <p className="eyebrow">BẢO MẬT</p>
          <h3>Đổi mật khẩu</h3>
          <p>Đổi mật khẩu định kỳ để bảo vệ tài khoản của bạn.</p>
          <small className="account-security-hint">Nếu quên mật khẩu hoặc mất email, hãy liên hệ admin qua admin@gmail.com để được cấp lại mật khẩu.</small>
          <button
            className="ghost-button account-password-toggle"
            type="button"
            onClick={() => {
              setShowPasswordForm(!showPasswordForm);
              setPasswordMessage('');
            }}
          >
            {showPasswordForm ? 'Đóng phần đổi mật khẩu' : 'Đổi mật khẩu'}
          </button>
        </div>
        {showPasswordForm && (
          <form className="account-password-form" onSubmit={changePassword}>
            <label>
              Mật khẩu hiện tại
              <input
                name="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Nhập mật khẩu hiện tại"
                required
              />
            </label>
            <label>
              Mật khẩu mới
              <input
                name="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                placeholder="Ít nhất 6 ký tự"
                required
              />
            </label>
            <label>
              Xác nhận mật khẩu mới
              <input
                name="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Nhập lại mật khẩu mới"
                required
              />
            </label>
            {passwordMessage && <p className="account-password-message">{passwordMessage}</p>}
            <button type="submit" disabled={passwordLoading}>
              {passwordLoading ? 'Đang lưu...' : 'Lưu mật khẩu mới'}
            </button>
          </form>
        )}
      </section>
    </section>
  );
}

export default AccountInfoPage;
