---
name: hrm-project
description: Làm việc với mã nguồn HRM-2026, bao gồm cấu trúc dự án, quy ước frontend và các lệnh kiểm tra.
---

# HRM-2026

Dùng skill này khi tìm hiểu, thêm hoặc chỉnh sửa mã trong workspace HRM-2026. Đối chiếu mã và cấu hình hiện tại trước khi áp dụng: đây là bản ghi từ lần rà soát sơ bộ, không phải đặc tả nghiệp vụ hay danh sách quy tắc bắt buộc đầy đủ.

## Cấu trúc workspace

- `FrontEnd/`: ứng dụng Angular standalone. `src/app/app.routes.ts` khai báo route con dưới `MainLayout`, lazy-load các trang `candidate-profile`, `recruitment-batch`, `recruitment-tracking`. Sidebar nằm trong `src/app/components/libs/lib-sidebar/`.
- `BackEnd/`: ASP.NET Core Web SDK, target .NET 10, nullable và implicit usings được bật. Hiện `Program.cs` chỉ có endpoint mẫu `/weatherforecast` và OpenAPI trong môi trường development; chưa thấy API nghiệp vụ tuyển dụng trong lần rà soát.
- `Script/`: thư mục trống tại thời điểm rà soát; chưa có quy ước hoặc công cụ để suy ra.

## Công nghệ và dữ liệu frontend

- Angular 22, TypeScript 6, RxJS, PrimeNG và PrimeIcons; Tailwind CSS 4. Angular CDK được dùng cho kéo thả Kanban. Kiểm tra `FrontEnd/package.json` để biết phiên bản chính xác hiện tại.
- Cấu hình ứng dụng, router, HTTP client và PrimeNG ở `src/app/app.config.ts`. Không sao chép giá trị cấu hình hoặc khóa từ các file environment vào tài liệu hay phản hồi.
- Các màn hình hiện dùng nhiều dữ liệu mẫu: `recruitment-batch.data.ts`, `candidate-profile-table.model.ts`, các detail service và trạng thái Kanban trong bộ nhớ. Kiểm tra nơi lấy dữ liệu trước khi giả định đã có API hoặc dữ liệu lưu bền.
- Giao diện dùng tiếng Việt. Tránh ghi nhãn tiếng Việt thành chuỗi lỗi mã hóa.

## Tổ chức và đặt tên frontend

- Nhóm mã theo chức năng dưới `src/app/components/<feature>/`, tên thư mục và file dùng kebab-case. Ví dụ `recruitment-batch/`, `candidate-profile/`, `recruitment-tracking/`.
- Component con nằm trong thư mục cùng tên và được đặt gần component/feature sử dụng. Ví dụ `recruitment-tracking/recruitment-tracking-card/` chứa `recruitment-tracking-card.component.ts` và `.component.html`; thêm `.component.css` hoặc `.component.scss` khi cần. Component trang có thể đặt trực tiếp trong thư mục feature, ví dụ `recruitment-batch-page.component.ts`.
- Model/type/interface thường đặt trong `<tên>.model.ts`, cấu hình cột hoặc trường trong `<tên>.config.ts`, service trong `<tên>.service.ts`, dữ liệu mẫu có thể nằm trong `<tên>.data.ts` hoặc file model hiện có. Theo vị trí và cách phân chia của feature liên quan, không tự di chuyển file ngoài phạm vi yêu cầu.
- Component dùng PascalCase với hậu tố `Component`; interface/type dùng PascalCase; biến, phương thức và hàm dùng camelCase. Selector là element kebab-case với prefix `app-` hoặc `lib-`; directive là attribute camelCase prefix `app` theo `eslint.config.js`.
- Component dùng chung đặt tại `src/app/components/libs/lib-<tên>/`. Tìm và tái sử dụng thành phần hiện có như `lib-text`, `lib-hrm-table`, `lib-canvas`, `lib-input`, các command button và `lib-toast` trước khi bổ sung thành phần tương tự. Dùng `lib-text` cho văn bản phù hợp với các tag được `LibTextTag` hỗ trợ; giữ thẻ ngữ nghĩa khác khi cần, như `label` cho input.
- Component standalone khai báo dependencies trong `imports`; dự án có sử dụng `input`, `output`, `signal`, `computed` và `inject`. Giữ cách tổ chức phù hợp với mã lân cận, không giả định mọi component đều dùng cùng mẫu.
- Template và logic component thường tách thành `.component.html` và `.component.ts`. Một số file gốc/layout dùng tên rút gọn như `app.ts`, `app.html`, `main-layout.ts`; không suy ra chúng đều có hậu tố `.component`.
- Prettier hiện cấu hình 2 spaces, single quotes, `printWidth` 100 và Angular parser cho HTML. ESLint kiểm tra TypeScript, template và các quy tắc accessibility; xem `.prettierrc`, `.editorconfig` và `eslint.config.js` để biết cấu hình mới nhất.

## Kiểm tra thay đổi

Tại `FrontEnd/`, chạy các kiểm tra phù hợp với phạm vi thay đổi:

```sh
npm run lint
npm run typecheck
npm run build
```

`typecheck` dùng `tsc --noEmit -p tsconfig.app.json`; build Angular cũng kiểm tra template. Các script `npm test`, `npm run format:check` có sẵn khi phù hợp. Tại `BackEnd/`, dùng `dotnet build BackEnd.sln` để kiểm tra thay đổi .NET. Kết quả và cảnh báo thực tế phụ thuộc trạng thái môi trường; không mặc định mọi kiểm tra đã thành công.
