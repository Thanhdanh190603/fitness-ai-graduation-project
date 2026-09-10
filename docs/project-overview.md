# Tổng quan dự án

## Hệ thống làm gì?

Fitness AI giúp người dùng đi từ bước đánh giá ban đầu đến lúc có lịch tập và video để thực hiện. Mục tiêu của đề tài không phải chẩn đoán sức khỏe, mà là đưa ra hướng tập tham khảo dễ hiểu cho người mới.

## Luồng Visitor và Member

```text
Visitor
  -> Trang giới thiệu
  -> Dùng thử đánh giá thể trạng
  -> Xác nhận dữ liệu
  -> Xem hướng tập và video giới hạn

Member
  -> Đăng ký / đăng nhập
  -> Hoàn thiện hồ sơ
  -> Tạo kế hoạch AI
  -> Xem video theo lịch
  -> Tick buổi đã tập
  -> Điều chỉnh lịch và theo dõi tiến độ
```

Admin đi theo luồng riêng:

```text
Admin
  -> Đăng nhập tài khoản quản trị
  -> Quản lý video
  -> Duyệt bài blog
  -> Xem danh sách Member
  -> Cấp lại mật khẩu hoặc xóa tài khoản
```

## Các collection MongoDB

### User

Lưu thông tin đăng nhập, họ tên, email, vai trò, hồ sơ thể trạng, avatar, ảnh thể trạng và trạng thái Member.

### Exercise

Lưu tên bài tập, loại bài, nhóm cơ, trình độ, link video, mô tả, số hiệp, số lần và thời gian nghỉ.

### BlogPost

Lưu tiêu đề, nội dung, chuyên mục, tác giả, trạng thái duyệt và thời gian tạo.

Lịch tập chi tiết và một số dữ liệu theo dõi trong giao diện hiện đang lưu bằng `localStorage`. Đây là lựa chọn đơn giản để hoàn thành đồ án; khi phát triển tiếp có thể tách thành collection riêng.

## API chính

| Nhóm | Một số đường dẫn | Công dụng |
| --- | --- | --- |
| Auth | `/api/auth/register`, `/login`, `/me` | Tài khoản và phiên đăng nhập |
| User | `/api/users/profile`, `/avatar` | Cập nhật hồ sơ và ảnh |
| Exercise | `/api/exercises` | Lấy và quản lý video bài tập |
| AI | `/api/ai/free-analysis`, `/chat` | Phân tích và trợ lý AI |
| Blog | `/api/blog`, `/api/blog/admin` | Đọc, gửi và duyệt bài viết |

## Cách giải thích khi bảo vệ

- React phụ trách hiển thị trang và nhận dữ liệu từ form.
- Express tạo các API để frontend gọi đến backend.
- Controller xử lý nghiệp vụ, Model mô tả dữ liệu MongoDB, Route nối URL với controller.
- Middleware `protect` kiểm tra người dùng đã đăng nhập; `adminOnly` kiểm tra thêm quyền Admin.
- Khi chưa có Gemini, hệ thống dùng AI demo để đồ án vẫn chạy được.
