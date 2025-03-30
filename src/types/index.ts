
export type RubricType = string;

export type RubricColor = {
  [key: string]: string;
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
