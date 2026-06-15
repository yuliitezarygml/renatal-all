export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-extrabold mb-8 tracking-tight">Privacy Policy</h1>
      <div className="prose prose-slate max-w-none text-muted-foreground space-y-6">
        <p className="font-semibold text-foreground">Last updated: June 2026</p>
        
        <p>At EquipRent, we take your privacy and the security of your personal data very seriously. This Privacy Policy outlines our practices regarding the collection, use, processing, and protection of your information in compliance with applicable data protection regulations (including GDPR and local equivalents).</p>

        <h2 className="text-2xl font-bold text-foreground">1. Information We Collect</h2>
        <p>We collect information to provide you with secure and reliable equipment rental services. This includes:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Identity Data:</strong> Full name, date of birth, identity card/passport numbers, and photographic verification.</li>
          <li><strong>Contact Data:</strong> Email address, billing address, delivery address, and telephone numbers.</li>
          <li><strong>Financial Data:</strong> Bank account and payment card details (processed securely via PCI-DSS compliant third-party gateways).</li>
          <li><strong>Transaction Data:</strong> Details about payments, rental history, and services you have purchased from us.</li>
        </ul>
        
        <h2 className="text-2xl font-bold text-foreground">2. How We Use Your Information</h2>
        <p>We will only use your personal data when the law allows us to. Most commonly, we use your data in the following circumstances:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>To execute the rental contract we are about to enter into or have entered into with you.</li>
          <li>To mitigate fraud, conduct risk assessments, and verify your identity in accordance with Anti-Money Laundering (AML) standards.</li>
          <li>To manage our relationship with you, including notifying you about changes to our terms or privacy policy.</li>
          <li>To comply with legal, regulatory, or tax obligations.</li>
        </ul>
        
        <h2 className="text-2xl font-bold text-foreground">3. Data Security and Retention</h2>
        <p>We have put in place robust security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. Access to your personal data is limited to employees, agents, and contractors who have a strict business need to know and are subject to a duty of confidentiality.</p>
        <p>We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements. By default, financial and transaction records are kept for 5 years.</p>
        
        <h2 className="text-2xl font-bold text-foreground">4. Your Legal Rights</h2>
        <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, or restriction of processing. If you wish to exercise any of these rights, please contact our Data Protection Officer at privacy@equiprent.com.</p>
      </div>
    </div>
  );
}
