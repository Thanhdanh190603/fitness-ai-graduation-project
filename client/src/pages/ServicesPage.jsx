import LanguageToggle from '../components/LanguageToggle';

function ServicesPage({ onBack, onRegister, onVisitorDemo, language, onLanguageChange, isAuthenticated = false }) {
  const isEnglish = language === 'en';
  const services = [
    {
      number: '01',
      category: 'Thể trạng',
      title: 'Đánh giá thể trạng cùng AI',
      description: 'Nhập chiều cao, cân nặng, tuổi, mục tiêu và ảnh thể trạng để có hướng tập phù hợp hơn.',
      details: ['BMI tham khảo', 'Nhận xét thể trạng', 'Xác định ưu tiên cải thiện']
    },
    {
      number: '02',
      category: 'Kế hoạch',
      title: 'Lịch tập cá nhân',
      description: 'AI sắp xếp tần suất, thời lượng, ngày bận và bài tập theo mục tiêu của từng Member.',
      details: ['Tùy chỉnh số buổi', 'Đánh dấu buổi đã tập', 'Điều chỉnh lịch theo phản hồi']
    },
    {
      number: '03',
      category: 'Thư viện',
      title: 'Video gym và calisthenics',
      description: 'Tìm bài tập theo nhóm cơ và học các động tác gym, calisthenics, yoga và giãn cơ.',
      details: ['Tìm theo nhóm cơ', 'Hướng dẫn từng bài', 'Nội dung cho người mới']
    },
    {
      number: '04',
      category: 'Sức khỏe',
      title: 'Theo dõi ăn, ngủ và hồi phục',
      description: 'Ghi lại bữa ăn, giờ ngủ và lượng nước để kế hoạch hằng ngày sát với cơ thể hơn.',
      details: ['Ước tính kcal', 'Cảnh báo thiếu ngủ', 'Gợi ý phục hồi']
    }
  ];

  return (
    <div className={`services-page ${isAuthenticated ? 'member-content-page' : ''}`}>
      {!isAuthenticated && (
        <header className="services-page-header">
          <button type="button" onClick={onBack}>← Fitness AI</button>
          <div>
            <LanguageToggle language={language} onChange={onLanguageChange} />
            <a href="/blog">Blog</a>
            <button type="button" onClick={onRegister}>
              {isEnglish ? 'Become a Member' : 'Đăng ký Member'}
            </button>
          </div>
        </header>
      )}

      <main className="services-page-main">
        <section className="services-page-hero">
          <p className="eyebrow">{isAuthenticated ? 'MEMBER SERVICES' : 'FITNESS AI SERVICES'}</p>
          <h1>{isAuthenticated
            ? (isEnglish ? 'Your training tools in one place' : 'Các công cụ tập luyện của bạn trong một nơi')
            : (isEnglish ? 'Tools that give your training direction' : 'Những công cụ giúp bạn tập luyện có định hướng')}</h1>
          <p>{isAuthenticated
            ? (isEnglish ? 'Open your plan, update your profile and use the services that support your progress.' : 'Mở kế hoạch, cập nhật hồ sơ và sử dụng các dịch vụ hỗ trợ tiến độ của bạn.')
            : (isEnglish ? 'From body assessment to schedules and recovery habits, Fitness AI brings every important step into one clear journey.' : 'Từ đánh giá thể trạng đến lịch tập và thói quen phục hồi, Fitness AI gom mọi bước cần thiết vào một hành trình rõ ràng.')}</p>
        </section>

        <section className="services-page-list">
          <div className="services-page-heading">
            <span className="eyebrow">{isEnglish ? 'The Fitness AI ecosystem' : 'Hệ sinh thái Fitness AI'}</span>
            <h2>{isEnglish ? 'Our services' : 'Các dịch vụ của chúng tôi'}</h2>
          </div>

          <div className="services-grid">
            {services.map((service) => (
              <article className="service-detail-card" key={service.number}>
                <span className="service-detail-number">{service.number}</span>
                <span className="service-detail-category">{service.category}</span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <ul>
                  {service.details.map((detail) => <li key={detail}>{detail}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="services-page-cta">
          <div>
            <span className="eyebrow">{isAuthenticated ? 'MEMBER JOURNEY' : (isEnglish ? 'Start your way' : 'Bắt đầu theo cách của bạn')}</span>
            <h2>{isAuthenticated
              ? (isEnglish ? 'Keep building your routine' : 'Tiếp tục xây dựng thói quen tập luyện')
              : (isEnglish ? 'Try Visitor or become a Member' : 'Thử Visitor hoặc đăng ký Member')}</h2>
          </div>
          <div>
            {!isAuthenticated && (
              <button className="ghost-button" type="button" onClick={onVisitorDemo}>{isEnglish ? 'Try Visitor' : 'Dùng thử Visitor'}</button>
            )}
            <button type="button" onClick={isAuthenticated ? onBack : onRegister}>
              {isAuthenticated ? (isEnglish ? 'Back to dashboard' : 'Về Dashboard') : (isEnglish ? 'Become a Member' : 'Đăng ký Member')}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ServicesPage;
