// src/components/InfoCard.tsx
"use-client"
type InfoCardProps = {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
};

const InfoCard = ({ title, value, change, changeType }: InfoCardProps) => {
  const isIncrease = changeType === 'increase';
  return (
    <div className="bg-white p-5 rounded-lg shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
      <p className={`text-sm mt-1 flex items-center ${isIncrease ? 'text-green-500' : 'text-red-500'}`}>
        {isIncrease ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
        )}
        {change}
      </p>
    </div>
  );
};

export default InfoCard;
