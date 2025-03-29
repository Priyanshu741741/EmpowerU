require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or key not found in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdminUser() {
  try {
    const adminId = uuidv4();
    const adminEmail = 'admin@example.com';  // Change this to your preferred email
    
    // Check if admin already exists
    const { data: existingUser, error: lookupError } = await supabase
      .from('users')
      .select('id')
      .eq('email', adminEmail)
      .maybeSingle();
    
    if (lookupError) {
      console.error('Error checking for existing admin:', lookupError);
      return;
    }
    
    if (existingUser) {
      console.log(`Admin user with email ${adminEmail} already exists`);
      
      // Update the existing user to make sure they're an admin
      const { error: updateError } = await supabase
        .from('users')
        .update({ role: 'admin' })
        .eq('email', adminEmail);
      
      if (updateError) {
        console.error('Error updating user to admin role:', updateError);
        return;
      }
      
      console.log(`Updated ${adminEmail} to admin role`);
      return;
    }
    
    // Create new admin user
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        id: adminId,
        email: adminEmail,
        full_name: 'Admin User',
        role: 'admin'
      });
    
    if (insertError) {
      console.error('Error creating admin user:', insertError);
      return;
    }
    
    console.log('Admin user created successfully!');
    console.log('Email:', adminEmail);
    console.log('ID:', adminId);
    console.log('\nYou can now login to the dashboard at /dashboard');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createAdminUser(); 