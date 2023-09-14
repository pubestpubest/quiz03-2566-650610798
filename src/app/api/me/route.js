import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    ok: true,
    fullName: "Pubest Ruengkum",
    studentId: "650610798",
  });
};
