import { DB, readDB, writeDB } from "@/app/libs/DB";
import { checkToken } from "@/app/libs/checkToken";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export const GET = async () => {
  readDB();
  const rooms = DB.rooms;
  return NextResponse.json({
    ok: true,
    rooms,
    totalRooms: rooms.length,
  });
};

export const POST = async (request) => {
  const payload = checkToken();
  if (!payload)
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  const body = await request.json();
  const { roomName } = body;
  readDB();
  const already = DB.rooms.find((rn) => rn.roomName === roomName);
  if (already)
    return NextResponse.json(
      {
        ok: false,
        message: `Room ${"replace this with room name"} already exists`,
      },
      { status: 400 }
    );

  const roomId = nanoid();
  DB.rooms.push({ roomId: roomId, roomName: roomName });
  //call writeDB after modifying Database
  writeDB();

  return NextResponse.json({
    ok: true,
    roomId,
    message: `Room ${roomName} has been created`,
  });
};
