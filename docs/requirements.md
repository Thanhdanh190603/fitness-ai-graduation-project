# Yêu cầu hệ thống

## 1. Mục tiêu đề tài

Fitness AI là website hướng dẫn tập luyện thể thao bằng video. Hệ thống giúp người dùng bắt đầu từ thông tin cơ bản như tuổi, chiều cao, cân nặng, mục tiêu và thời gian rảnh, sau đó đưa ra hướng tập phù hợp hơn.

## 2. Đối tượng sử dụng

### Visitor

Visitor chưa đăng nhập. Người này được xem phần giới thiệu, dùng thử đánh giá thể trạng và xem một số video theo mục tiêu. Các chức năng lưu hồ sơ và kế hoạch cá nhân bị giới hạn.

### Member

Member là người đã đăng ký tài khoản. Member có thể lưu hồ sơ, tạo kế hoạch AI, chỉnh tần suất và thời lượng, cập nhật ngày bận, theo dõi tiến độ, dùng thư viện video và các phần theo dõi sức khỏe.

### Admin

Admin là tài khoản quản trị hệ thống. Admin quản lý nội dung và hỗ trợ tài khoản, không tham gia vào luồng tập luyện của Member.

## 3. Yêu cầu chức năng

### Tài khoản và hồ sơ

- Đăng ký bằng họ tên, tên đăng nhập, email, số điện thoại, ngày sinh và mật khẩu.
- Xác minh mật khẩu khi đăng ký.
- Đăng nhập, đăng xuất và quên mật khẩu bằng mã gửi qua email.
- Đổi mật khẩu trong trang thông tin tài khoản.
- Cập nhật avatar và ảnh thể trạng.

### Đánh giá thể trạng

- Nhập chiều cao và cân nặng để tính BMI.
- Nhận tối đa nhiều ảnh với các góc chính diện, nghiêng và sau lưng.
- Đối chiếu ảnh với số liệu nhập. Nếu dữ liệu không hợp lý thì yêu cầu kiểm tra lại thay vì kết luận ngay.
- Hiển thị nhận xét tham khảo và hướng tập phù hợp với mục tiêu.

### Kế hoạch tập luyện

- Tạo lịch theo mục tiêu, trình độ, tần suất và thời lượng.
- Hiển thị block theo tiến độ của người dùng.
- Phân biệt ngày có lịch tập và ngày bận nghỉ tập.
- Đánh dấu buổi đã tập.
- Khi kết thúc tuần, cho phép ghi nhận buổi đã tập hoặc sắp xếp lại buổi chưa tập.
- Video trong trang Video bài tập phải khớp với nhóm cơ của lịch.

### Video và thư viện

- Video bài tập hiển thị theo lịch của kế hoạch AI.
- Thư viện tổng hợp toàn bộ video công khai.
- Tìm theo tên bài, nhóm cơ và mô tả.
- Lọc theo nhóm cơ/mục tiêu, loại bài tập và trình độ.
- Admin có thể thêm, sửa và xóa video.

### Blog

- Hiển thị bài viết có sẵn và bài viết đã được duyệt.
- Member gửi bài viết, bài được lưu ở trạng thái chờ duyệt.
- Admin duyệt hoặc từ chối bài viết.
- Bài viết hiển thị họ tên thật của người đăng ở cuối bài.

### Theo dõi sức khỏe

- Ghi số giờ ngủ và mức năng lượng trong ngày.
- Nếu ngủ dưới 8 giờ, hệ thống khuyến nghị giảm cường độ.
- Ghi món ăn, ước tính kcal và tạo gợi ý cho những bữa còn lại.
- Theo dõi mục tiêu nước uống trong ngày.

## 4. Yêu cầu phi chức năng

- Giao diện chạy tốt trên trình duyệt máy tính.
- Thông báo lỗi bằng tiếng Việt, dễ hiểu.
- API yêu cầu đăng nhập với dữ liệu cá nhân.
- Chỉ Admin được quản lý video, bài viết và tài khoản khác.
- Không lưu API key trong mã frontend hoặc đưa file `.env` lên GitHub.
