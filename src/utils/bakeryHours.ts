import type { PickupSpotId } from '../types/menu';

export interface BakeryStatus {
  isOpen: boolean;
  label: string;
}

function getMogilevNow(now: Date = new Date()): Date {
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + 3600000 * 3);
}

export function getLocationStatus(
  spotId: PickupSpotId,
  now: Date = new Date()
): BakeryStatus {
  const mogilevTime = getMogilevNow(now);
  const day = mogilevTime.getDay();
  const isWeekend = day === 0 || day === 6;
  const hours = mogilevTime.getHours();

  const openHour = spotId === 'chel' && isWeekend ? 10 : 9;
  const closeHour = spotId === 'chel' && !isWeekend ? 21 : 20;
  const isOpen = hours >= openHour && hours < closeHour;

  return {
    isOpen,
    label: isOpen ? `Открыто сейчас до ${closeHour}:00` : `Откроется в ${openHour}:00`,
  };
}

export function getMogilevBakeryStatus(now: Date = new Date()): BakeryStatus {
  const chel = getLocationStatus('chel', now);
  const stroit = getLocationStatus('stroit', now);

  if (chel.isOpen || stroit.isOpen) {
    const mogilevTime = getMogilevNow(now);
    const day = mogilevTime.getDay();
    const isWeekend = day === 0 || day === 6;
    const closeHour = !isWeekend ? 21 : 20;
    return {
      isOpen: true,
      label: `Печи работают: открыто до ${closeHour}:00`,
    };
  }

  return {
    isOpen: false,
    label: 'Откроется в 9:00',
  };
}
