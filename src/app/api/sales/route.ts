import connect from "@/config/dbConfig";
import Stock from "@/models/stockModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export const GET = async () => {
  try {
    
    return 0;  
  } catch (error:any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
