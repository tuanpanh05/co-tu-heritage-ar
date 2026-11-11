import { Artifact } from '../types';

export const ARTIFACTS_DATA: Artifact[] = [
  {
    id: 'art-001',
    slug: 'guol-communal-house',
    name: {
      vi: 'Nhà Gươl Truyền Thống',
      en: 'Gươl Communal House'
    },
    category: 'architecture',
    categoryName: {
      vi: 'Kiến trúc truyền thống',
      en: 'Traditional Architecture'
    },
    thumbnail: '/images/guol-thumb.svg',
    originalImages: [
      '/images/guol-thumb.svg'
    ],
    model3D: '/models/guol.glb',
    modelStatus: 'available', // Đã có mô hình 3D hình học minh họa kỹ thuật
    contentStatus: 'illustrative',
    brief: {
      vi: 'Nhà sinh hoạt cộng đồng linh thiêng, trái tim văn hóa và trung tâm gắn kết cộng đồng làng của người Cơ Tu tại Tây Giang.',
      en: 'The sacred communal house, cultural heart, and unity hub of the Cơ Tu village community in Tây Giang.'
    },
    description: {
      vi: 'Nhà Gươl là biểu tượng kiến trúc đặc trưng và thiêng liêng nhất của người Cơ Tu. Được dựng ở vị trí trung tâm làng, nhà Gươl có cấu trúc hình mai rùa hoặc oval đặc biệt, mái lợp lá mây hoặc lá nón, chống đỡ bởi cây cột cái (ki’lơm) khắc họa nhiều hình tượng muông thú và đời sống săn bắn.',
      en: 'The Gươl communal house is the most revered architectural symbol of the Cơ Tu people. Positioned at the village center, it features an oval or turtle-shell roof thatched with rattan leaves, supported by a central pillar (ki’lơm) carved with intricate relief motifs of wild fauna and tribal hunting life.'
    },
    sections: [
      {
        id: 'sec-01',
        title: {
          vi: 'Vị thế và Ý nghĩa Không gian',
          en: 'Spatial Hierarchy and Sacred Meaning'
        },
        content: {
          vi: 'Trong quan niệm người Cơ Tu, Gươl là nơi trú ngụ của các vị thần bảo hộ buôn làng (Giàng). Mọi nghi lễ quan trọng, phân xử luật tục, lễ đâm trâu (Cha-ha-roo-tmee) và tiếp đãi khách quý đều diễn ra tại đây.',
          en: 'In Cơ Tu cosmology, the Gươl is the sanctuary of the protective village deities (Giàng). Important tribal rituals, customary dispute resolutions, sacrificial ceremonies, and hospitality for distinguished guests are held inside.'
        }
      },
      {
        id: 'sec-02',
        title: {
          vi: 'Kỹ thuật Khắc họa & Cột Cái (Ki\'lơm)',
          en: 'Woodcarving Art & Central Pillar (Ki\'lơm)'
        },
        content: {
          vi: 'Cột cái là linh hồn của ngôi nhà Gươl, được đẽo từ thân gỗ nguyên khối bền chắc. Trên cột và xà ngang, nghệ nhân Cơ Tu chạm nổi hình ảnh chim trĩ, kỳ đà, đầu trâu và cảnh múa Tung tung Da dá truyền thống.',
          en: 'The master pillar (Ki\'lơm) serves as the structural and spiritual backbone of the Gươl. Master craftsmen carve bas-relief representations of pheasants, monitor lizards, water buffalo heads, and the festive Tung tung Da dá dance.'
        }
      },
      {
        id: 'sec-03',
        title: {
          vi: 'Vật liệu Bản địa & Kỹ thuật Xây dựng',
          en: 'Indigenous Materials & Architectural Joinery'
        },
        content: {
          vi: 'Công trình hoàn toàn sử dụng vật liệu tự nhiên từ rừng Tây Giang: gỗ kiền kiền, mây rừng, tre nứa. Các cấu kiện được liên kết bằng kỹ thuật ngoàm, ngàm chốt mộng và buộc dây mây dẻo dai mà không cần một chiếc đinh sắt nào.',
          en: 'Constructed entirely from local forest resources: durable timber, bamboo, and wild rattan. Structural components rely on traditional mortise-and-tenon joints secured by supple rattan bindings without any iron nails.'
        }
      }
    ],
    vocabulary: [
      {
        id: 'voc-001',
        term: 'Communal house',
        ipa: '/kəˈmjuːnl haʊs/',
        vietnameseMeaning: 'Nhà cộng đồng / Nhà chung của buôn làng',
        englishDefinition: 'A large building used by the community for public gatherings and ceremonies.',
        exampleSentence: {
          en: 'Villagers gather at the communal house to discuss important affairs.',
          vi: 'Dân làng tập trung tại nhà cộng đồng để bàn bạc những công việc trọng đại.'
        }
      },
      {
        id: 'voc-002',
        term: 'Sacred pillar',
        ipa: '/ˈseɪkrɪd ˈpɪlər/',
        vietnameseMeaning: 'Cột cái linh thiêng (Ki\'lơm)',
        englishDefinition: 'A master wooden column carved with symbolic spiritual motifs.',
        exampleSentence: {
          en: 'The sacred pillar stands in the center to support the roof beams.',
          vi: 'Cột cái linh thiêng đứng ở trung tâm để nâng đỡ các xà mái.'
        }
      },
      {
        id: 'voc-003',
        term: 'Bas-relief carving',
        ipa: '/ˌbɑː rɪˈliːf ˈkɑːvɪŋ/',
        vietnameseMeaning: 'Nghệ thuật chạm nổi gỗ',
        englishDefinition: 'Sculpture technique where sculpted elements remain attached to a solid background.',
        exampleSentence: {
          en: 'Intricate bas-relief carvings depict scenes of ancient harvest celebrations.',
          vi: 'Những nét chạm nổi tinh xảo khắc họa khung cảnh ngày hội mừng lúa mới thuở xưa.'
        }
      },
      {
        id: 'voc-004',
        term: 'Tung tung Da dá',
        ipa: '/tʊŋ tʊŋ dɑː dɑː/',
        vietnameseMeaning: 'Điệu múa dâng trời truyền thống của nam nữ Cơ Tu',
        isCulturalSpecific: true,
        culturalNote: 'Điệu múa linh thiêng thể hiện lòng biết ơn thần linh và ước vọng ấm no của cộng đồng.',
        exampleSentence: {
          en: 'The Tung tung Da dá dance is performed during major communal celebrations.',
          vi: 'Điệu múa Tung tung Da dá được biểu diễn trong những dịp đại lễ của buôn làng.'
        }
      }
    ],
    sources: [
      'Bảo tàng Điêu khắc Chăm Đà Nẵng - Bộ sưu tập Văn hóa Cơ Tu',
      'Tài liệu nghiên cứu văn hóa dân gian Huyện Tây Giang, Tỉnh Quảng Nam'
    ],
    verificationNote: 'Dữ liệu văn hóa và hình ảnh minh họa phục vụ nghiên cứu sư phạm CLIL. Đang chờ đối chiếu thực địa cùng già làng Tây Giang.',
    dimensions: 'Dài ~15m, Rộng ~8m, Cao ~9m (Kích thước trung bình)',
    materials: {
      vi: 'Gỗ lim/kiền kiền, mây rừng, tre nứa, lá nón',
      en: 'Indigenous hardwood, wild forest rattan, bamboo, palm leaves'
    },
    origin: {
      vi: 'Huyện Tây Giang, Tỉnh Quảng Nam',
      en: 'Tây Giang District, Quảng Nam Province'
    }
  },
  {
    id: 'art-002',
    slug: 'ktu-traditional-drum',
    name: {
      vi: 'Trống K\'tu Truyền Thống',
      en: 'K\'tu Traditional Drum'
    },
    category: 'musical_instrument',
    categoryName: {
      vi: 'Nhạc cụ cổ truyền',
      en: 'Traditional Musical Instruments'
    },
    thumbnail: '/images/drum-thumb.svg',
    originalImages: [
      '/images/drum-thumb.svg'
    ],
    model3D: '/models/ktu-drum.glb',
    modelStatus: 'available',
    contentStatus: 'illustrative',
    brief: {
      vi: 'Nhạc cụ gõ linh thiêng, tiếng trống giữ nhịp cho các điệu múa và kết nối con người với thần linh.',
      en: 'A sacred percussion instrument whose rhythmic resonance guides ritual dances and connects humans to ancestral spirits.'
    },
    description: {
      vi: 'Trống Cơ Tu được khoét rỗng từ một thân cây gỗ rừng nguyên khối, mặt trống bịt bằng da mang hoặc da trâu rừng phơi khô, kéo căng bằng các dải mây hoặc nêm gỗ chắc chắn. Âm thanh trầm hùng của trống có thể vang xa qua nhiều thung lũng Tây Giang.',
      en: 'The Cơ Tu drum is hollowed from a single solid tree trunk. The drumhead is crafted from dried deer or water buffalo hide, tautly fastened with rattan ties and wooden wedges. Its deep, resonant sound reverberates across mountain valleys.'
    },
    sections: [
      {
        id: 'sec-drum-01',
        title: {
          vi: 'Kỹ thuật Chế tác & Da Trống',
          en: 'Crafting Techniques & Drumhead'
        },
        content: {
          vi: 'Nghệ nhân Cơ Tu phải chọn gỗ rừng dẻo dai và không bị mối mọt. Da thú sau khi thuộc được nẹp chặt vào tang trống theo bí quyết cổ truyền giúp âm vang đanh mà vẫn giữ được độ ấm.',
          en: 'Craftsmen select resilient native wood immune to termites. After curing, the animal hide is stretched over the shell with ancestral techniques ensuring rich acoustic warmth and carrying power.'
        }
      },
      {
        id: 'sec-drum-02',
        title: {
          vi: 'Vai trò trong Lễ hội & Hòa tấu Cồng Chiêng',
          en: 'Role in Festivals & Gong Ensembles'
        },
        content: {
          vi: 'Trong mọi ngày hội làng, tiếng trống kết hợp với dàn cồng chiêng (Chiing) tạo nên tiết tấu dồn dập, chỉ dẫn nhịp bước chân uyển chuyển của các thiếu nữ và bước đi dũng mãnh của các chàng trai Cơ Tu.',
          en: 'In village festivities, drumbeats synchronize with bronze gong ensembles, dictating the dynamic steps of warriors and the graceful movements of female dancers.'
        }
      }
    ],
    vocabulary: [
      {
        id: 'voc-drum-001',
        term: 'Percussion instrument',
        ipa: '/pəˈkʌʃn ˈɪnstrəmənt/',
        vietnameseMeaning: 'Nhạc cụ bộ gõ',
        englishDefinition: 'A musical instrument sounded by being struck, beaten, or scraped.',
        exampleSentence: {
          en: 'The drum is an essential percussion instrument in mountainous rituals.',
          vi: 'Trống là nhạc cụ gõ thiết yếu trong các nghi thức vùng cao.'
        }
      },
      {
        id: 'voc-drum-002',
        term: 'Resonance',
        ipa: '/ˈrezənəns/',
        vietnameseMeaning: 'Độ vang / Sự cộng hưởng âm thanh',
        englishDefinition: 'The quality in a sound of being deep, full, and reverberating.',
        exampleSentence: {
          en: 'The natural resonance of the hollow trunk makes the sound travel miles.',
          vi: 'Độ vang tự nhiên của thân cây rỗng khiến âm thanh truyền xa nhiều dặm.'
        }
      },
      {
        id: 'voc-drum-003',
        term: 'Buffalo hide',
        ipa: '/ˈbʌfələʊ haɪd/',
        vietnameseMeaning: 'Da trâu khô',
        englishDefinition: 'Toughened skin of a water buffalo used for drum membranes.',
        exampleSentence: {
          en: 'Stretching the buffalo hide tightly produces a higher acoustic pitch.',
          vi: 'Căng chặt da trâu sẽ tạo ra cao độ âm thanh sắc nét hơn.'
        }
      }
    ],
    sources: [
      'Nghiên cứu Nhạc khí Dân gian các dân tộc thiểu số miền Trung Việt Nam'
    ],
    verificationNote: 'Dữ liệu mô tả kỹ thuật minh họa cho giáo trình CLIL. Cần kiểm nghiệm mẫu trống cụ thể tại Bảo tàng Tây Giang.',
    dimensions: 'Đường kính mặt ~40-60cm, Chiều dài ~70-90cm',
    materials: {
      vi: 'Thân gỗ tự nhiên, da trâu hoặc hoẵng, dây mây rừng',
      en: 'Solid log, buffalo/deer hide, rattan cordage'
    },
    origin: {
      vi: 'Xã A Tiêng, Huyện Tây Giang',
      en: 'A Tiêng Commune, Tây Giang District'
    }
  },
  {
    id: 'art-003',
    slug: 'bahieng-carrying-basket',
    name: {
      vi: 'Gùi Ba-hieng Cơ Tu',
      en: 'Cơ Tu Ba-hieng Carrying Basket'
    },
    category: 'weaving_craft',
    categoryName: {
      vi: 'Nghệ thuật đan lát',
      en: 'Traditional Basketry & Weaving'
    },
    thumbnail: '/images/basket-thumb.svg',
    originalImages: [
      '/images/basket-thumb.svg'
    ],
    model3D: '/models/bahieng-basket.glb',
    modelStatus: 'coming_soon',
    contentStatus: 'illustrative',
    brief: {
      vi: 'Chiếc gùi ba ngăn đặc trưng, minh chứng cho bàn tay khéo léo và óc thẩm mỹ tinh tế của người đàn ông Cơ Tu.',
      en: 'The iconic three-compartment backpack basket, showcasing the craftsmanship and aesthetic ingenuity of Cơ Tu weavers.'
    },
    description: {
      vi: 'Gùi Ba-hieng (hoặc Pơ-ngơr) là tác phẩm đan lát đỉnh cao của người Cơ Tu. Chiếc gùi có kết cấu chia ba ngăn độc đáo, đan bằng các sợi mây chuốt mỏng đều tăm tắp, phủ khói bồ hóng để chống ẩm mốc và tăng độ bền.',
      en: 'The Ba-hieng is considered the pinnacle of Cơ Tu basket-weaving mastery. Featuring three distinct compartments, it is hand-woven with uniformly sliced rattan strands, smoked over hearth embers to resist mildew and enhance longevity.'
    },
    sections: [
      {
        id: 'sec-bas-01',
        title: {
          vi: 'Cấu tạo Ba Ngăn Độc Đáo',
          en: 'Ingenious Three-Compartment Design'
        },
        content: {
          vi: 'Ngăn chính lớn nhất ở giữa dùng để đựng lương thực, săn bắn hoặc vật dụng lớn; hai ngăn nhỏ hai bên tiện lợi để cất nỏ tên, dao đi rừng, thuốc lá và vật tùy thân.',
          en: 'The prominent central compartment holds provisions, harvest, or large game, while two side pouches store hunting bows, arrows, bushcraft knives, and personal items.'
        }
      },
      {
        id: 'sec-bas-02',
        title: {
          vi: 'Kỹ thuật Xông Khói Chống Mối Mọt',
          en: 'Fireplace Smoking & Curing'
        },
        content: {
          vi: 'Sau khi đan xong, gùi được gác lên giàn bếp lửa nhiều tháng. Khói bếp tạo nên lớp màu cánh gián bóng loáng, chống mối mọt và nước mưa ngấm vào bên trong.',
          en: 'Upon completion, the basket is suspended over hearth smoke for months. The patina turns glossy amber, protecting the weave from insects and rain infiltration.'
        }
      }
    ],
    vocabulary: [
      {
        id: 'voc-bas-001',
        term: 'Rattan weaving',
        ipa: '/ˈrætæn ˈwiːvɪŋ/',
        vietnameseMeaning: 'Nghệ thuật đan mây',
        englishDefinition: 'The craft of interlacing flexible rattan fibers to make functional objects.',
        exampleSentence: {
          en: 'Rattan weaving is an ancestral skill passed down to young men.',
          vi: 'Đan mây là kỹ năng gia truyền được truyền dạy cho các chàng trai trẻ.'
        }
      },
      {
        id: 'voc-bas-002',
        term: 'Compartment',
        ipa: '/kəmˈpɑːtmənt/',
        vietnameseMeaning: 'Ngăn chứa riêng biệt',
        englishDefinition: 'One of the separate parts into which a space or container is divided.',
        exampleSentence: {
          en: 'The side compartment allows quick access to hunting tools.',
          vi: 'Ngăn bên hông giúp lấy dụng cụ săn bắn một cách nhanh chóng.'
        }
      },
      {
        id: 'voc-bas-003',
        term: 'Patina',
        ipa: '/ˈpætɪnə/',
        vietnameseMeaning: 'Lớp bóng màu thời gian / Lớp bồ hóng bếp',
        englishDefinition: 'A glossy surface sheen produced by age, handling, and hearth smoke.',
        exampleSentence: {
          en: 'Hearth smoke gives the basket a rich, protective patina.',
          vi: 'Khói bếp tạo cho chiếc gùi một lớp vỏ màu đậm đà, che chở khỏi mối mọt.'
        }
      }
    ],
    sources: [
      'Nghề thủ công truyền thống đồng bào dân tộc Cơ Tu - Sở VHTTDL Quảng Nam'
    ],
    verificationNote: 'Dữ liệu mô tả học thuật minh họa. Cần đối chiếu kích cỡ mẫu vật thực địa tại xã Dang.',
    dimensions: 'Cao ~55cm, Rộng ~35cm',
    materials: {
      vi: 'Mây rừng vót mỏng, dây vỏ cây rừng',
      en: 'Split forest rattan, wild tree bark fiber straps'
    },
    origin: {
      vi: 'Xã Dang / Xã Tr\'Hy, Huyện Tây Giang',
      en: 'Dang Commune / Tr\'Hy Commune, Tây Giang'
    }
  },
  {
    id: 'art-004',
    slug: 'trut-traditional-instrument',
    name: {
      vi: 'Đàn T\'rút Dân Gian',
      en: 'T\'rút Folk String Instrument'
    },
    category: 'musical_instrument',
    categoryName: {
      vi: 'Nhạc cụ cổ truyền',
      en: 'Traditional Musical Instruments'
    },
    thumbnail: '/images/trut-thumb.svg',
    originalImages: [
      '/images/trut-thumb.svg'
    ],
    model3D: '/models/trut.glb',
    modelStatus: 'coming_soon',
    contentStatus: 'illustrative',
    brief: {
      vi: 'Cây đàn dây truyền thống với bầu cộng hưởng từ quả bầu khô, mang giai điệu êm dịu gửi gắm tâm tình lứa đôi.',
      en: 'A traditional string instrument featuring a dried gourd resonator, producing soulful melodies of romance and kinship.'
    },
    description: {
      vi: 'Đàn T\'rút thường gồm một cần đàn bằng ống nứa hoặc gỗ dẻo gắn vào một quả bầu khô làm hộp cộng hưởng âm thanh. Dây đàn nguyên thủy làm từ tơ tằm rừng hoặc sợi kim loại mảnh, gảy bằng móng tay tạo nên thanh âm trong trẻo như suối ngàn Tây Giang.',
      en: 'The T\'rút instrument typically comprises a slender bamboo fingerboard attached to a hollowed dried gourd acting as an acoustic chamber. Its strings yield an ethereal timbre reminiscent of mountain streams.'
    },
    sections: [
      {
        id: 'sec-trut-01',
        title: {
          vi: 'Hộp Cộng Hưởng Quả Bầu',
          en: 'Dried Gourd Resonator'
        },
        content: {
          vi: 'Quả bầu già được chọn kỹ, khoét ruột rồi phơi khô tự nhiên. Miệng bầu áp nhẹ vào ngực người diễn tấu để điều chỉnh độ rung và độ trầm bổng của câu hát lý.',
          en: 'A matured bottle gourd is gutted and sun-dried. The player presses the aperture against their chest to modulate timbre and amplify melodic harmonics.'
        }
      }
    ],
    vocabulary: [
      {
        id: 'voc-trut-001',
        term: 'Gourd resonator',
        ipa: '/ɡʊəd ˈrezəneɪtər/',
        vietnameseMeaning: 'Hộp cộng hưởng bằng quả bầu',
        englishDefinition: 'A hollow dried calabash used to amplify the sound of stringed instruments.',
        exampleSentence: {
          en: 'The dried gourd resonator gives the instrument its uniquely warm sound.',
          vi: 'Hộp cộng hưởng quả bầu khô mang đến cho cây đàn âm thanh ấm áp độc đáo.'
        }
      },
      {
        id: 'voc-trut-002',
        term: 'Timbre',
        ipa: '/ˈtæmbər/',
        vietnameseMeaning: 'Âm sắc / Chất giọng nhạc cụ',
        englishDefinition: 'The character or quality of a musical sound or voice as distinct from its pitch.',
        exampleSentence: {
          en: 'The listener was captivated by the soothing timbre of the strings.',
          vi: 'Người nghe say đắm trước âm sắc êm dịu của những cung đàn.'
        }
      }
    ],
    sources: [
      'Tuyển tập Nhạc cụ truyền thống các dân tộc thiểu số miền Trung'
    ],
    verificationNote: 'Dữ liệu mô tả dùng cho học liệu ngữ cảnh CLIL.',
    dimensions: 'Dài cần ~70cm, Đường kính bầu ~18cm',
    materials: {
      vi: 'Cần tre/nứa, quả bầu khô, dây đàn',
      en: 'Bamboo neck, dried bottle gourd, plucked strings'
    },
    origin: {
      vi: 'Tây Giang, Quảng Nam',
      en: 'Tây Giang, Quảng Nam Province'
    }
  },
  {
    id: 'art-005',
    slug: 'tkoor-sacrifice-pillar',
    name: {
      vi: 'Cột Tế T\'kơơr',
      en: 'T\'kơơr Buffalo Sacrifice Pillar'
    },
    category: 'spiritual_sculpture',
    categoryName: {
      vi: 'Điêu khắc & Nghi lễ',
      en: 'Spiritual Sculpture & Rituals'
    },
    thumbnail: '/images/tkoor-thumb.svg',
    originalImages: [
      '/images/tkoor-thumb.svg'
    ],
    model3D: '/models/tkoor.glb',
    modelStatus: 'available',
    contentStatus: 'illustrative',
    brief: {
      vi: 'Đỉnh cao nghệ thuật điêu khắc gỗ dân gian Cơ Tu, tâm điểm của lễ hội tạ ơn trời đất Cha-ha-roo-tmee.',
      en: 'The apex of Cơ Tu folk woodcarving, serving as the ceremonial focal point for the Cha-ha-roo-tmee harvest thanksgiving feast.'
    },
    description: {
      vi: 'Cột tế T\'kơơr được dựng trước sân nhà Gươl mỗi dịp lễ lớn. Thân cột được chạm khắc đa tầng với họa tiết mặt trời, sao hôm, hoa văn hình học thổ cẩm và ngọn phướn vươn cao lên bầu trời như chiếc cầu nối thông điệp giữa con người và thế giới thần linh.',
      en: 'The T\'kơơr pillar is raised in the central courtyard fronting the Gươl during paramount festivals. Carved with multi-tiered motifs of the radiant sun, sacred geometric symbols, and soaring decorative banners, it bridges mortal prayers to heavenly deities.'
    },
    sections: [
      {
        id: 'sec-tk-01',
        title: {
          vi: 'Biểu tượng Hoa Văn Tinh Xảo',
          en: 'Symbolic Motif Hierarchies'
        },
        content: {
          vi: 'Từ dưới lên trên, cột tế chia làm các tầng biểu tượng cho đất mẹ, sự sống muôn loài và các tầng trời. Mỗi nét chạm khắc đều mang đậm tư duy vũ trụ luận của người Cơ Tu vùng cao.',
          en: 'From base to crown, the pillar symbolizes mother earth, terrestrial vitality, and the celestial spheres, crystallizing the cosmological worldview of highlander ancestors.'
        }
      }
    ],
    vocabulary: [
      {
        id: 'voc-tk-001',
        term: 'Sacrificial pillar',
        ipa: '/ˌsækrɪˈfɪʃl ˈpɪlər/',
        vietnameseMeaning: 'Cột tế lễ',
        englishDefinition: 'A sacred post used as the center of ceremonial offerings.',
        exampleSentence: {
          en: 'Elders adorned the sacrificial pillar with woven streamers and offerings.',
          vi: 'Các già làng trang hoàng cột tế bằng dải cờ đan và lễ vật.'
        }
      },
      {
        id: 'voc-tk-002',
        term: 'Cosmology',
        ipa: '/kɒzˈmɒlədʒi/',
        vietnameseMeaning: 'Vũ trụ luận / Quan niệm về thế giới vũ trụ',
        englishDefinition: 'The science or philosophical view of the origin and development of the universe.',
        exampleSentence: {
          en: 'Traditional carvings reflect the indigenous cosmology of the mountain people.',
          vi: 'Những nét chạm khắc cổ truyền phản ánh vũ trụ quan bản địa của đồng bào vùng cao.'
        }
      }
    ],
    sources: [
      'Nghiên cứu văn hóa lễ hội đâm trâu dân tộc Cơ Tu - Viện Văn hóa Dân gian'
    ],
    verificationNote: 'Dữ liệu học liệu minh họa. Cần xác nhận chi tiết hoa văn cùng ban quản lý di sản Tây Giang.',
    dimensions: 'Cao ~4m - 5.5m',
    materials: {
      vi: 'Gỗ rừng nguyên khối, màu tự nhiên từ lá và khoáng vật',
      en: 'Single solid timber trunk, natural mineral and leaf pigments'
    },
    origin: {
      vi: 'Huyện Tây Giang, Quảng Nam',
      en: 'Tây Giang District, Quảng Nam Province'
    }
  }
];

