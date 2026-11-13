import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // =========================================================================
  // 1. NHÀ GƯƠL TRUYỀN THỐNG (guol-communal-house) - 4 câu
  // =========================================================================
  {
    id: 'quiz-guol-01',
    question: {
      vi: 'Thuật ngữ tiếng Anh nào diễn tả chính xác "Nhà Gươl sinh hoạt cộng đồng" của người Cơ Tu?',
      en: 'Which English term accurately refers to the sacred Gươl house of a Cơ Tu village?'
    },
    options: [
      'Communal house',
      'Private villa',
      'Commercial warehouse',
      'Stone fortress'
    ],
    correctIndex: 0,
    explanation: {
      vi: '"Communal house" chỉ ngôi nhà chung thiêng liêng nằm ở trung tâm bản làng Cơ Tu.',
      en: '"Communal house" denotes the shared central sanctuary used for village meetings and rituals.'
    },
    relatedArtifactSlug: 'guol-communal-house'
  },
  {
    id: 'quiz-guol-02',
    question: {
      vi: 'Kỹ thuật lắp dựng khung gỗ Nhà Gươl hoàn toàn không dùng đinh sắt được gọi là gì?',
      en: 'What is the traditional woodworking technique used to join Gươl beams without metal nails?'
    },
    options: [
      'Mortise and tenon joint (Liên kết mộng gỗ)',
      'Steel bolt welding (Hàn bu-lông thép)',
      'Concrete casting (Đổ bê tông cốt thép)',
      'Plastic adhesive (Dán keo công nghiệp)'
    ],
    correctIndex: 0,
    explanation: {
      vi: 'Nghệ nhân Cơ Tu dùng kỹ thuật đục mộng gỗ âm - dương ("Mortise and tenon joint") và buộc dây mây rừng cực kỳ bền chắc.',
      en: 'Cơ Tu master carpenters interlock timber beams using traditional mortise and tenon joinery bound with rattan.'
    },
    relatedArtifactSlug: 'guol-communal-house'
  },
  {
    id: 'quiz-guol-03',
    question: {
      vi: 'Cây cột cái linh thiêng đứng chính giữa chống đỡ toàn bộ mái Nhà Gươl được gọi là gì?',
      en: 'What is the main load-bearing timber trunk at the heart of the Gươl house called?'
    },
    options: [
      'Central sacred pillar (Cột cái Ki’lơm)',
      'Garden fence post (Cột hàng rào)',
      'Window frame (Khung cửa sổ)',
      'Balcony railing (Lan can hiên)'
    ],
    correctIndex: 0,
    explanation: {
      vi: '"Central sacred pillar" (Cột cái Ki’lơm) là trụ tâm linh quan trọng nhất của ngôi nhà Gươl.',
      en: 'The central sacred pillar (Ki’lơm) supports the soaring conical roof and features rich carvings.'
    },
    relatedArtifactSlug: 'guol-communal-house'
  },
  {
    id: 'quiz-guol-04',
    question: {
      vi: 'Phần mái dày giúp Nhà Gươl mát vào mùa hè và ấm vào mùa đông sương núi được lợp bằng gì?',
      en: 'What natural material is woven to create the traditional steep roof of the Gươl?'
    },
    options: [
      'Thatched rattan & palm leaves (Lá mây, lá nón rừng)',
      'Corrugated plastic sheets (Tấm nhựa sóng)',
      'Glass panels (Tấm kính cường lực)',
      'Copper tiles (Ngói đồng)'
    ],
    correctIndex: 0,
    explanation: {
      vi: 'Mái nhà Gươl truyền thống được lợp bằng lá mây hoặc lá cọ/lá nón rừng ("Thatched rattan roof") kết rất dày.',
      en: 'Layered rattan and forest palm leaves form a weatherproof, breathable thatched roof.'
    },
    relatedArtifactSlug: 'guol-communal-house'
  },

  // =========================================================================
  // 2. TRỐNG K'TU TRUYỀN THỐNG (ktu-traditional-drum) - 4 câu
  // =========================================================================
  {
    id: 'quiz-ktu-01',
    question: {
      vi: 'Đặc điểm cấu tạo nổi bật nhất của phần thân (tang) Trống K\'tu truyền thống là gì?',
      en: 'What is the most distinctive structural feature of the K\'tu drum body?'
    },
    options: [
      'Hollowed wooden body from a single tree trunk (Đục rỗng từ một thân gỗ nguyên khối)',
      'Glued plywood boards (Ghép từ ván ép công nghiệp)',
      'Molded ceramic clay (Nặn bằng đất nung)',
      'Cast bronze cylinder (Đúc bằng đồng nguyên khối)'
    ],
    correctIndex: 0,
    explanation: {
      vi: 'Tang trống K\'tu được đục rỗng thủ công từ một khúc gỗ mít hoặc gỗ rừng nguyên khối ("Hollowed wooden body").',
      en: 'Artisans hollow out a single solid hardwood trunk so the drum resonates deeply without glued seams.'
    },
    relatedArtifactSlug: 'ktu-traditional-drum'
  },
  {
    id: 'quiz-ktu-02',
    question: {
      vi: 'Từ tiếng Anh "Resonance" khi thuyết minh về tiếng trống K\'tu mang ý nghĩa gì?',
      en: 'What does the term "Resonance" mean when describing the sound of the K\'tu drum?'
    },
    options: [
      'Độ vang dội và cộng hưởng âm thanh trầm hùng',
      'Trọng lượng nặng của khúc gỗ',
      'Màu nâu sẫm của vỏ cây',
      'Chiều dài của dùi trống'
    ],
    correctIndex: 0,
    explanation: {
      vi: '"Resonance" diễn tả âm vang sâu, ấm và lan tỏa khắp thung lũng núi rừng khi đánh trống K\'tu.',
      en: '"Resonance" refers to the deep, echoing reverberation produced by the hollowed wooden chamber.'
    },
    relatedArtifactSlug: 'ktu-traditional-drum'
  },
  {
    id: 'quiz-ktu-03',
    question: {
      vi: 'Hai mặt trống K\'tu được căng bằng vật liệu tự nhiên nào để tạo âm thanh chuẩn?',
      en: 'Which natural material is stretched across both ends of the K\'tu drum?'
    },
    options: [
      'Tuned animal hide membrane (Da trâu hoặc da sơn dương phơi khô)',
      'Woven cotton fabric (Vải bông dệt)',
      'Thin bamboo bark (Vỏ tre mỏng)',
      'Pressed paper sheet (Giấy ép dày)'
    ],
    correctIndex: 0,
    explanation: {
      vi: 'Hai mặt trống dùng da trâu hoặc da sơn dương ("Tuned hide membrane") cố định bằng dây mây và nêm gỗ.',
      en: 'Treated buffalo or mountain goat hide is tensioned with rattan cords and wooden wedges.'
    },
    relatedArtifactSlug: 'ktu-traditional-drum'
  },
  {
    id: 'quiz-ktu-04',
    question: {
      vi: 'Tiếng trống K\'tu thường hòa nhịp cùng chiêng đồng để dẫn dắt vũ điệu thiêng nào của người Cơ Tu?',
      en: 'The K\'tu drumbeat accompanies bronze gongs to lead which iconic Cơ Tu ritual dance?'
    },
    options: [
      'Tân Tung Da Dă ritual dance (Vũ điệu Tân Tung Da Dă)',
      'Waltz ballroom dance',
      'Flamenco guitar dance',
      'Ice skating performance'
    ],
    correctIndex: 0,
    explanation: {
      vi: 'Nhịp trống K\'tu là linh hồn giữ nhịp cho vòng múa Tân Tung Da Dă trong các lễ hội bản làng.',
      en: 'The K\'tu drum drives the rhythm for the collective Tân Tung Da Dă festival dance.'
    },
    relatedArtifactSlug: 'ktu-traditional-drum'
  },

  // =========================================================================
  // 3. GÙI BA-HIÊNG CƠ TU (bahieng-carrying-basket) - 4 câu
  // =========================================================================
  {
    id: 'quiz-bahieng-01',
    question: {
      vi: 'Chiếc gùi truyền thống đeo sau lưng của đồng bào Cơ Tu được giới thiệu bằng tiếng Anh là gì?',
      en: 'How do you introduce the traditional Cơ Tu carrying basket worn on the back in English?'
    },
    options: [
      'Woven back-basket (Gùi đan mây tre đeo vai)',
      'Leather handbag (Túi xách da cầm tay)',
      'Metal suitcase (Va-li kim loại)',
      'Plastic bucket (Xô nhựa)'
    ],
    correctIndex: 0,
    explanation: {
      vi: '"Woven back-basket" giúp du khách quốc tế hình dung ngay chiếc gùi đan thủ công đeo trên lưng.',
      en: '"Woven back-basket" clearly describes the handcrafted rattan basket carried with shoulder straps.'
    },
    relatedArtifactSlug: 'bahieng-carrying-basket'
  },
  {
    id: 'quiz-bahieng-02',
    question: {
      vi: 'Chiếc gùi Ba-hiêng / Pơ-rông quý của người Cơ Tu nổi tiếng với đặc điểm cấu tạo nào?',
      en: 'What structural feature makes the ornate Cơ Tu Ba-hiêng basket special?'
    },
    options: [
      'Three distinct compartments with a fitted lid (Kết cấu 3 ngăn có nắp đậy)',
      'Only one flat wooden board (Chỉ có một tấm ván phẳng)',
      'Made of heavy cast iron (Đúc bằng gang nặng)',
      'No shoulder straps (Không có quai đeo)'
    ],
    correctIndex: 0,
    explanation: {
      vi: 'Gùi Ba-hiêng đặc sắc nhờ thiết kế 3 ngăn ("Three compartments") dùng để cất giữ thổ cẩm, trang sức và vật quý.',
      en: 'Its three-compartment design keeps precious brocades and heirlooms organized and dry.'
    },
    relatedArtifactSlug: 'bahieng-carrying-basket'
  },
  {
    id: 'quiz-bahieng-03',
    question: {
      vi: 'Để nan mây và nan tre đan gùi có màu nâu bóng đẹp và không bị mối mọt, nghệ nhân Cơ Tu làm gì?',
      en: 'How do Cơ Tu artisans treat split rattan and bamboo strips to prevent woodworm?'
    },
    options: [
      'Smoke-cure them above the kitchen hearth (Gác lên bếp lửa hun khói tự nhiên)',
      'Soak them in salt water (Ngâm nước muối biển)',
      'Freeze them in ice (Ướp đá lạnh)',
      'Coat them in cement (Phủ xi măng)'
    ],
    correctIndex: 0,
    explanation: {
      vi: 'Nan mây tre và chiếc gùi hoàn thiện được hun khói trên gác bếp ("Smoke-cured") giúp dẻo dai và bền hàng chục năm.',
      en: 'Curing rattan over hearth smoke naturally seals the fibers against moisture and insects.'
    },
    relatedArtifactSlug: 'bahieng-carrying-basket'
  },
  {
    id: 'quiz-bahieng-04',
    question: {
      vi: 'Kỹ thuật đan chéo tạo nên các đường vân chữ V bền chắc trên thân gùi được gọi là gì?',
      en: 'What is the diagonal interlocking weaving pattern on the basket body called?'
    },
    options: [
      'Herringbone twill weave (Đan xương cá / đan nong đôi)',
      'Knitting wool yarn (Đan len sợi bông)',
      'Chain-link fencing (Đan lưới sắt)',
      'Paper folding (Gấp giấy Origami)'
    ],
    correctIndex: 0,
    explanation: {
      vi: '"Herringbone twill weave" là kỹ thuật đan xương cá tạo hoa văn hình học tinh xảo trên thân gùi.',
      en: '"Herringbone twill weave" produces the signature V-shaped geometric patterns and structural strength.'
    },
    relatedArtifactSlug: 'bahieng-carrying-basket'
  },

  // =========================================================================
  // 4. ĐÀN T'RỨT DÂN GIAN (trut-traditional-instrument) - 4 câu
  // =========================================================================
  {
    id: 'quiz-trut-01',
    question: {
      vi: 'Đàn T\'rứt của người Cơ Tu thuộc nhóm nhạc cụ nào trong tiếng Anh?',
      en: 'Which musical instrument category does the Cơ Tu T\'rứt belong to?'
    },
    options: [
      'Two-stringed bowed fiddle (Đàn nhị kéo hai dây)',
      'Percussion stone xylophone (Đàn đá gõ)',
      'Brass trumpet (Kèn đồng)',
      'Keyboard piano (Đàn phím)'
    ],
    correctIndex: 0,
    explanation: {
      vi: 'Đàn T\'rứt là nhạc cụ dây kéo bằng cung vĩ ("Two-stringed bowed fiddle") có âm sắc trữ tình.',
      en: 'The T\'rứt is a traditional two-stringed bowed fiddle played with a horsehair or rattan-fiber bow.'
    },
    relatedArtifactSlug: 'trut-traditional-instrument'
  },
  {
    id: 'quiz-trut-02',
    question: {
      vi: 'Bộ phận bầu cộng hưởng âm thanh của cây đàn T\'rứt được làm từ vật liệu tự nhiên nào?',
      en: 'Which natural material forms the resonating chamber of the T\'rứt instrument?'
    },
    options: [
      'Dried bottle gourd or coconut shell (Quả bầu khô hoặc gáo dừa)',
      'Hollow steel pipe (Ống thép rỗng)',
      'Glass jar (Lọ thủy tinh)',
      'Carved granite rock (Đá hoa cương)'
    ],
    correctIndex: 0,
    explanation: {
      vi: 'Nghệ nhân dùng vỏ quả bầu khô ("Dried bottle gourd") hoặc gáo dừa để tạo âm thanh mộc mạc, ấm áp.',
      en: 'A dried calabash gourd naturally amplifies the warm, lyrical vibrations of the two strings.'
    },
    relatedArtifactSlug: 'trut-traditional-instrument'
  },
  {
    id: 'quiz-trut-03',
    question: {
      vi: 'Giai điệu của đàn T\'rứt thường đồng hành cùng loại hình nghệ thuật diễn xướng dân gian nào?',
      en: 'The melody of the T\'rứt fiddle often accompanies which traditional Cơ Tu oral art?'
    },
    options: [
      'Sung poetry & Hat Ly folk songs (Hát lý - Nói lý và dân ca Cơ Tu)',
      'Opera symphony',
      'Electronic dance music',
      'Silent mime'
    ],
    correctIndex: 0,
    explanation: {
      vi: 'Tiếng đàn T\'rứt réo rắt luôn quyện cùng lời Hát lý, Nói lý tâm tình bên bếp lửa nhà Gươl.',
      en: 'Its gentle pentatonic melody weaves seamlessly with Hát lý sung poetry during evening gatherings.'
    },
    relatedArtifactSlug: 'trut-traditional-instrument'
  },
  {
    id: 'quiz-trut-04',
    question: {
      vi: 'Từ "Melodic timbre" khi miêu tả tiếng đàn T\'rứt có nghĩa là gì?',
      en: 'What does "Melodic timbre" mean when describing the sound of the T\'rứt?'
    },
    options: [
      'Âm sắc giai điệu du dương, giàu cảm xúc',
      'Kích thước nhỏ gọn của cây đàn',
      'Độ cứng của cần đàn bằng tre',
      'Số lượng nút buộc dây mây'
    ],
    correctIndex: 0,
    explanation: {
      vi: '"Melodic timbre" chỉ màu âm du dương như tiếng chim rừng và tiếng suối reo của đàn T\'rứt.',
      en: '"Melodic timbre" captures the expressive, singing tone quality of the instrument.'
    },
    relatedArtifactSlug: 'trut-traditional-instrument'
  },

  // =========================================================================
  // 5. CỘT TẾ T'KƠƠR (tkoor-sacrifice-pillar) - 4 câu
  // =========================================================================
  {
    id: 'quiz-tkoor-01',
    question: {
      vi: 'Cột tế T\'kơơr (cây nêu Xơ-nur) được giới thiệu với du khách quốc tế bằng thuật ngữ nào?',
      en: 'Which English term best introduces the T\'kơơr totem post to international visitors?'
    },
    options: [
      'Ceremonial pole / Sacrificial pillar (Cột tế lễ chạm khắc)',
      'Street lamppost (Cột đèn đường)',
      'Telephone pole (Cột điện thoại)',
      'Bridge pier (Trụ cầu bê tông)'
    ],
    correctIndex: 0,
    explanation: {
      vi: '"Ceremonial pole" hoặc "Sacrificial pillar" diễn tả đúng ý nghĩa cột lễ tâm linh dựng trước sân nhà Gươl.',
      en: 'It stands at the center of the village courtyard as a sacred axis during major festivals.'
    },
    relatedArtifactSlug: 'tkoor-sacrifice-pillar'
  },
  {
    id: 'quiz-tkoor-02',
    question: {
      vi: 'Hai tấm gỗ chạm hoa văn vươn sang hai bên thân cột T\'kơơr mang hình tượng gì?',
      en: 'What do the two carved wooden boards extending from both sides of the T\'kơơr pole represent?'
    },
    options: [
      'Outstretched wooden wings of the sacred Kơ-lang bird (Đôi cánh chim Kơ-lang đại ngàn)',
      'Boat oars for ocean sailing (Mái chèo thuyền biển)',
      'Windmill blades (Cánh quạt cối xay gió)',
      'Airplane propellers (Cánh quạt máy bay)'
    ],
    correctIndex: 0,
    explanation: {
      vi: 'Đôi cánh gỗ ("Outstretched wooden wings") biểu trưng cho chim thiêng Kơ-lang chở che buôn làng.',
      en: 'They symbolize the wings of the mythical Kơ-lang bird soaring over the Trường Sơn mountains.'
    },
    relatedArtifactSlug: 'tkoor-sacrifice-pillar'
  },
  {
    id: 'quiz-tkoor-03',
    question: {
      vi: 'Ba gam màu truyền thống (đen, trắng, đỏ nâu) vẽ trên cột T\'kơơr được chế tạo từ đâu?',
      en: 'Where do Cơ Tu artisans obtain the black, white, and red pigments painted on the T\'kơơr pole?'
    },
    options: [
      'Natural mineral & bark pigments (Nhọ nồi, đất cao lanh/vôi trắng và rễ/vỏ cây rừng)',
      'Synthetic neon spray paint (Sơn xịt dạ quang công nghiệp)',
      'Plastic food coloring (Phẩm màu thực phẩm)',
      'Printer ink cartridges (Mực máy in)'
    ],
    correctIndex: 0,
    explanation: {
      vi: 'Nghệ nhân dùng hoàn toàn màu khoáng vật và thảo mộc tự nhiên ("Natural mineral & bark pigments").',
      en: 'Soot, white clay/limestone, and forest bark extracts create earth-toned colors that honor nature.'
    },
    relatedArtifactSlug: 'tkoor-sacrifice-pillar'
  },
  {
    id: 'quiz-tkoor-04',
    question: {
      vi: 'Trong các dịp lễ hội lớn, dân làng Cơ Tu quây quần quanh cột T\'kơơr để cầu nguyện điều gì?',
      en: 'What does the Cơ Tu community pray for when gathering around the T\'kơơr pole during festivals?'
    },
    options: [
      'Peace, community solidarity, and a bountiful harvest (Bình an, đoàn kết và mùa màng bội thu)',
      'Winning a stock market trade',
      'Building skyscrapers',
      'Space travel'
    ],
    correctIndex: 0,
    explanation: {
      vi: 'Cột T\'kơơr là nơi gửi gắm ước vọng về sự gắn kết cộng đồng, tạ ơn thần rừng và cầu mùa màng ấm no.',
      en: 'Rituals around the pole express gratitude to Mother Forest and pray for village harmony and abundant harvests.'
    },
    relatedArtifactSlug: 'tkoor-sacrifice-pillar'
  },
  // =========================================================================
  // 6. CHIÊNG ĐỒNG CƠ TU (chieng-gong-instrument)
  // =========================================================================
  {
    id: 'quiz-chieng-01',
    question: {
      vi: 'Nhạc khí bộ gõ bằng hợp kim đồng thiếc linh thiêng của người Cơ Tu được gọi là gì trong tiếng Anh?',
      en: 'What is the sacred bronze percussion instrument of the Cơ Tu people called in English?'
    },
    options: [
      'Bronze gong (Chiêng đồng)',
      'Bamboo flute (Sáo trúc)',
      'Acoustic guitar (Đàn ghita)',
      'Electronic keyboard (Đàn phím điện tử)'
    ],
    correctIndex: 0,
    explanation: {
      vi: '"Bronze gong" là chiêng đồng, báu vật gia bảo lưu truyền qua nhiều thế hệ của người Cơ Tu.',
      en: '"Bronze gong" refers to the prized metal instrument sounded during paramount rituals and celebrations.'
    },
    relatedArtifactSlug: 'chieng-gong-instrument'
  },
  {
    id: 'quiz-chieng-02',
    question: {
      vi: 'Vị trí chỏm lồi ở tâm chiêng để dùi bọc vải gõ vào phát ra âm thanh ấm áp được gọi là gì?',
      en: 'What is the raised central dome on a gong that is struck with a mallet called?'
    },
    options: [
      'Central boss / Gong boss (Núm chiêng)',
      'Gong handle',
      'Tuning peg',
      'Sound hole'
    ],
    correctIndex: 0,
    explanation: {
      vi: 'Núm chiêng ("Central boss") là điểm dày nhất tạo nên âm cơ bản trầm sâu đặc trưng.',
      en: 'The raised central boss provides acoustic depth and focus when struck by a padded mallet.'
    },
    relatedArtifactSlug: 'chieng-gong-instrument'
  },
  // =========================================================================
  // 7. ÁO NAM THỔ CẨM CƠ TU (ao-nam-cotu)
  // =========================================================================
  {
    id: 'quiz-aonam-01',
    question: {
      vi: 'Kỹ thuật dệt độc đáo nào tạo nên hoa văn nổi bật trên áo thổ cẩm nam Cơ Tu?',
      en: 'Which unique weaving technique creates the signature geometric relief on Cơ Tu men\'s brocade?'
    },
    options: [
      'In-weft seed bead insertion (Dệt luồn hạt cườm trực tiếp trên khung cửi)',
      'Machine screen printing (In lưới công nghiệp)',
      'Plastic heat transfer (Ép nhiệt decal nhựa)',
      'Chemical bleaching (Tẩy trắng hóa chất)'
    ],
    correctIndex: 0,
    explanation: {
      vi: 'Nghệ nhân Cơ Tu xỏ hạt cườm trắng trực tiếp vào sợi chỉ ngang khi đang dệt trên khung cửi thắt lưng.',
      en: 'Artisans insert white seed beads directly onto weft threads on backstrap looms.'
    },
    relatedArtifactSlug: 'ao-nam-cotu'
  },
  {
    id: 'quiz-aonam-02',
    question: {
      vi: 'Khung cửi truyền thống mà người phụ nữ vùng cao dùng hông/thắt lưng để căng sợi dệt gọi là gì?',
      en: 'What is the portable traditional loom tensioned around the weaver\'s waist called in English?'
    },
    options: [
      'Backstrap loom (Khung cửi thắt lưng)',
      'Power mechanical loom',
      'Laser cutting machine',
      'Spinning jenny'
    ],
    correctIndex: 0,
    explanation: {
      vi: '"Backstrap loom" là khung cửi luồn thắt lưng cơ động, gắn liền với phụ nữ Cơ Tu từ thuở xưa.',
      en: 'A backstrap loom uses body tension to weave dense, high-quality indigenous brocade.'
    },
    relatedArtifactSlug: 'ao-nam-cotu'
  },
  // =========================================================================
  // 8. VÁY ÁO THỔ CẨM NỮ CƠ TU (ao-nu-cotu)
  // =========================================================================
  {
    id: 'quiz-aonu-01',
    question: {
      vi: 'Hoa văn dệt cườm lượn sóng nổi tiếng trên trang phục phụ nữ Cơ Tu tượng trưng cho điều gì?',
      en: 'What do the undulating wave beadwork motifs (Zút Chơ-rơ) on Cơ Tu women\'s skirts symbolize?'
    },
    options: [
      'Mountain streams and river ripples (Dòng suối và sóng nước đại ngàn)',
      'Factory machinery gears',
      'Automobile highways',
      'Electronic circuits'
    ],
    correctIndex: 0,
    explanation: {
      vi: 'Hoa văn Zút Chơ-rơ mô phỏng dòng suối mát lành uốn lượn mang lại sự sống cho nương rẫy bản làng.',
      en: 'The ripple patterns depict the flow of mountain water nourishing highland life.'
    },
    relatedArtifactSlug: 'ao-nu-cotu'
  },
  {
    id: 'quiz-aonu-02',
    question: {
      vi: 'Chiếc váy quấn truyền thống của phụ nữ Cơ Tu được gọi là gì trong tiếng Anh?',
      en: 'What is the traditional wrap-around skirt of Cơ Tu women called in English?'
    },
    options: [
      'Wrap skirt (Váy quấn Chơ-rơ)',
      'Pleated miniskirt',
      'Denim jeans',
      'Leather trousers'
    ],
    correctIndex: 0,
    explanation: {
      vi: '"Wrap skirt" là váy quấn dài duyên dáng, lộng lẫy trong các điệu múa dâng trời Da dá.',
      en: 'Wrap skirts (Chơ-rơ) are paired with sleeveless blouses during ceremonial dances.'
    },
    relatedArtifactSlug: 'ao-nu-cotu'
  },
  // =========================================================================
  // 9. ĐIÊU KHẮC CON TÊ TÊ CƠ TU (tuong-te-te-cotu)
  // =========================================================================
  {
    id: 'quiz-tete-01',
    question: {
      vi: 'Loài động vật có lớp vảy cứng quý hiếm trong rừng già Tây Giang được tạc tượng gỗ gọi là gì trong tiếng Anh?',
      en: 'What is the scale-armored mammal portrayed in Cơ Tu folk woodcarvings called in English?'
    },
    options: [
      'Pangolin (Con tê tê)',
      'Polar bear',
      'Penguin',
      'Kangaroo'
    ],
    correctIndex: 0,
    explanation: {
      vi: '"Pangolin" là con tê tê rừng, loài thú quý gắn bó mật thiết với văn hóa bảo tồn rừng già Tây Giang.',
      en: '"Pangolin" is the keratin-scaled mammal honored in Cơ Tu folklore and folk timber sculpture.'
    },
    relatedArtifactSlug: 'tuong-te-te-cotu'
  },
  {
    id: 'quiz-tete-02',
    question: {
      vi: 'Phương pháp đẽo tạc tượng con tê tê từ một thân gỗ rừng duy nhất mà không chắp ghép được gọi là gì?',
      en: 'What is the term for sculpting an artwork from a single solid log without assembly?'
    },
    options: [
      'Monolithic carving / Single-log sculpture (Điêu khắc gỗ nguyên khối)',
      '3D plastic printing',
      'Metal welding assembly',
      'Glued cardboard model'
    ],
    correctIndex: 0,
    explanation: {
      vi: 'Nghệ nhân Cơ Tu đẽo trực tiếp từ thân cây gỗ nguyên khối ("Monolithic carving") theo thế cong tự nhiên.',
      en: 'Direct carving from a single timber trunk preserves the primal organic curvature of the wood.'
    },
    relatedArtifactSlug: 'tuong-te-te-cotu'
  }
];
