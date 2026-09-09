import User from '../models/User.js';

async function protect(req, res, next) {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Chưa đăng nhập' });
    }

    const user = await User.findById(req.session.userId).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Tài khoản không tồn tại' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Phiên đăng nhập không hợp lệ' });
  }
}

function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Chỉ admin mới được truy cập' });
  }

  next();
}

export { protect, adminOnly };
