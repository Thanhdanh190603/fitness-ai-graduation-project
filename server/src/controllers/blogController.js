import BlogPost from '../models/BlogPost.js';

function serializePost(post) {
  const item = post.toObject ? post.toObject() : post;
  return {
    ...item,
    publishedDate: new Date(item.createdAt || Date.now()).toLocaleDateString('vi-VN'),
    readTime: `${Math.max(1, Math.ceil(item.content.length / 900))} phút đọc`,
    sourceName: item.author?.fullName || 'Thành viên Fitness AI',
    sourceUrl: ''
  };
}

async function getApprovedPosts(req, res) {
  try {
    const posts = await BlogPost.find({ status: 'approved' })
      .populate('author', 'fullName')
      .sort({ createdAt: -1 });
    res.json(posts.map(serializePost));
  } catch (error) {
    res.status(500).json({ message: 'Không thể tải bài viết cộng đồng' });
  }
}

async function createPost(req, res) {
  try {
    const { title, excerpt, content, category, image } = req.body;

    if (!title?.trim() || !excerpt?.trim() || !content?.trim()) {
      return res.status(400).json({ message: 'Vui lòng nhập tiêu đề, mô tả và nội dung.' });
    }

    const post = await BlogPost.create({
      title: title.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      category: category?.trim() || undefined,
      image: image?.trim() || '',
      author: req.user._id
    });

    const populatedPost = await post.populate('author', 'fullName');
    res.status(201).json({
      message: 'Đã gửi bài viết. Bài sẽ hiển thị sau khi admin duyệt.',
      post: serializePost(populatedPost)
    });
  } catch (error) {
    res.status(500).json({ message: 'Không thể gửi bài viết.' });
  }
}

async function getMyPosts(req, res) {
  try {
    const posts = await BlogPost.find({ author: req.user._id })
      .populate('author', 'fullName')
      .sort({ createdAt: -1 });
    res.json(posts.map(serializePost));
  } catch (error) {
    res.status(500).json({ message: 'Không thể tải bài viết của bạn.' });
  }
}

async function getAdminPosts(req, res) {
  try {
    const posts = await BlogPost.find()
      .populate('author', 'fullName email')
      .populate('reviewedBy', 'fullName');

    const statusOrder = {
      pending: 0,
      approved: 1,
      rejected: 2
    };

    posts.sort((firstPost, secondPost) => {
      const statusDifference = statusOrder[firstPost.status] - statusOrder[secondPost.status];

      if (statusDifference !== 0) {
        return statusDifference;
      }

      return new Date(firstPost.createdAt).getTime() - new Date(secondPost.createdAt).getTime();
    });

    res.json(posts.map(serializePost));
  } catch (error) {
    res.status(500).json({ message: 'Không thể tải danh sách bài viết.' });
  }
}

async function reviewPost(req, res) {
  try {
    const { status, reviewNote } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Trạng thái duyệt không hợp lệ.' });
    }

    const post = await BlogPost.findByIdAndUpdate(
      req.params.id,
      {
        status,
        reviewNote: reviewNote?.trim() || '',
        reviewedBy: req.user._id,
        reviewedAt: new Date()
      },
      { new: true }
    ).populate('author', 'fullName email').populate('reviewedBy', 'fullName');

    if (!post) {
      return res.status(404).json({ message: 'Không tìm thấy bài viết.' });
    }

    res.json({ message: status === 'approved' ? 'Đã duyệt bài viết.' : 'Đã từ chối bài viết.', post: serializePost(post) });
  } catch (error) {
    res.status(500).json({ message: 'Không thể cập nhật trạng thái bài viết.' });
  }
}

export { getApprovedPosts, createPost, getMyPosts, getAdminPosts, reviewPost };
