import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const { slug, name, buyer, prodUrl } = await req.json().catch(() => ({}));

  if (!slug?.trim() || !name?.trim() || !buyer?.trim() || !prodUrl?.trim()) {
    return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
  }

  const existing = await prisma.project.findUnique({ where: { slug: slug.trim() } });
  if (existing) {
    return NextResponse.json({ error: 'slug_taken' }, { status: 409 });
  }

  const project = await prisma.project.create({
    data: {
      slug: slug.trim(),
      name: name.trim(),
      buyer: buyer.trim(),
      prodUrl: prodUrl.trim(),
      previewVersion: '',
      previewUrl: '',
      lastDeployCommit: '',
      lastDeployTime: '',
    },
  });

  return NextResponse.json(project);
}
