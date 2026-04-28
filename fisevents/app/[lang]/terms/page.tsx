const LAST_UPDATED = '2025-05-01';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
        Terms of Service and Data Processing Agreement
      </h1>
      <p className="text-sm text-gray-500 text-center mb-10">
        Last updated: {LAST_UPDATED}
      </p>

      {/* --- TERMS OF SERVICE --- */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Part I — Terms of Service</h2>

        <h3 className="text-base font-semibold text-gray-800 mb-2">1. Service description</h3>
        <p className="text-gray-600 mb-4">
          FisEvents is a platform that allows organizers ("you", "the organizer") to publish events
          and collect registrations from participants. The platform is operated by Christian Zanchetta
          (fisevents@fiscet.it).
        </p>

        <h3 className="text-base font-semibold text-gray-800 mb-2">2. Account and eligibility</h3>
        <p className="text-gray-600 mb-4">
          You must be at least 18 years old and acting in a professional or associative capacity to
          create an account. You are responsible for keeping your credentials confidential and for all
          activity under your account.
        </p>

        <h3 className="text-base font-semibold text-gray-800 mb-2">3. Pricing and payment</h3>
        <p className="text-gray-600 mb-4">
          One event publication per calendar month is free of charge. Additional publications are
          subject to a fee, which is displayed before payment and processed securely via Stripe. All
          prices are exclusive of VAT where applicable.
        </p>

        <h3 className="text-base font-semibold text-gray-800 mb-2">4. Acceptable use</h3>
        <p className="text-gray-600 mb-4">
          You agree not to publish events that are illegal, fraudulent, discriminatory, or violate
          third-party rights. We reserve the right to suspend or remove content that breaches these
          terms without prior notice.
        </p>

        <h3 className="text-base font-semibold text-gray-800 mb-2">5. Intellectual property</h3>
        <p className="text-gray-600 mb-4">
          You retain ownership of any content you upload. By publishing an event you grant FisEvents
          a limited, non-exclusive licence to display that content to the public for the duration the
          event is active.
        </p>

        <h3 className="text-base font-semibold text-gray-800 mb-2">6. Limitation of liability</h3>
        <p className="text-gray-600 mb-4">
          FisEvents provides the platform on an "as is" basis. We are not liable for any loss of
          revenue, data, or goodwill arising from use or unavailability of the service, except where
          required by mandatory law.
        </p>

        <h3 className="text-base font-semibold text-gray-800 mb-2">7. Governing law</h3>
        <p className="text-gray-600 mb-4">
          These terms are governed by Italian law. Any disputes shall be submitted to the competent
          court of Treviso, Italy.
        </p>
      </section>

      {/* --- DPA --- */}
      <section className="mb-10 border-t pt-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Part II — Data Processing Agreement (Art. 28 GDPR)
        </h2>
        <p className="text-gray-600 mb-6">
          This Data Processing Agreement ("DPA") forms part of the Terms of Service and governs the
          processing of personal data in connection with your use of FisEvents, in accordance with
          Regulation (EU) 2016/679 (GDPR).
        </p>

        <h3 className="text-base font-semibold text-gray-800 mb-2">1. Roles</h3>
        <p className="text-gray-600 mb-4">
          You, as the organizer, are the <strong>Data Controller</strong> with respect to the personal
          data of your event participants (name, email, phone). FisEvents acts as the{' '}
          <strong>Data Processor</strong>, processing that data solely on your instructions to provide
          the registration service.
        </p>

        <h3 className="text-base font-semibold text-gray-800 mb-2">2. Nature and purpose of processing</h3>
        <p className="text-gray-600 mb-4">
          FisEvents processes participants' personal data to: store event registrations, send
          confirmation and reminder emails, and enable organisers to manage check-in and attendance.
          No personal data of participants is used for any other purpose.
        </p>

        <h3 className="text-base font-semibold text-gray-800 mb-2">3. Categories of data and data subjects</h3>
        <ul className="list-disc list-inside text-gray-600 mb-4">
          <li>Data subjects: participants who register for your events.</li>
          <li>Categories: full name (required), email address (required), phone number (optional).</li>
          <li>No sensitive data (Art. 9 GDPR) is collected or processed.</li>
        </ul>

        <h3 className="text-base font-semibold text-gray-800 mb-2">4. Your obligations as Data Controller</h3>
        <ul className="list-disc list-inside text-gray-600 mb-4">
          <li>Ensure you have a valid legal basis to collect participants' data (e.g. contract performance).</li>
          <li>Provide participants with a privacy notice before or at the point of registration.</li>
          <li>Respond to data subject requests (access, deletion, etc.) within GDPR deadlines.</li>
          <li>Notify FisEvents promptly if you receive a data subject request that requires our assistance.</li>
        </ul>

        <h3 className="text-base font-semibold text-gray-800 mb-2">5. FisEvents obligations as Data Processor</h3>
        <ul className="list-disc list-inside text-gray-600 mb-4">
          <li>Process personal data only on your documented instructions.</li>
          <li>Ensure persons authorised to process the data are bound by confidentiality.</li>
          <li>Implement appropriate technical and organisational security measures.</li>
          <li>Assist you in fulfilling data subject rights requests.</li>
          <li>Notify you without undue delay (and within 72 hours where feasible) of any personal data breach.</li>
          <li>Delete or return all personal data upon termination of the service, at your choice.</li>
        </ul>

        <h3 className="text-base font-semibold text-gray-800 mb-2">6. Sub-processors</h3>
        <p className="text-gray-600 mb-2">
          FisEvents uses the following sub-processors. By accepting these terms you authorise their
          use:
        </p>
        <ul className="list-disc list-inside text-gray-600 mb-4">
          <li>
            <strong>Sanity.io</strong> (Belgium, EU) — database storage of event and registration data.
          </li>
          <li>
            <strong>Vercel Inc.</strong> (USA) — application hosting. Data transfers are covered by
            Standard Contractual Clauses.
          </li>
          <li>
            <strong>Stripe Inc.</strong> (USA) — payment processing. Data transfers are covered by
            Standard Contractual Clauses.
          </li>
          <li>
            <strong>Aruba S.p.A.</strong> (Italy, EU) — transactional email delivery.
          </li>
        </ul>

        <h3 className="text-base font-semibold text-gray-800 mb-2">7. Data retention</h3>
        <p className="text-gray-600 mb-4">
          Participant data is retained for the duration of your account. You may delete individual
          events or your entire account at any time from the admin dashboard, which permanently removes
          all associated registration data.
        </p>

        <h3 className="text-base font-semibold text-gray-800 mb-2">8. Contact</h3>
        <p className="text-gray-600">
          For any question regarding this DPA, contact:{' '}
          <a href="mailto:fisevents@fiscet.it" className="text-blue-600 underline">
            fisevents@fiscet.it
          </a>
        </p>
      </section>
    </div>
  );
}
