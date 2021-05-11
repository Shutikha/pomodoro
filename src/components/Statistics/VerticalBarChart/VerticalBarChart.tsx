import React, { useContext } from 'react';
import { Bar } from 'react-chartjs-2';
import { ThemeContext } from '../../../App';
import { EColors,Text } from '../../../utils/Text';
import { getDaysForWeekChart, getMondayOfSelectedWeek, getSundayOfSelectedWeek, getWorkHours } from '../stat_utils';

interface IVerticalBarChart{
  date: Date
}
export function VerticalBarChart({date}:IVerticalBarChart):JSX.Element {
  const isDarkMode = useContext(ThemeContext);

  const data = {
    labels: getDaysForWeekChart(date).map(day=>day.toLocaleDateString('ru-RU',{day:'numeric',weekday: 'short' })),
    //labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб','Вс'],
    datasets: [
      {
        label: 'количество часов в день',
        data: getWorkHours(date,true),
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
        filter: function(item:any) {

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
    <div>
      <Text size={28} color={isDarkMode?EColors.grey:EColors.black}>Работа с таймером за неделю с {getMondayOfSelectedWeek(date).toLocaleDateString('ru-RU')} по {getSundayOfSelectedWeek(date).toLocaleDateString('ru-RU')} </Text>
      <Bar type={'bar'} data={data} options={options} />
    </div>
  );
}
