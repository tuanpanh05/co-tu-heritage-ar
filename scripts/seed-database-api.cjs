const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables from .env.local
function getEnv() {
  const envPath = path.resolve(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    lines.forEach((line) => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = (match[2] || '').trim().replace(/^['"]|['"]$/g, '');
      }
    });
  }
}
getEnv();

const url = process.env.VITE_SUPABASE_URL || 'https://ejgdtcmqtekvvgrvargx.supabase.co';
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!key) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(url, key);

async function run() {
  console.log('🚀 Seeding Supabase database directly via API...');

  // 1. Categories
  console.log('1. Seeding categories...');
  const categories = [
    { slug: 'architecture', name_vi: 'Kiến trúc truyền thống', name_en: 'Traditional Architecture', display_order: 1 },
    { slug: 'musical_instrument', name_vi: 'Nhạc cụ cổ truyền', name_en: 'Traditional Musical Instruments', display_order: 2 },
    { slug: 'weaving_craft', name_vi: 'Đan lát & Dệt thổ cẩm', name_en: 'Basketry & Brocade Weaving', display_order: 3 },
    { slug: 'spiritual_sculpture', name_vi: 'Điêu khắc & Tâm linh', name_en: 'Spiritual Sculpture', display_order: 4 },
    { slug: 'daily_tool', name_vi: 'Công cụ đời sống', name_en: 'Daily Living & Hunting Tools', display_order: 5 }
  ];

  for (const cat of categories) {
    const { error } = await supabase.from('artifact_categories').upsert(cat, { onConflict: 'slug' });
    if (error) console.error('  Error cat:', cat.slug, error.message);
  }

  const { data: dbCategories } = await supabase.from('artifact_categories').select('id, slug');
  const catMap = {};
  (dbCategories || []).forEach(c => { catMap[c.slug] = c.id; });

  // 2. Artifacts
  console.log('2. Seeding artifacts, images & vocabulary...');
  let artifactsCode = fs.readFileSync(path.join(__dirname, '../src/data/artifactsData.ts'), 'utf8');
  artifactsCode = artifactsCode.replace(/import\s+[^;]+;/, '');
  artifactsCode = artifactsCode.replace(/export\s+const\s+ARTIFACTS_DATA\s*:\s*Artifact\[\]\s*=/, 'const ARTIFACTS_DATA =');
  artifactsCode += '\nmodule.exports = { ARTIFACTS_DATA };';
  const artFn = new Function('module', 'exports', artifactsCode);
  const artExp = {};
  const artMod = { exports: artExp };
  artFn(artMod, artExp);
  const artifacts = artMod.exports.ARTIFACTS_DATA;

  for (let idx = 0; idx < artifacts.length; idx++) {
    const art = artifacts[idx];
    const categoryId = catMap[art.category] || null;

    const row = {
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

    const { data: savedArt, error: aErr } = await supabase
      .from('artifacts')
      .upsert(row, { onConflict: 'slug' })
      .select('id')
      .single();

    if (aErr) {
      console.error('  Error art:', art.slug, aErr.message);
      continue;
    }
    const artId = savedArt.id;

    // Images
    await supabase.from('artifact_images').delete().eq('artifact_id', artId);
    const imgRows = [
      { artifact_id: artId, storage_path: art.thumbnail, alt_text_vi: art.name.vi, alt_text_en: art.name.en, display_order: 1 }
    ];
    if (art.originalImages) {
      art.originalImages.forEach((img, i) => {
        if (img !== art.thumbnail) {
          imgRows.push({ artifact_id: artId, storage_path: img, alt_text_vi: art.name.vi, alt_text_en: art.name.en, display_order: i + 2 });
        }
      });
    }
    await supabase.from('artifact_images').insert(imgRows);

    // Vocabulary
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

  // 3. Reviews
  console.log('3. Seeding reviews...');
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

  for (const c of comments) {
    let artId = null;
    if (c.targetArtifactSlug && c.targetArtifactSlug !== 'all') {
      const { data: artRec } = await supabase.from('artifacts').select('id').eq('slug', c.targetArtifactSlug).single();
      if (artRec) artId = artRec.id;
    }

    const { error: revErr } = await supabase.from('artifact_reviews').insert({
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
    if (revErr) console.warn('  Review notice:', revErr.message);
  }

  // 4. Website contents
  console.log('4. Seeding website contents...');
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

  // 5. Verification
  console.log('\n📊 Verifying counts in live database:');
  const [cRes, aRes, vRes, rRes, wRes] = await Promise.all([
    supabase.from('artifact_categories').select('*', { count: 'exact', head: true }),
    supabase.from('artifacts').select('*', { count: 'exact', head: true }),
    supabase.from('artifact_vocabulary').select('*', { count: 'exact', head: true }),
    supabase.from('artifact_reviews').select('*', { count: 'exact', head: true }),
    supabase.from('website_contents').select('*', { count: 'exact', head: true })
  ]);

  console.log(`  - Categories: ${cRes.count}`);
  console.log(`  - Artifacts: ${aRes.count}`);
  console.log(`  - Vocabulary: ${vRes.count}`);
  console.log(`  - Reviews: ${rRes.count}`);
  console.log(`  - Website Contents: ${wRes.count}`);
  console.log('\n🎉 ALL DATABASE DATA HAS BEEN SUCCESSFULLY SEEDED INTO SUPABASE!');
}

run().catch(console.error);
