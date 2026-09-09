import { useEffect, useState } from 'react';
import { goalWorkoutPlans } from '../data/workoutSchedule';

function getBlockSettings(frequency) {
  if (frequency <= 2) {
    return {
      label: 'Block 12-16 tuần',
      maxWeeks: 16,
      phases: [
        { weeks: 'Tuần 1-4', startWeek: 1, endWeek: 4, name: 'Xây nền kỹ thuật', detail: 'Làm quen bài tập và giữ kỹ thuật chắc với tần suất thấp.' },
        { weeks: 'Tuần 5-8', startWeek: 5, endWeek: 8, name: 'Tăng khối lượng', detail: 'Tăng dần số hiệp hoặc số lần khi cơ thể thích nghi.' },
        { weeks: 'Tuần 9-12', startWeek: 9, endWeek: 12, name: 'Tăng cường độ', detail: 'Điều chỉnh mức tạ và thời gian nghỉ theo kết quả.' },
        { weeks: 'Tuần 13-16', startWeek: 13, endWeek: 16, name: 'Đánh giá', detail: 'Kiểm tra tiến độ và chuẩn bị cho block tiếp theo.' }
      ]
    };
  }

  if (frequency === 3) {
    return {
      label: 'Block 10-14 tuần',
      maxWeeks: 14,
      phases: [
        { weeks: 'Tuần 1-3', startWeek: 1, endWeek: 3, name: 'Xây nền kỹ thuật', detail: 'Làm quen bài tập và duy trì kỹ thuật ổn định.' },
        { weeks: 'Tuần 4-6', startWeek: 4, endWeek: 6, name: 'Tăng khối lượng', detail: 'Tăng dần số hiệp hoặc số lần khi cơ thể thích nghi.' },
        { weeks: 'Tuần 7-10', startWeek: 7, endWeek: 10, name: 'Tăng cường độ', detail: 'Điều chỉnh mức tạ và thời gian nghỉ theo kết quả.' },
        { weeks: 'Tuần 11-14', startWeek: 11, endWeek: 14, name: 'Đánh giá', detail: 'Kiểm tra tiến độ và chuẩn bị cho block tiếp theo.' }
      ]
    };
  }

  return {
    label: 'Block 8-12 tuần',
    maxWeeks: 12,
    phases: [
      { weeks: 'Tuần 1-3', startWeek: 1, endWeek: 3, name: 'Xây nền kỹ thuật', detail: 'Làm quen bài tập, giữ kỹ thuật chắc và mức gắng sức vừa phải.' },
      { weeks: 'Tuần 4-6', startWeek: 4, endWeek: 6, name: 'Tăng khối lượng', detail: 'Tăng dần số hiệp hoặc số lần khi cơ thể hoàn thành tốt bài tập.' },
      { weeks: 'Tuần 7-9', startWeek: 7, endWeek: 9, name: 'Tăng cường độ', detail: 'Điều chỉnh mức tạ và thời gian nghỉ theo kết quả từng buổi.' },
      { weeks: 'Tuần 10-12', startWeek: 10, endWeek: 12, name: 'Deload & đánh giá', detail: 'Giảm tải hợp lý, xem lại form và lập hướng đi cho block tiếp theo.' }
    ]
  };
}

function AiPlanPage({ user }) {
  const planLabel = 'Member';
  const defaultFrequency = 5;
  const defaultDuration = '60-75 phút';
  const [currentWeek, setCurrentWeek] = useState(null);
  const [busyDays, setBusyDays] = useState([]);
  const [completedDays, setCompletedDays] = useState([]);
  const [frequency, setFrequency] = useState(defaultFrequency);
  const [duration, setDuration] = useState(defaultDuration);
  const [showScheduleSettings, setShowScheduleSettings] = useState(false);
  const [weekReview, setWeekReview] = useState(null);
  const [reviewDecisions, setReviewDecisions] = useState({});
  const planData = {
    Free: {
      title: 'Lịch tập nền tảng',
      description: 'Lịch mẫu giúp bạn bắt đầu đúng kỹ thuật và duy trì thói quen.',
      frequency: '3 buổi / tuần',
      duration: '30-45 phút / buổi',
      period: 'Lịch cơ bản 1 tuần',
      sessions: [
        { day: 'Thứ 2', focus: 'Toàn thân', exercises: ['Squat không tạ: 3 x 10', 'Hít đất: 3 x 8', 'Plank: 3 x 30 giây'] },
        { day: 'Thứ 4', focus: 'Thân trên', exercises: ['Hít đất gối hoặc cơ bản: 3 x 8', 'Superman: 3 x 12', 'Giãn cơ vai: 5 phút'] },
        { day: 'Thứ 6', focus: 'Thân dưới & bụng', exercises: ['Lunge: 3 x 10 mỗi bên', 'Glute bridge: 3 x 12', 'Dead bug: 3 x 10 mỗi bên'] }
      ],
      benefits: ['Lịch mẫu 3 buổi / tuần', 'Hướng dẫn số hiệp và số lần', 'Không tùy chỉnh tần suất, thời lượng hoặc ngày bận'],
      limitation: 'AI Free chỉ đưa ra hướng tập tổng quát, chưa tạo lịch cá nhân chi tiết.'
    },
    Plus: {
      title: 'Lịch tập cá nhân theo tuần',
      description: 'Lịch được điều chỉnh theo mục tiêu, trình độ và thời gian tập của bạn.',
      frequency: '4 buổi / tuần',
      duration: '45-60 phút / buổi',
      period: 'Theo dõi và điều chỉnh từng tuần',
      sessions: [
        { day: 'Thứ 2', focus: 'Ngực, vai và tay sau', exercises: ['Hít đất: 4 x 8-12', 'Pike push-up: 3 x 8', 'Bench dip: 3 x 10'] },
        { day: 'Thứ 3', focus: 'Chân & mông', exercises: ['Goblet squat: 4 x 10', 'Romanian deadlift: 3 x 10', 'Calf raise: 3 x 15'] },
        { day: 'Thứ 5', focus: 'Lưng & tay trước', exercises: ['Kéo xà hoặc kéo dây: 4 x 6-10', 'Australian row: 3 x 10', 'Curl: 3 x 12'] },
        { day: 'Thứ 6', focus: 'Cardio & core', exercises: ['Plank: 3 x 40 giây', 'Mountain climber: 3 x 30 giây', 'Cardio nhẹ: 15 phút'] },
        { day: 'Thứ 7', focus: 'Core & điều hòa', exercises: ['Dead bug: 3 x 10 mỗi bên', 'Side plank: 3 x 30 giây', 'Giãn cơ: 10 phút'] }
      ],
      benefits: ['Tùy chỉnh tần suất, thời lượng và ngày bận', 'Đổi bài theo dụng cụ đang có', 'Điều chỉnh lịch theo phản hồi và kiểm tra form 1 video / ngày'],
      limitation: 'AI Plus có lịch cá nhân theo tuần, chưa có block tiến độ dài 8-12 tuần.'
    },
    Pro: {
      title: 'Lộ trình AI PT chuyên sâu',
      description: 'Lộ trình dài hạn có giai đoạn tăng nền, phát triển và kiểm tra tiến độ.',
      frequency: '5 buổi / tuần',
      duration: '60-75 phút / buổi',
      period: 'Block 8-12 tuần',
      sessions: [
        { day: 'Thứ 2', focus: 'Push strength', exercises: ['Bench press: 4 x 6-8', 'Overhead press: 4 x 8', 'Triceps extension: 3 x 12'] },
        { day: 'Thứ 3', focus: 'Lower strength', exercises: ['Squat: 4 x 6-8', 'Romanian deadlift: 4 x 8', 'Split squat: 3 x 10'] },
        { day: 'Thứ 4', focus: 'Phục hồi chủ động', exercises: ['Cardio vùng nhẹ: 20 phút', 'Mobility: 15 phút', 'Kegel hoặc giãn cơ: 10 phút'] },
        { day: 'Thứ 5', focus: 'Pull hypertrophy', exercises: ['Pull-up hoặc lat pulldown: 4 x 8', 'Row: 4 x 10', 'Face pull: 3 x 15'] },
        { day: 'Thứ 7', focus: 'Toàn thân & kiểm tra', exercises: ['Deadlift kỹ thuật: 3 x 5', 'Push-up: 3 hiệp tối đa kỹ thuật', 'Core circuit: 3 vòng'] }
      ],
      phases: [
        { weeks: 'Tuần 1-3', startWeek: 1, endWeek: 3, name: 'Xây nền kỹ thuật', detail: 'Làm quen bài tập, giữ kỹ thuật chắc và mức gắng sức vừa phải.' },
        { weeks: 'Tuần 4-6', startWeek: 4, endWeek: 6, name: 'Tăng khối lượng', detail: 'Tăng dần số hiệp hoặc số lần khi cơ thể hoàn thành tốt bài tập.' },
        { weeks: 'Tuần 7-9', startWeek: 7, endWeek: 9, name: 'Tăng cường độ', detail: 'Điều chỉnh mức tạ và thời gian nghỉ theo kết quả từng buổi.' },
        { weeks: 'Tuần 10-12', startWeek: 10, endWeek: 12, name: 'Deload & đánh giá', detail: 'Giảm tải hợp lý, xem lại form và lập hướng đi cho block tiếp theo.' }
      ],
      benefits: ['Tùy chỉnh lịch và theo dõi hoàn tất từng tuần', 'Tạo block linh hoạt theo tần suất, tăng hoặc giảm tạ theo tiến độ', 'Phân tích video form và báo cáo tiến độ chi tiết'],
      limitation: 'AI Pro vẫn cần bạn báo lại mức tạ, cảm nhận và lịch nghỉ để điều chỉnh chính xác.'
    }
  };

  const data = {
    ...planData.Pro,
    sessions: goalWorkoutPlans[user.goal] || planData.Pro.sessions,
    title: 'Lộ trình tập luyện cá nhân',
    description: 'Lịch tập được điều chỉnh theo mục tiêu, thời gian và phản hồi thực tế của bạn.',
    benefits: [
      'Tùy chỉnh tần suất, thời lượng và ngày bận',
      'Đổi bài theo dụng cụ đang có',
      'Theo dõi hoàn tất từng tuần và block linh hoạt theo tần suất',
      'Phân tích ảnh, video form và tiến độ'
    ],
    limitation: 'Hãy cập nhật lịch bận, cảm nhận và kết quả tập để AI điều chỉnh sát hơn.'
  };
  const blockSettings = getBlockSettings(frequency);
  const planPeriod = blockSettings.label;
  const blockPhases = blockSettings.phases;
  const weekDays = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
  const scheduleWeekKey = currentWeek || 'current';
  const userStorageId = user.id || user._id || user.email;
  const scheduleStorageKey = `fitness-ai-busy-days-${userStorageId}-${planLabel}-${scheduleWeekKey}`;
  const completedStorageKey = `fitness-ai-completed-days-${userStorageId}-${planLabel}-${scheduleWeekKey}`;
  const settingsStorageKey = `fitness-ai-settings-${userStorageId}-${planLabel}-${scheduleWeekKey}`;
  const progressStorageKey = `fitness-ai-current-week-${userStorageId}`;

  const sessionsForFrequency = data.sessions.slice(0, frequency);
  const daysWithTraining = sessionsForFrequency.map((session) => session.day);
  const hasBusyTrainingDay = busyDays.some((day) => daysWithTraining.includes(day));
  const availableDays = weekDays.filter((day) => !busyDays.includes(day));
  const canReschedule = availableDays.length >= sessionsForFrequency.length;
  const adjustedSessions = hasBusyTrainingDay && canReschedule
    ? sessionsForFrequency.map((session, index) => ({
      ...session,
      day: availableDays[index]
    }))
    : sessionsForFrequency;

  useEffect(() => {
    const savedBusyDays = localStorage.getItem(scheduleStorageKey);
    const savedCompletedDays = localStorage.getItem(completedStorageKey);

    try {
      setBusyDays(savedBusyDays ? JSON.parse(savedBusyDays) : []);
      setCompletedDays(savedCompletedDays ? JSON.parse(savedCompletedDays) : []);

      const savedSettings = localStorage.getItem(settingsStorageKey);
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setFrequency(Number(parsedSettings.frequency) || defaultFrequency);
        setDuration(parsedSettings.duration || defaultDuration);
      } else {
        setFrequency(defaultFrequency);
        setDuration(defaultDuration);
      }
    } catch (error) {
      setBusyDays([]);
      setCompletedDays([]);
      setFrequency(defaultFrequency);
      setDuration(defaultDuration);
    }
  }, [
    scheduleStorageKey,
    completedStorageKey,
    settingsStorageKey,
    defaultFrequency,
    defaultDuration
  ]);

  function toggleBusyDay(day) {
    const nextBusyDays = busyDays.includes(day)
      ? busyDays.filter((busyDay) => busyDay !== day)
      : [...busyDays, day];

    setBusyDays(nextBusyDays);
    localStorage.setItem(scheduleStorageKey, JSON.stringify(nextBusyDays));
  }

  function toggleCompletedDay(day) {
    const nextCompletedDays = completedDays.includes(day)
      ? completedDays.filter((completedDay) => completedDay !== day)
      : [...completedDays, day];

    setCompletedDays(nextCompletedDays);
    localStorage.setItem(completedStorageKey, JSON.stringify(nextCompletedDays));
  }

  function updateScheduleSetting(name, value) {
    const nextSettings = {
      frequency,
      duration,
      [name]: value
    };

    if (name === 'frequency') {
      setFrequency(Number(value));
    }

    if (name === 'duration') {
      setDuration(value);
    }

    localStorage.setItem(settingsStorageKey, JSON.stringify(nextSettings));
  }

  function finishWeek() {
    const missingSessions = adjustedSessions.filter((session) => {
      return !completedDays.includes(session.day);
    });

    if (missingSessions.length > 0) {
      setWeekReview(missingSessions);
      setReviewDecisions({});
      return;
    }

    moveToNextWeek();
  }

  function moveToNextWeek() {
    setCompletedDays([]);
    localStorage.setItem(completedStorageKey, JSON.stringify([]));

    if (currentWeek && currentWeek < blockSettings.maxWeeks) {
      const nextWeek = currentWeek + 1;
      localStorage.setItem(progressStorageKey, String(nextWeek));
      setCurrentWeek(nextWeek);
    }

    setWeekReview(null);
    setReviewDecisions({});
    window.alert('Đã hoàn tất tuần. Bạn đã chuyển sang tuần tiếp theo.');
  }

  function chooseReviewDecision(day, decision) {
    setReviewDecisions({
      ...reviewDecisions,
      [day]: decision
    });
  }

  function confirmWeekReview() {
    const hasAllDecisions = weekReview.every((session) => reviewDecisions[session.day]);

    if (!hasAllDecisions) {
      window.alert('Vui lòng chọn cách xử lý cho tất cả buổi chưa tập.');
      return;
    }

    const forgottenDays = weekReview
      .filter((session) => reviewDecisions[session.day] === 'completed')
      .map((session) => session.day);
    const missedDays = weekReview
      .filter((session) => reviewDecisions[session.day] === 'reschedule')
      .map((session) => session.day);
    const nextCompletedDays = [...new Set([...completedDays, ...forgottenDays])];

    if (missedDays.length > 0) {
      const nextBusyDays = [...new Set([...busyDays, ...missedDays])];
      const remainingDays = weekDays.filter((day) => !nextBusyDays.includes(day));

      if (remainingDays.length < sessionsForFrequency.length) {
        window.alert('Tuần này không còn đủ ngày trống để sắp xếp lại toàn bộ buổi tập.');
        return;
      }

      setBusyDays(nextBusyDays);
      localStorage.setItem(scheduleStorageKey, JSON.stringify(nextBusyDays));
      setCompletedDays(nextCompletedDays);
      localStorage.setItem(completedStorageKey, JSON.stringify(nextCompletedDays));
      setWeekReview(null);
      setReviewDecisions({});
      window.alert('AI đã ghi nhận buổi chưa tập và sắp xếp lại lịch.');
      return;
    }

    moveToNextWeek();
  }

  useEffect(() => {
    const savedWeek = Number(localStorage.getItem(progressStorageKey)) || 1;
    setCurrentWeek(Math.min(Math.max(savedWeek, 1), blockSettings.maxWeeks));
  }, [progressStorageKey, blockSettings.maxWeeks]);

  function getPhaseStatus(phase) {
    if (!currentWeek || currentWeek < phase.startWeek) {
      return 'upcoming-phase';
    }

    if (currentWeek > phase.endWeek) {
      return 'completed-phase';
    }

    return 'current-phase';
  }

  return (
    <>
      <section className="dashboard-section ai-plan-intro">
        <div className="section-title">
          <div>
            <span className="plan-label">Member</span>
            <h3>{data.title}</h3>
            <p>{data.description}</p>
          </div>
        </div>

        <div className="plan-summary-grid">
          <div>
            <span>Tần suất</span>
            <select
              className="plan-summary-select"
              value={frequency}
              onChange={(event) => updateScheduleSetting('frequency', event.target.value)}
              aria-label="Chỉnh tần suất tập mỗi tuần"
            >
              {[2, 3, 4, 5]
                .filter((value) => value <= data.sessions.length)
                .map((value) => (
                  <option value={value} key={value}>{value} buổi / tuần</option>
                ))}
            </select>
          </div>
          <div>
            <span>Thời lượng</span>
            <select
              className="plan-summary-select"
              value={duration}
              onChange={(event) => updateScheduleSetting('duration', event.target.value)}
              aria-label="Chỉnh thời lượng mỗi buổi tập"
            >
              <option value="20-30 phút">20-30 phút / buổi</option>
              <option value="30-45 phút">30-45 phút / buổi</option>
              <option value="45-60 phút">45-60 phút / buổi</option>
              <option value="60-75 phút">60-75 phút / buổi</option>
            </select>
          </div>
          <div>
            <span>Thời gian lộ trình</span>
            <strong>{planPeriod}</strong>
          </div>
          <div>
            <span>Mục tiêu của bạn</span>
            <strong>{user.goal || 'Chưa cập nhật'}</strong>
          </div>
        </div>

        <div className="plan-level-note plan-level-member">
          <strong>Lịch tập Member</strong>
          <span>
            Tùy chỉnh lịch tuần, theo dõi tiến độ và điều chỉnh theo phản hồi.
          </span>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-title">
          <div>
            <h3>Lịch tập trong tuần</h3>
            <p>Đây là kế hoạch được sắp theo ngày rảnh và tần suất bạn chọn.</p>
          </div>
          <div className="weekly-actions">
            {completedDays.length > 0 && (
              <button type="button" onClick={finishWeek}>
                Hoàn tất tuần
              </button>
            )}
            <button
              className="ghost-button"
              type="button"
              onClick={() => setShowScheduleSettings(!showScheduleSettings)}
            >
              Tùy chỉnh lịch cá nhân
            </button>
          </div>
        </div>

        {showScheduleSettings && (
          <div className="schedule-settings">
            <strong>Đánh dấu ngày bạn bận trong tuần này</strong>
            <p>AI sẽ dời buổi tập sang các ngày còn trống và lưu riêng cho tuần hiện tại.</p>
            <div className="weekday-selector">
              {weekDays.map((day) => (
                <label className="weekday-option" key={day}>
                  <input
                    type="checkbox"
                    checked={busyDays.includes(day)}
                    onChange={() => toggleBusyDay(day)}
                  />
                  <span>{day}</span>
                </label>
              ))}
            </div>
            {!canReschedule && (
              <p className="form-error">
                Bạn cần để trống ít nhất {sessionsForFrequency.length} ngày để hệ thống xếp đủ buổi tập.
              </p>
            )}
          </div>
        )}

        {weekReview && (
          <div className="week-review">
            <h4>Chưa hoàn thành đủ buổi tập</h4>
            <p>Chọn cách xử lý cho buổi còn thiếu:</p>
            {weekReview.map((session) => (
              <div className="review-session" key={session.day}>
                <div>
                  <strong>{session.day}</strong>
                  <span>{session.focus}</span>
                </div>
                <div className="review-choice-list">
                  <button
                    className={reviewDecisions[session.day] === 'completed' ? 'selected-choice' : 'ghost-button'}
                    type="button"
                    onClick={() => chooseReviewDecision(session.day, 'completed')}
                  >
                    Đã tập
                  </button>
                  <button
                    className={reviewDecisions[session.day] === 'reschedule' ? 'selected-danger-choice' : 'ghost-button'}
                    type="button"
                    onClick={() => chooseReviewDecision(session.day, 'reschedule')}
                  >
                    Chưa tập, dời lịch
                  </button>
                </div>
              </div>
            ))}
            <div className="review-footer">
              <button className="ghost-button" type="button" onClick={() => setWeekReview(null)}>
                Để sau
              </button>
              <button type="button" onClick={confirmWeekReview}>
                Xác nhận
              </button>
            </div>
          </div>
        )}

        <div className="weekly-plan-grid">
          {weekDays.map((day) => {
            const session = adjustedSessions.find((item) => item.day === day);

            if (!session) {
              return (
                <article className={`workout-day-card rest-day-card ${busyDays.includes(day) ? 'busy-rest-day-card' : ''}`} key={day}>
                  <span>{day}</span>
                  <h4>{busyDays.includes(day) ? 'Bận - nghỉ tập' : 'Ngày nghỉ'}</h4>
                  <p>
                    {busyDays.includes(day)
                      ? 'AI đã ghi nhận ngày này không thể tập.'
                      : 'Phục hồi, đi bộ nhẹ hoặc giãn cơ 10-15 phút.'}
                  </p>
                </article>
              );
            }

            return (
              <article
                className={`workout-day-card ${completedDays.includes(session.day) ? 'completed-workout-card' : ''}`}
                key={session.day}
              >
                <span className={completedDays.includes(session.day) ? 'workout-status-done' : 'workout-status-pending'}>
                  {`${session.day} - ${completedDays.includes(session.day) ? 'Đã tập' : 'Chưa tập'}`}
                </span>
                <h4>{session.focus}</h4>
                <ul>
                  {session.exercises.map((exercise) => <li key={exercise}>{exercise}</li>)}
                </ul>
                <label className="completed-toggle">
                  <input
                    type="checkbox"
                    checked={completedDays.includes(session.day)}
                    onChange={() => toggleCompletedDay(session.day)}
                  />
                  <span>Đã tập</span>
                </label>
              </article>
            );
          })}
        </div>
      </section>

      {blockPhases && (
        <section className="dashboard-section">
          <div className="section-title">
            <div>
              <h3>Tiến trình trong {planPeriod.toLowerCase()}</h3>
              <p>Mỗi tuần có {frequency} buổi theo lịch bên trên, còn nội dung và mức độ sẽ tăng theo từng giai đoạn.</p>
              {currentWeek && <p className="current-week-text">Bạn đang tập: Tuần {currentWeek} / {blockSettings.maxWeeks}</p>}
            </div>
          </div>

          <div className="block-phase-grid">
            {blockPhases.map((phase) => (
              <article className={`block-phase-card ${getPhaseStatus(phase)}`} key={phase.weeks}>
                <span>{phase.weeks}</span>
                <h4>{phase.name}</h4>
                <p>{phase.detail}</p>
                <strong className="phase-status">
                  {getPhaseStatus(phase) === 'current-phase'
                    ? 'Đang tập'
                    : getPhaseStatus(phase) === 'completed-phase'
                      ? 'Đã hoàn thành'
                      : 'Sắp tới'}
                </strong>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="dashboard-section plan-value-section">
        <div>
          <h3>Quyền lợi Member</h3>
          <ul className="plan-benefit-list">
            {data.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}
          </ul>
        </div>
        <p className="premium-note">{data.limitation}</p>
      </section>
    </>
  );
}

export default AiPlanPage;
