export class Company {
  company: string;
  email?: string;
  phone?: number;
  address?: string;
  latitude: number;
  longitude: number;
  isActive?: boolean;
  balance: number;
  picture?: string;
  age: number;
  eyeColor: string;
  name: string;
  gender: string;
  about: string;
  registered: number;
  tags: [];
  friends: [
    {
    id: number;
    name: string;
    }
  ];
  greeting: string;
  favoriteFruit: string;
}

