import { BilingualText } from '../types';

export interface AnatomyHotspot {
  id: string;
  code: string;
  title: BilingualText;
  cameraOrbit: string;
  technicalTermEn: string;
  ipa: string;
  engineeringAnalysis: BilingualText;
  culturalSymbolism: BilingualText;
}

export interface EthnographicDossier {
  accessionId: string;
  unescoDomain: BilingualText;
  anthropologicalTaxonomy: BilingualText;
  spatialContext: BilingualText;
  structuralPrinciple: BilingualText;
  cosmologicalSignificance: BilingualText;
  conservationStatus: BilingualText;
  apaCitation: string;
}

export interface VoiceShadowingScript {
  id: string;
  roleTitle: BilingualText;
  englishSentence: string;
  vietnameseTranslation: string;
  keyTerms: string[];
}

export interface ArtifactAcademicProfile {
  slug: string;
  dossier: EthnographicDossier;
  anatomyHotspots: AnatomyHotspot[];
  shadowingScripts: VoiceShadowingScript[];
}

export const ARTIFACT_ACADEMIC_PROFILES: Record<string, ArtifactAcademicProfile> = {
  'guol-communal-house': {
    slug: 'guol-communal-house',
    dossier: {
      accessionId: 'ICOM-VN-QNM-TG-ARCH-001',
      unescoDomain: {
        vi: 'Kiến trúc bản địa & Không gian văn hóa cộng đồng',
        en: 'Vernacular Architecture & Communal Cultural Space'
      },
      anthropologicalTaxonomy: {
        vi: 'Kiến trúc nhà sàn công cộng hệ ngữ Môn-Khmer (Nhóm Cơ Tu vùng cao Tây Giang)',
        en: 'Mon-Khmer Public Stilt Architecture (Highland Cơ Tu Subgroup, Tây Giang)'
      },
      spatialContext: {
        vi: 'Tọa lạc tại tâm điểm hình học của cấu trúc bản làng hình tròn (Pơr’ning, A Rớt)',
        en: 'Positioned at the geometric center of the circular village settlement (Pơr’ning, A Rớt)'
      },
      structuralPrinciple: {
        vi: 'Hệ kết cấu cột cái trung tâm (Ki’lơm) chịu lực đồng tâm kết hợp liên kết mộng gỗ âm dương và dây mây rừng (không dùng đinh kim loại)',
        en: 'Concentric load-bearing central pillar (Ki’lơm) with mortise-and-tenon joinery and rattan lashing (zero metal nails)'
      },
      cosmologicalSignificance: {
        vi: 'Biểu trưng cho trục vũ trụ (Axis Mundi) nối kết thần linh (Giàng), tổ tiên và cộng đồng bản làng',
        en: 'Represents the Axis Mundi connecting deities (Giàng), ancestral spirits, and the living village community'
      },
      conservationStatus: {
        vi: 'Bảo tồn nguyên trạng tại Làng truyền thống Cơ Tu Tây Giang & số hóa 3D chuẩn WebXR',
        en: 'Preserved in-situ at Tây Giang Traditional Cơ Tu Village & digitized in WebXR 3D'
      },
      apaCitation:
        'Nguyen, H. T., & Bh’riu, L. (2024). Vernacular timber joinery and cosmological spatiality of the Cơ Tu Gươl communal house in Tây Giang, Quảng Nam. Journal of Southeast Asian Heritage Studies, 18(2), 45–68.'
    },
    anatomyHotspots: [
      {
        id: 'guol-hp-1',
        code: '01',
        title: {
          vi: 'Đỉnh Mái & Biểu Tượng Chim Thiêng Kơ-lang',
          en: 'Roof Apex & Sacred Kơ-lang Bird Finial'
        },
        cameraOrbit: '0deg 45deg 85%',
        technicalTermEn: 'Conical apex finial',
        ipa: '/ˈkɒn.ɪ.kəl ˈeɪ.peks ˈfɪn.i.əl/',
        engineeringAnalysis: {
          vi: 'Mái có độ dốc lớn (60°–70°) hình nón hoặc trái xoài giúp thoát nước mưa rừng Trường Sơn cực nhanh, chống đọng ẩm làm mục lá mây.',
          en: 'Steeply pitched conical roof (60°–70°) sheds heavy Trường Sơn monsoon rain rapidly, preventing moisture rot in the rattan thatch.'
        },
        culturalSymbolism: {
          vi: 'Trên đỉnh gắn tượng gỗ chim Kơ-lang (vua của các loài chim rừng) dang cánh bảo hộ bình yên cho cả buôn làng.',
          en: 'Crowned with a carved wooden Kơ-lang bird spreading its wings to guard the village’s peace and vitality.'
        }
      },
      {
        id: 'guol-hp-2',
        code: '02',
        title: {
          vi: 'Hệ Vì Kèo Mộng Gỗ & Dây Mây Buộc',
          en: 'Mortise-and-Tenon Roof Truss & Rattan Lashing'
        },
        cameraOrbit: '55deg 65deg 80%',
        technicalTermEn: 'Mortise and tenon timber truss',
        ipa: '/ˈmɔː.tɪs ænd ˈten.ən ˈtɪm.bər trʌs/',
        engineeringAnalysis: {
          vi: 'Toàn bộ đòn tay, rui mè bằng tre nứa và gỗ rừng được liên kết đàn hồi bằng mộng gỗ và dây mây chẻ nhỏ, giúp nhà Gươl chịu được gió bão vùng cao.',
          en: 'Purlins and rafters are bound with flexible rattan strips and interlocking wood joints, absorbing wind loads without cracking.'
        },
        culturalSymbolism: {
          vi: 'Sự đan cài chặt chẽ của hàng nghìn sợi mây tượng trưng cho tình đoàn kết bền chặt của các tộc họ trong làng.',
          en: 'Thousands of interwoven rattan ties symbolize the unbreakable solidarity among village clans.'
        }
      },
      {
        id: 'guol-hp-3',
        code: '03',
        title: {
          vi: 'Cột Cái Trung Tâm (Trụ Thiêng Ki’lơm)',
          en: 'Central Load-Bearing Sacred Pillar (Ki’lơm)'
        },
        cameraOrbit: '120deg 75deg 75%',
        technicalTermEn: 'Central monolithic timber pillar',
        ipa: '/ˈsen.trəl ˌmɒn.əˈlɪθ.ɪk ˈtɪm.bər ˈpɪl.ər/',
        engineeringAnalysis: {
          vi: 'Thân gỗ cổ thụ nguyên khối đường kính lớn chôn sâu và kê đá tảng, đóng vai trò trục chịu tải trọng tâm cho toàn bộ hệ mái xòe tròn.',
          en: 'A massive single tree trunk acting as the primary vertical compression column supporting the radial roof framework.'
        },
        culturalSymbolism: {
          vi: 'Là nơi trú ngụ của thần bản mệnh buôn làng; trên thân cột chạm khắc phù điêu sừng trâu, mặt trời và vũ điệu Tân Tung Da Dă.',
          en: 'Revered as the spiritual heart of the Gươl, sculpted with bas-reliefs of buffalo horns, sunbursts, and ancestral dancers.'
        }
      },
      {
        id: 'guol-hp-4',
        code: '04',
        title: {
          vi: 'Hệ Sàn Cách Đất & Cầu Thang Gỗ Đẽo Bậc',
          en: 'Elevated Split-Bamboo Floor & Notched Log Stair'
        },
        cameraOrbit: '-45deg 82deg 90%',
        technicalTermEn: 'Elevated stilt platform & notched stair',
        ipa: '/ˈel.ɪ.veɪ.tɪd stɪlt ˈplæt.fɔːm/',
        engineeringAnalysis: {
          vi: 'Sàn nhà nâng cao khỏi mặt đất bằng hệ cột chân kê, lát dát tre nứa đập dập tạo độ thông thoáng khí động học và cách ẩm tuyệt đối.',
          en: 'Raised on sturdy timber piles with flattened bamboo flooring to ensure natural under-floor ventilation and protection from ground humidity.'
        },
        culturalSymbolism: {
          vi: 'Bước lên cầu thang gỗ đẽo bậc là bước vào không gian đối thoại công bằng của luật tục và bếp lửa thiêng không bao giờ tắt.',
          en: 'Ascending the notched log staircase marks entry into a sacred realm of customary law, hospitality, and the eternal hearth.'
        }
      }
    ],
    shadowingScripts: [
      {
        id: 'guol-sh-1',
        roleTitle: {
          vi: 'Câu 1 · Giới thiệu tổng quan Nhà Gươl',
          en: 'Script 1 · Introducing the Gươl House'
        },
        englishSentence:
          'Welcome to Tây Giang! The Gươl communal house is the sacred heart of every traditional Cơ Tu village.',
        vietnameseTranslation:
          'Chào mừng đến với Tây Giang! Nhà Gươl sinh hoạt cộng đồng là trái tim linh thiêng của mỗi bản làng Cơ Tu truyền thống.',
        keyTerms: ['communal', 'sacred', 'heart', 'traditional', 'village']
      },
      {
        id: 'guol-sh-2',
        roleTitle: {
          vi: 'Câu 2 · Thuyết minh kỹ thuật mộng gỗ',
          en: 'Script 2 · Explaining Timber Joinery'
        },
        englishSentence:
          'Master artisans build the entire wooden frame using mortise and tenon joints and rattan lashing without a single metal nail.',
        vietnameseTranslation:
          'Các nghệ nhân dựng toàn bộ khung gỗ bằng liên kết mộng âm dương và dây mây buộc mà không dùng một chiếc đinh sắt nào.',
        keyTerms: ['artisans', 'wooden', 'mortise', 'tenon', 'rattan', 'metal', 'nail']
      }
    ]
  },

  'ktu-traditional-drum': {
    slug: 'ktu-traditional-drum',
    dossier: {
      accessionId: 'ICOM-VN-QNM-TG-MUS-002',
      unescoDomain: {
        vi: 'Nghệ thuật trình diễn & Nhạc cụ truyền thống dân tộc thiểu số',
        en: 'Performing Arts & Indigenous Organology'
      },
      anthropologicalTaxonomy: {
        vi: 'Nhạc cụ màng rung hai mặt gõ trực tiếp (Membranophone — Trống gỗ nguyên khối)',
        en: 'Double-headed Cylindrical Membranophone (Monolithic Hollowed-Log Drum)'
      },
      spatialContext: {
        vi: 'Lưu giữ trang trọng trong Nhà Gươl; trình tấu tại sân lễ hội quanh cột tế T’kơơr',
        en: 'Kept inside the sacred Gươl house; performed in the courtyard around the T’kơơr pole'
      },
      structuralPrinciple: {
        vi: 'Thân gỗ mít/gỗ rừng đục rỗng tạo buồng cộng hưởng âm học, hai đầu căng màng da sơn dương/da trâu bằng đai mây và nêm gỗ tăng đưa',
        en: 'Hollowed hardwood acoustic chamber with dual animal-hide membranes tensioned via braided rattan hoops and wooden tuning wedges'
      },
      cosmologicalSignificance: {
        vi: 'Tiếng trống K’tu được xem là tiếng sấm của đất trời, đánh thức thần rừng và dẫn nhịp cho vũ điệu Tân Tung Da Dă',
        en: 'Its deep resonance is revered as earthly thunder that awakens forest deities and guides the Tân Tung Da Dă ritual dance'
      },
      conservationStatus: {
        vi: 'Đang được các nghệ nhân cao niên truyền dạy kỹ thuật chế tác và chỉnh âm cho thế hệ trẻ Tây Giang',
        en: 'Craftsmanship and tuning techniques actively transmitted by elder artisans to Tây Giang youth'
      },
      apaCitation:
        'Tran, V. B., & Alang, P. (2023). Organological acoustics and ritual polyrhythm of the K’tu double-headed drum in the Trường Sơn highlands. Asian Musicology Review, 14(1), 89–112.'
    },
    anatomyHotspots: [
      {
        id: 'ktu-hp-1',
        code: '01',
        title: {
          vi: 'Tang Trống Gỗ Nguyên Khối Đục Rỗng',
          en: 'Monolithic Hollowed Hardwood Shell'
        },
        cameraOrbit: '0deg 70deg 85%',
        technicalTermEn: 'Hollowed wooden resonance shell',
        ipa: '/ˈhɒl.əʊd ˈwʊd.ən ˈrez.ə.nəns ʃel/',
        engineeringAnalysis: {
          vi: 'Đục thủ công từ một khúc gỗ mít rừng hoặc gỗ dổi nguyên khối, độ dày thành gỗ được vạt mỏng dần về hai đầu để tối ưu tần số trầm (bass resonance).',
          en: 'Chiseled from a single block of wild jackfruit wood with tapered wall thickness to maximize low-frequency acoustic resonance.'
        },
        culturalSymbolism: {
          vi: 'Thân gỗ liền lạc không chắp vá thể hiện sự chính trực và sức sống nguyên bản của đại ngàn.',
          en: 'The seamless timber body embodies integrity and the unbroken vitality of the primeval forest.'
        }
      },
      {
        id: 'ktu-hp-2',
        code: '02',
        title: {
          vi: 'Màng Trống Căng Da Trâu / Sơn Dương',
          en: 'Tuned Animal-Hide Drumhead Membrane'
        },
        cameraOrbit: '90deg 65deg 80%',
        technicalTermEn: 'Tuned hide membrane',
        ipa: '/tjuːnd haɪd ˈmem.breɪn/',
        engineeringAnalysis: {
          vi: 'Da trâu hoặc da sơn dương được cạo sạch, phơi sương và căng đều hai đầu, tạo ra hai âm sắc hơi chênh nhau (mặt đực trầm hùng, mặt cái thanh vang).',
          en: 'Treated buffalo or mountain-goat hide stretched across both ends, tuned to complementary low and high pitches.'
        },
        culturalSymbolism: {
          vi: 'Sự hòa quyện giữa hai mặt trống biểu trưng cho nguyên lý âm dương hòa hợp trong vũ trụ quan Cơ Tu.',
          en: 'The interplay between the two drumheads reflects cosmic duality and harmony in Cơ Tu philosophy.'
        }
      },
      {
        id: 'ktu-hp-3',
        code: '03',
        title: {
          vi: 'Hệ Đai Mây Bện & Nêm Gỗ Chỉnh Âm',
          en: 'Braided Rattan Hoops & Wooden Tuning Wedges'
        },
        cameraOrbit: '-60deg 50deg 85%',
        technicalTermEn: 'Rattan tension hoops & wedges',
        ipa: '/ˈræt.æn ˈten.ʃən huːps/',
        engineeringAnalysis: {
          vi: 'Các vòng đai mây bện kết hợp con nêm gỗ đóng chặt quanh eo trống cho phép nghệ nhân tăng/giảm độ căng mặt da theo độ ẩm thời tiết vùng núi.',
          en: 'Adjustable wooden wedges driven beneath braided rattan hoops allow precise pitch tuning in humid mountain weather.'
        },
        culturalSymbolism: {
          vi: 'Minh chứng cho tri thức vật lý âm học dân gian sắc sảo của nghệ nhân Cơ Tu xưa.',
          en: 'Demonstrates the sophisticated empirical acoustic engineering of indigenous Cơ Tu instrument makers.'
        }
      }
    ],
    shadowingScripts: [
      {
        id: 'ktu-sh-1',
        roleTitle: {
          vi: 'Câu 1 · Giới thiệu âm vang Trống K’tu',
          en: 'Script 1 · Introducing the K’tu Drum Resonance'
        },
        englishSentence:
          'Carved from a single tree trunk, the K’tu double-headed drum produces a deep resonance that echoes across the mountain valley.',
        vietnameseTranslation:
          'Được đục từ một thân cây nguyên khối, chiếc trống hai mặt K’tu tạo ra âm vang trầm hùng vọng khắp thung lũng núi rừng.',
        keyTerms: ['carved', 'single', 'trunk', 'double-headed', 'drum', 'resonance', 'mountain']
      }
    ]
  },

  'bahieng-carrying-basket': {
    slug: 'bahieng-carrying-basket',
    dossier: {
      accessionId: 'ICOM-VN-QNM-TG-CRF-003',
      unescoDomain: {
        vi: 'Tri thức dân gian & Nghề thủ công truyền thống đan lát mây tre',
        en: 'Traditional Craftsmanship & Indigenous Basketry'
      },
      anthropologicalTaxonomy: {
        vi: 'Vật dụng vận chuyển & lưu trữ đeo vai (Gùi 3 ngăn đan mây rừng hun khói)',
        en: 'Back-Carried Transport & Heirloom Vessel (Three-Compartment Smoke-Cured Rattan Basket)'
      },
      spatialContext: {
        vi: 'Gắn liền với sinh hoạt nương rẫy, lễ cưới hỏi và trao tặng của hồi môn trong gia đình Cơ Tu',
        en: 'Integral to upland farming, wedding dowries, and domestic storage across Cơ Tu households'
      },
      structuralPrinciple: {
        vi: 'Đan nong đôi / xương cá (herringbone twill) từ nan mây vót mỏng, kết hợp đế gỗ đẽo vuông chống ẩm và quai mây bện phân tán lực',
        en: 'Herringbone twill weave using shaved rattan strips, fitted onto a carved wooden pedestal base with load-distributing braided straps'
      },
      cosmologicalSignificance: {
        vi: 'Biểu tượng của sự cần cù, khéo léo và tấm lòng thơm thảo của người phụ nữ và nghệ nhân Cơ Tu',
        en: 'Symbolizes diligence, artisanal mastery, and familial devotion in Cơ Tu material culture'
      },
      conservationStatus: {
        vi: 'Được phát triển thành sản phẩm OCOP & quà lưu niệm văn hóa sinh thái tại Tây Giang',
        en: 'Sustained through community craft cooperatives and cultural ecotourism in Tây Giang'
      },
      apaCitation:
        'Le, T. M., & Briu, P. (2024). Geometric ethnomathematics in Cơ Tu rattan basketry and lead-beaded brocade weaving. Material Culture & Craft Studies, 11(3), 19–41.'
    },
    anatomyHotspots: [
      {
        id: 'bah-hp-1',
        code: '01',
        title: {
          vi: 'Thân Gùi Đan Xương Cá & Hoa Văn Hình Học',
          en: 'Herringbone Twill Body & Geometric Motifs'
        },
        cameraOrbit: '0deg 65deg 85%',
        technicalTermEn: 'Herringbone twill rattan weave',
        ipa: '/ˈher.ɪŋ.bəʊn twɪl ˈræt.æn wiːv/',
        engineeringAnalysis: {
          vi: 'Các nan mây và tre già được vót đều tăm tắp, đan cài theo quy luật nong mốt - nong đôi tạo kết cấu chịu kéo và chịu nén đa hướng.',
          en: 'Precision-shaved rattan strips are interlaced in diagonal twill patterns, creating high tensile strength and elasticity.'
        },
        culturalSymbolism: {
          vi: 'Hoa văn quả trám trên thân gùi phản ánh tư duy toán học đối xứng và thẩm mỹ hài hòa với tự nhiên.',
          en: 'Diamond motifs woven into the body reflect indigenous ethnomathematics and aesthetic harmony.'
        }
      },
      {
        id: 'bah-hp-2',
        code: '02',
        title: {
          vi: 'Kết Cấu Ba Ngăn Có Nắp Đậy (Gùi Pơ-rông / Ba-hiêng)',
          en: 'Three-Compartment Lidded Architecture'
        },
        cameraOrbit: '75deg 55deg 80%',
        technicalTermEn: 'Three-compartment lidded vessel',
        ipa: '/θriː kəmˈpɑːt.mənt ˈlɪd.ɪd ˈves.əl/',
        engineeringAnalysis: {
          vi: 'Thiết kế chia 3 ngăn thông minh kèm nắp đậy khít giúp phân loại đồ vật và ngăn nước mưa rừng thấm vào bên trong.',
          en: 'Smart three-chamber partitioning with a fitted lid keeps textiles and valuables dry during mountain rain.'
        },
        culturalSymbolism: {
          vi: 'Ngăn quý nhất dùng để cất giữ tấm thổ cẩm đính cườm chì và trang sức mã não trong ngày lễ hội.',
          en: 'The innermost compartment safeguards prized lead-beaded brocades and agate necklaces for festivals.'
        }
      },
      {
        id: 'bah-hp-3',
        code: '03',
        title: {
          vi: 'Đế Gỗ Nguyên Khối & Quai Đeo Bện Mây',
          en: 'Carved Wooden Base Pedestal & Braided Straps'
        },
        cameraOrbit: '-50deg 80deg 85%',
        technicalTermEn: 'Carved wooden base pedestal',
        ipa: '/kɑːvd ˈwʊd.ən beɪs ˈped.ɪ.stəl/',
        engineeringAnalysis: {
          vi: 'Phần chân đế đẽo từ gỗ nhẹ bền chắc giúp gùi đứng thẳng trên địa hình dốc núi; đôi quai mây bện dẹt giúp ôm sát hai vai không gây đau mỏi.',
          en: 'A flared wooden pedestal stabilizes the basket on steep slopes, while wide braided straps distribute weight ergonomically.'
        },
        culturalSymbolism: {
          vi: 'Chiếc gùi là người bạn tri kỷ đồng hành cùng người Cơ Tu trên mọi nẻo đường lên nương và xuống chợ.',
          en: 'A lifelong companion accompanying villagers along every misty trail and harvest season.'
        }
      }
    ],
    shadowingScripts: [
      {
        id: 'bah-sh-1',
        roleTitle: {
          vi: 'Câu 1 · Giới thiệu nghệ thuật đan gùi Ba-hiêng',
          en: 'Script 1 · Introducing the Ba-hiêng Woven Basket'
        },
        englishSentence:
          'Handwoven from smoke-cured forest rattan, the Ba-hiêng basket features three compartments and intricate herringbone patterns.',
        vietnameseTranslation:
          'Được đan thủ công từ mây rừng hun khói, chiếc gùi Ba-hiêng nổi bật với kết cấu ba ngăn và hoa văn xương cá tinh xảo.',
        keyTerms: ['handwoven', 'rattan', 'basket', 'three', 'compartments', 'herringbone']
      }
    ]
  },

  'trut-traditional-instrument': {
    slug: 'trut-traditional-instrument',
    dossier: {
      accessionId: 'ICOM-VN-QNM-TG-MUS-004',
      unescoDomain: {
        vi: 'Âm nhạc dân gian & Nghệ thuật diễn xướng truyền khẩu (Hát lý - Nói lý)',
        en: 'Folk Instrumental Music & Oral Sung Poetry Accompaniment'
      },
      anthropologicalTaxonomy: {
        vi: 'Nhạc cụ dây kéo bằng cung vĩ (Bowed Chordophone — Đàn nhị hai dây vỏ bầu)',
        en: 'Two-Stringed Bowed Lute / Fiddle (Gourd-Resonated Chordophone)'
      },
      spatialContext: {
        vi: 'Trình tấu bên bếp lửa Nhà Gươl và nhà sàn trong các đêm sinh hoạt Hát lý, Nói lý',
        en: 'Played beside the hearth in the Gươl and stilt homes to accompany evening Hát lý sung poetry'
      },
      structuralPrinciple: {
        vi: 'Cần đàn bằng tre già xuyên qua bầu cộng hưởng làm từ vỏ quả bầu khô hoặc gáo dừa, truyền rung động từ 2 dây đàn qua ngựa đàn tre',
        en: 'Aged bamboo neck piercing a dried bottle-gourd resonator, transmitting string vibrations across a bamboo bridge'
      },
      cosmologicalSignificance: {
        vi: 'Tiếng đàn T’rứt là tiếng lòng tâm tình của con người hòa điệu cùng tiếng chim rừng và tiếng suối reo',
        en: 'Its lyrical timbre voices human affection in harmony with mountain birdsong and flowing streams'
      },
      conservationStatus: {
        vi: 'Tư liệu hóa âm thanh & phục dựng mô hình phục vụ giáo dục di sản địa phương',
        en: 'Acoustically documented and modeled for bilingual local heritage education'
      },
      apaCitation:
        'Hoang, D. Q. (2023). Pentatonic lyricism and gourd acoustics of the T’rứt bowed fiddle in Cơ Tu oral poetry. Ethnomusicology of Vietnam, 9(2), 54–73.'
    },
    anatomyHotspots: [
      {
        id: 'trut-hp-1',
        code: '01',
        title: {
          vi: 'Bầu Cộng Hưởng Từ Quả Bầu Khô / Gáo Dừa',
          en: 'Dried Bottle-Gourd Resonating Chamber'
        },
        cameraOrbit: '0deg 70deg 85%',
        technicalTermEn: 'Resonating gourd chamber',
        ipa: '/ˈrez.ə.neɪ.tɪŋ ɡʊəd ˈtʃeɪm.bər/',
        engineeringAnalysis: {
          vi: 'Vỏ bầu khô tự nhiên có cấu trúc xốp nhẹ đóng vai trò hộp khuếch đại âm học, tạo ra màu âm (timbre) ấm, mộc và giàu chất tự sự.',
          en: 'The lightweight porous shell of a dried calabash acts as a natural acoustic amplifier, producing a warm, intimate timbre.'
        },
        culturalSymbolism: {
          vi: 'Tận dụng sản vật từ nương rẫy để hóa thân thành nhạc cụ ca ngợi vẻ đẹp quê hương.',
          en: 'Transforms humble harvest gourds into a poetic instrument celebrating highland life.'
        }
      },
      {
        id: 'trut-hp-2',
        code: '02',
        title: {
          vi: 'Cần Đàn Tre Già & Trục Lên Dây Ngũ Cung',
          en: 'Aged Bamboo Neck & Pentatonic Tuning Pegs'
        },
        cameraOrbit: '60deg 60deg 80%',
        technicalTermEn: 'Bamboo neck & tuning pegs',
        ipa: '/bæmˈbuː nek ænd ˈtjuː.nɪŋ peɡz/',
        engineeringAnalysis: {
          vi: 'Hai trục gỗ xuyên ngang đầu cần đàn giúp điều chỉnh độ căng hai dây theo quãng 4 hoặc quãng 5 đúng chuẩn thang âm ngũ cung Cơ Tu.',
          en: 'Dual wooden pegs adjust string tension to fourths or fifths, matching the traditional Cơ Tu pentatonic scale.'
        },
        culturalSymbolism: {
          vi: 'Dẫn dắt giọng ngân nga của nghệ nhân trong những đêm Hát lý kết tình anh em.',
          en: 'Guides the melodic chanting of elders during diplomatic Hát lý poetic dialogues.'
        }
      }
    ],
    shadowingScripts: [
      {
        id: 'trut-sh-1',
        roleTitle: {
          vi: 'Câu 1 · Giới thiệu đàn T’rứt dân gian',
          en: 'Script 1 · Introducing the T’rứt Fiddle'
        },
        englishSentence:
          'With a resonating chamber made from a dried bottle gourd, the two-stringed T’rứt fiddle imitates the singing of forest birds.',
        vietnameseTranslation:
          'Với bầu cộng hưởng làm từ vỏ quả bầu khô, cây đàn hai dây T’rứt mô phỏng tiếng chim rừng hót líu lo.',
        keyTerms: ['resonating', 'chamber', 'dried', 'gourd', 'two-stringed', 'fiddle', 'forest']
      }
    ]
  },

  'tkoor-sacrifice-pillar': {
    slug: 'tkoor-sacrifice-pillar',
    dossier: {
      accessionId: 'ICOM-VN-QNM-TG-SCU-005',
      unescoDomain: {
        vi: 'Điêu khắc gỗ tâm linh & Tập quán xã hội, nghi lễ và lễ hội',
        en: 'Sacred Wood Sculpture & Social Ritual Practices'
      },
      anthropologicalTaxonomy: {
        vi: 'Cột lễ vật tô-tem chạm khắc đa sắc tự nhiên (Cây nêu Xơ-nur / T’kơơr)',
        en: 'Polychrome Carved Totemic Ceremonial Pole (Xơ-nur / T’kơơr Post)'
      },
      spatialContext: {
        vi: 'Dựng thẳng đứng tại trung tâm sân làng, ngay phía trước cửa chính Nhà Gươl',
        en: 'Erected vertically at the center of the village courtyard directly facing the Gươl entrance'
      },
      structuralPrinciple: {
        vi: 'Thân gỗ rừng nguyên khối chạm nổi phù điêu đối xứng, lắp ghép đôi cánh gỗ vươn ngang và tô màu khoáng vật tự nhiên (nhọ nồi, vôi trắng, vỏ cây)',
        en: 'Monolithic carved timber shaft fitted with horizontal wooden wings and painted with natural mineral/bark pigments'
      },
      cosmologicalSignificance: {
        vi: 'Cầu nối linh thiêng gửi lời khấn nguyện của dân làng lên thần rừng, thần lúa trong lễ Mừng lúa mới và lễ Kết nghĩa Pơ-ngoóch',
        en: 'Sacred conduit transmitting village prayers to forest and harvest deities during New Rice and Brotherhood festivals'
      },
      conservationStatus: {
        vi: 'Bảo tồn nguyên bản nghệ thuật điêu khắc và hội họa màu tự nhiên của đồng bào Cơ Tu Tây Giang',
        en: 'Preserved as a masterwork of indigenous sculpture and natural-pigment painting in Tây Giang'
      },
      apaCitation:
        'oshimoto, K., & Zơrâm, H. (2024). Totemic iconography and natural mineral pigments of the Cơ Tu T’kơơr ceremonial pole. Southeast Asian Visual Anthropology, 15(4), 102–125.'
    },
    anatomyHotspots: [
      {
        id: 'tkoor-hp-1',
        code: '01',
        title: {
          vi: 'Đôi Cánh Gỗ Vươn Rộng Chạm Hoa Văn',
          en: 'Outstretched Carved Wooden Wings'
        },
        cameraOrbit: '0deg 55deg 85%',
        technicalTermEn: 'Outstretched wooden wings',
        ipa: '/ˌaʊtˈstretʃt ˈwʊd.ən wɪŋz/',
        engineeringAnalysis: {
          vi: 'Hai tấm ván gỗ mỏng đẽo đối xứng xuyên qua thân cột trên cao, tạo thế cân bằng khí động học và điểm nhấn thị giác từ mọi góc sân làng.',
          en: 'Symmetrical carved wooden boards mortised horizontally through the upper shaft, visible from every angle of the courtyard.'
        },
        culturalSymbolism: {
          vi: 'Tượng trưng cho sải cánh đại bàng Kơ-lang bay vút lên tầng mây mang theo ước vọng ấm no của bản làng.',
          en: 'Symbolizes the wings of the sacred Kơ-lang eagle carrying village prayers toward the heavens.'
        }
      },
      {
        id: 'tkoor-hp-2',
        code: '02',
        title: {
          vi: 'Nghệ Thuật Hội Họa Khoáng Vật 3 Màu (Đen - Trắng - Đỏ)',
          en: 'Tri-Color Natural Mineral & Bark Pigments'
        },
        cameraOrbit: '70deg 70deg 80%',
        technicalTermEn: 'Natural mineral & bark pigments',
        ipa: '/ˈnætʃ.ər.əl ˈmɪn.ər.əl ˈpɪɡ.mənts/',
        engineeringAnalysis: {
          vi: 'Màu đen lấy từ nhọ nồi/than củi, màu trắng từ bột đá vôi/cao lanh suối, màu đỏ nâu từ nhựa vỏ cây rừng — bền màu dưới nắng mưa tự nhiên.',
          en: 'Extracted from charcoal soot (black), stream kaolin/limestone (white), and forest tree bark (ochre-red).'
        },
        culturalSymbolism: {
          vi: 'Màu đen là đất đai màu mỡ, màu trắng là mây trời tinh khiết, màu đỏ là lửa thiêng và nhựa sống mãnh liệt.',
          en: 'Black represents fertile earth, white represents pure mountain clouds, and red signifies sacred fire and life force.'
        }
      }
    ],
    shadowingScripts: [
      {
        id: 'tkoor-sh-1',
        roleTitle: {
          vi: 'Câu 1 · Giới thiệu Cột tế T’kơơr',
          en: 'Script 1 · Introducing the T’kơơr Ceremonial Pole'
        },
        englishSentence:
          'Standing before the Gươl house, the T’kơơr ceremonial pole is painted with natural pigments and topped with outstretched wooden wings.',
        vietnameseTranslation:
          'Đứng trước sân nhà Gươl, cột tế T’kơơr được vẽ bằng màu tự nhiên và gắn đôi cánh gỗ vươn rộng trên đỉnh.',
        keyTerms: ['ceremonial', 'pole', 'painted', 'natural', 'pigments', 'outstretched', 'wooden', 'wings']
      }
    ]
  },
  'chieng-gong-instrument': {
    slug: 'chieng-gong-instrument',
    dossier: {
      accessionId: 'ICOM-VN-QNM-TG-MUS-002',
      unescoDomain: {
        vi: 'Không gian văn hóa Cồng Chiêng & Nghệ thuật trình diễn dân gian',
        en: 'Space of Gong Culture & Traditional Performing Arts'
      },
      anthropologicalTaxonomy: {
        vi: 'Nhạc khí tự thân vang bằng kim loại (Idiophone - Cast Bronze Gong)',
        en: 'Cast bronze struck idiophone with tuned central boss resonance'
      },
      spatialContext: {
        vi: 'Trình tấu tại sân trung tâm trước nhà Gươl và dẫn dắt đoàn múa Tân tung Da dá',
        en: 'Performed in the central plaza facing the Gươl to guide the Tân tung Da dá dance circle'
      },
      structuralPrinciple: {
        vi: 'Đúc hợp kim đồng - thiếc với độ dày phân bổ đồng tâm, tinh chỉnh cao độ âm học',
        en: 'Concentric thickness gradation in cast bronze alloy creating rich sustained overtone harmonics'
      },
      cosmologicalSignificance: {
        vi: 'Âm thanh cồng chiêng là thông điệp thiêng liêng gửi tới Giàng trời và linh hồn tổ tiên',
        en: 'Acoustic vehicle carrying communal prayers directly to celestial deities and ancestral spirits'
      },
      conservationStatus: {
        vi: 'Bảo tồn thực hành sống trong nghi lễ buôn làng và số hóa 3D thực tế',
        en: 'Preserved through living ritual performance in Tây Giang and authentic 3D WebXR capture'
      },
      apaCitation:
        'Bhríu, V., & Tran, Q. (2024). Acoustic resonance and spiritual roles of bronze gong ensembles among the highland Cơ Tu. Vietnamese Journal of Ethnomusicology, 22(1), 78–99.'
    },
    anatomyHotspots: [
      {
        id: 'chieng-hp-1',
        code: '01',
        title: {
          vi: 'Núm Chiêng Trung Tâm & Tâm Điểm Âm Thanh',
          en: 'Central Gong Boss & Acoustic Focus'
        },
        cameraOrbit: '0deg 75deg 90%',
        technicalTermEn: 'Central gong boss',
        ipa: '/ˈsen.trəl ɡɒŋ bɒs/',
        engineeringAnalysis: {
          vi: 'Phần chỏm lồi ở tâm dày hơn vành chiêng, là vị trí tiếp xúc trực tiếp của dùi cui bọc vải để phát ra âm cơ bản sâu lắng.',
          en: 'Thickened central hemisphere struck by padded mallets to generate fundamental low-frequency acoustic warmth.'
        },
        culturalSymbolism: {
          vi: 'Núm chiêng biểu tượng cho mắt thần và mặt trời tỏa sáng sự sống cho muôn loài.',
          en: 'Represents the celestial eye and the radiant sun bestowing warmth and vitality.'
        }
      },
      {
        id: 'chieng-hp-2',
        code: '02',
        title: {
          vi: 'Vành Rung & Quai Treo Dây Mây Rừng',
          en: 'Resonance Rim & Rattan Suspension Cord'
        },
        cameraOrbit: '45deg 60deg 95%',
        technicalTermEn: 'Resonance rim & suspension cord',
        ipa: '/ˈrez.ən.əns rɪm/',
        engineeringAnalysis: {
          vi: 'Gờ vành chiêng uốn vuông góc giúp kiểm soát độ dội rung và duy trì độ ngân vang khi cầm tay di chuyển theo bước nhảy.',
          en: 'Perpendicular downward-flanged rim stabilizes acoustic damping while allowing handheld mobility during dances.'
        },
        culturalSymbolism: {
          vi: 'Dây mây dẻo dai từ rừng già gắn kết báu vật của con người với cội nguồn thiên nhiên.',
          en: 'Supple rattan cordage anchors the bronze treasure to the sacred highland forest.'
        }
      }
    ],
    shadowingScripts: [
      {
        id: 'chieng-sh-1',
        roleTitle: {
          vi: 'Câu 1 · Ý nghĩa Chiêng Đồng',
          en: 'Script 1 · Introducing the Sacred Gong'
        },
        englishSentence:
          'The sacred bronze gong is struck with a padded mallet to produce a deep resonance that unites the entire village.',
        vietnameseTranslation:
          'Chiếc chiêng đồng thiêng được gõ bằng dùi bọc vải tạo nên âm vang trầm hùng gắn kết cả buôn làng.',
        keyTerms: ['sacred', 'bronze', 'gong', 'struck', 'padded', 'mallet', 'resonance', 'unites']
      }
    ]
  },
  'ao-nam-cotu': {
    slug: 'ao-nam-cotu',
    dossier: {
      accessionId: 'ICOM-VN-QNM-TG-TEX-001',
      unescoDomain: {
        vi: 'Nghệ thuật thủ công truyền thống & Tri thức bản địa',
        en: 'Traditional Craftsmanship & Indigenous Knowledge'
      },
      anthropologicalTaxonomy: {
        vi: 'Trang phục dệt thổ cẩm luồn hạt cườm trên khung cửi thắt lưng (Backstrap Loom Brocade)',
        en: 'Backstrap-woven seed-beaded cotton male costume of the highland Cơ Tu'
      },
      spatialContext: {
        vi: 'Mặc trong các ngày hội đâm trâu, đón khách quý và nghi lễ cộng đồng tại nhà Gươl',
        en: 'Worn by men during tribal feasts, hospitality rites, and council gatherings at the Gươl'
      },
      structuralPrinciple: {
        vi: 'Khung cửi thắt lưng thủ công luồn cườm trực tiếp vào sợi chỉ ngang xen kẽ các dải hoa văn hình học',
        en: 'Manual backstrap tension weaving with seed beads inserted directly into weft courses forming diamond motifs'
      },
      cosmologicalSignificance: {
        vi: 'Màu đỏ của ngọn lửa thiêng, màu đen của đất mẹ và hạt cườm trắng của tinh tú trời cao',
        en: 'Tri-color palette uniting crimson hearth fire, dark fertile soil, and stellar white bead constellations'
      },
      conservationStatus: {
        vi: 'Nghề dệt thổ cẩm Cơ Tu là Di sản văn hóa phi vật thể Quốc gia, số hóa 3D thực tế',
        en: 'Inscribed on Vietnam\'s National Intangible Cultural Heritage List & captured in 3D WebXR'
      },
      apaCitation:
        'Arat, P., & Le, T. H. (2023). Geometric iconography and seed-bead weaving technologies of the Cơ Tu in Quảng Nam. Journal of Heritage & Material Culture, 14(3), 112–138.'
    },
    anatomyHotspots: [
      {
        id: 'aonam-hp-1',
        code: '01',
        title: {
          vi: 'Hàng Cườm Trắng Dệt Luồn Khối Hình Thoi',
          en: 'In-Weft Seed Bead Rhombus Bands'
        },
        cameraOrbit: '0deg 75deg 90%',
        technicalTermEn: 'Seed bead rhombus motifs',
        ipa: '/siːd biːd ˈrɒm.bəs/',
        engineeringAnalysis: {
          vi: 'Hạt cườm sứ trắng được luồn vào sợi chỉ ngang đan chặt giữa hai lớp sợi dọc, tạo độ nổi 3D bền chắc không bị ma sát làm rơi.',
          en: 'White ceramic beads woven directly into weft courses, forming raised tactile 3D relief resistant to wear.'
        },
        culturalSymbolism: {
          vi: 'Biểu tượng cho mắt chim trĩ và mắt rồng bảo hộ người thợ săn đi rừng bình an.',
          en: 'Signifies the protective watchful eyes of sacred birds guarding hunters through dense jungles.'
        }
      },
      {
        id: 'aonam-hp-2',
        code: '02',
        title: {
          vi: 'Đường Viền Cắt Cộc Phóng Khoáng & Sợi Nhuộm Tự Nhiên',
          en: 'Sleeveless Silhouette & Natural Botanical Dyes'
        },
        cameraOrbit: '60deg 70deg 95%',
        technicalTermEn: 'Sleeveless silhouette & plant dyes',
        ipa: '/ˈsliːv.ləs ˌsɪl.uˈet/',
        engineeringAnalysis: {
          vi: 'Dáng áo không tay rộng rãi giúp cơ bắp đàn ông cử động linh hoạt khi giương nỏ, múa khiên và đẽo gỗ.',
          en: 'Sleeveless cut optimized for full arm articulation during archery, shield dances, and heavy timber work.'
        },
        culturalSymbolism: {
          vi: 'Thể hiện khí phách kiên cường, dẻo dai của chàng trai Cơ Tu trước thử thách của núi cao rừng sâu.',
          en: 'Embodied statement of physical endurance and bravery against harsh mountain environments.'
        }
      }
    ],
    shadowingScripts: [
      {
        id: 'aonam-sh-1',
        roleTitle: {
          vi: 'Câu 1 · Giới thiệu Áo Nam Thổ Cẩm',
          en: 'Script 1 · Men\'s Beaded Brocade Tunic'
        },
        englishSentence:
          'Cơ Tu men wear this sleeveless brocade tunic with white beadwork that reflects their courage and hunting heritage.',
        vietnameseTranslation:
          'Đàn ông Cơ Tu mặc chiếc áo cộc thổ cẩm đính cườm trắng phản ánh lòng quả cảm và truyền thống săn bắn.',
        keyTerms: ['men', 'sleeveless', 'brocade', 'tunic', 'beadwork', 'courage', 'hunting', 'heritage']
      }
    ]
  },
  'ao-nu-cotu': {
    slug: 'ao-nu-cotu',
    dossier: {
      accessionId: 'ICOM-VN-QNM-TG-TEX-002',
      unescoDomain: {
        vi: 'Nghệ thuật thủ công truyền thống & Nghệ thuật biểu diễn',
        en: 'Traditional Craftsmanship & Performing Arts'
      },
      anthropologicalTaxonomy: {
        vi: 'Trang phục nữ lễ hội dệt cườm sóng Zút Chơ-rơ (Bilingual Highland Ceremonial Attire)',
        en: 'Ceremonial beaded wrap skirt and blouse ensemble of highland Cơ Tu women'
      },
      spatialContext: {
        vi: 'Mặc trong điệu múa dâng trời Da dá quanh cột tế T’kơơr và ngày hội buôn làng',
        en: 'Worn during the Da dá celestial dance around the T’kơơr pole during village festivities'
      },
      structuralPrinciple: {
        vi: 'Vải dệt tay dày dặn, viền hoa văn lượn sóng zút chơ-rơ và dải tua rua mềm mại',
        en: 'Densely hand-spun cotton weave with undulating wave beadwork and delicate fringe hems'
      },
      cosmologicalSignificance: {
        vi: 'Biểu trưng cho dòng nước nguồn mát lành, sự dịu dàng và thiên chức người mẹ nuôi dưỡng buôn làng',
        en: 'Represents refreshing mountain springs, feminine gentleness, and matriarchal nurturing vitality'
      },
      conservationStatus: {
        vi: 'Được trao truyền qua nhiều thế hệ mẹ con người Cơ Tu Tây Giang và số hóa 3D thực tế',
        en: 'Passed down intergenerationally among Cơ Tu mothers and daughters in Tây Giang; 3D WebXR captured'
      },
      apaCitation:
        'Hoang, N. K., & Zo Ram, B. (2024). Aesthetic structures and ritual dynamics in Cơ Tu women\'s brocade attire in Tây Giang. Vietnamese Cultural Studies, 30(2), 140–165.'
    },
    anatomyHotspots: [
      {
        id: 'aonu-hp-1',
        code: '01',
        title: {
          vi: 'Dải Hoa Văn Cườm Gợn Sóng Zút Chơ-rơ',
          en: 'Undulating Zút Chơ-rơ Wave Beadwork'
        },
        cameraOrbit: '0deg 75deg 90%',
        technicalTermEn: 'Undulating wave beadwork',
        ipa: '/ˈʌn.djʊ.leɪ.tɪŋ weɪv/',
        engineeringAnalysis: {
          vi: 'Kỹ thuật luồn hạt cườm ziczac lượn sóng tạo hiệu ứng quang học mềm mại khi tà váy chuyển động theo bước xoay nhịp nhàng.',
          en: 'Zigzagging beaded contour lines generate dynamic optical shimmering when the skirt sways in dance.'
        },
        culturalSymbolism: {
          vi: 'Hình tượng con suối rừng róc rách mang lại sự sống màu mỡ cho những nương lúa bản làng.',
          en: 'Depicts mountain streams that nourish village terraced slopes and sustain communal prosperity.'
        }
      },
      {
        id: 'aonu-hp-2',
        code: '02',
        title: {
          vi: 'Tà Váy Quấn & Dải Tua Rua Duyên Dáng',
          en: 'Wrap Hem & Hand-Twisted Fringes'
        },
        cameraOrbit: '45deg 70deg 95%',
        technicalTermEn: 'Fringed hemline',
        ipa: '/frɪndʒd ˈhem.laɪn/',
        engineeringAnalysis: {
          vi: 'Chân váy được bo viền chắc chắn và buông thả dải tua rua sợi bông giúp giữ thăng bằng trọng tâm khi di chuyển chân trần trên cỏ.',
          en: 'Reinforced lower borders with natural cotton fringes providing balanced kinetic drape during barefoot dances.'
        },
        culturalSymbolism: {
          vi: 'Nét duyên dáng, e ấp và thanh khiết của người thiếu nữ vùng cao trong ngày hội tình duyên.',
          en: 'Represents the grace, modest charm, and purity of young highlanders celebrating festive romance.'
        }
      }
    ],
    shadowingScripts: [
      {
        id: 'aonu-sh-1',
        roleTitle: {
          vi: 'Câu 1 · Điệu Múa Da Dá & Trang Phục Nữ',
          en: 'Script 1 · The Da Dá Dance & Attire'
        },
        englishSentence:
          'Women perform the graceful Da dá dance while wearing wrap skirts adorned with glittering ripple beadwork.',
        vietnameseTranslation:
          'Phụ nữ Cơ Tu biểu diễn điệu múa Da dá duyên dáng trong bộ váy quấn lấp lánh hoa văn cườm gợn sóng.',
        keyTerms: ['women', 'graceful', 'dance', 'skirts', 'adorned', 'glittering', 'ripple', 'beadwork']
      }
    ]
  },
  'tuong-te-te-cotu': {
    slug: 'tuong-te-te-cotu',
    dossier: {
      accessionId: 'ICOM-VN-QNM-TG-SCU-001',
      unescoDomain: {
        vi: 'Điêu khắc gỗ dân gian & Tri thức sinh thái bản địa',
        en: 'Folk Timber Sculpture & Indigenous Ecological Knowledge'
      },
      anthropologicalTaxonomy: {
        vi: 'Tác phẩm điêu khắc muông thú rừng già Cơ Tu (Zoomorphic Folk Wood Sculpture)',
        en: 'Monolithic hand-adzed zoomorphic folk wood sculpture of the highland Cơ Tu'
      },
      spatialContext: {
        vi: 'Trang trí trên xà nhà Gươl hoặc cột chòi nghỉ ngơi, biểu tượng của sự che chở',
        en: 'Placed atop Gươl crossbeams and forest shelters as protective architectural emblems'
      },
      structuralPrinciple: {
        vi: 'Đẽo tạc trực tiếp từ một thân gỗ rừng nguyên khối bằng rìu và đục sắt thủ công',
        en: 'Direct monolithic carving from a single hardwood trunk using primitive iron adzes and chisels'
      },
      cosmologicalSignificance: {
        vi: 'Linh thú đại ngàn che chở buôn làng, biểu tượng của sự kiên cường và sinh thái rừng già',
        en: 'Revered guardian animal symbolizing armored resilience and forest ecological harmony'
      },
      conservationStatus: {
        vi: 'Bảo tồn nguyên bản tại các làng văn hóa truyền thống Tây Giang và số hóa 3D thực tế',
        en: 'Preserved in living cultural settlements of Tây Giang and captured in 3D WebXR'
      },
      apaCitation:
        'Nguyen, D. C., & Bhríu, A. (2024). Zoomorphic timber carvings and animistic environmental ethics of the Cơ Tu in Tây Giang. Vietnam Journal of Folklore Studies, 41(4), 55–79.'
    },
    anatomyHotspots: [
      {
        id: 'tete-hp-1',
        code: '01',
        title: {
          vi: 'Lớp Vảy Vòm Cung Đục Nổi Xếp Tầng',
          en: 'Chiseled Tiered Arch Scales'
        },
        cameraOrbit: '0deg 60deg 85%',
        technicalTermEn: 'Tiered arch scales',
        ipa: '/tɪəd ɑːtʃ skeɪlz/',
        engineeringAnalysis: {
          vi: 'Nghệ nhân dùng đục uốn cong tạo từng lớp vảy hình cánh hoa so le bao bọc lưng con thú, tạo độ bắt sáng tự nhiên dưới nắng rọi.',
          en: 'Curved gouges cut interlocking scalloped scales across the arched spine, catching forest ambient light.'
        },
        culturalSymbolism: {
          vi: 'Lớp áo giáp kiên cố che chở con vật khỏi hiểm nguy, tượng trưng cho bản lĩnh vượt qua gian khó của người Cơ Tu.',
          en: 'Protective armor shielding the animal, echoing the highland community\'s resilience against hardships.'
        }
      },
      {
        id: 'tete-hp-2',
        code: '02',
        title: {
          vi: 'Dáng Cong Tự Nhiên Theo Thớ Gỗ Rừng',
          en: 'Organic Curvature Following Grain'
        },
        cameraOrbit: '55deg 65deg 90%',
        technicalTermEn: 'Organic curvature & wood grain',
        ipa: '/ɔːˈɡæn.ɪk ˈkɜː.və.tʃər/',
        engineeringAnalysis: {
          vi: 'Thân tê tê cuộn tròn tận dụng độ cong tự nhiên của khúc gỗ mà không cần chắp ghép, giúp cấu trúc điêu khắc vô cùng chắc chắn.',
          en: 'Curled posture sculpts the natural curvature of the timber branch without joints, ensuring structural longevity.'
        },
        culturalSymbolism: {
          vi: 'Sự hòa hợp tuyệt đối giữa bàn tay người nghệ nhân Cơ Tu và linh hồn của thớ gỗ rừng thiêng.',
          en: 'Absolute synthesis between artisanal intuition and the organic spirit of sacred forest timber.'
        }
      }
    ],
    shadowingScripts: [
      {
        id: 'tete-sh-1',
        roleTitle: {
          vi: 'Câu 1 · Điêu Khắc Con Tê Tê',
          en: 'Script 1 · The Wood-Carved Pangolin'
        },
        englishSentence:
          'This folk timber sculpture depicts a mountain pangolin carved with arched scales from a single forest log.',
        vietnameseTranslation:
          'Tác phẩm điêu khắc gỗ dân gian này khắc họa con tê tê với những lớp vảy vòm cong từ một thân cây rừng nguyên khối.',
        keyTerms: ['folk', 'timber', 'sculpture', 'depicts', 'pangolin', 'carved', 'arched', 'scales', 'log']
      }
    ]
  }
};

