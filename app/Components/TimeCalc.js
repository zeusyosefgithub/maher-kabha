import { useState, useEffect } from 'react';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, parseISO } from 'date-fns';

const CountdownComponent = ({ constantDate }) => {
  const [timeDifference, setTimeDifference] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  useEffect(() => {
    const updateDifference = () => {
      const parsedConstantDate = parseISO(constantDate);
      const currentDate = new Date();
      const daysDifference = differenceInDays(parsedConstantDate, currentDate);
      const hoursDifference = differenceInHours(parsedConstantDate, currentDate) % 24;
      const minutesDifference = differenceInMinutes(parsedConstantDate, currentDate) % 60;
      const secondsDifference = differenceInSeconds(parsedConstantDate, currentDate) % 60;
      setTimeDifference({
        days: daysDifference,
        hours: hoursDifference,
        minutes: minutesDifference,
        seconds: secondsDifference,
      });
    };
    updateDifference();
    const intervalId = setInterval(updateDifference, 1000);
    return () => clearInterval(intervalId);
  }, [constantDate]);
  const formatTimeUnit = (unit) => String(unit).padStart(2, '0');
  return (
    <div>
      <p>
        {timeDifference.days > 0 && `${timeDifference.days}:`}
        {formatTimeUnit(timeDifference.hours)[0] === '-' ? formatTimeUnit(timeDifference.hours).slice(1) : formatTimeUnit(timeDifference.hours)}:
        {formatTimeUnit(timeDifference.minutes)[0] === '-' ? formatTimeUnit(timeDifference.minutes).slice(1) : formatTimeUnit(timeDifference.minutes)}:
        {formatTimeUnit(timeDifference.seconds)[0] === '-' ? formatTimeUnit(timeDifference.seconds).slice(1) : formatTimeUnit(timeDifference.seconds)}
      </p>
    </div>
  );
};

export default CountdownComponent;


// the output : 00:-10:-6





