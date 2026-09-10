const blogPosts = [
  {
    isUpdate: true,
    publishedDate: '18/03/2026',
    category: 'Cập nhật khoa học',
    title: 'Cập nhật 2026: tập đều quan trọng hơn giáo án phức tạp',
    excerpt: 'ACSM nhấn mạnh sự đều đặn, cá nhân hóa và tiến bộ từng bước trong tập kháng lực.',
    readTime: '4 phút đọc',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=85',
    content: 'Cập nhật vị trí mới của ACSM tổng hợp hơn 137 bài tổng quan với hơn 30.000 người tham gia. Lời khuyên cho người tập là chọn lịch có thể duy trì, tập các nhóm cơ chính ít nhất 2 ngày mỗi tuần và tăng dần khối lượng theo khả năng. Không cần chạy theo bài tập quá phức tạp; bài tập với tạ, dây kháng lực hoặc trọng lượng cơ thể đều có thể phù hợp nếu bạn tập đều và giữ kỹ thuật tốt.',
    categoryEn: 'Science update',
    titleEn: '2026 update: consistency matters more than complexity',
    excerptEn: 'ACSM highlights consistency, individualization and gradual progress in resistance training.',
    contentEn: 'ACSM’s new position stand reviewed more than 137 reviews involving over 30,000 participants. The practical advice is to choose a schedule you can maintain, train the major muscle groups at least twice a week and gradually build volume. You do not need a complicated routine; weights, resistance bands and bodyweight training can all work when training is consistent and controlled.',
    sourceName: 'ACSM - 2026 Resistance Training Position Stand',
    sourceUrl: 'https://acsm.org/science-spotlight-acsm-releases-new-position-stand-on-resistance-training/'
  },
  {
    isUpdate: true,
    publishedDate: '02/03/2026',
    category: 'Dinh dưỡng mới',
    title: 'Ăn uống lành mạnh: ưu tiên thực phẩm thật và đủ nhóm chất',
    excerpt: 'Gợi ý mới từ CDC giúp người tập xây bữa ăn dễ duy trì thay vì kiêng khem cực đoan.',
    readTime: '4 phút đọc',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=85',
    content: 'CDC khuyến khích ưu tiên thực phẩm giàu dinh dưỡng gồm đạm, rau, trái cây, ngũ cốc nguyên hạt, chất béo tốt và sữa không thêm đường. Người tập nên bắt đầu bằng việc thay nước ngọt bằng nước lọc, tăng chất xơ và chọn nguồn đạm đa dạng. Khẩu phần vẫn cần điều chỉnh theo mục tiêu tăng cân tăng cơ, tăng cơ giảm mỡ, giảm mỡ hoặc tăng sức bền.',
    categoryEn: 'Nutrition update',
    titleEn: 'Healthy eating: prioritize real food and balanced food groups',
    excerptEn: 'A CDC update helps active people build sustainable meals instead of using extreme restriction.',
    contentEn: 'The CDC recommends nutrient-dense foods such as protein, vegetables, fruit, whole grains, healthy fats and dairy without added sugar. A practical start is replacing sugary drinks with water, increasing fiber and varying protein sources. Portions still need to match the goal, whether that is gaining weight and muscle, recomposition, fat loss or endurance.',
    sourceName: 'CDC - Healthy Eating Tips',
    sourceUrl: 'https://www.cdc.gov/nutrition/features/healthy-eating-tips.html'
  },
  {
    isUpdate: true,
    publishedDate: '26/06/2024',
    category: 'Vận động',
    title: 'Lời khuyên nền tảng: vận động đều và ngồi ít hơn',
    excerpt: 'WHO khuyến nghị người trưởng thành tích lũy 150–300 phút vận động vừa mỗi tuần và tập sức mạnh từ 2 ngày.',
    readTime: '3 phút đọc',
    image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=900&q=85',
    content: 'WHO cho biết người trưởng thành nên hướng tới 150–300 phút vận động cường độ vừa hoặc 75–150 phút vận động mạnh mỗi tuần, đồng thời tập mạnh các nhóm cơ chính từ 2 ngày trở lên. Người mới không cần bắt đầu thật nặng: hãy chia nhỏ thời lượng, đi bộ thêm trong ngày và tăng dần khi cơ thể đã quen.',
    categoryEn: 'Movement',
    titleEn: 'A basic rule: move consistently and sit less',
    excerptEn: 'WHO recommends 150–300 minutes of moderate activity weekly for adults plus strength work on 2 or more days.',
    contentEn: 'WHO recommends that adults work toward 150–300 minutes of moderate activity or 75–150 minutes of vigorous activity each week, plus muscle-strengthening work on 2 or more days. Beginners do not need to start hard: split sessions into smaller blocks, walk more during the day and progress gradually as the body adapts.',
    sourceName: 'WHO - Physical activity',
    sourceUrl: 'https://www.who.int/news-room/fact-sheets/detail/physical-activity'
  },
  {
    category: 'Bắt đầu tập',
    title: 'Buổi tập đầu tiên: nên bắt đầu từ đâu?',
    excerpt: 'Một vài nguyên tắc đơn giản giúp người mới làm quen với phòng gym mà không bị quá tải.',
    readTime: '4 phút đọc',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=900&q=85',
    content: 'Hãy bắt đầu bằng các bài tập cơ bản, mức gắng sức vừa phải và tập trung vào kỹ thuật. Trong những tuần đầu, mục tiêu quan trọng nhất là tạo thói quen đều đặn, không phải nâng mức tạ thật nặng.'
    ,categoryEn: 'Getting started', titleEn: 'Where should your first workout begin?', excerptEn: 'Simple principles to help beginners start at the gym without doing too much.', contentEn: 'Start with basic exercises, moderate effort and a focus on technique. In the first weeks, building a consistent habit matters more than lifting very heavy.'
  },
  {
    category: 'Calisthenics',
    title: 'Xây nền sức mạnh với bài tập trọng lượng cơ thể',
    excerpt: 'Từ squat, hít đất đến plank: cách sắp xếp bài tập để cơ thể tiến bộ từng bước.',
    readTime: '5 phút đọc',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=900&q=85',
    content: 'Calisthenics nên bắt đầu từ phiên bản phù hợp với khả năng hiện tại. Khi kiểm soát được biên độ và nhịp thở, bạn mới chuyển sang biến thể khó hơn để tiến bộ bền vững.'
    ,categoryEn: 'Calisthenics', titleEn: 'Build strength with bodyweight training', excerptEn: 'From squats and push-ups to planks: a simple way to progress step by step.', contentEn: 'Begin with a variation that matches your current ability. Move to harder variations only after you can control the range of motion and breathing.'
  },
  {
    category: 'Dinh dưỡng',
    title: 'Ăn gì sau buổi tập để hồi phục tốt hơn?',
    excerpt: 'Cách kết hợp đạm, tinh bột và nước để cơ thể có đủ nguyên liệu phục hồi.',
    readTime: '4 phút đọc',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=85',
    content: 'Một bữa ăn sau tập nên có nguồn đạm, tinh bột vừa đủ và rau củ. Lượng ăn cụ thể còn phụ thuộc mục tiêu tăng cơ, tăng cân hay giảm mỡ của từng người.'
    ,categoryEn: 'Nutrition', titleEn: 'What should you eat after a workout?', excerptEn: 'Combine protein, carbohydrates and water to give your body what it needs to recover.', contentEn: 'A post-workout meal can include protein, enough carbohydrates and vegetables. The right amount depends on whether your goal is muscle gain, weight gain or fat loss.'
  },
  {
    category: 'Phục hồi',
    title: 'Ngủ đủ giúp buổi tập ngày mai tốt hơn thế nào?',
    excerpt: 'Giấc ngủ ảnh hưởng đến năng lượng, khả năng tập trung và quá trình phục hồi cơ bắp.',
    readTime: '4 phút đọc',
    image: 'https://images.unsplash.com/photo-1515894203077-9cd36032142f?auto=format&fit=crop&w=900&q=85',
    content: 'Hãy xem giấc ngủ là một phần của kế hoạch tập luyện. Khi ngủ chưa đủ, hãy giảm cường độ và ưu tiên kỹ thuật, đi bộ nhẹ hoặc giãn cơ thay vì cố hoàn thành buổi tập nặng.'
    ,categoryEn: 'Recovery', titleEn: 'How does sleep improve tomorrow’s workout?', excerptEn: 'Sleep affects energy, focus and the way your body recovers after training.', contentEn: 'Treat sleep as part of your training plan. When sleep is short, reduce intensity and choose technique work, light walking or mobility instead of forcing a hard session.'
  },
  {
    category: 'Lịch tập',
    title: 'Tập 4 buổi mỗi tuần có đủ để tiến bộ không?',
    excerpt: 'Cách chia lịch đơn giản cho người bận rộn nhưng vẫn muốn duy trì sức mạnh.',
    readTime: '5 phút đọc',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=85',
    content: 'Bốn buổi mỗi tuần là tần suất phù hợp với nhiều người nếu lịch được sắp xếp đều và có ngày phục hồi. Điều quan trọng là chất lượng buổi tập và khả năng duy trì lâu dài.'
    ,categoryEn: 'Training plan', titleEn: 'Is training four days a week enough?', excerptEn: 'A simple schedule for busy people who still want to build strength consistently.', contentEn: 'Four sessions per week can work well when the schedule is consistent and includes recovery days. Quality and long-term consistency matter most.'
  },
  {
    category: 'Kỹ thuật',
    title: 'Squat đúng kỹ thuật: 4 điểm cần kiểm tra',
    excerpt: 'Tư thế chân, đầu gối, lưng và nhịp thở là những điểm người mới nên chú ý.',
    readTime: '6 phút đọc',
    image: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=900&q=85',
    content: 'Hãy bắt đầu bằng squat không tạ để kiểm soát chuyển động. Giữ bàn chân ổn định, đầu gối đi theo hướng mũi chân và chỉ tăng độ khó khi bạn giữ được thân người chắc.'
    ,categoryEn: 'Technique', titleEn: 'Four checkpoints for a better squat', excerptEn: 'Foot position, knees, back and breathing are the details beginners should watch.', contentEn: 'Start with bodyweight squats to control the movement. Keep your feet stable, track your knees over your toes and increase difficulty only after you can stay controlled.'
  },
  {
    category: 'Thể trạng',
    title: 'Skinny fat nên ưu tiên giảm cân hay tăng cơ?',
    excerpt: 'Hiểu đúng mục tiêu giúp bạn tránh cắt kcal quá mạnh hoặc tập sai trọng tâm.',
    readTime: '5 phút đọc',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=85',
    content: 'Với thể trạng ít cơ nhưng có mỡ, hướng phù hợp thường là tập sức mạnh đều đặn, ăn đủ đạm và điều chỉnh năng lượng vừa phải. Đừng chỉ nhìn vào cân nặng, hãy theo dõi cả số đo và sức mạnh.'
    ,categoryEn: 'Body composition', titleEn: 'Should skinny fat focus on fat loss or muscle gain?', excerptEn: 'Understanding the goal helps you avoid cutting calories too hard or training without direction.', contentEn: 'With low muscle and higher body fat, a practical direction is consistent strength training, enough protein and a moderate energy adjustment. Track measurements and strength, not only body weight.'
  },
  {
    category: 'Thói quen',
    title: 'Uống nước trong ngày tập như thế nào?',
    excerpt: 'Một thói quen uống nước đều giúp cơ thể duy trì hiệu suất và cảm giác tỉnh táo.',
    readTime: '3 phút đọc',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=85',
    content: 'Thay vì đợi đến lúc khát mới uống, hãy chia lượng nước thành nhiều lần trong ngày. Ngày tập dài hoặc đổ nhiều mồ hôi có thể cần nhiều nước hơn ngày nghỉ.'
    ,categoryEn: 'Habits', titleEn: 'How should you drink water on training days?', excerptEn: 'A steady hydration habit can help your energy and training performance.', contentEn: 'Instead of waiting until you are thirsty, spread water across the day. Longer sessions or heavy sweating may require more than a rest day.'
  },
  {
    category: 'Kỹ thuật',
    title: 'Hít đất cho người mới: 3 cách giảm độ khó',
    excerpt: 'Bắt đầu đúng mức giúp bạn giữ form tốt và tiến bộ mà không bị quá tải vai, cổ tay.',
    readTime: '5 phút đọc',
    image: 'https://images.unsplash.com/photo-1598971639058-999f6c8f7f22?auto=format&fit=crop&w=900&q=85',
    content: 'Nếu hít đất cơ bản còn khó, hãy tập với tường, mặt bàn chắc chắn hoặc chống gối. Giữ thân người thành một đường thẳng, siết nhẹ bụng và hạ người có kiểm soát. Khi hoàn thành được 3 hiệp ổn định, bạn mới chuyển sang phiên bản khó hơn.',
    categoryEn: 'Technique',
    titleEn: 'Three push-up regressions for beginners',
    excerptEn: 'The right starting level helps you keep good form without overloading your shoulders or wrists.',
    contentEn: 'If a full push-up is too difficult, use a wall, a sturdy table or a knee variation. Keep your body in one line, brace your core and lower with control. Progress only after you can complete three steady sets.'
  },
  {
    category: 'Lịch tập',
    title: 'Cách chia buổi tập khi bạn chỉ có 2 ngày mỗi tuần',
    excerpt: 'Lịch 2 buổi vẫn có hiệu quả nếu mỗi buổi tập đủ nhóm cơ chính và có mục tiêu rõ ràng.',
    readTime: '5 phút đọc',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=85',
    content: 'Bạn có thể dùng hai buổi toàn thân, mỗi buổi gồm một bài chân, một bài đẩy, một bài kéo và một bài core. Giữ ít nhất một ngày nghỉ giữa hai buổi, sau đó tăng dần số lần hoặc mức tạ khi kỹ thuật đã ổn định.',
    categoryEn: 'Training plan',
    titleEn: 'How to train when you only have two days a week',
    excerptEn: 'Two sessions can still work when both sessions cover the major muscle groups with a clear goal.',
    contentEn: 'Use two full-body sessions with one leg, push, pull and core movement in each workout. Keep at least one rest day between sessions, then gradually add repetitions or load when technique is stable.'
  },
  {
    category: 'Dinh dưỡng',
    title: 'Tăng cơ có cần ăn thật nhiều không?',
    excerpt: 'Tăng nhẹ năng lượng và đủ đạm thường dễ duy trì hơn việc ăn quá mức trong thời gian ngắn.',
    readTime: '4 phút đọc',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85',
    content: 'Tăng cơ không đồng nghĩa với ăn không kiểm soát. Hãy ưu tiên đủ đạm, thêm một phần tinh bột hoặc chất béo tốt và theo dõi cân nặng theo tuần. Nếu cân tăng quá nhanh, hãy giảm phần ăn xuống một chút thay vì bỏ bữa.',
    categoryEn: 'Nutrition',
    titleEn: 'Do you need to eat a lot to build muscle?',
    excerptEn: 'A small energy increase and enough protein is usually easier to sustain than overeating for a short period.',
    contentEn: 'Muscle gain does not require uncontrolled eating. Prioritize enough protein, add a serving of carbohydrates or healthy fats and track weekly weight trends. If weight rises too quickly, reduce portions slightly instead of skipping meals.'
  },
  {
    category: 'Dinh dưỡng',
    title: 'Một đĩa ăn cân bằng cho người tập gồm gì?',
    excerpt: 'Công thức đơn giản để bạn tự chọn món Việt mà vẫn đủ đạm, rau và năng lượng.',
    readTime: '4 phút đọc',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85',
    content: 'Một bữa ăn có thể bắt đầu bằng một phần rau, một nguồn đạm như trứng, cá, thịt nạc hoặc đậu phụ, cùng phần tinh bột phù hợp với mục tiêu. Thêm nước lọc và điều chỉnh lượng dầu, sốt nếu bạn đang kiểm soát năng lượng.',
    categoryEn: 'Nutrition',
    titleEn: 'What makes a balanced plate for active people?',
    excerptEn: 'A simple formula helps you choose Vietnamese meals with enough protein, vegetables and energy.',
    contentEn: 'Start with vegetables, add protein such as eggs, fish, lean meat or tofu, then choose a carbohydrate portion that matches your goal. Use water and adjust oils or sauces when you are tracking energy.'
  },
  {
    category: 'Phục hồi',
    title: 'Đau mỏi sau tập: khi nào nên nghỉ?',
    excerpt: 'Phân biệt cảm giác mỏi cơ bình thường với dấu hiệu cần giảm tải và hỏi chuyên gia.',
    readTime: '5 phút đọc',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=85',
    content: 'Mỏi cơ nhẹ sau buổi tập thường giảm dần trong vài ngày. Nếu đau sắc, sưng, tê, mất sức hoặc đau tăng khi vận động, hãy dừng bài tập gây đau và tìm tư vấn y tế. Ngày phục hồi vẫn có thể đi bộ nhẹ hoặc giãn cơ không đau.',
    categoryEn: 'Recovery',
    titleEn: 'When should you rest after training soreness?',
    excerptEn: 'Learn the difference between normal muscle soreness and signs that call for reduced load or professional advice.',
    contentEn: 'Mild soreness often improves over a few days. Stop the painful movement and seek medical advice if pain is sharp, swollen, numb, weak or worsening with movement. A recovery day can still include pain-free walking or mobility.'
  },
  {
    category: 'Thói quen',
    title: '5 phút khởi động trước khi tập có tác dụng gì?',
    excerpt: 'Khởi động ngắn giúp cơ thể vào nhịp và chuẩn bị cho biên độ vận động của buổi tập.',
    readTime: '3 phút đọc',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=85',
    content: 'Hãy bắt đầu bằng đi bộ hoặc vận động nhẹ, sau đó làm vài động tác xoay khớp và một hiệp thử với mức nhẹ. Khởi động không cần làm bạn mệt; mục tiêu là làm nóng cơ thể và kiểm tra cảm giác ở các khớp.',
    categoryEn: 'Habits',
    titleEn: 'What can a five-minute warm-up do?',
    excerptEn: 'A short warm-up helps your body get ready for the range of motion in the session.',
    contentEn: 'Begin with light walking or movement, add a few joint motions and do a practice set with low effort. A warm-up should not exhaust you; it should raise temperature and help you check how your joints feel.'
  },
  {
    category: 'Thể trạng',
    title: 'Vì sao nên theo dõi số đo thay vì chỉ nhìn cân nặng?',
    excerpt: 'Cân nặng có thể thay đổi do nước, thức ăn và thời điểm đo; số đo giúp nhìn tiến độ rõ hơn.',
    readTime: '4 phút đọc',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=900&q=85',
    content: 'Hãy đo trong điều kiện tương tự mỗi tuần, ghi lại vòng eo, ảnh thể trạng và mức tạ hoặc số lần lặp. Khi các chỉ số được xem cùng nhau, bạn sẽ đánh giá tiến bộ công bằng hơn thay vì kết luận từ một lần cân.',
    categoryEn: 'Body composition',
    titleEn: 'Why track measurements instead of weight alone?',
    excerptEn: 'Weight changes with water, food and timing, while measurements can show progress more clearly.',
    contentEn: 'Measure under similar conditions each week and record waist size, progress photos and strength. Looking at several signals together gives you a fairer view than reacting to one weigh-in.'
  }
];

const sourceByCategory = {
  'Bắt đầu tập': {
    sourceName: 'WHO - Physical activity',
    sourceUrl: 'https://www.who.int/news-room/fact-sheets/detail/physical-activity'
  },
  Calisthenics: {
    sourceName: 'ACSM - Resistance Training for Health',
    sourceUrl: 'https://www.acsm.org/docs/default-source/files-for-resource-library/resistance-training-for-health.pdf'
  },
  'Dinh dưỡng': {
    sourceName: 'CDC - Healthy Eating Tips',
    sourceUrl: 'https://www.cdc.gov/nutrition/features/healthy-eating-tips.html'
  },
  'Phục hồi': {
    sourceName: 'NHLBI/NIH - How Much Sleep Is Enough?',
    sourceUrl: 'https://www.nhlbi.nih.gov/health/sleep/how-much-sleep'
  },
  'Lịch tập': {
    sourceName: 'WHO - Physical activity recommendations',
    sourceUrl: 'https://www.who.int/initiatives/behealthy/physical-activity'
  },
  'Kỹ thuật': {
    sourceName: 'ACSM - Resistance Training for Health',
    sourceUrl: 'https://www.acsm.org/docs/default-source/files-for-resource-library/resistance-training-for-health.pdf'
  },
  'Thể trạng': {
    sourceName: 'CDC - Healthy Eating for a Healthy Weight',
    sourceUrl: 'https://www.cdc.gov/healthy-weight-growth/healthy-eating/index.html'
  },
  'Thói quen': {
    sourceName: 'CDC - Water and Healthier Drinks',
    sourceUrl: 'https://www.cdc.gov/healthy-weight-growth/water-healthy-drinks/index.html'
  }
};

export default blogPosts.map((post) => ({
  ...post,
  ...sourceByCategory[post.category]
}));
