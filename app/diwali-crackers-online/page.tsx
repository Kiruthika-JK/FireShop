import { Metadata } from 'next';
import { generateSEOHead } from '@/components/seo/SEOHead';
import Link from 'next/link';

const siteUrl = 'https://www.ganishkhasricrackers.in';

export const metadata: Metadata = generateSEOHead({
  title: 'Buy Diwali Crackers Online 2026 | Sivakasi Crackers | Ganishkha Sri Crackers',
  description: 'Buy Diwali crackers online 2026 directly from Sivakasi. Best price list for sparklers, flower pots, bombs, rockets, aerial shots. Wholesale crackers with pan-India delivery. Order now from Ganishkha Sri Crackers.',
  canonical: `${siteUrl}/diwali-crackers-online`,
  keywords: 'diwali crackers, buy diwali crackers online, diwali crackers online, diwali crackers 2026, diwali fireworks, sivakasi crackers, sivakasi diwali crackers, diwali crackers wholesale, diwali crackers price list, diwali pattasu, diwali patakha, diwali gift boxes, diwali sparklers, diwali flower pots, diwali bombs, diwali rockets, online crackers, ganishkha sri crackers, chinnakamanpatti crackers, tamil nadu crackers',
});

const faqs = [
  {
    question: 'How to order Diwali crackers online from Ganishkha Sri Crackers?',
    answer: 'Browse our Sivakasi crackers price list, add sparklers, flower pots, bombs, rockets, aerial shots or gift boxes to your cart, and checkout. Our team will call you to confirm transport details for pan-India delivery.',
  },
  {
    question: 'Do you sell Sivakasi crackers at wholesale price?',
    answer: 'Yes. Ganishkha Sri Crackers is a Sivakasi wholesale crackers supplier. Our price list shows 80% discount on MRP for most items, giving you factory-direct rates.',
  },
  {
    question: 'Do you deliver Diwali crackers across India?',
    answer: 'Yes. We deliver across Tamil Nadu, Pondicherry, Karnataka, Andhra Pradesh, Telangana and all other states. Goods are booked to your nearest transport hub on a "to pay" basis.',
  },
  {
    question: 'What is the Sivakasi crackers delivery time?',
    answer: 'Orders are dispatched within 1-3 business days after payment confirmation. Delivery takes 3-7 business days depending on your location and transport partner.',
  },
  {
    question: 'Is there a 2026 Sivakasi crackers price list?',
    answer: 'Yes. Our updated 2026 price list covers sparklers, flower pots, ground chakkar, peacocks, pencil shots, bijili, bombs, rockets, aerial shots, whistling fountains, crackling fountains, double wonders, children novelties, gift boxes and more.',
  },
  {
    question: 'Are your crackers safe and ISO certified?',
    answer: 'Yes. We source only from trusted Sivakasi brands like Winstar, Sky King, Annai, Vadivel, Hayagrivar, Vanitha, Sri Vijay, Dass, Varshini, Nayagi, Deepam, Sri Krishna, Mother\'s and Suryakala. All products meet safety standards.',
  },
  {
    question: 'How can I contact Ganishkha Sri Crackers?',
    answer: 'Call or WhatsApp 82488 17401 or 81481 65318. You can also visit our shop at Chinnakamanpatti, Sattur Road, Sivakasi - 626189.',
  },
];

export default function DiwaliCrackersOnlinePage() {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Diwali Crackers Online', item: `${siteUrl}/diwali-crackers-online` },
    ],
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to buy Diwali crackers online from Sivakasi',
    description: 'Order Diwali crackers online from Ganishkha Sri Crackers in three simple steps.',
    totalTime: 'PT10M',
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Browse Diwali crackers',
        text: 'Explore sparklers, flower pots, bombs, rockets, aerial shots, gift boxes and more in the Diwali crackers catalog.',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Add to cart',
        text: 'Choose the quantity for each product and add them to your cart.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Checkout and confirm',
        text: 'Enter your delivery details, complete payment and our team will call you to confirm transport.',
      },
    ],
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />

      <section className="bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif mb-4">
            Buy Diwali Crackers Online 2026
          </h1>
          <p className="text-lg sm:text-xl text-yellow-400 mb-2">
            Sivakasi Crackers at Factory Price | Pan-India Delivery
          </p>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Shop premium Sivakasi fireworks online from Ganishkha Sri Traders. Best crackers price list 2026 for sparklers, flower pots, bombs, rockets, aerial shots, gift boxes and more.
          </p>
          <div className="mt-8">
            <Link
              href="/"
              className="inline-block bg-yellow-400 text-black px-8 py-3 rounded-full font-bold hover:bg-yellow-300 transition-colors"
            >
              View Crackers Price List
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl space-y-6 text-gray-700 leading-relaxed">
          <p>
            Diwali is India’s biggest festival, and fireworks are an essential part of the celebration.
            If you are looking to <strong>buy Diwali crackers online 2026</strong>, Ganishkha Sri Crackers
            brings you the best Sivakasi crackers directly from the manufacturing hub of India.
            We serve customers across Tamil Nadu, Pondicherry, Karnataka, Andhra Pradesh, Telangana and all other states.
          </p>
          <p>
            Our online cracker store offers a complete <strong>Sivakasi crackers price list 2026</strong>
            with transparent wholesale rates. Whether you need <strong>sparklers</strong>, <strong>flower pots</strong>,
            <strong>ground chakkar</strong>, <strong>bombs</strong>, <strong>rockets</strong>,
            <strong>aerial shots</strong>, <strong>whistling fountains</strong>, <strong>crackling fountains</strong>,
            <strong>children novelties</strong> or <strong>gift boxes</strong>, you can order from the comfort of your home.
          </p>
          <p>
            Popular searches that bring customers to us include:
            <em> buy sivakasi crackers online, buy pattasu online, sivakasi pattasu online, online pattasu kadai,
            diwali crackers online delivery, crackers home delivery, cheap crackers online, low price crackers sivakasi,
            online crackers chennai, crackers online coimbatore, crackers online erode, crackers online pondicherry,
            online crackers hyderabad, online crackers andhra pradesh, pataka online, buy pataka online</em>.
          </p>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-100">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to order Diwali crackers online?</h2>
          <p className="text-gray-700 mb-6">
            Call or WhatsApp <strong>82488 17401</strong> / <strong>81481 65318</strong> or browse our price list and checkout.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/"
              className="inline-block bg-yellow-400 text-black px-8 py-3 rounded-full font-bold hover:bg-yellow-300 transition-colors"
            >
              Shop Now
            </Link>
            <Link
              href="/contact"
              className="inline-block bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
