const PrivacyAndCookiePolicyEN = ({ lastUpdated }: { lastUpdated: string }) => {
  return (
    <div className="max-w-5xl mx-auto bg-white shadow-md rounded-md p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Privacy and Cookie Policy
      </h1>

      <p className="text-sm text-gray-500 text-center mb-6">
        Last updated: {lastUpdated}
      </p>

      {/* Privacy Policy Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Privacy Policy
        </h2>

        <p className="text-gray-600 mb-4">
          This Privacy Policy explains how FisEvents, owned by Christian
          Zanchetta, processes user data in compliance with the General Data
          Protection Regulation (GDPR).
        </p>

        <h3 className="text-lg font-medium text-gray-800 mb-2">
          1. Data Controller
        </h3>
        <p className="text-gray-600 mb-4">
          The Data Controller is Christian Zanchetta. You can contact us at{' '}
          <a
            href="mailto:fisevents@fiscet.it"
            className="text-blue-600 underline"
          >
            fisevents@fiscet.it
          </a>
          .
        </p>

        <h3 className="text-lg font-medium text-gray-800 mb-2">
          2. Data Collected
        </h3>
        <ul className="list-disc list-inside text-gray-600 mb-4">
          <li>
            <strong>For tenants (admins):</strong> Name (optional), email,
            profile image (optional), company name, company logo (optional), and
            company website (optional).
          </li>
          <li>
            <strong>For users registered with tenants:</strong> Name, email, and
            optional phone number.
          </li>
        </ul>

        <p className="text-gray-600 mb-4">
          FisEvents does not collect sensitive data (e.g., health or religious
          beliefs).
        </p>

        <h3 className="text-lg font-medium text-gray-800 mb-2">
          3. Purpose and Legal Basis
        </h3>
        <p className="text-gray-600 mb-4">
          Data is processed to provide and manage the FisEvents service,
          authenticate users, and improve the platform using analytics tools.
        </p>

        <p className="text-gray-600 mb-4">
          <strong>Legal Basis:</strong>
          <ul className="list-disc list-inside mt-2">
            <li>Performance of a contract (Art. 6.1.b GDPR)</li>
            <li>
              Legitimate interest (Art. 6.1.f GDPR) for service improvement
            </li>
          </ul>
        </p>

        <h3 className="text-lg font-medium text-gray-800 mb-2">
          4. Data Sharing
        </h3>
        <p className="text-gray-600 mb-4">
          Data is securely stored on Sanity.io servers in Belgium (EU) in
          compliance with GDPR. Data is not transferred outside the EU.
        </p>

        <h3 className="text-lg font-medium text-gray-800 mb-2">
          5. Data Retention
        </h3>
        <p className="text-gray-600 mb-4">
          Data is retained until the user withdraws consent or the service
          terminates.
        </p>
      </section>

      {/* Cookie Policy Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Cookie Policy
        </h2>

        <p className="text-gray-600 mb-4">
          This Cookie Policy explains what cookies are, how FisEvents uses them,
          and how users can manage their settings.
        </p>

        <h3 className="text-lg font-medium text-gray-800 mb-2">
          1. Types of Cookies
        </h3>
        <ul className="list-disc list-inside text-gray-600 mb-4">
          <li>
            <strong>Essential Cookies:</strong> Used for authentication
            (Next-Auth session cookies).
          </li>
          <li>
            <strong>Analytics Cookies:</strong> Google Analytics and Sanity
            Analytics to improve service performance.
          </li>
        </ul>

        <h3 className="text-lg font-medium text-gray-800 mb-2">
          2. Managing Cookies
        </h3>
        <p className="text-gray-600 mb-4">
          Users can manage cookies via browser settings. Refer to documentation:
        </p>

        <ul className="list-disc list-inside text-gray-600 mb-4">
          <li>
            <a
              href="https://support.google.com/chrome/answer/95647"
              className="text-blue-600 underline"
            >
              Google Chrome
            </a>
          </li>
          <li>
            <a
              href="https://support.mozilla.org/kb/cookies"
              className="text-blue-600 underline"
            >
              Mozilla Firefox
            </a>
          </li>
        </ul>
      </section>

      <footer className="mt-8">
        <h3 className="text-lg font-medium text-gray-800 mb-2">Contact Us</h3>
        <p className="text-gray-600">
          For inquiries, contact:{' '}
          <a
            href="mailto:fisevents@fiscet.it"
            className="text-blue-600 underline"
          >
            fisevents@fiscet.it
          </a>
        </p>
      </footer>
    </div>
  );
};

export default PrivacyAndCookiePolicyEN;
