import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dns from 'dns';

// Force Node.js to resolve IPv4 addresses first.
// This works around Render's lack of outbound IPv6 support
// when connecting to Supabase which has both IPv4 and IPv6.
dns.setDefaultResultOrder('ipv4first');

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
