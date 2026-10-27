import { BookingDrawer } from "@/components/booking-drawer";
import { ColorCustomizer } from "@/components/color-customizer";
import { Finale } from "@/components/finale";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { SavingsCalculator } from "@/components/savings-calculator";
import { XRayInspector } from "@/components/xray-inspector";

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ColorCustomizer />
        <SavingsCalculator />
        <XRayInspector />
        <Finale />
      </main>
      <Footer />
      <BookingDrawer />
    </>
  );
}
