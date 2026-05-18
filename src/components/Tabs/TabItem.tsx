import { ReactNode } from 'react';

interface TabItemProps {
  active: boolean;
  children: ReactNode;
  onSelected: () => void;
}

export function TabItem({
  children,
  active,
  onSelected,
}: TabItemProps): JSX.Element {
  const classActive = active
    ? 'bg-color-primary/15 text-color-primary border-b-color-primary'
    : '';
  return (
    <>
      <div
        onClick={() => onSelected()}
        className={`${classActive} py-4 transition-all hover:bg-color-primary/15 border-r last:border-r-0 border-b-2 border-b-transparent hover:text-color-primary hover:border-b-color-primary text-center cursor-pointer`}
      >
        <h3 className="transition-all">{children}</h3>
      </div>
    </>
  );
}
