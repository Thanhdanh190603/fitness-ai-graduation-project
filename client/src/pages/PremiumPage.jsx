import { useEffect, useState } from 'react';
import api from '../api';

const mealPlanRequests = new Map();

function requestMealPlan(cacheKey, payload) {
  if (!mealPlanRequests.has(cacheKey)) {
    const request = api.post('/ai/meal-plan-analysis', payload)
      .then((response) => response.data)
      .finally(() => mealPlanRequests.delete(cacheKey));

    mealPlanRequests.set(cacheKey, request);
  }

  return mealPlanRequests.get(cacheKey);
}

function PremiumPage({ user }) {
  const today = new Date().toISOString().slice(0, 10);
  const [sleepHours, setSleepHours] = useState('');
  const [sleepLog, setSleepLog] = useState(null);
  const [sleepLoading, setSleepLoading] = useState(false);
  const [sleepError, setSleepError] = useState('');
  const [energyLevel, setEnergyLevel] = useState('');
  const [savedEnergyLevel, setSavedEnergyLevel] = useState('');
  const [mealType, setMealType] = useState('Bữa sáng');
  const [mealName, setMealName] = useState('');
  const [mealDate, setMealDate] = useState(today);
  const [meals, setMeals] = useState([]);
  const [mealPhotoFile, setMealPhotoFile] = useState(null);
  const [mealPhotoName, setMealPhotoName] = useState('');
  const [mealAnalysis, setMealAnalysis] = useState(null);
  const [mealAnalysisLoading, setMealAnalysisLoading] = useState(false);
  const [mealAnalysisError, setMealAnalysisError] = useState('');
  const [mealLogLoading, setMealLogLoading] = useState(false);
  const [mealLogError, setMealLogError] = useState('');
  const [aiMealSuggestions, setAiMealSuggestions] = useState([]);
  const [mealPlanSummary, setMealPlanSummary] = useState(null);
  const [mealPlanLoading, setMealPlanLoading] = useState(false);
  const [mealPlanError, setMealPlanError] = useState('');
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [completedMeals, setCompletedMeals] = useState([]);
  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    const clock = setInterval(() => setCurrentTime(new Date()), 1000);

    return () => clearInterval(clock);
  }, []);

  const goalText = String(user.goal || '').toLowerCase();
  const isFatLossGoal = goalText.includes('giảm mỡ') || goalText.includes('giam mo');
  const isRecompGoal = goalText.includes('tăng cơ giảm mỡ')
    || goalText.includes('tang co giam mo');
  const isGainGoal = !isRecompGoal && (goalText.includes('tăng cân')
    || goalText.includes('tang can')
    || goalText.includes('tăng cơ')
    || goalText.includes('tang co'));
  const isEnduranceGoal = goalText.includes('tăng sức bền')
    || goalText.includes('tang suc ben');
  const isCalisthenicsGoal = goalText.includes('calisthenics');
  const suggestionSets = isFatLossGoal
    ? [
      [
        ['Bữa sáng', 'Trứng, bánh mì nguyên cám và trái cây', 'Đủ đạm, no lâu'],
        ['Bữa trưa', 'Ức gà, cơm vừa đủ và rau xanh', 'Ưu tiên rau và đạm'],
        ['Bữa phụ', 'Sữa chua không đường và hạt', 'Hạn chế đồ ngọt'],
        ['Bữa tối', 'Cá, khoai lang và salad', 'Ăn vừa đủ trước khi nghỉ']
      ],
      [
        ['Bữa sáng', 'Sữa chua Hy Lạp, yến mạch và chuối', 'Bữa sáng nhẹ, giàu đạm'],
        ['Bữa trưa', 'Thịt nạc, cơm gạo lứt và rau củ', 'Cân bằng khẩu phần'],
        ['Bữa phụ', 'Trái cây ít ngọt', 'Dùng khi đói giữa buổi'],
        ['Bữa tối', 'Đậu phụ, tôm và rau luộc', 'Ưu tiên đạm nạc']
      ]
    ]
    : isGainGoal
      ? [
        [
          ['Bữa sáng', 'Bánh mì trứng, sữa và chuối', 'Tăng năng lượng và đạm đầu ngày'],
          ['Bữa trưa', 'Cơm, thịt bò, trứng và rau xanh', 'Bữa chính giàu năng lượng'],
          ['Bữa phụ', 'Sinh tố chuối, sữa và yến mạch', 'Bổ sung năng lượng dễ dùng'],
          ['Bữa tối', 'Cá, cơm và rau củ', 'Hỗ trợ phục hồi sau tập']
        ],
        [
          ['Bữa sáng', 'Yến mạch, trứng, sữa và bơ đậu phộng', 'Nhiều năng lượng, giàu đạm'],
          ['Bữa trưa', 'Cơm, ức gà, đậu phụ và canh rau', 'Tăng đạm từ nhiều nguồn'],
          ['Bữa phụ', 'Sữa chua, hạt và trái cây', 'Bổ sung năng lượng giữa buổi'],
          ['Bữa tối', 'Thịt nạc, khoai tây và rau củ', 'Đủ chất cho hồi phục']
        ]
      ]
      : isRecompGoal
        ? [
          [
            ['Bữa sáng', 'Yến mạch, trứng và sữa chua Hy Lạp', 'Đạm cao, tinh bột vừa đủ'],
            ['Bữa trưa', 'Ức gà, cơm gạo lứt và rau xanh', 'Giữ cơ bắp, kiểm soát năng lượng'],
            ['Bữa phụ', 'Phô mai tươi và một quả táo', 'Bổ sung đạm nhẹ giữa buổi'],
            ['Bữa tối', 'Cá, khoai lang và salad', 'No lâu, không dư năng lượng']
          ],
          [
            ['Bữa sáng', 'Bánh mì nguyên cám, trứng và sữa', 'Cân bằng đạm và tinh bột'],
            ['Bữa trưa', 'Thịt nạc, khoai tây và rau củ', 'Ưu tiên đạm nạc và chất xơ'],
            ['Bữa phụ', 'Sữa chua không đường và hạt', 'Hỗ trợ phục hồi sau tập'],
            ['Bữa tối', 'Tôm, đậu phụ và rau luộc', 'Giàu đạm, nhẹ bụng']
          ]
        ]
        : isEnduranceGoal
          ? [
            [
              ['Bữa sáng', 'Yến mạch, sữa chua và chuối', 'Nạp tinh bột ổn định cho buổi tập'],
              ['Bữa trưa', 'Cơm, ức gà và rau củ', 'Bổ sung glycogen và đạm'],
              ['Bữa phụ', 'Chuối, sữa và bánh mì nguyên cám', 'Nạp nhanh trước hoặc sau tập'],
              ['Bữa tối', 'Cá, mì ống và rau xanh', 'Phục hồi năng lượng sau vận động']
            ],
            [
              ['Bữa sáng', 'Khoai lang, trứng và sữa', 'Tinh bột tốt cho sức bền'],
              ['Bữa trưa', 'Cơm, thịt nạc, trứng và canh rau', 'Đủ năng lượng cho ngày vận động'],
              ['Bữa phụ', 'Sinh tố chuối và yến mạch', 'Bù năng lượng dễ tiêu'],
              ['Bữa tối', 'Cá hồi, cơm và salad', 'Đạm tốt cho hồi phục']
            ]
          ]
          : isCalisthenicsGoal
            ? [
              [
                ['Bữa sáng', 'Bánh mì nguyên cám, trứng, sữa và chuối', 'Đạm và tinh bột cho bài tập trọng lượng cơ thể'],
                ['Bữa trưa', 'Cơm, thịt bò, rau xanh và canh', 'Hỗ trợ sức mạnh và phục hồi'],
                ['Bữa phụ', 'Sữa chua, yến mạch và trái cây', 'Bổ sung năng lượng trước buổi tập'],
                ['Bữa tối', 'Ức gà, khoai lang và rau củ', 'Đủ đạm để sửa chữa cơ bắp']
              ],
              [
                ['Bữa sáng', 'Yến mạch, trứng và bơ đậu phộng', 'Năng lượng ổn định cho kỹ thuật'],
                ['Bữa trưa', 'Cơm, cá, đậu phụ và rau', 'Cân bằng đạm thực vật và động vật'],
                ['Bữa phụ', 'Sữa và một quả chuối', 'Hỗ trợ buổi tập xà, đẩy'],
                ['Bữa tối', 'Thịt nạc, cơm vừa đủ và salad', 'Phục hồi sau tập']
              ]
            ]
            : [
              [
                ['Bữa sáng', 'Yến mạch, trứng, sữa và chuối', 'Đạm và tinh bột cho buổi sáng'],
                ['Bữa trưa', 'Cơm, ức gà, rau xanh và canh', 'Bữa chính cân bằng'],
                ['Bữa phụ', 'Sữa chua, hạt và trái cây', 'Bổ sung năng lượng giữa buổi'],
                ['Bữa tối', 'Cá, khoai tây và rau củ', 'Phục hồi sau tập']
              ],
              [
                ['Bữa sáng', 'Bánh mì trứng, bơ đậu phộng và sữa', 'Tăng năng lượng đầu ngày'],
                ['Bữa trưa', 'Thịt bò, cơm và rau củ xào', 'Bổ sung đạm và tinh bột'],
                ['Bữa phụ', 'Sinh tố chuối và bột yến mạch', 'Dễ dùng sau buổi tập'],
                ['Bữa tối', 'Cá hồi, cơm và salad', 'Đạm tốt cho phục hồi']
              ]
            ];

  const mealSuggestions = suggestionSets[suggestionIndex % suggestionSets.length];
  const mealsToday = meals.filter((meal) => meal.date === today);
  const todayCalories = mealsToday.reduce(
    (total, meal) => total + (Number(meal.calories) || 0),
    0
  );
  const personalizedMealSuggestions = mealSuggestions.map(([meal, food, note]) => {
    const loggedMeal = mealsToday.find((item) => item.type === meal);

    if (!loggedMeal) {
      return [meal, food, note];
    }

    const caloriesText = loggedMeal.calories !== undefined && loggedMeal.calories !== null
      ? ` - khoảng ${loggedMeal.calories} kcal`
      : '';

    return [
      meal,
      `${loggedMeal.name}${caloriesText}`,
      'Đã ghi nhận trong nhật ký, AI sẽ dựa vào món này để cân đối các bữa còn lại.'
    ];
  });

  useEffect(() => {
    let isActive = true;

    async function loadAiMealPlan() {
      const currentMeals = meals.filter((meal) => meal.date === today);
      const variation = suggestionIndex + 1;
      const cacheKey = `fitness-ai-demo-meal-plan-v2-${user.email}-${user.goal}-${today}-${variation}-${JSON.stringify(currentMeals)}`;

      try {
        const cachedPlan = window.sessionStorage.getItem(cacheKey);
        const cachedData = cachedPlan ? JSON.parse(cachedPlan) : null;

        if (cachedData?.mealSuggestions) {
          setAiMealSuggestions(cachedData.mealSuggestions);
          setMealPlanSummary(cachedData);
          setMealPlanError('');
          return;
        }
      } catch (error) {
        // Bỏ qua cache lỗi, vẫn gọi AI bình thường.
      }

      setMealPlanLoading(true);
      setMealPlanError('');

      try {
        const data = await requestMealPlan(cacheKey, {
          date: today,
          variation,
          meals: currentMeals
        });

        if (isActive) {
          const suggestions = data.mealSuggestions || [];
          setAiMealSuggestions(suggestions);
          setMealPlanSummary(data);
          window.sessionStorage.setItem(cacheKey, JSON.stringify(data));
        }
      } catch (error) {
        if (isActive) {
          setAiMealSuggestions([]);
          setMealPlanSummary(null);
          setMealPlanError(
            `${error.response?.data?.message || 'AI chưa tạo được thực đơn mới'}, đang hiển thị gợi ý cơ bản.`
          );
        }
      } finally {
        if (isActive) {
          setMealPlanLoading(false);
        }
      }
    }

    loadAiMealPlan();

    return () => {
      isActive = false;
    };
  }, [meals, suggestionIndex, today, user.email, user.goal]);

  const visibleMealSuggestions = aiMealSuggestions.length > 0
    ? aiMealSuggestions.map((item) => [
      item.meal,
      `${item.food}${item.caloriesEstimate !== undefined && item.caloriesEstimate !== null ? ` - khoảng ${item.caloriesEstimate} kcal` : ''}`,
      item.reason
    ])
    : personalizedMealSuggestions;
  const mealTypes = ['Bữa sáng', 'Bữa trưa', 'Bữa phụ', 'Bữa tối'];
  const allMealsCompleted = mealTypes.every((meal) => completedMeals.includes(meal));
  const displayTime = currentTime.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  const displayDate = currentTime.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  const weight = Number(user.weightKg);
  const waterTarget = weight
    ? Math.max(1.5, Math.round(weight * 0.033 * 10) / 10)
    : 2;
  const calorieAdjustment = isFatLossGoal
    ? -300
    : isGainGoal
      ? 300
      : isEnduranceGoal
        ? 150
        : isCalisthenicsGoal
          ? 100
          : 0;
  const baseCalories = weight > 0 ? weight * 30 : 2000;
  const dailyCalorieGoal = Math.max(
    1400,
    Math.round((baseCalories + calorieAdjustment) / 50) * 50
  );
  const loggedSleepHours = Number(sleepLog?.hours);
  const sleepNeedsRecovery = Number.isFinite(loggedSleepHours) && loggedSleepHours < 8;
  const sleepAlertLabel = loggedSleepHours < 4
    ? 'Cảnh báo nghiêm trọng'
    : sleepNeedsRecovery
      ? 'Cảnh báo: chưa đủ hồi phục'
      : 'Trạng thái hồi phục ổn định';

  async function saveSleepLog(event) {
    event.preventDefault();

    if (!sleepHours || sleepLoading) {
      return;
    }

    setSleepLoading(true);
    setSleepError('');

    try {
      const response = await api.post('/ai/sleep-analysis', {
        sleepHours: Number(sleepHours),
        energyLevel
      });

      setSleepLog({ hours: sleepHours, ...response.data });
    } catch (error) {
      setSleepError(error.response?.data?.message || 'Không thể phân tích giấc ngủ lúc này.');
    } finally {
      setSleepLoading(false);
    }
  }

  function saveEnergyLog() {
    if (energyLevel) {
      setSavedEnergyLevel(energyLevel);
    }
  }

  function markMealAsCompleted(mealDateValue, mealTypeValue) {
    if (mealDateValue !== today) {
      return;
    }

    setCompletedMeals((currentMeals) => currentMeals.includes(mealTypeValue)
      ? currentMeals
      : [...currentMeals, mealTypeValue]);
  }

  async function addMeal(event) {
    event.preventDefault();

    if (!mealName.trim() || mealLogLoading) {
      return;
    }

    setMealLogLoading(true);
    setMealLogError('');

    try {
      const response = await api.post('/ai/meal-text-analysis', {
        mealName: mealName.trim()
      });

      setMeals([
        ...meals,
        {
          id: Date.now(),
          date: mealDate,
          type: mealType,
          name: response.data.dishName || mealName.trim(),
          calories: response.data.caloriesEstimate
        }
      ]);
      markMealAsCompleted(mealDate, mealType);
      setMealName('');
    } catch (error) {
      setMealLogError(error.response?.data?.message || 'Không thể tính kcal cho món ăn lúc này.');
    } finally {
      setMealLogLoading(false);
    }
  }

  function formatDate(dateString) {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(`${dateString}T00:00:00`));
  }

  const mealDates = [...new Set(meals.map((meal) => meal.date))].sort().reverse();

  function handlePhotoChange(event) {
    const file = event.target.files[0];
    setMealPhotoFile(file || null);
    setMealPhotoName(file ? file.name : '');
    setMealAnalysis(null);
    setMealAnalysisError('');
  }

  async function analyzeMealPhoto() {
    if (!mealPhotoFile || mealAnalysisLoading) {
      return;
    }

    setMealAnalysisLoading(true);
    setMealAnalysis(null);
    setMealAnalysisError('');

    try {
      const formData = new FormData();
      formData.append('mealImage', mealPhotoFile);
      const response = await api.post('/ai/meal-analysis', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMealAnalysis(response.data);
    } catch (error) {
      setMealAnalysisError(
        error.response?.data?.message || 'Không thể phân tích ảnh món ăn lúc này.'
      );
    } finally {
      setMealAnalysisLoading(false);
    }
  }

  function addAnalyzedMealToJournal() {
    if (!mealAnalysis?.isFood) {
      return;
    }

    setMeals([
      ...meals,
      {
        id: Date.now(),
        date: mealDate,
        type: mealType,
        name: mealAnalysis.dishName,
        calories: mealAnalysis.caloriesEstimate
      }
    ]);
    markMealAsCompleted(mealDate, mealType);
  }

  return (
    <>
      <section className="dashboard-section premium-page">
        <div className="premium-heading">
          <div>
            <span className="plan-label">Member</span>
            <h3>
              Trợ lý AI cá nhân
              <span className="premium-crown" aria-hidden="true">♛</span>
            </h3>
            <p>Xin chào {user.fullName}, hãy cập nhật dữ liệu để AI theo sát bạn hơn.</p>
          </div>
          <div className="premium-live-info" aria-live="polite">
            <div>
              <span>Thời gian hiện tại</span>
              <strong>{displayTime}</strong>
              <small>{displayDate}</small>
            </div>
          </div>
        </div>
      </section>

      <div className="water-target-card water-target-top">
        <div className="daily-goal-heading">
          <strong>Mục tiêu hôm nay</strong>
          <small>AI demo tính theo cân nặng, mục tiêu và dữ liệu bạn đã cập nhật.</small>
        </div>
        <div className="daily-goal-grid">
          <div className="daily-goal-item">
            <span>Nước cần uống</span>
            <strong>{waterTarget} lít / ngày</strong>
            <small>Ước tính theo cân nặng.</small>
          </div>
          <div className="daily-goal-item">
            <span>Kcal cần nạp</span>
            <strong>{mealPlanSummary?.dailyCalorieTarget || dailyCalorieGoal} kcal / ngày</strong>
            <small>Phân bổ năng lượng phù hợp cho các bữa trong ngày.</small>
          </div>
        </div>
      </div>

      <section className="premium-tool-grid">
        <article className="premium-tool-card">
          <div className="tool-card-heading">
            <span className="premium-feature-icon premium-sleep-icon" aria-hidden="true">☾</span>
            <div>
              <h4>Nhật ký giấc ngủ</h4>
              <p>Ghi số giờ ngủ của đêm qua.</p>
            </div>
          </div>

          <form onSubmit={saveSleepLog}>
            <label>
              Số giờ đã ngủ
              <input
                type="number"
                min="0"
                max="24"
                step="0.5"
                value={sleepHours}
                onChange={(event) => setSleepHours(event.target.value)}
                placeholder="Ví dụ: 7.5"
              />
            </label>
            <button type="submit" disabled={sleepLoading}>
              {sleepLoading ? 'AI đang phân tích...' : 'Lưu giấc ngủ'}
            </button>
          </form>

          <div className="energy-check">
            <strong>Mức năng lượng hôm nay</strong>
            <span>Cho AI biết cơ thể đang sẵn sàng tập đến mức nào.</span>
            <small>Nếu ngủ dưới 8 giờ, AI vẫn ưu tiên bài tập nhẹ dù bạn chọn năng lượng Tốt.</small>
            <select value={energyLevel} onChange={(event) => setEnergyLevel(event.target.value)}>
              <option value="">Chọn mức năng lượng</option>
              <option value="low">Thấp - cần tập nhẹ</option>
              <option value="medium">Vừa - tập theo kế hoạch</option>
              <option value="high">Tốt - sẵn sàng tập</option>
            </select>
            <button type="button" className="ghost-button" onClick={saveEnergyLog} disabled={!energyLevel}>
              Ghi nhận năng lượng
            </button>
            {savedEnergyLevel && (
              <small>Đã ghi nhận: {energyLevel === 'low' ? 'Thấp' : energyLevel === 'medium' ? 'Vừa' : 'Tốt'}</small>
            )}
          </div>

          {sleepError && <p className="meal-analysis-error">{sleepError}</p>}
          {sleepLog && (
            <div className={`saved-log ${sleepNeedsRecovery ? 'sleep-warning' : 'sleep-ok'}`}>
              <div className="sleep-result-heading">
                <span className="sleep-alert-label">{sleepAlertLabel}</span>
                <strong>{sleepLog.hours} giờ</strong>
              </div>
              <span>Trạng thái: {sleepLog.sleepStatus}</span>
              <div className="sleep-result-detail">
                <b>Ảnh hưởng đến buổi tập</b>
                <p>{sleepLog.recoveryImpact}</p>
              </div>
              <div className="sleep-result-detail sleep-advice">
                <b>Lời khuyên hôm nay</b>
                <p>{sleepLog.advice}</p>
              </div>
            </div>
          )}
        </article>

        <article className="premium-tool-card">
          <div className="tool-card-heading">
            <span className="premium-feature-icon premium-meal-icon" aria-hidden="true">♨</span>
            <div>
              <h4>Nhật ký bữa ăn</h4>
              <p>Ghi lại món đã ăn trong ngày.</p>
            </div>
          </div>

          <form onSubmit={addMeal}>
            <label>
              Ngày ăn
              <input
                type="date"
                value={mealDate}
                onChange={(event) => setMealDate(event.target.value)}
              />
            </label>
            <label>
              Bữa ăn
              <select value={mealType} onChange={(event) => setMealType(event.target.value)}>
                <option>Bữa sáng</option>
                <option>Bữa trưa</option>
                <option>Bữa tối</option>
                <option>Bữa phụ</option>
              </select>
            </label>
            <label>
              Món ăn
              <input
                value={mealName}
                onChange={(event) => setMealName(event.target.value)}
                placeholder="Ví dụ: Cơm gà, rau xanh"
              />
            </label>
            <button type="submit" disabled={mealLogLoading}>
              {mealLogLoading ? 'AI đang tính kcal...' : 'Thêm bữa ăn'}
            </button>
          </form>
          {mealLogError && <p className="meal-analysis-error">{mealLogError}</p>}

          {meals.length > 0 && (
            <div className="meal-log-list">
              {meals.map((meal) => (
                <div key={meal.id}>
                  <span>{meal.type} - {formatDate(meal.date)}</span>
                  <strong>
                    {meal.name}
                    {meal.calories !== undefined && meal.calories !== null ? ` - ${meal.calories} kcal` : ''}
                  </strong>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="premium-tool-card">
            <div className="tool-card-heading">
              <span className="premium-feature-icon premium-photo-icon" aria-hidden="true">▧</span>
              <div>
                <h4>Phân tích ảnh món ăn</h4>
                <p>AI ước tính calo và dinh dưỡng từ ảnh món ăn.</p>
              </div>
            </div>

            <label>
              Ảnh món ăn
              <input type="file" accept="image/*" onChange={handlePhotoChange} />
            </label>
            {mealPhotoName && <p className="selected-file">{mealPhotoName}</p>}
            <button type="button" onClick={analyzeMealPhoto} disabled={mealAnalysisLoading}>
              {mealAnalysisLoading ? 'Đang phân tích...' : 'Phân tích ảnh món'}
            </button>
            {mealAnalysisError && <p className="meal-analysis-error">{mealAnalysisError}</p>}
            {mealAnalysis && (
              <div className="meal-analysis-result">
                {mealAnalysis.isFood ? (
                  <>
                    <strong>{mealAnalysis.dishName}</strong>
                    <div className="meal-calorie-highlight">
                      <span>Calo ước tính</span>
                      <b>{mealAnalysis.caloriesEstimate} kcal</b>
                      <small>{mealAnalysis.caloriesRange}</small>
                    </div>
                    <div className="meal-analysis-macros">
                      <span>Đạm <b>{mealAnalysis.proteinGram}g</b></span>
                      <span>Tinh bột <b>{mealAnalysis.carbGram}g</b></span>
                      <span>Chất béo <b>{mealAnalysis.fatGram}g</b></span>
                    </div>
                    <p>{mealAnalysis.portionNote}</p>
                    <p>{mealAnalysis.advice}</p>
                    <small>{mealAnalysis.note}</small>
                    <button type="button" className="ghost-button" onClick={addAnalyzedMealToJournal}>
                      Thêm vào nhật ký bữa ăn
                    </button>
                  </>
                ) : (
                  <p>{mealAnalysis.portionNote || 'Ảnh chưa đủ rõ để nhận diện món ăn.'}</p>
                )}
              </div>
            )}
        </article>
      </section>

      <section className="dashboard-section meal-plan-preview">
        <div className="section-title">
          <div>
            <h3>Gợi ý thực đơn AI</h3>
          <p>
              {todayCalories > 0
                ? `Hôm nay đã ghi khoảng ${todayCalories} kcal. Gợi ý tiếp theo sẽ dựa trên nhật ký của bạn.`
                : 'Thực đơn sẽ thay đổi theo ngày tập, ngày nghỉ và dữ liệu bạn cập nhật.'}
          </p>
          {mealPlanError && <small className="meal-plan-status">{mealPlanError}</small>}
          </div>
          <button
            className="ghost-button"
            type="button"
            disabled={mealPlanLoading}
            onClick={() => setSuggestionIndex(suggestionIndex + 1)}
          >
            {mealPlanLoading ? 'AI đang lên thực đơn...' : 'Đổi gợi ý'}
          </button>
        </div>

        {mealPlanSummary && (
          <>
            <p className="meal-plan-ai-summary">{mealPlanSummary.dailySummary}</p>
            <div className="meal-calorie-summary">
              <div>
                <span>Mục tiêu kcal/ngày</span>
                <strong>{mealPlanSummary.dailyCalorieTarget} kcal</strong>
              </div>
              <div>
                <span>Đã ghi hôm nay</span>
                <strong>{mealPlanSummary.consumedCalories} kcal</strong>
              </div>
              <div>
                <span>Còn lại trong ngày</span>
                <strong>{mealPlanSummary.remainingCalories} kcal</strong>
              </div>
            </div>
          </>
        )}

        <div className="meal-suggestion-list">
          {visibleMealSuggestions.map(([meal, food, note]) => (
            <div className="meal-suggestion-row" key={meal}>
              <label className="meal-complete-toggle">
                <input
                  type="checkbox"
                  checked={completedMeals.includes(meal)}
                  onChange={() => {
                    setCompletedMeals((currentMeals) => currentMeals.includes(meal)
                      ? currentMeals.filter((item) => item !== meal)
                      : [...currentMeals, meal]);
                  }}
                  aria-label={`Đánh dấu ${meal} đã ăn`}
                />
              </label>
              <strong>{meal}</strong>
              <span>{food}</span>
              <small>{note}</small>
            </div>
          ))}
        </div>

        {allMealsCompleted && (
          <div className="meal-day-complete">
            <strong>Đã hoàn thành thực đơn hôm nay</strong>
            <span>Thực đơn sẽ được làm mới sau 02:00 sáng ngày hôm sau.</span>
          </div>
        )}

      </section>

      <section className="dashboard-section meal-history-section">
        <div className="section-title">
          <div>
            <h3>Lịch sử bữa ăn</h3>
            <p>Xem lại những gì bạn đã ghi theo từng ngày.</p>
          </div>
          <span className="plan-label">{mealDates.length} ngày đã ghi</span>
        </div>

        {mealDates.length > 0 ? (
          <div className="meal-history-list">
            {mealDates.map((date) => {
              const mealsInDate = meals.filter((meal) => meal.date === date);

              return (
                <div className="meal-history-day" key={date}>
                  <div className="meal-history-date">
                    <strong>{formatDate(date)}</strong>
                    <span>{mealsInDate.length} bữa</span>
                    <small>
                      {mealsInDate.some((meal) => meal.calories)
                        ? `Khoảng ${mealsInDate.reduce((total, meal) => total + (Number(meal.calories) || 0), 0)} kcal`
                        : 'Chưa có đủ dữ liệu kcal'}
                    </small>
                  </div>
                  <div className="meal-history-items">
                    {mealsInDate.map((meal) => (
                      <span key={meal.id}>{meal.type}: {meal.name}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="empty-history">Chưa có bữa ăn nào được ghi lại.</p>
        )}
      </section>
    </>
  );
}

export default PremiumPage;
