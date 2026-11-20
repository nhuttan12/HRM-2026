---
name: hrm-frontend
description: Áp dụng quy ước cấu trúc, đặt tên và kiểm tra khi thêm hoặc chỉnh sửa mã nguồn Angular của frontend HRM-2026.
---

# HRM-2026 Frontend

Dùng skill này khi làm việc với mã nguồn trong `FrontEnd/`. Xem mã hiện tại của chức năng liên quan và `package.json` trước khi chỉnh sửa; giữ thay đổi trong phạm vi yêu cầu.

## Cấu trúc và vị trí file

- Nhóm mã theo chức năng tại `src/app/components/<feature>/`, ví dụ `candidate-profile`, `recruitment-batch` và `recruitment-tracking`. Tên thư mục và file dùng kebab-case.
- Đặt component con trong thư mục riêng gần feature sử dụng, với các file `<tên>.component.ts`, `<tên>.component.html` và CSS/SCSS khi cần. Component trang có thể đặt ngay trong thư mục feature, ví dụ `recruitment-batch-page.component.ts`.
- Đặt component thực sự dùng chung trong `src/app/components/libs/lib-<tên>/`. Tìm và tái sử dụng component hiện có trước khi tạo mới. Layout nằm trong `src/app/layouts/`; route khai báo tại `src/app/app.routes.ts`.
- Đặt type, interface và định nghĩa cấu trúc object trong `<tên>.model.ts` gần phạm vi sử dụng. Dùng `PascalCase` cho tên type/interface; suy ra type từ model hoặc hằng số chung khi phù hợp, tránh khai báo nhiều bản cho cùng một khái niệm.
- Đặt cấu hình field, cột bảng, sidebar hoặc metadata dùng để dựng và hiển thị dữ liệu trong `<tên>.config.ts` gần component/feature sử dụng. Ràng buộc key của field với model tương ứng khi có thể. Config mô tả cách trình bày hoặc xử lý dữ liệu; model mô tả kiểu và cấu trúc dữ liệu.
- Đặt logic truy xuất hoặc xử lý dữ liệu dùng chung trong `<tên>.service.ts`; dữ liệu mẫu có thể đặt trong `<tên>.data.ts`. Không mặc định dữ liệu mẫu đã được kết nối API hoặc lưu bền.
- Với dữ liệu thực sự dùng chung giữa nhiều chức năng, chọn vị trí chung phù hợp với phạm vi sử dụng và import lại; không tạo bản sao ở từng component. Không di chuyển file hiện có ngoài phạm vi công việc chỉ để khớp quy ước.

## Quy ước code

- Component dùng `PascalCase` và hậu tố `Component`; biến, hàm và phương thức dùng `camelCase`. Selector component dùng kebab-case với prefix `app-` hoặc `lib-`, theo `eslint.config.js`.
- Theo mẫu Angular standalone của chức năng lân cận; khai báo dependency trong `imports` của component và sử dụng signal, input, output hoặc service theo nhu cầu thực tế.
- Tránh lặp chuỗi nghiệp vụ, trạng thái, mã phân loại hoặc tên section giữa model, logic và template. Khi chúng đại diện cùng một khái niệm, định nghĩa giá trị dùng chung và suy ra type khi phù hợp. Tách mã ổn định và nhãn hiển thị nếu contract nghiệp vụ hỗ trợ; không tự gộp các trạng thái khác nhau chỉ vì nhãn gần giống.
- Dùng `code` cho mã bước Kanban; không nhầm với thuộc tính `id` mà Angular CDK yêu cầu trên drop list. Giữ nguyên contract dữ liệu và nghiệp vụ hiện có trừ khi yêu cầu cần thay đổi.
- Giao diện hiện dùng tiếng Việt: giữ dấu và encoding UTF-8. Theo cấu hình format và lint hiện tại của project.

## Kiểm tra sau khi viết code

Chạy tại thư mục `FrontEnd/`:

```sh
npm run lint
npm run typecheck
npm run format:check
npm run format:fix
```

`format:fix` chạy Prettier trên toàn project và có thể sửa cả file ngoài phạm vi công việc. Kiểm tra thay đổi có sẵn trước khi chạy, tránh ghi đè công việc của người khác; nếu không thể chạy an toàn, báo rõ lý do. Sau khi format, chạy lại `npm run format:check`, và chạy lại lint/typecheck nếu việc format hoặc các sửa đổi tiếp theo làm ảnh hưởng kết quả kiểm tra. Với thay đổi template Angular, chạy thêm `npm run build` để kiểm tra biên dịch template. Báo kết quả thực tế và mọi lỗi hoặc cảnh báo còn lại.
