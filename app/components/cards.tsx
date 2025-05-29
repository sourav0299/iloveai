import React from "react";

type CardProps = {
  imageSrc: string;
  title: string;
  description: string;
  link: string;
};

const Card: React.FC<CardProps> = ({ imageSrc, title, description, link }) => {
  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <CardImage src={imageSrc} />
      <CardContent title={title} description={description} link={link} />
    </div>
  );
};

type CardImageProps = {
  src: string;
};

const CardImage: React.FC<CardImageProps> = ({ src }) => (
  <a href="#">
    <img className="rounded-t-lg" src={src} alt="Card visual" />
  </a>
);

type CardContentProps = {
  title: string;
  description: string;
  link: string;
};

const CardContent: React.FC<CardContentProps> = ({ title, description, link }) => (
  <div className="p-5">
    <a href="#">
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {title}
      </h5>
    </a>
    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
      {description}
    </p>
    <ReadMoreButton link={link} />
  </div>
);

type ReadMoreButtonProps = {
  link: string;
};

const ReadMoreButton: React.FC<ReadMoreButtonProps> = ({ link }) => (
  <a
    href={link}
    className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
  >
    Read more
    <svg
      className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 14 10"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M1 5h12m0 0L9 1m4 4L9 9"
      />
    </svg>
  </a>
);

export default Card;
