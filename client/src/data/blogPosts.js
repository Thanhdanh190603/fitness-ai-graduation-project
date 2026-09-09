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
