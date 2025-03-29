const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

exports.handler = async (event, context) => {
  try {
    // Get method from path
    const path = event.path.replace('/.netlify/functions/supabase-api/', '');
    
    // Handle different API routes
    if (path === 'posts') {
      // Example: Get published posts
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return {
        statusCode: 200,
        body: JSON.stringify({ data })
      };
    }
    
    // Default response
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Not found' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}; 