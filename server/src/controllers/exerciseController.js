import Exercise from '../models/Exercise.js';

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

    const exercises = await Exercise.find(filter).sort({ createdAt: -1 });
    res.json(exercises.map(formatExercise));
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
    const exercise = await Exercise.create(req.body);
    res.status(201).json(exercise);
  } catch (error) {
    res.status(400).json({ message: 'Lỗi thêm bài tập' });
  }
}

async function updateExercise(req, res) {
  try {
    const exercise = await Exercise.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!exercise) {
      return res.status(404).json({ message: 'Không tìm thấy bài tập' });
    }

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
