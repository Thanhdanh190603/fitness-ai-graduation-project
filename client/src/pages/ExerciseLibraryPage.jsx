import { useEffect, useState } from 'react';
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

const goalVideoGroups = {
  'Giảm mỡ': ['Ngực, vai và tay sau', 'Chân và mông', 'Cardio và core'],
  'Tăng cân tăng cơ': ['Ngực, vai và tay sau', 'Chân và mông', 'Lưng và tay trước'],
  'Tăng cơ giảm mỡ': ['Ngực, vai và tay sau', 'Chân và mông', 'Toàn thân'],
  'Cải thiện thể lực': ['Toàn thân', 'Ngực, vai và tay sau', 'Chân và mông'],
  'Tăng sức bền': ['Toàn thân', 'Cardio và core', 'Chân và mông'],
  'Tập calisthenics': ['Ngực, vai và tay sau', 'Lưng và tay trước', 'Chân và mông', 'Cardio và core']
};

const goalVideoDays = {
  'Giảm mỡ': [
    { day: 'Thứ 2', group: 'Ngực, vai và tay sau' },
    { day: 'Thứ 3', group: 'Chân và mông' },
    { day: 'Thứ 4', group: 'Cardio và core' },
    { day: 'Thứ 5', group: 'Toàn thân' },
    { day: 'Thứ 7', group: 'Cardio và core' }
  ],
  'Tăng cân tăng cơ': [
    { day: 'Thứ 2', group: 'Ngực, vai và tay sau' },
    { day: 'Thứ 3', group: 'Chân và mông' },
    { day: 'Thứ 5', group: 'Lưng và tay trước' },
    { day: 'Thứ 6', group: 'Toàn thân' },
    { day: 'Thứ 7', group: 'Ngực, vai và tay sau' }
  ],
  'Tăng cơ giảm mỡ': [
    { day: 'Thứ 2', group: 'Ngực, vai và tay sau' },
    { day: 'Thứ 3', group: 'Chân và mông' },
    { day: 'Thứ 5', group: 'Lưng và tay trước' },
    { day: 'Thứ 6', group: 'Toàn thân' },
    { day: 'Thứ 7', group: 'Cardio và core' }
  ],
  'Cải thiện thể lực': [
    { day: 'Thứ 2', group: 'Toàn thân' },
    { day: 'Thứ 4', group: 'Ngực, vai và tay sau' },
    { day: 'Thứ 6', group: 'Chân và mông' }
  ],
  'Tăng sức bền': [
    { day: 'Thứ 2', group: 'Toàn thân' },
    { day: 'Thứ 3', group: 'Cardio và core' },
    { day: 'Thứ 5', group: 'Chân và mông' },
    { day: 'Thứ 6', group: 'Ngực, vai và tay sau' },
    { day: 'Thứ 7', group: 'Toàn thân' }
  ],
  'Tập calisthenics': [
    { day: 'Thứ 2', group: 'Ngực, vai và tay sau' },
    { day: 'Thứ 3', group: 'Lưng và tay trước' },
    { day: 'Thứ 5', group: 'Chân và mông' },
    { day: 'Thứ 6', group: 'Cardio và core' },
    { day: 'Thứ 7', group: 'Toàn thân' }
  ]
};

function ExerciseLibraryPage({ user }) {
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadExercises() {
      try {
        const response = await api.get('/exercises');
        setExercises(response.data);
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Không thể tải thư viện bài tập');
      } finally {
        setLoading(false);
      }
    }

    loadExercises();
  }, []);

  const planGroups = goalVideoGroups[user?.goal] || [];
  const basePlanDays = goalVideoDays[user?.goal] || [];
  const userStorageId = user?.id || user?._id || user?.email || 'member';
  const currentWeek = Number(localStorage.getItem(`fitness-ai-current-week-${userStorageId}`)) || 1;
  const settingsStorageKey = `fitness-ai-settings-${userStorageId}-Member`;
  const scheduleStorageKey = `fitness-ai-busy-days-${userStorageId}-Member-${currentWeek}`;
  let savedSettings = {};
  let savedBusyDays = [];

  try {
    savedSettings = JSON.parse(localStorage.getItem(settingsStorageKey) || '{}');
    savedBusyDays = JSON.parse(localStorage.getItem(scheduleStorageKey) || '[]');
  } catch (storageError) {
    savedSettings = {};
    savedBusyDays = [];
  }

  const frequency = Number(savedSettings.frequency) || 5;
  const weekDays = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
  const sessionsForFrequency = basePlanDays.slice(0, frequency);
  const availableDays = weekDays.filter((day) => !savedBusyDays.includes(day));
  const hasBusyTrainingDay = savedBusyDays.some((day) => sessionsForFrequency.some((session) => session.day === day));
  const canReschedule = availableDays.length >= sessionsForFrequency.length;
  const planDays = hasBusyTrainingDay && canReschedule
    ? sessionsForFrequency.map((session, index) => ({ ...session, day: availableDays[index] }))
    : sessionsForFrequency;
  const activePlanGroups = planDays.map((planDay) => planDay.group);
  const selectedGroups = activePlanGroups.length > 0 ? activePlanGroups : planGroups;
  const recommendedExercises = exercises.filter((exercise) => selectedGroups.includes(exercise.muscleGroup));
  const visibleExercises = recommendedExercises.length > 0 ? recommendedExercises : exercises;
  const videoGroups = planDays
    .map((planDay) => ({
      ...planDay,
      exercises: visibleExercises.filter((exercise) => exercise.muscleGroup === planDay.group)
    }))
    .filter((planDay) => planDay.exercises.length > 0);

  return (
    <section className="exercise-library-page">
      <div className="exercise-library-heading">
        <div>
          <p className="eyebrow">THƯ VIỆN LUYỆN TẬP</p>
          <h2>Video bài tập</h2>
          <p>{user?.goal ? `Video được chọn theo lịch tập: ${user.goal}.` : 'Xem video hướng dẫn theo từng nhóm cơ và trình độ.'}</p>
        </div>
        <strong>{visibleExercises.length} bài tập</strong>
      </div>

      {loading && <div className="exercise-library-state">Đang tải thư viện bài tập...</div>}
      {error && <div className="exercise-library-state exercise-library-error">{error}</div>}
      {!loading && !error && visibleExercises.length === 0 && (
        <div className="exercise-library-state">Không tìm thấy bài tập phù hợp.</div>
      )}

      {!loading && !error && visibleExercises.length > 0 && (
        <div className="exercise-library-groups">
          {(videoGroups.length > 0 ? videoGroups : [{ day: 'Thư viện bài tập', group: '', exercises: visibleExercises }]).map((videoGroup) => (
            <section className="exercise-library-group" key={videoGroup.day}>
              <div className="exercise-library-group-heading">
                <h3>{videoGroup.group ? `${videoGroup.day} · ${videoGroup.group}` : videoGroup.day}</h3>
                <span>{videoGroup.exercises.length} video</span>
              </div>
              <div className="exercise-library-grid">
                {videoGroup.exercises.map((exercise) => (
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
                    <button type="button" onClick={() => setSelectedExercise(exercise)}>Xem hướng dẫn</button>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {selectedExercise && (
        <div className="exercise-video-modal" role="dialog" aria-modal="true" aria-labelledby="exercise-video-title">
          <div className="exercise-video-dialog">
            <button className="auth-close-button" type="button" onClick={() => setSelectedExercise(null)} aria-label="Đóng">×</button>
            <p className="eyebrow">{categoryLabels[selectedExercise.category] || selectedExercise.category}</p>
            <h2 id="exercise-video-title">{selectedExercise.name}</h2>
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
              <a href={selectedExercise.sourceUrl} target="_blank" rel="noreferrer">Xem nguồn video</a>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default ExerciseLibraryPage;
