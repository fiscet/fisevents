import { Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/i18n.utils';
import { getAlternates } from '@/lib/seo';
import { Metadata } from 'next';
import { SectionHeader } from '@/components/SectionHeader/SectionHeader';
import ContactForm from './_components/ContactForm';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const d = (await getDictionary(lang)).website.contacts;
  return {
    title: d.meta.title,
    description: d.meta.description,
    alternates: getAlternates('/contacts', lang),
  };
}

export default async function ContactsPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const d = (await getDictionary(lang)).website.contacts;

  return (
    <section className="relative pt-32 pb-24 md:pt-48 overflow-hidden">
      <div
        className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-fe-secondary-container/10 rounded-full blur-[120px] pointer-events-none"
        aria-hidden="true"
      />
      <div className="relative max-w-2xl mx-auto px-6 md:px-8">
        <SectionHeader
          heading={d.title}
          description={d.subtitle}
          align="center"
        />

        <div className="bg-fe-surface-container-lowest rounded-3xl p-8 border border-fe-outline-variant/15 shadow-editorial">
          <ContactForm labels={d.form} />
        </div>

        <div className="mt-6 bg-fe-surface-container-lowest rounded-3xl p-6 border border-fe-outline-variant/15 flex gap-4 items-start">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-fe-secondary-fixed flex items-center justify-center text-lg">
            🐛
          </div>
          <div>
            <h3 className="font-headline font-semibold text-fe-on-surface mb-1">
              {d.bug_label}
            </h3>
            <p className="text-fe-on-surface-variant text-sm leading-relaxed">
              {d.bug_description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
