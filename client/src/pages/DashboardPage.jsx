import { useState } from 'react';
import api from '../api';
import AiPtChat from '../components/AiPtChat';
import AiPlanPage from './AiPlanPage';
import BlogPage from './BlogPage';
import ExerciseLibraryPage from './ExerciseLibraryPage';
import PremiumPage from './PremiumPage';
import TrainingHubPage from './TrainingHubPage';
import { calculateBmi, getBmiLabel } from '../utils/health';

function DashboardPage({
  user,
  onUserUpdated,
  onLogout,
  onEditProfile,
  onUpgradeMember,
  language,
  onLanguageChange
}) {
  const [activePage, setActivePage] = useState('dashboard');
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const isMember = user.membershipStatus === 'active' || user.role === 'admin';

  const bmi = calculateBmi(user.heightCm, user.weightKg);
  function getImageTypeLabel(type) {
    if (type === 'front') {
      return 'Chính diện';
    }

    if (type === 'side') {
      return 'Góc nghiêng';
    }

    if (type === 'back') {
      return 'Sau lưng';
    }

    if (type === 'other') {
      return 'Ảnh khác';
    }

    return 'Chưa phân loại';
  }

  const bodyImages = Array.isArray(user.bodyImageItems) && user.bodyImageItems.length > 0
    ? user.bodyImageItems
    : Array.isArray(user.bodyImages)
      ? user.bodyImages.map((imagePath) => ({ url: imagePath, type: 'unknown' }))
      : user.bodyImage
        ? [{ url: user.bodyImage, type: 'unknown' }]
        : [];

  async function handleFreeAnalysis() {
    setAiLoading(true);
    setAiError('');

    try {
      const response = await api.post('/ai/free-analysis');
      setAiAnalysis(response.data);
    } catch (error) {
      setAiError(error.response?.data?.message || 'Không thể phân tích AI');
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <h1>Fitness AI</h1>
        <nav>
          <button
            className={activePage === 'dashboard' ? 'active-nav' : ''}
            onClick={() => setActivePage('dashboard')}
          >
            <span className="nav-icon" aria-hidden="true">⌂</span>
            Dashboard
          </button>
          <button
            className={activePage === 'ai-plan' ? 'active-nav' : ''}
            onClick={() => isMember ? setActivePage('ai-plan') : onUpgradeMember()}
          >
            <span className="nav-icon" aria-hidden="true">▤</span>
            Kế hoạch AI
          </button>
          <button
            className={activePage === 'exercises' ? 'active-nav' : ''}
            onClick={() => setActivePage('exercises')}
          >
            <span className="nav-icon" aria-hidden="true">▶</span>
            Video bài tập
          </button>
          <button
            className={activePage === 'blog' ? 'active-nav' : ''}
            onClick={() => setActivePage('blog')}
          >
            <span className="nav-icon" aria-hidden="true">✦</span>
            Blog
          </button>
          {isMember && (
            <button
              className={activePage === 'training-hub' ? 'active-nav' : ''}
              onClick={() => setActivePage('training-hub')}
            >
              <span className="nav-icon" aria-hidden="true">◎</span>
              Trung tâm tập luyện
            </button>
          )}
          <button
            className={activePage === 'premium' ? 'active-nav' : ''}
            onClick={() => isMember ? setActivePage('premium') : onUpgradeMember()}
          >
            <span className="nav-icon" aria-hidden="true">✧</span>
            Trợ lý AI
          </button>
          {user.role === 'admin' && <button><span className="nav-icon" aria-hidden="true">⚙</span>Admin</button>}
        </nav>
        <div className="sidebar-plan">
          <span>Tài khoản:</span>
          <strong>{isMember ? 'Member' : 'Visitor'}</strong>
          {!isMember && (
            <button className="sidebar-upgrade-button" type="button" onClick={onUpgradeMember}>
              Mua Member
            </button>
          )}
        </div>
      </aside>

      <main className="main">
        <section className="topbar">
          <div>
            <p className="eyebrow">
              Xin chào, <strong className="welcome-name">{user.fullName}</strong>
            </p>
            {activePage !== 'premium' && (
              <h2>Website hướng dẫn tập luyện thể thao</h2>
            )}
          </div>
          <button onClick={onLogout}>Đăng xuất</button>
        </section>

        {activePage === 'blog' ? (
          <BlogPage
            onBack={() => setActivePage('dashboard')}
            onRegister={() => setActivePage('dashboard')}
            language={language}
            onLanguageChange={onLanguageChange}
            isAuthenticated
          />
        ) : activePage === 'exercises' ? (
          <ExerciseLibraryPage user={user} />
        ) : activePage === 'training-hub' ? (
          <TrainingHubPage
            language={language}
            user={user}
          />
        ) : activePage === 'premium' ? (
          <PremiumPage user={user} />
        ) : activePage === 'ai-plan' ? (
          <AiPlanPage user={user} />
        ) : (
          <>
        <section className="grid">
          <div className="card">
            <h3>BMI & Kế hoạch AI</h3>
            {bmi ? (
              <div className="bmi-card">
                <strong>{bmi}</strong>
                <span>{getBmiLabel(bmi, user.age)}</span>
              </div>
            ) : (
              <p>Chưa có dữ liệu BMI.</p>
            )}
          </div>
          <div className="card">
            <h3>Mục tiêu tập luyện</h3>
            <p>{user.goal || 'Chưa cập nhật mục tiêu'}</p>
          </div>
          <div className="card">
            <h3>{isMember ? 'Quyền Member' : 'Quyền Visitor'}</h3>
            <p>{isMember ? 'Đã mở đầy đủ tính năng cá nhân.' : 'Đang dùng các tính năng giới hạn.'}</p>
            <p>{isMember ? 'Hồ sơ và tiến độ được lưu theo tài khoản.' : 'Nâng cấp Member để mở toàn bộ AI PT.'}</p>
          </div>
        </section>

        <section className="dashboard-section">
          <div className="section-title">
            <div>
              <h3>Thông tin thể trạng</h3>
              <p>Dữ liệu này được dùng để tạo kế hoạch tập luyện phù hợp.</p>
            </div>
            <button className="ghost-button" onClick={onEditProfile}>
              Chỉnh sửa hồ sơ
            </button>
          </div>

          <div className="profile-grid">
            <div>
              <span>Tuổi</span>
              <strong>{user.age || 'Chưa có'}</strong>
            </div>
            <div>
              <span>Giới tính</span>
              <strong>
                {user.gender === 'male'
                  ? 'Nam'
                  : user.gender === 'female'
                    ? 'Nữ'
                    : 'Khác'}
              </strong>
            </div>
            <div>
              <span>Chiều cao</span>
              <strong>{user.heightCm} cm</strong>
            </div>
            <div>
              <span>Cân nặng</span>
              <strong>{user.weightKg} kg</strong>
            </div>
            <div>
              <span>Trình độ</span>
              <strong>
                {user.trainingLevel === 'beginner'
                  ? 'Mới bắt đầu'
                  : user.trainingLevel === 'medium'
                    ? 'Đã tập một thời gian'
                    : 'Nâng cao'}
              </strong>
            </div>
          </div>

          {bodyImages.length > 0 && (
            <div className="body-image-section">
              <h4>Ảnh thể trạng ban đầu</h4>
              <div className="body-image-grid">
                {bodyImages.map((imageItem) => (
                  <div className="body-image-box" key={imageItem.url}>
                    <img
                      src={`http://localhost:5000${imageItem.url}`}
                      alt="Ảnh thể trạng"
                    />
                    <span className="image-type-tag">
                      {getImageTypeLabel(imageItem.type)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="dashboard-section">
          <div className="section-title">
            <h3>Đánh giá thể trạng</h3>
            <p>
              Nhận phân tích tổng quát dựa trên BMI, mục tiêu, trình độ và ảnh
              thể trạng đã gửi.
            </p>
          </div>

          <div className="next-actions">
            <button onClick={handleFreeAnalysis}>
              {aiLoading
                ? 'Đang phân tích...'
                : 'Dùng AI để đánh giá'}
            </button>
          </div>

          {aiError && <p className="form-error">{aiError}</p>}

          {aiAnalysis && (
            <div className="ai-result">
              <div className="section-title">
                <div>
                  <h3>{aiAnalysis.title}</h3>
                  <p>{aiAnalysis.summary}</p>
                </div>
                <span className="ai-badge">AI Member</span>
              </div>

              <div className="ai-overview">
                <div>
                  <span>BMI</span>
                  <strong>{aiAnalysis.bmi}</strong>
                </div>
                <div>
                  <span>Tình trạng</span>
                  <strong>{aiAnalysis.bmiStatus}</strong>
                </div>
                <div>
                  <span>Số ảnh đã gửi</span>
                  <strong>{aiAnalysis.imageCount}</strong>
                </div>
              </div>

              <ul className="ai-advice-list">
                {aiAnalysis.advice.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              {aiAnalysis.imageAnalysis && (
                <div className="image-ai-box">
                  <h4>Nhận xét từ ảnh thể trạng</h4>

                  {aiAnalysis.imageAnalysis.bodyType && (
                    <div className="body-type-result">
                      <span>Tạng người tham khảo</span>
                      <strong>{aiAnalysis.imageAnalysis.bodyType}</strong>
                      {aiAnalysis.imageAnalysis.bodyTypeReason && (
                        <p>{aiAnalysis.imageAnalysis.bodyTypeReason}</p>
                      )}
                    </div>
                  )}

                  <p>{aiAnalysis.imageAnalysis.visualSummary}</p>

                  <div className="image-ai-grid">
                    <div>
                      <h5>Tư thế tổng quan</h5>
                      <ul>
                        {aiAnalysis.imageAnalysis.postureNotes.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5>Ưu tiên cải thiện</h5>
                      <ul>
                        {aiAnalysis.imageAnalysis.priorityFocus.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5>Hướng tập luyện</h5>
                      <ul>
                        {aiAnalysis.imageAnalysis.trainingDirection.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <p className="small-text">{aiAnalysis.imageAnalysis.safetyNote}</p>
                </div>
              )}

            </div>
          )}
        </section>

          </>
        )}
      </main>
      {isMember && <AiPtChat user={user} />}
    </div>
  );
}

export default DashboardPage;
