import connect from "@/config/dbConfig";
import Stock from "@/models/stockModel";
import { NextRequest, NextResponse } from "next/server";
import { cors, handleCors } from "@/lib/cors";

connect();

export const GET = async (req: NextRequest) => {
  // Handle CORS preflight
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const response = NextResponse.json({ data: 0 }, { status: 200 });
    
    // Add CORS headers
    Object.entries(cors(req)).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    return response;
  } catch (error:any) {
    const response = NextResponse.json({ error: error.message }, { status: 500 });
    
    // Add CORS headers
    Object.entries(cors(req)).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    return response;
  }
};
