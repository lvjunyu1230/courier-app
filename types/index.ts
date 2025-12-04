// types/index.ts
export type Order = {
  id: number;
  created_at: string;
  requester_id: string;
  taker_id: string | null;
  status: string;
  description: string;
  reward: number;
  pickup_location: string;
  delivery_location:string;
  // 你数据库里有的其他字段...
};


export interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  // ... 其他字段
}
