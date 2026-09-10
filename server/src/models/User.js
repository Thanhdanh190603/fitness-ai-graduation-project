import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true
    },
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
    phone: {
      type: String,
      default: '',
      trim: true
    },
    dateOfBirth: {
      type: Date,
      default: null
    },
    avatar: {
      type: String,
      default: ''
    },
    password: {
      type: String,
      required: true
    },
    passwordResetCodeHash: {
      type: String,
      default: ''
    },
    passwordResetExpiresAt: {
      type: Date,
      default: null
    },
    passwordResetVerifiedAt: {
      type: Date,
      default: null
    },
    mustChangePassword: {
      type: Boolean,
      default: false
    },
    temporaryPasswordExpiresAt: {
      type: Date,
      default: null
    },
    passwordResetBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
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
