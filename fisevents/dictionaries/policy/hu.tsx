const PrivacyAndCookiePolicyHU = ({ lastUpdated }: { lastUpdated: string }) => {
  return (
    <div className="max-w-5xl mx-auto bg-white shadow-md rounded-md p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Adatvédelmi és Cookie Szabályzat
      </h1>

      <div className="text-sm text-gray-500 text-center mb-6">
        Utolsó frissítés: {lastUpdated}
      </div>

      {/* Adatvédelmi Szabályzat */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Adatvédelmi Szabályzat
        </h2>

        <div className="text-gray-600 mb-4">
          Ez az adatvédelmi szabályzat elmagyarázza, hogyan kezeli a FisEvents,
          amelynek tulajdonosa Christian Zanchetta, a felhasználók személyes
          adatait az Általános Adatvédelmi Rendeletnek (GDPR) megfelelően.
        </div>

        <h3 className="text-lg font-medium text-gray-800 mb-2">
          1. Adatkezelő
        </h3>
        <div className="text-gray-600 mb-4">
          Az adatkezelő Christian Zanchetta. Kapcsolatfelvétel:
          <a
            href="mailto:fisevents@fiscet.it"
            className="text-blue-600 underline"
          >
            fisevents@fiscet.it
          </a>
          .
        </div>

        <h3 className="text-lg font-medium text-gray-800 mb-2">
          2. Gyűjtött Adatok Típusa
        </h3>
        <ul className="list-disc list-inside text-gray-600 mb-4">
          <li>
            <strong>Bérlők (adminisztrátorok) számára:</strong> Név
            (opcionális), email, profilkép (opcionális), cégnév, céges logó
            (opcionális), céges weboldal (opcionális).
          </li>
          <li>
            <strong>Regisztrált felhasználók számára:</strong> Név, email és
            opcionális telefonszám.
          </li>
        </ul>

        <h3 className="text-lg font-medium text-gray-800 mb-2">
          3. Adatkezelés Célja és Jogalapja
        </h3>
        <div className="text-gray-600 mb-4">
          Az adatokat a szolgáltatás biztosítása, a felhasználók azonosítása és
          a platform fejlesztése érdekében kezeljük.
        </div>

        <h3 className="text-lg font-medium text-gray-800 mb-2">
          4. Adatok Megőrzési Ideje
        </h3>
        <div className="text-gray-600 mb-4">
          Az adatokat addig tároljuk, amíg a felhasználó nem vonja vissza
          hozzájárulását, vagy amíg a szolgáltatás megszűnik.
        </div>
      </section>

      {/* Cookie Szabályzat */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Cookie Szabályzat
        </h2>

        <div className="text-gray-600 mb-4">
          Ez a cookie szabályzat elmagyarázza, mik a cookie-k, hogyan használja
          őket a FisEvents, és hogyan kezelhetők.
        </div>

        <h3 className="text-lg font-medium text-gray-800 mb-2">
          1. Használt Cookie Típusok
        </h3>
        <ul className="list-disc list-inside text-gray-600 mb-4">
          <li>
            <strong>Alapvető cookie-k:</strong> Hitelesítéshez (Next-Auth
            session cookie-k).
          </li>
          <li>
            <strong>Elemző cookie-k:</strong> Google Analytics és Sanity
            Analytics a teljesítmény javítása érdekében.
          </li>
        </ul>
      </section>

      <footer className="mt-8">
        <h3 className="text-lg font-medium text-gray-800 mb-2">Kapcsolat</h3>
        <div className="text-gray-600">
          Érdeklődés esetén vegye fel velünk a kapcsolatot:
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

export default PrivacyAndCookiePolicyHU;
