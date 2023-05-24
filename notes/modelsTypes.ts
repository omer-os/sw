type Restaurant = {
  id: string;
  ownerId: string;
  name: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
  phone: string;
  email: string;
  website: string;
  createdAt: Date;
  updatedAt: Date;
  ratings: number;
  operatingHours: object;
  socialMediaLinks: object;
  features: string[];
  tags: string[];
};

type Menu = {
  restaurantId: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};  

type MenuItem = {
  menuId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
};

type User = {
  id: string;
  displayName: string;
  email: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
  roles: string[];
};

type Order = {
  userId: string;
  restaurantId: string;
  menuItems: string[];
  totalAmount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};
