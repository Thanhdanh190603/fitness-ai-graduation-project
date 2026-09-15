import Exercise from '../models/Exercise.js';

function isPublicVideoUrl(videoUrl) {
  const value = String(videoUrl || '').trim().toLowerCase();
  return /^https:\/\/(www\.)?(youtube\.com\/embed\/|youtube-nocookie\.com\/embed\/|vimeo\.com\/)/.test(value)
    && !value.includes('private')
    && !value.includes('/shorts/');
}

function getYouTubeVideoId(value) {
  try {
    const url = new URL(String(value || '').trim());

    if (url.hostname === 'youtu.be') {
      return url.pathname.slice(1).split('/')[0];
    }

    if (url.hostname.includes('youtube.com')) {
      if (url.pathname === '/watch') {
        return url.searchParams.get('v');
      }

      if (url.pathname.startsWith('/embed/')) {
        return url.pathname.split('/')[2];
      }
    }
  } catch (error) {
    return null;
  }

  return null;
}

function normalizeVideoLinks(input, oldExercise = {}) {
  const videoUrl = String(input.videoUrl || oldExercise.videoUrl || '').trim();
  const sourceUrl = String(input.sourceUrl || oldExercise.sourceUrl || '').trim();
  let embedUrl = videoUrl;

  if (!embedUrl && sourceUrl) {
    const videoId = getYouTubeVideoId(sourceUrl);

    if (videoId) {
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
  }

  return {
    ...input,
    videoUrl: embedUrl,
    sourceUrl
  };
}

function formatExercise(exercise) {
  const data = exercise.toObject ? exercise.toObject() : exercise;

  if (data.muscleGroup === 'Ngực, vai, tay sau') {
    data.muscleGroup = 'Ngực, vai và tay sau';
  }

  return data;
}

async function getExercises(req, res) {
  try {
    const { category, level } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (level) {
      filter.level = level;
    }

    const exercises = await Exercise.find(filter).sort({ createdAt: 1 });
    res.json(exercises.filter((exercise) => isPublicVideoUrl(exercise.videoUrl)).map(formatExercise));
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy danh sách bài tập' });
  }
}

async function getExerciseById(req, res) {
  try {
    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      return res.status(404).json({ message: 'Không tìm thấy bài tập' });
    }

    res.json(formatExercise(exercise));
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy chi tiết bài tập' });
  }
}

async function createExercise(req, res) {
  try {
    const exerciseData = normalizeVideoLinks(req.body);

    if (!isPublicVideoUrl(exerciseData.videoUrl)) {
      return res.status(400).json({ message: 'Hãy nhập link nhúng hoặc link nguồn YouTube/Vimeo công khai.' });
    }

    const exercise = await Exercise.create(exerciseData);
    res.status(201).json(exercise);
  } catch (error) {
    res.status(400).json({ message: 'Lỗi thêm bài tập' });
  }
}

async function updateExercise(req, res) {
  try {
    const currentExercise = await Exercise.findById(req.params.id);

    if (!currentExercise) {
      return res.status(404).json({ message: 'Không tìm thấy bài tập' });
    }

    const exerciseData = normalizeVideoLinks(req.body, currentExercise);

    if (!isPublicVideoUrl(exerciseData.videoUrl)) {
      return res.status(400).json({ message: 'Hãy nhập link nhúng hoặc link nguồn YouTube/Vimeo công khai.' });
    }

    const exercise = await Exercise.findByIdAndUpdate(
      req.params.id,
      exerciseData,
      { new: true, runValidators: true }
    );

    res.json(exercise);
  } catch (error) {
    res.status(400).json({ message: 'Lỗi cập nhật bài tập' });
  }
}

async function deleteExercise(req, res) {
  try {
    const exercise = await Exercise.findByIdAndDelete(req.params.id);

    if (!exercise) {
      return res.status(404).json({ message: 'Không tìm thấy bài tập' });
    }

    res.json({ message: 'Đã xóa bài tập' });
  } catch (error) {
    res.status(400).json({ message: 'Lỗi xóa bài tập' });
  }
}

export {
  getExercises,
  getExerciseById,
  createExercise,
  updateExercise,
  deleteExercise
};
