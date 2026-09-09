import { useEffect, useMemo, useState } from 'react';
import api from '../api';
import { goalWorkoutPlans } from '../data/workoutSchedule';

const goalGuides = {
  'Cải thiện thể lực': {
    label: 'Cải thiện thể lực',
    title: 'Xây nền thể lực toàn diện',
    exercise: '2-3 buổi sức mạnh toàn thân, xen kẽ đi bộ nhanh hoặc cardio nhẹ.',
    nutrition: 'Ăn đủ nhóm chất: đạm, rau, trái cây, tinh bột tốt và chất béo lành mạnh.',
    nutritionTips: ['Mỗi bữa có một nguồn đạm như trứng, cá, thịt nạc hoặc đậu hũ.', 'Ưu tiên cơm, khoai, yến mạch và rau xanh để có năng lượng tập.', 'Uống nước đều trong ngày, không chờ đến khi khát mới uống.'],
    recovery: 'Giữ giờ ngủ đều, uống nước rải đều trong ngày và tăng mức tập từ từ.'
  },
  'Giảm mỡ': {
    label: 'Giảm mỡ',
    title: 'Giảm mỡ nhưng vẫn giữ sức mạnh',
    exercise: 'Ưu tiên 3-4 buổi sức mạnh, thêm cardio vừa phải và không cắt hết ngày nghỉ.',
    nutrition: 'Tạo mức kcal giảm vừa phải, giữ đạm trong mỗi bữa và tăng rau để no lâu.',
    nutritionTips: ['Giữ đủ đạm trong mỗi bữa để hỗ trợ duy trì cơ bắp.', 'Chọn rau, trái cây và tinh bột vừa đủ thay vì bỏ hoàn toàn tinh bột.', 'Hạn chế nước ngọt, trà sữa và món chiên nhiều dầu.'],
    recovery: 'Ngủ đủ, theo dõi hiệu suất và giảm cường độ nếu cơ thể mệt kéo dài.'
  },
  'Tăng cân tăng cơ': {
    label: 'Tăng cân tăng cơ',
    title: 'Tăng năng lượng để phát triển cơ bắp',
    exercise: 'Tập sức mạnh 3-5 buổi, tăng dần số lần hoặc mức tạ khi kỹ thuật ổn định.',
    nutrition: 'Ăn dư năng lượng vừa phải, chia đủ đạm và thêm bữa phụ giàu dinh dưỡng.',
    nutritionTips: ['Thêm một bữa phụ như sữa, chuối, sữa chua hoặc bánh mì trứng.', 'Mỗi bữa chính kết hợp đạm, tinh bột và chất béo tốt.', 'Tăng khẩu phần từ từ, không cần ăn quá nhiều trong một lần.'],
    recovery: 'Dành ngày nghỉ để phục hồi, ngủ đủ và không tăng tải khi form chưa chắc.'
  },
  'Tăng cơ giảm mỡ': {
    label: 'Tăng cơ giảm mỡ',
    title: 'Tái cấu trúc cơ thể từng bước',
    exercise: 'Tập sức mạnh đều cho các nhóm cơ chính, cardio vừa đủ để không ảnh hưởng hồi phục.',
    nutrition: 'Giữ kcal gần mức duy trì, ưu tiên đạm, rau và tinh bột quanh buổi tập.',
    nutritionTips: ['Ưu tiên đạm nạc trong mỗi bữa và chia đều thay vì dồn vào một bữa.', 'Ăn tinh bột trước hoặc sau tập để hỗ trợ hiệu suất và hồi phục.', 'Theo dõi cân nặng, số đo và sức mạnh thay vì chỉ nhìn một chỉ số.'],
    recovery: 'Theo dõi số đo và sức mạnh thay vì chỉ nhìn cân nặng mỗi ngày.'
  },
  'Tăng sức bền': {
    label: 'Tăng sức bền',
    title: 'Tăng thời gian vận động mà không kiệt sức',
    exercise: 'Kết hợp cardio nhẹ-vừa với 2 buổi sức mạnh để bảo vệ cơ và khớp.',
    nutrition: 'Bổ sung đủ tinh bột, đạm và nước; ăn bữa nhẹ trước buổi tập dài.',
    nutritionTips: ['Ăn bữa có tinh bột dễ tiêu trước buổi cardio dài.', 'Bổ sung nước trước, trong và sau khi tập.', 'Sau tập nên ăn thêm đạm và tinh bột để hồi phục năng lượng.'],
    recovery: 'Xen kẽ ngày nhẹ và ngày nặng, chú ý giấc ngủ cùng dấu hiệu quá tải.'
  },
  'Tập calisthenics': {
    label: 'Tập calisthenics',
    title: 'Làm chủ sức mạnh cơ thể',
    exercise: 'Xây từ squat, hít đất, kéo và plank; chỉ nâng biến thể khi kiểm soát được form.',
    nutrition: 'Đủ đạm và tinh bột để hỗ trợ các buổi tập xà, đẩy, chân và kỹ thuật.',
    nutritionTips: ['Ăn đủ đạm từ trứng, thịt nạc, cá, sữa hoặc đậu hũ.', 'Bổ sung tinh bột trước tập để hỗ trợ các bài kéo, đẩy và giữ người.', 'Không cắt giảm quá nhiều kcal khi đang học kỹ thuật mới.'],
    recovery: 'Bảo vệ cổ tay, vai và khuỷu; dừng bài khi đau khớp thay vì cố hoàn thành.'
  }
};

const energyLabels = {
  low: 'Thấp',
  medium: 'Vừa',
  high: 'Tốt'
};

const dayLabels = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

function getVietnamTodayLabel() {
  const weekday = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    timeZone: 'Asia/Ho_Chi_Minh'
  }).format(new Date());
  const weekdayIndex = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

  return dayLabels[weekdayIndex[weekday]];
}

const supplementalGroups = {
  'Ngực, vai và tay sau': ['Ngực, vai và tay sau', 'Cardio và core', 'Phục hồi và giãn cơ'],
  'Chân và mông': ['Chân và mông', 'Phục hồi và giãn cơ', 'Cardio và core'],
  'Lưng và tay trước': ['Chân và mông', 'Cardio và core', 'Phục hồi và giãn cơ'],
  'Cardio và core': ['Phục hồi và giãn cơ', 'Ngực, vai và tay sau'],
  'Toàn thân': ['Phục hồi và giãn cơ'],
  'Phục hồi và giãn cơ': ['Phục hồi và giãn cơ']
};

function TrainingHubPage({
  user,
  language
}) {
  const isEnglish = language === 'en';
  const initialGoal = goalGuides[user?.goal] ? user.goal : 'Cải thiện thể lực';
  const selectedGoal = initialGoal;
  const [sessionMinutes, setSessionMinutes] = useState(30);
  const [energyLevel, setEnergyLevel] = useState('medium');
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [todayLabel, setTodayLabel] = useState(getVietnamTodayLabel);
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [videoError, setVideoError] = useState('');
  const guide = goalGuides[selectedGoal];
  const userStorageId = user?.id || user?._id || user?.email || 'member';
  const currentWeek = Number(localStorage.getItem(`fitness-ai-current-week-${userStorageId}`)) || 1;
  const savedSettings = JSON.parse(localStorage.getItem(`fitness-ai-settings-${userStorageId}-Member-${currentWeek}`) || '{}');
  const savedBusyDays = JSON.parse(localStorage.getItem(`fitness-ai-busy-days-${userStorageId}-Member-${currentWeek}`) || '[]');
  const savedCompletedDays = JSON.parse(localStorage.getItem(`fitness-ai-completed-days-${userStorageId}-Member-${currentWeek}`) || '[]');
  const frequency = Number(savedSettings.frequency) || 5;
  const baseSchedule = goalWorkoutPlans[selectedGoal] || goalWorkoutPlans['Cải thiện thể lực'];
  const sessionsForFrequency = baseSchedule.slice(0, frequency);
  const weekDays = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
  const availableDays = weekDays.filter((day) => !savedBusyDays.includes(day));
  const hasBusyTrainingDay = savedBusyDays.some((day) => sessionsForFrequency.some((session) => session.day === day));
  const canReschedule = availableDays.length >= sessionsForFrequency.length;
  const adjustedSchedule = hasBusyTrainingDay && canReschedule
    ? sessionsForFrequency.map((session, index) => ({ ...session, day: availableDays[index] }))
    : sessionsForFrequency;
  const todaySession = adjustedSchedule.find((session) => session.day === todayLabel);
  const todayCompleted = Boolean(todaySession && savedCompletedDays.includes(todaySession.day));
  const primaryGroup = todaySession?.focus || 'Phục hồi và giãn cơ';
  const recommendedGroups = supplementalGroups[primaryGroup] || ['Phục hồi và giãn cơ'];
  const videoCount = energyLevel === 'low'
    ? 2
    : sessionMinutes === 15
      ? 2
      : sessionMinutes === 30
        ? 3
        : sessionMinutes === 45
          ? 4
          : 5;
  const supplementalVideos = useMemo(() => {
    const mainExerciseNames = todaySession?.exercises?.map((exercise) => exercise.split(':')[0].trim()) || [];
    const pool = exercises.filter((exercise) => (
      recommendedGroups.includes(exercise.muscleGroup) && !mainExerciseNames.includes(exercise.name)
    ));
    const sortedPool = [...pool].sort((first, second) => {
      const firstRecovery = first.muscleGroup === 'Phục hồi và giãn cơ' ? 0 : 1;
      const secondRecovery = second.muscleGroup === 'Phục hồi và giãn cơ' ? 0 : 1;
      return energyLevel === 'low' ? firstRecovery - secondRecovery : 0;
    });

    return sortedPool.slice(0, videoCount);
  }, [exercises, recommendedGroups, primaryGroup, energyLevel, videoCount]);

  useEffect(() => {
    function updateTodayLabel() {
      setTodayLabel(getVietnamTodayLabel());
    }

    updateTodayLabel();
    const dayTimer = window.setInterval(updateTodayLabel, 60000);

    return () => window.clearInterval(dayTimer);
  }, []);

  useEffect(() => {
    async function loadSupplementalVideos() {
      try {
        const response = await api.get('/exercises');
        setExercises(response.data);
      } catch (error) {
        setVideoError('Không thể tải video bổ trợ.');
      }
    }

    loadSupplementalVideos();
  }, []);

  const energyAdvice = energyLevel === 'low'
    ? 'Hôm nay nên giữ nhịp nhẹ, tập kỹ thuật và dừng lại nếu thấy chóng mặt hoặc đau bất thường.'
    : energyLevel === 'high'
      ? 'Cơ thể đang sẵn sàng hơn; vẫn ưu tiên form chuẩn trước khi tăng mức độ.'
      : 'Giữ mức gắng sức vừa phải và nghỉ đủ giữa các hiệp.';
  const supplementalAdvice = todayCompleted
    ? `Bạn đã hoàn thành buổi ${todaySession.focus}. AI PT đề xuất bài bổ trợ tiếp theo, không lặp lại các bài chính vừa tập.`
    : todaySession
      ? `Buổi chính hôm nay là ${todaySession.focus}. Sau khi hoàn thành, AI PT sẽ gợi ý bài bổ trợ phù hợp.`
    : 'Hôm nay không có buổi chính. Trung tâm ưu tiên phục hồi, giãn cơ và vận động nhẹ.';

  return (
    <div className="training-hub-page member-content-page">
      <main className="training-hub-main">
        <section className="training-hub-hero">
          <div>
            <p className="eyebrow">MEMBER TRAINING HUB</p>
            <h1>{isEnglish ? 'A practical space for your next step' : 'Khu vực thực hành cho bước tiếp theo của bạn'}</h1>
            <p>{isEnglish ? 'Choose your current goal and turn the advice into an action from your account.' : 'Chọn mục tiêu hiện tại và biến lời khuyên thành hành động ngay trong tài khoản.'}</p>
          </div>
          <div className="training-hub-status">
            <span>{isEnglish ? 'Current focus' : 'Mục tiêu đang xem'}</span>
            <strong>{guide.label}</strong>
          </div>
        </section>

        <section className="training-hub-section training-goal-section">
          <div className="section-title">
            <div>
              <span className="eyebrow">01 / {isEnglish ? 'Plan direction' : 'Hướng đi từ Kế hoạch AI'}</span>
              <h2>{selectedGoal}</h2>
            </div>
            <small>{isEnglish ? 'This goal is connected to your AI Plan.' : 'Mục tiêu này được lấy trực tiếp từ Kế hoạch AI.'}</small>
          </div>
          <div className="training-goal-list">
            <span className="selected-goal">{selectedGoal}</span>
          </div>
        </section>

        <section className="training-hub-section training-guide-section">
          <div className="section-title">
            <div>
              <span className="eyebrow">02 / {isEnglish ? 'Goal guide' : 'Hướng dẫn theo mục tiêu'}</span>
              <h2>{guide.title}</h2>
            </div>
          </div>
          <div className="training-guide-grid">
            <article>
              <span className="guide-number">01</span>
              <h3>{isEnglish ? 'Training' : 'Tập luyện'}</h3>
              <p>{guide.exercise}</p>
            </article>
            <article>
              <span className="guide-number">02</span>
              <h3>{isEnglish ? 'Nutrition' : 'Dinh dưỡng'}</h3>
              <p>{guide.nutrition}</p>
            </article>
            <article>
              <span className="guide-number">03</span>
              <h3>{isEnglish ? 'Recovery' : 'Hồi phục'}</h3>
              <p>{guide.recovery}</p>
            </article>
          </div>
        </section>

        <section className="training-hub-section training-nutrition-section">
          <div className="section-title">
            <div>
              <span className="eyebrow">03 / Gợi ý theo mục tiêu</span>
              <h2>Gợi ý dinh dưỡng hôm nay</h2>
            </div>
            <small>Gợi ý nền tảng, không thay thế thực đơn AI cá nhân.</small>
          </div>
          <div className="training-nutrition-list">
            {guide.nutritionTips.map((tip, index) => (
              <article key={tip}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p>{tip}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="training-hub-section training-session-section">
          <div className="section-title">
            <div>
              <span className="eyebrow">04 / AI PT đề xuất tiếp theo</span>
              <h2>{todayCompleted ? 'Bài tập tiếp theo sau buổi chính' : 'Bài tập bổ trợ hôm nay'}</h2>
            </div>
            <small>{sessionCompleted ? 'Đã hoàn thành' : 'Chưa hoàn thành'}</small>
          </div>

          <div className={`training-followup-banner ${todayCompleted ? 'training-followup-complete' : ''}`}>
            <strong>{todayCompleted ? `Đã hoàn thành: ${todaySession.focus}` : `Buổi chính hôm nay: ${todaySession ? todaySession.focus : 'Ngày nghỉ'}`}</strong>
            <span>{supplementalAdvice}</span>
          </div>

          <div className="training-session-controls">
            <label>
              Thời lượng hôm nay
              <select value={sessionMinutes} onChange={(event) => setSessionMinutes(Number(event.target.value))}>
                <option value="15">15 phút</option>
                <option value="30">30 phút</option>
                <option value="45">45 phút</option>
                <option value="60">60 phút</option>
              </select>
            </label>
            <label>
              Mức năng lượng
              <select value={energyLevel} onChange={(event) => setEnergyLevel(event.target.value)}>
                {Object.entries(energyLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
          </div>

          <div className="training-session-result">
            <div className="training-session-result-heading">
              <div>
                <span className="eyebrow">{todayLabel} · {todaySession ? todaySession.focus : 'Ngày nghỉ'}</span>
                <h3>{sessionMinutes} phút / mức năng lượng {energyLabels[energyLevel]}</h3>
              </div>
              <span className={sessionCompleted ? 'session-done-badge' : 'session-ready-badge'}>
                {sessionCompleted ? 'Đã xong' : 'Sẵn sàng'}
              </span>
            </div>
            <p className="training-session-advice">{supplementalAdvice}</p>
            <ol>
              {supplementalVideos.map((exercise) => <li key={exercise._id}>{exercise.name}: {exercise.sets} hiệp x {exercise.reps}</li>)}
            </ol>
            <p className="training-session-advice">{energyAdvice}</p>
            <button type="button" onClick={() => setSessionCompleted(!sessionCompleted)}>
              {sessionCompleted ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu đã hoàn thành'}
            </button>
          </div>

          {videoError && <div className="exercise-library-state exercise-library-error">{videoError}</div>}
          {!videoError && supplementalVideos.length === 0 && (
            <div className="exercise-library-state">Chưa có video bổ trợ phù hợp với nhóm cơ hôm nay.</div>
          )}
          {!videoError && supplementalVideos.length > 0 && (
            <div className="exercise-library-grid training-supplement-video-grid">
              {supplementalVideos.map((exercise) => (
                <article className="exercise-library-card" key={exercise._id}>
                  <div className="exercise-card-topline">
                    <span>{exercise.category}</span>
                    <small>{exercise.level}</small>
                  </div>
                  <h3>{exercise.name}</h3>
                  <p className="exercise-muscle">{exercise.muscleGroup}</p>
                  <p>{exercise.description}</p>
                  <div className="exercise-card-details">
                    <span>{exercise.sets} hiệp</span>
                    <span>{exercise.reps}</span>
                    <span>Nghỉ {exercise.restSeconds}s</span>
                  </div>
                  <button type="button" onClick={() => setSelectedExercise(exercise)}>Xem video bổ trợ</button>
                </article>
              ))}
            </div>
          )}
        </section>

        {selectedExercise && (
          <div className="exercise-video-modal" role="dialog" aria-modal="true" aria-labelledby="training-video-title">
            <div className="exercise-video-dialog">
              <button className="auth-close-button" type="button" onClick={() => setSelectedExercise(null)} aria-label="Đóng">×</button>
              <p className="eyebrow">Video bổ trợ · {selectedExercise.muscleGroup}</p>
              <h2 id="training-video-title">{selectedExercise.name}</h2>
              <div className="exercise-video-frame">
                <iframe
                  src={selectedExercise.videoUrl}
                  title={`Video hướng dẫn ${selectedExercise.name}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}

        <section className="training-sources">
          <span className="eyebrow">{isEnglish ? 'Reliable references' : 'Nguồn tham khảo uy tín'}</span>
          <div>
            <a href="https://acsm.org/science-spotlight-acsm-releases-new-position-stand-on-resistance-training/" target="_blank" rel="noreferrer">ACSM</a>
            <a href="https://www.who.int/news-room/fact-sheets/detail/physical-activity" target="_blank" rel="noreferrer">WHO</a>
            <a href="https://www.cdc.gov/nutrition/features/healthy-eating-tips.html" target="_blank" rel="noreferrer">CDC</a>
            <a href="https://www.nhlbi.nih.gov/health/sleep/how-much-sleep" target="_blank" rel="noreferrer">NIH / NHLBI</a>
            <a href="https://www.myplate.gov/web/web/eat-healthy/protein-foods" target="_blank" rel="noreferrer">USDA MyPlate</a>
          </div>
        </section>
      </main>
    </div>
  );
}

export default TrainingHubPage;
