// Hệ thống kiểu dữ liệu cho CO TU HERITAGE AR

export type LanguageMode = 'vi' | 'en' | 'bilingual';

export interface BilingualText {
  vi: string;
  en: string;
}

export type ContentVerificationStatus = 
  | 'verified'              // Đã thẩm định bởi chuyên gia
  | 'pending_verification' // Chờ thẩm định
  | 'illustrative';         // Dữ liệu mẫu kiểm thử giao diện

export type ModelStatus = 
  | 'available'             // Có file GLB thực tế
  | 'coming_soon'           // Đang tái tạo mô hình 3D
  | 'missing';              // Chưa có mô hình

export type ArtifactCategory = 
  | 'architecture'          // Kiến trúc
  | 'musical_instrument'    // Nhạc cụ
  | 'weaving_craft'         // Đan lát & Dệt
  | 'spiritual_sculpture'   // Điêu khắc & Tâm linh
  | 'daily_tool';           // Đời sống sinh hoạt

export interface VocabularyItem {
  id: string;
  term: string;             // Từ tiếng Anh hoặc thuật ngữ Cơ Tu
  ipa?: string;             // Phiên âm quốc tế
  vietnameseMeaning: string;// Nghĩa tiếng Việt
  englishDefinition?: string;// Định nghĩa ngắn bằng tiếng Anh
  exampleSentence?: {
    en: string;
    vi: string;
  };
  audioFile?: string;       // File âm thanh nếu có
  isCulturalSpecific?: boolean; // Thuật ngữ văn hóa đặc thù
  culturalNote?: string;    // Ghi chú văn hóa
}

export interface ArtifactSection {
  id: string;
  title: BilingualText;
  content: BilingualText;
}

export interface Artifact {
  id: string;
  slug: string;             // Định danh URL
  name: BilingualText;
  category: ArtifactCategory;
  categoryName: BilingualText;
  thumbnail: string;
  originalImages: string[];
  model3D?: string;         // Đường dẫn file /models/*.glb
  modelStatus: ModelStatus;
  contentStatus: ContentVerificationStatus;
  brief: BilingualText;
  description: BilingualText;
  sections: ArtifactSection[];
  vocabulary: VocabularyItem[];
  audio?: {
    vi?: string;
    en?: string;
  };
  sources: string[];
  verificationNote: string;
  dimensions?: string;
  materials?: BilingualText;
  origin?: BilingualText;
}

export interface SavedVocabularyItem extends VocabularyItem {
  savedAt: number;
  learned: boolean;
  sourceArtifactSlug: string;
  sourceArtifactName: BilingualText;
}

export interface QuizQuestion {
  id: string;
  question: BilingualText;
  options: string[];
  correctIndex: number;
  explanation: BilingualText;
  relatedArtifactSlug?: string;
}

