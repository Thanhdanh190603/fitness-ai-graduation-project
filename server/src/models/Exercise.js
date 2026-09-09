import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      enum: ['gym', 'calisthenics', 'yoga', 'stretching', 'kegel'],
      required: true
    },
    muscleGroup: {
      type: String,
      required: true
    },
    level: {
      type: String,
      enum: ['beginner', 'medium', 'advanced'],
      default: 'beginner'
    },
    videoUrl: {
      type: String,
      required: true
    },
    sourceName: {
      type: String,
      default: ''
    },
    sourceUrl: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    sets: {
      type: Number,
      default: 3
    },
    reps: {
      type: String,
      default: '10-12'
    },
    restSeconds: {
      type: Number,
      default: 60
    },
    needWatchAd: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Exercise = mongoose.model('Exercise', exerciseSchema);

export default Exercise;
