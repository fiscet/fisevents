const PrivacyAndCookiePolicyIT = ({ lastUpdated }: { lastUpdated: string }) => {
  return (
    <div className="max-w-5xl mx-auto bg-white shadow-md rounded-md p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Informativa sulla Privacy e sui Cookie
      </h1>

      <div className="text-sm text-gray-500 text-center mb-6">
        Ultimo aggiornamento: {lastUpdated}
      </div>

      {/* Sezione Privacy Policy */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Informativa sulla Privacy
        </h2>

        <div className="text-gray-600 mb-4">
          Questa informativa descrive come FisEvents, di proprietà di Christian
          Zanchetta, tratta i dati personali degli utenti in conformità al
          Regolamento Generale sulla Protezione dei Dati (GDPR).
        </div>

        <h3 className="text-lg font-medium text-gray-800 mb-2">
          1. Titolare del Trattamento
        </h3>
        <div className="text-gray-600 mb-4">
          Il Titolare del trattamento è Christian Zanchetta. Puoi contattarci
          all’indirizzo email:{' '}
          <a
            href="mailto:fisevents@fiscet.it"
            className="text-blue-600 underline"
          >
            fisevents@fiscet.it
          </a>
          .
        </div>

        <h3 className="text-lg font-medium text-gray-800 mb-2">
          2. Tipologia di Dati Raccolti
        </h3>
        <ul className="list-disc list-inside text-gray-600 mb-4">
          <li>
            <strong>Per i tenants (amministratori):</strong> Nome (facoltativo),
            email, immagine profilo (facoltativa), nome azienda, logo azienda
            (facoltativo), sito web aziendale (facoltativo).
          </li>
          <li>
            <strong>Per gli utenti registrati con un tenant:</strong> Nome,
            email e numero di telefono (facoltativo).
          </li>
        </ul>

        <h3 className="text-lg font-medium text-gray-800 mb-2">
          3. Finalità e Base Giuridica
        </h3>
        <div className="text-gray-600 mb-4">
          I dati vengono trattati per fornire il servizio, autenticare gli
          utenti e migliorare la piattaforma tramite strumenti di analisi.
        </div>

        <h3 className="text-lg font-medium text-gray-800 mb-2">
          4. Periodo di Conservazione
        </h3>
        <div className="text-gray-600 mb-4">
          I dati vengono conservati fino alla revoca del consenso o alla
          cessazione del servizio.
        </div>
      </section>

      {/* Sezione Cookie Policy */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Cookie Policy
        </h2>

        <div className="text-gray-600 mb-4">
          Questa Cookie Policy spiega cosa sono i cookie, come FisEvents li
          utilizza e come gli utenti possono gestirli.
        </div>

        <h3 className="text-lg font-medium text-gray-800 mb-2">
          1. Tipologie di Cookie Utilizzati
        </h3>
        <ul className="list-disc list-inside text-gray-600 mb-4">
          <li>
            <strong>Cookie essenziali:</strong> Utilizzati per l’autenticazione
            (Next-Auth session cookies).
          </li>
          <li>
            <strong>Cookie di analisi:</strong> Google Analytics e Sanity
            Analytics per migliorare le performance.
          </li>
        </ul>
      </section>

      <footer className="mt-8">
        <h3 className="text-lg font-medium text-gray-800 mb-2">Contatti</h3>
        <div className="text-gray-600">
          Per richieste o informazioni, contattaci:{' '}
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

export default PrivacyAndCookiePolicyIT;
