import { useEffect, useMemo, useState } from 'react';
import LanguageToggle from '../components/LanguageToggle';
import api from '../api';

function normalizeMealName(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/\s+/g, ' ');
}

const mealCalories = {
  'cơm gà': 550,
  'cơm chiên': 650,
  'cơm sườn': 700,
  'cơm tấm': 650,
  'cơm thịt kho': 680,
  'cơm cá': 580,
  'cơm trộn': 550,
  'cơm chay': 450,
  'bún bò': 550,
  'bún thịt nướng': 620,
  'bún chay': 400,
  'hủ tiếu': 480,
  'mì tôm': 420,
  'mì gói': 325,
  'mì xào chay': 450,
  'mì xào bò': 650,
  'mì xào hải sản': 620,
  'mì ý': 550,
  'mì bò': 550,
  'nui xào bò': 600,
  'nui xào hải sản': 580,
  'cháo thịt': 350,
  'xôi': 450,
  'bánh cuốn': 380,
  'bánh bao': 350,
  'gỏi cuốn chay': 150,
  'gỏi cuốn': 180,
  'mì xào': 600,
  'phở gà': 450,
  'phở bò': 500,
  'phở chay': 350,
  'phở': 450,
  'bibimbap': 550,
  'kimbap': 450,
  'tokbokki': 400,
  'tteokbokki': 400,
  'japchae': 450,
  'mandu': 350,
  'kimchi': 20,
  'gà rán hàn quốc': 550,
  'đậu hũ chiên': 250,
  'đậu hũ sốt cà': 220,
  'nấm xào': 180,
  'canh rau củ': 150,
  'bánh mì': 420,
  'trứng luộc': 150,
  'ức gà': 280,
  'cá hồi': 350,
  'thịt bò': 320,
  'khoai lang': 180,
  'chuối': 105,
  'sữa tươi': 150,
  'nước lọc': 0,
  'trà đá': 0,
  'trà xanh không đường': 2,
  'cà phê đen': 5,
  'cà phê sữa': 120,
  'bạc xỉu': 180,
  'trà sữa': 350,
  'nước ngọt': 140,
  'nước cam': 110,
  'nước ép cam': 110,
  'sinh tố bơ': 320,
  'sinh tố chuối': 230,
  'nước tăng lực': 150,
  'chicken rice': 550,
  'fried rice': 650,
  'beef noodle soup': 550,
  'pho': 450,
  'bread': 420,
  'milk': 150,
  'water': 0,
  'bubble tea': 350,
  'orange juice': 110,
  'banana smoothie': 230
};

const normalizedMealCalories = Object.entries(mealCalories)
  .map(([name, calories]) => [normalizeMealName(name), calories]);

function isVideoRelevantForGoal(exercise, goal) {
  const category = String(exercise.category || '').toLowerCase();
  const name = String(exercise.name || '').toLowerCase();
  const muscleGroup = String(exercise.muscleGroup || '').toLowerCase();
  const videoText = `${name} ${muscleGroup}`;

  if (goal === 'Tăng cân tăng cơ' || goal === 'Tăng cơ giảm mỡ') {
    return ['gym', 'calisthenics'].includes(category);
  }

  if (goal === 'Giảm mỡ') {
    return ['gym', 'calisthenics', 'yoga'].includes(category)
      || videoText.includes('cardio')
      || videoText.includes('đốt');
  }

  return ['gym', 'calisthenics', 'yoga', 'stretching'].includes(category);
}

function VisitorDemoPage({ onBack, onLogin, language, onLanguageChange }) {
  const isEnglish = language === 'en';
  const [form, setForm] = useState({ age: '', height: '', weight: '', goal: 'Cải thiện thể lực' });
  const [sleepHours, setSleepHours] = useState('');
  const [mealName, setMealName] = useState('');
  const [profileConfirmed, setProfileConfirmed] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [videoLoading, setVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState('');
  const [watchedVideoIds, setWatchedVideoIds] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [adPendingVideo, setAdPendingVideo] = useState(null);
  const hasBodyProfile = Boolean(form.age && form.height && form.weight && form.goal);
  const hasSleepData = sleepHours !== '';
  const hasCompleteAssessment = hasBodyProfile && hasSleepData;

  useEffect(() => {
    async function loadVisitorVideos() {
      try {
        const response = await api.get('/exercises');
        setExercises(response.data);
      } catch (error) {
        setVideoError(isEnglish ? 'Unable to load visitor videos.' : 'Không thể tải video cho Visitor.');
      } finally {
        setVideoLoading(false);
      }
    }

    loadVisitorVideos();
  }, [isEnglish]);

  function openVisitorVideo(exercise) {
    const videoId = exercise._id;
    const hasWatched = watchedVideoIds.includes(videoId);
    const nextWatchedIds = hasWatched
      ? watchedVideoIds
      : [...watchedVideoIds, videoId];

    setWatchedVideoIds(nextWatchedIds);

    if (!hasWatched && nextWatchedIds.length > 0 && nextWatchedIds.length % 2 === 0) {
      setAdPendingVideo(exercise);
      return;
    }

    setSelectedVideo(exercise);
  }

  function continueAfterAd() {
    setSelectedVideo(adPendingVideo);
    setAdPendingVideo(null);
  }

  const workoutPlan = useMemo(() => {
    if (form.goal === 'Giảm mỡ') {
      return [
        { day: isEnglish ? 'Monday' : 'Thứ 2', focus: isEnglish ? 'Chest, shoulders and triceps' : 'Ngực, vai và tay sau', videoGroup: 'Ngực, vai và tay sau', exercises: isEnglish ? 'Push-up · Pike push-up' : 'Hít đất cơ bản · Pike push-up' },
        { day: isEnglish ? 'Wednesday' : 'Thứ 4', focus: isEnglish ? 'Legs and glutes' : 'Chân và mông', videoGroup: 'Chân và mông', exercises: isEnglish ? 'Bodyweight squat · Romanian deadlift' : 'Squat không tạ · Romanian deadlift' },
        { day: isEnglish ? 'Friday' : 'Thứ 6', focus: isEnglish ? 'Cardio and core' : 'Cardio và core', videoGroup: 'Cardio và core', exercises: isEnglish ? 'Mountain climber · Plank' : 'Mountain climber · Plank' }
      ];
    }

    if (form.goal === 'Tăng cân tăng cơ') {
      return [
        { day: isEnglish ? 'Monday' : 'Thứ 2', focus: isEnglish ? 'Chest, shoulders and triceps' : 'Ngực, vai và tay sau', videoGroup: 'Ngực, vai và tay sau', exercises: isEnglish ? 'Push-up · Pike push-up · Bench dip' : 'Hít đất cơ bản · Pike push-up · Bench dip' },
        { day: isEnglish ? 'Wednesday' : 'Thứ 4', focus: isEnglish ? 'Legs and glutes' : 'Chân và mông', videoGroup: 'Chân và mông', exercises: isEnglish ? 'Bodyweight squat · Romanian deadlift' : 'Squat không tạ · Romanian deadlift' },
        { day: isEnglish ? 'Friday' : 'Thứ 6', focus: isEnglish ? 'Back and front arms' : 'Lưng và tay trước', videoGroup: 'Lưng và tay trước', exercises: isEnglish ? 'Basic pull-up' : 'Kéo xà cơ bản' }
      ];
    }

    if (form.goal === 'Tăng cơ giảm mỡ') {
      return [
        { day: isEnglish ? 'Monday' : 'Thứ 2', focus: isEnglish ? 'Chest, shoulders and triceps' : 'Ngực, vai và tay sau', videoGroup: 'Ngực, vai và tay sau', exercises: isEnglish ? 'Push-up · Pike push-up · Bench dip' : 'Hít đất cơ bản · Pike push-up · Bench dip' },
        { day: isEnglish ? 'Wednesday' : 'Thứ 4', focus: isEnglish ? 'Legs and glutes' : 'Chân và mông', videoGroup: 'Chân và mông', exercises: isEnglish ? 'Bodyweight squat · Romanian deadlift' : 'Squat không tạ · Romanian deadlift' },
        { day: isEnglish ? 'Friday' : 'Thứ 6', focus: isEnglish ? 'Full body and conditioning' : 'Toàn thân và chuyển hóa', videoGroup: 'Toàn thân', exercises: isEnglish ? 'Basic burpee · Light cardio' : 'Burpee cơ bản · Cardio nhẹ' }
      ];
    }

    return [
      { day: isEnglish ? 'Monday' : 'Thứ 2', focus: isEnglish ? 'Full body' : 'Toàn thân', videoGroup: 'Toàn thân', exercises: isEnglish ? 'Basic burpee' : 'Burpee cơ bản' },
      { day: isEnglish ? 'Wednesday' : 'Thứ 4', focus: isEnglish ? 'Chest, shoulders and triceps' : 'Ngực, vai và tay sau', videoGroup: 'Ngực, vai và tay sau', exercises: isEnglish ? 'Push-up · Pike push-up' : 'Hít đất cơ bản · Pike push-up' },
      { day: isEnglish ? 'Friday' : 'Thứ 6', focus: isEnglish ? 'Legs and glutes' : 'Chân và mông', videoGroup: 'Chân và mông', exercises: isEnglish ? 'Bodyweight squat · Romanian deadlift' : 'Squat không tạ · Romanian deadlift' }
    ];
  }, [form.goal, isEnglish]);

  const matchingVisitorVideos = profileConfirmed
    ? exercises.filter((exercise) => workoutPlan.some((session) => session.videoGroup === exercise.muscleGroup))
    : [];
  const visitorVideos = matchingVisitorVideos.slice(0, 8);
  const visitorVideoGroups = workoutPlan
    .map((session) => ({
      ...session,
      videos: visitorVideos.filter((exercise) => exercise.muscleGroup === session.videoGroup)
    }))
    .filter((session) => session.videos.length > 0);

  const bmi = useMemo(() => {
    const height = Number(form.height) / 100;
    const weight = Number(form.weight);
    return height > 0 && weight > 0 ? (weight / (height * height)).toFixed(1) : '';
  }, [form.height, form.weight]);

  const bmiStatus = useMemo(() => {
    if (!bmi) {
      return isEnglish ? 'Enter your data to see the result' : 'Nhập dữ liệu để xem kết quả';
    }

    if (Number(form.age) < 20) {
      return isEnglish ? 'BMI is a reference for your age' : 'BMI tham khảo theo tuổi';
    }

    if (Number(bmi) < 18.5) return isEnglish ? 'Underweight' : 'Thiếu cân';
    if (Number(bmi) < 25) return isEnglish ? 'Normal range' : 'Bình thường';
    if (Number(bmi) < 30) return isEnglish ? 'Overweight' : 'Thừa cân';
    return isEnglish ? 'Obesity range' : 'Béo phì';
  }, [bmi, form.age, isEnglish]);

  const sleepAdvice = !sleepHours
    ? (isEnglish ? 'Enter your sleep duration to get advice.' : 'Nhập số giờ ngủ để nhận lời khuyên.')
    : Number(sleepHours) < 8
      ? (isEnglish ? 'Under 8 hours: choose light training, technique work or mobility today.' : 'Ngủ dưới 8 giờ: hôm nay chỉ nên tập nhẹ, tập kỹ thuật hoặc giãn cơ.')
      : (isEnglish ? 'Good recovery base: follow the plan and warm up fully.' : 'Đủ nền tảng hồi phục: có thể tập theo lịch và khởi động đầy đủ.');

  const normalizedMeal = normalizeMealName(mealName);
  const mealCaloriesResult = normalizedMealCalories.find(([name]) => (
    normalizedMeal === name || normalizedMeal.includes(name)
  ));

  function updateForm(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
    setProfileConfirmed(false);
  }

  function confirmProfile() {
    if (hasCompleteAssessment) {
      setProfileConfirmed(true);
    }
  }

  function updateSleepHours(event) {
    setSleepHours(event.target.value);
    setProfileConfirmed(false);
  }

  return (
    <div className="visitor-demo-page">
      <header className="visitor-demo-header">
        <button className="visitor-back-button" type="button" onClick={onBack}>← Fitness AI</button>
        <div>
          <LanguageToggle language={language} onChange={onLanguageChange} />
          <span>{isEnglish ? 'Visitor mode' : 'Chế độ Visitor'}</span>
          <button type="button" onClick={onLogin}>{isEnglish ? 'Become a Member' : 'Đăng ký Member'}</button>
        </div>
      </header>

      <main className="visitor-demo-main">
        <section className="visitor-demo-hero">
          <p className="eyebrow">{isEnglish ? 'Try without an account' : 'Dùng thử không cần tài khoản'}</p>
          <h1>{isEnglish ? 'Discover how Fitness AI can train with you' : 'Khám phá cách Fitness AI đồng hành cùng bạn'}</h1>
          <p>{isEnglish ? 'Visitors can try the core tools. Become a Member to save data, create a personal plan and unlock the full experience.' : 'Visitor được thử các công cụ chính. Đăng ký Member để lưu dữ liệu, tạo lịch cá nhân và mở toàn bộ tính năng.'}</p>
        </section>

        <div className="visitor-demo-grid">
          <section className="visitor-demo-card">
            <span className="visitor-card-number">01</span>
            <h2>{isEnglish ? 'Body assessment' : 'Đánh giá thể trạng'}</h2>
            <p>{isEnglish ? 'Enter your details to see a reference BMI.' : 'Nhập số liệu để xem BMI tham khảo.'}</p>
            <div className="visitor-form-grid">
              <label>{isEnglish ? 'Age' : 'Tuổi'}<input name="age" type="number" min="1" value={form.age} onChange={updateForm} placeholder={isEnglish ? 'Example: 22' : 'Ví dụ: 22'} /></label>
              <label>{isEnglish ? 'Height (cm)' : 'Chiều cao (cm)'}<input name="height" type="number" min="1" value={form.height} onChange={updateForm} placeholder="175" /></label>
              <label>{isEnglish ? 'Weight (kg)' : 'Cân nặng (kg)'}<input name="weight" type="number" min="1" value={form.weight} onChange={updateForm} placeholder="65" /></label>
              <label>{isEnglish ? 'Goal' : 'Mục tiêu'}<select name="goal" value={form.goal} onChange={updateForm}><option value="Cải thiện thể lực">{isEnglish ? 'Improve fitness' : 'Cải thiện thể lực'}</option><option value="Tăng cân tăng cơ">{isEnglish ? 'Gain weight and muscle' : 'Tăng cân tăng cơ'}</option><option value="Tăng cơ giảm mỡ">{isEnglish ? 'Build muscle and lose fat' : 'Tăng cơ giảm mỡ'}</option><option value="Giảm mỡ">{isEnglish ? 'Lose fat' : 'Giảm mỡ'}</option></select></label>
            </div>
            <div className="visitor-recovery-block">
              <div className="visitor-recovery-heading">
                <span className="visitor-substep-number">02</span>
                <div>
                  <h3>{isEnglish ? 'Sleep and recovery' : 'Giấc ngủ và hồi phục'}</h3>
                  <p>{isEnglish ? 'AI checks your sleep duration before creating the plan.' : 'AI kiểm tra số giờ ngủ trước khi tạo lịch tập.'}</p>
                </div>
              </div>
              <label>
                {isEnglish ? 'Hours slept' : 'Số giờ đã ngủ'}
                <input type="number" min="0" max="24" step="0.5" value={sleepHours} onChange={updateSleepHours} placeholder={isEnglish ? 'Example: 7.5' : 'Ví dụ: 7.5'} />
              </label>
              <div className={`visitor-advice-box ${sleepHours && Number(sleepHours) < 8 ? 'visitor-warning' : ''}`}>
                <strong>{sleepHours && Number(sleepHours) < 8 ? (isEnglish ? 'Recovery warning' : 'Cảnh báo hồi phục') : (isEnglish ? 'Today\'s suggestion' : 'Gợi ý hôm nay')}</strong>
                <span>{sleepAdvice}</span>
              </div>
            </div>

            <button
              className="visitor-confirm-button"
              type="button"
              onClick={confirmProfile}
              disabled={!hasCompleteAssessment}
            >
              {isEnglish ? 'Confirm data' : 'Xác nhận dữ liệu'}
            </button>
            {profileConfirmed && (
              <div className="visitor-result-box">
                <span>{isEnglish ? 'Reference BMI' : 'BMI tham khảo'}</span>
                <strong>{bmi}</strong>
                <small>{bmiStatus}</small>
              </div>
            )}
          </section>

          <section className="visitor-demo-card">
            <span className="visitor-card-number">02</span>
            <h2>{isEnglish ? 'Personal workout plan' : 'Lịch tập cá nhân'}</h2>
            <p>{profileConfirmed ? (isEnglish ? 'Your plan uses your body profile, goal and recovery level.' : 'Lịch được tạo theo thể trạng, mục tiêu và khả năng hồi phục của bạn.') : (isEnglish ? 'Complete your body assessment, enter your sleep duration and confirm to create a plan.' : 'Hoàn thành đánh giá thể trạng, nhập số giờ ngủ rồi bấm xác nhận để tạo lịch.')}</p>
            {profileConfirmed ? (
              <>
                <div className="visitor-workout-list">
                  {workoutPlan.map((session) => (
                    <div key={session.day}><strong>{session.day} · {session.focus}</strong><span>{session.exercises}</span></div>
                  ))}
                </div>
                <button type="button" onClick={onLogin}>{isEnglish ? 'Save and customize plan' : 'Lưu và tùy chỉnh lịch'}</button>
              </>
            ) : (
              <div className="visitor-locked-box">{isEnglish ? 'The plan appears after you enter your body profile, goal and sleep duration.' : 'Lịch tập chỉ hiện sau khi bạn nhập đủ thể trạng, mục tiêu và số giờ ngủ.'}</div>
            )}
          </section>

          <section className="visitor-demo-card">
            <span className="visitor-card-number">03</span>
            <h2>{isEnglish ? 'Meal calorie estimate' : 'Ước tính kcal món ăn'}</h2>
            <p>{isEnglish ? 'Try entering a familiar food or drink.' : 'Thử nhập tên một món quen thuộc.'}</p>
            <label>{isEnglish ? 'Food or drink' : 'Tên món ăn'}<input value={mealName} onChange={(event) => setMealName(event.target.value)} placeholder={isEnglish ? 'Example: chicken rice' : 'Ví dụ: cơm gà'} /></label>
            <div className="visitor-result-box meal-result-box">
              <span>{isEnglish ? 'Estimated calories' : 'Calo ước tính'}</span>
              <strong>{mealCaloriesResult ? `${mealCaloriesResult[1]} kcal` : '--'}</strong>
              <small>{mealCaloriesResult ? (isEnglish ? 'Based on a typical serving' : 'Theo khẩu phần thông thường') : (isEnglish ? 'No matching item yet' : 'Chưa có món phù hợp')}</small>
            </div>
          </section>
        </div>

        <section className="visitor-video-section">
          <div className="visitor-video-heading">
            <div>
              <span className="visitor-card-number">04</span>
              <h2>{isEnglish ? 'Workout videos for Visitors' : 'Video bài tập dành cho Visitor'}</h2>
              <p>{profileConfirmed
                ? (isEnglish ? `Videos selected for: ${form.goal}` : `Video được chọn theo mục tiêu: ${form.goal}`)
                : (isEnglish ? 'Confirm your body profile first to receive videos that match your goal.' : 'Hãy xác nhận thể trạng trước để nhận video phù hợp với mục tiêu.')}</p>
            </div>
            <strong>{profileConfirmed
              ? (isEnglish ? `${visitorVideos.length} matching videos` : `${visitorVideos.length} video phù hợp`)
              : (isEnglish ? 'Waiting for confirmation' : 'Chờ xác nhận')}</strong>
          </div>

          {!profileConfirmed && <div className="exercise-library-state">{isEnglish ? 'Videos will appear after you confirm your data.' : 'Video sẽ hiện sau khi bạn xác nhận dữ liệu thể trạng.'}</div>}
          {profileConfirmed && videoLoading && <div className="exercise-library-state">{isEnglish ? 'Loading videos...' : 'Đang tải video...'}</div>}
          {videoError && <div className="exercise-library-state exercise-library-error">{videoError}</div>}
          {profileConfirmed && !videoLoading && !videoError && visitorVideos.length > 0 && (
            <div className="visitor-video-groups">
              {visitorVideoGroups.map((session) => (
                <section className="visitor-video-group" key={session.day}>
                  <div className="visitor-video-group-heading">
                    <h3>{session.day} · {session.focus}</h3>
                    <span>{session.videos.length} video</span>
                  </div>
                  <div className="exercise-library-grid visitor-video-grid">
                    {session.videos.map((exercise) => (
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
                          <span>{exercise.restSeconds}s nghỉ</span>
                        </div>
                        <button type="button" onClick={() => openVisitorVideo(exercise)}>
                          {watchedVideoIds.includes(exercise._id) ? (isEnglish ? 'Watch again' : 'Xem lại video') : (isEnglish ? 'Watch video' : 'Xem video')}
                        </button>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
          {profileConfirmed && !videoLoading && !videoError && visitorVideos.length === 0 && (
            <div className="exercise-library-state">{isEnglish ? 'There are no matching videos yet. Please check back when new content is added.' : 'Chưa có video phù hợp với mục tiêu này. Hãy quay lại khi Admin cập nhật thêm nội dung.'}</div>
          )}
          {profileConfirmed && !videoLoading && !videoError && matchingVisitorVideos.length > visitorVideos.length && (
            <div className="visitor-video-locked">
              <div>
                <strong>{isEnglish ? 'More videos are available for Members.' : 'Còn nhiều video dành cho Member.'}</strong>
                <span>{isEnglish ? 'Become a Member to unlock the full exercise library and save your workout journey.' : 'Đăng ký Member để mở toàn bộ thư viện bài tập và lưu hành trình tập luyện.'}</span>
              </div>
              <button type="button" onClick={onLogin}>{isEnglish ? 'Become a Member' : 'Đăng ký Member'}</button>
            </div>
          )}
        </section>

        <section className="visitor-member-banner">
          <div>
            <span className="eyebrow">{isEnglish ? 'Want to track your journey?' : 'Muốn theo dõi lâu dài?'}</span>
            <h2>{isEnglish ? 'Become a Member to save your journey' : 'Đăng ký Member để lưu toàn bộ hành trình'}</h2>
            <p>{isEnglish ? 'Your profile, workouts, sleep, meals and progress will be saved to your account.' : 'Hồ sơ, lịch tập, giấc ngủ, bữa ăn và tiến độ sẽ được lưu theo tài khoản của bạn.'}</p>
          </div>
          <button type="button" onClick={onLogin}>{isEnglish ? 'Become a Member' : 'Đăng ký Member'}</button>
        </section>
      </main>

      {adPendingVideo && (
        <div className="exercise-video-modal" role="dialog" aria-modal="true" aria-label="Quảng cáo mô phỏng">
          <div className="exercise-video-dialog visitor-ad-dialog">
            <span className="visitor-ad-label">QUẢNG CÁO MÔ PHỎNG</span>
            <h2>{isEnglish ? 'Your next video is ready' : 'Video tiếp theo đã sẵn sàng'}</h2>
            <p>{isEnglish ? 'Visitors see a short ad after every two videos. Continue to watch the exercise.' : 'Visitor sẽ xem quảng cáo sau mỗi 2 video. Bạn có thể tiếp tục xem bài tập.'}</p>
            <div className="visitor-ad-actions">
              <button type="button" onClick={continueAfterAd}>{isEnglish ? 'Continue to video' : 'Tiếp tục xem video'}</button>
              <button type="button" className="ghost-button" onClick={() => setAdPendingVideo(null)}>{isEnglish ? 'Close' : 'Đóng'}</button>
            </div>
          </div>
        </div>
      )}

      {selectedVideo && (
        <div className="exercise-video-modal" role="dialog" aria-modal="true" aria-label={selectedVideo.name}>
          <div className="exercise-video-dialog">
            <button className="modal-close" type="button" onClick={() => setSelectedVideo(null)} aria-label="Đóng video">×</button>
            <h2>{selectedVideo.name}</h2>
            <div className="exercise-video-frame">
              <iframe src={selectedVideo.videoUrl} title={selectedVideo.name} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
            <div className="exercise-video-meta">
              <span>{selectedVideo.muscleGroup}</span>
              <span>{selectedVideo.sets} hiệp · {selectedVideo.reps}</span>
              <span>{selectedVideo.sourceName || 'Nguồn video công khai'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VisitorDemoPage;
