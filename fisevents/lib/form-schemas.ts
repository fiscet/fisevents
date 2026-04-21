import { z } from 'zod';

export const eventAttendantSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  privacyAccepted: z.boolean(),
  checkedIn: z.boolean().optional(),
  paymentStatus: z.string().optional(),
});

export const ContactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters'),
});

export const BugReportSchema = z.object({
  type: z.enum(['bug', 'suggestion'], {
    required_error: 'Please select a type',
  }),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters long')
    .max(500, 'Description must be less than 500 characters'),
  email: z.string().email('Invalid email address'),
});

export const singleEventSchema = z.object({
  _id: z.string(),
  title: z.string(),
  slug: z.object({
    current: z.string(),
    _type: z.literal('slug'),
  }),
  publicSlug: z.string(),
  description: z.string(),
  location: z.string().optional(),
  talkTo: z.string().optional(),
  maxSubscribers: z.number().optional(),
  basicPrice: z.string().optional(),
  currency: z.string().max(3).toUpperCase().optional(),
  publicationStartDate: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  active: z.boolean(),
});

export const userAccountSchema = z.object({
  name: z.string(),
  email: z.string(),
  companyName: z.string(),
  slug: z.object({
    current: z.string(),
    _type: z.literal('slug'),
  }),
  www: z.string().optional(),
  logoUrl: z.string().optional(),
});
