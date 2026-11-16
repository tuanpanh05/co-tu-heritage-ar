/**
 * CO-TU HERITAGE AR - AUTOMATED VERIFICATION TEST SUITE
 * Validates database schemas, RLS policies, seed data integrity,
 * storage configurations, and frontend service layer contracts.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASS: ${message}`);
  } else {
    failedTests++;
    console.error(`  ❌ FAIL: ${message}`);
  }
}

console.log('===============================================================');
console.log(' CO-TU HERITAGE AR: COMPREHENSIVE VERIFICATION SUITE');
console.log('===============================================================\n');

// 1. Verify SQL Migrations Exist and Contain Required Declarations
console.log('📁 SUITE 1: SQL Schema & Migration Verification');
const migrationsDir = path.join(rootDir, 'supabase/migrations');
assert(fs.existsSync(migrationsDir), 'supabase/migrations directory exists');

const schemaSql = fs.readFileSync(path.join(migrationsDir, '20261116000001_create_schema.sql'), 'utf8');
assert(schemaSql.includes('CREATE TABLE IF NOT EXISTS public.artifact_categories'), 'Table artifact_categories declared');
assert(schemaSql.includes('CREATE TABLE IF NOT EXISTS public.artifacts'), 'Table artifacts declared');
assert(schemaSql.includes('CREATE TABLE IF NOT EXISTS public.artifact_images'), 'Table artifact_images declared');
assert(schemaSql.includes('CREATE TABLE IF NOT EXISTS public.artifact_vocabulary'), 'Table artifact_vocabulary declared');
assert(schemaSql.includes('CREATE TABLE IF NOT EXISTS public.artifact_reviews'), 'Table artifact_reviews declared');
assert(schemaSql.includes('CREATE TABLE IF NOT EXISTS public.website_contents'), 'Table website_contents declared');
assert(schemaSql.includes('CREATE TABLE IF NOT EXISTS public.admin_profiles'), 'Table admin_profiles declared');
assert(schemaSql.includes('CHECK (rating BETWEEN 1 AND 5)'), 'Rating constraint 1-5 enforced on artifact_reviews');
assert(schemaSql.includes('CHECK (status IN (\'pending\', \'approved\', \'rejected\'))'), 'Status check constraint enforced');

const rlsSql = fs.readFileSync(path.join(migrationsDir, '20261116000002_security_rls_policies.sql'), 'utf8');
assert(rlsSql.includes('CREATE OR REPLACE FUNCTION public.is_admin()'), 'public.is_admin() helper declared');
assert(rlsSql.includes('SECURITY DEFINER'), 'is_admin() declared with SECURITY DEFINER to avoid recursion');
assert(rlsSql.includes('ALTER TABLE public.artifacts ENABLE ROW LEVEL SECURITY'), 'RLS enabled on artifacts');
assert(rlsSql.includes('ALTER TABLE public.artifact_reviews ENABLE ROW LEVEL SECURITY'), 'RLS enabled on artifact_reviews');
assert(rlsSql.includes('status = \'pending\''), 'Public review inserts restricted to pending status');
assert(rlsSql.includes('CREATE TRIGGER trg_enforce_review_pending_status'), 'Trigger enforces pending status on inserts');

const storageSql = fs.readFileSync(path.join(migrationsDir, '20261116000003_storage_buckets.sql'), 'utf8');
assert(storageSql.includes('artifact-images'), 'Bucket artifact-images configured');
assert(storageSql.includes('artifact-models'), 'Bucket artifact-models configured');
assert(storageSql.includes('website-assets'), 'Bucket website-assets configured');
assert(storageSql.includes('104857600'), '100MB limit configured for 3D GLB models');

const seedSql = fs.readFileSync(path.join(migrationsDir, '20261116000004_seed_data.sql'), 'utf8');
assert(seedSql.includes('guol-communal-house'), 'Seed contains guol-communal-house');
assert(seedSql.includes('ktu-traditional-drum'), 'Seed contains ktu-traditional-drum');
assert(seedSql.includes('bahieng-carrying-basket'), 'Seed contains bahieng-carrying-basket');
assert(seedSql.includes('chieng-gong-instrument'), 'Seed contains chieng-gong-instrument');
assert(seedSql.includes('ao-nam-cotu'), 'Seed contains ao-nam-cotu');
assert(seedSql.includes('ao-nu-cotu'), 'Seed contains ao-nu-cotu');
assert(seedSql.includes('tuong-te-te-cotu'), 'Seed contains tuong-te-te-cotu');
assert(seedSql.includes('Lê Tuấn Hùng'), 'Seed contains community reviewer Lê Tuấn Hùng');
assert(seedSql.includes('home_hero'), 'Seed contains website content home_hero');

// 2. Verify Storage Assets On Disk
console.log('\n📦 SUITE 2: Media Asset Integrity on Disk');
const modelsDir = path.join(rootDir, 'public/models');
const expectedModels = [
  'guol.glb',
  'ktu-drum.glb',
  'bahieng-basket.glb',
  'chieng.glb',
  'ao-nam.glb',
  'ao-nu.glb',
  'te-te.glb'
];
expectedModels.forEach((m) => {
  const modelPath = path.join(modelsDir, m);
  const exists = fs.existsSync(modelPath);
  const sizeMb = exists ? (fs.statSync(modelPath).size / (1024 * 1024)).toFixed(2) : 0;
  assert(exists && sizeMb > 1, `GLB Model ${m} exists and is valid (${sizeMb} MB)`);
});

// 3. Verify TypeScript Service Architecture
console.log('\n💻 SUITE 3: Frontend Service Layer Contracts');
const servicesDir = path.join(rootDir, 'src/services');
assert(fs.existsSync(path.join(servicesDir, 'artifactService.ts')), 'artifactService.ts exists');
assert(fs.existsSync(path.join(servicesDir, 'categoryService.ts')), 'categoryService.ts exists');
assert(fs.existsSync(path.join(servicesDir, 'reviewService.ts')), 'reviewService.ts exists');
assert(fs.existsSync(path.join(servicesDir, 'vocabularyService.ts')), 'vocabularyService.ts exists');
assert(fs.existsSync(path.join(servicesDir, 'contentService.ts')), 'contentService.ts exists');
assert(fs.existsSync(path.join(servicesDir, 'storageService.ts')), 'storageService.ts exists');
assert(fs.existsSync(path.join(rootDir, 'src/lib/supabase.ts')), 'src/lib/supabase.ts client exists');

// 4. Verify Documentation Artifacts
console.log('\n📚 SUITE 4: Documentation Completeness');
const docsDir = path.join(rootDir, 'docs');
const requiredDocs = [
  'PROJECT_DATA_AUDIT.md',
  'DATABASE_SCHEMA.md',
  'DATABASE_MIGRATION_PLAN.md',
  'DATA_MIGRATION_REPORT.md',
  'SUPABASE_SETUP.md',
  'STORAGE_SETUP.md',
  'SECURITY_POLICIES.md',
  'VERCEL_DEPLOYMENT.md'
];
requiredDocs.forEach((doc) => {
  assert(fs.existsSync(path.join(docsDir, doc)), `Documentation file docs/${doc} exists`);
});

console.log('\n===============================================================');
console.log(` TEST SUMMARY: ${passedTests}/${totalTests} PASSED (${failedTests} FAILED)`);
console.log('===============================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL INTEGRITY TESTS PASSED SUCCESSFULLY!\n');
}
