import { config } from 'dotenv';
config({ path: '.env.local' });

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../lib/generated/prisma/client';
import { createHash } from 'crypto';

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const keyHash = createHash('sha256').update('glow-2026-preview-key').digest('hex');
  const deleted = await prisma.accessKey.deleteMany({ where: { keyHash } });
  console.log(`삭제됨: ${deleted.count}건`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
