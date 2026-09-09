import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    age: {
      type: Number,
      default: null
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', ''],
      default: ''
    },
    heightCm: {
      type: Number,
      default: null
    },
    weightKg: {
      type: Number,
      default: null
    },
    goal: {
      type: String,
      default: ''
    },
    trainingLevel: {
      type: String,
      enum: ['beginner', 'medium', 'advanced', ''],
      default: 'beginner'
    },
    bodyImage: {
      type: String,
      default: ''
    },
    bodyImages: {
      type: [String],
      default: []
    },
    bodyImageItems: {
      type: [
        {
          url: {
            type: String,
            required: true
          },
          type: {
            type: String,
            enum: ['front', 'side', 'back', 'other', 'unknown'],
            default: 'unknown'
          }
        }
      ],
      default: []
    },
    aiTrialStart: {
      type: Date,
      default: Date.now
    },
    hasAiPremium: {
      type: Boolean,
      default: false
    },
    aiPlan: {
      type: String,
      enum: ['free', 'plus', 'pro'],
      default: 'free'
    },
    hasNoAds: {
      type: Boolean,
      default: false
    },
    membershipStatus: {
      type: String,
      enum: ['inactive', 'active', 'cancelled'],
      default: 'active'
    },
    membershipPlan: {
      type: String,
      enum: ['member'],
      default: 'member'
    },
    membershipStartedAt: {
      type: Date,
      default: null
    },
    membershipPaymentMethod: {
      type: String,
      enum: ['momo', 'vnpay', 'bank_transfer', 'card', ''],
      default: ''
    },
    membershipTransactionId: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);

export default User;
