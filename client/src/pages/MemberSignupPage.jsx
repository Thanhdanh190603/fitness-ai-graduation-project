import { useState } from 'react';
import api from '../api';
import LanguageToggle from '../components/LanguageToggle';

function MemberSignupPage({ user, language, onLanguageChange, onMemberActivated, onLogout, onCancel }) {
  const isEnglish = language === 'en';
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  async function confirmMember() {
    if (loading) {
      return;
    }

    if (!paymentMethod) {
      setMessage(isEnglish ? 'Please choose a payment method.' : 'Vui lòng chọn phương thức thanh toán.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await api.post('/auth/activate-member', { paymentMethod });
      onMemberActivated(response.data.user);
    } catch (error) {
      setMessage(error.response?.data?.message || (isEnglish ? 'Unable to activate Member.' : 'Không thể đăng ký Member lúc này.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="member-signup-page">
      <header className="member-signup-header">
        <strong>Fitness AI</strong>
        <div>
          <LanguageToggle language={language} onChange={onLanguageChange} />
          <button className="member-signup-logout" type="button" onClick={onLogout}>
            {isEnglish ? 'Log out' : 'Đăng xuất'}
          </button>
        </div>
      </header>

      <main className="member-signup-main">
        <section className="member-signup-card">
          <span className="eyebrow">{isEnglish ? 'Complete your membership' : 'Hoàn tất đăng ký thành viên'}</span>
          <h1>{isEnglish ? `Welcome, ${user.fullName}` : `Chào mừng, ${user.fullName}`}</h1>
          <p className="member-signup-intro">
            {isEnglish
              ? 'Choose Member to save your profile and use the full Fitness AI experience.'
              : 'Chọn Member để lưu hồ sơ và sử dụng đầy đủ trải nghiệm Fitness AI.'}
          </p>

          <div className="member-signup-price">
            <span>Member</span>
            <strong>{isEnglish ? '$9.99' : 'Khoảng 260.000 VNĐ'}</strong>
            <small>{isEnglish ? 'per month' : 'mỗi tháng'}</small>
          </div>

          <ul className="member-signup-benefits">
            <li>{isEnglish ? 'Personal AI workout plan' : 'Kế hoạch tập luyện cá nhân với AI'}</li>
            <li>{isEnglish ? 'Sleep, meal and progress tracking' : 'Theo dõi giấc ngủ, bữa ăn và tiến độ'}</li>
            <li>{isEnglish ? 'AI PT chat based on your profile' : 'Chat với AI PT dựa trên hồ sơ của bạn'}</li>
            <li>{isEnglish ? 'Photo and meal calorie analysis' : 'Phân tích ảnh thể trạng và kcal món ăn'}</li>
          </ul>

          <p className="member-demo-note">
            {isEnglish ? 'Demo payment for the graduation project. No real charge is made.' : 'Thanh toán mô phỏng cho đồ án tốt nghiệp. Hệ thống không trừ tiền thật.'}
          </p>
          <div className="payment-method-section">
            <h2>{isEnglish ? 'Choose a payment method' : 'Chọn phương thức thanh toán'}</h2>
            <div className="payment-method-list">
              <label className={`payment-method-option ${paymentMethod === 'momo' ? 'selected' : ''}`}>
                <input type="radio" name="paymentMethod" value="momo" checked={paymentMethod === 'momo'} onChange={(event) => setPaymentMethod(event.target.value)} />
                <span className="payment-method-logo momo-logo" aria-hidden="true">M</span>
                <span><strong>MoMo</strong><small>{isEnglish ? 'E-wallet' : 'Ví điện tử'}</small></span>
              </label>
              <label className={`payment-method-option ${paymentMethod === 'vnpay' ? 'selected' : ''}`}>
                <input type="radio" name="paymentMethod" value="vnpay" checked={paymentMethod === 'vnpay'} onChange={(event) => setPaymentMethod(event.target.value)} />
                <span className="payment-method-logo vnpay-logo" aria-hidden="true">V</span>
                <span><strong>VNPay</strong><small>{isEnglish ? 'QR and online banking' : 'QR và ngân hàng điện tử'}</small></span>
              </label>
              <label className={`payment-method-option ${paymentMethod === 'bank_transfer' ? 'selected' : ''}`}>
                <input type="radio" name="paymentMethod" value="bank_transfer" checked={paymentMethod === 'bank_transfer'} onChange={(event) => setPaymentMethod(event.target.value)} />
                <span className="payment-method-logo bank-logo" aria-hidden="true">ATM</span>
                <span><strong>{isEnglish ? 'Bank transfer' : 'Chuyển khoản ngân hàng'}</strong><small>{isEnglish ? 'Demo bank transfer' : 'Mô phỏng chuyển khoản'}</small></span>
              </label>
              <label className={`payment-method-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
                <input type="radio" name="paymentMethod" value="card" checked={paymentMethod === 'card'} onChange={(event) => setPaymentMethod(event.target.value)} />
                <span className="payment-method-logo card-logo" aria-hidden="true">▣</span>
                <span><strong>Visa / Mastercard</strong><small>{isEnglish ? 'International card' : 'Thẻ quốc tế'}</small></span>
              </label>
            </div>
          </div>
          {message && <p className="form-error">{message}</p>}
          <div className="member-payment-actions">
            <button className="member-visitor-button" type="button" onClick={onCancel} disabled={loading}>
              {isEnglish ? 'Back to home' : 'Quay lại trang chủ'}
            </button>
            <button className="member-confirm-button" type="button" onClick={confirmMember} disabled={loading}>
              {loading ? (isEnglish ? 'Activating...' : 'Đang kích hoạt...') : (isEnglish ? 'Confirm Member registration' : 'Xác nhận đăng ký Member')}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default MemberSignupPage;
