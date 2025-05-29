import React from "react";

type CardProps = {
  imageSrc: string;
  title: string;
  description: string;
  link: string;
};

const Card: React.FC<CardProps> = ({ imageSrc, title, description, link }) => {
  return (
    <div className="max-w-sm w-80 bg-card border border-border rounded-lg shadow-sm">
      <a href={link}>
        <CardImage src={imageSrc} />
        <CardContent title={title} description={description} />
      </a>
    </div>
  );
};

type CardImageProps = {
  src: string;
};

const CardImage: React.FC<CardImageProps> = ({ src }) => (
  <div>
    <img className="rounded-t-lg" src={src} alt="Card visual" />
  </div>
);

type CardContentProps = {
  title: string;
  description: string;
};

const CardContent: React.FC<CardContentProps> = ({ title, description }) => (
  <div className="p-5">
    <div>
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-card-foreground">
        {title}
      </h5>
    </div>
    <p className="mb-3 font-normal text-muted-foreground">
      {description}
    </p>
    <ReadMoreButton />
  </div>
);

type ReadMoreButtonProps = {
};

const ReadMoreButton: React.FC<ReadMoreButtonProps> = ({}) => (
  <div
    className="inline-flex items-center px-3 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-secondary hover:text-secondary-foreground focus:ring-4 focus:outline-none focus:ring-ring transition-colors"
  >
    View
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
  </div>
);

export default Card;