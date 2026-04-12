import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { admin, organization } from 'better-auth/plugins';
import { db } from './db';
import * as schema from './auth-schema';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema
  }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: true
  },
  plugins: [
    nextCookies(),
    admin(),
    organization({
      allowUserToCreateOrganization: true,
      creatorRole: 'owner'
    })
  ]
});
