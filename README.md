# Fitness AI

Fitness AI là website hỗ trợ người mới bắt đầu tập luyện. Người dùng có thể nhập thông tin cơ thể, xem BMI, nhận lịch tập, xem video hướng dẫn và theo dõi một số thói quen như ăn uống, giấc ngủ và lượng nước.

Đây là đồ án tốt nghiệp nên phần AI được làm theo hai cách:

- Chế độ demo dùng các quy tắc có sẵn để hệ thống vẫn chạy được khi không có API key.
- Có thể bật Gemini ở backend để phân tích ảnh, món ăn, thực đơn và chat với AI.

## Công nghệ sử dụng

- React và Vite: làm giao diện.
- Node.js và Express: tạo backend và API.
- MongoDB và Mongoose: lưu tài khoản, bài tập và bài blog cộng đồng.
- Express Session: giữ phiên đăng nhập.
- Multer: nhận ảnh hồ sơ, avatar và ảnh món ăn.
- Gemini API: tùy chọn, chỉ bật khi cấu hình trong file môi trường.

## Các đối tượng trong hệ thống

Website có hai nhóm người dùng chính và một tài khoản quản trị:

- **Visitor:** chưa đăng nhập, được dùng thử đánh giá thể trạng và xem nội dung giới hạn.
- **Member:** đã đăng ký, có hồ sơ riêng, kế hoạch AI, thư viện video, trung tâm tập luyện và các phần theo dõi sức khỏe.
- **Admin:** quản lý video, thành viên và bài blog. Admin không phải là một gói người dùng bán cho khách.

## Chức năng chính

- Đăng ký, đăng nhập, đăng xuất và quên mật khẩu qua email.
- Hoàn thiện hoặc chỉnh sửa hồ sơ thể trạng.
- Tính BMI và đối chiếu dữ liệu nhập với ảnh thể trạng.
- Tạo lịch tập theo mục tiêu, số buổi, thời lượng và ngày bận.
- Đánh dấu buổi đã tập, kết thúc tuần và sắp xếp lại buổi bỏ lỡ.
- Xem video theo lịch trong tuần.
- Tìm kiếm và lọc toàn bộ video trong mục **Thư viện**.
- Theo dõi bữa ăn, kcal ước tính, giấc ngủ, năng lượng và lượng nước.
- Chat với AI PT và nhận gợi ý dinh dưỡng.
- Đọc blog có sẵn hoặc gửi bài viết chờ admin duyệt.
- Admin thêm, sửa, xóa video; duyệt bài viết; xem, xóa tài khoản và cấp lại mật khẩu tạm thời.

## Chạy project trên máy

### 1. Cài thư viện

```bash
npm install
npm run install:all
```

### 2. Tạo file môi trường

Tạo file `server/.env` từ `server/.env.example`, sau đó điền MongoDB và các thông tin cần dùng. Không đưa file `.env` lên GitHub.

```powershell
Copy-Item server/.env.example server/.env
```

Nếu dùng MongoDB cài trên máy thì có thể giữ:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/fitness_ai
PORT=5000
```

### 3. Chạy frontend và backend

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- Kiểm tra backend: `http://localhost:5000/`

### 4. Tạo dữ liệu mẫu

Lệnh này xóa dữ liệu mẫu cũ rồi tạo lại tài khoản và một số bài tập:

```bash
npm run seed --prefix server
```

Tài khoản mẫu:

- Admin: `admin@gmail.com` / `123456`
- User mẫu: `user@gmail.com` / `123456`

Muốn chỉ thêm hoặc cập nhật video mà không xóa tài khoản hiện có:

```bash
npm run seed:videos --prefix server
```

## Cấu trúc thư mục

```text
client/src/pages       Các trang React
client/src/components  Component dùng lại
client/src/data        Dữ liệu lịch tập và blog tĩnh
client/src/utils       Hàm tính BMI và xử lý sức khỏe
server/src/routes      Khai báo đường dẫn API
server/src/controllers Xử lý nghiệp vụ của API
server/src/models      Các collection MongoDB
server/src/middleware  Kiểm tra đăng nhập và nhận file
docs                   Tài liệu yêu cầu, kiến trúc và kiểm thử
```

## Tài liệu đồ án

- [Tổng quan hệ thống](docs/project-overview.md)
- [Yêu cầu chức năng](docs/requirements.md)
- [Danh sách kiểm thử](docs/test-cases.md)
- [Ghi chú UI/UX](docs/ui-ux-notes.md)

## Một vài giới hạn hiện tại

- Cổng thanh toán đang là mô phỏng cho đồ án, chưa thu tiền thật.
- Video được nhúng từ link công khai, không lưu file video trong server.
- Lịch cá nhân và một phần tiến độ đang lưu ở trình duyệt bằng `localStorage`.
- AI demo vẫn là phương án dự phòng. Gemini chỉ chạy khi `USE_REAL_AI=true` và có `GEMINI_API_KEY`.
- Kết quả BMI, kcal và phân tích ảnh chỉ mang tính tham khảo, không thay thế bác sĩ hoặc huấn luyện viên trực tiếp.
