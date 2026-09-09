import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Exercise from './models/Exercise.js';

dotenv.config();

const newExercises = [
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

  for (const exercise of newExercises) {
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
