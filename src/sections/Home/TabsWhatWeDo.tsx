import { Element } from "react-scroll";
import { Tabs } from "../../components/Tabs";
import { itemsTab } from "../../content/home";
import { Section } from "../../components/Section";

export const TabsWhatWeDo = () => (
  <Section id="whatdo">
    <Element name="whatdo">
      <div className="content overflow-hidden m-auto my-20">
        <Tabs items={itemsTab} />
      </div>
    </Element>
  </Section>
);
