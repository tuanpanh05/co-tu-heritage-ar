/**
 * Generator script to create idempotent SQL seed file for Supabase PostgreSQL
 */
const fs = require('fs');
const path = require('path');

// 1. Parse artifactsData.ts
let artifactsCode = fs.readFileSync(path.join(__dirname, '../src/data/artifactsData.ts'), 'utf8');
artifactsCode = artifactsCode.replace(/import\s+[^;]+;/, '');
artifactsCode = artifactsCode.replace(/export\s+const\s+ARTIFACTS_DATA\s*:\s*Artifact\[\]\s*=/, 'const ARTIFACTS_DATA =');
artifactsCode += '\nmodule.exports = { ARTIFACTS_DATA };';
const artFn = new Function('module', 'exports', artifactsCode);
const artExp = {};
const artMod = { exports: artExp };
artFn(artMod, artExp);
const artifacts = artMod.exports.ARTIFACTS_DATA;

// 2. Parse feedbackService.ts
let feedbackCode = fs.readFileSync(path.join(__dirname, '../src/services/feedbackService.ts'), 'utf8');
feedbackCode = feedbackCode.replace(/import\s+[^;]+;/, '');
feedbackCode = feedbackCode.replace(/export\s+const\s+SEED_FEEDBACK_COMMENTS\s*:\s*FeedbackComment\[\]\s*=/, 'const SEED_FEEDBACK_COMMENTS =');
feedbackCode = feedbackCode.replace(/export\s+const\s+feedbackService\s*=[\s\S]*$/, '');
feedbackCode += '\nmodule.exports = { SEED_FEEDBACK_COMMENTS };';
const fbFn = new Function('module', 'exports', feedbackCode);
const fbExp = {};
const fbMod = { exports: fbExp };
fbFn(fbMod, fbExp);
const comments = fbMod.exports.SEED_FEEDBACK_COMMENTS;

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return "'" + String(str).replace(/'/g, "''") + "'";
}

let sql = `-- =============================================================================
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
`;

artifacts.forEach((art, idx) => {
  let catVar = 'cat_arch_id';
  if (art.category === 'musical_instrument') catVar = 'cat_music_id';
  if (art.category === 'weaving_craft') catVar = 'cat_weav_id';
  if (art.category === 'spiritual_sculpture') catVar = 'cat_sculp_id';
  if (art.category === 'daily_tool') catVar = 'cat_daily_id';

  const sectionsJson = JSON.stringify(art.sections || []);
  const sourcesArray = (art.sources || []).map(s => escapeSql(s)).join(', ');

  sql += `
-- Artifact: ${art.slug}
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
  ${escapeSql(art.slug)},
  ${catVar},
  ${escapeSql(art.name.vi)},
  ${escapeSql(art.name.en)},
  ${escapeSql(art.brief?.vi)},
  ${escapeSql(art.brief?.en)},
  ${escapeSql(art.description?.vi)},
  ${escapeSql(art.description?.en)},
  ${escapeSql(art.origin?.vi)},
  ${escapeSql(art.origin?.en)},
  ${escapeSql(art.materials?.vi)},
  ${escapeSql(art.materials?.en)},
  ${escapeSql(art.dimensions)},
  ${escapeSql(art.sections?.[0]?.content?.vi || '')},
  ${escapeSql(art.sections?.[0]?.content?.en || '')},
  ${escapeSql(art.sections?.[1]?.content?.vi || '')},
  ${escapeSql(art.sections?.[1]?.content?.en || '')},
  ${escapeSql(art.thumbnail)},
  ${escapeSql(art.model3D)},
  ${escapeSql(art.modelStatus || 'available')},
  ${escapeSql(art.contentStatus || 'verified')},
  ${escapeSql(art.verificationNote || '')},
  ARRAY[${sourcesArray}]::text[],
  ${escapeSql(art.audio?.vi || '')},
  ${escapeSql(art.audio?.en || '')},
  ${escapeSql(art.slug)},
  ${escapeSql(sectionsJson)}::jsonb,
  true,
  ${idx + 1}
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

SELECT id INTO art_id FROM public.artifacts WHERE slug = ${escapeSql(art.slug)};

-- Images for ${art.slug}
DELETE FROM public.artifact_images WHERE artifact_id = art_id;
INSERT INTO public.artifact_images (artifact_id, storage_path, alt_text_vi, alt_text_en, display_order)
VALUES
  (art_id, ${escapeSql(art.thumbnail)}, ${escapeSql(art.name.vi)}, ${escapeSql(art.name.en)}, 1);
`;

  if (art.originalImages && art.originalImages.length > 0) {
    art.originalImages.forEach((img, imgIdx) => {
      if (img !== art.thumbnail) {
        sql += `INSERT INTO public.artifact_images (artifact_id, storage_path, alt_text_vi, alt_text_en, display_order)
VALUES (art_id, ${escapeSql(img)}, ${escapeSql(art.name.vi + ' tư liệu')}, ${escapeSql(art.name.en + ' field photo')}, ${imgIdx + 2});\n`;
      }
    });
  }

  // Vocabulary for this artifact
  if (art.vocabulary && art.vocabulary.length > 0) {
    sql += `\n-- Vocabulary for ${art.slug}\nDELETE FROM public.artifact_vocabulary WHERE artifact_id = art_id;\n`;
    art.vocabulary.forEach((voc, vocIdx) => {
      sql += `INSERT INTO public.artifact_vocabulary (
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
  ${escapeSql(voc.vietnameseMeaning)},
  ${escapeSql(voc.term)},
  ${escapeSql(voc.ipa || '')},
  ${escapeSql(voc.vietnameseMeaning)},
  ${escapeSql(voc.englishDefinition || '')},
  ${escapeSql(voc.exampleSentence?.vi || '')},
  ${escapeSql(voc.exampleSentence?.en || '')},
  ${vocIdx + 1}
);\n`;
    });
  }
});

sql += `
-- -----------------------------------------------------------------------------
-- 3. SEED APPROVED REVIEWS
-- -----------------------------------------------------------------------------
DELETE FROM public.artifact_reviews WHERE reviewer_name IN (${comments.map(c => escapeSql(c.authorName)).join(', ')});
`;

comments.forEach(c => {
  let targetSlug = c.targetArtifactSlug;
  let artLookup = 'NULL';
  if (targetSlug && targetSlug !== 'all') {
    artLookup = `(SELECT id FROM public.artifacts WHERE slug = ${escapeSql(targetSlug)} LIMIT 1)`;
  }

  sql += `
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
  ${artLookup},
  ${escapeSql(c.authorName)},
  ${escapeSql(c.authorRole)},
  ${escapeSql(c.authorRoleEn || c.authorRole)},
  ${escapeSql(c.avatarBg || 'from-amber-600 to-rose-700')},
  ${escapeSql(c.avatarInitials || 'CT')},
  ${escapeSql(c.badge || '')},
  ${escapeSql(c.badgeEn || '')},
  ${c.rating},
  ${escapeSql(c.contentVi)},
  'approved',
  ${c.likes || 0},
  ${c.isVerified ? 'true' : 'false'},
  NOW() - INTERVAL '${Math.floor((Date.now() - c.timestamp) / 60000)} minutes'
);
`;
});

sql += `
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
`;

fs.writeFileSync(path.join(__dirname, '../supabase/migrations/20261116000004_seed_data.sql'), sql, 'utf8');
console.log('Successfully generated supabase/migrations/20261116000004_seed_data.sql');
