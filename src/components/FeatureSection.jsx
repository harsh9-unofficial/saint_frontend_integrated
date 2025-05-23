const FeatureCard = ({ icon, title, description }) => (
  <div className="flex-1 p-4 text-center">
    <div className="flex justify-center mb-2">{icon}</div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const FeatureSection = () => {
  const features = [
    {
      icon: <img src="/images/Feature1.png" alt="Icon" />,
      title: "FREE SHIPPING",
      description: "Free shipping on all orders over $50 nationwide",
    },
    {
      icon: <img src="/images/Feature2.png" alt="Icon" />,
      title: "PREMIUM QUALITY",
      description: "Ethically sourced materials for comfort and durability",
    },
    {
      icon: <img src="/images/Feature3.png" alt="Icon" />,
      title: "EASY RETURNS",
      description: "30-day hassle-free returns for your peace of mind",
    },
    {
      icon: <img src="/images/Feature4.png" alt="Icon" />,
      title: "10% OFF FIRST ORDER",
      description: "Use code 'SAINT10' at checkout for 10% discount",
    },
  ];

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </div>
  );
};

export default FeatureSection;
