import { LegalLayout, LegalSection } from "./LegalLayout";

export default function Privacy() {
  return (
    <LegalLayout title="Privacy Policy" updated="September 23, 2026">
      <LegalSection title="1. Overview">
        <p>
          This Privacy Policy explains how Codenscious ("we", "our", "us") collects, uses, and protects
          information when you use WorkPulse (the "Service"). We take privacy seriously and only collect
          what we need to provide the Service.
        </p>
      </LegalSection>

      <LegalSection title="2. Information we collect">
        <p>We collect three categories of data:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong className="text-foreground">Account info:</strong> name, email, phone number,
            employee ID, and encrypted password. Provided by you at registration.
          </li>
          <li>
            <strong className="text-foreground">Standup content:</strong> daily reports, tasks,
            blockers, and mood entries you submit. Stored so your admin can access analytics.
          </li>
          <li>
            <strong className="text-foreground">Usage data:</strong> login timestamps, feature usage,
            and error logs. Used to improve reliability.
          </li>
        </ul>
        <p>We do NOT collect: payment card details (handled by Razorpay), device location, or cookies for tracking.</p>
      </LegalSection>

      <LegalSection title="3. How we use your data">
        <ul className="list-disc pl-6 space-y-2">
          <li>To provide and maintain the Service (log standups, run analytics, RAG chat)</li>
          <li>To generate embeddings of your standup text using OpenAI's API (for search + RAG)</li>
          <li>To send transactional emails (password resets, receipts, service updates)</li>
          <li>To detect and prevent abuse or fraudulent activity</li>
          <li>To comply with legal obligations under Indian and international law</li>
        </ul>
        <p>We do NOT sell your data to third parties. Ever.</p>
      </LegalSection>

      <LegalSection title="4. Third-party services">
        <p>We use these subprocessors — each has their own privacy policy:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong className="text-foreground">Firebase (Google):</strong> Authentication and user records</li>
          <li><strong className="text-foreground">OpenAI:</strong> LLM inference for conversations and RAG</li>
          <li><strong className="text-foreground">Razorpay:</strong> Payment processing (Enterprise + paid plans)</li>
          <li><strong className="text-foreground">Cloud infrastructure:</strong> Server hosting (AWS/Railway/similar)</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Data retention">
        <p>
          Standup data is retained per your plan (7 days on Free, 90 days on Growth, unlimited on Pro+).
          Account data is retained while your account is active plus 30 days after deletion. Backups may
          persist an additional 90 days.
        </p>
        <p>
          You can request full data deletion at any time by emailing{" "}
          <a href="mailto:privacy@codenscious.com" className="text-primary hover:underline">privacy@codenscious.com</a>.
        </p>
      </LegalSection>

      <LegalSection title="6. Your rights">
        <p>Under Indian DPDP Act and GDPR (if applicable), you have the right to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Access the personal data we hold about you</li>
          <li>Correct inaccuracies in your data</li>
          <li>Request deletion of your data ("right to be forgotten")</li>
          <li>Export your data in a portable format (CSV/JSON)</li>
          <li>Withdraw consent for optional data processing</li>
          <li>File a complaint with a data protection authority</li>
        </ul>
      </LegalSection>

      <LegalSection title="7. Security">
        <p>
          We use HTTPS for all traffic, encrypted database connections, hashed passwords (via Firebase Auth),
          and access controls on our infrastructure. However, no system is 100% secure. If a breach occurs
          affecting your data, we'll notify affected users within 72 hours.
        </p>
      </LegalSection>

      <LegalSection title="8. Children">
        <p>
          WorkPulse is intended for adult employees. We do not knowingly collect data from anyone under 18.
          If we discover such data, we delete it immediately.
        </p>
      </LegalSection>

      <LegalSection title="9. International transfers">
        <p>
          Some subprocessors (OpenAI, Firebase) are based outside India. By using the Service, you consent
          to your data being transferred to and processed in these jurisdictions under contractual safeguards.
        </p>
      </LegalSection>

      <LegalSection title="10. Changes to this policy">
        <p>
          We may update this policy. Material changes will be notified via email at least 14 days before taking
          effect. Continued use after changes constitutes acceptance.
        </p>
      </LegalSection>

      <LegalSection title="11. Contact">
        <p>
          Questions about this policy or your data:{" "}
          <a href="mailto:privacy@codenscious.com" className="text-primary hover:underline">privacy@codenscious.com</a>
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
