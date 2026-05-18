import { useState } from 'react';
import { TabItem } from './TabItem';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import { Scrollbar, A11y, Navigation } from 'swiper/modules';
import { Breakpoint, useBreakpoint } from '../../hooks/breakpoint';
export interface Items {
  selected: boolean;
  header: {
    title: string;
  };
  content: {
    title: string;
    image: string;
    texts: string[];
  };
}

interface TabsProps {
  items: Items[];
}

export function Tabs({ items }: TabsProps): JSX.Element {
  const [list] = useState(items);
  const [indexActive, setIndexActive] = useState(0);
  const [swiper, setSwiper] = useState<SwiperClass>();
  const breakpoint = useBreakpoint();

  function onSelected(index: number) {
    swiper?.slideTo(index);
    setIndexActive(index);
  }

  return (
    <>
      <div>
        {breakpoint != Breakpoint.md && breakpoint != Breakpoint.sm && (
          <div
            style={{
              gridTemplateColumns: `repeat(${list.length}, minmax(0, 1fr))`,
            }}
            className={`rounded-lg overflow-hidden grid bg-alabasters border border-mercury`}
          >
            {list.map((item, index) => (
              <TabItem
                key={index}
                active={indexActive == index}
                onSelected={() => onSelected(index)}
              >
                {item.header.title}
              </TabItem>
            ))}
          </div>
        )}

        <div className="bg-alabasters border border-mercury p-8 rounded-3xl mt-4">
          <Swiper
            modules={[Navigation, Scrollbar, A11y]}
            centeredSlides={true}
            pagination={{ clickable: true }}
            onSwiper={(v) => setSwiper(v)}
            onSlideChange={(x) => setIndexActive(x.activeIndex)}
          >
            {list.map((item, index) => (
              <SwiperSlide key={index}>
                <div
                  className={`transition-all grid grid-cols-1 lg:grid-cols-[30em_1fr]  gap-8 items-center justify-between`}
                >
                  <figure className="overflow-hidden rounded-3xl w-full h-[30em] ">
                    <img
                      className="object-cover w-full h-full"
                      src={item.content.image}
                      alt=""
                    />
                  </figure>
                  <article>
                    <h3 className="text-4xl mb-4 roboto font-extrabold">
                      <strong>{item.content.title}</strong>
                    </h3>

                    {item.content.texts.map((text, i) => (
                      <p key={i} className="mb-4 last:mb-0">
                        {text}
                      </p>
                    ))}
                  </article>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </>
  );
}
