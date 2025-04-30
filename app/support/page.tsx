import React from "react";

export default function Support() {
  return (
    <main className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">Support &amp; Contact</h1>

      <h2 className="text-xl font-semibold mt-6 mb-2">Need Help?</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>Email: <b>info@summary-page.online</b></li>
        <li>Response time: 24–48 hours.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">FAQ</h2>
      <div className="mb-2">
        <b>Q: How do I reset my usage limits?</b><br/>
        A: Limits refresh daily at midnight UTC.
      </div>
      <div className="mb-2">
        <b>Q: Is my data sold?</b><br/>
        A: Never. We comply with Chrome Web Store policies.
      </div>
    </main>
  );
}
