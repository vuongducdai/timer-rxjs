import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';

export type TimerMode = 'work' | 'shortBreak' | 'longBreak';

export class TimerService {
  private timerSubject = new BehaviorSubject<number>(5); // Default: 25 minutes
  private modeSubject = new BehaviorSubject<TimerMode>('work');
  private isRunningSubject = new BehaviorSubject<boolean>(false);

  private timerSubscription: Subscription | null = null;

  // Observables for UI consumption
  timeLeft$ = this.timerSubject.asObservable();
  mode$ = this.modeSubject.asObservable();
  isRunning$ = this.isRunningSubject.asObservable();

  private durations = {
    work: 5,
    shortBreak: 3,
    longBreak: 4,
  };

  start() {
    if (this.timerSubscription) return;

    this.isRunningSubject.next(true);
    this.timerSubscription = interval(1000)
      .pipe(
        map(() => -1), // Decrement time
        takeWhile(() => this.timerSubject.value > 0, true)
      )
      .subscribe({
        next: (decrement) => {
          const newTime = this.timerSubject.value + decrement;
          this.timerSubject.next(newTime);
        },
        complete: () => {
          this.switchMode();
          this.timerSubscription = null; // Cleanup
        },
      });
  }

  pause() {
    this.isRunningSubject.next(false);
    this.timerSubscription?.unsubscribe();
    this.timerSubscription = null;
  }

  reset() {
    this.pause();
    const currentMode = this.modeSubject.value;
    this.timerSubject.next(this.durations[currentMode]);
  }

  switchMode() {
    this.pause(); // Stop any running timer

    const currentMode = this.modeSubject.value;
    let nextMode: TimerMode;

    if (currentMode === 'work') {
      nextMode = 'shortBreak'; // Cycle logic
    } else if (currentMode === 'shortBreak') {
      nextMode = 'longBreak';
    } else {
      nextMode = 'work';
    }

    this.modeSubject.next(nextMode);
    this.timerSubject.next(this.durations[nextMode]);
  }
}
