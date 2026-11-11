import { BilingualText, VocabularyItem } from '../types';

export type VocabularyThemeId =
  | 'architecture'
  | 'music_dance'
  | 'weaving_brocade'
  | 'ritual_spirit'
  | 'forest_cuisine'
  | 'tour_guiding';

export interface VocabularyThemeMeta {
  id: VocabularyThemeId;
  name: BilingualText;
  description: BilingualText;
  relatedArtifactSlug: string;
}

export interface ExtendedVocabularyItem extends VocabularyItem {
  themeId: VocabularyThemeId;
  themeName: BilingualText;
  relatedArtifactSlug: string;
  relatedArtifactName: BilingualText;
}

export const VOCABULARY_THEMES: VocabularyThemeMeta[] = [
  {
    id: 'architecture',
    name: {
      vi: 'Kiến trúc Nhà Gươl & Bản làng',
      en: 'Gươl Architecture & Village Space'
    },
    description: {
      vi: 'Thuật ngữ mô tả cấu trúc nhà Gươl, kết cấu mộng gỗ, mái lá mây và quy hoạch làng tròn Cơ Tu.',
      en: 'Terminology describing the Gươl communal house, mortise-and-tenon joinery, thatched roofs, and circular village layout.'
    },
    relatedArtifactSlug: 'guol-communal-house'
  },
  {
    id: 'music_dance',
    name: {
      vi: 'Nhạc cụ & Vũ điệu Lễ hội',
      en: 'Musical Instruments & Festival Dance'
    },
    description: {
      vi: 'Từ vựng về trống K\'tu, đàn T\'rứt, chiêng thanh la, hát lý - nói lý và điệu múa Tân Tung Da Dă.',
      en: 'Vocabulary covering the K\'tu drum, T\'rứt fiddle, gongs, sung poetry, and the Tân Tung Da Dă dance.'
    },
    relatedArtifactSlug: 'ktu-traditional-drum'
  },
  {
    id: 'weaving_brocade',
    name: {
      vi: 'Đan lát Mây tre & Dệt Thổ cẩm',
      en: 'Rattan Weaving & Brocade Craft'
    },
    description: {
      vi: 'Thuật ngữ nghề đan gùi Ba-hiêng, mâm mây, kỹ thuật dệt thổ cẩm đính cườm chì của phụ nữ Cơ Tu.',
      en: 'Terms for Ba-hiêng basketry, rattan trays, and traditional lead-beaded brocade weaving.'
    },
    relatedArtifactSlug: 'bahieng-carrying-basket'
  },
  {
    id: 'ritual_spirit',
    name: {
      vi: 'Nghi lễ, Điêu khắc & Tâm linh',
      en: 'Rituals, Carvings & Spirituality'
    },
    description: {
      vi: 'Từ vựng về cột tế T\'kơơr, lễ hội mùa màng, luật tục rừng thiêng và nghệ thuật chạm khắc gỗ.',
      en: 'Vocabulary on the T\'kơơr ceremonial pole, harvest rituals, sacred forest customary laws, and wood carving.'
    },
    relatedArtifactSlug: 'tkoor-sacrifice-pillar'
  },
  {
    id: 'forest_cuisine',
    name: {
      vi: 'Đời sống Đại ngàn & Ẩm thực',
      en: 'Mountain Forest Life & Cuisine'
    },
    description: {
      vi: 'Từ vựng về hệ sinh thái rừng Pơ-mu, Đỗ quyên, ẩm thực ống tre (cơm lam, thịt nướng Zơ-rá) và rượu Tà vạt.',
      en: 'Terms for Pơ-mu heritage forests, rhododendrons, bamboo-tube cuisine, and Tà vạt palm wine.'
    },
    relatedArtifactSlug: 'bahieng-carrying-basket'
  },
  {
    id: 'tour_guiding',
    name: {
      vi: 'Thuyết minh & Đón khách Di sản',
      en: 'Heritage Tour Guiding & Storytelling'
    },
    description: {
      vi: 'Các cụm từ tiếng Anh chuyên dụng giúp học sinh và hướng dẫn viên bản địa giới thiệu văn hóa Cơ Tu.',
      en: 'Essential English expressions for local students and guides presenting Cơ Tu heritage to international visitors.'
    },
    relatedArtifactSlug: 'guol-communal-house'
  }
];

export const VOCABULARY_BANK: ExtendedVocabularyItem[] = [
  // =========================================================================
  // 1. KIẾN TRÚC NHÀ GƯƠL & BẢN LÀNG (12 từ)
  // =========================================================================
  {
    id: 'vb-arch-01',
    term: 'Communal house (Gươl)',
    ipa: '/kəˈmjuː.nəl haʊs/',
    vietnameseMeaning: 'Nhà sinh hoạt cộng đồng (Nhà Gươl)',
    englishDefinition: 'The sacred central building of a Cơ Tu village used for meetings, rituals, and hosting guests.',
    exampleSentence: {
      en: 'The Gươl communal house stands proudly at the heart of every traditional Cơ Tu village.',
      vi: 'Ngôi nhà Gươl sinh hoạt cộng đồng sừng sững giữa trái tim của mỗi bản làng Cơ Tu truyền thống.'
    },
    isCulturalSpecific: true,
    culturalNote: 'Nhà Gươl là linh hồn của bản làng Cơ Tu tại Tây Giang.',
    themeId: 'architecture',
    themeName: { vi: 'Kiến trúc Nhà Gươl & Bản làng', en: 'Gươl Architecture & Village Space' },
    relatedArtifactSlug: 'guol-communal-house',
    relatedArtifactName: { vi: 'Nhà Gươl Truyền Thống', en: 'Traditional Gươl Communal House' }
  },
  {
    id: 'vb-arch-02',
    term: 'Central sacred pillar',
    ipa: '/ˈsen.trəl ˈseɪ.krɪd ˈpɪl.ər/',
    vietnameseMeaning: 'Cột cái trung tâm (Cột thiêng)',
    englishDefinition: 'The main load-bearing timber trunk supporting the high conical roof of the Gươl house.',
    exampleSentence: {
      en: 'The central sacred pillar is carved from a single ancient tree trunk from the Trường Sơn forest.',
      vi: 'Cây cột cái trung tâm được chế tác từ một thân gỗ cổ thụ nguyên khối của rừng Trường Sơn.'
    },
    themeId: 'architecture',
    themeName: { vi: 'Kiến trúc Nhà Gươl & Bản làng', en: 'Gươl Architecture & Village Space' },
    relatedArtifactSlug: 'guol-communal-house',
    relatedArtifactName: { vi: 'Nhà Gươl Truyền Thống', en: 'Traditional Gươl Communal House' }
  },
  {
    id: 'vb-arch-03',
    term: 'Mortise and tenon joint',
    ipa: '/ˈmɔː.tɪs ænd ˈten.ən dʒɔɪnt/',
    vietnameseMeaning: 'Liên kết mộng gỗ truyền thống',
    englishDefinition: 'An ancient woodworking technique joining wooden beams securely without using metal nails.',
    exampleSentence: {
      en: 'Cơ Tu master carpenters assemble the entire Gươl frame using mortise and tenon joints.',
      vi: 'Các nghệ nhân mộc Cơ Tu lắp dựng toàn bộ khung nhà Gươl bằng liên kết mộng gỗ.'
    },
    themeId: 'architecture',
    themeName: { vi: 'Kiến trúc Nhà Gươl & Bản làng', en: 'Gươl Architecture & Village Space' },
    relatedArtifactSlug: 'guol-communal-house',
    relatedArtifactName: { vi: 'Nhà Gươl Truyền Thống', en: 'Traditional Gươl Communal House' }
  },
  {
    id: 'vb-arch-04',
    term: 'Thatched rattan roof',
    ipa: '/θætʃt ˈræt.æn ruːf/',
    vietnameseMeaning: 'Mái lợp lá mây / lá cọ rừng',
    englishDefinition: 'A dense, steeply pitched roof woven from dried rattan or palm leaves to shed mountain rain.',
    exampleSentence: {
      en: 'The thick thatched rattan roof keeps the Gươl cool in summer and warm during misty winters.',
      vi: 'Mái lợp lá mây dày giúp nhà Gươl mát mẻ vào mùa hè và ấm áp trong mùa đông sương núi.'
    },
    themeId: 'architecture',
    themeName: { vi: 'Kiến trúc Nhà Gươl & Bản làng', en: 'Gươl Architecture & Village Space' },
    relatedArtifactSlug: 'guol-communal-house',
    relatedArtifactName: { vi: 'Nhà Gươl Truyền Thống', en: 'Traditional Gươl Communal House' }
  },
  {
    id: 'vb-arch-05',
    term: 'Stilt architecture',
    ipa: '/stɪlt ˈɑː.kɪ.tek.tʃər/',
    vietnameseMeaning: 'Kiến trúc nhà sàn',
    englishDefinition: 'Buildings raised on wooden piles above the ground for ventilation and protection from wild animals.',
    exampleSentence: {
      en: 'Stilt architecture protects highland homes from damp soil and flash floods.',
      vi: 'Kiến trúc nhà sàn giúp bảo vệ ngôi nhà vùng cao khỏi hơi ẩm mặt đất và lũ quét.'
    },
    themeId: 'architecture',
    themeName: { vi: 'Kiến trúc Nhà Gươl & Bản làng', en: 'Gươl Architecture & Village Space' },
    relatedArtifactSlug: 'guol-communal-house',
    relatedArtifactName: { vi: 'Nhà Gươl Truyền Thống', en: 'Traditional Gươl Communal House' }
  },
  {
    id: 'vb-arch-06',
    term: 'Circular village layout',
    ipa: '/ˈsɜː.kjə.lər ˈvɪl.ɪdʒ ˈleɪ.aʊt/',
    vietnameseMeaning: 'Quy hoạch bản làng hình tròn / elip',
    englishDefinition: 'A spatial arrangement where family houses form a protective ring around the central courtyard and Gươl.',
    exampleSentence: {
      en: 'Pơr’ning village preserves the classic circular village layout of the Cơ Tu people.',
      vi: 'Làng cổ Pơr’ning bảo tồn nguyên vẹn quy hoạch bản làng hình tròn kinh điển của người Cơ Tu.'
    },
    themeId: 'architecture',
    themeName: { vi: 'Kiến trúc Nhà Gươl & Bản làng', en: 'Gươl Architecture & Village Space' },
    relatedArtifactSlug: 'guol-communal-house',
    relatedArtifactName: { vi: 'Nhà Gươl Truyền Thống', en: 'Traditional Gươl Communal House' }
  },
  {
    id: 'vb-arch-07',
    term: 'Conical steep roof',
    ipa: '/ˈkɒn.ɪ.kəl stiːp ruːf/',
    vietnameseMeaning: 'Mái nhọn vươn cao hình nón / trái xoài',
    englishDefinition: 'A tall, pointed roof profile resembling a mango or mountain peak reaching toward the sky.',
    exampleSentence: {
      en: 'The conical steep roof of the Gươl is topped with carvings of the sacred ಕೆ-lang bird.',
      vi: 'Phần mái nhọn vươn cao của nhà Gươl được gắn tượng chim Kơ-lang thiêng trên đỉnh.'
    },
    themeId: 'architecture',
    themeName: { vi: 'Kiến trúc Nhà Gươl & Bản làng', en: 'Gươl Architecture & Village Space' },
    relatedArtifactSlug: 'guol-communal-house',
    relatedArtifactName: { vi: 'Nhà Gươl Truyền Thống', en: 'Traditional Gươl Communal House' }
  },
  {
    id: 'vb-arch-08',
    term: 'Split-bamboo floor',
    ipa: '/splɪt bæmˈbuː flɔːr/',
    vietnameseMeaning: 'Sàn lát nứa / tre đập dập',
    englishDefinition: 'Elastic flooring made from flattened bamboo culms woven over wooden floor joists.',
    exampleSentence: {
      en: 'Elders sit around the hearth on the smooth split-bamboo floor of the Gươl.',
      vi: 'Các bậc già làng ngồi quây quần bên bếp lửa trên mặt sàn tre nứa đập dập nhẵn bóng.'
    },
    themeId: 'architecture',
    themeName: { vi: 'Kiến trúc Nhà Gươl & Bản làng', en: 'Gươl Architecture & Village Space' },
    relatedArtifactSlug: 'guol-communal-house',
    relatedArtifactName: { vi: 'Nhà Gươl Truyền Thống', en: 'Traditional Gươl Communal House' }
  },
  {
    id: 'vb-arch-09',
    term: 'Sacred hearth',
    ipa: '/ˈseɪ.krɪd hɑːθ/',
    vietnameseMeaning: 'Bếp lửa thiêng trong nhà Gươl',
    englishDefinition: 'The indoor fireplace kept burning in the communal house as a symbol of warmth and unity.',
    exampleSentence: {
      en: 'Around the sacred hearth, village elders pass down ancient legends to the youth.',
      vi: 'Bên bếp lửa thiêng, các già làng truyền dạy những truyền thuyết cổ xưa cho thế hệ trẻ.'
    },
    themeId: 'architecture',
    themeName: { vi: 'Kiến trúc Nhà Gươl & Bản làng', en: 'Gươl Architecture & Village Space' },
    relatedArtifactSlug: 'guol-communal-house',
    relatedArtifactName: { vi: 'Nhà Gươl Truyền Thống', en: 'Traditional Gươl Communal House' }
  },
  {
    id: 'vb-arch-10',
    term: 'Notched log staircase',
    ipa: '/nɒtʃt lɒɡ ˈsteə.keɪs/',
    vietnameseMeaning: 'Cầu thang gỗ đẽo bậc',
    englishDefinition: 'A single tree trunk carved with stepping notches leading up to the entrance of a stilt house.',
    exampleSentence: {
      en: 'Visitors climb the notched log staircase to enter the communal space.',
      vi: 'Du khách bước lên chiếc cầu thang gỗ đẽo bậc nguyên khối để tiến vào không gian nhà Gươl.'
    },
    themeId: 'architecture',
    themeName: { vi: 'Kiến trúc Nhà Gươl & Bản làng', en: 'Gươl Architecture & Village Space' },
    relatedArtifactSlug: 'guol-communal-house',
    relatedArtifactName: { vi: 'Nhà Gươl Truyền Thống', en: 'Traditional Gươl Communal House' }
  },
  {
    id: 'vb-arch-11',
    term: 'Rattan lashing',
    ipa: '/ˈræt.æn ˈlæʃ.ɪŋ/',
    vietnameseMeaning: 'Dây mây chằng buộc kết cấu',
    englishDefinition: 'Tough, flexible rattan strips used to bind rafters, purlins, and thatch tightly together.',
    exampleSentence: {
      en: 'Every roof beam is fastened with durable rattan lashing instead of steel wire.',
      vi: 'Mỗi thanh đòn tay mái đều được buộc chặt bằng dây mây rừng dẻo dai thay vì dây thép.'
    },
    themeId: 'architecture',
    themeName: { vi: 'Kiến trúc Nhà Gươl & Bản làng', en: 'Gươl Architecture & Village Space' },
    relatedArtifactSlug: 'guol-communal-house',
    relatedArtifactName: { vi: 'Nhà Gươl Truyền Thống', en: 'Traditional Gươl Communal House' }
  },
  {
    id: 'vb-arch-12',
    term: 'Bas-relief wood panel',
    ipa: '/ˈbæ.rɪ.liːf wʊd ˈpæn.əl/',
    vietnameseMeaning: 'Phù điêu gỗ chạm nổi',
    englishDefinition: 'Wooden wall planks or beams sculpted with raised figures of dancers, buffaloes, and forest animals.',
    exampleSentence: {
      en: 'Each bas-relief wood panel inside the Gươl narrates daily life in the Trường Sơn mountains.',
      vi: 'Mỗi bức phù điêu gỗ chạm nổi trong nhà Gươl kể lại đời sống sinh hoạt nơi đại ngàn Trường Sơn.'
    },
    themeId: 'architecture',
    themeName: { vi: 'Kiến trúc Nhà Gươl & Bản làng', en: 'Gươl Architecture & Village Space' },
    relatedArtifactSlug: 'guol-communal-house',
    relatedArtifactName: { vi: 'Nhà Gươl Truyền Thống', en: 'Traditional Gươl Communal House' }
  },

  // =========================================================================
  // 2. NHẠC CỤ & VŨ ĐIỆU LỄ HỘI (11 từ)
  // =========================================================================
  {
    id: 'vb-music-01',
    term: 'Double-headed drum (K\'tu drum)',
    ipa: '/ˈdʌb.əl ˈhed.ɪd drʌm/',
    vietnameseMeaning: 'Trống hai mặt (Trống K\'tu)',
    englishDefinition: 'A traditional percussion instrument with animal hide stretched across both ends of a hollowed log.',
    exampleSentence: {
      en: 'The resonant beat of the double-headed drum echoes across the mountain valley.',
      vi: 'Nhịp trống hai mặt K\'tu trầm hùng vang vọng khắp thung lũng núi rừng.'
    },
    isCulturalSpecific: true,
    themeId: 'music_dance',
    themeName: { vi: 'Nhạc cụ & Vũ điệu Lễ hội', en: 'Musical Instruments & Festival Dance' },
    relatedArtifactSlug: 'ktu-traditional-drum',
    relatedArtifactName: { vi: 'Trống K\'tu Truyền Thống', en: 'Traditional K\'tu Drum' }
  },
  {
    id: 'vb-music-02',
    term: 'Hollowed wooden body',
    ipa: '/ˈhɒl.əʊd ˈwʊd.ən ˈbɒd.i/',
    vietnameseMeaning: 'Tang trống đục rỗng nguyên khối',
    englishDefinition: 'A resonant drum shell carved from a single solid trunk of jackfruit or forest hardwood.',
    exampleSentence: {
      en: 'Carving a hollowed wooden body requires weeks of patient craftsmanship.',
      vi: 'Việc đục rỗng thân gỗ nguyên khối làm tang trống đòi hỏi hàng tuần lễ tỉ mỉ của nghệ nhân.'
    },
    themeId: 'music_dance',
    themeName: { vi: 'Nhạc cụ & Vũ điệu Lễ hội', en: 'Musical Instruments & Festival Dance' },
    relatedArtifactSlug: 'ktu-traditional-drum',
    relatedArtifactName: { vi: 'Trống K\'tu Truyền Thống', en: 'Traditional K\'tu Drum' }
  },
  {
    id: 'vb-music-03',
    term: 'Tuned hide membrane',
    ipa: '/tjuːnd haɪd ˈmem.breɪn/',
    vietnameseMeaning: 'Mặt trống căng da trâu / da sơn dương',
    englishDefinition: 'Treated animal skin stretched tightly over the drum opening using rattan cords and wooden wedges.',
    exampleSentence: {
      en: 'Artisans warm the tuned hide membrane near the fire before a festival performance.',
      vi: 'Nghệ nhân hơ ấm mặt da trống bên bếp lửa trước khi biểu diễn lễ hội để âm thanh vang chuẩn.'
    },
    themeId: 'music_dance',
    themeName: { vi: 'Nhạc cụ & Vũ điệu Lễ hội', en: 'Musical Instruments & Festival Dance' },
    relatedArtifactSlug: 'ktu-traditional-drum',
    relatedArtifactName: { vi: 'Trống K\'tu Truyền Thống', en: 'Traditional K\'tu Drum' }
  },
  {
    id: 'vb-music-04',
    term: 'Two-stringed bowed fiddle (T\'rứt)',
    ipa: '/tuː strɪŋd bəʊd ˈfɪd.əl/',
    vietnameseMeaning: 'Đàn nhị hai dây (Đàn T\'rứt)',
    englishDefinition: 'A traditional Cơ Tu bowed string instrument featuring a bamboo neck and gourd resonator.',
    exampleSentence: {
      en: 'The two-stringed bowed fiddle imitates the melodic singing of forest birds.',
      vi: 'Tiếng đàn kéo hai dây T\'rứt mô phỏng tiếng chim rừng hót líu lo buổi sớm.'
    },
    isCulturalSpecific: true,
    themeId: 'music_dance',
    themeName: { vi: 'Nhạc cụ & Vũ điệu Lễ hội', en: 'Musical Instruments & Festival Dance' },
    relatedArtifactSlug: 'trut-traditional-instrument',
    relatedArtifactName: { vi: 'Đàn T\'rứt Dân Gian', en: 'Traditional T\'rứt Fiddle' }
  },
  {
    id: 'vb-music-05',
    term: 'Resonating gourd chamber',
    ipa: '/ˈrez.ə.neɪ.tɪŋ ɡʊəd ˈtʃeɪm.bər/',
    vietnameseMeaning: 'Bầu cộng hưởng bằng vỏ bầu khô / gáo dừa',
    englishDefinition: 'A hollow dried calabash or coconut shell that amplifies the vibration of the strings.',
    exampleSentence: {
      en: 'A dried calabash forms the warm, lyrical resonating gourd chamber of the T\'rứt fiddle.',
      vi: 'Một quả bầu khô tạo nên hộp cộng hưởng âm thanh ấm áp và trữ tình của cây đàn T\'rứt.'
    },
    themeId: 'music_dance',
    themeName: { vi: 'Nhạc cụ & Vũ điệu Lễ hội', en: 'Musical Instruments & Festival Dance' },
    relatedArtifactSlug: 'trut-traditional-instrument',
    relatedArtifactName: { vi: 'Đàn T\'rứt Dân Gian', en: 'Traditional T\'rứt Fiddle' }
  },
  {
    id: 'vb-music-06',
    term: 'Tân Tung Da Dă ritual dance',
    ipa: '/tʌn tʊŋ dɑː dʌ ˈrɪtʃ.u.əl dɑːns/',
    vietnameseMeaning: 'Điệu múa dâng trời đất Tân Tung Da Dă',
    englishDefinition: 'The iconic collective dance of the Cơ Tu where men perform powerful warrior steps (Tân Tung) and women raise graceful arms to the sky (Da Dă).',
    exampleSentence: {
      en: 'Everyone joins the circle for the Tân Tung Da Dă ritual dance around the ceremonial pole.',
      vi: 'Mọi người cùng hòa vào vòng tròn điệu múa Tân Tung Da Dă quanh cây cột tế lễ.'
    },
    isCulturalSpecific: true,
    culturalNote: 'Di sản văn hóa phi vật thể quốc gia của đồng bào Cơ Tu.',
    themeId: 'music_dance',
    themeName: { vi: 'Nhạc cụ & Vũ điệu Lễ hội', en: 'Musical Instruments & Festival Dance' },
    relatedArtifactSlug: 'ktu-traditional-drum',
    relatedArtifactName: { vi: 'Trống K\'tu Truyền Thống', en: 'Traditional K\'tu Drum' }
  },
  {
    id: 'vb-music-07',
    term: 'Bronze gong ensemble',
    ipa: '/brɒnz ɡɒŋ ɒnˈsɒm.bəl/',
    vietnameseMeaning: 'Dàn chiêng đồng & thanh la',
    englishDefinition: 'A set of flat and bossed bronze gongs played in interlocking rhythms with the K\'tu drum.',
    exampleSentence: {
      en: 'The bronze gong ensemble creates a vibrant polyrhythmic pulse during village celebrations.',
      vi: 'Dàn chiêng đồng tạo nên nhịp điệu đa âm rộn rã trong các ngày hội lớn của bản làng.'
    },
    themeId: 'music_dance',
    themeName: { vi: 'Nhạc cụ & Vũ điệu Lễ hội', en: 'Musical Instruments & Festival Dance' },
    relatedArtifactSlug: 'ktu-traditional-drum',
    relatedArtifactName: { vi: 'Trống K\'tu Truyền Thống', en: 'Traditional K\'tu Drum' }
  },
  {
    id: 'vb-music-08',
    term: 'Abelhorn wind flute',
    ipa: '/ˈeɪ.bəl.hɔːn wɪnd fluːt/',
    vietnameseMeaning: 'Kèn sừng trâu / Sáo trúc Cơ Tu',
    englishDefinition: 'Traditional aerophones blown during forest marches and communal festivities.',
    exampleSentence: {
      en: 'Young musicians play bamboo flutes alongside the T\'rứt fiddle on moonlit nights.',
      vi: 'Những chàng trai bản làng thổi sáo trúc hòa tấu cùng đàn T\'rứt trong đêm trăng sáng.'
    },
    themeId: 'music_dance',
    themeName: { vi: 'Nhạc cụ & Vũ điệu Lễ hội', en: 'Musical Instruments & Festival Dance' },
    relatedArtifactSlug: 'trut-traditional-instrument',
    relatedArtifactName: { vi: 'Đàn T\'rứt Dân Gian', en: 'Traditional T\'rứt Fiddle' }
  },
  {
    id: 'vb-music-09',
    term: 'Sung poetry & diplomatic verse (Nói lý - Hát lý)',
    ipa: '/sʌŋ ˈpəʊ.ɪ.tri/',
    vietnameseMeaning: 'Nghệ thuật Nói lý - Hát lý Cơ Tu',
    englishDefinition: 'Improvised metaphorical chant and poetic dialogue used to resolve disputes, court, and welcome honored guests.',
    exampleSentence: {
      en: 'Nói lý - Hát lý sung poetry reflects the deep wisdom and eloquence of Cơ Tu elders.',
      vi: 'Nghệ thuật Nói lý - Hát lý phản ánh trí tuệ sâu sắc và tài ứng đối giàu hình ảnh của người Cơ Tu.'
    },
    isCulturalSpecific: true,
    culturalNote: 'Di sản văn hóa phi vật thể quốc gia đặc sắc của người Cơ Tu.',
    themeId: 'music_dance',
    themeName: { vi: 'Nhạc cụ & Vũ điệu Lễ hội', en: 'Musical Instruments & Festival Dance' },
    relatedArtifactSlug: 'trut-traditional-instrument',
    relatedArtifactName: { vi: 'Đàn T\'rứt Dân Gian', en: 'Traditional T\'rứt Fiddle' }
  },
  {
    id: 'vb-music-10',
    term: 'Pentatonic folk melody',
    ipa: '/ˌpen.təˈtɒn.ɪk fəʊk ˈmel.ə.di/',
    vietnameseMeaning: 'Giai điệu ngũ cung dân gian',
    englishDefinition: 'A five-note musical scale characteristic of ancient highland melodies.',
    exampleSentence: {
      en: 'The pentatonic folk melody of the T\'rứt evokes the rustling wind and mountain streams.',
      vi: 'Giai điệu ngũ cung dân gian của đàn T\'rứt gợi lên tiếng gió ngàn và tiếng suối reo.'
    },
    themeId: 'music_dance',
    themeName: { vi: 'Nhạc cụ & Vũ điệu Lễ hội', en: 'Musical Instruments & Festival Dance' },
    relatedArtifactSlug: 'trut-traditional-instrument',
    relatedArtifactName: { vi: 'Đàn T\'rứt Dân Gian', en: 'Traditional T\'rứt Fiddle' }
  },
  {
    id: 'vb-music-11',
    term: 'Rattan tension wedges',
    ipa: '/ˈræt.æn ˈten.ʃən ˈwedʒ.ɪz/',
    vietnameseMeaning: 'Nêm gỗ và dây mây căng mặt trống',
    englishDefinition: 'Wooden pegs driven under braided rattan straps around the drum waist to tighten the drumhead.',
    exampleSentence: {
      en: 'By tapping the rattan tension wedges, the drummer raises the pitch of the K\'tu drum.',
      vi: 'Bằng cách gõ chỉnh các con nêm gỗ dưới đai mây, nghệ nhân nâng cao độ âm thanh của trống K\'tu.'
    },
    themeId: 'music_dance',
    themeName: { vi: 'Nhạc cụ & Vũ điệu Lễ hội', en: 'Musical Instruments & Festival Dance' },
    relatedArtifactSlug: 'ktu-traditional-drum',
    relatedArtifactName: { vi: 'Trống K\'tu Truyền Thống', en: 'Traditional K\'tu Drum' }
  },

  // =========================================================================
  // 3. ĐAN LÁT MÂY TRE & DỆT THỔ CẨM (11 từ)
  // =========================================================================
  {
    id: 'vb-weave-01',
    term: 'Woven back-basket (Ba-hiêng / Zơ-gùi)',
    ipa: '/ˈwəʊ.vən bæk ˈbɑː.skɪt/',
    vietnameseMeaning: 'Chiếc gùi đeo vai đan mây tre (Gùi Ba-hiêng)',
    englishDefinition: 'A sturdy handmade basket carried on the back with two shoulder straps for transporting harvest and goods.',
    exampleSentence: {
      en: 'Every Cơ Tu family treasures a finely crafted woven back-basket for festivals and daily work.',
      vi: 'Mỗi gia đình Cơ Tu đều trân quý những chiếc gùi đan mây tre tinh xảo dùng trong lễ hội và lao động.'
    },
    isCulturalSpecific: true,
    themeId: 'weaving_brocade',
    themeName: { vi: 'Đan lát Mây tre & Dệt Thổ cẩm', en: 'Rattan Weaving & Brocade Craft' },
    relatedArtifactSlug: 'bahieng-carrying-basket',
    relatedArtifactName: { vi: 'Gùi Ba-hiêng Cơ Tu', en: 'Ba-hieng Woven Back-Basket' }
  },
  {
    id: 'vb-weave-02',
    term: 'Split rattan & bamboo strips',
    ipa: '/splɪt ˈræt.æn ænd bæmˈbuː strɪps/',
    vietnameseMeaning: 'Nan mây và nan tre vót mỏng',
    englishDefinition: 'Thinly shaved, flexible strands of forest rattan and aged bamboo prepared for basketry.',
    exampleSentence: {
      en: 'Artisans smoke the split rattan and bamboo strips over the kitchen hearth to prevent woodworm.',
      vi: 'Nghệ nhân gác các nan mây và nan tre vót mỏng lên gác bếp hun khói để chống mối mọt.'
    },
    themeId: 'weaving_brocade',
    themeName: { vi: 'Đan lát Mây tre & Dệt Thổ cẩm', en: 'Rattan Weaving & Brocade Craft' },
    relatedArtifactSlug: 'bahieng-carrying-basket',
    relatedArtifactName: { vi: 'Gùi Ba-hiêng Cơ Tu', en: 'Ba-hieng Woven Back-Basket' }
  },
  {
    id: 'vb-weave-03',
    term: 'Herringbone twill weave',
    ipa: '/ˈher.ɪŋ.bəʊn twɪl wiːv/',
    vietnameseMeaning: 'Kỹ thuật đan xương cá / đan nong mốt, nong đôi',
    englishDefinition: 'An interlocking diagonal weaving pattern that creates V-shaped geometric motifs and high durability.',
    exampleSentence: {
      en: 'The herringbone twill weave gives the Ba-hiêng basket both strength and visual rhythm.',
      vi: 'Kỹ thuật đan xương cá tạo cho chiếc gùi Ba-hiêng cả độ bền chắc lẫn nhịp điệu hoa văn đẹp mắt.'
    },
    themeId: 'weaving_brocade',
    themeName: { vi: 'Đan lát Mây tre & Dệt Thổ cẩm', en: 'Rattan Weaving & Brocade Craft' },
    relatedArtifactSlug: 'bahieng-carrying-basket',
    relatedArtifactName: { vi: 'Gùi Ba-hiêng Cơ Tu', en: 'Ba-hieng Woven Back-Basket' }
  },
  {
    id: 'vb-weave-04',
    term: 'Three-compartment lid basket (Gùi Pơ-rông)',
    ipa: '/θriː kəmˈpɑːt.mənt lɪd ˈbɑː.skɪt/',
    vietnameseMeaning: 'Gùi ba ngăn có nắp đậy (Gùi quý đựng trang sức, thổ cẩm)',
    englishDefinition: 'An ornate, lidded rattan basket divided into compartments to store wedding brocades and family heirlooms.',
    exampleSentence: {
      en: 'The three-compartment lid basket is a prized dowry gift in traditional Cơ Tu weddings.',
      vi: 'Chiếc gùi ba ngăn có nắp là món quà hồi môn trân quý trong lễ cưới truyền thống của người Cơ Tu.'
    },
    isCulturalSpecific: true,
    themeId: 'weaving_brocade',
    themeName: { vi: 'Đan lát Mây tre & Dệt Thổ cẩm', en: 'Rattan Weaving & Brocade Craft' },
    relatedArtifactSlug: 'bahieng-carrying-basket',
    relatedArtifactName: { vi: 'Gùi Ba-hiêng Cơ Tu', en: 'Ba-hieng Woven Back-Basket' }
  },
  {
    id: 'vb-weave-05',
    term: 'Backstrap loom',
    ipa: '/ˈbæk.stræp luːm/',
    vietnameseMeaning: 'Khung dệt thổ cẩm đeo lưng (Khung dệt chân đạp)',
    englishDefinition: 'A portable traditional weaving loom tensioned by a strap around the weaver’s lower back and outstretched feet.',
    exampleSentence: {
      en: 'Cơ Tu women sit on the porch weaving intricate brocade on a traditional backstrap loom.',
      vi: 'Phụ nữ Cơ Tu ngồi bên hiên nhà dệt những tấm thổ cẩm tinh xảo trên khung dệt truyền thống.'
    },
    themeId: 'weaving_brocade',
    themeName: { vi: 'Đan lát Mây tre & Dệt Thổ cẩm', en: 'Rattan Weaving & Brocade Craft' },
    relatedArtifactSlug: 'bahieng-carrying-basket',
    relatedArtifactName: { vi: 'Gùi Ba-hiêng Cơ Tu', en: 'Ba-hieng Woven Back-Basket' }
  },
  {
    id: 'vb-weave-06',
    term: 'Lead-beaded brocade (Thổ cẩm đính cườm chì)',
    ipa: '/led ˈbiː.dɪd brəˈkeɪd/',
    vietnameseMeaning: 'Thổ cẩm dệt đính hạt cườm trắng / cườm chì',
    englishDefinition: 'Signature dark indigo cotton textile of the Cơ Tu people where white glass or lead beads are woven directly into the warp and weft.',
    exampleSentence: {
      en: 'Unlike embroidery sewn afterward, Cơ Tu lead-beaded brocade interweaves beads directly on the loom.',
      vi: 'Khác với thêu đính sau khi dệt, thổ cẩm Cơ Tu luồn và dệt trực tiếp từng hạt cườm ngay trên khung cửi.'
    },
    isCulturalSpecific: true,
    culturalNote: 'Kỹ thuật dệt chèn hạt cườm trực tiếp vào sợi dọc/ngang là nét độc đáo riêng có của thổ cẩm Cơ Tu.',
    themeId: 'weaving_brocade',
    themeName: { vi: 'Đan lát Mây tre & Dệt Thổ cẩm', en: 'Rattan Weaving & Brocade Craft' },
    relatedArtifactSlug: 'bahieng-carrying-basket',
    relatedArtifactName: { vi: 'Gùi Ba-hiêng Cơ Tu', en: 'Ba-hieng Woven Back-Basket' }
  },
  {
    id: 'vb-weave-07',
    term: 'Natural indigo dye (Màu chàm tự nhiên)',
    ipa: '/ˈnætʃ.ər.əl ˈɪn.dɪ.ɡəʊ daɪ/',
    vietnameseMeaning: 'Thuốc nhuộm chàm đen từ lá cây rừng',
    englishDefinition: 'Deep blue-black organic dye extracted from fermented forest indigo leaves.',
    exampleSentence: {
      en: 'Cotton threads are soaked repeatedly in natural indigo dye to achieve a rich midnight hue.',
      vi: 'Sợi bông được ngâm nhuộm nhiều lần trong nước chàm tự nhiên để lên màu đen ánh xanh bền đẹp.'
    },
    themeId: 'weaving_brocade',
    themeName: { vi: 'Đan lát Mây tre & Dệt Thổ cẩm', en: 'Rattan Weaving & Brocade Craft' },
    relatedArtifactSlug: 'bahieng-carrying-basket',
    relatedArtifactName: { vi: 'Gùi Ba-hiêng Cơ Tu', en: 'Ba-hieng Woven Back-Basket' }
  },
  {
    id: 'vb-weave-08',
    term: 'Braided shoulder straps',
    ipa: '/ˈbreɪ.dɪd ˈʃəʊl.dər stræps/',
    vietnameseMeaning: 'Quai đeo gùi bện dây mây êm chắc',
    englishDefinition: 'Pliant, tightly braided rattan bands attached to the basket base and rim to distribute weight across the shoulders.',
    exampleSentence: {
      en: 'Wide braided shoulder straps allow villagers to carry heavy loads comfortably up steep trails.',
      vi: 'Đôi quai đeo bện dây mây bản rộng giúp người dân gùi nặng leo dốc núi mà vẫn êm vai.'
    },
    themeId: 'weaving_brocade',
    themeName: { vi: 'Đan lát Mây tre & Dệt Thổ cẩm', en: 'Rattan Weaving & Brocade Craft' },
    relatedArtifactSlug: 'bahieng-carrying-basket',
    relatedArtifactName: { vi: 'Gùi Ba-hiêng Cơ Tu', en: 'Ba-hieng Woven Back-Basket' }
  },
  {
    id: 'vb-weave-09',
    term: 'Woven rattan dining tray (Mâm mây Tơ-rơng)',
    ipa: '/ˈwəʊ.vən ˈræt.æn ˈdaɪ.nɪŋ treɪ/',
    vietnameseMeaning: 'Mâm đan mây truyền thống',
    englishDefinition: 'A footed circular platter woven from aged rattan used to serve traditional mountain feasts.',
    exampleSentence: {
      en: 'Steaming bamboo rice and grilled meats are arranged on a woven rattan dining tray.',
      vi: 'Cơm lam nóng hổi và thịt nướng ống tre được bày biện trang trọng trên chiếc mâm đan mây.'
    },
    themeId: 'weaving_brocade',
    themeName: { vi: 'Đan lát Mây tre & Dệt Thổ cẩm', en: 'Rattan Weaving & Brocade Craft' },
    relatedArtifactSlug: 'bahieng-carrying-basket',
    relatedArtifactName: { vi: 'Gùi Ba-hiêng Cơ Tu', en: 'Ba-hieng Woven Back-Basket' }
  },
  {
    id: 'vb-weave-10',
    term: 'Carved wooden base pedestal',
    ipa: '/kɑːvd ˈwʊd.ən beɪs ˈped.ɪ.stəl/',
    vietnameseMeaning: 'Đế gùi đẽo bằng gỗ nhẹ bền chắc',
    englishDefinition: 'A square or flaring wooden block fitted at the bottom of a back-basket so it stands upright on mountain slopes.',
    exampleSentence: {
      en: 'The carved wooden base pedestal keeps the basket dry when set down on forest ground.',
      vi: 'Phần đế đẽo bằng gỗ giúp chiếc gùi đứng vững và không bị thấm ẩm khi đặt trên nền đất rừng.'
    },
    themeId: 'weaving_brocade',
    themeName: { vi: 'Đan lát Mây tre & Dệt Thổ cẩm', en: 'Rattan Weaving & Brocade Craft' },
    relatedArtifactSlug: 'bahieng-carrying-basket',
    relatedArtifactName: { vi: 'Gùi Ba-hiêng Cơ Tu', en: 'Ba-hieng Woven Back-Basket' }
  },
  {
    id: 'vb-weave-11',
    term: 'Diamond & star geometric motifs',
    ipa: '/ˈdaɪə.mənd ænd stɑː ˌdʒiː.əˈmet.rɪk məʊˈtiːfs/',
    vietnameseMeaning: 'Hoa văn hình học quả trám và sao tám cánh',
    englishDefinition: 'Symmetrical patterns symbolizing harmony between heaven, earth, and human beings in Cơ Tu art.',
    exampleSentence: {
      en: 'Diamond and star geometric motifs appear on both woven baskets and ceremonial textiles.',
      vi: 'Hoa văn quả trám và sao tám cánh xuất hiện xuyên suốt trên cả đồ đan mây tre lẫn thổ cẩm lễ hội.'
    },
    themeId: 'weaving_brocade',
    themeName: { vi: 'Đan lát Mây tre & Dệt Thổ cẩm', en: 'Rattan Weaving & Brocade Craft' },
    relatedArtifactSlug: 'bahieng-carrying-basket',
    relatedArtifactName: { vi: 'Gùi Ba-hiêng Cơ Tu', en: 'Ba-hieng Woven Back-Basket' }
  },

  // =========================================================================
  // 4. NGHI LỄ, ĐIÊU KHẮC & TÂM LINH (10 từ)
  // =========================================================================
  {
    id: 'vb-ritual-01',
    term: 'Ceremonial pole (Xơ-nur / T\'kơơr)',
    ipa: '/ˌser.ɪˈməʊ.ni.əl pəʊl/',
    vietnameseMeaning: 'Cột tế lễ chạm khắc (Cây nêu Xơ-nur / T\'kơơr)',
    englishDefinition: 'A richly carved wooden totem pole erected in the center of the village courtyard before the Gươl house.',
    exampleSentence: {
      en: 'The ceremonial pole connects the earthly village with the spiritual realm of the sky.',
      vi: 'Cây cột tế lễ T\'kơơr là trục thiêng kết nối bản làng mặt đất với cõi thần linh trên bầu trời.'
    },
    isCulturalSpecific: true,
    themeId: 'ritual_spirit',
    themeName: { vi: 'Nghi lễ, Điêu khắc & Tâm linh', en: 'Rituals, Carvings & Spirituality' },
    relatedArtifactSlug: 'tkoor-sacrifice-pillar',
    relatedArtifactName: { vi: 'Cột Tế T\'kơơr', en: 'T\'kơơr Ceremonial Pole' }
  },
  {
    id: 'vb-ritual-02',
    term: 'Outstretched wooden wings',
    ipa: '/ˌaʊtˈstretʃt ˈwʊd.ən wɪŋz/',
    vietnameseMeaning: 'Đôi cánh gỗ vươn rộng trên cột tế',
    englishDefinition: 'Two symmetrical carved boards extending horizontally from the ceremonial pole, painted with tribal patterns.',
    exampleSentence: {
      en: 'The outstretched wooden wings resemble the great Kơ-lang bird soaring over the mountains.',
      vi: 'Đôi cánh gỗ vươn rộng trên cột tế tựa như cánh chim Kơ-lang đại ngàn sải bay trên đỉnh núi.'
    },
    themeId: 'ritual_spirit',
    themeName: { vi: 'Nghi lễ, Điêu khắc & Tâm linh', en: 'Rituals, Carvings & Spirituality' },
    relatedArtifactSlug: 'tkoor-sacrifice-pillar',
    relatedArtifactName: { vi: 'Cột Tế T\'kơơr', en: 'T\'kơơr Ceremonial Pole' }
  },
  {
    id: 'vb-ritual-03',
    term: 'Natural mineral & bark pigments',
    ipa: '/ˈnætʃ.ər.əl ˈmɪn.ər.əl ˈpɪɡ.mənts/',
    vietnameseMeaning: 'Màu vẽ khoáng vật và vỏ cây rừng tự nhiên',
    englishDefinition: 'Earth-toned paints made from charcoal soot (black), limestone/kaolin (white), and forest roots (red/ochre).',
    exampleSentence: {
      en: 'Sculptors decorate the T\'kơơr pole using black, white, and red natural mineral pigments.',
      vi: 'Các nghệ nhân điêu khắc tô điểm cột T\'kơơr bằng ba gam màu đen, trắng, đỏ từ khoáng vật và cây rừng.'
    },
    themeId: 'ritual_spirit',
    themeName: { vi: 'Nghi lễ, Điêu khắc & Tâm linh', en: 'Rituals, Carvings & Spirituality' },
    relatedArtifactSlug: 'tkoor-sacrifice-pillar',
    relatedArtifactName: { vi: 'Cột Tế T\'kơơr', en: 'T\'kơơr Ceremonial Pole' }
  },
  {
    id: 'vb-ritual-04',
    term: 'Sacred Kơ-lang bird totem',
    ipa: '/ˈseɪ.krɪd ˈtəʊ.təm/',
    vietnameseMeaning: 'Biểu tượng chim thiêng Kơ-lang (Đại bàng núi)',
    englishDefinition: 'The mythical king of forest birds revered by the Cơ Tu as a symbol of strength, freedom, and protection.',
    exampleSentence: {
      en: 'A carved sacred Kơ-lang bird totem crowns the apex of the Gươl roof and ceremonial pole.',
      vi: 'Tượng chim thiêng Kơ-lang được chạm khắc trên đỉnh nóc nhà Gươl và đỉnh cột tế lễ.'
    },
    isCulturalSpecific: true,
    themeId: 'ritual_spirit',
    themeName: { vi: 'Nghi lễ, Điêu khắc & Tâm linh', en: 'Rituals, Carvings & Spirituality' },
    relatedArtifactSlug: 'tkoor-sacrifice-pillar',
    relatedArtifactName: { vi: 'Cột Tế T\'kơơr', en: 'T\'kơơr Ceremonial Pole' }
  },
  {
    id: 'vb-ritual-05',
    term: 'Village elder (Già làng / Takơl)',
    ipa: '/ˈvɪl.ɪdʒ ˈel.dər/',
    vietnameseMeaning: 'Già làng — Người đứng đầu uy tín của bản',
    englishDefinition: 'The most respected community leader who safeguards customary law, presides over rituals, and guides the village.',
    exampleSentence: {
      en: 'The village elder leads the thanksgiving prayer for peace and a bountiful harvest.',
      vi: 'Vị già làng chủ trì lời khấn tạ ơn thần rừng, cầu mong bản làng bình an và mùa màng bội thu.'
    },
    themeId: 'ritual_spirit',
    themeName: { vi: 'Nghi lễ, Điêu khắc & Tâm linh', en: 'Rituals, Carvings & Spirituality' },
    relatedArtifactSlug: 'tkoor-sacrifice-pillar',
    relatedArtifactName: { vi: 'Cột Tế T\'kơơr', en: 'T\'kơơr Ceremonial Pole' }
  },
  {
    id: 'vb-ritual-06',
    term: 'New Rice Harvest Festival (Lễ mừng lúa mới)',
    ipa: '/njuː raɪs ˈhɑː.vɪst ˈfes.tɪ.vəl/',
    vietnameseMeaning: 'Lễ hội Mừng lúa mới (Cha ha roo tơme)',
    englishDefinition: 'An annual autumn thanksgiving ceremony celebrating the upland rice harvest and honoring ancestral spirits.',
    exampleSentence: {
      en: 'During the New Rice Harvest Festival, every household shares fragrant sticky rice at the Gươl.',
      vi: 'Trong lễ hội Mừng lúa mới, mọi gia đình đều mang cốm nếp thơm lên nhà Gươl cùng chung vui.'
    },
    isCulturalSpecific: true,
    themeId: 'ritual_spirit',
    themeName: { vi: 'Nghi lễ, Điêu khắc & Tâm linh', en: 'Rituals, Carvings & Spirituality' },
    relatedArtifactSlug: 'tkoor-sacrifice-pillar',
    relatedArtifactName: { vi: 'Cột Tế T\'kơơr', en: 'T\'kơơr Ceremonial Pole' }
  },
  {
    id: 'vb-ritual-07',
    term: 'Brotherhood swearing ceremony (Lễ kết nghĩa Pơ-ngoóch)',
    ipa: '/ˈbrʌð.ə.hʊd ˈsweə.rɪŋ ˈser.ɪ.mə.ni/',
    vietnameseMeaning: 'Lễ kết nghĩa anh em giữa hai bản làng (Lễ Pơ-ngoóch)',
    englishDefinition: 'A sacred peace and solidarity pact between two Cơ Tu villages pledging mutual aid for generations.',
    exampleSentence: {
      en: 'The Pơ-ngoóch brotherhood swearing ceremony binds two mountain villages as one family.',
      vi: 'Lễ kết nghĩa Pơ-ngoóch gắn kết hai bản làng vùng cao thành anh em ruột thịt suốt nhiều thế hệ.'
    },
    isCulturalSpecific: true,
    themeId: 'ritual_spirit',
    themeName: { vi: 'Nghi lễ, Điêu khắc & Tâm linh', en: 'Rituals, Carvings & Spirituality' },
    relatedArtifactSlug: 'tkoor-sacrifice-pillar',
    relatedArtifactName: { vi: 'Cột Tế T\'kơơr', en: 'T\'kơơr Ceremonial Pole' }
  },
  {
    id: 'vb-ritual-08',
    term: 'Customary law (Luật tục bản làng)',
    ipa: '/ˈkʌs.tə.mər.i lɔː/',
    vietnameseMeaning: 'Luật tục truyền thống của cộng đồng',
    englishDefinition: 'Unwritten oral norms passed down by ancestors governing social harmony and strict protection of sacred forests.',
    exampleSentence: {
      en: 'Cơ Tu customary law strictly forbids cutting ancient trees in watershed forests.',
      vi: 'Luật tục Cơ Tu nghiêm cấm việc chặt phá cây cổ thụ trong các khu rừng đầu nguồn và rừng thiêng.'
    },
    themeId: 'ritual_spirit',
    themeName: { vi: 'Nghi lễ, Điêu khắc & Tâm linh', en: 'Rituals, Carvings & Spirituality' },
    relatedArtifactSlug: 'tkoor-sacrifice-pillar',
    relatedArtifactName: { vi: 'Cột Tế T\'kơơr', en: 'T\'kơơr Ceremonial Pole' }
  },
  {
    id: 'vb-ritual-09',
    term: 'Forest Thanksgiving Ritual (Lễ Tạ ơn Rừng)',
    ipa: '/ˈfɒr.ɪst θæŋksˈɡɪv.ɪŋ ˈrɪtʃ.u.əl/',
    vietnameseMeaning: 'Lễ hội Tạ ơn Rừng đầu năm',
    englishDefinition: 'A revered ecological ceremony held in Tây Giang to express gratitude to Mother Forest for water, shelter, and life.',
    exampleSentence: {
      en: 'The Forest Thanksgiving Ritual reflects the deep ecological ethics of the Cơ Tu community.',
      vi: 'Lễ hội Tạ ơn Rừng thể hiện đạo lý sống hòa hợp và biết ơn thiên nhiên sâu sắc của đồng bào Cơ Tu.'
    },
    isCulturalSpecific: true,
    themeId: 'ritual_spirit',
    themeName: { vi: 'Nghi lễ, Điêu khắc & Tâm linh', en: 'Rituals, Carvings & Spirituality' },
    relatedArtifactSlug: 'tkoor-sacrifice-pillar',
    relatedArtifactName: { vi: 'Cột Tế T\'kơơr', en: 'T\'kơơr Ceremonial Pole' }
  },
  {
    id: 'vb-ritual-10',
    term: 'Sunburst & buffalo horn motifs',
    ipa: '/ˈsʌn.bɜːst ænd ˈbʌf.ə.ləʊ hɔːn məʊˈtiːfs/',
    vietnameseMeaning: 'Hoa văn mặt trời tỏa tia và sừng trâu',
    englishDefinition: 'Iconic sculptural symbols representing cosmic vitality, agricultural prosperity, and community strength.',
    exampleSentence: {
      en: 'Sunburst and buffalo horn motifs are carved prominently on the Gươl rafters and T\'kơơr pole.',
      vi: 'Hoa văn mặt trời và sừng trâu được chạm khắc nổi bật trên xà nhà Gươl và thân cột T\'kơơr.'
    },
    themeId: 'ritual_spirit',
    themeName: { vi: 'Nghi lễ, Điêu khắc & Tâm linh', en: 'Rituals, Carvings & Spirituality' },
    relatedArtifactSlug: 'tkoor-sacrifice-pillar',
    relatedArtifactName: { vi: 'Cột Tế T\'kơơr', en: 'T\'kơơr Ceremonial Pole' }
  },

  // =========================================================================
  // 5. ĐỜI SỐNG ĐẠI NGÀN & ẨM THỰC (10 từ)
  // =========================================================================
  {
    id: 'vb-forest-01',
    term: 'Ancient Pơ-mu heritage forest',
    ipa: '/ˈeɪn.ʃənt ˈher.ɪ.tɪdʒ ˈfɒr.ɪst/',
    vietnameseMeaning: 'Rừng di sản Pơ-mu cổ thụ Tây Giang',
    englishDefinition: 'A cloud-shrouded primeval forest of over a thousand Fujian cypress (Fokienia) trees protected by the Cơ Tu people.',
    exampleSentence: {
      en: 'Tây Giang is home to the largest ancient Pơ-mu heritage forest in Vietnam.',
      vi: 'Tây Giang là nơi sở hữu quần thể rừng di sản Pơ-mu cổ thụ lớn nhất Việt Nam.'
    },
    isCulturalSpecific: true,
    themeId: 'forest_cuisine',
    themeName: { vi: 'Đời sống Đại ngàn & Ẩm thực', en: 'Mountain Forest Life & Cuisine' },
    relatedArtifactSlug: 'guol-communal-house',
    relatedArtifactName: { vi: 'Nhà Gươl Truyền Thống', en: 'Traditional Gươl Communal House' }
  },
  {
    id: 'vb-forest-02',
    term: 'Mossy rhododendron peak',
    ipa: '/ˈmɒs.i ˌrəʊ.dəˈden.drən piːk/',
    vietnameseMeaning: 'Đỉnh rừng Đỗ quyên rêu phong (Đỉnh Quế - Tây Giang)',
    englishDefinition: 'High-altitude misty mountain peaks above 1,500 meters covered in ancient moss and blooming wild rhododendrons.',
    exampleSentence: {
      en: 'Clouds drift year-round across the mossy rhododendron peaks of Tây Giang.',
      vi: 'Mây mù giăng phủ quanh năm trên những đỉnh rừng Đỗ quyên cổ thụ rêu phong tại Tây Giang.'
    },
    themeId: 'forest_cuisine',
    themeName: { vi: 'Đời sống Đại ngàn & Ẩm thực', en: 'Mountain Forest Life & Cuisine' },
    relatedArtifactSlug: 'guol-communal-house',
    relatedArtifactName: { vi: 'Nhà Gươl Truyền Thống', en: 'Traditional Gươl Communal House' }
  },
  {
    id: 'vb-forest-03',
    term: 'Bamboo-tube sticky rice (Cơm lam / Aviết)',
    ipa: '/bæmˈbuː tjuːb ˈstɪk.i raɪs/',
    vietnameseMeaning: 'Cơm lam nướng trong ống tre non',
    englishDefinition: 'Fragrant upland glutinous rice soaked in spring water and slow-roasted inside fresh green bamboo tubes.',
    exampleSentence: {
      en: 'Peeling the charred outer layer reveals aromatic bamboo-tube sticky rice.',
      vi: 'Tách lớp vỏ nứa cháy xém bên ngoài sẽ lộ ra phần cơm lam dẻo thơm hương rừng.'
    },
    themeId: 'forest_cuisine',
    themeName: { vi: 'Đời sống Đại ngàn & Ẩm thực', en: 'Mountain Forest Life & Cuisine' },
    relatedArtifactSlug: 'bahieng-carrying-basket',
    relatedArtifactName: { vi: 'Gùi Ba-hiêng Cơ Tu', en: 'Ba-hieng Woven Back-Basket' }
  },
  {
    id: 'vb-forest-04',
    term: 'Braised meat in bamboo tube (Zơ-rá)',
    ipa: '/breɪzd miːt ɪn bæmˈbuː tjuːb/',
    vietnameseMeaning: 'Món Zơ-rá (Thịt/cá ướp gia vị rừng nướng ống tre)',
    englishDefinition: 'A signature Cơ Tu delicacy where finely chopped meat or stream fish is mixed with wild herbs and cooked inside a bamboo cylinder.',
    exampleSentence: {
      en: 'Zơ-rá braised meat in a bamboo tube is seasoned with wild mountain pepper (mắc khén / tiêu rừng).',
      vi: 'Món Zơ-rá nướng trong ống tre được ướp đượm hương vị tiêu rừng A-mất thơm nồng.'
    },
    isCulturalSpecific: true,
    themeId: 'forest_cuisine',
    themeName: { vi: 'Đời sống Đại ngàn & Ẩm thực', en: 'Mountain Forest Life & Cuisine' },
    relatedArtifactSlug: 'bahieng-carrying-basket',
    relatedArtifactName: { vi: 'Gùi Ba-hiêng Cơ Tu', en: 'Ba-hieng Woven Back-Basket' }
  },
  {
    id: 'vb-forest-05',
    term: 'Tà vạt palm wine (Rượu Tà vạt)',
    ipa: '/tɑː vɑːt pɑːm waɪn/',
    vietnameseMeaning: 'Rượu Tà vạt — Rượu men lá từ nhựa cây Tà vạt rừng',
    englishDefinition: 'A mildly sweet, effervescent natural beverage tapped from the sap of wild sugar palms and fermented with Chuồn bark.',
    exampleSentence: {
      en: 'Hosts offer a bamboo cup of Tà vạt palm wine as a warm gesture of highland hospitality.',
      vi: 'Gia chủ mời khách quý chén rượu Tà vạt ngọt dịu thơm hương núi rừng như lời chào hiếu khách.'
    },
    isCulturalSpecific: true,
    themeId: 'forest_cuisine',
    themeName: { vi: 'Đời sống Đại ngàn & Ẩm thực', en: 'Mountain Forest Life & Cuisine' },
    relatedArtifactSlug: 'bahieng-carrying-basket',
    relatedArtifactName: { vi: 'Gùi Ba-hiêng Cơ Tu', en: 'Ba-hieng Woven Back-Basket' }
  },
  {
    id: 'vb-forest-06',
    term: 'Twin-cup solidarity toast (Uống rượu cần / Rượu đôi)',
    ipa: '/twɪn kʌp ˌsɒl.ɪˈdær.ə.ti təʊst/',
    vietnameseMeaning: 'Nghi thức uống rượu chung chén kết tình anh em',
    englishDefinition: 'A traditional custom where two friends drink simultaneously cheek-to-cheek from a shared double bamboo cup.',
    exampleSentence: {
      en: 'Sharing a twin-cup solidarity toast symbolizes trust and lasting friendship among the Cơ Tu.',
      vi: 'Nghi thức uống rượu chung chén biểu trưng cho sự tin cậy và tình bằng hữu gắn bó bền chặt.'
    },
    isCulturalSpecific: true,
    themeId: 'forest_cuisine',
    themeName: { vi: 'Đời sống Đại ngàn & Ẩm thực', en: 'Mountain Forest Life & Cuisine' },
    relatedArtifactSlug: 'bahieng-carrying-basket',
    relatedArtifactName: { vi: 'Gùi Ba-hiêng Cơ Tu', en: 'Ba-hieng Woven Back-Basket' }
  },
  {
    id: 'vb-forest-07',
    term: 'Smoked buffalo horn croissant (Bánh sừng trâu A-quất)',
    ipa: '/sməʊkt ˈbʌf.ə.ləʊ hɔːn ˈkwæs.ɒ̃/',
    vietnameseMeaning: 'Bánh sừng trâu (Bánh A-quất gói lá đót)',
    englishDefinition: 'Glutinous rice cakes wrapped in forest broom-grass leaves into the shape of twin buffalo horns.',
    exampleSentence: {
      en: 'A-quất buffalo horn cakes are wrapped in fragrant forest leaves for every festive occasion.',
      vi: 'Bánh sừng trâu A-quất gói bằng lá đót rừng thơm dẻo không thể thiếu trong mỗi dịp lễ tết.'
    },
    isCulturalSpecific: true,
    themeId: 'forest_cuisine',
    themeName: { vi: 'Đời sống Đại ngàn & Ẩm thực', en: 'Mountain Forest Life & Cuisine' },
    relatedArtifactSlug: 'bahieng-carrying-basket',
    relatedArtifactName: { vi: 'Gùi Ba-hiêng Cơ Tu', en: 'Ba-hieng Woven Back-Basket' }
  },
  {
    id: 'vb-forest-08',
    term: 'Medicinal Ba Kích ginseng root',
    ipa: '/məˈdɪs.ɪ.nəl ˈdʒɪn.seŋ ruːt/',
    vietnameseMeaning: 'Sâm Ba Kích tím Tây Giang',
    englishDefinition: 'A prized purple herbal root grown beneath the forest canopy of Tây Giang, known for vitality and health benefits.',
    exampleSentence: {
      en: 'Tây Giang is famous for cultivating organic medicinal Ba Kích ginseng under the forest canopy.',
      vi: 'Tây Giang nổi tiếng với nghề trồng sâm Ba Kích tím dược liệu dưới tán rừng tự nhiên.'
    },
    themeId: 'forest_cuisine',
    themeName: { vi: 'Đời sống Đại ngàn & Ẩm thực', en: 'Mountain Forest Life & Cuisine' },
    relatedArtifactSlug: 'bahieng-carrying-basket',
    relatedArtifactName: { vi: 'Gùi Ba-hiêng Cơ Tu', en: 'Ba-hieng Woven Back-Basket' }
  },
  {
    id: 'vb-forest-09',
    term: 'Smoked hearth meat (Thịt gác bếp)',
    ipa: '/sməʊkt hɑːθ miːt/',
    vietnameseMeaning: 'Thịt hun khói gác bếp truyền thống',
    englishDefinition: 'Strips of meat cured slowly by woodsmoke above the family hearth, preserving flavor through the rainy season.',
    exampleSentence: {
      en: 'Smoked hearth meat is grilled over hot coals and served with wild cassava leaves.',
      vi: 'Thịt gác bếp được nướng lại trên than hồng và thưởng thức cùng rau sắn rừng.'
    },
    themeId: 'forest_cuisine',
    themeName: { vi: 'Đời sống Đại ngàn & Ẩm thực', en: 'Mountain Forest Life & Cuisine' },
    relatedArtifactSlug: 'bahieng-carrying-basket',
    relatedArtifactName: { vi: 'Gùi Ba-hiêng Cơ Tu', en: 'Ba-hieng Woven Back-Basket' }
  },
  {
    id: 'vb-forest-10',
    term: 'Sustainable forest stewardship',
    ipa: '/səˈsteɪ.nə.bəl ˈfɒr.ɪst ˈstjuː.əd.ʃɪp/',
    vietnameseMeaning: 'Gìn giữ và bảo vệ rừng bền vững dựa vào cộng đồng',
    englishDefinition: 'The indigenous practice of living in harmony with nature and protecting old-growth watersheds for future generations.',
    exampleSentence: {
      en: 'Community-based sustainable forest stewardship keeps Tây Giang’s mountains evergreen.',
      vi: 'Truyền thống giữ rừng bền vững của cộng đồng giúp đại ngàn Tây Giang mãi xanh tươi.'
    },
    themeId: 'forest_cuisine',
    themeName: { vi: 'Đời sống Đại ngàn & Ẩm thực', en: 'Mountain Forest Life & Cuisine' },
    relatedArtifactSlug: 'guol-communal-house',
    relatedArtifactName: { vi: 'Nhà Gươl Truyền Thống', en: 'Traditional Gươl Communal House' }
  },

  // =========================================================================
  // 6. THUYẾT MINH & ĐÓN KHÁCH DI SẢN (10 từ)
  // =========================================================================
  {
    id: 'vb-guide-01',
    term: 'Intangible cultural heritage',
    ipa: '/ɪnˈtæn.dʒə.bəl ˈkʌl.tʃər.əl ˈher.ɪ.tɪdʒ/',
    vietnameseMeaning: 'Di sản văn hóa phi vật thể',
    englishDefinition: 'Living traditions, performing arts, oral poetry, and craftsmanship inherited from ancestors.',
    exampleSentence: {
      en: 'Brocade weaving and the Tân Tung Da Dă dance are recognized as national intangible cultural heritage.',
      vi: 'Nghề dệt thổ cẩm và điệu múa Tân Tung Da Dă được công nhận là Di sản văn hóa phi vật thể quốc gia.'
    },
    themeId: 'tour_guiding',
    themeName: { vi: 'Thuyết minh & Đón khách Di sản', en: 'Heritage Tour Guiding & Storytelling' },
    relatedArtifactSlug: 'guol-communal-house',
    relatedArtifactName: { vi: 'Nhà Gươl Truyền Thống', en: 'Traditional Gươl Communal House' }
  },
  {
    id: 'vb-guide-02',
    term: 'Indigenous craftsmanship',
    ipa: '/ɪnˈdɪdʒ.ɪ.nəs ˈkrɑːfts.mən.ʃɪp/',
    vietnameseMeaning: 'Kỹ nghệ thủ công bản địa',
    englishDefinition: 'Traditional handcrafting skills developed over centuries using local forest materials.',
    exampleSentence: {
      en: 'Every artifact in this collection showcases authentic indigenous craftsmanship.',
      vi: 'Mỗi hiện vật trong bộ sưu tập này đều tôn vinh kỹ nghệ thủ công bản địa đích thực.'
    },
    themeId: 'tour_guiding',
    themeName: { vi: 'Thuyết minh & Đón khách Di sản', en: 'Heritage Tour Guiding & Storytelling' },
    relatedArtifactSlug: 'bahieng-carrying-basket',
    relatedArtifactName: { vi: 'Gùi Ba-hiêng Cơ Tu', en: 'Ba-hieng Woven Back-Basket' }
  },
  {
    id: 'vb-guide-03',
    term: 'Community-based ecotourism',
    ipa: '/kəˈmjuː.nə.ti beɪst ˈiː.kəʊˌtʊə.rɪ.zəm/',
    vietnameseMeaning: 'Du lịch sinh thái gắn với cộng đồng bản địa',
    englishDefinition: 'Responsible travel to natural areas that conserves the environment and directly benefits local villagers.',
    exampleSentence: {
      en: 'Community-based ecotourism in Tây Giang empowers youth to preserve their mother tongue and crafts.',
      vi: 'Du lịch sinh thái cộng đồng tại Tây Giang tạo động lực để thế hệ trẻ giữ gìn tiếng nói và nghề truyền thống.'
    },
    themeId: 'tour_guiding',
    themeName: { vi: 'Thuyết minh & Đón khách Di sản', en: 'Heritage Tour Guiding & Storytelling' },
    relatedArtifactSlug: 'guol-communal-house',
    relatedArtifactName: { vi: 'Nhà Gươl Truyền Thống', en: 'Traditional Gươl Communal House' }
  },
  {
    id: 'vb-guide-04',
    term: 'Augmented Reality (AR) spatial placement',
    ipa: '/ɔːɡˈmen.tɪd riˈæl.ə.ti ˈspeɪ.ʃəl ˈpleɪs.mənt/',
    vietnameseMeaning: 'Đặt mô hình Thực tế tăng cường (AR) vào không gian thật',
    englishDefinition: 'Digital technology that projects interactive 3D cultural artifacts onto the real-world floor via a smartphone camera.',
    exampleSentence: {
      en: 'With Augmented Reality spatial placement, you can inspect the Gươl roof structure right in your classroom.',
      vi: 'Với tính năng đặt mô hình AR vào không gian thật, bạn có thể quan sát kết cấu mái nhà Gươl ngay tại lớp học.'
    },
    themeId: 'tour_guiding',
    themeName: { vi: 'Thuyết minh & Đón khách Di sản', en: 'Heritage Tour Guiding & Storytelling' },
    relatedArtifactSlug: 'guol-communal-house',
    relatedArtifactName: { vi: 'Nhà Gươl Truyền Thống', en: 'Traditional Gươl Communal House' }
  },
  {
    id: 'vb-guide-05',
    term: 'Passed down through generations',
    ipa: '/pɑːst daʊn θruː ˌdʒen.əˈreɪ.ʃənz/',
    vietnameseMeaning: 'Được trao truyền qua nhiều thế hệ',
    englishDefinition: 'Knowledge, songs, or skills taught directly from grandparents and parents to their children.',
    exampleSentence: {
      en: 'The secret of tuning the K\'tu drum has been passed down through generations by ear and hand.',
      vi: 'Bí quyết chỉnh âm trống K\'tu đã được trao truyền qua nhiều thế hệ bằng đôi tai và đôi bàn tay khéo léo.'
    },
    themeId: 'tour_guiding',
    themeName: { vi: 'Thuyết minh & Đón khách Di sản', en: 'Heritage Tour Guiding & Storytelling' },
    relatedArtifactSlug: 'ktu-traditional-drum',
    relatedArtifactName: { vi: 'Trống K\'tu Truyền Thống', en: 'Traditional K\'tu Drum' }
  },
  {
    id: 'vb-guide-06',
    term: 'Symbol of community solidarity',
    ipa: '/ˈsɪm.bəl ɒv kəˈmjuː.nə.ti ˌsɒl.ɪˈdær.ə.ti/',
    vietnameseMeaning: 'Biểu tượng của tinh thần đoàn kết cộng đồng',
    englishDefinition: 'An object or space that unites all village members in shared pride and mutual support.',
    exampleSentence: {
      en: 'Building a new Gươl house together is the ultimate symbol of community solidarity.',
      vi: 'Cùng nhau dựng một ngôi nhà Gươl mới là biểu tượng cao đẹp nhất của tinh thần đoàn kết cộng đồng.'
    },
    themeId: 'tour_guiding',
    themeName: { vi: 'Thuyết minh & Đón khách Di sản', en: 'Heritage Tour Guiding & Storytelling' },
    relatedArtifactSlug: 'guol-communal-house',
    relatedArtifactName: { vi: 'Nhà Gươl Truyền Thống', en: 'Traditional Gươl Communal House' }
  },
  {
    id: 'vb-guide-07',
    term: 'Hand-carved from a single timber trunk',
    ipa: '/hænd kɑːvd frɒm ə ˈsɪŋ.ɡəl ˈtɪm.bər trʌŋk/',
    vietnameseMeaning: 'Chạm đục thủ công từ một thân gỗ nguyên khối',
    englishDefinition: 'Sculpted entirely by hand with axes and chisels out of one continuous piece of wood.',
    exampleSentence: {
      en: 'Notice how this drum body is hand-carved from a single timber trunk without any glued seams.',
      vi: 'Hãy quan sát cách phần tang trống này được đục thủ công từ một thân gỗ nguyên khối không hề chắp ghép.'
    },
    themeId: 'tour_guiding',
    themeName: { vi: 'Thuyết minh & Đón khách Di sản', en: 'Heritage Tour Guiding & Storytelling' },
    relatedArtifactSlug: 'ktu-traditional-drum',
    relatedArtifactName: { vi: 'Trống K\'tu Truyền Thống', en: 'Traditional K\'tu Drum' }
  },
  {
    id: 'vb-guide-08',
    term: 'Harmony between humanity and Mother Nature',
    ipa: '/ˈhɑː.mə.ni bɪˈtwiːn hjuːˈmæn.ə.ti ænd ˈmʌð.ər ˈneɪ.tʃər/',
    vietnameseMeaning: 'Sự giao hòa giữa con người và Mẹ Thiên nhiên',
    englishDefinition: 'A worldview that respects forests, rivers, and wildlife as sacred companions rather than mere resources.',
    exampleSentence: {
      en: 'Every carving on the T\'kơơr pole celebrates the harmony between humanity and Mother Nature.',
      vi: 'Mỗi nét chạm khắc trên cột T\'kơơr đều ca ngợi sự giao hòa giữa con người và Mẹ Thiên nhiên.'
    },
    themeId: 'tour_guiding',
    themeName: { vi: 'Thuyết minh & Đón khách Di sản', en: 'Heritage Tour Guiding & Storytelling' },
    relatedArtifactSlug: 'tkoor-sacrifice-pillar',
    relatedArtifactName: { vi: 'Cột Tế T\'kơơr', en: 'T\'kơơr Ceremonial Pole' }
  },
  {
    id: 'vb-guide-09',
    term: 'Cultural ambassador of the highlands',
    ipa: '/ˈkʌl.tʃər.əl æmˈbæs.ə.dər ɒv ðə ˈhaɪ.ləndz/',
    vietnameseMeaning: 'Đại sứ văn hóa vùng cao',
    englishDefinition: 'A local student, artisan, or guide who bridges indigenous heritage with friends around the world through bilingual storytelling.',
    exampleSentence: {
      en: 'By mastering heritage English, every student in Tây Giang can become a cultural ambassador of the highlands.',
      vi: 'Khi làm chủ tiếng Anh di sản, mỗi học sinh Tây Giang đều có thể trở thành một đại sứ văn hóa vùng cao.'
    },
    themeId: 'tour_guiding',
    themeName: { vi: 'Thuyết minh & Đón khách Di sản', en: 'Heritage Tour Guiding & Storytelling' },
    relatedArtifactSlug: 'guol-communal-house',
    relatedArtifactName: { vi: 'Nhà Gươl Truyền Thống', en: 'Traditional Gươl Communal House' }
  },
  {
    id: 'vb-guide-10',
    term: 'Living museum amidst the clouds',
    ipa: '/ˈlɪv.ɪŋ mjuːˈziː.əm əˈmɪdst ðə klaʊdz/',
    vietnameseMeaning: 'Bảo tàng sống giữa mây ngàn',
    englishDefinition: 'A poetic description of Tây Giang’s traditional villages where architecture, crafts, and festivals remain part of daily life.',
    exampleSentence: {
      en: 'Welcome to Tây Giang — a living museum amidst the clouds of the Trường Sơn range.',
      vi: 'Chào mừng bạn đến với Tây Giang — một bảo tàng sống giữa mây ngàn dãy Trường Sơn.'
    },
    themeId: 'tour_guiding',
    themeName: { vi: 'Thuyết minh & Đón khách Di sản', en: 'Heritage Tour Guiding & Storytelling' },
    relatedArtifactSlug: 'guol-communal-house',
    relatedArtifactName: { vi: 'Nhà Gươl Truyền Thống', en: 'Traditional Gươl Communal House' }
  }
];
