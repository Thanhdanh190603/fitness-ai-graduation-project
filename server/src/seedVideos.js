import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Exercise from './models/Exercise.js';

dotenv.config();

const newExercises = [
  {
    name: 'Shoulder press với tạ',
    category: 'gym',
    muscleGroup: 'Ngực, vai và tay sau',
    level: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/qEwKCR5JCog',
    sourceName: 'YouTube public video',
    sourceUrl: 'https://www.youtube.com/watch?v=qEwKCR5JCog',
    description: 'Bài đẩy vai giúp phát triển vai trước và vai giữa, giữ lưng ổn định.',
    sets: 3,
    reps: '8-12 lần',
    restSeconds: 75,
    needWatchAd: false
  },
  {
    name: 'Dumbbell row',
    category: 'gym',
    muscleGroup: 'Lưng và tay trước',
    level: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/roCP6wCXPqo',
    sourceName: 'YouTube public video',
    sourceUrl: 'https://www.youtube.com/watch?v=roCP6wCXPqo',
    description: 'Bài kéo một tay giúp rèn lưng và cải thiện khả năng kiểm soát bả vai.',
    sets: 3,
    reps: '10-12 lần mỗi bên',
    restSeconds: 75,
    needWatchAd: false
  },
  {
    name: 'Bicep curl',
    category: 'gym',
    muscleGroup: 'Lưng và tay trước',
    level: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/ykJmrZ5v0Oo',
    sourceName: 'YouTube public video',
    sourceUrl: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo',
    description: 'Bài cuốn tạ cơ bản cho cơ tay trước, ưu tiên nhịp chuyển động chậm.',
    sets: 3,
    reps: '10-15 lần',
    restSeconds: 60,
    needWatchAd: false
  },
  {
    name: 'Lateral raise',
    category: 'gym',
    muscleGroup: 'Ngực, vai và tay sau',
    level: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/3VcKaXpzqRo',
    sourceName: 'YouTube public video',
    sourceUrl: 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
    description: 'Bài nâng tạ ngang giúp bổ trợ vai giữa với mức tạ vừa phải.',
    sets: 3,
    reps: '12-15 lần',
    restSeconds: 60,
    needWatchAd: false
  },
  {
    name: 'Walking lunge',
    category: 'gym',
    muscleGroup: 'Chân và mông',
    level: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/QOVaHwm-Q6U',
    sourceName: 'YouTube public video',
    sourceUrl: 'https://www.youtube.com/watch?v=QOVaHwm-Q6U',
    description: 'Bài bước chùng giúp rèn chân, mông và khả năng giữ thăng bằng.',
    sets: 3,
    reps: '10 lần mỗi bên',
    restSeconds: 60,
    needWatchAd: false
  },
  {
    name: 'Calf raise',
    category: 'gym',
    muscleGroup: 'Chân và mông',
    level: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/-M4-G8p8fmc',
    sourceName: 'YouTube public video',
    sourceUrl: 'https://www.youtube.com/watch?v=-M4-G8p8fmc',
    description: 'Bài nhón gót đơn giản để bổ trợ sức mạnh bắp chân.',
    sets: 3,
    reps: '15-20 lần',
    restSeconds: 45,
    needWatchAd: false
  },
  {
    name: 'Side plank',
    category: 'calisthenics',
    muscleGroup: 'Cardio và core',
    level: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/K2VljzCC16g',
    sourceName: 'YouTube public video',
    sourceUrl: 'https://www.youtube.com/watch?v=K2VljzCC16g',
    description: 'Bài giữ người nghiêng giúp rèn cơ liên sườn và khả năng ổn định thân.',
    sets: 3,
    reps: '20-30 giây mỗi bên',
    restSeconds: 45,
    needWatchAd: false
  },
  {
    name: 'Dead bug',
    category: 'calisthenics',
    muscleGroup: 'Cardio và core',
    level: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/4XLEnwUr1d8',
    sourceName: 'YouTube public video',
    sourceUrl: 'https://www.youtube.com/watch?v=4XLEnwUr1d8',
    description: 'Bài core kiểm soát giúp giữ lưng ổn định và phối hợp tay chân.',
    sets: 3,
    reps: '10 lần mỗi bên',
    restSeconds: 45,
    needWatchAd: false
  },
  {
    name: 'Jumping jack',
    category: 'calisthenics',
    muscleGroup: 'Toàn thân',
    level: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/c4DAnQ6DtF8',
    sourceName: 'YouTube public video',
    sourceUrl: 'https://www.youtube.com/watch?v=c4DAnQ6DtF8',
    description: 'Bài khởi động toàn thân giúp làm nóng cơ thể và tăng nhịp tim.',
    sets: 3,
    reps: '30-45 giây',
    restSeconds: 30,
    needWatchAd: false
  },
  {
    name: 'Child pose',
    category: 'yoga',
    muscleGroup: 'Phục hồi và giãn cơ',
    level: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/2MJGg-dUKh0',
    sourceName: 'YouTube public video',
    sourceUrl: 'https://www.youtube.com/watch?v=2MJGg-dUKh0',
    description: 'Tư thế nghỉ giúp thư giãn lưng, hông và hỗ trợ hồi phục sau buổi tập.',
    sets: 1,
    reps: '2-3 phút',
    restSeconds: 0,
    needWatchAd: true
  },
  {
    name: 'Hip flexor stretch',
    category: 'stretching',
    muscleGroup: 'Phục hồi và giãn cơ',
    level: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/YQmpO9VT2X4',
    sourceName: 'YouTube public video',
    sourceUrl: 'https://www.youtube.com/watch?v=YQmpO9VT2X4',
    description: 'Động tác giãn cơ gập hông phù hợp sau ngày tập chân hoặc ngồi lâu.',
    sets: 1,
    reps: '30-45 giây mỗi bên',
    restSeconds: 0,
    needWatchAd: true
  }
];

const updatedExercises = [
  {
    name: 'Pike push-up',
    category: 'calisthenics',
    muscleGroup: 'Ngực, vai và tay sau',
    level: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/Uffy7G8LLXg',
    sourceName: 'YouTube public video',
    sourceUrl: 'https://www.youtube.com/watch?v=Uffy7G8LLXg',
    description: 'Biến thể hít đất giúp tập trung nhiều hơn vào vai.',
    sets: 3,
    reps: '8-12 lần',
    restSeconds: 60,
    needWatchAd: false
  },
  {
    name: 'Bench dip',
    category: 'calisthenics',
    muscleGroup: 'Ngực, vai và tay sau',
    level: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/0326dy_-CzM',
    sourceName: 'YouTube public video',
    sourceUrl: 'https://www.youtube.com/watch?v=0326dy_-CzM',
    description: 'Bài tập tay sau với ghế hoặc mặt phẳng chắc chắn.',
    sets: 3,
    reps: '8-12 lần',
    restSeconds: 60,
    needWatchAd: false
  },
  {
    name: 'Romanian deadlift',
    category: 'gym',
    muscleGroup: 'Chân và mông',
    level: 'medium',
    videoUrl: 'https://www.youtube.com/embed/JCXUYuzwNrM',
    sourceName: 'YouTube public video',
    sourceUrl: 'https://www.youtube.com/watch?v=JCXUYuzwNrM',
    description: 'Bài tập cho đùi sau và mông, cần giữ lưng ổn định.',
    sets: 3,
    reps: '8-10 lần',
    restSeconds: 90,
    needWatchAd: false
  },
  {
    name: 'Kéo xà cơ bản',
    category: 'calisthenics',
    muscleGroup: 'Lưng và tay trước',
    level: 'medium',
    videoUrl: 'https://www.youtube.com/embed/eGo4IYlbE5g',
    sourceName: 'YouTube public video',
    sourceUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g',
    description: 'Bài tập kéo thân người để phát triển lưng và tay trước.',
    sets: 3,
    reps: '5-8 lần',
    restSeconds: 90,
    needWatchAd: false
  },
  {
    name: 'Mountain climber',
    category: 'calisthenics',
    muscleGroup: 'Cardio và core',
    level: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/nmwgirgXLYM',
    sourceName: 'YouTube public video',
    sourceUrl: 'https://www.youtube.com/watch?v=nmwgirgXLYM',
    description: 'Bài tập toàn thân giúp tăng nhịp tim và giữ core ổn định.',
    sets: 3,
    reps: '30 giây',
    restSeconds: 45,
    needWatchAd: false
  },
  {
    name: 'Glute bridge',
    category: 'calisthenics',
    muscleGroup: 'Chân và mông',
    level: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/JPP6-rs3MvE',
    sourceName: 'YouTube public video',
    sourceUrl: 'https://www.youtube.com/watch?v=JPP6-rs3MvE',
    description: 'Bài tập bổ trợ mông và đùi sau, phù hợp sau buổi chân chính.',
    sets: 3,
    reps: '12-15 lần',
    restSeconds: 60,
    needWatchAd: false
  },
  {
    name: 'Reverse lunge',
    category: 'calisthenics',
    muscleGroup: 'Chân và mông',
    level: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/HXs8u1251ss',
    sourceName: 'YouTube public video',
    sourceUrl: 'https://www.youtube.com/watch?v=HXs8u1251ss',
    description: 'Bài tập một chân giúp rèn thăng bằng và sức mạnh mông đùi.',
    sets: 3,
    reps: '10 lần mỗi bên',
    restSeconds: 60,
    needWatchAd: false
  },
  {
    name: 'Burpee cơ bản',
    category: 'calisthenics',
    muscleGroup: 'Toàn thân',
    level: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/TU8QYVW0gDU',
    sourceName: 'YouTube public video',
    sourceUrl: 'https://www.youtube.com/watch?v=TU8QYVW0gDU',
    description: 'Bài tập toàn thân phù hợp cho ngày rèn sức bền cơ bản.',
    sets: 3,
    reps: '8-10 lần',
    restSeconds: 60,
    needWatchAd: false
  }
];

async function seedVideos() {
  await connectDB();

  await Exercise.updateOne({ name: 'Squat không tạ' }, { muscleGroup: 'Chân và mông' });
  await Exercise.updateOne({ name: 'Plank' }, { muscleGroup: 'Cardio và core' });
  await Exercise.updateOne({ name: 'Giãn cơ toàn thân' }, { muscleGroup: 'Phục hồi và giãn cơ' });
  await Exercise.updateOne({ name: 'Yoga thư giãn' }, { muscleGroup: 'Phục hồi và giãn cơ' });

  for (const exercise of [...newExercises, ...updatedExercises]) {
    await Exercise.findOneAndUpdate(
      { name: exercise.name },
      exercise,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  console.log('Đã thêm hoặc cập nhật video bài tập mới.');
  process.exit();
}

seedVideos();
