import { useEffect, useState } from 'react';
import api from '../api';
import blogPosts from '../data/blogPosts';
import LanguageToggle from '../components/LanguageToggle';

function BlogPage({ onBack, onRegister, language, onLanguageChange, isAuthenticated = false }) {
  const isEnglish = language === 'en';
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [communityPosts, setCommunityPosts] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [form, setForm] = useState({ title: '', excerpt: '', content: '', category: '', image: '' });
  const [formMessage, setFormMessage] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const allPosts = [...communityPosts, ...blogPosts];
  const latestPosts = [...communityPosts, ...blogPosts.filter((post) => post.isUpdate)];

  useEffect(() => {
    async function loadPosts() {
      setLoadingPosts(true);

      try {
        const requests = [api.get('/blog')];
        if (isAuthenticated) {
          requests.push(api.get('/blog/mine'));
        }
        const responses = await Promise.all(requests);
        setCommunityPosts(responses[0].data);
        setMyPosts(responses[1]?.data || []);
      } catch (error) {
        setFormMessage(error.response?.data?.message || 'Không thể tải bài viết cộng đồng.');
      } finally {
        setLoadingPosts(false);
      }
    }

    loadPosts();
  }, [isAuthenticated]);

  function updateForm(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  async function submitPost(event) {
    event.preventDefault();
    setFormMessage('');
    setFormLoading(true);

    try {
      const response = await api.post('/blog', form);
      setMyPosts((currentPosts) => [response.data.post, ...currentPosts]);
      setForm({ title: '', excerpt: '', content: '', category: '', image: '' });
      setFormMessage(response.data.message);
    } catch (error) {
      setFormMessage(error.response?.data?.message || 'Không thể gửi bài viết.');
    } finally {
      setFormLoading(false);
    }
  }

  function getPostTitle(post) {
    return isEnglish && post.titleEn ? post.titleEn : post.title;
  }

  function getPostExcerpt(post) {
    return isEnglish && post.excerptEn ? post.excerptEn : post.excerpt;
  }

  function getPostContent(post) {
    return isEnglish && post.contentEn ? post.contentEn : post.content;
  }

  function renderPostCard(post) {
    return (
      <article className="blog-card" key={post._id || post.title}>
        {post.image && <img src={post.image} alt={getPostTitle(post)} loading="lazy" />}
        <div className="blog-card-content">
          <span>{isEnglish && post.categoryEn ? post.categoryEn : post.category}</span>
          <h3>{getPostTitle(post)}</h3>
          <p>{getPostExcerpt(post)}</p>
          <div className="blog-card-footer">
            <small>{post.publishedDate || post.readTime}</small>
            <div className="blog-card-footer-right">
              {post.author?.fullName && (
                <small className="blog-author-name">
                  {isEnglish ? 'By' : 'Tác giả'}: {post.author.fullName}
                </small>
              )}
              <button className="text-button" type="button" onClick={() => setSelectedBlog(post)}>
                {isEnglish ? 'Read article' : 'Đọc bài'}
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  }

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
            {latestPosts.map(renderPostCard)}
          </div>
        </section>

        <section className="blog-page-list">
          <div className="blog-page-list-heading">
            <div>
              <span className="eyebrow">{isEnglish ? 'New articles' : 'Bài viết mới'}</span>
              <h2>{isEnglish ? 'All articles' : 'Tất cả bài viết'}</h2>
            </div>
            <small>{loadingPosts ? '...' : allPosts.length} {isEnglish ? 'articles available' : 'bài viết đang có'}</small>
          </div>

          <div className="blog-grid blog-page-grid">
            {allPosts.map(renderPostCard)}
          </div>
        </section>

        {isAuthenticated && (
          <section className="blog-page-list blog-submit-section">
            <div className="blog-page-list-heading">
              <div>
                <span className="eyebrow">ĐÓNG GÓP CỘNG ĐỒNG</span>
                <h2>Chia sẻ bài viết của bạn</h2>
              </div>
              <small>Bài viết sẽ được admin kiểm duyệt trước khi công khai.</small>
            </div>
            <form className="blog-submit-form" onSubmit={submitPost}>
              <label>Tiêu đề<input name="title" value={form.title} onChange={updateForm} maxLength="140" required placeholder="Ví dụ: Cách tôi duy trì lịch tập" /></label>
              <label>Chuyên mục<input name="category" value={form.category} onChange={updateForm} maxLength="60" placeholder="Kinh nghiệm tập luyện" /></label>
              <label>Mô tả ngắn<textarea name="excerpt" value={form.excerpt} onChange={updateForm} maxLength="280" rows="2" required placeholder="Tóm tắt bài viết trong một vài câu" /></label>
              <label>Nội dung<textarea name="content" value={form.content} onChange={updateForm} maxLength="10000" rows="7" required placeholder="Chia sẻ kinh nghiệm, hướng dẫn hoặc câu chuyện tập luyện của bạn" /></label>
              <label>Ảnh đại diện (URL, không bắt buộc)<input name="image" value={form.image} onChange={updateForm} placeholder="https://..." /></label>
              {formMessage && <p className="blog-form-message">{formMessage}</p>}
              <button type="submit" disabled={formLoading}>{formLoading ? 'Đang gửi...' : 'Gửi bài chờ duyệt'}</button>
            </form>

            {myPosts.length > 0 && (
              <div className="blog-submission-list">
                <h3>Bài viết của bạn</h3>
                {myPosts.map((post) => (
                  <div className="blog-submission-row" key={post._id}>
                    <strong>{post.title}</strong>
                    <span className={`blog-status blog-status-${post.status}`}>
                      {post.status === 'approved' ? 'Đã duyệt' : post.status === 'rejected' ? 'Từ chối' : 'Chờ duyệt'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {selectedBlog && (
        <div className="auth-modal blog-modal" role="dialog" aria-modal="true" aria-labelledby="blog-page-title">
          <article className="blog-detail-card">
            <button className="auth-close-button" onClick={() => setSelectedBlog(null)} aria-label="Đóng">×</button>
            <span>{isEnglish ? selectedBlog.categoryEn : selectedBlog.category}</span>
            <h2 id="blog-page-title">{isEnglish ? selectedBlog.titleEn : selectedBlog.title}</h2>
            {selectedBlog.author?.fullName && (
              <small className="blog-detail-author">
                {isEnglish ? 'Author' : 'Tác giả'}: {selectedBlog.author.fullName}
              </small>
            )}
            <small>{selectedBlog.readTime || selectedBlog.publishedDate}</small>
            {selectedBlog.sourceUrl && <a className="blog-source-link" href={selectedBlog.sourceUrl} target="_blank" rel="noreferrer">
              {isEnglish ? `Reference: ${selectedBlog.sourceName}` : `Nguồn tham khảo: ${selectedBlog.sourceName}`}
            </a>}
            <p>{getPostContent(selectedBlog)}</p>
            <button type="button" onClick={() => setSelectedBlog(null)}>{isEnglish ? 'Got it' : 'Đã hiểu'}</button>
          </article>
        </div>
      )}
    </div>
  );
}

export default BlogPage;
