/**
 * Season enum
 */
export enum Season {
  Spring = "spring",
  Summer = "summer",
  Fall = "fall",
  Winter = "winter",
}

/**
 * Weather enum
 */
export enum Weather {
  Sunny = "sunny",
  Rainy = "rainy",
  Stormy = "stormy",
  Snowy = "snowy",
}

/**
 * Time state interface
 */
export interface TimeState {
  hour: number; // 0-23
  minute: number; // 0-59
  day: number; // 1-28
  season: Season;
  year: number;
  weather: Weather;
}

/**
 * Time Manager
 * Handles game time, day/night cycle, seasons, and weather
 */
export class TimeManager {
  private static instance: TimeManager | null = null;

  private time: TimeState;
  private isPaused: boolean = false;
  private timeScale: number = 1.0; // Game time multiplier
  private readonly msPerGameMinute: number = 1000; // 1 real second = 1 game minute
  private readonly daysPerSeason: number = 28;
  private readonly hoursPerDay: number = 24;

  // Callbacks
  private onTimeChangeCallbacks: Array<(time: TimeState) => void> = [];
  private onNewDayCallbacks: Array<(day: number, season: Season) => void> = [];
  private onSeasonChangeCallbacks: Array<(season: Season) => void> = [];

  private constructor() {
    // Initialize at Spring 1, Year 1, 6:00 AM
    this.time = {
      hour: 6,
      minute: 0,
      day: 1,
      season: Season.Spring,
      year: 1,
      weather: Weather.Sunny,
    };
  }

  /**
   * Get singleton instance
   */
  static getInstance(): TimeManager {
    if (!this.instance) {
      this.instance = new TimeManager();
    }
    return this.instance;
  }

  /**
   * Update time (call every frame)
   */
  update(deltaMs: number): void {
    if (this.isPaused) return;

    // Calculate game time progression
    const gameMinutesElapsed =
      (deltaMs * this.timeScale) / this.msPerGameMinute;

    this.addMinutes(gameMinutesElapsed);
  }

  /**
   * Add minutes to current time
   */
  private addMinutes(minutes: number): void {
    this.time.minute += minutes;

    // Handle minute overflow
    while (this.time.minute >= 60) {
      this.time.minute -= 60;
      this.time.hour += 1;

      // Handle hour overflow (new day at 2 AM)
      if (this.time.hour >= 26) {
        // 2 AM next day
        this.advanceDay();
      }
    }

    // Trigger time change callbacks
    this.onTimeChangeCallbacks.forEach((callback) => callback(this.time));
  }

  /**
   * Advance to next day
   */
  private advanceDay(): void {
    this.time.hour = 6; // Reset to 6 AM
    this.time.minute = 0;
    this.time.day += 1;

    // Handle day overflow (new season)
    if (this.time.day > this.daysPerSeason) {
      this.time.day = 1;
      this.advanceSeason();
    }

    // Randomize weather for new day
    this.randomizeWeather();

    // Trigger new day callbacks
    this.onNewDayCallbacks.forEach((callback) =>
      callback(this.time.day, this.time.season)
    );
  }

  /**
   * Advance to next season
   */
  private advanceSeason(): void {
    const seasons = [Season.Spring, Season.Summer, Season.Fall, Season.Winter];
    const currentIndex = seasons.indexOf(this.time.season);
    const nextIndex = (currentIndex + 1) % seasons.length;

    this.time.season = seasons[nextIndex];

    // New year after Winter
    if (this.time.season === Season.Spring) {
      this.time.year += 1;
    }

    // Trigger season change callbacks
    this.onSeasonChangeCallbacks.forEach((callback) =>
      callback(this.time.season)
    );
  }

  /**
   * Randomize weather based on season
   */
  private randomizeWeather(): void {
    const rand = Math.random();

    switch (this.time.season) {
      case Season.Spring:
        this.time.weather = rand < 0.7 ? Weather.Sunny : Weather.Rainy;
        break;
      case Season.Summer:
        this.time.weather =
          rand < 0.85
            ? Weather.Sunny
            : rand < 0.97
            ? Weather.Rainy
            : Weather.Stormy;
        break;
      case Season.Fall:
        this.time.weather = rand < 0.65 ? Weather.Sunny : Weather.Rainy;
        break;
      case Season.Winter:
        this.time.weather = rand < 0.5 ? Weather.Snowy : Weather.Sunny;
        break;
    }
  }

  /**
   * Get current time state
   */
  getTime(): TimeState {
    return { ...this.time };
  }

  /**
   * Get formatted time string (HH:MM AM/PM)
   */
  getFormattedTime(): string {
    const hour12 = this.time.hour % 12 || 12;
    const ampm = this.time.hour < 12 ? "AM" : "PM";
    const minute = this.time.minute.toString().padStart(2, "0");
    return `${hour12}:${minute} ${ampm}`;
  }

  /**
   * Get formatted date string
   */
  getFormattedDate(): string {
    return `${this.time.season} ${this.time.day}, Year ${this.time.year}`;
  }

  /**
   * Check if it's daytime
   */
  isDaytime(): boolean {
    return this.time.hour >= 6 && this.time.hour < 18;
  }

  /**
   * Check if it's nighttime
   */
  isNighttime(): boolean {
    return !this.isDaytime();
  }

  /**
   * Get light level (0-1)
   */
  getLightLevel(): number {
    if (this.time.hour >= 6 && this.time.hour < 12) {
      // Morning: gradually brighten
      return 0.6 + ((this.time.hour - 6) / 6) * 0.4;
    } else if (this.time.hour >= 12 && this.time.hour < 18) {
      // Afternoon: full bright
      return 1.0;
    } else if (this.time.hour >= 18 && this.time.hour < 20) {
      // Evening: gradually darken
      return 1.0 - ((this.time.hour - 18) / 2) * 0.5;
    } else {
      // Night: dark
      return 0.3;
    }
  }

  /**
   * Pause time
   */
  pause(): void {
    this.isPaused = true;
  }

  /**
   * Resume time
   */
  resume(): void {
    this.isPaused = false;
  }

  /**
   * Set time scale (speed multiplier)
   */
  setTimeScale(scale: number): void {
    this.timeScale = Math.max(0, scale);
  }

  /**
   * Set specific time
   */
  setTime(hour: number, minute: number): void {
    this.time.hour = Math.max(0, Math.min(23, hour));
    this.time.minute = Math.max(0, Math.min(59, minute));
  }

  /**
   * Set specific date
   */
  setDate(day: number, season: Season, year: number): void {
    this.time.day = Math.max(1, Math.min(this.daysPerSeason, day));
    this.time.season = season;
    this.time.year = Math.max(1, year);
  }

  /**
   * Subscribe to time change events
   */
  onTimeChange(callback: (time: TimeState) => void): void {
    this.onTimeChangeCallbacks.push(callback);
  }

  /**
   * Subscribe to new day events
   */
  onNewDay(callback: (day: number, season: Season) => void): void {
    this.onNewDayCallbacks.push(callback);
  }

  /**
   * Subscribe to season change events
   */
  onSeasonChange(callback: (season: Season) => void): void {
    this.onSeasonChangeCallbacks.push(callback);
  }

  /**
   * Load time state from save data
   */
  loadState(state: TimeState): void {
    this.time = { ...state };
  }
}
