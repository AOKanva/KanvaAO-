
export type UserRole = 'USER' | 'ADMIN' | 'NONE';
export type DesignCategoryType = 'branding' | 'digital' | 'editorial';

export interface AccessKey {
  id: string;
  password: string;
  label: string;
  email?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: number;
  // Anti-abuse tracking
  usageCount: number;
  usageLimit: number;
  lastUsedAt?: number;
}

export interface KanvaCard {
  id: string;
  title: string;
  content: string;
  type: 'note' | 'idea' | 'task';
  createdAt: number;
  color: string;
  imageUrl?: string;
}

export interface KanvaDesign {
  id: string;
  prompt: string;
  imageUrl: string;
  style: string;
  category: DesignCategoryType;
  createdAt: number;
}

export enum AppState {
  LOCKED = 'LOCKED',
  USER_DASHBOARD = 'USER_DASHBOARD',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD'
}
