import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const PUBLISH_PRICE_CENTS = 470; // €4.70
