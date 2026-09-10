import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Exercise from './models/Exercise.js';

dotenv.config();

const exercises = [
  {
    name: 'Hít đất cơ bản',
    category: 'calisthenics',
    muscleGroup: 'Ngực, vai và tay sau',
    level: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/IODxDxX7oi4',
    sourceName: 'YouTube public video',
    sourceUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
    description: 'Bài tập thân trên cơ bản, phù hợp cho người mới bắt đầu.',
    sets: 3,
    reps: '8-12 lần',
    restSeconds: 60,
    needWatchAd: false
  },
  {
    name: 'Squat không tạ',
    category: 'gym',
    muscleGroup: 'Chân và mông',
    level: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/aclHkVaku9U',
    sourceName: 'YouTube public video',
    sourceUrl: 'https://www.youtube.com/watch?v=aclHkVaku9U',
    description: 'Bài tập chân cơ bản giúp làm quen kỹ thuật squat.',
    sets: 3,
    reps: '12-15 lần',
    restSeconds: 60,
    needWatchAd: false
  },
  {
    name: 'Plank',
    category: 'calisthenics',
    muscleGroup: 'Cardio và core',
    level: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/pSHjTRCQxIw',
    sourceName: 'YouTube public video',
    sourceUrl: 'https://www.youtube.com/watch?v=pSHjTRCQxIw',
    description: 'Giữ thân người thẳng để cải thiện sức mạnh vùng core.',
    sets: 3,
    reps: '30-45 giây',
    restSeconds: 45,
    needWatchAd: false
  },
  {
    name: 'Giãn cơ toàn thân',
    category: 'stretching',
    muscleGroup: 'Phục hồi và giãn cơ',
    level: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/g_tea8ZNk5A',
    sourceName: 'YouTube public video',
    sourceUrl: 'https://www.youtube.com/watch?v=g_tea8ZNk5A',
    description: 'Nội dung phụ dùng sau buổi tập để phục hồi và thư giãn.',
    sets: 1,
    reps: '8-10 phút',
    restSeconds: 0,
    needWatchAd: true
  },
  {
    name: 'Yoga thư giãn',
    category: 'yoga',
    muscleGroup: 'Phục hồi và giãn cơ',
    level: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/v7AYKMP6rOE',
    sourceName: 'YouTube public video',
    sourceUrl: 'https://www.youtube.com/watch?v=v7AYKMP6rOE',
    description: 'Bài tập phụ giúp giảm căng cơ và hỗ trợ phục hồi.',
    sets: 1,
    reps: '10 phút',
    restSeconds: 0,
    needWatchAd: true
  },
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

async function seedData() {
  await connectDB();

  await User.deleteMany({});
  await Exercise.deleteMany({});

  const password = await bcrypt.hash('123456', 10);

  await User.create([
    {
      fullName: 'Nguyen Van User',
      email: 'user@gmail.com',
      password,
      role: 'user',
      heightCm: 170,
      weightKg: 68,
      goal: 'Giảm mỡ',
      trainingLevel: 'beginner'
    },
    {
      fullName: 'Admin Fitness',
      email: 'admin@gmail.com',
      password,
      role: 'admin'
    }
  ]);

  await Exercise.insertMany(exercises);

  console.log('Seed data completed');
  process.exit();
}

seedData();
