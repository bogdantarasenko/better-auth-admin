import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { organization } from 'better-auth/plugins';
import { stripe } from '@better-auth/stripe';
import Stripe from 'stripe';
import { db } from './db';

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite'
  }),
  emailAndPassword: {
    enabled: true
  },
  plugins: [
    nextCookies(),
    organization({
      allowUserToCreateOrganization: true,
      creatorRole: 'owner'
    }),
    stripe({
      stripeClient,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
      createCustomerOnSignUp: true,
      subscription: {
        enabled: true,
        plans: [
          {
            name: 'free',
            priceId: process.env.STRIPE_FREE_PRICE_ID || 'price_free',
            limits: {
              projects: 3,
              members: 5
            }
          },
          {
            name: 'pro',
            priceId: process.env.STRIPE_PRO_PRICE_ID || 'price_pro',
            annualDiscountPriceId:
              process.env.STRIPE_PRO_ANNUAL_PRICE_ID || 'price_pro_annual',
            limits: {
              projects: 100,
              members: 50
            }
          }
        ]
      }
    })
  ]
});
