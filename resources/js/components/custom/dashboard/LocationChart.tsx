import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { LocationSummary } from '@/types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface LocationChartProps {
  locationData: LocationSummary[];
}

const LocationChart: React.FC<LocationChartProps> = ({ locationData }) => {
  const colors = [
    'rgba(54, 162, 235, 0.7)',
    'rgba(75, 192, 192, 0.7)',
    'rgba(255, 206, 86, 0.7)',
    'rgba(255, 99, 132, 0.7)',
    'rgba(153, 102, 255, 0.7)',
    'rgba(255, 159, 64, 0.7)',
  ];

  const data = {
    labels: locationData.map(item => item.location),
    datasets: [
      {
        label: 'Number of Carts',
        data: locationData.map(item => item.count),
        backgroundColor: locationData.map((_, index) => colors[index % colors.length]),
        borderColor: locationData.map((_, index) => colors[index % colors.length].replace('0.7', '1')),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value} carts`;
          }
        }
      }
    },
  };

  return (
    <div className="h-full flex items-center justify-center p-4">
      <Pie data={data} options={options} />
    </div>
  );
};

export default LocationChart;
