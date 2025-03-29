import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { supabase } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const title = formData.get("title") as string
    const content = formData.get("content") as string
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const bio = formData.get("bio") as string || null
    const imageFile = formData.get("image") as File

    // Validate required fields
    if (!title || !content || !name || !email || !imageFile) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Generate UUIDs and set user data
    let userId = uuidv4();
    const postId = uuidv4();
    
    // Handle image upload first since that's more likely to succeed
    let imageUrl = null;
    
    try {
      const fileExt = imageFile.name.split(".").pop()
      const fileName = `${uuidv4()}.${fileExt}`
      const filePath = `story-images/${fileName}`
      
      // Convert file to arrayBuffer for upload
      const arrayBuffer = await imageFile.arrayBuffer()
      const buffer = new Uint8Array(arrayBuffer)
      
      const { error: uploadError } = await supabase.storage
        .from("story-images")
        .upload(filePath, buffer, {
          contentType: imageFile.type,
          cacheControl: "3600",
          upsert: false
        })
      
      if (uploadError) {
        console.error("Error uploading image:", uploadError)
        
        // For testing purposes, provide a placeholder image URL if upload fails
        imageUrl = "https://picsum.photos/id/237/600/400";
      } else {
        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from("story-images")
          .getPublicUrl(filePath)
        
        imageUrl = publicUrlData.publicUrl;
      }
    } catch (error) {
      console.error("Image upload error:", error)
      // For testing purposes, use a placeholder image
      imageUrl = "https://picsum.photos/id/237/600/400";
    }
    
    try {
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-");
      
      // First check if user exists in a try/catch block
      try {
        const { data: existingUser, error: userLookupError } = await supabase
          .from("users")
          .select("id")
          .eq("email", email)
          .maybeSingle()

        console.log("User lookup result:", existingUser, userLookupError);

        // Create a new default user if lookup fails
        if (userLookupError || !existingUser) {
          console.log("Creating new user");
          
          // Create a new user with the provided details
          const { data: newUser, error: createUserError } = await supabase
            .from("users")
            .insert({
              id: userId,
              full_name: name,
              email: email,
              bio: bio,
              role: "writer"
            })
            .select('id')
            .single();
              
          if (createUserError) {
            console.error("Error creating user:", createUserError);
            
            // If duplicate key error, try to fetch the existing user
            if (createUserError.code === '23505') {
              console.log("User with this email already exists, trying to get ID");
              const { data: duplicateUser, error: fetchError } = await supabase
                .from("users")
                .select("id")
                .eq("email", email)
                .maybeSingle();
                
              if (fetchError || !duplicateUser) {
                console.error("Failed to fetch existing user:", fetchError);
                // Fall back to default admin ID
                userId = "00000000-0000-0000-0000-000000000000";
              } else {
                userId = duplicateUser.id;
                console.log("Using existing user ID:", userId);
              }
            } else {
              // For other errors, fall back to default admin ID
              userId = "00000000-0000-0000-0000-000000000000";
            }
          } else if (newUser) {
            userId = newUser.id;
            console.log("Created new user with ID:", userId);
          }
        } else {
          // Use existing user ID
          userId = existingUser.id;
          console.log("Using existing user ID:", userId);
        }
      } catch (userError) {
        console.error("User operation error:", userError);
        // Fall back to default admin ID
        userId = "00000000-0000-0000-0000-000000000000";
      }
      
      console.log("Creating post with user ID:", userId);
      const { data: savedPost, error: postError } = await supabase
        .from("posts")
        .insert({
          id: postId,
          title,
          content,
          author_id: userId,
          status: "pending",
          cover_image: imageUrl,
          excerpt: content.substring(0, 150) + (content.length > 150 ? "..." : ""),
          slug: slug
        })
        .select()
        .single();
      
      if (postError) {
        console.error("Error creating post:", postError);
        return NextResponse.json({ 
          success: false,
          message: "Failed to save your story. Please try again.",
          error: postError.message
        }, { status: 500 });
      }
      
      console.log("Successfully saved post:", savedPost);
      return NextResponse.json({ 
        success: true,
        message: "Your story has been submitted for review!"
      });
    } catch (error) {
      console.error("Post creation error:", error);
      
      return NextResponse.json({ 
        success: false,
        message: "An error occurred while submitting your story.",
        error: error instanceof Error ? error.message : String(error)
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    
    return NextResponse.json({ 
      success: false,
      message: "An error occurred while processing your request.",
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 