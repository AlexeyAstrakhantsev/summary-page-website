import React from "react";

export default function PrivacyPolicy() {
  return (
    <main className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy for Instant Summary</h1>
      <div className="mb-2 text-gray-600 font-medium">Last Updated: {new Date().toLocaleDateString()}</div>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Data We Collect</h2>
      <ul className="list-disc pl-6 mb-4">
        <li><b>Webpage Content:</b> When you generate a summary, we process the text of the page you're viewing via our AI API. This data is <b>not stored</b> after processing.</li>
        <li><b>Usage Analytics:</b> We log anonymous metrics (e.g., number of requests, model used) to improve performance.</li>
        <li><b>Google Account Info</b> (if authorized): Only your email and name (optional) for personalization.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Data</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>To generate summaries via our AI models.</li>
        <li>To enforce usage limits (free tier).</li>
        <li>To troubleshoot errors (e.g., failed API requests).</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Data Storage & Security</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>Request logs are anonymized and retained for 30 days.</li>
        <li>No webpage content is stored on our servers.</li>
        <li>Google OAuth data (if used) is encrypted.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Third Parties</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>Our AI API processes text but does not retain it.</li>
        <li>Google OAuth follows <a className="underline text-blue-600" href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google's Privacy Policy</a>.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Your Rights</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>Request deletion of usage logs: Contact us at <b>info@summary-page.online</b>.</li>
        <li>Disable data collection: Uninstall the extension.</li>
      </ul>

      <div className="mt-6">
        <b>Contact:</b> <a className="underline text-blue-600" href="mailto:info@summary-page.online">info@summary-page.online</a>
      </div>
    </main>
  );
}

      <h1 className="text-3xl font-bold mb-4">Privacy Policy for SummaryPage</h1>
      <p className="mb-2 text-gray-600">Effective Date: April 27, 2025</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Overview</h2>
      <p className="mb-4">
        SummaryPage is a Chrome extension that generates AI-powered summaries of web pages. The extension uses Google OAuth for authentication and a third-party AI model (LLM/neural network) to process and summarize content. We are committed to protecting your privacy and ensuring transparency about how your information is handled.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Information We Collect</h2>
      <ul className="list-disc pl-6 mb-4">
        <li className="mb-2">
          <strong>Google Account Information:</strong> When you sign in with Google, we access your email address and basic profile information through Google OAuth. This is used solely to identify you within the extension and to provide premium features if available.
        </li>
        <li className="mb-2">
          <strong>Web Page Content:</strong> The extension processes the content of the web pages you choose to summarize. This content is sent to an AI model for processing.
        </li>
        <li>
          <strong>Usage Data:</strong> We may collect anonymized usage statistics (such as the number of summaries generated) to improve the extension and monitor usage limits.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. How We Use Your Information</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>To authenticate your identity via Google OAuth.</li>
        <li>To generate summaries of web pages using an AI model (LLM/neural network).</li>
        <li>To display your usage limits and premium status.</li>
        <li>To improve and maintain the extension.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Data Sharing and Third Parties</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>
          <strong>Google:</strong> We use Google OAuth solely for authentication. We do not share your data with Google beyond what is required for login.
        </li>
        <li>
          <strong>AI Model/Neural Network:</strong> The content of the web pages you summarize is sent to a third-party AI model for processing. No personal Google account data is shared with the AI provider.
        </li>
        <li>
          <strong>No Sale of Data:</strong> We do not sell, trade, or otherwise transfer your personal information to outside parties.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Data Storage and Security</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>Your authentication tokens are stored securely in your browser and are not shared with third parties except as required for authentication and API requests.</li>
        <li>We take reasonable measures to protect your information from unauthorized access or disclosure.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. User Controls</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>You can log out of your Google account at any time from within the extension.</li>
        <li>You may uninstall the extension at any time to stop all data collection.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">7. Children’s Privacy</h2>
      <p className="mb-4">This extension is not intended for use by children under the age of 13. We do not knowingly collect personal information from children.</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">8. Changes to This Policy</h2>
      <p className="mb-4">We may update this Privacy Policy from time to time. Changes will be posted within the extension or on our website.</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">9. Contact</h2>
      <p>If you have any questions about this Privacy Policy or your data, please contact us at:<br/>
        <a href="mailto:support@summary-page.online" className="text-blue-600 underline">support@summary-page.online</a>
      </p>
    </main>
  );
}
