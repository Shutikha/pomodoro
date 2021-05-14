export function getPauseTime (date?:Date): number{
  const pauseDate=date || new Date();
  const saved_stat=localStorage.getItem('Pomodoro-StatisticsPauseMillisecs');
  if( !saved_stat ){
    return 0;
  }
  const arr=new Map( JSON.parse(saved_stat));
  return arr.has(pauseDate.toDateString())? arr.get(pauseDate.toDateString()) as number: 0;

}
export const getMondayOfSelectedWeek=(date:Date):Date=>{
  const result = new Date(date);
  const day = date.getDay();

  result.setDate(result.getDate() - day +(day==0?-6:1));
  return result;
};

export const getSundayOfSelectedWeek=(date:Date):Date=>{
  const result = new Date(date);
  const day = date.getDay();
  result.setDate(result.getDate() - day + (day == 0 ? 1 : 7) );
  return result;
};
export function getDaysForWeekChart(date:Date):Date[] {
  const mon=getMondayOfSelectedWeek(date);


  return [...Array(7).keys()].map(day=>{
    const result=new Date(mon);
    result.setDate(result.getDate()+ day);
    return result;
  });
}
export function getWorkHours(date:Date,isWeek:boolean):number[]{
  const work_stat=localStorage.getItem('Pomodoro-StatisticsWorkMillisecs');
  //we sum work and pause values
  const dates=isWeek? getDaysForWeekChart(date):new Array(date) ;


  const pauses=getPauseHours(date,isWeek) ;
  const runs= dates.map(day=>{

    if( work_stat ){
      const arr=new Map( JSON.parse(work_stat));

      if (arr.has(day.toDateString())){

        const ms= arr.get(day.toDateString()) as number;
        return ms / (1000 * 60 * 60);

      }
      else{
        return 0;
      }

    }
    else{
      return 0;
    }
  });


  return runs.map(function (val, idx) {
    return val + pauses[idx];
  });
}
export function getPauseHours(date:Date,isWeek:boolean):number[]{
  const dates=isWeek?getDaysForWeekChart(date):new Array(date) ;

  const pause_stat=localStorage.getItem('Pomodoro-StatisticsPauseMillisecs');
  return dates.map(day=>{

    if( pause_stat ){
      const arr=new Map( JSON.parse(pause_stat));

      if (arr.has(day.toDateString())){
        const ms= arr.get(day.toDateString()) as number;

        return ms / (1000 * 60 * 60);

      }
      else{
        return 0;
      }

    }
    return 0;
  });
}
