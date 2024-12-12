import { useDictionary } from "@/app/contexts/DictionaryContext"

export default function HPPricing() {
  const {website: d} = useDictionary();

  return (<section id="pricing" className="bg-orange-50 py-10 rounded-md">
    <h3 className="text-2xl font-semibold text-orange-600 text-center mb-6">
      {d.home.pricing.title}
    </h3>
    <div className="flex flex-col md:flex-row justify-center items-center space-y-6 md:space-y-0 md:space-x-8">
      <div className="bg-white shadow-md rounded-lg p-6 text-center">
        <h4 className="font-semibold text-lg mb-2">
          {d.home.pricing.list.starter.title}
        </h4>
        <p className="text-gray-600 mb-4">
          {d.home.pricing.list.starter.text}
        </p>
        <ul className="text-sm text-gray-600 mb-4">
          <li>
            • {d.home.pricing.list.starter.features[0]}
          </li>
          <li>
            • {d.home.pricing.list.starter.features[1]}
          </li>
        </ul>
        <span className="text-3xl font-bold text-gray-800">0€</span>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6 text-center">
        <h4 className="font-semibold text-lg mb-2">
          {d.home.pricing.list.hero.title}
        </h4>
        <p className="text-gray-600 mb-4">
          {d.home.pricing.list.hero.text}
        </p>
        <ul className="text-sm text-gray-600 mb-4">
          <li>
            • {d.home.pricing.list.hero.features[0]}
          </li>
          <li>
            • {d.home.pricing.list.hero.features[1]}
          </li>
        </ul>
        <span className="text-3xl font-bold text-gray-800">5€/event</span>
      </div>
    </div>
  </section>)
} 