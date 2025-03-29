import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    // Create the stored procedure for deleting posts if it doesn't exist
    const createProcedureSQL = `
    CREATE OR REPLACE FUNCTION delete_post_by_id(post_id TEXT)
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      DELETE FROM posts WHERE id = post_id;
    END;
    $$;
    `;

    const { error } = await supabase.rpc('create_stored_procedures', {
      sql_to_execute: createProcedureSQL
    });

    if (error) {
      console.error("Error creating stored procedures:", error);
      
      // Try direct SQL execution as fallback
      const { error: directError } = await supabase.rpc('exec_sql', {
        sql_string: createProcedureSQL
      });
      
      if (directError) {
        return NextResponse.json(
          { error: "Failed to create stored procedures: " + directError.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { message: "Stored procedures created successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in create stored procedures API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 