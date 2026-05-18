import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { Button, ButtonVariant } from '../Button';

export enum CardPreciVariant {
  primary = 'primary',
  black = 'black',
}

export interface CardPreciItem {
  variant?: CardPreciVariant;
  plan: string;
  price: string;
  benefits: string[];
  btnVariant: ButtonVariant;
}

interface CardPreciProps {
  value: CardPreciItem;
}

const CARD_CLASS = {
  [CardPreciVariant.black]: {
    content: 'bg-black text-alabasters',
    colorText: 'text-color-primary',
  },
  [CardPreciVariant.primary]: {
    content: 'bg-color-primary text-black',
    colorText: 'text-black',
  },
};

export function CardPreci({ value }: CardPreciProps): JSX.Element {
  const cls = CARD_CLASS[value.variant ?? CardPreciVariant.primary];

  return (
    <>
      <div
        className={`transition-all hover:scale-110 ${cls.content} py-8 px-8 rounded-[3em]`}
      >
        <span className="block font-bold text-2xl mb-3">{value.plan}</span>
        <span className={`block font-bold text-4xl ${cls.colorText}`}>
          {value.price}
        </span>

        <ul className="my-8 flex flex-col gap-4">
          {value.benefits.map((benefi, index) => (
            <li
              key={index}
              className="grid grid-cols-[1.5em_1fr] items-center gap-2"
            >
              <div className={cls.colorText}>
                <CheckCircleIcon />
              </div>
              {benefi}
            </li>
          ))}
        </ul>
        <Button variant={value.btnVariant}>¡Lo quiero!</Button>
      </div>
    </>
  );
}
