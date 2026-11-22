import { SiteHeader } from "../sections/Landing/SiteHeader";
import { Hero } from "../sections/Landing/Hero";
import { Product } from "../sections/Landing/Product";
import { Services } from "../sections/Landing/Services";
import { CustomSoftware } from "../sections/Landing/CustomSoftware";
import { About } from "../sections/Landing/About";
import { Faq } from "../sections/Landing/Faq";
import { FinalCta } from "../sections/Landing/FinalCta";
import { SiteFooter } from "../sections/Landing/SiteFooter";
import { WhatsAppFloat } from "../sections/Landing/WhatsAppFloat";
import { Clients } from "../sections/Home/Clients";
import { Articles } from "../sections/Home/Articles";
import { useSeo } from "../hooks/use-seo";

export function Home() {
  useSeo();

  return (
    <div className="landing min-h-screen bg-[#0b0d18] font-normal text-slate-200 antialiased">
      <SiteHeader />
      <main>
        <Hero />
        <div id="clientes" className="scroll-mt-16">
          <Clients />
        </div>
        <Product />
        <Services />
        <CustomSoftware />
        <About />
        <div id="blog" className="scroll-mt-16">
          <Articles />
        </div>
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
      <WhatsAppFloat />
    </div>
  );
}
