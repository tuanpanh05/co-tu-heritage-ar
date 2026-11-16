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
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceRoleKey) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function provisionAccounts() {
  console.log('🚀 Provisioning CMS Admin & Student Editor accounts...');

  const accounts = [
    {
      email: 'admin@cotuheritage.vn',
      password: 'Admin@123456',
      displayName: 'Trưởng Ban Quản Trị Di Sản',
      role: 'super_admin'
    },
    {
      email: 'hocsinh@cotuheritage.vn',
      password: 'Student@123456',
      displayName: 'Học Sinh Biên Tập Viên',
      role: 'admin'
    }
  ];

  for (const acc of accounts) {
    console.log(`\nProcessing: ${acc.email} (${acc.role})...`);
    
    // Check if user already exists
    const { data: userList } = await supabase.auth.admin.listUsers();
    let existingUser = userList?.users?.find(u => u.email === acc.email);

    let userId = existingUser?.id;

    if (!existingUser) {
      console.log(`  Creating Auth user for ${acc.email}...`);
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: acc.email,
        password: acc.password,
        email_confirm: true,
        user_metadata: {
          display_name: acc.displayName
        }
      });

      if (createError) {
        console.error(`  ❌ Error creating user: ${createError.message}`);
        continue;
      }
      userId = newUser.user.id;
      console.log(`  ✅ Auth user created with ID: ${userId}`);
    } else {
      console.log(`  ℹ️ Auth user exists with ID: ${userId}. Updating password...`);
      await supabase.auth.admin.updateUserById(userId, {
        password: acc.password,
        email_confirm: true
      });
    }

    // Now upsert into public.admin_profiles
    const { data: profile, error: profileError } = await supabase
      .from('admin_profiles')
      .upsert({
        id: userId,
        display_name: acc.displayName,
        role: acc.role
      }, { onConflict: 'id' })
      .select();

    if (profileError) {
      console.error(`  ❌ Error updating admin_profile: ${profileError.message}`);
    } else {
      console.log(`  ✅ Profile synced in admin_profiles:`, profile);
    }
  }

  console.log('\n🎉 Finished provisioning accounts successfully!');
}

provisionAccounts().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
