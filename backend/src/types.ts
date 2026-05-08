export interface Property {
  id: number;
  title: string;
  type: string;
  area: string;
  address: string;
  price: string;
  area_sqm: string | null;
  rooms: string | null;
  floor: string | null;
  image_keys: string | null;
  desc: string | null;
  hot: number;
  status: string;
  created_at: string;
}

export interface Admin {
  id: number;
  username: string;
  password: string;
}

export interface Env {
  DB: D1Database;
  IMAGES: R2Bucket;
  JWT_SECRET: string;
}
