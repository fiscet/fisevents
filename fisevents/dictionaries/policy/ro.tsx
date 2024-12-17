const PrivacyAndCookiePolicyRO = ({ lastUpdated }: { lastUpdated: string }) => {
  return (
    <div className="max-w-5xl mx-auto bg-white shadow-md rounded-md p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Politica de Confidențialitate și Cookie-uri
      </h1>

      <div className="text-sm text-gray-500 text-center mb-6">
        Ultima actualizare: {lastUpdated}
      </div>

      {/* Politica de Confidențialitate */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Politica de Confidențialitate
        </h2>

        <div className="text-gray-600 mb-4">
          Această politică explică modul în care FisEvents, deținut de Christian
          Zanchetta, gestionează datele personale ale utilizatorilor conform
          Regulamentului General privind Protecția Datelor (GDPR).
        </div>

        <h3 className="text-lg font-medium text-gray-800 mb-2">
          1. Operatorul de Date
        </h3>
        <div className="text-gray-600 mb-4">
          Operatorul de date este Christian Zanchetta. Ne puteți contacta la
          adresa de email:
          <a
            href="mailto:fisevents@fiscet.it"
            className="text-blue-600 underline"
          >
            fisevents@fiscet.it
          </a>
          .
        </div>

        <h3 className="text-lg font-medium text-gray-800 mb-2">
          2. Tipuri de Date Colectate
        </h3>
        <ul className="list-disc list-inside text-gray-600 mb-4">
          <li>
            <strong>Pentru chiriași (administratori):</strong> Nume (opțional),
            email, imagine de profil (opțional), nume companie, logo companie
            (opțional), site web companie (opțional).
          </li>
          <li>
            <strong>Pentru utilizatorii înregistrați cu un chiriaș:</strong>{' '}
            Nume, email și număr de telefon (opțional).
          </li>
        </ul>

        <h3 className="text-lg font-medium text-gray-800 mb-2">
          3. Scopuri și Baza Legală
        </h3>
        <div className="text-gray-600 mb-4">
          Datele sunt procesate pentru a furniza serviciul, autentifica
          utilizatorii și îmbunătăți platforma prin instrumente analitice.
        </div>

        <h3 className="text-lg font-medium text-gray-800 mb-2">
          4. Perioada de Păstrare a Datelor
        </h3>
        <div className="text-gray-600 mb-4">
          Datele sunt păstrate până la retragerea consimțământului sau până la
          încetarea serviciului.
        </div>
      </section>

      {/* Politica de Cookie-uri */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Politica de Cookie-uri
        </h2>

        <div className="text-gray-600 mb-4">
          Această politică de cookie-uri explică ce sunt cookie-urile, cum le
          utilizează FisEvents și cum pot fi gestionate de utilizatori.
        </div>

        <h3 className="text-lg font-medium text-gray-800 mb-2">
          1. Tipuri de Cookie-uri Utilizate
        </h3>
        <ul className="list-disc list-inside text-gray-600 mb-4">
          <li>
            <strong>Cookie-uri esențiale:</strong> Utilizate pentru
            autentificare (cookie-uri de sesiune Next-Auth).
          </li>
          <li>
            <strong>Cookie-uri analitice:</strong> Google Analytics și Sanity
            Analytics pentru îmbunătățirea performanțelor.
          </li>
        </ul>
      </section>

      <footer className="mt-8">
        <h3 className="text-lg font-medium text-gray-800 mb-2">Contact</h3>
        <div className="text-gray-600">
          Pentru întrebări sau informații, contactați-ne la:
          <a
            href="mailto:fisevents@fiscet.it"
            className="text-blue-600 underline"
          >
            fisevents@fiscet.it
          </a>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyAndCookiePolicyRO;
