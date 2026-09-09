import bcrypt from 'bcryptjs';
import User from '../models/User.js';

function buildUserResponse(user) {
  const bodyImages = Array.isArray(user.bodyImages) ? user.bodyImages : [];
  const bodyImageItems = Array.isArray(user.bodyImageItems) ? user.bodyImageItems : [];
  const imageItems = bodyImageItems.length > 0
    ? bodyImageItems
    : bodyImages.map((imagePath) => ({ url: imagePath, type: 'unknown' }));
  const fallbackImageItems = imageItems.length > 0
    ? imageItems
    : user.bodyImage
      ? [{ url: user.bodyImage, type: 'unknown' }]
      : [];

  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    age: user.age,
    gender: user.gender,
    heightCm: user.heightCm,
    weightKg: user.weightKg,
    goal: user.goal,
    trainingLevel: user.trainingLevel,
    bodyImage: user.bodyImage,
    bodyImages: bodyImages.length > 0 ? bodyImages : user.bodyImage ? [user.bodyImage] : [],
    bodyImageItems: fallbackImageItems,
    accountType: user.role === 'admin'
      ? 'admin'
      : (user.membershipStatus || 'active') === 'active' ? 'member' : 'visitor',
    membershipStatus: user.membershipStatus === 'active' ? 'active' : 'inactive',
    membershipPlan: user.membershipPlan || 'member',
    membershipStartedAt: user.membershipStartedAt || null,
    membershipPaymentMethod: user.membershipPaymentMethod || '',
    membershipTransactionId: user.membershipTransactionId || ''
  };
}

async function register(req, res) {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Vui lòng nhập đủ thông tin' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Mật khẩu xác nhận không khớp' });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'Email đã được sử dụng' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      membershipStatus: 'inactive',
      membershipPlan: 'member'
    });

    req.session.userId = user._id;

    res.status(201).json({
      message: 'Đăng ký thành công',
      user: buildUserResponse(user)
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi đăng ký tài khoản' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    req.session.userId = user._id;

    res.json({
      message: 'Đăng nhập thành công',
      user: buildUserResponse(user)
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi đăng nhập' });
  }
}

async function getMe(req, res) {
  res.json(buildUserResponse(req.user));
}

async function activateMember(req, res) {
  const paymentMethods = ['momo', 'vnpay', 'bank_transfer', 'card'];
  const paymentMethod = String(req.body.paymentMethod || '');

  if (!paymentMethods.includes(paymentMethod)) {
    return res.status(400).json({ message: 'Vui lòng chọn phương thức thanh toán.' });
  }

  req.user.membershipStatus = 'active';
  req.user.membershipPlan = 'member';
  req.user.membershipStartedAt = new Date();
  req.user.membershipPaymentMethod = paymentMethod;
  req.user.membershipTransactionId = `FA-${Date.now()}`;
  await req.user.save();

  res.json({
    message: 'Đăng ký Member thành công',
    user: buildUserResponse(req.user)
  });
}

function logout(req, res) {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ message: 'Đăng xuất thành công' });
  });
}

export { register, login, logout, getMe, activateMember };
