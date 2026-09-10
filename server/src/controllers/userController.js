import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/User.js';

function deleteBodyImage(imagePath) {
  if (!imagePath) {
    return;
  }

  const fileName = path.basename(imagePath);
  const fullPath = path.join(process.cwd(), 'uploads', fileName);

  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
}

function parseRemovedImages(value) {
  try {
    return JSON.parse(value || '[]');
  } catch (error) {
    return [];
  }
}

function parseImageTypes(value) {
  try {
    return JSON.parse(value || '[]');
  } catch (error) {
    return [];
  }
}

function getImageUrl(imageItem) {
  return typeof imageItem === 'string' ? imageItem : imageItem.url;
}

async function updateProfile(req, res) {
  try {
    const {
      fullName,
      age,
      gender,
      heightCm,
      weightKg,
      goal,
      trainingLevel
    } = req.body;
    const removedImages = parseRemovedImages(req.body.removeBodyImages);
    const bodyImageType = req.body.bodyImageType || 'unknown';
    const bodyImageTypes = parseImageTypes(req.body.bodyImageTypes);

    req.user.age = age;
    if (fullName && fullName.trim()) {
      req.user.fullName = fullName.trim();
    }
    req.user.gender = gender;
    req.user.heightCm = heightCm;
    req.user.weightKg = weightKg;
    req.user.goal = goal;
    req.user.trainingLevel = trainingLevel;

    let currentImageItems = Array.isArray(req.user.bodyImageItems)
      ? [...req.user.bodyImageItems]
      : [];

    if (req.user.bodyImage && !currentImageItems.some((item) => getImageUrl(item) === req.user.bodyImage)) {
      currentImageItems.push({
        url: req.user.bodyImage,
        type: 'unknown'
      });
      req.user.bodyImage = '';
    }

    if (Array.isArray(req.user.bodyImages)) {
      req.user.bodyImages.forEach((imagePath) => {
        const exists = currentImageItems.some((item) => getImageUrl(item) === imagePath);

        if (!exists) {
          currentImageItems.push({
            url: imagePath,
            type: 'unknown'
          });
        }
      });
    }

    removedImages.forEach((imagePath) => {
      deleteBodyImage(imagePath);
    });

    currentImageItems = currentImageItems.filter((imageItem) => {
      return !removedImages.includes(getImageUrl(imageItem));
    });

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file, index) => ({
        url: `/uploads/${file.filename}`,
        type: bodyImageTypes[index] || bodyImageType
      }));
      currentImageItems = [...currentImageItems, ...newImages];
    }

    req.user.bodyImageItems = currentImageItems;
    req.user.bodyImages = currentImageItems.map((imageItem) => imageItem.url);

    await req.user.save();

    const user = req.user.toObject();
    delete user.password;

    res.json({
      message: 'Cập nhật hồ sơ thành công',
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi cập nhật hồ sơ' });
  }
}

async function getUsers(req, res) {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy danh sách người dùng' });
  }
}

async function resetMemberPassword(req, res) {
  try {
    const member = await User.findById(req.params.userId);

    if (!member || member.role === 'admin') {
      return res.status(404).json({ message: 'Không tìm thấy tài khoản Member' });
    }

    if (member.membershipStatus !== 'active') {
      return res.status(400).json({ message: 'Chỉ có thể cấp lại mật khẩu cho Member đang hoạt động' });
    }

    const temporaryPassword = `FA-${crypto.randomBytes(5).toString('hex').toUpperCase()}`;
    member.password = await bcrypt.hash(temporaryPassword, 10);
    member.mustChangePassword = true;
    member.temporaryPasswordExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    member.passwordResetBy = req.user._id;
    await member.save();

    res.json({
      message: 'Đã cấp mật khẩu tạm thời cho Member',
      temporaryPassword,
      expiresAt: member.temporaryPasswordExpiresAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Không thể cấp lại mật khẩu lúc này' });
  }
}

async function deleteUser(req, res) {
  try {
    const targetUser = await User.findById(req.params.userId);

    if (!targetUser) {
      return res.status(404).json({ message: 'Không tìm thấy tài khoản cần xóa' });
    }

    if (targetUser.role === 'admin') {
      return res.status(403).json({ message: 'Không thể xóa tài khoản admin' });
    }

    if (targetUser.avatar) {
      deleteBodyImage(targetUser.avatar);
    }

    const imagePaths = [
      ...(Array.isArray(targetUser.bodyImages) ? targetUser.bodyImages : []),
      ...(Array.isArray(targetUser.bodyImageItems)
        ? targetUser.bodyImageItems.map((imageItem) => getImageUrl(imageItem))
        : []),
      targetUser.bodyImage
    ].filter(Boolean);

    [...new Set(imagePaths)].forEach((imagePath) => deleteBodyImage(imagePath));
    await targetUser.deleteOne();

    res.json({ message: 'Đã xóa tài khoản user' });
  } catch (error) {
    res.status(500).json({ message: 'Không thể xóa tài khoản lúc này' });
  }
}

async function updateAvatar(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Vui lòng chọn ảnh avatar.' });
    }

    const previousAvatar = req.user.avatar;
    req.user.avatar = `/uploads/${req.file.filename}`;
    await req.user.save();

    if (previousAvatar) {
      deleteBodyImage(previousAvatar);
    }

    const user = req.user.toObject();
    delete user.password;

    res.json({
      message: 'Cập nhật avatar thành công',
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi cập nhật avatar' });
  }
}

export { updateProfile, updateAvatar, getUsers, resetMemberPassword, deleteUser };
