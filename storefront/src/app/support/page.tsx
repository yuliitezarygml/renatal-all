import Link from "next/link";

export default function SupportPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-extrabold mb-8 tracking-tight">Support</h1>
      <div className="prose prose-slate max-w-none">
        <p className="text-lg text-muted-foreground mb-8">
          We&apos;re here to help you with any questions or issues you might have.
        </p>
        
        <div className="bg-card border border-border/50 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
          <p className="mb-4">
            If you need immediate assistance, please reach out to our support team:
          </p>
          <ul className="space-y-3 font-medium">
            <li>Email: <a href="mailto:support@equiprent.com" className="text-primary hover:underline">support@equiprent.com</a></li>
            <li>Phone: <a href="tel:+15551234567" className="text-primary hover:underline">+1 (555) 123-4567</a></li>
            <li>Working Hours: Monday to Friday, 9:00 AM - 6:00 PM</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
