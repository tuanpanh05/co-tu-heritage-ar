# MÔ HÌNH DỮ LIỆU (DATA MODEL)
## CO TU HERITAGE AR

### 1. TypeScript Interfaces

```typescript
// Định dạng chuỗi song ngữ
export interface BilingualText {
  vi: string;
  en: string;
}

// Trạng thái kiểm chứng nội dung văn hóa
export type ContentVerificationStatus = 
  | 'verified'              // Đã qua thẩm định chuyên gia văn hóa
  | 'pending_verification' // Nội dung sưu tầm chờ xác minh
  | 'illustrative';         // Dữ liệu mẫu dùng kiểm thử giao diện

// Trạng thái của mô hình 3D
export type ModelStatus = 
  | 'available'             // Có file GLB thực tế
  | 'coming_soon'           // Đang tái tạo mô hình
  | 'missing';              // Chưa có mô hình

// Phân loại hiện vật
export type ArtifactCategory = 
  | 'architecture'          // Kiến trúc (Nhà Gươl, Nhà Moong...)
  | 'musical_instrument'    // Nhạc cụ (Trống K'tu, Khèn...)
  | 'weaving_craft'         // Đan lát & Dệt thổ cẩm (Gùi, Zèng...)
  | 'spiritual_sculpture'   // Điêu khắc & Tâm linh (Cột tế, Tượng...)
  | 'daily_tool';           // Công cụ sinh hoạt & săn bắt

// Thuật ngữ chuyên ngành văn hóa
export interface VocabularyItem {
  id: string;
  term: string;             // Từ tiếng Anh hoặc thuật ngữ Cơ Tu
  ipa?: string;             // Phiên âm quốc tế (nếu xác minh)
  vietnameseMeaning: string;// Nghĩa tiếng Việt
  englishDefinition?: string;// Định nghĩa ngắn bằng tiếng Anh
  exampleSentence?: {
    en: string;
    vi: string;
  };
  audioFile?: string;       // File âm thanh phát âm nếu có
  isCulturalSpecific?: boolean; // Thuật ngữ đặc thù không có từ tương đương
  culturalNote?: string;    // Chú thích văn hóa thêm
}

// Khối nội dung chi tiết hiện vật
export interface ArtifactSection {
  id: string;
  title: BilingualText;
  content: BilingualText;
}

// Đối tượng Hiện vật hoàn chỉnh
export interface Artifact {
  id: string;
  slug: string;             // Dùng trong routing URL (vd: guol-communal-house)
  name: BilingualText;
  category: ArtifactCategory;
  categoryName: BilingualText;
  thumbnail: string;        // Ảnh đại diện
  originalImages: string[]; // Ảnh tư liệu thực địa
  model3D?: string;         // Đường dẫn file .glb trong public/models/
  modelStatus: ModelStatus;
  contentStatus: ContentVerificationStatus;
  brief: BilingualText;     // Tóm tắt 1-2 câu
  description: BilingualText;// Mô tả tổng quan
  sections: ArtifactSection[];// Các mục chi tiết (Bối cảnh, Cấu tạo, Ý nghĩa)
  vocabulary: VocabularyItem[]; // Danh sách thuật ngữ trong ngữ cảnh
  audio?: {
    vi?: string;            // Audio thuyết minh tiếng Việt
    en?: string;            // Audio thuyết minh tiếng Anh
  };
  sources: string[];        // Nguồn tài liệu tham khảo
  verificationNote: string; // Cảnh báo tính xác thực
  dimensions?: string;      // Kích thước ước tính
  materials?: BilingualText;// Chất liệu
  origin?: BilingualText;   // Xuất xứ địa bàn (vd: Xã A Tiêng, Tây Giang)
}

// Đối tượng trong Sổ tay từ vựng lưu trữ LocalStorage
export interface SavedVocabularyItem extends VocabularyItem {
  savedAt: number;          // Timestamp thời điểm lưu
  learned: boolean;         // Đã ghi nhớ / chưa
  sourceArtifactSlug: string;// Thuộc hiện vật nào
  sourceArtifactName: BilingualText;
}

// Câu hỏi trắc nghiệm
export interface QuizQuestion {
  id: string;
  question: BilingualText;
  options: string[];        // 4 đáp án
  correctIndex: number;     // Index đáp án đúng (0-3)
  explanation: BilingualText;// Giải thích đáp án
  relatedArtifactSlug?: string;
}
```

### 2. Quy tắc bảo toàn dữ liệu
- Mọi dữ liệu mẫu đều được gán `contentStatus: 'illustrative'` kèm ghi chú trung thực: *"Dữ liệu minh họa giao diện; cần chuyên gia văn hóa Cơ Tu thẩm định trước khi công bố chính thức."*
- Nếu chưa có file GLB, `modelStatus: 'coming_soon'` và hệ thống sẽ hiển thị giao diện thông báo chờ mô hình rõ ràng, không làm gãy layout hoặc tạo viewer 3D giả lập.

