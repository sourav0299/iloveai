import CardComponent from "./cards"

export default function CardExamples() {
  const cardData = [
    {
      image: "https://source.unsplash.com/400x300/?office",
      title: "Chat API",
      description: "something",
      link: "/chat-ai"
    },
    {
      image: "https://source.unsplash.com/400x300/?office",
      title: "Chat API",
      description: "something",
      link: "/chat-ai"
    },
    {
      image: "https://source.unsplash.com/400x300/?office",
      title: 'Chat API',
      description: "something",
      link: "/chat-ai"
    },
  ]

  return (
    <div className="">
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cardData.map((card, index) => (
            <CardComponent key={index} 
                imageSrc={card.image}
                title={card.title}
                description={card.description}
                link={card.link} 
            />
            ))}
        </div>
      </div>
    </div>
  )
}