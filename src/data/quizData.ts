import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'quiz-01',
    question: {
      vi: 'Thuật ngữ tiếng Anh nào diễn tả "Nhà sinh hoạt chung của buôn làng Cơ Tu"?',
      en: 'Which English term refers to the communal house of the Cơ Tu village?'
    },
    options: [
      'Communal house',
      'Private sanctuary',
      'Marketplace',
      'Terraced field'
    ],
    correctIndex: 0,
    explanation: {
      vi: '"Communal house" là từ tiếng Anh chuẩn chỉ ngôi nhà chung sinh hoạt cộng đồng (như Nhà Gươl).',
      en: '"Communal house" accurately denotes the shared central building used for village gatherings.'
    },
    relatedArtifactSlug: 'guol-communal-house'
  },
  {
    id: 'quiz-02',
    question: {
      vi: 'Từ "Resonance" trong mô tả tiếng trống K\'tu mang ý nghĩa gì?',
      en: 'What does "Resonance" mean when describing the sound of the K\'tu drum?'
    },
    options: [
      'Độ nặng của tang trống',
      'Độ vang dội và cộng hưởng âm thanh',
      'Màu sắc của da trâu',
      'Kích thước của nẹp mây'
    ],
    correctIndex: 1,
    explanation: {
      vi: '"Resonance" nghĩa là độ vang sâu và cộng hưởng âm thanh đặc trưng của thân gỗ rỗng.',
      en: '"Resonance" signifies the deep, full reverberation of sound produced by the hollow drum shell.'
    },
    relatedArtifactSlug: 'ktu-traditional-drum'
  },
  {
    id: 'quiz-03',
    question: {
      vi: 'Chiếc gùi Ba-hieng của người Cơ Tu nổi tiếng với đặc điểm kiến trúc đan lát nào?',
      en: 'The Ba-hieng basket is famously recognized by which weaving design feature?'
    },
    options: [
      'One flat tray',
      'Three distinct compartments',
      'Iron frame reinforcement',
      'Silk cloth lining'
    ],
    correctIndex: 1,
    explanation: {
      vi: 'Gùi Ba-hieng đặc biệt bởi kết cấu 3 ngăn (three compartments) đan bằng mây rừng tinh xảo.',
      en: 'The Ba-hieng is renowned for having three distinct compartments hand-woven with split rattan.'
    },
    relatedArtifactSlug: 'bahieng-carrying-basket'
  },
  {
    id: 'quiz-04',
    question: {
      vi: '"Sacrificial pillar" chỉ hiện vật nào trong đời sống tâm linh của người Cơ Tu?',
      en: 'Which artifact corresponds to the term "Sacrificial pillar" in Cơ Tu spirituality?'
    },
    options: [
      'Cột tế T\'kơơr',
      'Ống nứa nấu cơm lam',
      'Mái nhà rông',
      'Cần câu cá'
    ],
    correctIndex: 0,
    explanation: {
      vi: '"Sacrificial pillar" chính là Cột tế T\'kơơr, nơi thực hiện các nghi thức tạ ơn thần linh.',
      en: '"Sacrificial pillar" translates to the T\'kơơr ceremonial post erected for harvest rituals.'
    },
    relatedArtifactSlug: 'tkoor-sacrifice-pillar'
  },
  {
    id: 'quiz-05',
    question: {
      vi: 'Vật liệu nào sau đây làm hộp cộng hưởng cho cây đàn T\'rút dân gian?',
      en: 'Which natural material forms the acoustic resonator of the folk T\'rút instrument?'
    },
    options: [
      'Clay pot',
      'Dried bottle gourd',
      'Brass bell',
      'Carved stone'
    ],
    correctIndex: 1,
    explanation: {
      vi: 'Đàn T\'rút sử dụng quả bầu khô (dried bottle gourd) làm bầu cộng hưởng âm sắc ấm áp.',
      en: 'The T\'rút instrument utilizes a dried bottle gourd to naturally amplify melodic timbre.'
    },
    relatedArtifactSlug: 'trut-traditional-instrument'
  }
];

