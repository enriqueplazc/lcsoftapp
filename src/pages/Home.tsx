import { Element } from "react-scroll";
import { DefaultLayout } from "../layouts/DefaultLayout";
import { Header } from "../components/Header";
import { Banner } from "../components/Banner";

import { TabsWhatWeDo } from "../sections/Home/TabsWhatWeDo";
import { ProcessSteps } from "../sections/Home/ProcessSteps";
import { ServicesGrid } from "../sections/Home/ServicesGrid";
import { Clients } from "../sections/Home/Clients";
import { Articles } from "../sections/Home/Articles";
import { Footer } from "../components/Footer";

export function Home() {
  return (
    <DefaultLayout>
      <Header redirect={false} />
      <Element name="home">
        <Banner />
      </Element>
      <TabsWhatWeDo />
      <ProcessSteps />
      <ServicesGrid />
      <Clients />
      <Articles />
      <Footer />
    </DefaultLayout>
  );
}