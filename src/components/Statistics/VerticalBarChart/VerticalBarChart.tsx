import React from 'react';
import { Bar } from 'react-chartjs-2';

import styles from './verticalbarchart.module.css';
interface IVerticalBarChart{
  period: Date
}
export function VerticalBarChart({period}:IVerticalBarChart) {

  const data = {
    labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб','Вс'],
    datasets: [
      {
        label: 'количество часов в день',
        data: [...Array(7)].map(()=>Math.random()*20),
        backgroundColor: 
          'rgba(75, 192, 192, 0.2)',
        
        borderColor: 
          'rgba(75, 192, 192, 1)',
          
        borderWidth: 1,
      },
    ],
  };
  
  const options = {

    legend: {
      labels: {
        filter: function(item:any, chart:any) {
          // Logic to remove a particular legend item goes here
          return !item.text.includes('часов в день');
        }
      }
    },
    
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };
  return (
    <Bar type={'bar'} data={data} options={options} />
  );
}
