function LanguageToggle({ language, onChange }) {
  return (
    <div className="language-toggle" aria-label="Chọn ngôn ngữ">
      <button
        className={language === 'vi' ? 'active-language' : ''}
        type="button"
        onClick={() => onChange('vi')}
      >
        VN
      </button>
      <span>/</span>
      <button
        className={language === 'en' ? 'active-language' : ''}
        type="button"
        onClick={() => onChange('en')}
      >
        EN
      </button>
    </div>
  );
}

export default LanguageToggle;
