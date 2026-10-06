export type PropertyArea = 'Santo Domingo' | 'Punta Cana' | 'Cap Cana' | 'Bayahibe' | 'La Romana';
export type PropertyKind = 'villa' | 'apartment' | 'condo' | 'penthouse' | 'land';

export interface Property {
  title: string;
  price: number;
  beds: number;
  baths: number;
  sqft: string;
  image: string;
  location: string;
  area: PropertyArea;
  kind: PropertyKind;
}

export const AREAS: PropertyArea[] = ['Santo Domingo', 'Punta Cana', 'Cap Cana', 'Bayahibe', 'La Romana'];

export const PROPERTIES: Property[] = [
  {
    title: 'Luxury Villa in Punta Cana',
    price: 850000,
    beds: 5,
    baths: 4,
    sqft: '4,200',
    image: 'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=1200',
    location: 'Punta Cana',
    area: 'Punta Cana',
    kind: 'villa',
  },
  {
    title: 'GreenWood Apartment',
    price: 260000,
    beds: 1,
    baths: 1,
    sqft: '786',
    image: '/d-2574-1765469617-c45431a7-3384-488b-b949-0103dfb4aa72.webp',
    location: 'Cap Cana',
    area: 'Cap Cana',
    kind: 'apartment',
  },
  {
    title: 'Villa Playa Nueva Romana',
    price: 540000,
    beds: 3,
    baths: 3,
    sqft: '4,521',
    image: '/laud-2.webp',
    location: 'Playa Nueva Romana',
    area: 'La Romana',
    kind: 'villa',
  },
  {
    title: 'Luxury Apartment in Cap Cana',
    price: 780000,
    beds: 4,
    baths: 4,
    sqft: '3,800',
    image: 'https://images.pexels.com/photos/34271104/pexels-photo-34271104.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    location: 'Cap Cana, Dominican Republic',
    area: 'Cap Cana',
    kind: 'apartment',
  },
  {
    title: 'Apartment in Torre Roraima',
    price: 198000,
    beds: 1,
    baths: 2,
    sqft: '902',
    image: '/60.jpg',
    location: 'Evaristo Morales, Santo Domingo',
    area: 'Santo Domingo',
    kind: 'apartment',
  },
  {
    title: 'Furnished Apartment in Bayahibe',
    price: 145000,
    beds: 1,
    baths: 1,
    sqft: '554',
    image: '/d-2392-1764611103-8d08280a-5912-4dc7-ab09-fc84088d5fcc.jpg',
    location: 'Bayahibe',
    area: 'Bayahibe',
    kind: 'apartment',
  },
];

export const formatUSD = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

export const WHATSAPP_NUMBER = '18094262269';

export const whatsappLink = (text: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
