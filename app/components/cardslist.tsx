import CardComponent from "./cards"

export default function CardExamples() {
  const cardData = [
    {
      image: "https://diplo-media.s3.eu-central-1.amazonaws.com/2024/11/apple-chatgpt-plus-subscription-upgrade-1024x576.png",
      title: "Chat Bot",
      description: "Chat Bot is Google’s AI model that understands text. It powers smart features in Gmail, Docs, and other tools for writing, summarizing, and productivity.",
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