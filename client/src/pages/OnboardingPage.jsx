import { useState } from 'react';
import api from '../api';
import { calculateBmi } from '../utils/health';

function OnboardingPage({ user, onProfileSaved, onCancel, onBackHome, title, description, submitText }) {
  const [form, setForm] = useState({
    fullName: user.fullName || '',
    age: user.age || '',
    gender: user.gender || '',
    heightCm: user.heightCm || '',
    weightKg: user.weightKg || '',
    goal: user.goal || '',
    trainingLevel: user.trainingLevel || 'beginner'
  });
  const [imageName, setImageName] = useState('');
  const [bodyImages, setBodyImages] = useState([]);
  const [bodyImageType, setBodyImageType] = useState('front');
  const [removedImages, setRemovedImages] = useState([]);
  const [message, setMessage] = useState('');

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

  const currentImages = Array.isArray(user.bodyImageItems) && user.bodyImageItems.length > 0
    ? user.bodyImageItems
    : Array.isArray(user.bodyImages)
      ? user.bodyImages.map((imagePath) => ({ url: imagePath, type: 'unknown' }))
      : user.bodyImage
        ? [{ url: user.bodyImage, type: 'unknown' }]
        : [];
  const visibleCurrentImages = currentImages.filter((imageItem) => {
    return !removedImages.includes(imageItem.url);
  });

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');

    if (!form.age || !form.gender || !form.heightCm || !form.weightKg || !form.goal) {
      setMessage('Vui lòng nhập đủ thông tin bắt buộc');
      return;
    }

    try {
      const formData = new FormData();

      formData.append('fullName', form.fullName.trim());
      formData.append('age', Number(form.age));
      formData.append('gender', form.gender);
      formData.append('heightCm', Number(form.heightCm));
      formData.append('weightKg', Number(form.weightKg));
      formData.append('goal', form.goal);
      formData.append('trainingLevel', form.trainingLevel);
      formData.append('bodyImageType', bodyImageType);
      formData.append('removeBodyImages', JSON.stringify(removedImages));

      formData.append(
        'bodyImageTypes',
        JSON.stringify(bodyImages.map((imageItem) => imageItem.type))
      );

      bodyImages.forEach((imageItem) => {
        formData.append('bodyImages', imageItem.file);
      });

      const response = await api.put('/users/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      onProfileSaved(response.data.user);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  }

  const bmi = calculateBmi(form.heightCm, form.weightKg);

  return (
    <div className="onboarding-page">
      {onBackHome && (
        <button className="onboarding-back-button" type="button" onClick={onBackHome}>
          ← Quay lại trang chủ
        </button>
      )}
      <section className="onboarding-info">
        <p className="eyebrow">Bước đầu tiên</p>
        <h2>{title || 'Hoàn thiện hồ sơ thể trạng'}</h2>
        <p>
          {description ||
            'Thông tin này giúp hệ thống tính BMI và chuẩn bị kế hoạch tập luyện phù hợp hơn với mục tiêu của bạn.'}
        </p>

        <div className="note-box">
          <strong>Lưu ý:</strong>
          <span>
            BMI được tính bằng chiều cao và cân nặng. AI sẽ đối chiếu BMI với
            ảnh thể trạng; nếu hai nguồn dữ liệu quá lệch nhau, hệ thống sẽ
            yêu cầu bạn kiểm tra và nhập lại.
          </span>
        </div>
      </section>

      <form className="profile-form" onSubmit={handleSubmit}>
        <label>
          Họ tên hiển thị
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Ví dụ: Thành Danh"
          />
        </label>

        <div className="form-row">
          <label>
            Tuổi
            <input
              name="age"
              type="number"
              value={form.age}
              onChange={handleChange}
              placeholder="Ví dụ: 22"
            />
          </label>

          <label>
            Giới tính
            <select name="gender" value={form.gender} onChange={handleChange}>
              <option value="">Chọn giới tính</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </label>
        </div>

        <div className="form-row">
          <label>
            Chiều cao (cm)
            <input
              name="heightCm"
              type="number"
              value={form.heightCm}
              onChange={handleChange}
              placeholder="Ví dụ: 170"
            />
          </label>

          <label>
            Cân nặng (kg)
            <input
              name="weightKg"
              type="number"
              value={form.weightKg}
              onChange={handleChange}
              placeholder="Ví dụ: 68"
            />
          </label>
        </div>

        <label>
          Mục tiêu tập luyện
          <select name="goal" value={form.goal} onChange={handleChange}>
            <option value="">Chọn mục tiêu</option>
            <option value="Giảm mỡ">Giảm mỡ</option>
            <option value="Tăng cân tăng cơ">Tăng cân tăng cơ</option>
            <option value="Tăng cơ giảm mỡ">Tăng cơ giảm mỡ</option>
            <option value="Tăng sức bền">Tăng sức bền</option>
            <option value="Tập calisthenics">Tập calisthenics</option>
          </select>
        </label>

        <label>
          Trình độ hiện tại
          <select
            name="trainingLevel"
            value={form.trainingLevel}
            onChange={handleChange}
          >
            <option value="beginner">Mới bắt đầu</option>
            <option value="medium">Đã tập một thời gian</option>
            <option value="advanced">Nâng cao</option>
          </select>
        </label>

        <div className="form-row">
          <label>
            Loại ảnh mới
            <select
              value={bodyImageType}
              onChange={(event) => setBodyImageType(event.target.value)}
            >
              <option value="front">Chính diện</option>
              <option value="side">Góc nghiêng</option>
              <option value="back">Sau lưng</option>
              <option value="other">Ảnh khác</option>
            </select>
          </label>

          <label>
            Ảnh thể trạng ban đầu
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(event) => {
                const files = Array.from(event.target.files);
                const newImages = files.map((file) => ({
                  file,
                  type: bodyImageType
                }));
                const nextImages = [...bodyImages, ...newImages];
                setBodyImages(nextImages);
                setImageName(nextImages.map((imageItem) => imageItem.file.name).join(', '));
                event.target.value = '';
              }}
            />
          </label>
        </div>

        {imageName && <p className="small-text">Đã chọn ảnh mới: {imageName}</p>}

        {bodyImages.length > 0 && (
          <div className="selected-image-box">
            <p>Ảnh mới sẽ thêm</p>
            {bodyImages.map((imageItem, index) => (
              <div className="selected-image-row" key={`${imageItem.file.name}-${index}`}>
                <span>{imageItem.file.name}</span>
                <strong>{getImageTypeLabel(imageItem.type)}</strong>
                <button
                  type="button"
                  className="danger-button"
                  onClick={() => {
                    const nextImages = bodyImages.filter((_, itemIndex) => itemIndex !== index);
                    setBodyImages(nextImages);
                    setImageName(nextImages.map((item) => item.file.name).join(', '));
                  }}
                >
                  Bỏ
                </button>
              </div>
            ))}
          </div>
        )}

        {visibleCurrentImages.length > 0 && (
          <div className="current-image-box">
            <p>Ảnh hiện tại</p>
            <div className="current-image-grid">
              {visibleCurrentImages.map((imageItem) => (
                <div className="current-image-item" key={imageItem.url}>
                  <img
                    src={`http://localhost:5000${imageItem.url}`}
                    alt="Ảnh thể trạng hiện tại"
                  />
                  <span className="image-type-tag">
                    {getImageTypeLabel(imageItem.type)}
                  </span>
                  <button
                    type="button"
                    className="danger-button"
                    onClick={() => setRemovedImages([...removedImages, imageItem.url])}
                  >
                    Xóa ảnh này
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {removedImages.length > 0 && (
          <p className="small-text">
            {removedImages.length} ảnh sẽ bị xóa sau khi bấm lưu.
          </p>
        )}

        {bmi && (
          <div className="bmi-preview">
            BMI tạm tính: <strong>{bmi}</strong>
          </div>
        )}

        {message && <p className="form-error">{message}</p>}

        <div className="form-actions">
          {onCancel && (
            <button type="button" className="ghost-button" onClick={onCancel}>
              Hủy
            </button>
          )}
          <button type="submit">{submitText || 'Lưu hồ sơ và vào dashboard'}</button>
        </div>
      </form>
    </div>
  );
}

export default OnboardingPage;
