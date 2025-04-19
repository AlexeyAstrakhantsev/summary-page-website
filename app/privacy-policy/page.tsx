export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col items-center py-12 px-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <div className="text-sm text-gray-500 mb-6">Last Updated: 19.04.2025</div>
        <h2 className="text-xl font-semibold mt-4 mb-2">1. Information We Collect</h2>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>
            <b>Website Content:</b> When you use our extension, we analyze the text of the web pages you visit to generate summaries. This content is processed via the OpenRouter API but is not stored on our servers.
          </li>
          <li>
            <b>Optional Email Address:</b> If you contact us for support or subscribe to updates, we may collect your email (stored securely via [например, Google Workspace/Tutanota]).
          </li>
          <li>
            <b>Name:</b> Only if voluntarily provided via feedback forms (e.g., "John").
          </li>
        </ul>
        <h2 className="text-xl font-semibold mt-4 mb-2">2. How We Use Data</h2>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>
            <b>AI Processing:</b> Website content is sent to OpenRouter’s API solely to generate summaries. We do not share this data with third parties except OpenRouter (their Privacy Policy).
          </li>
          <li>
            <b>Improvements:</b> Anonymous usage statistics (e.g., feature popularity) help us enhance the extension.
          </li>
        </ul>
        <h2 className="text-xl font-semibold mt-4 mb-2">3. Data Storage & Security</h2>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>
            <b>Local Storage:</b> Your OpenRouter API key (if provided) is stored only in your browser (chrome.storage.local). We cannot access it.
          </li>
          <li>
            <b>No Selling:</b> We never sell or monetize your data.
          </li>
        </ul>
        <h2 className="text-xl font-semibold mt-4 mb-2">4. Your Rights</h2>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Request deletion of your email (contact us at <a className="underline text-blue-600" href="mailto:alexey.i.astrakhantsev@gmail.com">alexey.i.astrakhantsev@gmail.com</a>).</li>
          <li>Disable data collection by uninstalling the extension.</li>
        </ul>
        <div className="mt-6">
          <b>Contact:</b> <a className="underline text-blue-600" href="mailto:alexey.i.astrakhantsev@gmail.com">alexey.i.astrakhantsev@gmail.com</a>
        </div>
      </div>
    </div>
  );
}
