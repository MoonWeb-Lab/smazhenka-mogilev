export interface BakeryStatus {
  isOpen: boolean;
  label: string;
}

export function getMogilevBakeryStatus(now: Date = new Date()): BakeryStatus {
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const mogilevTime = new Date(utc + 3600000 * 3);

  const day = mogilevTime.getDay();
  const isWeekend = day === 0 || day === 6;
  const hours = mogilevTime.getHours();

  const openHour = isWeekend ? 10 : 9;
  const closeHour = isWeekend ? 20 : 21;
  const isOpen = hours >= openHour && hours < closeHour;

  return {
    isOpen,
    label: isOpen ? `Печи работают: открыто до ${closeHour}:00` : `Откроется в ${openHour}:00`,
  };
}
