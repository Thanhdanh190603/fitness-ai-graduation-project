# Bảng kiểm thử QA

| Mã | Chức năng | Cách kiểm tra | Kết quả mong đợi |
| --- | --- | --- | --- |
| TC01 | Đăng ký | Nhập đủ thông tin và hai mật khẩu giống nhau | Tạo tài khoản thành công |
| TC02 | Đăng ký lỗi | Nhập hai mật khẩu khác nhau | Hiện thông báo và không tạo tài khoản |
| TC03 | Đăng nhập | Nhập đúng email và mật khẩu | Vào đúng trang tiếp theo |
| TC04 | Đăng nhập sai | Nhập sai mật khẩu | Hiện lỗi tiếng Việt |
| TC05 | Quên mật khẩu | Nhập email, mã xác minh và mật khẩu mới | Đổi mật khẩu thành công |
| TC06 | Hồ sơ | Nhập 170 cm và 70 kg | BMI khoảng 24,2 |
| TC07 | Hồ sơ lỗi | Bỏ trống chiều cao hoặc cân nặng | Không lưu và yêu cầu nhập lại |
| TC08 | Nhiều ảnh | Chọn ảnh chính diện, nghiêng và sau lưng | Hiển thị đủ ảnh đã chọn |
| TC09 | Đối chiếu ảnh | Nhập số liệu không phù hợp với ảnh | Hiện “Thông tin chưa phù hợp, vui lòng kiểm tra và nhập lại” |
| TC10 | Kế hoạch AI | Chọn mục tiêu, số buổi và thời lượng | Lịch được tạo đúng lựa chọn |
| TC11 | Lưu lịch | Đổi tần suất rồi tải lại trang | Lựa chọn mới vẫn được giữ |
| TC12 | Video theo lịch | Chọn một ngày có nhóm cơ | Video bên dưới cùng nhóm cơ |
| TC13 | Thư viện | Tìm “tay sau” hoặc “plank” | Chỉ hiện nội dung phù hợp |
| TC14 | Lọc thư viện | Chọn nhóm cơ và trình độ | Danh sách thay đổi đúng bộ lọc |
| TC15 | Hoàn thành tuần | Tick đủ buổi rồi bấm hoàn tất | Chuyển sang tuần kế tiếp |
| TC16 | Bỏ lỡ buổi | Chọn “chưa tập, sắp xếp lại” | Hệ thống đổi sang ngày còn trống |
| TC17 | Bữa ăn | Ghi “cơm tấm”, “phở” hoặc “mì gói” | Có kcal ước tính và cập nhật tổng kcal |
| TC18 | Thiếu ngủ | Nhập dưới 8 giờ ngủ | Hiện khuyến nghị tập nhẹ |
| TC19 | Blog | Member gửi bài viết | Bài ở trạng thái chờ duyệt |
| TC20 | Duyệt blog | Admin duyệt nhiều bài liên tiếp | Bài được sắp xếp theo thứ tự gửi |
| TC21 | Admin video | Admin thêm link video hợp lệ | Video xuất hiện trong thư viện |
| TC22 | Link video lỗi | Nhập link private hoặc Shorts | API từ chối và báo lỗi |
| TC23 | Quản lý Member | Admin xem danh sách tài khoản | Có thể cấp lại mật khẩu hoặc xóa tài khoản |
| TC24 | Quyền truy cập | User thường mở API admin | API trả về lỗi không có quyền |
| TC25 | Giao diện | Thu nhỏ cửa sổ trình duyệt | Bố cục không bị tràn nghiêm trọng |

## Cách ghi kết quả

Khi chạy thử, có thể thêm cột `Kết quả thực tế` và `Đạt/Không đạt`. Nếu lỗi, ghi lại bước tái hiện và ảnh chụp màn hình để dễ sửa.
