import { useEffect, useMemo, useState } from 'react';
import api from '../api';

const categoryLabels = {
  gym: 'Gym',
  calisthenics: 'Calisthenics',
  yoga: 'Yoga',
  stretching: 'Giãn cơ',
  kegel: 'Kegel'
};

const levelLabels = {
  beginner: 'Mới bắt đầu',
  medium: 'Trung bình',
  advanced: 'Nâng cao'
};

const goalSuggestions = {
  'Giảm mỡ': ['Cardio và core', 'Toàn thân', 'Chân và mông'],
  'Tăng cân tăng cơ': ['Ngực, vai và tay sau', 'Chân và mông', 'Lưng và tay trước'],
  'Tăng cơ giảm mỡ': ['Ngực, vai và tay sau', 'Chân và mông', 'Toàn thân'],
  'Cải thiện thể lực': ['Toàn thân', 'Cardio và core', 'Chân và mông'],
  'Tăng sức bền': ['Toàn thân', 'Cardio và core', 'Chân và mông'],
  'Tập calisthenics': ['Ngực, vai và tay sau', 'Lưng và tay trước', 'Chân và mông']
};

function isPublicVideo(exercise) {
  const videoUrl = String(exercise.videoUrl || '').toLowerCase();
  const sourceUrl = String(exercise.sourceUrl || '').toLowerCase();
  return Boolean(videoUrl)
    && !videoUrl.includes('private')
    && !sourceUrl.includes('private')
    && !videoUrl.includes('youtube.com/shorts/');
}

function VideoLibraryPage({ user }) {
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [category, setCategory] = useState('all');
  const [muscleGroup, setMuscleGroup] = useState('all');
  const [level, setLevel] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadExercises() {
      try {
        const response = await api.get('/exercises');
        setExercises(response.data.filter(isPublicVideo));
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Không thể tải thư viện bài tập');
      } finally {
        setLoading(false);
      }
    }

    loadExercises();
  }, []);

  const muscleGroups = useMemo(() => (
    [...new Set(exercises.map((exercise) => exercise.muscleGroup).filter(Boolean))].sort()
  ), [exercises]);

  const suggestedGroups = goalSuggestions[user?.goal] || [];

  const visibleExercises = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();

    return exercises.filter((exercise) => {
      const searchableText = [exercise.name, exercise.muscleGroup, exercise.description]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return (!keyword || searchableText.includes(keyword))
        && (category === 'all' || exercise.category === category)
        && (muscleGroup === 'all' || exercise.muscleGroup === muscleGroup)
        && (level === 'all' || exercise.level === level);
    });
  }, [category, exercises, level, muscleGroup, searchText]);

  return (
    <section className="exercise-library-page video-library-page">
      <div className="exercise-library-heading">
        <div>
          <p className="eyebrow">KHO BÀI TẬP</p>
          <h2>Thư viện video</h2>
          <p>Tìm nhanh bài tập theo tên, nhóm cơ, mục tiêu hoặc trình độ.</p>
        </div>
        <strong>{visibleExercises.length} video</strong>
      </div>

      <div className="exercise-library-filters video-library-filters">
        <label>
          Tìm bài tập
          <input
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Ví dụ: tay sau, squat, plank"
          />
        </label>
        <label>
          Nhóm cơ / mục tiêu
          <select value={muscleGroup} onChange={(event) => setMuscleGroup(event.target.value)}>
            <option value="all">Tất cả nhóm cơ</option>
            {muscleGroups.map((group) => <option key={group} value={group}>{group}</option>)}
          </select>
        </label>
        <label>
          Loại bài tập
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="all">Tất cả loại</option>
            {Object.entries(categoryLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
        <label>
          Trình độ
          <select value={level} onChange={(event) => setLevel(event.target.value)}>
            <option value="all">Tất cả trình độ</option>
            {Object.entries(levelLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
      </div>

      {suggestedGroups.length > 0 && (
        <div className="video-library-suggestions">
          <span>Gợi ý theo mục tiêu: <strong>{user.goal}</strong></span>
          <div>
            {suggestedGroups.map((group) => (
              <button type="button" key={group} onClick={() => setMuscleGroup(group)}>
                {group}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && <div className="exercise-library-state">Đang tải thư viện bài tập...</div>}
      {error && <div className="exercise-library-state exercise-library-error">{error}</div>}
      {!loading && !error && visibleExercises.length === 0 && (
        <div className="exercise-library-state">Không tìm thấy video phù hợp. Hãy thử đổi từ khóa hoặc bộ lọc.</div>
      )}

      {!loading && !error && visibleExercises.length > 0 && (
        <div className="exercise-library-grid video-library-grid">
          {visibleExercises.map((exercise) => (
            <article className="exercise-library-card" key={exercise._id}>
              <div className="exercise-card-topline">
                <span>{categoryLabels[exercise.category] || exercise.category}</span>
                <small>{levelLabels[exercise.level] || exercise.level}</small>
              </div>
              <h3>{exercise.name}</h3>
              <p className="exercise-muscle">{exercise.muscleGroup}</p>
              <p>{exercise.description}</p>
              <div className="exercise-card-details">
                <span>{exercise.sets} hiệp</span>
                <span>{exercise.reps}</span>
                <span>Nghỉ {exercise.restSeconds}s</span>
              </div>
              <button type="button" onClick={() => setSelectedExercise(exercise)}>Xem video</button>
            </article>
          ))}
        </div>
      )}

      {selectedExercise && (
        <div className="exercise-video-modal" role="dialog" aria-modal="true" aria-labelledby="library-video-title">
          <div className="exercise-video-dialog">
            <button className="auth-close-button" type="button" onClick={() => setSelectedExercise(null)} aria-label="Đóng">×</button>
            <p className="eyebrow">{categoryLabels[selectedExercise.category] || selectedExercise.category}</p>
            <h2 id="library-video-title">{selectedExercise.name}</h2>
            <div className="exercise-video-frame">
              <iframe
                src={selectedExercise.videoUrl}
                title={`Video hướng dẫn ${selectedExercise.name}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <div className="exercise-video-meta">
              <span>Nhóm cơ: {selectedExercise.muscleGroup}</span>
              <span>{selectedExercise.sets} hiệp x {selectedExercise.reps}</span>
              <span>Nghỉ {selectedExercise.restSeconds} giây</span>
            </div>
            {selectedExercise.sourceUrl && (
              <a href={selectedExercise.sourceUrl} target="_blank" rel="noreferrer">Mở nguồn video</a>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default VideoLibraryPage;
