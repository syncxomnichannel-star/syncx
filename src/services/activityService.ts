import { demoActivities } from '../data/demoData';
import { ActivityItem } from '../types';

let activitiesStore: ActivityItem[] = [...demoActivities];

export async function getActivities(): Promise<ActivityItem[]> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return [...activitiesStore];
}

export async function logActivity(
  activityInput: Omit<ActivityItem, 'id' | 'time'>
): Promise<ActivityItem> {
  const newActivity: ActivityItem = {
    ...activityInput,
    id: `act-${Date.now()}`,
    time: 'Just now'
  };

  activitiesStore = [newActivity, ...activitiesStore];
  return { ...newActivity };
}
