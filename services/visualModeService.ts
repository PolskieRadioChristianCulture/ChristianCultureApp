import { VisualMode } from '../types';
import SunCalc from 'suncalc';

export const visualModeService = {
  /**
   * Accurate sunset/sunrise using 'suncalc'
   */
  getSunTimes(date: Date, location?: string) {
    let lat = 50.9297; // Default: Ostrowiec Świętokrzyski
    let lng = 21.3881;

    if (location && location.includes(',')) {
      const [lLat, lLng] = location.split(',').map(Number);
      if (!isNaN(lLat) && !isNaN(lLng)) {
        lat = lLat;
        lng = lLng;
      }
    }

    const times = SunCalc.getTimes(date, lat, lng);
    return { sunset: times.sunset, sunrise: times.sunrise };
  },

  calculateCurrentMode(date: Date, location?: string): VisualMode {
    const day = date.getDay(); // 0 = Sunday, 5 = Friday, 6 = Saturday
    const { sunset, sunrise } = this.getSunTimes(date, location);
    const now = date.getTime();

    // 1. Check for Sabbath (Friday sunset to Saturday sunset)
    // Friday after sunset
    if (day === 5 && now >= sunset.getTime()) {
      return 'sabbath';
    }
    // Saturday before sunset
    if (day === 6 && now < sunset.getTime()) {
      return 'sabbath';
    }

    // 2. Check for Night (Sunset to Sunrise)
    // After sunset today
    if (now >= sunset.getTime()) {
      return 'night';
    }
    // Before sunrise today
    if (now < sunrise.getTime()) {
      return 'night';
    }

    return 'standard';
  }
};
