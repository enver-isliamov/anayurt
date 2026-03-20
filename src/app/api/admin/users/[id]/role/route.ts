import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Only SUPERADMIN can assign ADMIN role
    const { role } = await req.json()
    
    if ((role === 'ADMIN' || role === 'SUPERADMIN') && session.user.role !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Only superadmin can assign admin roles' }, { status: 403 })
    }

    const user = await prisma.user.update({
      where: { id: params.id },
      data: { role }
    })

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update role' }, { status: 500 })
  }
}
