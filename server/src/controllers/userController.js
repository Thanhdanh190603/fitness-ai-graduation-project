import fs from 'fs';
import path from 'path';
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

export { updateProfile, getUsers };
