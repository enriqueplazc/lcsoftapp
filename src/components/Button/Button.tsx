import { ReactNode } from 'react';

export enum ButtonVariant {
  Black = 'Black',
  White = 'White',
}

interface ButtonProps {
  width?: string;
  variant?: ButtonVariant;
  children: ReactNode;
  iconRight?: ReactNode;
  onClick?: () => void;
}

const buttonClass = {
  [ButtonVariant.Black]:  
    'border-black text-black hover:text-white after:bg-black',
  [ButtonVariant.White]:
    'border-white text-white hover:text-black after:bg-white',
};

const iconClass = {
  [ButtonVariant.Black]: 'text-red hover:text-red',
  [ButtonVariant.White]:
    'border-white text-white hover:text-black after:bg-white',
};

export function Button({
  children,
  variant,
  width,
  iconRight,
  onClick,
}: ButtonProps) {
  return (
    <>
      <button
        onClick={onClick}
        className={`${iconRight ? 'flex items-center gap-4' : ''} transition-all overflow-hidden relative after:absolute after:transition-all after:left-0 after:top-0 after:w-0 hover:after:w-full after:h-full  ${width ?? 'w-fit'} border  px-6 py-[0.7em] rounded-full  ${buttonClass[variant ?? ButtonVariant.Black]}`}
      >
        <span className="relative z-10">{children}</span>
        {iconRight ? (
          <div className="relative z-10">
            <div
              className={`transition-all w-8 ${iconClass[variant ?? ButtonVariant.Black]}`}
            >
              {iconRight}
            </div>
          </div>
        ) : (
          ''
        )}
      </button>
    </>
  );
}
