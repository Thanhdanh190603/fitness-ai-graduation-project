# Ghi chú UI/UX

## Hướng thiết kế

Đây là web app cho người tập, không phải trang quảng cáo phòng gym. Giao diện ưu tiên đọc nhanh, nút rõ và người dùng biết mình đang ở bước nào.

## Luồng chính

1. Visitor xem trang giới thiệu hoặc dùng thử.
2. Visitor nhập thông tin thể trạng, giấc ngủ và xác nhận dữ liệu.
3. Hệ thống hiển thị hướng tập và video phù hợp ở mức giới hạn.
4. Người dùng đăng ký để trở thành Member.
5. Member hoàn thiện hồ sơ, xem kế hoạch AI và theo dõi tiến độ.
6. Member dùng Thư viện, Trung tâm tập luyện, Blog và Trợ lý AI.

## Các trang sau khi đăng nhập

- **Dashboard:** nhìn nhanh BMI, mục tiêu và hồ sơ.
- **Kế hoạch AI:** lịch tuần, block, buổi đã tập và điều chỉnh lịch.
- **Video bài tập:** video khớp với ngày và nhóm cơ trong lịch.
- **Thư viện:** tất cả video, có tìm kiếm và bộ lọc.
- **Trung tâm tập luyện:** bài bổ trợ sau khi đã hoàn thành buổi chính.
- **Blog:** đọc kiến thức và gửi bài viết.
- **Trợ lý AI:** chat và hỗ trợ theo hồ sơ Member.

## Nguyên tắc giao diện

- Dùng tiếng Việt rõ ràng, tránh câu báo lỗi mơ hồ.
- Nút chính đặt gần phần người dùng vừa nhập.
- Ngày có lịch tập, ngày đã tập và ngày bận dùng màu khác nhau.
- Không để một trang có quá nhiều khối thông báo giống nhau.
- Danh sách video có tìm kiếm để người dùng không phải kéo quá nhiều.
- Form dài chia theo nhóm: thông tin tài khoản, thể trạng và ảnh.
- Khi có dữ liệu sai, báo ngay tại chỗ và giữ lại dữ liệu người dùng đã nhập.

## Kiểm tra trước khi demo

- Đăng nhập bằng một tài khoản Member và một tài khoản Admin.
- Thử làm mới trang sau khi đổi tần suất tập.
- Thử lọc thư viện theo “Ngực, vai và tay sau” hoặc “Cardio và core”.
- Thử gửi một bài blog rồi duyệt bằng Admin.
- Không mở file `server/.env` khi trình chiếu hoặc đưa code lên GitHub.
