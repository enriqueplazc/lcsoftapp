import { useNavigate } from 'react-router-dom';
import { Button } from '../Button';
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

  return (
    <>
      <div className="rounded-xl">
        <figure className="w-full h-[28em] overflow-hidden mb-4 rounded-xl">
          <img
            className="w-full h-full transition-all hover:scale-125"
            src={data.image}
            alt={data.title}
          />
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
          <h4 className="text-2xl font-extrabold mb-2">{data.title}</h4>
          {/* <p> {data.text} </p> */}
        </div>

        <Button
          onClick={() => navigate(`/blog/${data.id}`)}
          iconRight={<ArrowLongRightIcon />}
        >
          Ver m&aacute;s
        </Button>
      </div>
    </>
  );
}
