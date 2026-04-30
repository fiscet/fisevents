import { defineField, defineType, defineArrayMember } from 'sanity';
import { BsMegaphone } from 'react-icons/bs';

const localizedString = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'object',
    fields: [
      defineField({ name: 'it', title: 'Italiano', type: 'string' }),
      defineField({ name: 'en', title: 'English', type: 'string' }),
    ],
  });

const localizedText = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'object',
    fields: [
      defineField({ name: 'it', title: 'Italiano', type: 'text', rows: 3 }),
      defineField({ name: 'en', title: 'English', type: 'text', rows: 3 }),
    ],
  });

export default defineType({
  title: 'Landing Page',
  name: 'landingPage',
  type: 'document',
  icon: BsMegaphone,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ── Identity ──────────────────────────────────────────────
    defineField({
      name: 'title',
      title: 'Internal title',
      type: 'string',
      description: 'Only visible in Studio (e.g. "LP – Insegnanti yoga")',
      validation: rule => rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      description: 'Will be published at /it/per/<slug>  and  /en/per/<slug>',
      options: { source: 'title', maxLength: 64 },
      validation: rule => rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'active',
      title: 'Published',
      type: 'boolean',
      initialValue: false,
      group: 'content',
    }),

    // ── Hero ──────────────────────────────────────────────────
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      options: { hotspot: true },
      group: 'content',
    }),
    localizedString('heroHeadline', 'Hero — Headline (H1)'),
    localizedText('heroSubheadline', 'Hero — Subheadline'),
    localizedString('heroCtaLabel', 'Hero — CTA button label'),

    // ── Pain points ───────────────────────────────────────────
    defineField({
      name: 'painPoints',
      title: 'Pain points',
      description: 'Problems your target has — and that FisEvents solves',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'icon', title: 'Icon (emoji)', type: 'string' }),
            localizedString('title', 'Title'),
            localizedText('description', 'Description'),
          ],
          preview: {
            select: { icon: 'icon', title: 'title.it' },
            prepare: ({ icon, title }) => ({ title: `${icon ?? ''} ${title ?? ''}` }),
          },
        }),
      ],
    }),

    // ── Features ──────────────────────────────────────────────
    defineField({
      name: 'features',
      title: 'Features',
      description: 'FisEvents features most relevant for this target',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'icon', title: 'Icon (emoji)', type: 'string' }),
            localizedString('title', 'Title'),
            localizedText('description', 'Description'),
          ],
          preview: {
            select: { icon: 'icon', title: 'title.it' },
            prepare: ({ icon, title }) => ({ title: `${icon ?? ''} ${title ?? ''}` }),
          },
        }),
      ],
    }),

    // ── Body (Portable Text) ───────────────────────────────────
    defineField({
      name: 'bodyIt',
      title: 'Body content — Italiano',
      type: 'blockContent',
      group: 'content',
    }),
    defineField({
      name: 'bodyEn',
      title: 'Body content — English',
      type: 'blockContent',
      group: 'content',
    }),

    // ── SEO ───────────────────────────────────────────────────
    defineField({
      name: 'seoTitleIt',
      title: 'Meta title — Italiano',
      type: 'string',
      validation: rule => rule.max(60),
      group: 'seo',
    }),
    defineField({
      name: 'seoDescriptionIt',
      title: 'Meta description — Italiano',
      type: 'text',
      rows: 2,
      validation: rule => rule.max(160),
      group: 'seo',
    }),
    defineField({
      name: 'seoTitleEn',
      title: 'Meta title — English',
      type: 'string',
      validation: rule => rule.max(60),
      group: 'seo',
    }),
    defineField({
      name: 'seoDescriptionEn',
      title: 'Meta description — English',
      type: 'text',
      rows: 2,
      validation: rule => rule.max(160),
      group: 'seo',
    }),
  ],

  preview: {
    select: { title: 'title', slug: 'slug.current', active: 'active' },
    prepare: ({ title, slug, active }) => ({
      title,
      subtitle: `${active ? '✅' : '⬜'} /per/${slug ?? '…'}`,
    }),
  },
});
