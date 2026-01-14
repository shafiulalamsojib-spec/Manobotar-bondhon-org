
export type Role = 'Admin' | 'Member';

export interface UserPermissions {
  viewFund: boolean;
  postActivities: boolean;
  postNotices: boolean;
  manageMembers: boolean;
}

export interface UserMessage {
  id: string;
  text: string;
  date: string;
  sender: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password?: string; // Support Admin editing/viewing member passwords
  role: Role;
  position?: string;
  approved: boolean;
  status: 'Pending' | 'Approved' | 'Rejected';
  monthly_amount: number;
  manual_due?: number; // Calculated due override
  manual_total_paid?: number; // Total paid override
  paid_months?: string[]; // Array of "Month Year" strings manually marked as paid
  joining_date: string;
  created_at?: string;
  token?: string;
  address?: string;
  bloodGroup?: string;
  permissions?: UserPermissions;
  messages?: UserMessage[];
}

export interface Donation {
  id: string;
  user_id: string;
  user_name?: string;
  amount: number;
  method: 'Bkash' | 'Nagad' | 'Rocket' | 'Cash' | 'Bank';
  trx_id: string;
  screenshot?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  type: 'Subscription' | 'General' | 'Manual';
  payment_month?: string;
  created_at: string;
}

export interface FundTransaction {
  id: string;
  type: 'Income' | 'Expense';
  category: string;
  amount: number;
  description: string;
  date: string;
  reference_id?: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  image?: string;
  date: string;
  location?: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: 'Normal' | 'High';
}

export interface Committee {
  id: string;
  name: string;
  position: string;
}
