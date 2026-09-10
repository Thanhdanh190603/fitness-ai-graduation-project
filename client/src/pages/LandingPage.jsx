import { useEffect, useState } from 'react';
import api from '../api';
import blogPosts from '../data/blogPosts';
import LanguageToggle from '../components/LanguageToggle';

function LandingPage({ onLoginSuccess, onVisitorDemo, initialAuthMode, language, onLanguageChange }) {
  const isEnglish = language === 'en';
  const [mode, setMode] = useState('login');
  const [showAuth, setShowAuth] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('error');
  const [resetStep, setResetStep] = useState('email');
  const [resetForm, setResetForm] = useState({
    email: '',
    code: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [resetLoading, setResetLoading] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    if (initialAuthMode) {
      setMode(initialAuthMode);
      setShowAuth(true);
    }
  }, [initialAuthMode]);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  }

  function handleResetChange(event) {
    setResetForm({
      ...resetForm,
      [event.target.name]: event.target.value
    });
  }

  function openAuth(nextMode) {
    setMode(nextMode);
    setShowAuth(true);
    setMessage('');
    setMessageType('error');
  }

  function openForgotPassword() {
    setMode('forgot');
    setResetStep('email');
    setResetForm({
      email: form.email.includes('@') ? form.email : '',
      code: '',
      newPassword: '',
      confirmPassword: ''
    });
    setMessage('');
    setMessageType('error');
  }

  function backToLogin() {
    setMode('login');
    setMessage('');
    setMessageType('error');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    setMessageType('error');

    if (mode === 'register' && form.password !== form.confirmPassword) {
      setMessage(isEnglish ? 'Passwords do not match' : 'Mật khẩu xác nhận không khớp');
      return;
    }

    if (
      mode === 'register' &&
      (!form.fullName || !form.username || !form.email || !form.phone || !form.dateOfBirth)
    ) {
      setMessage(isEnglish ? 'Please fill in all registration fields' : 'Vui lòng nhập đủ thông tin đăng ký');
      return;
    }

    try {
      const url = mode === 'login' ? '/auth/login' : '/auth/register';
      const payload = mode === 'login'
        ? { email: form.email, password: form.password }
        : {
            fullName: form.fullName,
            username: form.username,
            email: form.email,
            phone: form.phone,
            dateOfBirth: form.dateOfBirth,
            password: form.password,
            confirmPassword: form.confirmPassword
          };

      const response = await api.post(url, payload);
      onLoginSuccess(response.data.user, mode);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  }

  async function handleForgotSubmit(event) {
    event.preventDefault();
    setMessage('');
    setMessageType('error');
    setResetLoading(true);

    try {
      if (resetStep === 'email') {
        if (!resetForm.email.includes('@')) {
          setMessage(isEnglish ? 'Enter a valid email' : 'Vui lòng nhập email hợp lệ');
          return;
        }

        const response = await api.post('/auth/forgot-password', { email: resetForm.email });
        setResetStep('code');
        setMessage(response.data.message);
        setMessageType('success');
        return;
      }

      if (resetStep === 'code') {
        const response = await api.post('/auth/verify-reset-code', {
          email: resetForm.email,
          code: resetForm.code
        });
        setResetStep('password');
        setMessage(response.data.message);
        setMessageType('success');
        return;
      }

      if (resetForm.newPassword.length < 6) {
        setMessage(isEnglish ? 'New password must have at least 6 characters' : 'Mật khẩu mới phải có ít nhất 6 ký tự');
        return;
      }

      if (resetForm.newPassword !== resetForm.confirmPassword) {
        setMessage(isEnglish ? 'Passwords do not match' : 'Mật khẩu xác nhận không khớp');
        return;
      }

      const response = await api.post('/auth/reset-password', {
        email: resetForm.email,
        code: resetForm.code,
        newPassword: resetForm.newPassword,
        confirmPassword: resetForm.confirmPassword
      });
      setMode('login');
      setForm({ ...form, email: resetForm.email, password: '', confirmPassword: '' });
      setMessage(response.data.message);
      setMessageType('success');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setResetLoading(false);
    }
  }

  return (
    <div className="landing">
      <header className="landing-header">
        <div className="landing-brand-group">
          <a className="landing-brand" href="#top">Fitness AI</a>
          <a className="landing-blog-link" href="/blog">Blog</a>
        </div>
        <nav className="landing-nav" aria-label="Điều hướng trang giới thiệu">
          <LanguageToggle language={language} onChange={onLanguageChange} />
          <button className="ghost-button" onClick={() => openAuth('login')}>
            {isEnglish ? 'Log in' : 'Đăng nhập'}
          </button>
          <button onClick={() => openAuth('register')}>{isEnglish ? 'Join Member' : 'Tham gia Member'}</button>
        </nav>
      </header>

      <main id="top" className="landing-main">
        <section className="landing-hero">
          <div className="landing-content">
            <p className="eyebrow">{isEnglish ? 'Personal training platform with AI' : 'Nền tảng tập luyện cá nhân với AI'}</p>
            <h1>{isEnglish ? 'Fitness AI helps you start the right way' : 'Fitness AI giúp bạn bắt đầu đúng cách'}</h1>
            <p>
              {isEnglish
                ? 'Assess your body, learn through exercise videos and get a plan that fits your goals, time and ability.'
                : 'Đánh giá thể trạng, học bài tập qua video và nhận kế hoạch phù hợp với mục tiêu, thời gian và khả năng của bạn.'}
            </p>

            <div className="hero-actions">
              <button onClick={onVisitorDemo}>{isEnglish ? 'Try Visitor' : 'Dùng thử Visitor'}</button>
              <a className="hero-link" href="#tinh-nang">{isEnglish ? 'Explore features' : 'Xem tính năng'}</a>
            </div>

            <div className="stats-row">
              <div>
                <strong>AI</strong>
                <span>{isEnglish ? 'Body assessment' : 'Đánh giá thể trạng'}</span>
              </div>
              <div>
                <strong>Video</strong>
                <span>{isEnglish ? 'Clear guidance' : 'Hướng dẫn dễ hiểu'}</span>
              </div>
              <div>
                <strong>24/7</strong>
                <span>{isEnglish ? 'Daily support' : 'Đồng hành mỗi ngày'}</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <section className="landing-visual-strip" aria-label="Các hình thức tập luyện">
        <article>
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=85"
            alt="Tập gym với tạ"
          />
          <div>
            <span>01</span>
            <strong>Gym</strong>
            <small>{isEnglish ? 'Build strength' : 'Tăng sức mạnh'}</small>
          </div>
        </article>
        <article>
          <img
            src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=900&q=85"
            alt="Tập calisthenics ngoài trời"
            onError={(event) => {
              event.currentTarget.src = 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=900&q=85';
            }}
          />
          <div>
            <span>02</span>
            <strong>Calisthenics</strong>
            <small>{isEnglish ? 'Master your body' : 'Làm chủ cơ thể'}</small>
          </div>
        </article>
        <article>
          <img
            src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=900&q=85"
            alt="Tập yoga và giãn cơ"
          />
          <div>
            <span>03</span>
            <strong>Yoga & giãn cơ</strong>
            <small>{isEnglish ? 'Recover better' : 'Phục hồi tốt hơn'}</small>
          </div>
        </article>
      </section>

      <section id="tinh-nang" className="program-section landing-section">
        <div className="section-heading">
          <p className="eyebrow">{isEnglish ? 'One account, many tools' : 'Một tài khoản, nhiều công cụ'}</p>
          <h2>{isEnglish ? 'What Fitness AI supports you with every day' : 'Những gì Fitness AI hỗ trợ bạn mỗi ngày'}</h2>
          <p>{isEnglish ? 'Choose your goal, update your data and let the system guide you step by step.' : 'Chọn mục tiêu của bạn, cập nhật dữ liệu và để hệ thống gợi ý từng bước phù hợp.'}</p>
        </div>

        <div className="program-grid feature-grid">
          <article>
            <span className="feature-number">01</span>
            <h3>{isEnglish ? 'Body assessment' : 'Đánh giá thể trạng'}</h3>
            <p>{isEnglish ? 'Enter your height, weight and goal to track BMI and find a suitable direction.' : 'Nhập chiều cao, cân nặng và mục tiêu để theo dõi BMI cùng hướng tập phù hợp.'}</p>
          </article>
          <article>
            <span className="feature-number">02</span>
            <h3>{isEnglish ? 'AI plan' : 'Kế hoạch AI'}</h3>
            <p>{isEnglish ? 'Get frequency, duration and schedule suggestions based on your availability.' : 'Gợi ý tần suất, thời lượng và lịch tập dựa trên thời gian rảnh của bạn.'}</p>
          </article>
          <article>
            <span className="feature-number">03</span>
            <h3>{isEnglish ? 'Workout videos' : 'Video bài tập'}</h3>
            <p>{isEnglish ? 'Learn gym, calisthenics, yoga and mobility with guidance by muscle group.' : 'Học gym, calisthenics, yoga và giãn cơ với hướng dẫn theo từng nhóm cơ.'}</p>
          </article>
          <article>
            <span className="feature-number">04</span>
            <h3>{isEnglish ? 'Habit tracking' : 'Theo dõi thói quen'}</h3>
            <p>{isEnglish ? 'Track sleep, meals and progress so tomorrow’s plan fits your reality better.' : 'Ghi nhận giấc ngủ, bữa ăn và tiến độ để kế hoạch ngày sau sát với thực tế hơn.'}</p>
          </article>
        </div>
      </section>

      <section className="blog-section">
        <div className="section-heading">
          <p className="eyebrow">{isEnglish ? 'Fitness AI knowledge' : 'Kiến thức Fitness AI'}</p>
          <h2>{isEnglish ? 'Read to train smarter' : 'Đọc để tập thông minh hơn'}</h2>
          <p>{isEnglish ? 'Short articles about your body, training technique and recovery habits.' : 'Những bài viết ngắn giúp bạn hiểu cơ thể, kỹ thuật tập và thói quen phục hồi.'}</p>
        </div>

        <div className="blog-grid">
          {blogPosts.slice(0, 3).map((post) => (
            <article className="blog-card" key={post.title}>
              <img src={post.image} alt={post.title} loading="lazy" />
              <div className="blog-card-content">
                  <span>{isEnglish ? post.categoryEn : post.category}</span>
                  <h3>{isEnglish ? post.titleEn : post.title}</h3>
                  <p>{isEnglish ? post.excerptEn : post.excerpt}</p>
                <div className="blog-card-footer">
                  <small>{post.readTime}</small>
                    <button className="text-button" type="button" onClick={() => setSelectedBlog(post)}>
                      {isEnglish ? 'Read article' : 'Đọc bài'}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="blog-section-footer">
          <a href="/blog">{isEnglish ? 'View all articles' : 'Xem tất cả bài viết'}</a>
        </div>
      </section>

      <section id="quyen-truy-cap" className="member-access-section">
        <div className="section-heading">
          <p className="eyebrow">{isEnglish ? 'Two ways to start' : 'Hai cách bắt đầu'}</p>
          <h2>{isEnglish ? 'Try as a Visitor, train fully as a Member' : 'Visitor dùng thử, Member tập luyện đầy đủ'}</h2>
          <p>{isEnglish ? 'Explore Fitness AI first, then become a Member to save your profile and unlock the full experience.' : 'Khám phá Fitness AI trước, sau đó đăng ký thành viên để lưu hồ sơ và mở toàn bộ trải nghiệm.'}</p>
        </div>

        <div className="member-access-grid">
          <article className="member-access-card visitor-card">
            <span className="access-label">Visitor</span>
            <h3>{isEnglish ? 'Explore first' : 'Khám phá trước'}</h3>
            <p>{isEnglish ? 'Try the main tools and see how Fitness AI can support you.' : 'Dùng thử các công cụ chính để hiểu cách Fitness AI hỗ trợ bạn.'}</p>
            <ul>
              <li>{isEnglish ? 'Try BMI and body assessment' : 'Dùng thử BMI và đánh giá thể trạng'}</li>
              <li>{isEnglish ? 'Browse and search workout videos' : 'Xem và tìm kiếm video bài tập'}</li>
              <li>{isEnglish ? 'Try creating a basic plan' : 'Thử tạo kế hoạch tập cơ bản'}</li>
              <li>{isEnglish ? 'Limited AI usage' : 'Lượt dùng AI có giới hạn'}</li>
            </ul>
            <button className="ghost-button" onClick={onVisitorDemo}>{isEnglish ? 'Try Visitor' : 'Dùng thử Visitor'}</button>
          </article>

          <article className="member-access-card member-card">
            <span className="access-label">Member</span>
            <h3>{isEnglish ? 'Full support' : 'Đồng hành đầy đủ'}</h3>
            <p>{isEnglish ? 'Sign up once to save your journey and use all personal features.' : 'Đăng ký một lần để lưu hành trình và sử dụng toàn bộ tính năng cá nhân.'}</p>
            <strong className="member-price">{isEnglish ? '$9.99 / month' : 'Khoảng 260.000 VNĐ / tháng'}</strong>
            <ul>
              <li>{isEnglish ? 'AI assessment and personal plans' : 'AI phân tích và tạo kế hoạch cá nhân'}</li>
              <li>{isEnglish ? 'Save profile, sleep and meal logs' : 'Lưu hồ sơ, giấc ngủ và nhật ký bữa ăn'}</li>
              <li>{isEnglish ? 'Analyze photos, meals and progress' : 'Phân tích ảnh, món ăn và tiến độ'}</li>
              <li>{isEnglish ? 'Adjust schedules from real feedback' : 'Điều chỉnh lịch theo phản hồi thực tế'}</li>
            </ul>
            <button onClick={() => openAuth('register')}>{isEnglish ? 'Become a Member' : 'Đăng ký Member'}</button>
          </article>
        </div>
      </section>

      <section className="landing-final-cta">
        <h2>{isEnglish ? 'Start your training journey' : 'Bắt đầu hành trình tập luyện của bạn'}</h2>
        <p>{isEnglish ? 'Become a Member to save your profile and receive a plan built around you.' : 'Đăng ký Member để lưu hồ sơ và nhận kế hoạch phù hợp với bạn.'}</p>
        <button onClick={() => openAuth('register')}>{isEnglish ? 'Become a Member' : 'Đăng ký Member'}</button>
      </section>

      {showAuth && (
        <div className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title">
          <section className="auth-box">
            <button className="auth-close-button" onClick={() => setShowAuth(false)} aria-label="Đóng">
              ×
            </button>
            <p className="eyebrow">{isEnglish ? 'Welcome to Fitness AI' : 'Chào mừng đến với Fitness AI'}</p>
            <h3 id="auth-title">
              {mode === 'login'
                ? (isEnglish ? 'Log in' : 'Đăng nhập')
                : mode === 'register'
                  ? (isEnglish ? 'Create an account' : 'Tạo tài khoản')
                  : (isEnglish ? 'Reset your password' : 'Khôi phục mật khẩu')}
            </h3>

            {mode === 'forgot' ? (
              <form onSubmit={handleForgotSubmit}>
                <p className="auth-helper-text">
                  {resetStep === 'email'
                    ? (isEnglish ? 'Enter your registered email to receive a verification code.' : 'Nhập email đã đăng ký để nhận mã xác minh 6 số.')
                    : resetStep === 'code'
                      ? (isEnglish ? 'Enter the code sent to your email.' : 'Nhập mã xác minh đã được gửi tới email của bạn.')
                      : (isEnglish ? 'Create a new password for your account.' : 'Tạo mật khẩu mới cho tài khoản của bạn.')}
                </p>

                {resetStep === 'email' && (
                  <label>
                    Email đăng ký
                    <input
                      name="email"
                      type="email"
                      value={resetForm.email}
                      onChange={handleResetChange}
                      placeholder="user@gmail.com"
                      autoFocus
                      required
                    />
                  </label>
                )}

                {resetStep === 'code' && (
                  <>
                    <label>
                      Mã xác minh
                      <input
                        name="code"
                        inputMode="numeric"
                        maxLength="6"
                        value={resetForm.code}
                        onChange={handleResetChange}
                        placeholder="Nhập 6 chữ số"
                        autoFocus
                        required
                      />
                    </label>
                    <small className="auth-muted-text">Mã chỉ có hiệu lực trong 10 phút.</small>
                  </>
                )}

                {resetStep === 'password' && (
                  <>
                    <label>
                      Mật khẩu mới
                      <input
                        name="newPassword"
                        type="password"
                        value={resetForm.newPassword}
                        onChange={handleResetChange}
                        placeholder="Ít nhất 6 ký tự"
                        autoFocus
                        required
                      />
                    </label>
                    <label>
                      Xác nhận mật khẩu mới
                      <input
                        name="confirmPassword"
                        type="password"
                        value={resetForm.confirmPassword}
                        onChange={handleResetChange}
                        placeholder="Nhập lại mật khẩu mới"
                        required
                      />
                    </label>
                  </>
                )}

                {message && <p className={messageType === 'success' ? 'form-success' : 'form-error'}>{message}</p>}

                <button type="submit" disabled={resetLoading}>
                  {resetLoading
                    ? 'Đang xử lý...'
                    : resetStep === 'email'
                      ? 'Gửi mã xác minh'
                      : resetStep === 'code'
                        ? 'Xác minh mã'
                        : 'Đặt lại mật khẩu'}
                </button>
              </form>
            ) : (
            <form onSubmit={handleSubmit}>
              {mode === 'register' && (
                <label>
                  {isEnglish ? 'Full name' : 'Họ và tên'}
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Nguyễn Văn A"
                    required
                  />
                </label>
              )}

              {mode === 'register' && (
                <label>
                  {isEnglish ? 'Username' : 'Tên đăng nhập'}
                  <input
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="thanhdanh"
                    required
                  />
                </label>
              )}

              <label>
                {mode === 'login'
                  ? (isEnglish ? 'Email or username' : 'Email hoặc tên đăng nhập')
                  : 'Email'}
                <input
                  name="email"
                  type={mode === 'login' ? 'text' : 'email'}
                  value={form.email}
                  onChange={handleChange}
                  placeholder={mode === 'login' ? 'user@gmail.com hoặc thanhdanh' : 'user@gmail.com'}
                  required
                />
              </label>

              {mode === 'register' && (
                <>
                  <label>
                    {isEnglish ? 'Phone number' : 'Số điện thoại'}
                    <input
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="0901234567"
                      required
                    />
                  </label>

                  <label>
                    {isEnglish ? 'Date of birth' : 'Ngày sinh'}
                    <input
                      name="dateOfBirth"
                      type="date"
                      value={form.dateOfBirth}
                      onChange={handleChange}
                      required
                    />
                  </label>

                </>
              )}

              <label>
                {isEnglish ? 'Password' : 'Mật khẩu'}
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu"
                  required
                />
              </label>

              {mode === 'register' && (
                <label>
                  {isEnglish ? 'Confirm password' : 'Xác nhận mật khẩu'}
                  <input
                    name="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder={isEnglish ? 'Re-enter password' : 'Nhập lại mật khẩu'}
                    required
                  />
                </label>
              )}

              {message && <p className={messageType === 'success' ? 'form-success' : 'form-error'}>{message}</p>}

              <button type="submit">
                {mode === 'login' ? (isEnglish ? 'Log in to the app' : 'Đăng nhập vào hệ thống') : (isEnglish ? 'Create account' : 'Đăng ký tài khoản')}
              </button>
            </form>
            )}

            {mode === 'login' && (
              <button className="text-button forgot-link" type="button" onClick={openForgotPassword}>
                Quên mật khẩu?
              </button>
            )}

            {mode !== 'forgot' ? (
              <button
                className="text-button"
                type="button"
                onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login');
                  setMessage('');
                  setMessageType('error');
                }}
              >
                {mode === 'login'
                  ? (isEnglish ? 'No account? Sign up' : 'Chưa có tài khoản? Đăng ký')
                  : (isEnglish ? 'Already have an account? Log in' : 'Đã có tài khoản? Đăng nhập')}
              </button>
            ) : (
              <button className="text-button" type="button" onClick={backToLogin}>
                Quay lại đăng nhập
              </button>
            )}
          </section>
        </div>
      )}

      {selectedBlog && (
        <div className="auth-modal blog-modal" role="dialog" aria-modal="true" aria-labelledby="blog-title">
          <article className="blog-detail-card">
            <button className="auth-close-button" onClick={() => setSelectedBlog(null)} aria-label="Đóng">
              ×
            </button>
            <span>{isEnglish ? selectedBlog.categoryEn : selectedBlog.category}</span>
            <h2 id="blog-title">{isEnglish ? selectedBlog.titleEn : selectedBlog.title}</h2>
            <small>{selectedBlog.readTime}</small>
            <p>{isEnglish ? selectedBlog.contentEn : selectedBlog.content}</p>
            <button type="button" onClick={() => setSelectedBlog(null)}>Đã hiểu</button>
          </article>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
