import { demoAgents, demoUserProfile } from '../data/demoData';
import { Agent, UserProfile } from '../types';

let agentsStore: Agent[] = [...demoAgents];
let userProfileStore: UserProfile = { ...demoUserProfile };

export async function getAgents(): Promise<Agent[]> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return [...agentsStore];
}

export async function getCurrentUser(): Promise<UserProfile> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return { ...userProfileStore };
}

export async function updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
  await new Promise(resolve => setTimeout(resolve, 100));
  userProfileStore = {
    ...userProfileStore,
    ...updates
  };
  return { ...userProfileStore };
}
