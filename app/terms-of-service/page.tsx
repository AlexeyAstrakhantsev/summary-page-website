export default function TermsOfService() {
  return (
    <div className="flex flex-col items-center py-12 px-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <div className="text-sm text-gray-500 mb-6">Last Updated: 19.04.2025</div>
        <h2 className="text-xl font-semibold mt-4 mb-2">1. Acceptance</h2>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>By using the extension, you agree to these terms.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-4 mb-2">2. Usage Rules</h2>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>You may not use the extension for illegal content or spam.</li>
          <li><b>API Keys:</b> You are responsible for your OpenRouter API usage costs.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-4 mb-2">3. Disclaimer</h2>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Summaries are AI-generated and may contain inaccuracies.</li>
          <li>We are not liable for any damages from using the extension.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-4 mb-2">4. Changes</h2>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>We may update these terms. Continued use = acceptance.</li>
        </ul>
        <div className="mt-6">
          <b>Contact:</b> <a className="underline text-blue-600" href="mailto:alexey.i.astrakhantsev@gmail.com">alexey.i.astrakhantsev@gmail.com</a>
        </div>
      </div>
    </div>
  );
}
