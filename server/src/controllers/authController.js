import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import User from '../models/User.js';

function createMailTransporter() {
  const user = String(process.env.MAIL_USER || '').trim();
  const password = String(process.env.MAIL_PASSWORD || '').trim();

  if (!user || !password) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.MAIL_PORT || 587),
    secure: String(process.env.MAIL_SECURE || 'false') === 'true',
    auth: { user, pass: password }
  });
}

function hashResetCode(code) {
  return crypto
    .createHash('sha256')
    .update(`${code}:${process.env.SESSION_SECRET || 'fitness-ai'}`)
    .digest('hex');
}

function isResetCodeValid(user, code) {
  return Boolean(
    user &&
    user.passwordResetCodeHash &&
    user.passwordResetExpiresAt &&
    user.passwordResetExpiresAt.getTime() > Date.now() &&
    user.passwordResetCodeHash === hashResetCode(code)
  );
}

async function sendResetCodeEmail(email, code) {
  const transporter = createMailTransporter();

  if (!transporter) {
    return false;
  }

  await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.MAIL_USER,
    to: email,
    subject: 'Mã xác minh đặt lại mật khẩu Fitness AI',
    text: `Mã xác minh của bạn là ${code}. Mã có hiệu lực trong 10 phút.`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#17202a;max-width:520px">
        <h2 style="color:#147d70">Fitness AI</h2>
        <p>Bạn vừa yêu cầu đặt lại mật khẩu.</p>
        <p style="font-size:30px;font-weight:700;letter-spacing:8px;color:#147d70">${code}</p>
        <p>Mã có hiệu lực trong 10 phút. Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email.</p>
      </div>
    `
  });

  return true;
}

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
    username: user.username || '',
    fullName: user.fullName,
    email: user.email,
    phone: user.phone || '',
    dateOfBirth: user.dateOfBirth || null,
    avatar: user.avatar || '',
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
    membershipTransactionId: user.membershipTransactionId || '',
    mustChangePassword: Boolean(user.mustChangePassword),
    temporaryPasswordExpiresAt: user.temporaryPasswordExpiresAt || null
  };
}

async function register(req, res) {
  try {
    const { fullName, username, email, phone, dateOfBirth, password, confirmPassword } = req.body;
    const usernameValue = String(username || '').trim().toLowerCase();
    const fullNameValue = String(fullName || '').trim();
    const emailValue = String(email || '').trim().toLowerCase();
    const phoneValue = String(phone || '').trim();

    if (!fullNameValue || !usernameValue || !emailValue || !phoneValue || !dateOfBirth || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Vui lòng nhập đủ thông tin đăng ký' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Mật khẩu xác nhận không khớp' });
    }

    const phoneDigits = phoneValue.replace(/\D/g, '');
    if (phoneDigits.length < 8) {
      return res.status(400).json({ message: 'Số điện thoại chưa đúng định dạng' });
    }

    const birthDate = new Date(dateOfBirth);
    if (Number.isNaN(birthDate.getTime()) || birthDate > new Date()) {
      return res.status(400).json({ message: 'Ngày sinh chưa đúng định dạng' });
    }

    const existingUser = await User.findOne({
      $or: [{ email: emailValue }, { username: usernameValue }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: existingUser.username === usernameValue
          ? 'Tên đăng nhập đã được sử dụng'
          : 'Email đã được sử dụng'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username: usernameValue,
      fullName: fullNameValue,
      email: emailValue,
      phone: phoneValue,
      dateOfBirth: birthDate,
      avatar: req.file ? `/uploads/${req.file.filename}` : '',
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
    const { email, username, password } = req.body;
    const loginValue = String(email || username || '').trim().toLowerCase();

    if (!loginValue || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập email hoặc tên đăng nhập và mật khẩu' });
    }

    const user = await User.findOne({
      $or: [{ email: loginValue }, { username: loginValue }]
    });

    if (!user) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    if (
      user.mustChangePassword &&
      user.temporaryPasswordExpiresAt &&
      user.temporaryPasswordExpiresAt.getTime() <= Date.now()
    ) {
      return res.status(400).json({ message: 'Mật khẩu tạm thời đã hết hạn. Vui lòng liên hệ admin.' });
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

async function forgotPassword(req, res) {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ message: 'Vui lòng nhập email đã đăng ký' });
    }

    if (!createMailTransporter()) {
      return res.status(503).json({
        message: 'Hệ thống chưa cấu hình email gửi mã. Hãy thêm MAIL_USER và MAIL_PASSWORD vào server/.env.'
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Email chưa được đăng ký' });
    }

    const code = String(crypto.randomInt(100000, 1000000));
    user.passwordResetCodeHash = hashResetCode(code);
    user.passwordResetExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    user.passwordResetVerifiedAt = null;
    await user.save();

    await sendResetCodeEmail(user.email, code);

    res.json({ message: 'Mã xác minh đã được gửi tới email của bạn' });
  } catch (error) {
    res.status(500).json({ message: 'Không thể gửi mã xác minh lúc này' });
  }
}

async function verifyResetCode(req, res) {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const code = String(req.body.code || '').trim();
    const user = await User.findOne({ email });

    if (!isResetCodeValid(user, code)) {
      return res.status(400).json({ message: 'Mã xác minh không đúng hoặc đã hết hạn' });
    }

    user.passwordResetVerifiedAt = new Date();
    await user.save();
    res.json({ message: 'Xác minh thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Không thể xác minh mã lúc này' });
  }
}

async function resetPassword(req, res) {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const code = String(req.body.code || '').trim();
    const newPassword = String(req.body.newPassword || '');
    const confirmPassword = String(req.body.confirmPassword || '');
    const user = await User.findOne({ email });

    if (!isResetCodeValid(user, code) || !user.passwordResetVerifiedAt) {
      return res.status(400).json({ message: 'Mã xác minh không đúng hoặc đã hết hạn' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Mật khẩu xác nhận không khớp' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordResetCodeHash = '';
    user.passwordResetExpiresAt = null;
    user.passwordResetVerifiedAt = null;
    user.mustChangePassword = false;
    user.temporaryPasswordExpiresAt = null;
    user.passwordResetBy = null;
    await user.save();

    res.json({ message: 'Đổi mật khẩu thành công. Bạn có thể đăng nhập ngay.' });
  } catch (error) {
    res.status(500).json({ message: 'Không thể đổi mật khẩu lúc này' });
  }
}

async function changePassword(req, res) {
  try {
    const currentPassword = String(req.body.currentPassword || '');
    const newPassword = String(req.body.newPassword || '');
    const confirmPassword = String(req.body.confirmPassword || '');
    const account = await User.findById(req.user._id);

    if (!account) {
      return res.status(404).json({ message: 'Tài khoản không tồn tại' });
    }

    if (!account.mustChangePassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Vui lòng nhập mật khẩu hiện tại' });
      }

      const isCurrentPasswordCorrect = await bcrypt.compare(currentPassword, account.password);

      if (!isCurrentPasswordCorrect) {
        return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng' });
      }
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Mật khẩu xác nhận không khớp' });
    }

    account.password = await bcrypt.hash(newPassword, 10);
    account.mustChangePassword = false;
    account.temporaryPasswordExpiresAt = null;
    account.passwordResetBy = null;
    await account.save();

    res.json({
      message: 'Đổi mật khẩu thành công',
      user: buildUserResponse(account)
    });
  } catch (error) {
    res.status(500).json({ message: 'Không thể đổi mật khẩu lúc này' });
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

export {
  register,
  login,
  logout,
  getMe,
  activateMember,
  forgotPassword,
  verifyResetCode,
  resetPassword,
  changePassword
};
