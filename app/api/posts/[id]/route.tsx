import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Authentication is handled at the component level
    
    const postId = params.id;
    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    console.log(`API - Deleting post: ${postId}`);
    
    // First check if the post exists
    const { data: existingPost, error: checkError } = await supabase
      .from("posts")
      .select("id")
      .eq("id", postId)
      .single();

    if (checkError || !existingPost) {
      console.error(`API - Post not found: ${postId}`, checkError);
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // Delete the post
    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId);

    if (error) {
      console.error(`API - Error deleting post: ${postId}`, error);
      return NextResponse.json(
        { error: `Failed to delete post: ${error.message}` },
        { status: 500 }
      );
    }

    console.log(`API - Successfully deleted post: ${postId}`);
    return NextResponse.json(
      { message: "Post deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("API - Unexpected error in delete post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 