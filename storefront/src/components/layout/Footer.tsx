import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background mt-auto">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="font-bold text-lg tracking-tight">EquipRent</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Premium rental equipment for creators, builders, and adventurers. Quality guaranteed.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold">Explore</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/catalog" className="hover:text-primary transition-colors">All Equipment</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">New Arrivals</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Special Offers</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>support@equiprent.com</li>
              <li>+1 (555) 123-4567</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} EquipRent. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
