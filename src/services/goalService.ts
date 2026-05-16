import api from '../api/axios';

export type Goal = {
  id: number;
  name: string;
  description?: string | null;
  userId: number;
  type: number;
  typeName: string;
  scope: number;
  period: number;
  targetAmount: number;
  currentAmount: number;
  remainingAmount: number;
  progressPercentage: number;
  categoryId?: number | null;
  categoryName?: string | null;
  locationId?: number | null;
  locationName?: string | null;
  startDate: string;
  endDate?: string | null;
  daysRemaining?: number | null;
  alertPercentage: number;
  isActive: boolean;
  isFavorite: boolean;
  statusKey: string;
  statusLabel: string;
  riskLevel: number;
  createdAt: string;
  updatedAt?: string | null;
};

export type GoalSummary = {
  activeGoals: number;
  plannedSavings: number;
  savedAmount: number;
  riskGoals: number;
  projectedMonthlySpending: number;
  definedLimits: number;
  riskGoalsList: Goal[];
  upcomingGoals: Goal[];
};

export type GoalPayload = {
  name: string;
  description?: string | null;
  userId: number;
  type: number;
  scope: number;
  period: number;
  targetAmount: number;
  savedAmount: number;
  categoryId?: number | null;
  locationId?: number | null;
  startDate: string;
  endDate?: string | null;
  alertPercentage: number;
  isActive?: boolean;
};

export const goalService = {
  async list(userId: number, params?: { search?: string; type?: string; status?: string; orderBy?: string }) {
    const response = await api.get<Goal[]>(`/goals/user/${userId}`, { params });
    return response.data;
  },

  async summary(userId: number) {
    const response = await api.get<GoalSummary>(`/goals/user/${userId}/summary`);
    return response.data;
  },

  async create(payload: GoalPayload) {
    const response = await api.post<Goal>('/goals', payload);
    return response.data;
  },

  async update(id: number, payload: GoalPayload) {
    const response = await api.put<Goal>(`/goals/${id}`, payload);
    return response.data;
  },

  async remove(id: number) {
    await api.delete(`/goals/${id}`);
  },

  async toggleFavorite(id: number) {
    await api.patch(`/goals/${id}/favorite`);
  }
};
