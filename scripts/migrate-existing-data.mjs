/**
 * CO-TU HERITAGE AR - AUTOMATED SUPABASE DATA & STORAGE MIGRATION SCRIPT
 *
 * Usage:
 *   node scripts/migrate-existing-data.mjs
 *
 * Reads SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_KEY / VITE_SUPABASE_URL)
 * from environment variables or .env/.env.local file.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load environment variables from .env.local or .env if present
function loadEnv() {
  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    const fullPath = path.join(rootDir, file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      content.split('\n').forEach((line) => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          const key = match[1];
          let value = match[2] || '';
          if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
          if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
          if (!process.env[key]) {
            process.env[key] = value.trim();
          }
        }
      });
    }
  }
}

loadEnv();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY;

console.log('===============================================================');
console.log(' CO-TU HERITAGE AR: DATA & STORAGE MIGRATION RUNNER');
console.log('===============================================================');

if (!supabaseUrl || !supabaseKey) {
  console.error('\n❌ ERROR: Supabase credentials not found in environment.');
  console.log('Please configure VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY (or SUPABASE_SERVICE_ROLE_KEY) in .env.local\n');
  process.exit(1);
}

console.log(`📡 Connecting to Supabase at: ${supabaseUrl}`);
const supabase = createClient(supabaseUrl, supabaseKey);

// 1. Parse TypeScript data sources
async function parseSourceData() {
  console.log('📖 Reading source files...');

  // Artifacts
  let artifactsCode = fs.readFileSync(path.join(rootDir, 'src/data/artifactsData.ts'), 'utf8');
  artifactsCode = artifactsCode.replace(/import\s+[^;]+;/, '');
  artifactsCode = artifactsCode.replace(/export\s+const\s+ARTIFACTS_DATA\s*:\s*Artifact\[\]\s*=/, 'const ARTIFACTS_DATA =');
  artifactsCode += '\nmodule.exports = { ARTIFACTS_DATA };';
  const artFn = new Function('module', 'exports', artifactsCode);
  const artExp = {};
  const artMod = { exports: artExp };
  artFn(artMod, artExp);
  const artifacts = artMod.exports.ARTIFACTS_DATA;

  // Feedback
  let feedbackCode = fs.readFileSync(path.join(rootDir, 'src/services/feedbackService.ts'), 'utf8');
  feedbackCode = feedbackCode.replace(/import\s+[^;]+;/, '');
  feedbackCode = feedbackCode.replace(/export\s+const\s+SEED_FEEDBACK_COMMENTS\s*:\s*FeedbackComment\[\]\s*=/, 'const SEED_FEEDBACK_COMMENTS =');
  feedbackCode = feedbackCode.replace(/export\s+const\s+feedbackService\s*=[\s\S]*$/, '');
  feedbackCode += '\nmodule.exports = { SEED_FEEDBACK_COMMENTS };';
  const fbFn = new Function('module', 'exports', feedbackCode);
  const fbExp = {};
  const fbMod = { exports: fbExp };
  fbFn(fbMod, fbExp);
  const comments = fbMod.exports.SEED_FEEDBACK_COMMENTS;

  return { artifacts, comments };
}

// 2. Upload storage assets
async function uploadStorageAssets() {
  console.log('\n📦 Step 1: Uploading assets to Supabase Storage...');

  const modelMap = [
    { local: 'public/models/guol.glb', bucket: 'artifact-models', dest: 'guol-communal-house/model.glb', mime: 'model/gltf-binary' },
    { local: 'public/models/ktu-drum.glb', bucket: 'artifact-models', dest: 'ktu-traditional-drum/model.glb', mime: 'model/gltf-binary' },
    { local: 'public/models/bahieng-basket.glb', bucket: 'artifact-models', dest: 'bahieng-carrying-basket/model.glb', mime: 'model/gltf-binary' },
    { local: 'public/models/chieng.glb', bucket: 'artifact-models', dest: 'chieng-gong-instrument/model.glb', mime: 'model/gltf-binary' },
    { local: 'public/models/ao-nam.glb', bucket: 'artifact-models', dest: 'ao-nam-cotu/model.glb', mime: 'model/gltf-binary' },
    { local: 'public/models/ao-nu.glb', bucket: 'artifact-models', dest: 'ao-nu-cotu/model.glb', mime: 'model/gltf-binary' },
    { local: 'public/models/te-te.glb', bucket: 'artifact-models', dest: 'tuong-te-te-cotu/model.glb', mime: 'model/gltf-binary' }
  ];

  for (const item of modelMap) {
    const fullPath = path.join(rootDir, item.local);
    if (fs.existsSync(fullPath)) {
      const fileBuffer = fs.readFileSync(fullPath);
      console.log(`  ⬆️ Uploading ${item.local} (${(fileBuffer.length / (1024*1024)).toFixed(2)} MB)...`);
      const { error } = await supabase.storage.from(item.bucket).upload(item.dest, fileBuffer, {
        contentType: item.mime,
        upsert: true
      });
      if (error) {
        console.warn(`    ⚠️ Upload note: ${error.message}`);
      } else {
        console.log(`    ✅ Uploaded to ${item.bucket}/${item.dest}`);
      }
    }
  }

  const imageMap = [
    { local: 'public/images/guol-authentic.jpg', bucket: 'artifact-images', dest: 'guol-communal-house/thumbnail.jpg', mime: 'image/jpeg' },
    { local: 'public/images/drum-authentic.jpg', bucket: 'artifact-images', dest: 'ktu-traditional-drum/thumbnail.jpg', mime: 'image/jpeg' },
    { local: 'public/images/basket-authentic.jpg', bucket: 'artifact-images', dest: 'bahieng-carrying-basket/thumbnail.jpg', mime: 'image/jpeg' },
    { local: 'public/images/chieng-authentic.jpg', bucket: 'artifact-images', dest: 'chieng-gong-instrument/thumbnail.jpg', mime: 'image/jpeg' },
    { local: 'public/images/aonam_v2.png', bucket: 'artifact-images', dest: 'ao-nam-cotu/thumbnail.png', mime: 'image/png' },
    { local: 'public/images/aonu_v2.png', bucket: 'artifact-images', dest: 'ao-nu-cotu/thumbnail.png', mime: 'image/png' },
    { local: 'public/images/tete_v2.png', bucket: 'artifact-images', dest: 'tuong-te-te-cotu/thumbnail.png', mime: 'image/png' },
    { local: 'public/images/hero-highlands-bg.jpg', bucket: 'website-assets', dest: 'homepage/hero-highlands-bg.jpg', mime: 'image/jpeg' },
    { local: 'public/images/logo-emblem.png', bucket: 'website-assets', dest: 'branding/logo-emblem.png', mime: 'image/png' }
  ];

  for (const item of imageMap) {
    const fullPath = path.join(rootDir, item.local);
    if (fs.existsSync(fullPath)) {
      const fileBuffer = fs.readFileSync(fullPath);
      console.log(`  ⬆️ Uploading ${item.local}...`);
      const { error } = await supabase.storage.from(item.bucket).upload(item.dest, fileBuffer, {
        contentType: item.mime,
        upsert: true
      });
      if (error) {
        console.warn(`    ⚠️ Upload note: ${error.message}`);
      } else {
        console.log(`    ✅ Uploaded to ${item.bucket}/${item.dest}`);
      }
    }
  }
}

// 3. Migrate PostgreSQL tables
async function migrateDatabase(artifacts, comments) {
  console.log('\n🗄️ Step 2: Seeding PostgreSQL Database...');

  // 3.1 Categories
  console.log('  ➡️ Seeding categories...');
  const categories = [
    { slug: 'architecture', name_vi: 'Kiến trúc truyền thống', name_en: 'Traditional Architecture', display_order: 1 },
    { slug: 'musical_instrument', name_vi: 'Nhạc cụ cổ truyền', name_en: 'Traditional Musical Instruments', display_order: 2 },
    { slug: 'weaving_craft', name_vi: 'Đan lát & Dệt thổ cẩm', name_en: 'Basketry & Brocade Weaving', display_order: 3 },
    { slug: 'spiritual_sculpture', name_vi: 'Điêu khắc & Tâm linh', name_en: 'Spiritual Sculpture', display_order: 4 },
    { slug: 'daily_tool', name_vi: 'Công cụ đời sống', name_en: 'Daily Living & Hunting Tools', display_order: 5 }
  ];

  for (const cat of categories) {
    await supabase.from('artifact_categories').upsert(cat, { onConflict: 'slug' });
  }

  const { data: dbCategories } = await supabase.from('artifact_categories').select('id, slug');
  const catIdMap = {};
  (dbCategories || []).forEach((c) => {
    catIdMap[c.slug] = c.id;
  });

  // 3.2 Artifacts
  console.log('  ➡️ Seeding artifacts...');
  for (let idx = 0; idx < artifacts.length; idx++) {
    const art = artifacts[idx];
    const categoryId = catIdMap[art.category] || null;

    const artifactRow = {
      slug: art.slug,
      category_id: categoryId,
      name_vi: art.name.vi,
      name_en: art.name.en,
      short_description_vi: art.brief?.vi,
      short_description_en: art.brief?.en,
      description_vi: art.description?.vi,
      description_en: art.description?.en,
      origin_vi: art.origin?.vi,
      origin_en: art.origin?.en,
      materials_vi: art.materials?.vi,
      materials_en: art.materials?.en,
      dimensions: art.dimensions,
      historical_story_vi: art.sections?.[0]?.content?.vi || null,
      historical_story_en: art.sections?.[0]?.content?.en || null,
      cultural_meaning_vi: art.sections?.[1]?.content?.vi || null,
      cultural_meaning_en: art.sections?.[1]?.content?.en || null,
      thumbnail_path: art.thumbnail,
      model_3d_path: art.model3D,
      model_status: art.modelStatus || 'available',
      content_status: art.contentStatus || 'verified',
      verification_note: art.verificationNote || null,
      sources: art.sources || [],
      qr_code: art.slug,
      sections: art.sections || [],
      is_published: true,
      display_order: idx + 1
    };

    const { data: savedArt, error: artErr } = await supabase
      .from('artifacts')
      .upsert(artifactRow, { onConflict: 'slug' })
      .select('id')
      .single();

    if (artErr) {
      console.error(`    ❌ Error upserting artifact ${art.slug}:`, artErr.message);
      continue;
    }

    const artId = savedArt.id;

    // Artifact Image Gallery
    if (art.thumbnail) {
      await supabase.from('artifact_images').upsert(
        {
          artifact_id: artId,
          storage_path: art.thumbnail,
          alt_text_vi: art.name.vi,
          alt_text_en: art.name.en,
          display_order: 1
        },
        { onConflict: 'id' }
      );
    }

    // Artifact Vocabulary
    if (art.vocabulary && art.vocabulary.length > 0) {
      await supabase.from('artifact_vocabulary').delete().eq('artifact_id', artId);
      const vocabRows = art.vocabulary.map((voc, vIdx) => ({
        artifact_id: artId,
        word_vi: voc.vietnameseMeaning,
        word_en: voc.term,
        pronunciation: voc.ipa || null,
        definition_vi: voc.vietnameseMeaning,
        definition_en: voc.englishDefinition || null,
        example_vi: voc.exampleSentence?.vi || null,
        example_en: voc.exampleSentence?.en || null,
        display_order: vIdx + 1
      }));
      await supabase.from('artifact_vocabulary').insert(vocabRows);
    }
  }

  // 3.3 Reviews
  console.log('  ➡️ Seeding reviews...');
  for (const c of comments) {
    let artId = null;
    if (c.targetArtifactSlug && c.targetArtifactSlug !== 'all') {
      const { data: artRec } = await supabase
        .from('artifacts')
        .select('id')
        .eq('slug', c.targetArtifactSlug)
        .single();
      if (artRec) artId = artRec.id;
    }

    await supabase.from('artifact_reviews').insert({
      artifact_id: artId,
      reviewer_name: c.authorName,
      reviewer_role_vi: c.authorRole,
      reviewer_role_en: c.authorRoleEn || c.authorRole,
      avatar_bg: c.avatarBg || 'from-amber-600 to-rose-700',
      avatar_initials: c.avatarInitials || 'CT',
      badge_vi: c.badge || null,
      badge_en: c.badgeEn || null,
      rating: c.rating,
      comment: c.contentVi,
      status: 'approved',
      likes: c.likes || 0,
      is_verified: Boolean(c.isVerified)
    });
  }

  // 3.4 Website Content
  console.log('  ➡️ Seeding website contents...');
  const contents = [
    {
      content_key: 'home_hero',
      title_vi: 'Chạm Vào Hồn Gỗ & Nhịp Rừng Văn Hóa Cơ Tu Trong Không Gian 3D & WebAR',
      title_en: 'Touch the Forest Spirit of Cơ Tu Heritage in Interactive 3D & WebAR',
      content_vi: 'Bước vào buôn làng giữa sương mây Trường Sơn: xoay ngắm từng thớ gỗ chạm khắc trên mái Nhà Gươl, cảm nhận nhịp trống da trâu K’tu trầm hùng và khám phá câu chuyện bản sắc bằng học liệu song ngữ Việt – Anh.',
      content_en: 'Step into an ancient mountain village amid Trường Sơn mists: examine hand-chiseled timber carvings of the sacred Gươl roof, feel the resonance of the K’tu drum, and explore highland ethnography in English and Vietnamese.',
      image_path: '/images/hero-highlands-bg.jpg'
    },
    {
      content_key: 'home_collection_intro',
      title_vi: 'Bộ Sưu Tập Di Sản Văn Hóa Cơ Tu Tây Giang',
      title_en: 'Cơ Tu Cultural Heritage 3D Collection',
      content_vi: 'Từ mái Nhà Gươl sừng sững, nhịp Trống K’tu, Gùi Ba-hieng, Chiêng đồng đến Trang phục thổ cẩm nam nữ và Tượng điêu khắc Tê tê — mỗi hiện vật là một chứng tích sống động với mô hình 3D thực tế.',
      content_en: 'From the soaring Gươl roof, resonant K’tu drum, Ba-hieng basket, and bronze gongs to traditional male & female brocade attire and chiseled pangolin sculptures—each artifact is digitized with authentic 3D photogrammetry models.'
    },
    {
      content_key: 'home_lexicon_intro',
      title_vi: 'Kể Chuyện Bản Làng Cơ Tu Với Bạn Bè Quốc Tế',
      title_en: 'Share Cơ Tu Village Stories with the World',
      content_vi: 'Chạm vào từng thuật ngữ để nghe phát âm tiếng Anh chuẩn mực và khám phá cách chuyển tải những nét đẹp nguyên bản của Tây Giang sang ngôn ngữ học thuật quốc tế.',
      content_en: 'Tap any cultural term to listen to authentic pronunciation and learn how highland indigenous heritage is described in international academic contexts.'
    },
    {
      content_key: 'about_project',
      title_vi: 'Dự Án Số Hóa Di Sản Văn Hóa Cơ Tu Tây Giang',
      title_en: 'Tây Giang Cơ Tu Digital Heritage Preservation Project',
      content_vi: 'Không gian Bảo tàng Số 3D/AR lưu giữ và lan tỏa vẻ đẹp kiến trúc, nhạc cụ và nghề thủ công truyền thống của đồng bào Cơ Tu giữa đại ngàn Trường Sơn – Tây Giang, Quảng Nam.',
      content_en: 'An interactive 3D/AR Digital Museum preserving and celebrating the architecture, musical instruments, and traditional crafts of the Cơ Tu people in the Trường Sơn – Tây Giang highlands.',
      image_path: '/images/logo-emblem.png'
    },
    {
      content_key: 'village_map_intro',
      title_vi: 'Bản Đồ Không Gian Bản Làng Cơ Tu Đồng Tâm',
      title_en: 'Concentric Village Spatial & Cosmological Map',
      content_vi: 'Quy hoạch không gian làng truyền thống của người Cơ Tu tuân theo trật tự vũ trụ đồng tâm: Cột tế T’kơơr ở trung tâm, Nhà Gươl uy nghiêm, vòng sân hội và đại ngàn bao bọc.',
      content_en: 'Traditional Cơ Tu village spatial planning adheres to a concentric cosmic order: the central T’kơơr pole, the monumental Gươl communal house, the festival dance ring, and the protective virgin forest.'
    }
  ];

  for (const item of contents) {
    await supabase.from('website_contents').upsert(item, { onConflict: 'content_key' });
  }

  // 4. Verification
  console.log('\n📊 Step 3: Verifying database record counts...');
  const { count: catCount } = await supabase.from('artifact_categories').select('*', { count: 'exact', head: true });
  const { count: artCount } = await supabase.from('artifacts').select('*', { count: 'exact', head: true });
  const { count: vocabCount } = await supabase.from('artifact_vocabulary').select('*', { count: 'exact', head: true });
  const { count: reviewCount } = await supabase.from('artifact_reviews').select('*', { count: 'exact', head: true });
  const { count: contentCount } = await supabase.from('website_contents').select('*', { count: 'exact', head: true });

  console.log(`  - Categories: ${catCount} (Expected: 5)`);
  console.log(`  - Artifacts: ${artCount} (Expected: 7)`);
  console.log(`  - Vocabulary: ${vocabCount} (Expected: >= 20)`);
  console.log(`  - Reviews: ${reviewCount} (Expected: >= 17)`);
  console.log(`  - Website Contents: ${contentCount} (Expected: >= 5)`);
  console.log('\n✨ Migration script completed successfully!');
}

async function main() {
  try {
    const { artifacts, comments } = await parseSourceData();
    await uploadStorageAssets();
    await migrateDatabase(artifacts, comments);
  } catch (err) {
    console.error('\n❌ Fatal migration error:', err);
    process.exit(1);
  }
}

main();
