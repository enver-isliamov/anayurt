import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const [users, meetings, emergency, villages, events] = await Promise.all([
      prisma.user.count(),
      prisma.meeting.count(),
      prisma.emergencyHelp.count(),
      prisma.village.count(),
      prisma.calendarEvent.count(),
    ])

    return NextResponse.json({ users, meetings, emergency, villages, events })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
