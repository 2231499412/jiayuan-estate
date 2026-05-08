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

export interface ApiResponse<T> {
  data: T;
  total?: number;
  page?: number;
  pageSize?: number;
}
