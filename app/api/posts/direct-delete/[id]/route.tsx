import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;
    
    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }
    
    console.log(`Direct delete API - Deleting post: ${postId}`);
    
    // Try multiple approaches to delete the post
    
    // Method 1: Standard delete
    const { error: standardError } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);
      
    if (!standardError) {
      return NextResponse.json(
        { success: true, message: "Post deleted successfully via standard method" },
        { status: 200 }
      );
    }
    
    console.log("Standard delete failed:", standardError);
    
    // Method 2: Try using match condition
    const { error: matchError } = await supabase
      .from('posts')
      .delete()
      .match({ id: postId });
      
    if (!matchError) {
      return NextResponse.json(
        { success: true, message: "Post deleted successfully via match condition" },
        { status: 200 }
      );
    }
    
    console.log("Match condition delete failed:", matchError);
    
    // Method 3: Try the filter method
    const { error: filterError } = await supabase
      .from('posts')
      .delete()
      .filter('id', 'eq', postId);
      
    if (!filterError) {
      return NextResponse.json(
        { success: true, message: "Post deleted successfully via filter method" },
        { status: 200 }
      );
    }
    
    console.log("Filter delete failed:", filterError);
    
    // Method 4: Try a raw select then delete approach
    const { data: post, error: selectError } = await supabase
      .from('posts')
      .select('id')
      .eq('id', postId)
      .maybeSingle();
      
    if (selectError) {
      console.log("Select query failed:", selectError);
      return NextResponse.json(
        { error: `Failed to find post: ${selectError.message}` },
        { status: 500 }
      );
    }
    
    if (!post) {
      console.log("Post not found in database");
      return NextResponse.json(
        { error: "Post not found in database" },
        { status: 404 }
      );
    }
    
    // Final attempt - delete by ID directly
    const { error: finalError } = await supabase
      .from('posts')
      .delete()
      .eq('id', post.id);
      
    if (finalError) {
      console.log("Final delete attempt failed:", finalError);
      return NextResponse.json(
        { error: `All deletion methods failed: ${finalError.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { success: true, message: "Post deleted successfully via final method" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error in direct delete API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 