import { useState } from 'react';
import blogPosts from '../data/blogPosts';
import LanguageToggle from '../components/LanguageToggle';

function BlogPage({ onBack, onRegister, language, onLanguageChange, isAuthenticated = false }) {
  const isEnglish = language === 'en';
  const [selectedBlog, setSelectedBlog] = useState(null);
  const latestPosts = blogPosts.filter((post) => post.isUpdate);

  return (
    <div className={`blog-page ${isAuthenticated ? 'member-content-page' : ''}`}>
      {!isAuthenticated && (
        <header className="blog-page-header">
          <button type="button" onClick={onBack}>← Fitness AI</button>
          <div>
            <LanguageToggle language={language} onChange={onLanguageChange} />
            <span>{isEnglish ? 'Training knowledge' : 'Kiến thức tập luyện'}</span>
            <button type="button" onClick={onRegister}>
              {isEnglish ? 'Become a Member' : 'Đăng ký Member'}
            </button>
          </div>
        </header>
      )}

      <main className="blog-page-main">
        <section className="blog-page-hero">
          <p className="eyebrow">{isAuthenticated ? 'MEMBER KNOWLEDGE CENTER' : 'FITNESS AI JOURNAL'}</p>
          <h1>{isAuthenticated
            ? (isEnglish ? 'Train with better information' : 'Tập luyện cùng thông tin đáng tin cậy')
            : (isEnglish ? 'Knowledge for smarter training' : 'Kiến thức để tập luyện thông minh hơn')}</h1>
          <p>{isAuthenticated
            ? (isEnglish ? 'Follow evidence-based updates and practical advice for your current training journey.' : 'Theo dõi cập nhật có căn cứ và lời khuyên thực tế phù hợp với hành trình tập luyện của bạn.')
            : (isEnglish ? 'Short articles about gym, calisthenics, nutrition and recovery for beginners.' : 'Những bài viết ngắn về gym, calisthenics, dinh dưỡng và phục hồi dành cho người mới bắt đầu.')}</p>
        </section>

        <section className="blog-page-list blog-latest">
          <div className="blog-page-list-heading">
            <div>
              <span className="eyebrow">{isEnglish ? 'Evidence-based updates' : 'Cập nhật có nguồn tham khảo'}</span>
              <h2>{isEnglish ? 'New advice for your training' : 'Xu hướng và lời khuyên mới'}</h2>
            </div>
            <small>{isEnglish ? 'Updated when reliable sources publish new guidance.' : 'Ưu tiên nội dung từ các tổ chức uy tín.'}</small>
          </div>

          <div className="blog-grid blog-page-grid">
            {latestPosts.map((post) => (
              <article className="blog-card" key={post.title}>
                <img src={post.image} alt={post.title} loading="lazy" />
                <div className="blog-card-content">
                  <span>{isEnglish ? post.categoryEn : post.category}</span>
                  <h3>{isEnglish ? post.titleEn : post.title}</h3>
                  <p>{isEnglish ? post.excerptEn : post.excerpt}</p>
                  <div className="blog-card-footer">
                    <small>{isEnglish ? `Updated ${post.publishedDate}` : `Cập nhật ${post.publishedDate}`}</small>
                    <button className="text-button" type="button" onClick={() => setSelectedBlog(post)}>
                      {isEnglish ? 'Read advice' : 'Xem lời khuyên'}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="blog-page-list">
          <div className="blog-page-list-heading">
            <div>
              <span className="eyebrow">{isEnglish ? 'New articles' : 'Bài viết mới'}</span>
              <h2>{isEnglish ? 'All articles' : 'Tất cả bài viết'}</h2>
            </div>
            <small>{blogPosts.length} {isEnglish ? 'articles available' : 'bài viết đang có'}</small>
          </div>

          <div className="blog-grid blog-page-grid">
            {blogPosts.map((post) => (
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
        </section>
      </main>

      {selectedBlog && (
        <div className="auth-modal blog-modal" role="dialog" aria-modal="true" aria-labelledby="blog-page-title">
          <article className="blog-detail-card">
            <button className="auth-close-button" onClick={() => setSelectedBlog(null)} aria-label="Đóng">×</button>
            <span>{isEnglish ? selectedBlog.categoryEn : selectedBlog.category}</span>
            <h2 id="blog-page-title">{isEnglish ? selectedBlog.titleEn : selectedBlog.title}</h2>
            <small>{selectedBlog.readTime}</small>
            <a className="blog-source-link" href={selectedBlog.sourceUrl} target="_blank" rel="noreferrer">
              {isEnglish ? `Reference: ${selectedBlog.sourceName}` : `Nguồn tham khảo: ${selectedBlog.sourceName}`}
            </a>
            <p>{isEnglish ? selectedBlog.contentEn : selectedBlog.content}</p>
            <button type="button" onClick={() => setSelectedBlog(null)}>{isEnglish ? 'Got it' : 'Đã hiểu'}</button>
          </article>
        </div>
      )}
    </div>
  );
}

export default BlogPage;
