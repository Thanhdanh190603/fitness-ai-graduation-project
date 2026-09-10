import { useEffect, useState } from 'react';
import api from './api';
import BlogPage from './pages/BlogPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import AdminPage from './pages/AdminPage';
import DashboardPage from './pages/DashboardPage';
import LandingPage from './pages/LandingPage';
import MemberSignupPage from './pages/MemberSignupPage';
import OnboardingPage from './pages/OnboardingPage';
import VisitorDemoPage from './pages/VisitorDemoPage';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [visitorDemo, setVisitorDemo] = useState(false);
  const [showMemberSignup, setShowMemberSignup] = useState(false);
  const [landingAuthMode, setLandingAuthMode] = useState('');
  const [publicPath, setPublicPath] = useState(window.location.pathname);
  const [language, setLanguage] = useState(() => localStorage.getItem('fitness-ai-language') || 'vi');

  useEffect(() => {
    async function checkLogin() {
      try {
        const response = await api.get('/auth/me');
        setUser(response.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    checkLogin();
  }, []);

  useEffect(() => {
    function handlePopState() {
      setPublicPath(window.location.pathname);
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  function navigatePublicPage(path) {
    window.history.pushState({}, '', path);
    setPublicPath(path);
    setVisitorDemo(false);
  }

  function changeLanguage(nextLanguage) {
    setLanguage(nextLanguage);
    localStorage.setItem('fitness-ai-language', nextLanguage);
  }

  async function handleLogout() {
    await api.post('/auth/logout');
    setUser(null);
    setEditingProfile(false);
    setShowMemberSignup(false);
  }

  function handleAuthSuccess(nextUser, authMode) {
    setUser(nextUser);
    setShowMemberSignup(
      nextUser.membershipStatus !== 'active'
      && (authMode === 'register' || authMode === 'login')
    );
  }

  if (loading) {
    return <div className="loading">Đang kiểm tra đăng nhập...</div>;
  }

  if (!user) {
    if (publicPath === '/blog') {
      return (
        <BlogPage
          onBack={() => navigatePublicPage('/')}
          language={language}
          onLanguageChange={changeLanguage}
          onRegister={() => {
            navigatePublicPage('/');
            setLandingAuthMode('register');
          }}
        />
      );
    }

    return visitorDemo ? (
      <VisitorDemoPage
        onBack={() => setVisitorDemo(false)}
        language={language}
        onLanguageChange={changeLanguage}
        onLogin={() => {
          setVisitorDemo(false);
          setLandingAuthMode('register');
        }}
      />
    ) : (
      <LandingPage
        onLoginSuccess={handleAuthSuccess}
        onVisitorDemo={() => setVisitorDemo(true)}
        initialAuthMode={landingAuthMode}
        language={language}
        onLanguageChange={changeLanguage}
      />
    );
  }

  if (user.role === 'admin') {
    return <AdminPage user={user} onLogout={handleLogout} />;
  }

  if (user.mustChangePassword) {
    return (
      <ChangePasswordPage
        user={user}
        onPasswordChanged={setUser}
        onLogout={handleLogout}
      />
    );
  }

  if (showMemberSignup && user.membershipStatus !== 'active') {
    return (
      <MemberSignupPage
        user={user}
        language={language}
        onLanguageChange={changeLanguage}
        onMemberActivated={(updatedUser) => {
          setUser(updatedUser);
          setShowMemberSignup(false);
        }}
        onLogout={handleLogout}
        onCancel={handleLogout}
      />
    );
  }

  if (!user.heightCm || !user.weightKg) {
    return <OnboardingPage user={user} onProfileSaved={setUser} onBackHome={handleLogout} />;
  }

  if (editingProfile) {
    return (
      <OnboardingPage
        user={user}
        onProfileSaved={(updatedUser) => {
          setUser(updatedUser);
          setEditingProfile(false);
        }}
        onCancel={() => setEditingProfile(false)}
        title="Chỉnh sửa hồ sơ thể trạng"
        description="Bạn có thể cập nhật lại chỉ số cơ thể và mục tiêu tập luyện khi có thay đổi."
        submitText="Lưu thay đổi"
      />
    );
  }

  return (
    <DashboardPage
      user={user}
      onUserUpdated={setUser}
      onLogout={handleLogout}
      onEditProfile={() => setEditingProfile(true)}
      onUpgradeMember={() => setShowMemberSignup(true)}
      language={language}
      onLanguageChange={changeLanguage}
    />
  );
}

export default App;
