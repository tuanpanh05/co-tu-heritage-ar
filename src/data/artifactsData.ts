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
    thumbnail: '/images/guol-authentic.jpg',
    originalImages: [
      '/images/guol-authentic.jpg'
    ],
    model3D: '/models/guol.glb',
    modelStatus: 'available', // Mô hình 3D scan thực tế
    contentStatus: 'verified',
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
    thumbnail: '/images/drum-authentic.jpg',
    originalImages: [
      '/images/drum-authentic.jpg'
    ],
    model3D: '/models/ktu-drum.glb',
    modelStatus: 'available',
    contentStatus: 'verified',
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
    thumbnail: '/images/basket-authentic.jpg',
    originalImages: [
      '/images/basket-authentic.jpg'
    ],
    model3D: '/models/bahieng-basket.glb',
    modelStatus: 'available',
    contentStatus: 'verified',
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
    slug: 'chieng-gong-instrument',
    name: {
      vi: 'Chiêng Đồng Cơ Tu (Chiing)',
      en: 'Cơ Tu Sacred Bronze Gong'
    },
    category: 'musical_instrument',
    categoryName: {
      vi: 'Nhạc cụ cổ truyền',
      en: 'Traditional Musical Instruments'
    },
    thumbnail: '/images/chieng-authentic.jpg',
    originalImages: [
      '/images/chieng-authentic.jpg'
    ],
    model3D: '/models/chieng.glb',
    modelStatus: 'available',
    contentStatus: 'verified',
    brief: {
      vi: 'Báu vật thiêng liêng lưu truyền qua nhiều thế hệ, thanh âm trầm hùng kết nối con người với thần linh và núi rừng Trường Sơn.',
      en: 'A sacred ancestral heirloom whose metallic resonance echoes through the Trường Sơn mountains, bridging mortals with celestial spirits.'
    },
    description: {
      vi: 'Chiêng đồng (tiếng Cơ Tu gọi là Chiing) là một trong những tài sản quý giá nhất trong mỗi gia đình và buôn làng Cơ Tu. Chiêng thường được đúc bằng hợp kim đồng với núm tròn ở tâm (hoặc chiêng bằng), khi diễn tấu hòa nhịp cùng tiếng trống Cơ Tu tạo nên dàn hợp xướng âm vang trầm hùng trong ngày hội mừng lúa mới, lễ hội đâm trâu và lễ tạ ơn Giàng.',
      en: 'The bronze gong (known as Chiing in the Cơ Tu language) is among the most prized ceremonial heirlooms in Cơ Tu villages. Cast in resonant bronze alloy, it synchronizes with traditional drums during harvest thanksgiving and spiritual celebrations.'
    },
    sections: [
      {
        id: 'sec-chieng-01',
        title: {
          vi: 'Kỹ Thuật Đúc & Âm Sắc Trầm Hùng',
          en: 'Acoustic Resonance & Bronze Casting'
        },
        content: {
          vi: 'Hợp kim đồng thiếc qua kỹ thuật chỉnh âm tinh xảo của các nghệ nhân tạo nên độ rền vang ngân dài. Mỗi chiếc chiêng trong dàn tấu đều giữ một cao độ riêng biệt, phối hợp nhịp nhàng tạo thành bản hòa âm đa sắc.',
          en: 'Skilled metallurgists tune the bronze alloy to generate long-lasting vibrational sustain. Each gong in the village ensemble contributes a distinct pitch to form a harmonious polyrhythmic soundscape.'
        }
      },
      {
        id: 'sec-chieng-02',
        title: {
          vi: 'Giá Trị Gia Bảo & Biểu Tượng Gắn Kết',
          en: 'Heirloom Value & Social Solidarity'
        },
        content: {
          vi: 'Trong luật tục Cơ Tu, chiêng đồng là thước đo sự thịnh vượng và là lễ vật danh giá nhất trong nghi lễ cưới hỏi, tạ ơn và liên minh giữa các bản làng.',
          en: 'Within Cơ Tu customary traditions, gongs embody community wealth and represent the most prestigious offering in marriages, peace alliances, and harvest thanksgiving rituals.'
        }
      }
    ],
    vocabulary: [
      {
        id: 'voc-ch-001',
        term: 'Bronze gong',
        ipa: '/brɒnz ɡɒŋ/',
        vietnameseMeaning: 'Chiêng đồng / Cồng chiêng',
        englishDefinition: 'A metal percussion instrument made of bronze alloy that produces a rich ringing sound.',
        exampleSentence: {
          en: 'The resonant sound of the bronze gong echoed across the mountain valley.',
          vi: 'Âm vang trầm hùng của chiếc chiêng đồng vang vọng khắp thung lũng núi.'
        }
      },
      {
        id: 'voc-ch-002',
        term: 'Ancestral heirloom',
        ipa: '/ænˈsestrəl ˈeəluːm/',
        vietnameseMeaning: 'Báu vật gia bảo của tổ tiên để lại',
        englishDefinition: 'A valuable object that has belonged to a family or clan for several generations.',
        exampleSentence: {
          en: 'The sacred gongs are preserved as cherished ancestral heirlooms.',
          vi: 'Những chiếc chiêng thiêng được gìn giữ như báu vật gia bảo quý giá của tổ tiên.'
        }
      },
      {
        id: 'voc-ch-003',
        term: 'Polyrhythm',
        ipa: '/ˌpɒliˈrɪðəm/',
        vietnameseMeaning: 'Tiết tấu phức hợp / Đa tiết tấu hòa âm',
        englishDefinition: 'The simultaneous use of two or more conflicting rhythms in musical performance.',
        exampleSentence: {
          en: 'Gong players synchronize to produce a mesmerizing polyrhythm.',
          vi: 'Các nghệ nhân gõ chiêng hòa nhịp tạo nên chuỗi phức điệu đa tiết tấu mê hoặc.'
        }
      }
    ],
    sources: [
      'Không gian Văn hóa Cồng Chiêng - Viện Âm nhạc Quốc gia Việt Nam',
      'Tài liệu nghiên cứu âm nhạc dân gian Cơ Tu Tây Giang'
    ],
    verificationNote: 'Mô hình 3D thực tế scan từ hiện vật chiêng đồng cổ truyền Cơ Tu Tây Giang.',
    dimensions: 'Đường kính ~50cm, Độ sâu vành ~8cm, Trọng lượng ~5.2kg',
    materials: {
      vi: 'Hợp kim đồng thiếc cổ truyền, quai đeo dây mây',
      en: 'Traditional bronze-tin alloy, braided rattan suspension loop'
    },
    origin: {
      vi: 'Huyện Tây Giang, Quảng Nam',
      en: 'Tây Giang District, Quảng Nam Province'
    }
  },
  {
    id: 'art-005',
    slug: 'ao-nam-cotu',
    name: {
      vi: 'Áo Nam Thổ Cẩm Cơ Tu',
      en: 'Cơ Tu Men\'s Brocade Tunic'
    },
    category: 'weaving_craft',
    categoryName: {
      vi: 'Nghệ thuật đan lát & Dệt thổ cẩm',
      en: 'Traditional Basketry & Weaving'
    },
    thumbnail: '/images/aonam_v2.png',
    originalImages: [
      '/images/aonam_v2.png'
    ],
    model3D: '/models/ao-nam.glb',
    modelStatus: 'available',
    contentStatus: 'verified',
    brief: {
      vi: 'Trang phục truyền thống của đàn ông Cơ Tu với dải hoa văn cườm trắng đính kết kỳ công trên nền vải đen đỏ trầm ấm.',
      en: 'Traditional sleeveless vest worn by Cơ Tu men, featuring meticulous white beadwork geometric motifs woven into dark cotton fabric.'
    },
    description: {
      vi: 'Áo nam Cơ Tu (áo cộc không tay hoặc khoác chui đầu) được dệt từ sợi bông rừng nhuộm màu tự nhiên bằng vỏ cây, củ nâu và bùn suối. Điểm độc đáo nhất là kỹ thuật chèn hạt cườm trắng trực tiếp vào sợi chỉ trong quá trình dệt trên khung cửi dệt thắt lưng, tạo nên các đồ án hoa văn hình thoi, răng cưa và chim muông đầy dũng khí.',
      en: 'The Cơ Tu male tunic is handwoven on backstrap looms from native cotton colored with natural forest dyes. Master weavers insert white seed beads directly onto weft threads to form geometric lozenges, jagged teeth, and wildlife emblems symbolizing strength.'
    },
    sections: [
      {
        id: 'sec-aonam-01',
        title: {
          vi: 'Kỹ Thuật Dệt Luồn Cườm Độc Bản',
          en: 'Unique In-Weft Seed Bead Insertion'
        },
        content: {
          vi: 'Khác với thêu đính thông thường, người phụ nữ Cơ Tu xỏ từng hạt cườm trắng vào sợi chỉ ngang khi đang dệt trên khung cửi thắt lưng, giúp hoa văn cườm chìm sâu bền chặt vào thớ vải và không bao giờ bung tuột.',
          en: 'Unlike surface embroidery, artisans thread seed beads directly into weft yarns on backstrap looms, locking each bead firmly into the fabric structure for enduring durability.'
        }
      },
      {
        id: 'sec-aonam-02',
        title: {
          vi: 'Sắc Màu & Khí Phách Người Đàn Ông Cơ Tu',
          en: 'Color Symbology & Highland Masculinity'
        },
        content: {
          vi: 'Sự kết hợp giữa màu đen (đất mẹ, rừng già), màu đỏ (lửa thiêng, lòng dũng cảm) và cườm trắng (sao trời, tinh khiết) tôn lên vóc dáng khỏe khoắn của các thợ săn và chiến binh miền sơn cước.',
          en: 'The harmony of black (fertile soil), crimson red (sacred hearth fire), and white beads (starlight and integrity) reflects the valor and physical vitality of highland hunters.'
        }
      }
    ],
    vocabulary: [
      {
        id: 'voc-an-001',
        term: 'Backstrap loom',
        ipa: '/ˈbækstræp luːm/',
        vietnameseMeaning: 'Khung cửi luồn thắt lưng truyền thống',
        englishDefinition: 'A simple portable loom where the warp is tensioned around the weaver\'s waist.',
        exampleSentence: {
          en: 'Highland women weave exquisite brocade textiles using a backstrap loom.',
          vi: 'Phụ nữ vùng cao dệt nên những tấm thổ cẩm tinh xảo bằng khung cửi thắt lưng.'
        }
      },
      {
        id: 'voc-an-002',
        term: 'Seed bead',
        ipa: '/siːd biːd/',
        vietnameseMeaning: 'Hạt cườm nhỏ dệt hoa văn',
        englishDefinition: 'Small rounded beads woven or sewn into textiles for ornamental relief.',
        exampleSentence: {
          en: 'Rows of white seed beads form diamond motifs across the tunic chest.',
          vi: 'Những hàng hạt cườm trắng tạo thành hoa văn hình thoi trên ngực áo.'
        }
      },
      {
        id: 'voc-an-003',
        term: 'Natural dye',
        ipa: '/ˈnætʃrəl daɪ/',
        vietnameseMeaning: 'Thuốc nhuộm tự nhiên từ cây cỏ',
        englishDefinition: 'Dyes derived from plants, minerals, or invertebrates without artificial chemicals.',
        exampleSentence: {
          en: 'Forest bark and roots provide rich natural dyes that do not fade easily.',
          vi: 'Vỏ cây và rễ rừng cung cấp thuốc nhuộm tự nhiên đậm đà, khó phai màu.'
        }
      }
    ],
    sources: [
      'Nghệ thuật dệt thổ cẩm đính cườm của người Cơ Tu - Bảo tàng Văn hóa Dân tộc',
      'Khảo cứu trang phục cổ truyền Cơ Tu Tây Giang'
    ],
    verificationNote: 'Mô hình 3D scan thực tế từ áo thổ cẩm nam Cơ Tu Tây Giang.',
    dimensions: 'Dài ~68cm, Rộng ngang vai ~48cm',
    materials: {
      vi: 'Sợi bông tự nhiên, nhuộm chàm và vỏ cây rừng, chuỗi hạt cườm trắng',
      en: 'Indigenous hand-spun cotton, natural bark dyes, white seed beads'
    },
    origin: {
      vi: 'Xã Dang, Huyện Tây Giang, Quảng Nam',
      en: 'Dang Commune, Tây Giang District, Quảng Nam'
    }
  },
  {
    id: 'art-006',
    slug: 'ao-nu-cotu',
    name: {
      vi: 'Váy Áo Thổ Cẩm Nữ Cơ Tu',
      en: 'Cơ Tu Women\'s Brocade Costume'
    },
    category: 'weaving_craft',
    categoryName: {
      vi: 'Nghệ thuật đan lát & Dệt thổ cẩm',
      en: 'Traditional Basketry & Weaving'
    },
    thumbnail: '/images/aonu_v2.png',
    originalImages: [
      '/images/aonu_v2.png'
    ],
    model3D: '/models/ao-nu.glb',
    modelStatus: 'available',
    contentStatus: 'verified',
    brief: {
      vi: 'Bộ trang phục duyên dáng của người phụ nữ Cơ Tu, dệt đính hạt cườm hoa văn Zút Chơ-rơ biểu trưng cho sự uyển chuyển và sức sống đại ngàn.',
      en: 'Graceful ceremonial dress worn by Cơ Tu women, featuring the exquisite Zút Chơ-rơ beaded motifs symbolizing river ripples and mountain vitality.'
    },
    description: {
      vi: 'Trang phục nữ Cơ Tu gồm áo chui đầu ngắn hoặc yếm kết hợp cùng váy quấn dài (chơ-rơ). Từng đường nét hoa văn zút cườm trắng trên nền vải đen tuyền thể hiện sự khéo léo, kiên nhẫn và thẩm mỹ tinh tế của người phụ nữ Cơ Tu. Bộ trang phục rực rỡ nhất khi các thiếu nữ nhảy múa điệu Da dá mềm mại dâng trời.',
      en: 'The women\'s ensemble consists of a short fitted blouse and an elegant wrap-around skirt (chơ-rơ). Meticulous rows of white beads contrast with deep black cloth, shining radiantly as women perform the sacred Da dá celestial dance.'
    },
    sections: [
      {
        id: 'sec-aonu-01',
        title: {
          vi: 'Hoa Văn Zút Chơ-rơ & Điệu Múa Da Dá',
          en: 'Zút Chơ-rơ Motifs & The Da Dá Dance'
        },
        content: {
          vi: 'Hoa văn dệt cườm gợn sóng Zút Chơ-rơ mô phỏng dòng suối và ngọn sóng đại ngàn. Khi các cô gái Cơ Tu giơ tay nâng ngang vai múa điệu Da dá nhịp nhàng, tà váy dệt cườm lấp lánh như ngàn ánh sao trong đêm hội.',
          en: 'The wave-like Zút Chơ-rơ bead pattern represents mountain rivers. During the graceful Da dá ritual dance, the beadwork glitters like constellations across the nighttime village square.'
        }
      },
      {
        id: 'sec-aonu-02',
        title: {
          vi: 'Biểu Tượng Của Tình Yêu & Khéo Léo',
          en: 'Emblem of Tenderness & Matriarchal Skill'
        },
        content: {
          vi: 'Để hoàn thành một bộ váy áo dệt cườm, người con gái Cơ Tu phải dồn tâm huyết hàng tháng trời. Đây là thước đo sự cần cù, phẩm hạnh và là của hồi môn quý giá nhất trước khi bước về nhà chồng.',
          en: 'Crafting a complete beaded skirt takes months of patient dedication, serving as a revered benchmark of perseverance and an esteemed bridal dowry.'
        }
      }
    ],
    vocabulary: [
      {
        id: 'voc-anu-001',
        term: 'Wrap skirt',
        ipa: '/ræp skɜːt/',
        vietnameseMeaning: 'Váy quấn truyền thống (Chơ-rơ)',
        englishDefinition: 'A skirt that folds around the waist and is secured with ties or overlap.',
        exampleSentence: {
          en: 'She fastened her ceremonial wrap skirt before stepping into the dance circle.',
          vi: 'Cô gái thắt chặt chiếc váy quấn lễ hội trước khi bước vào vòng xoang múa.'
        }
      },
      {
        id: 'voc-anu-002',
        term: 'Ripple pattern',
        ipa: '/ˈrɪpl ˈpætən/',
        vietnameseMeaning: 'Hoa văn gợn sóng nước (Zút Chơ-rơ)',
        englishDefinition: 'A wavy decorative pattern resembling surface movements of water.',
        exampleSentence: {
          en: 'The ripple pattern symbolizes the flowing streams of the Trường Sơn forest.',
          vi: 'Hoa văn gợn sóng tượng trưng cho dòng suối nguồn chảy qua đại ngàn Trường Sơn.'
        }
      },
      {
        id: 'voc-anu-003',
        term: 'Ceremonial attire',
        ipa: '/ˌserɪˈməʊniəl əˈtaɪər/',
        vietnameseMeaning: 'Lễ phục / Trang phục trang trọng trong ngày hội',
        englishDefinition: 'Clothing worn specifically for religious, customary, or special occasions.',
        exampleSentence: {
          en: 'Villagers wear their finest ceremonial attire during the harvest festival.',
          vi: 'Dân làng mặc bộ lễ phục đẹp nhất trong ngày hội mừng mùa màng bội thu.'
        }
      }
    ],
    sources: [
      'Văn hóa trang phục cổ truyền dân tộc Cơ Tu - Sở Văn hóa Thể thao và Du lịch Quảng Nam',
      'Bộ sưu tập dệt may thổ cẩm Tây Giang'
    ],
    verificationNote: 'Mô hình 3D scan thực tế từ váy áo thổ cẩm nữ Cơ Tu Tây Giang.',
    dimensions: 'Chiều dài váy ~85cm, Độ xòe quấn ~130cm',
    materials: {
      vi: 'Sợi bông tự nhiên, nhuộm chàm đen và rễ cây, cườm hạt trắng',
      en: 'Hand-woven natural cotton, black indigo and root dyes, white seed beads'
    },
    origin: {
      vi: 'Huyện Tây Giang, Quảng Nam',
      en: 'Tây Giang District, Quảng Nam Province'
    }
  },
  {
    id: 'art-007',
    slug: 'tuong-te-te-cotu',
    name: {
      vi: 'Điêu Khắc Con Tê Tê Cơ Tu',
      en: 'Cơ Tu Wood-Carved Pangolin Sculpture'
    },
    category: 'spiritual_sculpture',
    categoryName: {
      vi: 'Điêu khắc & Tâm linh',
      en: 'Spiritual Sculpture & Rituals'
    },
    thumbnail: '/images/tete_v2.png',
    originalImages: [
      '/images/tete_v2.png'
    ],
    model3D: '/models/te-te.glb',
    modelStatus: 'available',
    contentStatus: 'verified',
    brief: {
      vi: 'Tác phẩm điêu khắc gỗ dân gian khắc họa loài tê tê rừng, biểu tượng gắn bó mật thiết với thiên nhiên hoang dã của vùng cao Tây Giang.',
      en: 'Folk timber sculpture portraying the mountain pangolin, a revered wild creature deeply woven into highland forest folklore.'
    },
    description: {
      vi: 'Trong kho tàng điêu khắc gỗ Cơ Tu bài trí quanh nhà Gươl và nhà mồ, hình tượng muông thú rừng sâu như kỳ đà, chim trĩ và tê tê được đẽo tạc mộc mạc mà vô cùng sống động. Con tê tê với lớp vảy xếp lớp hình vòm cung được nghệ nhân Cơ Tu tạo hình bằng rìu và đục tay từ thân gỗ nguyên khối, phản ánh cái nhìn hòa hợp và kính ngưỡng đối với vạn vật trong rừng già.',
      en: 'Within the rich repertoire of Cơ Tu folk woodcarvings displayed in Gươl houses and memorial sites, forest wildlife such as pangolins, monitor lizards, and pheasants are chiseled from single timber logs. The armored pangolin with its interlocking arched scales symbolizes harmony between mankind and virgin rainforests.'
    },
    sections: [
      {
        id: 'sec-tete-01',
        title: {
          vi: 'Nghệ Thuật Đục Đẽo Gỗ Nguyên Khối',
          en: 'Direct Chisel & Monolithic Woodcarving'
        },
        content: {
          vi: 'Nghệ nhân dùng rìu thô và đục sắt gọt tỉa từng lớp vảy lưng uốn lượn theo dáng cong tự nhiên của khúc gỗ rừng. Bề mặt gỗ giữ nguyên vết đục mộc mạc, tạo nên nét đẹp nguyên sơ đầy biểu cảm.',
          en: 'Using iron chisels and hand adzes, carvers shape arched dorsal scales following the organic curvature of the timber log, preserving tactile chisel strokes that evoke primal expressive power.'
        }
      },
      {
        id: 'sec-tete-02',
        title: {
          vi: 'Hình Tượng Muông Thú & Triết Lý Rừng Già',
          en: 'Forest Fauna & Highland Ecological Cosmology'
        },
        content: {
          vi: 'Người Cơ Tu quan niệm muông thú trong rừng già Tây Giang đều có linh hồn và là sứ giả của Giàng rừng. Tác phẩm điêu khắc nhắc nhở con cháu giữ gìn và bảo vệ rừng thiêng đầu nguồn.',
          en: 'In Cơ Tu cosmology, mountain creatures embody forest spirits and serve as messengers of nature deities (Giàng), reminding generations to safeguard sacred watershed forests.'
        }
      }
    ],
    vocabulary: [
      {
        id: 'voc-tt-001',
        term: 'Wood carving',
        ipa: '/wʊd ˈkɑːvɪŋ/',
        vietnameseMeaning: 'Nghệ thuật điêu khắc gỗ',
        englishDefinition: 'The craft of cutting and shaping wood to form artistic decorative figures.',
        exampleSentence: {
          en: 'Cơ Tu wood carving reflects a profound kinship with wild nature.',
          vi: 'Nghệ thuật điêu khắc gỗ Cơ Tu phản ánh mối giao cảm sâu sắc với thiên nhiên hoang dã.'
        }
      },
      {
        id: 'voc-tt-002',
        term: 'Pangolin',
        ipa: '/ˈpæŋɡəlɪn/',
        vietnameseMeaning: 'Con tê tê (loài thú vảy quý hiếm)',
        englishDefinition: 'An insect-eating mammal having a body covered with hard protective keratin scales.',
        exampleSentence: {
          en: 'The pangolin is sculpted with curved geometric scales representing its protective armor.',
          vi: 'Con tê tê được tạc với lớp vảy hình học uốn cong tượng trưng cho lớp áo giáp bảo vệ.'
        }
      },
      {
        id: 'voc-tt-003',
        term: 'Monolithic sculpture',
        ipa: '/ˌmɒnəˈlɪθɪk ˈskʌlptʃər/',
        vietnameseMeaning: 'Tác phẩm điêu khắc từ một khối nguyên vẹn',
        englishDefinition: 'A sculpture made from a single solid block or trunk of material.',
        exampleSentence: {
          en: 'The craftsman carved the animal from a monolithic log of durable forest wood.',
          vi: 'Nghệ nhân đã tạc nên con vật từ một thân gỗ rừng nguyên khối chắc chắn.'
        }
      }
    ],
    sources: [
      'Điêu khắc dân gian Cơ Tu - Viện Mỹ thuật Việt Nam',
      'Tư liệu di sản điêu khắc gỗ Tây Giang'
    ],
    verificationNote: 'Mô hình 3D scan thực tế từ tác phẩm điêu khắc gỗ con tê tê Cơ Tu Tây Giang.',
    dimensions: 'Dài ~62cm, Rộng ~24cm, Cao ~18cm, Nặng ~4.5kg',
    materials: {
      vi: 'Gỗ rừng nguyên khối, xông khói bếp chống mối mọt',
      en: 'Solid indigenous forest timber, cured with traditional hearth smoke'
    },
    origin: {
      vi: 'Xã Tr\'Hy, Huyện Tây Giang, Quảng Nam',
      en: 'Tr\'Hy Commune, Tây Giang District, Quảng Nam'
    }
  }
];

