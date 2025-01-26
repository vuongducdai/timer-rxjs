import React, { useEffect, useState } from 'react';
import { TimerMode, TimerService } from './timer-service';

const timerService = new TimerService();

export const Timer = () => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [mode, setMode] = useState<TimerMode>('work');
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    const timeSub = timerService.timeLeft$.subscribe(setTimeLeft);
    const modeSub = timerService.mode$.subscribe(setMode);
    const runningSub = timerService.isRunning$.subscribe(setIsRunning);

    return () => {
      timeSub.unsubscribe();
      modeSub.unsubscribe();
      runningSub.unsubscribe();
    };
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <h1>Pomodoro Timer</h1>
      <h2>{mode.toUpperCase()}</h2>
      <p>{formatTime(timeLeft)}</p>
      <button onClick={() => timerService.start()} disabled={isRunning}>
        Start
      </button>
      <button onClick={() => timerService.pause()} disabled={!isRunning}>
        Pause
      </button>
      <button onClick={() => timerService.reset()}>Reset</button>
    </div>
  );
};
