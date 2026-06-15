import Link from "next/link";

export default function HelpCenterPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-extrabold mb-8 tracking-tight">Help Center</h1>
      <div className="space-y-6">
        <p className="text-lg text-muted-foreground mb-8">
          Find answers to the most commonly asked questions below.
        </p>

        <div className="bg-card border border-border/50 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-2">How do I rent equipment?</h3>
          <p className="text-muted-foreground">Browse our catalog, select the items you need, choose your rental dates, and click &quot;Book&quot;. You&apos;ll receive a confirmation email with further instructions.</p>
        </div>

        <div className="bg-card border border-border/50 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-2">What is the cancellation policy?</h3>
          <p className="text-muted-foreground">You can cancel your rental up to 24 hours before the start date for a full refund. Cancellations made within 24 hours may be subject to a fee.</p>
        </div>

        <div className="bg-card border border-border/50 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-2">Do you offer delivery?</h3>
          <p className="text-muted-foreground">Yes! We offer delivery to locations within our service area for an additional fee. You can select the delivery option during checkout.</p>
        </div>

        <div className="mt-8 pt-8 border-t border-border/50">
          <p>Still need help? <Link href="/support" className="text-primary font-medium hover:underline">Contact Support</Link></p>
        </div>
      </div>
    </div>
  );
}
