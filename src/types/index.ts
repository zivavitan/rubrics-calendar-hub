
export type RubricType = 
  | "Primary On-Call" 
  | "Secondary On-Call" 
  | "Operations" 
  | "Support" 
  | "Maintenance";

export type RubricColor = {
  [key in RubricType]: string;
};

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "user";
}

export interface Duty {
  id: string;
  userId: string;
  type: RubricType;
  date: string; // ISO format: YYYY-MM-DD
}

export interface DutyWithUser extends Duty {
  user: User;
}
