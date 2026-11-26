export type DishCategory = 'all' | 'meat' | 'classic' | 'special' | 'drinks';

export interface DishNutrition {
  kcal: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface DishItem {
  id: string;
  name: string;
  category: Exclude<DishCategory, 'all'>;
  price: number;
  weight: string;
  factor: number;
  image: string;
  alt: string;
  badge?: {
    label: string;
    tone: 'red' | 'gold';
  };
  shortDesc: string;
  description: string;
  ingredients: string;
  per100: DishNutrition;
}

export interface CartEntry {
  dish: DishItem;
  qty: number;
}

export type DeliveryMethod = 'pickup' | 'delivery';
export type PickupSpotId = 'chel' | 'stroit';

export interface CategoryTab {
  id: DishCategory;
  label: string;
}

export interface BakeryLocation {
  id: PickupSpotId;
  title: string;
  address: string;
  badge: string;
  rating: string;
  image: string;
  alt: string;
  description: string;
  hours: Array<{ days: string; time: string }>;
  mapUrl: string;
}
