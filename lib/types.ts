export type Profile = {
  id: string;
  username: string;
  avatar_url: string;
};

export type Order = {
  id: string;
  created_at: string;
  description: string;
  reward: number;
  pickup_location: string;
  delivery_location: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  requester: Profile | null;
};
