const { createClient } = require('@supabase/supabase-js');

const url = 'https://ejgdtcmqtekvvgrvargx.supabase.co';
const anonKey = 'sb_publishable_wcZNY1O9bvUhb2LS-63nWQ_ON67m8VV';

const supabase = createClient(url, anonKey);

let passed = 0;
let failed = 0;

function assert(cond, msg) {
  if (cond) {
    passed++;
    console.log(`  ✅ PASS: ${msg}`);
  } else {
    failed++;
    console.error(`  ❌ FAIL: ${msg}`);
  }
}

async function runTests() {
  console.log('===============================================================');
  console.log(' CO-TU HERITAGE CMS: AUTOMATED END-TO-END VERIFICATION');
  console.log('===============================================================\n');

  // Test 1: Super Admin Login
  console.log('🔐 TEST SUITE 1: Super Admin Authentication & Profile Query');
  const { data: superAuth, error: superAuthErr } = await supabase.auth.signInWithPassword({
    email: 'admin@cotuheritage.vn',
    password: 'Admin@123456'
  });
  assert(!superAuthErr && superAuth.user?.id, 'Super Admin login successful');

  const { data: superProf, error: superProfErr } = await supabase
    .from('admin_profiles')
    .select('*')
    .eq('id', superAuth.user.id)
    .single();
  assert(superProf?.role === 'super_admin', 'Super Admin profile has role super_admin');

  // Test 2: Student Editor Login
  console.log('\n🎓 TEST SUITE 2: Student Editor Authentication & Profile Query');
  const { data: studentAuth, error: studentAuthErr } = await supabase.auth.signInWithPassword({
    email: 'hocsinh@cotuheritage.vn',
    password: 'Student@123456'
  });
  assert(!studentAuthErr && studentAuth.user?.id, 'Student Editor login successful');

  const { data: studentProf, error: studentProfErr } = await supabase
    .from('admin_profiles')
    .select('*')
    .eq('id', studentAuth.user.id)
    .single();
  assert(studentProf?.role === 'admin', 'Student profile has role admin (editor)');

  // Test 3: Log back in as Super Admin for CRUD verification
  await supabase.auth.signInWithPassword({
    email: 'admin@cotuheritage.vn',
    password: 'Admin@123456'
  });

  // Test 4: Artifacts & Categories Query
  console.log('\n📦 TEST SUITE 3: Artifacts, Categories & Relations Query');
  const { data: arts, error: artsErr } = await supabase
    .from('artifacts')
    .select(`
      id, slug, name_vi, is_published, model_3d_path,
      artifact_categories (name_vi),
      artifact_images (id),
      artifact_vocabulary (id)
    `);
  assert(!artsErr && arts.length >= 7, `Fetched ${arts?.length} artifacts with relations`);

  const { data: cats, error: catsErr } = await supabase
    .from('artifact_categories')
    .select('id, name_vi, slug');
  assert(!catsErr && cats.length >= 5, `Fetched ${cats?.length} heritage categories`);

  // Test 5: Review Moderation Test
  console.log('\n💬 TEST SUITE 4: Community Review Moderation');
  const { data: reviews, error: revErr } = await supabase
    .from('artifact_reviews')
    .select('id, reviewer_name, status')
    .limit(1);
  assert(!revErr && reviews.length > 0, `Fetched review for moderation test (id: ${reviews?.[0]?.id})`);

  if (reviews && reviews[0]) {
    const revId = reviews[0].id;
    const initialStatus = reviews[0].status;
    const nextStatus = initialStatus === 'approved' ? 'pending' : 'approved';

    const { error: modErr } = await supabase
      .from('artifact_reviews')
      .update({ status: nextStatus })
      .eq('id', revId);
    assert(!modErr, `Super Admin successfully updated review status to ${nextStatus}`);

    // Revert back
    await supabase.from('artifact_reviews').update({ status: initialStatus }).eq('id', revId);
    console.log(`  ℹ️ Reverted review status back to original (${initialStatus})`);
  }

  // Test 6: Website Contents
  console.log('\n🌐 TEST SUITE 5: Website Contents Verification');
  const { data: contents, error: contErr } = await supabase
    .from('website_contents')
    .select('content_key, title_vi');
  assert(!contErr && contents.length >= 5, `Website contents active with ${contents?.length} editable sections`);

  // Test 7: Storage Buckets Read Access
  console.log('\n🗄️ TEST SUITE 6: Storage Buckets Access');
  const { data: imgFiles, error: imgErr } = await supabase.storage.from('artifact-images').list();
  assert(!imgErr, 'artifact-images storage accessible');

  const { data: modelFiles, error: modelErr } = await supabase.storage.from('artifact-models').list();
  assert(!modelErr && modelFiles.length > 0, 'artifact-models storage accessible with GLB models');

  console.log('\n===============================================================');
  console.log(` TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('===============================================================');

  if (failed === 0) {
    console.log('🎉 ALL CMS BACKEND & RLS TESTS COMPLETED SUCCESSFULLY!');
  } else {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
