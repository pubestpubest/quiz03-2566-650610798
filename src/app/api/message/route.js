import { DB, readDB, writeDB } from "@/app/libs/DB";
import { checkToken } from "@/app/libs/checkToken";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { boolean } from "zod";

export const GET = async (request) => {
  readDB();
  const roomId = request.nextUrl.searchParams.get("roomId");
  const roomFound = DB.rooms.find((db) => db.roomId === roomId);
  const room = DB.messages.filter((db) => db.roomId === roomId);
  if (!roomFound)
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );
  return NextResponse.json({ ok: true, room }, { status: 200 });
};

export const POST = async (request) => {
  readDB();
  const body = await request.json();
  const { roomId, messageText } = body;
  const roomFound = DB.rooms.find((db) => db.roomId === roomId);
  if (!roomFound)
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );

  const messageId = nanoid();
  DB.messages.push({
    roomId: roomId,
    messageId: messageId,
    messageText: messageText,
  });
  writeDB();

  return NextResponse.json({
    ok: true,
    messageId,
    message: "Message has been sent",
  });
};

export const DELETE = async (request) => {
  const payload = checkToken();
  if (!payload || payload.role !== "SUPER_ADMIN")
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );

  readDB();
  const body = await request.json();
  const { messageId } = body;
  const messageIdFound = DB.messages.find((db) => db.messageId === messageId);
  if (!messageIdFound)
    return NextResponse.json(
      {
        ok: false,
        message: "Message is not found",
      },
      { status: 404 }
    );
  DB.messages = DB.messages.filter((db) => db.messageId !== messageId);
  writeDB();

  return NextResponse.json({
    ok: true,
    message: "Message has been deleted",
  });
};
