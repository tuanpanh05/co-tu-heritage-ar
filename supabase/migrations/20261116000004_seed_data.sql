-- =============================================================================
-- CO-TU HERITAGE AR: COMPREHENSIVE SEED DATA
-- Migration: 20261116000004_seed_data.sql
-- =============================================================================

DO $$
DECLARE
  cat_arch_id UUID;
  cat_music_id UUID;
  cat_weav_id UUID;
  cat_sculp_id UUID;
  cat_daily_id UUID;
  art_id UUID;
BEGIN

-- -----------------------------------------------------------------------------
-- 1. SEED CATEGORIES
-- -----------------------------------------------------------------------------
INSERT INTO public.artifact_categories (slug, name_vi, name_en, description_vi, description_en, display_order)
VALUES
  ('architecture', 'Kiến trúc truyền thống', 'Traditional Architecture', 'Nhà Gươl và không gian kiến trúc bản địa của người Cơ Tu', 'Gươl communal house and vernacular architecture of Cơ Tu people', 1),
  ('musical_instrument', 'Nhạc cụ cổ truyền', 'Traditional Musical Instruments', 'Trống K''''tu, chiêng đồng và âm nhạc tâm linh đại ngàn', 'K''''tu drums, bronze gongs, and highland ceremonial soundscapes', 2),
  ('weaving_craft', 'Đan lát & Dệt thổ cẩm', 'Basketry & Brocade Weaving', 'Nghề dệt thổ cẩm đính cườm và đan gùi Ba-hieng tinh xảo', 'Beaded brocade weaving and master Ba-hieng rattan basketry', 3),
  ('spiritual_sculpture', 'Điêu khắc & Tâm linh', 'Spiritual Sculpture', 'Nghệ thuật đẽo khắc gỗ cột tế T''''kơơr và linh vật rừng già', 'Master woodcarvings of ceremonial poles and sacred wildlife', 4),
  ('daily_tool', 'Công cụ đời sống', 'Daily Living & Hunting Tools', 'Vật dụng sinh hoạt, săn bắt và sản xuất nương rẫy truyền thống', 'Traditional tools for domestic living, foraging, and hunting', 5)
ON CONFLICT (slug) DO UPDATE SET
  name_vi = EXCLUDED.name_vi,
  name_en = EXCLUDED.name_en,
  description_vi = EXCLUDED.description_vi,
  description_en = EXCLUDED.description_en,
  display_order = EXCLUDED.display_order;

SELECT id INTO cat_arch_id FROM public.artifact_categories WHERE slug = 'architecture';
SELECT id INTO cat_music_id FROM public.artifact_categories WHERE slug = 'musical_instrument';
SELECT id INTO cat_weav_id FROM public.artifact_categories WHERE slug = 'weaving_craft';
SELECT id INTO cat_sculp_id FROM public.artifact_categories WHERE slug = 'spiritual_sculpture';
SELECT id INTO cat_daily_id FROM public.artifact_categories WHERE slug = 'daily_tool';

-- -----------------------------------------------------------------------------
-- 2. SEED ARTIFACTS
-- -----------------------------------------------------------------------------

-- Artifact: guol-communal-house
INSERT INTO public.artifacts (
  slug,
  category_id,
  name_vi,
  name_en,
  short_description_vi,
  short_description_en,
  description_vi,
  description_en,
  origin_vi,
  origin_en,
  materials_vi,
  materials_en,
  dimensions,
  historical_story_vi,
  historical_story_en,
  cultural_meaning_vi,
  cultural_meaning_en,
  thumbnail_path,
  model_3d_path,
  model_status,
  content_status,
  verification_note,
  sources,
  audio_vi_path,
  audio_en_path,
  qr_code,
  sections,
  is_published,
  display_order
) VALUES (
  'guol-communal-house',
  cat_arch_id,
  'Nhà Gươl Truyền Thống',
  'Gươl Communal House',
  'Nhà sinh hoạt cộng đồng linh thiêng, trái tim văn hóa và trung tâm gắn kết cộng đồng làng của người Cơ Tu tại Tây Giang.',
  'The sacred communal house, cultural heart, and unity hub of the Cơ Tu village community in Tây Giang.',
  'Nhà Gươl là biểu tượng kiến trúc đặc trưng và thiêng liêng nhất của người Cơ Tu. Được dựng ở vị trí trung tâm làng, nhà Gươl có cấu trúc hình mai rùa hoặc oval đặc biệt, mái lợp lá mây hoặc lá nón, chống đỡ bởi cây cột cái (ki’lơm) khắc họa nhiều hình tượng muông thú và đời sống săn bắn.',
  'The Gươl communal house is the most revered architectural symbol of the Cơ Tu people. Positioned at the village center, it features an oval or turtle-shell roof thatched with rattan leaves, supported by a central pillar (ki’lơm) carved with intricate relief motifs of wild fauna and tribal hunting life.',
  'Huyện Tây Giang, Tỉnh Quảng Nam',
  'Tây Giang District, Quảng Nam Province',
  'Gỗ lim/kiền kiền, mây rừng, tre nứa, lá nón',
  'Indigenous hardwood, wild forest rattan, bamboo, palm leaves',
  'Dài ~15m, Rộng ~8m, Cao ~9m (Kích thước trung bình)',
  'Trong quan niệm người Cơ Tu, Gươl là nơi trú ngụ của các vị thần bảo hộ buôn làng (Giàng). Mọi nghi lễ quan trọng, phân xử luật tục, lễ đâm trâu (Cha-ha-roo-tmee) và tiếp đãi khách quý đều diễn ra tại đây.',
  'In Cơ Tu cosmology, the Gươl is the sanctuary of the protective village deities (Giàng). Important tribal rituals, customary dispute resolutions, sacrificial ceremonies, and hospitality for distinguished guests are held inside.',
  'Cột cái là linh hồn của ngôi nhà Gươl, được đẽo từ thân gỗ nguyên khối bền chắc. Trên cột và xà ngang, nghệ nhân Cơ Tu chạm nổi hình ảnh chim trĩ, kỳ đà, đầu trâu và cảnh múa Tung tung Da dá truyền thống.',
  'The master pillar (Ki''lơm) serves as the structural and spiritual backbone of the Gươl. Master craftsmen carve bas-relief representations of pheasants, monitor lizards, water buffalo heads, and the festive Tung tung Da dá dance.',
  '/images/guol-authentic.jpg',
  '/models/guol.glb',
  'available',
  'verified',
  'Dữ liệu văn hóa và hình ảnh minh họa phục vụ nghiên cứu sư phạm CLIL. Đang chờ đối chiếu thực địa cùng già làng Tây Giang.',
  ARRAY['Bảo tàng Điêu khắc Chăm Đà Nẵng - Bộ sưu tập Văn hóa Cơ Tu', 'Tài liệu nghiên cứu văn hóa dân gian Huyện Tây Giang, Tỉnh Quảng Nam']::text[],
  '',
  '',
  'guol-communal-house',
  '[{"id":"sec-01","title":{"vi":"Vị thế và Ý nghĩa Không gian","en":"Spatial Hierarchy and Sacred Meaning"},"content":{"vi":"Trong quan niệm người Cơ Tu, Gươl là nơi trú ngụ của các vị thần bảo hộ buôn làng (Giàng). Mọi nghi lễ quan trọng, phân xử luật tục, lễ đâm trâu (Cha-ha-roo-tmee) và tiếp đãi khách quý đều diễn ra tại đây.","en":"In Cơ Tu cosmology, the Gươl is the sanctuary of the protective village deities (Giàng). Important tribal rituals, customary dispute resolutions, sacrificial ceremonies, and hospitality for distinguished guests are held inside."}},{"id":"sec-02","title":{"vi":"Kỹ thuật Khắc họa & Cột Cái (Ki''lơm)","en":"Woodcarving Art & Central Pillar (Ki''lơm)"},"content":{"vi":"Cột cái là linh hồn của ngôi nhà Gươl, được đẽo từ thân gỗ nguyên khối bền chắc. Trên cột và xà ngang, nghệ nhân Cơ Tu chạm nổi hình ảnh chim trĩ, kỳ đà, đầu trâu và cảnh múa Tung tung Da dá truyền thống.","en":"The master pillar (Ki''lơm) serves as the structural and spiritual backbone of the Gươl. Master craftsmen carve bas-relief representations of pheasants, monitor lizards, water buffalo heads, and the festive Tung tung Da dá dance."}},{"id":"sec-03","title":{"vi":"Vật liệu Bản địa & Kỹ thuật Xây dựng","en":"Indigenous Materials & Architectural Joinery"},"content":{"vi":"Công trình hoàn toàn sử dụng vật liệu tự nhiên từ rừng Tây Giang: gỗ kiền kiền, mây rừng, tre nứa. Các cấu kiện được liên kết bằng kỹ thuật ngoàm, ngàm chốt mộng và buộc dây mây dẻo dai mà không cần một chiếc đinh sắt nào.","en":"Constructed entirely from local forest resources: durable timber, bamboo, and wild rattan. Structural components rely on traditional mortise-and-tenon joints secured by supple rattan bindings without any iron nails."}}]'::jsonb,
  true,
  1
)
ON CONFLICT (slug) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  name_vi = EXCLUDED.name_vi,
  name_en = EXCLUDED.name_en,
  short_description_vi = EXCLUDED.short_description_vi,
  short_description_en = EXCLUDED.short_description_en,
  description_vi = EXCLUDED.description_vi,
  description_en = EXCLUDED.description_en,
  origin_vi = EXCLUDED.origin_vi,
  origin_en = EXCLUDED.origin_en,
  materials_vi = EXCLUDED.materials_vi,
  materials_en = EXCLUDED.materials_en,
  dimensions = EXCLUDED.dimensions,
  thumbnail_path = EXCLUDED.thumbnail_path,
  model_3d_path = EXCLUDED.model_3d_path,
  model_status = EXCLUDED.model_status,
  content_status = EXCLUDED.content_status,
  sections = EXCLUDED.sections,
  is_published = true,
  display_order = EXCLUDED.display_order;

SELECT id INTO art_id FROM public.artifacts WHERE slug = 'guol-communal-house';

-- Images for guol-communal-house
DELETE FROM public.artifact_images WHERE artifact_id = art_id;
INSERT INTO public.artifact_images (artifact_id, storage_path, alt_text_vi, alt_text_en, display_order)
VALUES
  (art_id, '/images/guol-authentic.jpg', 'Nhà Gươl Truyền Thống', 'Gươl Communal House', 1);

-- Vocabulary for guol-communal-house
DELETE FROM public.artifact_vocabulary WHERE artifact_id = art_id;
INSERT INTO public.artifact_vocabulary (
  artifact_id,
  word_vi,
  word_en,
  pronunciation,
  definition_vi,
  definition_en,
  example_vi,
  example_en,
  display_order
) VALUES (
  art_id,
  'Nhà cộng đồng / Nhà chung của buôn làng',
  'Communal house',
  '/kəˈmjuːnl haʊs/',
  'Nhà cộng đồng / Nhà chung của buôn làng',
  'A large building used by the community for public gatherings and ceremonies.',
  'Dân làng tập trung tại nhà cộng đồng để bàn bạc những công việc trọng đại.',
  'Villagers gather at the communal house to discuss important affairs.',
  1
);
INSERT INTO public.artifact_vocabulary (
  artifact_id,
  word_vi,
  word_en,
  pronunciation,
  definition_vi,
  definition_en,
  example_vi,
  example_en,
  display_order
) VALUES (
  art_id,
  'Cột cái linh thiêng (Ki''lơm)',
  'Sacred pillar',
  '/ˈseɪkrɪd ˈpɪlər/',
  'Cột cái linh thiêng (Ki''lơm)',
  'A master wooden column carved with symbolic spiritual motifs.',
  'Cột cái linh thiêng đứng ở trung tâm để nâng đỡ các xà mái.',
  'The sacred pillar stands in the center to support the roof beams.',
  2
);
INSERT INTO public.artifact_vocabulary (
  artifact_id,
  word_vi,
  word_en,
  pronunciation,
  definition_vi,
  definition_en,
  example_vi,
  example_en,
  display_order
) VALUES (
  art_id,
  'Nghệ thuật chạm nổi gỗ',
  'Bas-relief carving',
  '/ˌbɑː rɪˈliːf ˈkɑːvɪŋ/',
  'Nghệ thuật chạm nổi gỗ',
  'Sculpture technique where sculpted elements remain attached to a solid background.',
  'Những nét chạm nổi tinh xảo khắc họa khung cảnh ngày hội mừng lúa mới thuở xưa.',
  'Intricate bas-relief carvings depict scenes of ancient harvest celebrations.',
  3
);
INSERT INTO public.artifact_vocabulary (
  artifact_id,
  word_vi,
  word_en,
  pronunciation,
  definition_vi,
  definition_en,
  example_vi,
  example_en,
  display_order
) VALUES (
  art_id,
  'Điệu múa dâng trời truyền thống của nam nữ Cơ Tu',
  'Tung tung Da dá',
  '/tʊŋ tʊŋ dɑː dɑː/',
  'Điệu múa dâng trời truyền thống của nam nữ Cơ Tu',
  '',
  'Điệu múa Tung tung Da dá được biểu diễn trong những dịp đại lễ của buôn làng.',
  'The Tung tung Da dá dance is performed during major communal celebrations.',
  4
);

-- Artifact: ktu-traditional-drum
INSERT INTO public.artifacts (
  slug,
  category_id,
  name_vi,
  name_en,
  short_description_vi,
  short_description_en,
  description_vi,
  description_en,
  origin_vi,
  origin_en,
  materials_vi,
  materials_en,
  dimensions,
  historical_story_vi,
  historical_story_en,
  cultural_meaning_vi,
  cultural_meaning_en,
  thumbnail_path,
  model_3d_path,
  model_status,
  content_status,
  verification_note,
  sources,
  audio_vi_path,
  audio_en_path,
  qr_code,
  sections,
  is_published,
  display_order
) VALUES (
  'ktu-traditional-drum',
  cat_music_id,
  'Trống K''tu Truyền Thống',
  'K''tu Traditional Drum',
  'Nhạc cụ gõ linh thiêng, tiếng trống giữ nhịp cho các điệu múa và kết nối con người với thần linh.',
  'A sacred percussion instrument whose rhythmic resonance guides ritual dances and connects humans to ancestral spirits.',
  'Trống Cơ Tu được khoét rỗng từ một thân cây gỗ rừng nguyên khối, mặt trống bịt bằng da mang hoặc da trâu rừng phơi khô, kéo căng bằng các dải mây hoặc nêm gỗ chắc chắn. Âm thanh trầm hùng của trống có thể vang xa qua nhiều thung lũng Tây Giang.',
  'The Cơ Tu drum is hollowed from a single solid tree trunk. The drumhead is crafted from dried deer or water buffalo hide, tautly fastened with rattan ties and wooden wedges. Its deep, resonant sound reverberates across mountain valleys.',
  'Xã A Tiêng, Huyện Tây Giang',
  'A Tiêng Commune, Tây Giang District',
  'Thân gỗ tự nhiên, da trâu hoặc hoẵng, dây mây rừng',
  'Solid log, buffalo/deer hide, rattan cordage',
  'Đường kính mặt ~40-60cm, Chiều dài ~70-90cm',
  'Nghệ nhân Cơ Tu phải chọn gỗ rừng dẻo dai và không bị mối mọt. Da thú sau khi thuộc được nẹp chặt vào tang trống theo bí quyết cổ truyền giúp âm vang đanh mà vẫn giữ được độ ấm.',
  'Craftsmen select resilient native wood immune to termites. After curing, the animal hide is stretched over the shell with ancestral techniques ensuring rich acoustic warmth and carrying power.',
  'Trong mọi ngày hội làng, tiếng trống kết hợp với dàn cồng chiêng (Chiing) tạo nên tiết tấu dồn dập, chỉ dẫn nhịp bước chân uyển chuyển của các thiếu nữ và bước đi dũng mãnh của các chàng trai Cơ Tu.',
  'In village festivities, drumbeats synchronize with bronze gong ensembles, dictating the dynamic steps of warriors and the graceful movements of female dancers.',
  '/images/drum-authentic.jpg',
  '/models/ktu-drum.glb',
  'available',
  'verified',
  'Dữ liệu mô tả kỹ thuật minh họa cho giáo trình CLIL. Cần kiểm nghiệm mẫu trống cụ thể tại Bảo tàng Tây Giang.',
  ARRAY['Nghiên cứu Nhạc khí Dân gian các dân tộc thiểu số miền Trung Việt Nam']::text[],
  '',
  '',
  'ktu-traditional-drum',
  '[{"id":"sec-drum-01","title":{"vi":"Kỹ thuật Chế tác & Da Trống","en":"Crafting Techniques & Drumhead"},"content":{"vi":"Nghệ nhân Cơ Tu phải chọn gỗ rừng dẻo dai và không bị mối mọt. Da thú sau khi thuộc được nẹp chặt vào tang trống theo bí quyết cổ truyền giúp âm vang đanh mà vẫn giữ được độ ấm.","en":"Craftsmen select resilient native wood immune to termites. After curing, the animal hide is stretched over the shell with ancestral techniques ensuring rich acoustic warmth and carrying power."}},{"id":"sec-drum-02","title":{"vi":"Vai trò trong Lễ hội & Hòa tấu Cồng Chiêng","en":"Role in Festivals & Gong Ensembles"},"content":{"vi":"Trong mọi ngày hội làng, tiếng trống kết hợp với dàn cồng chiêng (Chiing) tạo nên tiết tấu dồn dập, chỉ dẫn nhịp bước chân uyển chuyển của các thiếu nữ và bước đi dũng mãnh của các chàng trai Cơ Tu.","en":"In village festivities, drumbeats synchronize with bronze gong ensembles, dictating the dynamic steps of warriors and the graceful movements of female dancers."}}]'::jsonb,
  true,
  2
)
ON CONFLICT (slug) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  name_vi = EXCLUDED.name_vi,
  name_en = EXCLUDED.name_en,
  short_description_vi = EXCLUDED.short_description_vi,
  short_description_en = EXCLUDED.short_description_en,
  description_vi = EXCLUDED.description_vi,
  description_en = EXCLUDED.description_en,
  origin_vi = EXCLUDED.origin_vi,
  origin_en = EXCLUDED.origin_en,
  materials_vi = EXCLUDED.materials_vi,
  materials_en = EXCLUDED.materials_en,
  dimensions = EXCLUDED.dimensions,
  thumbnail_path = EXCLUDED.thumbnail_path,
  model_3d_path = EXCLUDED.model_3d_path,
  model_status = EXCLUDED.model_status,
  content_status = EXCLUDED.content_status,
  sections = EXCLUDED.sections,
  is_published = true,
  display_order = EXCLUDED.display_order;

SELECT id INTO art_id FROM public.artifacts WHERE slug = 'ktu-traditional-drum';

-- Images for ktu-traditional-drum
DELETE FROM public.artifact_images WHERE artifact_id = art_id;
INSERT INTO public.artifact_images (artifact_id, storage_path, alt_text_vi, alt_text_en, display_order)
VALUES
  (art_id, '/images/drum-authentic.jpg', 'Trống K''tu Truyền Thống', 'K''tu Traditional Drum', 1);

-- Vocabulary for ktu-traditional-drum
DELETE FROM public.artifact_vocabulary WHERE artifact_id = art_id;
INSERT INTO public.artifact_vocabulary (
  artifact_id,
  word_vi,
  word_en,
  pronunciation,
  definition_vi,
  definition_en,
  example_vi,
  example_en,
  display_order
) VALUES (
  art_id,
  'Nhạc cụ bộ gõ',
  'Percussion instrument',
  '/pəˈkʌʃn ˈɪnstrəmənt/',
  'Nhạc cụ bộ gõ',
  'A musical instrument sounded by being struck, beaten, or scraped.',
  'Trống là nhạc cụ gõ thiết yếu trong các nghi thức vùng cao.',
  'The drum is an essential percussion instrument in mountainous rituals.',
  1
);
INSERT INTO public.artifact_vocabulary (
  artifact_id,
  word_vi,
  word_en,
  pronunciation,
  definition_vi,
  definition_en,
  example_vi,
  example_en,
  display_order
) VALUES (
  art_id,
  'Độ vang / Sự cộng hưởng âm thanh',
  'Resonance',
  '/ˈrezənəns/',
  'Độ vang / Sự cộng hưởng âm thanh',
  'The quality in a sound of being deep, full, and reverberating.',
  'Độ vang tự nhiên của thân cây rỗng khiến âm thanh truyền xa nhiều dặm.',
  'The natural resonance of the hollow trunk makes the sound travel miles.',
  2
);
INSERT INTO public.artifact_vocabulary (
  artifact_id,
  word_vi,
  word_en,
  pronunciation,
  definition_vi,
  definition_en,
  example_vi,
  example_en,
  display_order
) VALUES (
  art_id,
  'Da trâu khô',
  'Buffalo hide',
  '/ˈbʌfələʊ haɪd/',
  'Da trâu khô',
  'Toughened skin of a water buffalo used for drum membranes.',
  'Căng chặt da trâu sẽ tạo ra cao độ âm thanh sắc nét hơn.',
  'Stretching the buffalo hide tightly produces a higher acoustic pitch.',
  3
);

-- Artifact: bahieng-carrying-basket
INSERT INTO public.artifacts (
  slug,
  category_id,
  name_vi,
  name_en,
  short_description_vi,
  short_description_en,
  description_vi,
  description_en,
  origin_vi,
  origin_en,
  materials_vi,
  materials_en,
  dimensions,
  historical_story_vi,
  historical_story_en,
  cultural_meaning_vi,
  cultural_meaning_en,
  thumbnail_path,
  model_3d_path,
  model_status,
  content_status,
  verification_note,
  sources,
  audio_vi_path,
  audio_en_path,
  qr_code,
  sections,
  is_published,
  display_order
) VALUES (
  'bahieng-carrying-basket',
  cat_weav_id,
  'Gùi Ba-hieng Cơ Tu',
  'Cơ Tu Ba-hieng Carrying Basket',
  'Chiếc gùi ba ngăn đặc trưng, minh chứng cho bàn tay khéo léo và óc thẩm mỹ tinh tế của người đàn ông Cơ Tu.',
  'The iconic three-compartment backpack basket, showcasing the craftsmanship and aesthetic ingenuity of Cơ Tu weavers.',
  'Gùi Ba-hieng (hoặc Pơ-ngơr) là tác phẩm đan lát đỉnh cao của người Cơ Tu. Chiếc gùi có kết cấu chia ba ngăn độc đáo, đan bằng các sợi mây chuốt mỏng đều tăm tắp, phủ khói bồ hóng để chống ẩm mốc và tăng độ bền.',
  'The Ba-hieng is considered the pinnacle of Cơ Tu basket-weaving mastery. Featuring three distinct compartments, it is hand-woven with uniformly sliced rattan strands, smoked over hearth embers to resist mildew and enhance longevity.',
  'Xã Dang / Xã Tr''Hy, Huyện Tây Giang',
  'Dang Commune / Tr''Hy Commune, Tây Giang',
  'Mây rừng vót mỏng, dây vỏ cây rừng',
  'Split forest rattan, wild tree bark fiber straps',
  'Cao ~55cm, Rộng ~35cm',
  'Ngăn chính lớn nhất ở giữa dùng để đựng lương thực, săn bắn hoặc vật dụng lớn; hai ngăn nhỏ hai bên tiện lợi để cất nỏ tên, dao đi rừng, thuốc lá và vật tùy thân.',
  'The prominent central compartment holds provisions, harvest, or large game, while two side pouches store hunting bows, arrows, bushcraft knives, and personal items.',
  'Sau khi đan xong, gùi được gác lên giàn bếp lửa nhiều tháng. Khói bếp tạo nên lớp màu cánh gián bóng loáng, chống mối mọt và nước mưa ngấm vào bên trong.',
  'Upon completion, the basket is suspended over hearth smoke for months. The patina turns glossy amber, protecting the weave from insects and rain infiltration.',
  '/images/basket-authentic.jpg',
  '/models/bahieng-basket.glb',
  'available',
  'verified',
  'Dữ liệu mô tả học thuật minh họa. Cần đối chiếu kích cỡ mẫu vật thực địa tại xã Dang.',
  ARRAY['Nghề thủ công truyền thống đồng bào dân tộc Cơ Tu - Sở VHTTDL Quảng Nam']::text[],
  '',
  '',
  'bahieng-carrying-basket',
  '[{"id":"sec-bas-01","title":{"vi":"Cấu tạo Ba Ngăn Độc Đáo","en":"Ingenious Three-Compartment Design"},"content":{"vi":"Ngăn chính lớn nhất ở giữa dùng để đựng lương thực, săn bắn hoặc vật dụng lớn; hai ngăn nhỏ hai bên tiện lợi để cất nỏ tên, dao đi rừng, thuốc lá và vật tùy thân.","en":"The prominent central compartment holds provisions, harvest, or large game, while two side pouches store hunting bows, arrows, bushcraft knives, and personal items."}},{"id":"sec-bas-02","title":{"vi":"Kỹ thuật Xông Khói Chống Mối Mọt","en":"Fireplace Smoking & Curing"},"content":{"vi":"Sau khi đan xong, gùi được gác lên giàn bếp lửa nhiều tháng. Khói bếp tạo nên lớp màu cánh gián bóng loáng, chống mối mọt và nước mưa ngấm vào bên trong.","en":"Upon completion, the basket is suspended over hearth smoke for months. The patina turns glossy amber, protecting the weave from insects and rain infiltration."}}]'::jsonb,
  true,
  3
)
ON CONFLICT (slug) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  name_vi = EXCLUDED.name_vi,
  name_en = EXCLUDED.name_en,
  short_description_vi = EXCLUDED.short_description_vi,
  short_description_en = EXCLUDED.short_description_en,
  description_vi = EXCLUDED.description_vi,
  description_en = EXCLUDED.description_en,
  origin_vi = EXCLUDED.origin_vi,
  origin_en = EXCLUDED.origin_en,
  materials_vi = EXCLUDED.materials_vi,
  materials_en = EXCLUDED.materials_en,
  dimensions = EXCLUDED.dimensions,
  thumbnail_path = EXCLUDED.thumbnail_path,
  model_3d_path = EXCLUDED.model_3d_path,
  model_status = EXCLUDED.model_status,
  content_status = EXCLUDED.content_status,
  sections = EXCLUDED.sections,
  is_published = true,
  display_order = EXCLUDED.display_order;

SELECT id INTO art_id FROM public.artifacts WHERE slug = 'bahieng-carrying-basket';

-- Images for bahieng-carrying-basket
DELETE FROM public.artifact_images WHERE artifact_id = art_id;
INSERT INTO public.artifact_images (artifact_id, storage_path, alt_text_vi, alt_text_en, display_order)
VALUES
  (art_id, '/images/basket-authentic.jpg', 'Gùi Ba-hieng Cơ Tu', 'Cơ Tu Ba-hieng Carrying Basket', 1);

-- Vocabulary for bahieng-carrying-basket
DELETE FROM public.artifact_vocabulary WHERE artifact_id = art_id;
INSERT INTO public.artifact_vocabulary (
  artifact_id,
  word_vi,
  word_en,
  pronunciation,
  definition_vi,
  definition_en,
  example_vi,
  example_en,
  display_order
) VALUES (
  art_id,
  'Nghệ thuật đan mây',
  'Rattan weaving',
  '/ˈrætæn ˈwiːvɪŋ/',
  'Nghệ thuật đan mây',
  'The craft of interlacing flexible rattan fibers to make functional objects.',
  'Đan mây là kỹ năng gia truyền được truyền dạy cho các chàng trai trẻ.',
  'Rattan weaving is an ancestral skill passed down to young men.',
  1
);
INSERT INTO public.artifact_vocabulary (
  artifact_id,
  word_vi,
  word_en,
  pronunciation,
  definition_vi,
  definition_en,
  example_vi,
  example_en,
  display_order
) VALUES (
  art_id,
  'Ngăn chứa riêng biệt',
  'Compartment',
  '/kəmˈpɑːtmənt/',
  'Ngăn chứa riêng biệt',
  'One of the separate parts into which a space or container is divided.',
  'Ngăn bên hông giúp lấy dụng cụ săn bắn một cách nhanh chóng.',
  'The side compartment allows quick access to hunting tools.',
  2
);
INSERT INTO public.artifact_vocabulary (
  artifact_id,
  word_vi,
  word_en,
  pronunciation,
  definition_vi,
  definition_en,
  example_vi,
  example_en,
  display_order
) VALUES (
  art_id,
  'Lớp bóng màu thời gian / Lớp bồ hóng bếp',
  'Patina',
  '/ˈpætɪnə/',
  'Lớp bóng màu thời gian / Lớp bồ hóng bếp',
  'A glossy surface sheen produced by age, handling, and hearth smoke.',
  'Khói bếp tạo cho chiếc gùi một lớp vỏ màu đậm đà, che chở khỏi mối mọt.',
  'Hearth smoke gives the basket a rich, protective patina.',
  3
);

-- Artifact: chieng-gong-instrument
INSERT INTO public.artifacts (
  slug,
  category_id,
  name_vi,
  name_en,
  short_description_vi,
  short_description_en,
  description_vi,
  description_en,
  origin_vi,
  origin_en,
  materials_vi,
  materials_en,
  dimensions,
  historical_story_vi,
  historical_story_en,
  cultural_meaning_vi,
  cultural_meaning_en,
  thumbnail_path,
  model_3d_path,
  model_status,
  content_status,
  verification_note,
  sources,
  audio_vi_path,
  audio_en_path,
  qr_code,
  sections,
  is_published,
  display_order
) VALUES (
  'chieng-gong-instrument',
  cat_music_id,
  'Chiêng Đồng Cơ Tu (Chiing)',
  'Cơ Tu Sacred Bronze Gong',
  'Báu vật thiêng liêng lưu truyền qua nhiều thế hệ, thanh âm trầm hùng kết nối con người với thần linh và núi rừng Trường Sơn.',
  'A sacred ancestral heirloom whose metallic resonance echoes through the Trường Sơn mountains, bridging mortals with celestial spirits.',
  'Chiêng đồng (tiếng Cơ Tu gọi là Chiing) là một trong những tài sản quý giá nhất trong mỗi gia đình và buôn làng Cơ Tu. Chiêng thường được đúc bằng hợp kim đồng với núm tròn ở tâm (hoặc chiêng bằng), khi diễn tấu hòa nhịp cùng tiếng trống Cơ Tu tạo nên dàn hợp xướng âm vang trầm hùng trong ngày hội mừng lúa mới, lễ hội đâm trâu và lễ tạ ơn Giàng.',
  'The bronze gong (known as Chiing in the Cơ Tu language) is among the most prized ceremonial heirlooms in Cơ Tu villages. Cast in resonant bronze alloy, it synchronizes with traditional drums during harvest thanksgiving and spiritual celebrations.',
  'Huyện Tây Giang, Quảng Nam',
  'Tây Giang District, Quảng Nam Province',
  'Hợp kim đồng thiếc cổ truyền, quai đeo dây mây',
  'Traditional bronze-tin alloy, braided rattan suspension loop',
  'Đường kính ~50cm, Độ sâu vành ~8cm, Trọng lượng ~5.2kg',
  'Hợp kim đồng thiếc qua kỹ thuật chỉnh âm tinh xảo của các nghệ nhân tạo nên độ rền vang ngân dài. Mỗi chiếc chiêng trong dàn tấu đều giữ một cao độ riêng biệt, phối hợp nhịp nhàng tạo thành bản hòa âm đa sắc.',
  'Skilled metallurgists tune the bronze alloy to generate long-lasting vibrational sustain. Each gong in the village ensemble contributes a distinct pitch to form a harmonious polyrhythmic soundscape.',
  'Trong luật tục Cơ Tu, chiêng đồng là thước đo sự thịnh vượng và là lễ vật danh giá nhất trong nghi lễ cưới hỏi, tạ ơn và liên minh giữa các bản làng.',
  'Within Cơ Tu customary traditions, gongs embody community wealth and represent the most prestigious offering in marriages, peace alliances, and harvest thanksgiving rituals.',
  '/images/chieng-authentic.jpg',
  '/models/chieng.glb',
  'available',
  'verified',
  'Mô hình 3D thực tế scan từ hiện vật chiêng đồng cổ truyền Cơ Tu Tây Giang.',
  ARRAY['Không gian Văn hóa Cồng Chiêng - Viện Âm nhạc Quốc gia Việt Nam', 'Tài liệu nghiên cứu âm nhạc dân gian Cơ Tu Tây Giang']::text[],
  '',
  '',
  'chieng-gong-instrument',
  '[{"id":"sec-chieng-01","title":{"vi":"Kỹ Thuật Đúc & Âm Sắc Trầm Hùng","en":"Acoustic Resonance & Bronze Casting"},"content":{"vi":"Hợp kim đồng thiếc qua kỹ thuật chỉnh âm tinh xảo của các nghệ nhân tạo nên độ rền vang ngân dài. Mỗi chiếc chiêng trong dàn tấu đều giữ một cao độ riêng biệt, phối hợp nhịp nhàng tạo thành bản hòa âm đa sắc.","en":"Skilled metallurgists tune the bronze alloy to generate long-lasting vibrational sustain. Each gong in the village ensemble contributes a distinct pitch to form a harmonious polyrhythmic soundscape."}},{"id":"sec-chieng-02","title":{"vi":"Giá Trị Gia Bảo & Biểu Tượng Gắn Kết","en":"Heirloom Value & Social Solidarity"},"content":{"vi":"Trong luật tục Cơ Tu, chiêng đồng là thước đo sự thịnh vượng và là lễ vật danh giá nhất trong nghi lễ cưới hỏi, tạ ơn và liên minh giữa các bản làng.","en":"Within Cơ Tu customary traditions, gongs embody community wealth and represent the most prestigious offering in marriages, peace alliances, and harvest thanksgiving rituals."}}]'::jsonb,
  true,
  4
)
ON CONFLICT (slug) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  name_vi = EXCLUDED.name_vi,
  name_en = EXCLUDED.name_en,
  short_description_vi = EXCLUDED.short_description_vi,
  short_description_en = EXCLUDED.short_description_en,
  description_vi = EXCLUDED.description_vi,
  description_en = EXCLUDED.description_en,
  origin_vi = EXCLUDED.origin_vi,
  origin_en = EXCLUDED.origin_en,
  materials_vi = EXCLUDED.materials_vi,
  materials_en = EXCLUDED.materials_en,
  dimensions = EXCLUDED.dimensions,
  thumbnail_path = EXCLUDED.thumbnail_path,
  model_3d_path = EXCLUDED.model_3d_path,
  model_status = EXCLUDED.model_status,
  content_status = EXCLUDED.content_status,
  sections = EXCLUDED.sections,
  is_published = true,
  display_order = EXCLUDED.display_order;

SELECT id INTO art_id FROM public.artifacts WHERE slug = 'chieng-gong-instrument';

-- Images for chieng-gong-instrument
DELETE FROM public.artifact_images WHERE artifact_id = art_id;
INSERT INTO public.artifact_images (artifact_id, storage_path, alt_text_vi, alt_text_en, display_order)
VALUES
  (art_id, '/images/chieng-authentic.jpg', 'Chiêng Đồng Cơ Tu (Chiing)', 'Cơ Tu Sacred Bronze Gong', 1);

-- Vocabulary for chieng-gong-instrument
DELETE FROM public.artifact_vocabulary WHERE artifact_id = art_id;
INSERT INTO public.artifact_vocabulary (
  artifact_id,
  word_vi,
  word_en,
  pronunciation,
  definition_vi,
  definition_en,
  example_vi,
  example_en,
  display_order
) VALUES (
  art_id,
  'Chiêng đồng / Cồng chiêng',
  'Bronze gong',
  '/brɒnz ɡɒŋ/',
  'Chiêng đồng / Cồng chiêng',
  'A metal percussion instrument made of bronze alloy that produces a rich ringing sound.',
  'Âm vang trầm hùng của chiếc chiêng đồng vang vọng khắp thung lũng núi.',
  'The resonant sound of the bronze gong echoed across the mountain valley.',
  1
);
INSERT INTO public.artifact_vocabulary (
  artifact_id,
  word_vi,
  word_en,
  pronunciation,
  definition_vi,
  definition_en,
  example_vi,
  example_en,
  display_order
) VALUES (
  art_id,
  'Báu vật gia bảo của tổ tiên để lại',
  'Ancestral heirloom',
  '/ænˈsestrəl ˈeəluːm/',
  'Báu vật gia bảo của tổ tiên để lại',
  'A valuable object that has belonged to a family or clan for several generations.',
  'Những chiếc chiêng thiêng được gìn giữ như báu vật gia bảo quý giá của tổ tiên.',
  'The sacred gongs are preserved as cherished ancestral heirlooms.',
  2
);
INSERT INTO public.artifact_vocabulary (
  artifact_id,
  word_vi,
  word_en,
  pronunciation,
  definition_vi,
  definition_en,
  example_vi,
  example_en,
  display_order
) VALUES (
  art_id,
  'Tiết tấu phức hợp / Đa tiết tấu hòa âm',
  'Polyrhythm',
  '/ˌpɒliˈrɪðəm/',
  'Tiết tấu phức hợp / Đa tiết tấu hòa âm',
  'The simultaneous use of two or more conflicting rhythms in musical performance.',
  'Các nghệ nhân gõ chiêng hòa nhịp tạo nên chuỗi phức điệu đa tiết tấu mê hoặc.',
  'Gong players synchronize to produce a mesmerizing polyrhythm.',
  3
);

-- Artifact: ao-nam-cotu
INSERT INTO public.artifacts (
  slug,
  category_id,
  name_vi,
  name_en,
  short_description_vi,
  short_description_en,
  description_vi,
  description_en,
  origin_vi,
  origin_en,
  materials_vi,
  materials_en,
  dimensions,
  historical_story_vi,
  historical_story_en,
  cultural_meaning_vi,
  cultural_meaning_en,
  thumbnail_path,
  model_3d_path,
  model_status,
  content_status,
  verification_note,
  sources,
  audio_vi_path,
  audio_en_path,
  qr_code,
  sections,
  is_published,
  display_order
) VALUES (
  'ao-nam-cotu',
  cat_weav_id,
  'Áo Nam Thổ Cẩm Cơ Tu',
  'Cơ Tu Men''s Brocade Tunic',
  'Trang phục truyền thống của đàn ông Cơ Tu với dải hoa văn cườm trắng đính kết kỳ công trên nền vải đen đỏ trầm ấm.',
  'Traditional sleeveless vest worn by Cơ Tu men, featuring meticulous white beadwork geometric motifs woven into dark cotton fabric.',
  'Áo nam Cơ Tu (áo cộc không tay hoặc khoác chui đầu) được dệt từ sợi bông rừng nhuộm màu tự nhiên bằng vỏ cây, củ nâu và bùn suối. Điểm độc đáo nhất là kỹ thuật chèn hạt cườm trắng trực tiếp vào sợi chỉ trong quá trình dệt trên khung cửi dệt thắt lưng, tạo nên các đồ án hoa văn hình thoi, răng cưa và chim muông đầy dũng khí.',
  'The Cơ Tu male tunic is handwoven on backstrap looms from native cotton colored with natural forest dyes. Master weavers insert white seed beads directly onto weft threads to form geometric lozenges, jagged teeth, and wildlife emblems symbolizing strength.',
  'Xã Dang, Huyện Tây Giang, Quảng Nam',
  'Dang Commune, Tây Giang District, Quảng Nam',
  'Sợi bông tự nhiên, nhuộm chàm và vỏ cây rừng, chuỗi hạt cườm trắng',
  'Indigenous hand-spun cotton, natural bark dyes, white seed beads',
  'Dài ~68cm, Rộng ngang vai ~48cm',
  'Khác với thêu đính thông thường, người phụ nữ Cơ Tu xỏ từng hạt cườm trắng vào sợi chỉ ngang khi đang dệt trên khung cửi thắt lưng, giúp hoa văn cườm chìm sâu bền chặt vào thớ vải và không bao giờ bung tuột.',
  'Unlike surface embroidery, artisans thread seed beads directly into weft yarns on backstrap looms, locking each bead firmly into the fabric structure for enduring durability.',
  'Sự kết hợp giữa màu đen (đất mẹ, rừng già), màu đỏ (lửa thiêng, lòng dũng cảm) và cườm trắng (sao trời, tinh khiết) tôn lên vóc dáng khỏe khoắn của các thợ săn và chiến binh miền sơn cước.',
  'The harmony of black (fertile soil), crimson red (sacred hearth fire), and white beads (starlight and integrity) reflects the valor and physical vitality of highland hunters.',
  '/images/aonam_v2.png',
  '/models/ao-nam.glb',
  'available',
  'verified',
  'Mô hình 3D scan thực tế từ áo thổ cẩm nam Cơ Tu Tây Giang.',
  ARRAY['Nghệ thuật dệt thổ cẩm đính cườm của người Cơ Tu - Bảo tàng Văn hóa Dân tộc', 'Khảo cứu trang phục cổ truyền Cơ Tu Tây Giang']::text[],
  '',
  '',
  'ao-nam-cotu',
  '[{"id":"sec-aonam-01","title":{"vi":"Kỹ Thuật Dệt Luồn Cườm Độc Bản","en":"Unique In-Weft Seed Bead Insertion"},"content":{"vi":"Khác với thêu đính thông thường, người phụ nữ Cơ Tu xỏ từng hạt cườm trắng vào sợi chỉ ngang khi đang dệt trên khung cửi thắt lưng, giúp hoa văn cườm chìm sâu bền chặt vào thớ vải và không bao giờ bung tuột.","en":"Unlike surface embroidery, artisans thread seed beads directly into weft yarns on backstrap looms, locking each bead firmly into the fabric structure for enduring durability."}},{"id":"sec-aonam-02","title":{"vi":"Sắc Màu & Khí Phách Người Đàn Ông Cơ Tu","en":"Color Symbology & Highland Masculinity"},"content":{"vi":"Sự kết hợp giữa màu đen (đất mẹ, rừng già), màu đỏ (lửa thiêng, lòng dũng cảm) và cườm trắng (sao trời, tinh khiết) tôn lên vóc dáng khỏe khoắn của các thợ săn và chiến binh miền sơn cước.","en":"The harmony of black (fertile soil), crimson red (sacred hearth fire), and white beads (starlight and integrity) reflects the valor and physical vitality of highland hunters."}}]'::jsonb,
  true,
  5
)
ON CONFLICT (slug) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  name_vi = EXCLUDED.name_vi,
  name_en = EXCLUDED.name_en,
  short_description_vi = EXCLUDED.short_description_vi,
  short_description_en = EXCLUDED.short_description_en,
  description_vi = EXCLUDED.description_vi,
  description_en = EXCLUDED.description_en,
  origin_vi = EXCLUDED.origin_vi,
  origin_en = EXCLUDED.origin_en,
  materials_vi = EXCLUDED.materials_vi,
  materials_en = EXCLUDED.materials_en,
  dimensions = EXCLUDED.dimensions,
  thumbnail_path = EXCLUDED.thumbnail_path,
  model_3d_path = EXCLUDED.model_3d_path,
  model_status = EXCLUDED.model_status,
  content_status = EXCLUDED.content_status,
  sections = EXCLUDED.sections,
  is_published = true,
  display_order = EXCLUDED.display_order;

SELECT id INTO art_id FROM public.artifacts WHERE slug = 'ao-nam-cotu';

-- Images for ao-nam-cotu
DELETE FROM public.artifact_images WHERE artifact_id = art_id;
INSERT INTO public.artifact_images (artifact_id, storage_path, alt_text_vi, alt_text_en, display_order)
VALUES
  (art_id, '/images/aonam_v2.png', 'Áo Nam Thổ Cẩm Cơ Tu', 'Cơ Tu Men''s Brocade Tunic', 1);

-- Vocabulary for ao-nam-cotu
DELETE FROM public.artifact_vocabulary WHERE artifact_id = art_id;
INSERT INTO public.artifact_vocabulary (
  artifact_id,
  word_vi,
  word_en,
  pronunciation,
  definition_vi,
  definition_en,
  example_vi,
  example_en,
  display_order
) VALUES (
  art_id,
  'Khung cửi luồn thắt lưng truyền thống',
  'Backstrap loom',
  '/ˈbækstræp luːm/',
  'Khung cửi luồn thắt lưng truyền thống',
  'A simple portable loom where the warp is tensioned around the weaver''s waist.',
  'Phụ nữ vùng cao dệt nên những tấm thổ cẩm tinh xảo bằng khung cửi thắt lưng.',
  'Highland women weave exquisite brocade textiles using a backstrap loom.',
  1
);
INSERT INTO public.artifact_vocabulary (
  artifact_id,
  word_vi,
  word_en,
  pronunciation,
  definition_vi,
  definition_en,
  example_vi,
  example_en,
  display_order
) VALUES (
  art_id,
  'Hạt cườm nhỏ dệt hoa văn',
  'Seed bead',
  '/siːd biːd/',
  'Hạt cườm nhỏ dệt hoa văn',
  'Small rounded beads woven or sewn into textiles for ornamental relief.',
  'Những hàng hạt cườm trắng tạo thành hoa văn hình thoi trên ngực áo.',
  'Rows of white seed beads form diamond motifs across the tunic chest.',
  2
);
INSERT INTO public.artifact_vocabulary (
  artifact_id,
  word_vi,
  word_en,
  pronunciation,
  definition_vi,
  definition_en,
  example_vi,
  example_en,
  display_order
) VALUES (
  art_id,
  'Thuốc nhuộm tự nhiên từ cây cỏ',
  'Natural dye',
  '/ˈnætʃrəl daɪ/',
  'Thuốc nhuộm tự nhiên từ cây cỏ',
  'Dyes derived from plants, minerals, or invertebrates without artificial chemicals.',
  'Vỏ cây và rễ rừng cung cấp thuốc nhuộm tự nhiên đậm đà, khó phai màu.',
  'Forest bark and roots provide rich natural dyes that do not fade easily.',
  3
);

-- Artifact: ao-nu-cotu
INSERT INTO public.artifacts (
  slug,
  category_id,
  name_vi,
  name_en,
  short_description_vi,
  short_description_en,
  description_vi,
  description_en,
  origin_vi,
  origin_en,
  materials_vi,
  materials_en,
  dimensions,
  historical_story_vi,
  historical_story_en,
  cultural_meaning_vi,
  cultural_meaning_en,
  thumbnail_path,
  model_3d_path,
  model_status,
  content_status,
  verification_note,
  sources,
  audio_vi_path,
  audio_en_path,
  qr_code,
  sections,
  is_published,
  display_order
) VALUES (
  'ao-nu-cotu',
  cat_weav_id,
  'Váy Áo Thổ Cẩm Nữ Cơ Tu',
  'Cơ Tu Women''s Brocade Costume',
  'Bộ trang phục duyên dáng của người phụ nữ Cơ Tu, dệt đính hạt cườm hoa văn Zút Chơ-rơ biểu trưng cho sự uyển chuyển và sức sống đại ngàn.',
  'Graceful ceremonial dress worn by Cơ Tu women, featuring the exquisite Zút Chơ-rơ beaded motifs symbolizing river ripples and mountain vitality.',
  'Trang phục nữ Cơ Tu gồm áo chui đầu ngắn hoặc yếm kết hợp cùng váy quấn dài (chơ-rơ). Từng đường nét hoa văn zút cườm trắng trên nền vải đen tuyền thể hiện sự khéo léo, kiên nhẫn và thẩm mỹ tinh tế của người phụ nữ Cơ Tu. Bộ trang phục rực rỡ nhất khi các thiếu nữ nhảy múa điệu Da dá mềm mại dâng trời.',
  'The women''s ensemble consists of a short fitted blouse and an elegant wrap-around skirt (chơ-rơ). Meticulous rows of white beads contrast with deep black cloth, shining radiantly as women perform the sacred Da dá celestial dance.',
  'Huyện Tây Giang, Quảng Nam',
  'Tây Giang District, Quảng Nam Province',
  'Sợi bông tự nhiên, nhuộm chàm đen và rễ cây, cườm hạt trắng',
  'Hand-woven natural cotton, black indigo and root dyes, white seed beads',
  'Chiều dài váy ~85cm, Độ xòe quấn ~130cm',
  'Hoa văn dệt cườm gợn sóng Zút Chơ-rơ mô phỏng dòng suối và ngọn sóng đại ngàn. Khi các cô gái Cơ Tu giơ tay nâng ngang vai múa điệu Da dá nhịp nhàng, tà váy dệt cườm lấp lánh như ngàn ánh sao trong đêm hội.',
  'The wave-like Zút Chơ-rơ bead pattern represents mountain rivers. During the graceful Da dá ritual dance, the beadwork glitters like constellations across the nighttime village square.',
  'Để hoàn thành một bộ váy áo dệt cườm, người con gái Cơ Tu phải dồn tâm huyết hàng tháng trời. Đây là thước đo sự cần cù, phẩm hạnh và là của hồi môn quý giá nhất trước khi bước về nhà chồng.',
  'Crafting a complete beaded skirt takes months of patient dedication, serving as a revered benchmark of perseverance and an esteemed bridal dowry.',
  '/images/aonu_v2.png',
  '/models/ao-nu.glb',
  'available',
  'verified',
  'Mô hình 3D scan thực tế từ váy áo thổ cẩm nữ Cơ Tu Tây Giang.',
  ARRAY['Văn hóa trang phục cổ truyền dân tộc Cơ Tu - Sở Văn hóa Thể thao và Du lịch Quảng Nam', 'Bộ sưu tập dệt may thổ cẩm Tây Giang']::text[],
  '',
  '',
  'ao-nu-cotu',
  '[{"id":"sec-aonu-01","title":{"vi":"Hoa Văn Zút Chơ-rơ & Điệu Múa Da Dá","en":"Zút Chơ-rơ Motifs & The Da Dá Dance"},"content":{"vi":"Hoa văn dệt cườm gợn sóng Zút Chơ-rơ mô phỏng dòng suối và ngọn sóng đại ngàn. Khi các cô gái Cơ Tu giơ tay nâng ngang vai múa điệu Da dá nhịp nhàng, tà váy dệt cườm lấp lánh như ngàn ánh sao trong đêm hội.","en":"The wave-like Zút Chơ-rơ bead pattern represents mountain rivers. During the graceful Da dá ritual dance, the beadwork glitters like constellations across the nighttime village square."}},{"id":"sec-aonu-02","title":{"vi":"Biểu Tượng Của Tình Yêu & Khéo Léo","en":"Emblem of Tenderness & Matriarchal Skill"},"content":{"vi":"Để hoàn thành một bộ váy áo dệt cườm, người con gái Cơ Tu phải dồn tâm huyết hàng tháng trời. Đây là thước đo sự cần cù, phẩm hạnh và là của hồi môn quý giá nhất trước khi bước về nhà chồng.","en":"Crafting a complete beaded skirt takes months of patient dedication, serving as a revered benchmark of perseverance and an esteemed bridal dowry."}}]'::jsonb,
  true,
  6
)
ON CONFLICT (slug) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  name_vi = EXCLUDED.name_vi,
  name_en = EXCLUDED.name_en,
  short_description_vi = EXCLUDED.short_description_vi,
  short_description_en = EXCLUDED.short_description_en,
  description_vi = EXCLUDED.description_vi,
  description_en = EXCLUDED.description_en,
  origin_vi = EXCLUDED.origin_vi,
  origin_en = EXCLUDED.origin_en,
  materials_vi = EXCLUDED.materials_vi,
  materials_en = EXCLUDED.materials_en,
  dimensions = EXCLUDED.dimensions,
  thumbnail_path = EXCLUDED.thumbnail_path,
  model_3d_path = EXCLUDED.model_3d_path,
  model_status = EXCLUDED.model_status,
  content_status = EXCLUDED.content_status,
  sections = EXCLUDED.sections,
  is_published = true,
  display_order = EXCLUDED.display_order;

SELECT id INTO art_id FROM public.artifacts WHERE slug = 'ao-nu-cotu';

-- Images for ao-nu-cotu
DELETE FROM public.artifact_images WHERE artifact_id = art_id;
INSERT INTO public.artifact_images (artifact_id, storage_path, alt_text_vi, alt_text_en, display_order)
VALUES
  (art_id, '/images/aonu_v2.png', 'Váy Áo Thổ Cẩm Nữ Cơ Tu', 'Cơ Tu Women''s Brocade Costume', 1);

-- Vocabulary for ao-nu-cotu
DELETE FROM public.artifact_vocabulary WHERE artifact_id = art_id;
INSERT INTO public.artifact_vocabulary (
  artifact_id,
  word_vi,
  word_en,
  pronunciation,
  definition_vi,
  definition_en,
  example_vi,
  example_en,
  display_order
) VALUES (
  art_id,
  'Váy quấn truyền thống (Chơ-rơ)',
  'Wrap skirt',
  '/ræp skɜːt/',
  'Váy quấn truyền thống (Chơ-rơ)',
  'A skirt that folds around the waist and is secured with ties or overlap.',
  'Cô gái thắt chặt chiếc váy quấn lễ hội trước khi bước vào vòng xoang múa.',
  'She fastened her ceremonial wrap skirt before stepping into the dance circle.',
  1
);
INSERT INTO public.artifact_vocabulary (
  artifact_id,
  word_vi,
  word_en,
  pronunciation,
  definition_vi,
  definition_en,
  example_vi,
  example_en,
  display_order
) VALUES (
  art_id,
  'Hoa văn gợn sóng nước (Zút Chơ-rơ)',
  'Ripple pattern',
  '/ˈrɪpl ˈpætən/',
  'Hoa văn gợn sóng nước (Zút Chơ-rơ)',
  'A wavy decorative pattern resembling surface movements of water.',
  'Hoa văn gợn sóng tượng trưng cho dòng suối nguồn chảy qua đại ngàn Trường Sơn.',
  'The ripple pattern symbolizes the flowing streams of the Trường Sơn forest.',
  2
);
INSERT INTO public.artifact_vocabulary (
  artifact_id,
  word_vi,
  word_en,
  pronunciation,
  definition_vi,
  definition_en,
  example_vi,
  example_en,
  display_order
) VALUES (
  art_id,
  'Lễ phục / Trang phục trang trọng trong ngày hội',
  'Ceremonial attire',
  '/ˌserɪˈməʊniəl əˈtaɪər/',
  'Lễ phục / Trang phục trang trọng trong ngày hội',
  'Clothing worn specifically for religious, customary, or special occasions.',
  'Dân làng mặc bộ lễ phục đẹp nhất trong ngày hội mừng mùa màng bội thu.',
  'Villagers wear their finest ceremonial attire during the harvest festival.',
  3
);

-- Artifact: tuong-te-te-cotu
INSERT INTO public.artifacts (
  slug,
  category_id,
  name_vi,
  name_en,
  short_description_vi,
  short_description_en,
  description_vi,
  description_en,
  origin_vi,
  origin_en,
  materials_vi,
  materials_en,
  dimensions,
  historical_story_vi,
  historical_story_en,
  cultural_meaning_vi,
  cultural_meaning_en,
  thumbnail_path,
  model_3d_path,
  model_status,
  content_status,
  verification_note,
  sources,
  audio_vi_path,
  audio_en_path,
  qr_code,
  sections,
  is_published,
  display_order
) VALUES (
  'tuong-te-te-cotu',
  cat_sculp_id,
  'Điêu Khắc Con Tê Tê Cơ Tu',
  'Cơ Tu Wood-Carved Pangolin Sculpture',
  'Tác phẩm điêu khắc gỗ dân gian khắc họa loài tê tê rừng, biểu tượng gắn bó mật thiết với thiên nhiên hoang dã của vùng cao Tây Giang.',
  'Folk timber sculpture portraying the mountain pangolin, a revered wild creature deeply woven into highland forest folklore.',
  'Trong kho tàng điêu khắc gỗ Cơ Tu bài trí quanh nhà Gươl và nhà mồ, hình tượng muông thú rừng sâu như kỳ đà, chim trĩ và tê tê được đẽo tạc mộc mạc mà vô cùng sống động. Con tê tê với lớp vảy xếp lớp hình vòm cung được nghệ nhân Cơ Tu tạo hình bằng rìu và đục tay từ thân gỗ nguyên khối, phản ánh cái nhìn hòa hợp và kính ngưỡng đối với vạn vật trong rừng già.',
  'Within the rich repertoire of Cơ Tu folk woodcarvings displayed in Gươl houses and memorial sites, forest wildlife such as pangolins, monitor lizards, and pheasants are chiseled from single timber logs. The armored pangolin with its interlocking arched scales symbolizes harmony between mankind and virgin rainforests.',
  'Xã Tr''Hy, Huyện Tây Giang, Quảng Nam',
  'Tr''Hy Commune, Tây Giang District, Quảng Nam',
  'Gỗ rừng nguyên khối, xông khói bếp chống mối mọt',
  'Solid indigenous forest timber, cured with traditional hearth smoke',
  'Dài ~62cm, Rộng ~24cm, Cao ~18cm, Nặng ~4.5kg',
  'Nghệ nhân dùng rìu thô và đục sắt gọt tỉa từng lớp vảy lưng uốn lượn theo dáng cong tự nhiên của khúc gỗ rừng. Bề mặt gỗ giữ nguyên vết đục mộc mạc, tạo nên nét đẹp nguyên sơ đầy biểu cảm.',
  'Using iron chisels and hand adzes, carvers shape arched dorsal scales following the organic curvature of the timber log, preserving tactile chisel strokes that evoke primal expressive power.',
  'Người Cơ Tu quan niệm muông thú trong rừng già Tây Giang đều có linh hồn và là sứ giả của Giàng rừng. Tác phẩm điêu khắc nhắc nhở con cháu giữ gìn và bảo vệ rừng thiêng đầu nguồn.',
  'In Cơ Tu cosmology, mountain creatures embody forest spirits and serve as messengers of nature deities (Giàng), reminding generations to safeguard sacred watershed forests.',
  '/images/tete_v2.png',
  '/models/te-te.glb',
  'available',
  'verified',
  'Mô hình 3D scan thực tế từ tác phẩm điêu khắc gỗ con tê tê Cơ Tu Tây Giang.',
  ARRAY['Điêu khắc dân gian Cơ Tu - Viện Mỹ thuật Việt Nam', 'Tư liệu di sản điêu khắc gỗ Tây Giang']::text[],
  '',
  '',
  'tuong-te-te-cotu',
  '[{"id":"sec-tete-01","title":{"vi":"Nghệ Thuật Đục Đẽo Gỗ Nguyên Khối","en":"Direct Chisel & Monolithic Woodcarving"},"content":{"vi":"Nghệ nhân dùng rìu thô và đục sắt gọt tỉa từng lớp vảy lưng uốn lượn theo dáng cong tự nhiên của khúc gỗ rừng. Bề mặt gỗ giữ nguyên vết đục mộc mạc, tạo nên nét đẹp nguyên sơ đầy biểu cảm.","en":"Using iron chisels and hand adzes, carvers shape arched dorsal scales following the organic curvature of the timber log, preserving tactile chisel strokes that evoke primal expressive power."}},{"id":"sec-tete-02","title":{"vi":"Hình Tượng Muông Thú & Triết Lý Rừng Già","en":"Forest Fauna & Highland Ecological Cosmology"},"content":{"vi":"Người Cơ Tu quan niệm muông thú trong rừng già Tây Giang đều có linh hồn và là sứ giả của Giàng rừng. Tác phẩm điêu khắc nhắc nhở con cháu giữ gìn và bảo vệ rừng thiêng đầu nguồn.","en":"In Cơ Tu cosmology, mountain creatures embody forest spirits and serve as messengers of nature deities (Giàng), reminding generations to safeguard sacred watershed forests."}}]'::jsonb,
  true,
  7
)
ON CONFLICT (slug) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  name_vi = EXCLUDED.name_vi,
  name_en = EXCLUDED.name_en,
  short_description_vi = EXCLUDED.short_description_vi,
  short_description_en = EXCLUDED.short_description_en,
  description_vi = EXCLUDED.description_vi,
  description_en = EXCLUDED.description_en,
  origin_vi = EXCLUDED.origin_vi,
  origin_en = EXCLUDED.origin_en,
  materials_vi = EXCLUDED.materials_vi,
  materials_en = EXCLUDED.materials_en,
  dimensions = EXCLUDED.dimensions,
  thumbnail_path = EXCLUDED.thumbnail_path,
  model_3d_path = EXCLUDED.model_3d_path,
  model_status = EXCLUDED.model_status,
  content_status = EXCLUDED.content_status,
  sections = EXCLUDED.sections,
  is_published = true,
  display_order = EXCLUDED.display_order;

SELECT id INTO art_id FROM public.artifacts WHERE slug = 'tuong-te-te-cotu';

-- Images for tuong-te-te-cotu
DELETE FROM public.artifact_images WHERE artifact_id = art_id;
INSERT INTO public.artifact_images (artifact_id, storage_path, alt_text_vi, alt_text_en, display_order)
VALUES
  (art_id, '/images/tete_v2.png', 'Điêu Khắc Con Tê Tê Cơ Tu', 'Cơ Tu Wood-Carved Pangolin Sculpture', 1);

-- Vocabulary for tuong-te-te-cotu
DELETE FROM public.artifact_vocabulary WHERE artifact_id = art_id;
INSERT INTO public.artifact_vocabulary (
  artifact_id,
  word_vi,
  word_en,
  pronunciation,
  definition_vi,
  definition_en,
  example_vi,
  example_en,
  display_order
) VALUES (
  art_id,
  'Nghệ thuật điêu khắc gỗ',
  'Wood carving',
  '/wʊd ˈkɑːvɪŋ/',
  'Nghệ thuật điêu khắc gỗ',
  'The craft of cutting and shaping wood to form artistic decorative figures.',
  'Nghệ thuật điêu khắc gỗ Cơ Tu phản ánh mối giao cảm sâu sắc với thiên nhiên hoang dã.',
  'Cơ Tu wood carving reflects a profound kinship with wild nature.',
  1
);
INSERT INTO public.artifact_vocabulary (
  artifact_id,
  word_vi,
  word_en,
  pronunciation,
  definition_vi,
  definition_en,
  example_vi,
  example_en,
  display_order
) VALUES (
  art_id,
  'Con tê tê (loài thú vảy quý hiếm)',
  'Pangolin',
  '/ˈpæŋɡəlɪn/',
  'Con tê tê (loài thú vảy quý hiếm)',
  'An insect-eating mammal having a body covered with hard protective keratin scales.',
  'Con tê tê được tạc với lớp vảy hình học uốn cong tượng trưng cho lớp áo giáp bảo vệ.',
  'The pangolin is sculpted with curved geometric scales representing its protective armor.',
  2
);
INSERT INTO public.artifact_vocabulary (
  artifact_id,
  word_vi,
  word_en,
  pronunciation,
  definition_vi,
  definition_en,
  example_vi,
  example_en,
  display_order
) VALUES (
  art_id,
  'Tác phẩm điêu khắc từ một khối nguyên vẹn',
  'Monolithic sculpture',
  '/ˌmɒnəˈlɪθɪk ˈskʌlptʃər/',
  'Tác phẩm điêu khắc từ một khối nguyên vẹn',
  'A sculpture made from a single solid block or trunk of material.',
  'Nghệ nhân đã tạc nên con vật từ một thân gỗ rừng nguyên khối chắc chắn.',
  'The craftsman carved the animal from a monolithic log of durable forest wood.',
  3
);

-- -----------------------------------------------------------------------------
-- 3. SEED APPROVED REVIEWS
-- -----------------------------------------------------------------------------
DELETE FROM public.artifact_reviews WHERE reviewer_name IN ('Lê Tuấn Hùng', 'Đặng Minh Tuấn', 'Nguyễn Minh Đức', 'Hoàng Yến', 'Lucas Meyer', 'Alexandre Dubois', 'Phạm Quỳnh Chi', 'KS. Nguyễn Tiến Đạt', 'Trần Văn Toàn', 'Thầy Trần Quang Huy', 'Sarah Jenkins', 'Vũ Hoàng Long', 'Chị Mai Lan & Bé Tôm', 'Trịnh Mai Linh', 'Kenji Takahashi', 'Lê Thu Trang', 'Phạm Đức Anh');

INSERT INTO public.artifact_reviews (
  artifact_id,
  reviewer_name,
  reviewer_role_vi,
  reviewer_role_en,
  avatar_bg,
  avatar_initials,
  badge_vi,
  badge_en,
  rating,
  comment,
  status,
  likes,
  is_verified,
  created_at
) VALUES (
  (SELECT id FROM public.artifacts WHERE slug = 'guol-communal-house' LIMIT 1),
  'Lê Tuấn Hùng',
  'Frontend Dev - Duy Tân, Cầu Giấy, Hà Nội',
  'Frontend Developer - Cau Giay, Hanoi',
  'from-amber-600 to-rose-700',
  'TH',
  'Góp ý kỹ thuật',
  'Tech Feedback',
  3,
  'Giao diện và ý tưởng rất hay nhưng trên con iPhone 11 của mình lúc vừa load vào model 3D Nhà Gươl bị khựng tầm 1-2s do texture map khá nặng. Nhóm dev nên xem xét tạo mipmaps hoặc nén texture định dạng KTX2 / Basis Universal để máy tầm trung load mượt hơn nhé. Tạm cho 3 sao để team có động lực optimize thêm!',
  'approved',
  31,
  true,
  NOW() - INTERVAL '40 minutes'
);

INSERT INTO public.artifact_reviews (
  artifact_id,
  reviewer_name,
  reviewer_role_vi,
  reviewer_role_en,
  avatar_bg,
  avatar_initials,
  badge_vi,
  badge_en,
  rating,
  comment,
  status,
  likes,
  is_verified,
  created_at
) VALUES (
  NULL,
  'Đặng Minh Tuấn',
  'Senior Frontend Engineer - FPT Software (Hà Nội)',
  'Senior Frontend Engineer - Hanoi Tech Community',
  'from-blue-600 to-indigo-800',
  'MT',
  'Cộng đồng Developer',
  'Web Developer',
  5,
  'Thấy anh em share trong group JS Vietnam là vào test ngay! WebAR chạy trực tiếp trên trình duyệt bằng model-viewer cực kỳ mượt mà, không bắt user tải app rườm rà. Bundle tối ưu tốt, texture load trơn tru trên cả iPhone lẫn Android. 10 điểm cho team dev!',
  'approved',
  56,
  true,
  NOW() - INTERVAL '60 minutes'
);

INSERT INTO public.artifact_reviews (
  artifact_id,
  reviewer_name,
  reviewer_role_vi,
  reviewer_role_en,
  avatar_bg,
  avatar_initials,
  badge_vi,
  badge_en,
  rating,
  comment,
  status,
  likes,
  is_verified,
  created_at
) VALUES (
  NULL,
  'Nguyễn Minh Đức',
  'Dân mê du lịch - Ba Đình, Hà Nội',
  'Travel Enthusiast - Ba Dinh, Hanoi',
  'from-stone-600 to-amber-700',
  'MĐ',
  'Góp ý trải nghiệm',
  'UX Feedback',
  3,
  'Nhạc nền rừng cây tiếng suối chảy lúc vừa vào web hơi to, mình đang đeo tai nghe bị giật mình luôn. Nhóm nên để volume mặc định tầm 20-30% thôi hoặc có nút hỏi trước khi phát. Với lại bảo tàng mới có 5 hiện vật, lướt một lúc là hết rồi. Mong nhóm bổ sung thêm trang phục dệt cườm và các lễ hội nữa!',
  'approved',
  24,
  true,
  NOW() - INTERVAL '120 minutes'
);

INSERT INTO public.artifact_reviews (
  artifact_id,
  reviewer_name,
  reviewer_role_vi,
  reviewer_role_en,
  avatar_bg,
  avatar_initials,
  badge_vi,
  badge_en,
  rating,
  comment,
  status,
  likes,
  is_verified,
  created_at
) VALUES (
  (SELECT id FROM public.artifacts WHERE slug = 'ktu-traditional-drum' LIMIT 1),
  'Hoàng Yến',
  'K54 Dân tộc học - ĐH KHXH&NV Hà Nội',
  'Ethnology Researcher - USSH Hanoi',
  'from-rose-600 to-amber-700',
  'HY',
  'Người dùng Hà Nội',
  'Hanoi Researcher',
  5,
  'Mình ở Hà Nội đang làm khóa luận tốt nghiệp về nhạc cụ các tộc người Trường Sơn. Tìm khắp các trang bảo tàng mới thấy trang này dựng 3D trống K’tu chuẩn đến từng đinh tre nêm mặt da trâu. Phần chú giải song ngữ Anh - Việt rất chuẩn thuật ngữ nhân học. Cực kỳ hữu ích!',
  'approved',
  41,
  true,
  NOW() - INTERVAL '180 minutes'
);

INSERT INTO public.artifact_reviews (
  artifact_id,
  reviewer_name,
  reviewer_role_vi,
  reviewer_role_en,
  avatar_bg,
  avatar_initials,
  badge_vi,
  badge_en,
  rating,
  comment,
  status,
  likes,
  is_verified,
  created_at
) VALUES (
  (SELECT id FROM public.artifacts WHERE slug = 'guol-communal-house' LIMIT 1),
  'Lucas Meyer',
  'Digital Nomad & Dev - Berlin / Working in Hanoi',
  'Digital Nomad & Dev - Berlin / In Hanoi',
  'from-teal-600 to-cyan-800',
  'LM',
  'Góp ý kỹ thuật',
  'Tech Feedback',
  4,
  'The 3D viewer is responsive on desktop, but on mobile Safari when rotating with two fingers, the pinch-to-zoom gesture sometimes accidentally triggers the outer page scroll. Adding touch-action: pan-y or constraining orbit touches on <model-viewer> will fix this mobile annoyance.',
  'approved',
  38,
  true,
  NOW() - INTERVAL '240 minutes'
);

INSERT INTO public.artifact_reviews (
  artifact_id,
  reviewer_name,
  reviewer_role_vi,
  reviewer_role_en,
  avatar_bg,
  avatar_initials,
  badge_vi,
  badge_en,
  rating,
  comment,
  status,
  likes,
  is_verified,
  created_at
) VALUES (
  (SELECT id FROM public.artifacts WHERE slug = 'guol-communal-house' LIMIT 1),
  'Alexandre Dubois',
  'Creative Technologist - Paris / Living in Tay Ho, Hanoi',
  'Creative Technologist - Expat in Hanoi',
  'from-violet-600 to-purple-800',
  'AD',
  'Khách quốc tế (Expat)',
  'International Expat',
  5,
  'As a WebGL developer currently living in Hanoi, I am genuinely impressed! Preserving traditional indigenous architecture through interactive 3D and in-browser WebXR is inspiring. The lighting simulation and wood PBR materials feel organic and grounded. Bravo!',
  'approved',
  62,
  true,
  NOW() - INTERVAL '300 minutes'
);

INSERT INTO public.artifact_reviews (
  artifact_id,
  reviewer_name,
  reviewer_role_vi,
  reviewer_role_en,
  avatar_bg,
  avatar_initials,
  badge_vi,
  badge_en,
  rating,
  comment,
  status,
  likes,
  is_verified,
  created_at
) VALUES (
  (SELECT id FROM public.artifacts WHERE slug = 'ktu-traditional-drum' LIMIT 1),
  'Phạm Quỳnh Chi',
  'Sinh viên năm 3 ĐH Kinh tế Quốc dân, Hà Nội',
  'Undergraduate - NEU, Hanoi',
  'from-pink-600 to-amber-700',
  'QC',
  'Người dùng Hà Nội',
  'Hanoi Student',
  4,
  'Tính năng AR quét hiện vật đặt lên sàn rất xịn, nhưng phòng trọ mình ở Cầu Giấy buổi tối hơi thiếu sáng nên camera quét một hồi lâu mới bắt được mặt phẳng. Web nên có thêm dòng tip lưu ý người dùng là “Hãy đứng ở nơi đủ ánh sáng” để những bạn mù công nghệ như mình đỡ tưởng bị lỗi camera nhé!',
  'approved',
  27,
  true,
  NOW() - INTERVAL '1320 minutes'
);

INSERT INTO public.artifact_reviews (
  artifact_id,
  reviewer_name,
  reviewer_role_vi,
  reviewer_role_en,
  avatar_bg,
  avatar_initials,
  badge_vi,
  badge_en,
  rating,
  comment,
  status,
  likes,
  is_verified,
  created_at
) VALUES (
  (SELECT id FROM public.artifacts WHERE slug = 'guol-communal-house' LIMIT 1),
  'KS. Nguyễn Tiến Đạt',
  '3D Technical Artist - Gameloft Vietnam',
  '3D Technical Artist - Gameloft Vietnam',
  'from-emerald-600 to-cyan-800',
  'TĐ',
  '3D Specialist',
  '3D Specialist',
  5,
  'Dưới góc nhìn 3D artist, mình đánh giá rất cao việc nhóm đã nén Draco/Meshoptimizer để giảm thiểu dung lượng file GLB mà không làm vỡ topology của mái mai rùa. Normal map thớ gỗ và chi tiết đục đẽo chim Tr’drao lên hình bắt sáng rất có chiều sâu.',
  'approved',
  48,
  true,
  NOW() - INTERVAL '1440 minutes'
);

INSERT INTO public.artifact_reviews (
  artifact_id,
  reviewer_name,
  reviewer_role_vi,
  reviewer_role_en,
  avatar_bg,
  avatar_initials,
  badge_vi,
  badge_en,
  rating,
  comment,
  status,
  likes,
  is_verified,
  created_at
) VALUES (
  NULL,
  'Trần Văn Toàn',
  'Senior QA / Tester - Hà Nội Tech Club',
  'Senior QA Tester - Hanoi',
  'from-indigo-600 to-stone-700',
  'VT',
  'Góp ý kỹ thuật',
  'QA Bug Report',
  3,
  'Test thử tính năng Voice Shadowing luyện phát âm ở trang Học tập thấy trên trình duyệt Edge thỉnh thoảng micro bị delay 2-3s mới nhận diện được giọng nói nếu đường truyền mạng chập chờn. Nên có thêm nút phát audio mẫu dự phòng khi Web Speech API timeout. Web tiềm năng, chúc team fix sớm!',
  'approved',
  33,
  true,
  NOW() - INTERVAL '2640 minutes'
);

INSERT INTO public.artifact_reviews (
  artifact_id,
  reviewer_name,
  reviewer_role_vi,
  reviewer_role_en,
  avatar_bg,
  avatar_initials,
  badge_vi,
  badge_en,
  rating,
  comment,
  status,
  likes,
  is_verified,
  created_at
) VALUES (
  (SELECT id FROM public.artifacts WHERE slug = 'guol-communal-house' LIMIT 1),
  'Thầy Trần Quang Huy',
  'Giáo viên THPT Chu Văn An, Hà Nội',
  'Educator - Chu Van An High School, Hanoi',
  'from-amber-600 to-emerald-700',
  'QH',
  'Người dùng Hà Nội',
  'Hanoi Educator',
  5,
  'Sáng nay tôi vừa chiếu thử trang web này lên màn chiếu lớn cho học sinh lớp 10 xem chuyên đề Văn hóa các dân tộc Việt Nam. Cả lớp ồ lên thích thú khi được dùng chuột xoay 360 độ và zoom sát từng thớ gỗ. Một phương pháp giáo dục số hóa trực quan tuyệt vời!',
  'approved',
  39,
  true,
  NOW() - INTERVAL '2880 minutes'
);

INSERT INTO public.artifact_reviews (
  artifact_id,
  reviewer_name,
  reviewer_role_vi,
  reviewer_role_en,
  avatar_bg,
  avatar_initials,
  badge_vi,
  badge_en,
  rating,
  comment,
  status,
  likes,
  is_verified,
  created_at
) VALUES (
  (SELECT id FROM public.artifacts WHERE slug = 'bahieng-woven-basket' LIMIT 1),
  'Sarah Jenkins',
  'Digital Heritage Fellow - Oxford University / Visiting Hanoi',
  'Digital Heritage Fellow - Oxford University',
  'from-teal-600 to-blue-800',
  'SJ',
  'Khách quốc tế (Expat)',
  'International Researcher',
  5,
  'Stumbled upon this repository via a digital humanities network. The polygon fidelity on the rattan weaves of the Ba-hieng basket, paired with the bilingual ethnographic dossier, sets a stellar benchmark for open-access museum digitization. Top tier work!',
  'approved',
  52,
  true,
  NOW() - INTERVAL '4320 minutes'
);

INSERT INTO public.artifact_reviews (
  artifact_id,
  reviewer_name,
  reviewer_role_vi,
  reviewer_role_en,
  avatar_bg,
  avatar_initials,
  badge_vi,
  badge_en,
  rating,
  comment,
  status,
  likes,
  is_verified,
  created_at
) VALUES (
  NULL,
  'Vũ Hoàng Long',
  'Tech Lead & WebGL Enthusiast - Hà Nội Dev Club',
  'Tech Lead & WebGL Enthusiast - Hanoi',
  'from-cyan-600 to-blue-700',
  'HL',
  'Cộng đồng Developer',
  'Tech Lead',
  5,
  'Lướt code thấy kiến trúc component bằng React + TypeScript rất sạch. Việc xử lý camera-orbit với environment lighting của ModelViewer tùy biến chuẩn chỉnh. Thích nhất quả soundscape tiếng suối reo chim hót kết hợp giao diện dark-forest cực chill!',
  'approved',
  44,
  true,
  NOW() - INTERVAL '5760 minutes'
);

INSERT INTO public.artifact_reviews (
  artifact_id,
  reviewer_name,
  reviewer_role_vi,
  reviewer_role_en,
  avatar_bg,
  avatar_initials,
  badge_vi,
  badge_en,
  rating,
  comment,
  status,
  likes,
  is_verified,
  created_at
) VALUES (
  (SELECT id FROM public.artifacts WHERE slug = 'ktu-traditional-drum' LIMIT 1),
  'Chị Mai Lan & Bé Tôm',
  'Phụ huynh học sinh - Q. Ba Đình, Hà Nội',
  'Parent & Child - Ba Dinh, Hanoi',
  'from-pink-600 to-rose-700',
  'ML',
  'Người dùng Hà Nội',
  'Hanoi Family',
  5,
  'Bé 7 tuổi nhà mình ở Hà Nội mê tít phần quét QR hiện vật! Đưa điện thoại chiếu lên sàn phòng khách là chiếc trống hiện ra to đùng ngay trước mắt, bé bấm nghe tiếng gõ trống rền vang rồi cười tít mắt. Dự án vừa công nghệ cao vừa mang ý nghĩa giáo dục sâu sắc.',
  'approved',
  35,
  true,
  NOW() - INTERVAL '7200 minutes'
);

INSERT INTO public.artifact_reviews (
  artifact_id,
  reviewer_name,
  reviewer_role_vi,
  reviewer_role_en,
  avatar_bg,
  avatar_initials,
  badge_vi,
  badge_en,
  rating,
  comment,
  status,
  likes,
  is_verified,
  created_at
) VALUES (
  NULL,
  'Trịnh Mai Linh',
  'Senior UI/UX Designer - Cầu Giấy, Hà Nội',
  'Senior UI/UX Designer - Hanoi',
  'from-orange-600 to-amber-700',
  'ML',
  'UI/UX Designer',
  'UI/UX Designer',
  5,
  'Bảng màu kết hợp giữa tông gỗ trầm (heritage-wood), vàng hổ phách và xanh ngọc bích đại ngàn (Luminous Jade) rất sang trọng. Font chữ Lora và Be Vietnam Pro render dấu tiếng Việt rất mượt, spacing thoáng. Một trong những web văn hóa có UI đẹp nhất mình từng thấy!',
  'approved',
  51,
  true,
  NOW() - INTERVAL '8640 minutes'
);

INSERT INTO public.artifact_reviews (
  artifact_id,
  reviewer_name,
  reviewer_role_vi,
  reviewer_role_en,
  avatar_bg,
  avatar_initials,
  badge_vi,
  badge_en,
  rating,
  comment,
  status,
  likes,
  is_verified,
  created_at
) VALUES (
  (SELECT id FROM public.artifacts WHERE slug = 'tkoor-sacred-pillar' LIMIT 1),
  'Kenji Takahashi',
  'Software Engineer & Digital Nomad - Tokyo, Japan',
  'Software Engineer - Expat Nomad',
  'from-indigo-600 to-blue-800',
  'KT',
  'Khách quốc tế (Expat)',
  'International Developer',
  5,
  'Impressive responsive performance on mobile Safari. The AR quick-look projection of the sacred T’koor pillar rendered immediately with zero stutter. Beautiful craftsmanship both in ethnic heritage and modern frontend engineering.',
  'approved',
  38,
  true,
  NOW() - INTERVAL '10080 minutes'
);

INSERT INTO public.artifact_reviews (
  artifact_id,
  reviewer_name,
  reviewer_role_vi,
  reviewer_role_en,
  avatar_bg,
  avatar_initials,
  badge_vi,
  badge_en,
  rating,
  comment,
  status,
  likes,
  is_verified,
  created_at
) VALUES (
  NULL,
  'Lê Thu Trang',
  'Content Creator & Travel Enthusiast - Hà Nội',
  'Content Creator - Hanoi',
  'from-pink-600 to-purple-700',
  'TT',
  'Người dùng Hà Nội',
  'Hanoi Creator',
  5,
  'Là một người sống ở Hà Nội nhưng cực kỳ mê du lịch khám phá văn hóa miền Trung, mình cảm thấy web này chạm đúng trái tim. Ngồi tại phòng làm việc ở thủ đô mà đeo tai nghe vào là như được đắm mình vào giữa núi rừng đại ngàn. Đã share lên Threads và Facebook!',
  'approved',
  47,
  true,
  NOW() - INTERVAL '10800 minutes'
);

INSERT INTO public.artifact_reviews (
  artifact_id,
  reviewer_name,
  reviewer_role_vi,
  reviewer_role_en,
  avatar_bg,
  avatar_initials,
  badge_vi,
  badge_en,
  rating,
  comment,
  status,
  likes,
  is_verified,
  created_at
) VALUES (
  NULL,
  'Phạm Đức Anh',
  'Fullstack Dev - Cựu sinh viên ĐH Bách Khoa Hà Nội',
  'Fullstack Dev - HUST Alum, Hanoi',
  'from-emerald-700 to-amber-800',
  'ĐA',
  'Cộng đồng Developer',
  'Fullstack Engineer',
  5,
  'Trang Dashboard thống kê lượt xem với phần Quiz mini-game làm rất chỉn chu. Quả confetti nổ tung khi submit feedback này nhìn vui mắt phết anh em ơi! Web này mang đi demo sản phẩm chuyển đổi số di sản đảm bảo gây ấn tượng mạnh.',
  'approved',
  43,
  true,
  NOW() - INTERVAL '19200 minutes'
);

-- -----------------------------------------------------------------------------
-- 4. SEED WEBSITE CONTENTS
-- -----------------------------------------------------------------------------
INSERT INTO public.website_contents (content_key, title_vi, title_en, content_vi, content_en, image_path)
VALUES
  (
    'home_hero',
    'Chạm Vào Hồn Gỗ & Nhịp Rừng Văn Hóa Cơ Tu Trong Không Gian 3D & WebAR',
    'Touch the Forest Spirit of Cơ Tu Heritage in Interactive 3D & WebAR',
    'Bước vào buôn làng giữa sương mây Trường Sơn: xoay ngắm từng thớ gỗ chạm khắc trên mái Nhà Gươl, cảm nhận nhịp trống da trâu K’tu trầm hùng và khám phá câu chuyện bản sắc bằng học liệu song ngữ Việt – Anh.',
    'Step into an ancient mountain village amid Trường Sơn mists: examine hand-chiseled timber carvings of the sacred Gươl roof, feel the resonance of the K’tu drum, and explore highland ethnography in English and Vietnamese.',
    '/images/hero-highlands-bg.jpg'
  ),
  (
    'home_collection_intro',
    'Bộ Sưu Tập Di Sản Văn Hóa Cơ Tu Tây Giang',
    'Cơ Tu Cultural Heritage 3D Collection',
    'Từ mái Nhà Gươl sừng sững, nhịp Trống K’tu, Gùi Ba-hieng, Chiêng đồng đến Trang phục thổ cẩm nam nữ và Tượng điêu khắc Tê tê — mỗi hiện vật là một chứng tích sống động với mô hình 3D thực tế.',
    'From the soaring Gươl roof, resonant K’tu drum, Ba-hieng basket, and bronze gongs to traditional male & female brocade attire and chiseled pangolin sculptures—each artifact is digitized with authentic 3D photogrammetry models.',
    NULL
  ),
  (
    'home_lexicon_intro',
    'Kể Chuyện Bản Làng Cơ Tu Với Bạn Bè Quốc Tế',
    'Share Cơ Tu Village Stories with the World',
    'Chạm vào từng thuật ngữ để nghe phát âm tiếng Anh chuẩn mực và khám phá cách chuyển tải những nét đẹp nguyên bản của Tây Giang sang ngôn ngữ học thuật quốc tế.',
    'Tap any cultural term to listen to authentic pronunciation and learn how highland indigenous heritage is described in international academic contexts.',
    NULL
  ),
  (
    'about_project',
    'Dự Án Số Hóa Di Sản Văn Hóa Cơ Tu Tây Giang',
    'Tây Giang Cơ Tu Digital Heritage Preservation Project',
    'Không gian Bảo tàng Số 3D/AR lưu giữ và lan tỏa vẻ đẹp kiến trúc, nhạc cụ và nghề thủ công truyền thống của đồng bào Cơ Tu giữa đại ngàn Trường Sơn – Tây Giang, Quảng Nam.',
    'An interactive 3D/AR Digital Museum preserving and celebrating the architecture, musical instruments, and traditional crafts of the Cơ Tu people in the Trường Sơn – Tây Giang highlands.',
    '/images/logo-emblem.png'
  ),
  (
    'village_map_intro',
    'Bản Đồ Không Gian Bản Làng Cơ Tu Đồng Tâm',
    'Concentric Village Spatial & Cosmological Map',
    'Quy hoạch không gian làng truyền thống của người Cơ Tu tuân theo trật tự vũ trụ đồng tâm: Cột tế T’kơơr ở trung tâm, Nhà Gươl uy nghiêm, vòng sân hội và đại ngàn bao bọc.',
    'Traditional Cơ Tu village spatial planning adheres to a concentric cosmic order: the central T’kơơr pole, the monumental Gươl communal house, the festival dance ring, and the protective virgin forest.',
    NULL
  )
ON CONFLICT (content_key) DO UPDATE SET
  title_vi = EXCLUDED.title_vi,
  title_en = EXCLUDED.title_en,
  content_vi = EXCLUDED.content_vi,
  content_en = EXCLUDED.content_en,
  image_path = EXCLUDED.image_path,
  updated_at = NOW();

END $$;
