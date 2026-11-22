import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo/lc-logo-text-left-white.png';
import { Button, ButtonVariant } from '../Button';
import { EyeIcon, ArrowLongRightIcon } from '@heroicons/react/24/outline';
import { formatDate } from '../../utils/date';

export interface ArticleItem {
  image: string;
  date: string;
  title: string;
  id: string;
  views: string;
}

interface CardArticleProps {
  value: ArticleItem;
}

export function CardArticleSkeleton(): JSX.Element {
  return (
    <>
      <div className="w-full mx-auto animate-pulse">
        <div className="bg-gray-500 w-full h-[28em] overflow-hidden mb-4 rounded-xl"></div>
        <div className="flex justify-between items-end">
          <div className="bg-gray-500 rounded h-4 w-1/2"></div>
          <div className="bg-gray-500 rounded h-4 w-12"></div>
        </div>
        <div className="my-4 bg-gray-500 rounded h-8 w-full"></div>
        <div className="w-32 h-12 bg-gray-500 rounded-full"></div>
      </div>
    </>
  );
}

export function CardArticle({ value: data }: CardArticleProps): JSX.Element {
  const navigate = useNavigate();
  const [imgFailed, setImgFailed] = useState(false);
  const hasImage = Boolean(data.image) && !imgFailed;

  return (
    <>
      <div className="rounded-xl">
        <figure className="w-full h-[28em] overflow-hidden mb-4 rounded-xl">
          {hasImage ? (
            <img
              className="w-full h-full object-cover transition-all hover:scale-125"
              src={data.image}
              alt={data.title}
              loading="lazy"
              onError={() => setImgFailed(true)}
            />
          ) : (
            // Respaldo cuando el artículo no tiene imagen o la URL está rota
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#542DA0] to-[#8887E8]">
              <img src={logo} alt="LC Soft" className="w-1/2 max-w-[220px] opacity-90" />
            </div>
          )}
        </figure>

        <div className="flex justify-between items-end">
          <span className="text-gray-500"> {formatDate(data.date)} </span>

          <div className="flex items-center gap-1">
            <div className="w-4">
              <EyeIcon />
            </div>
            <span className="text-gray-500">{data.views}</span>
          </div>
        </div>

        <div className="my-4">
          <h3 className="text-2xl font-semibold mb-2 text-white">{data.title}</h3>
          {/* <p> {data.text} </p> */}
        </div>

        <Button
          variant={ButtonVariant.White}
          onClick={() => navigate(`/blog/${data.id}`)}
          iconRight={<ArrowLongRightIcon />}
        >
          Ver m&aacute;s
        </Button>
      </div>
    </>
  );
}
