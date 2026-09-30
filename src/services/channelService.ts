import { demoChannels } from '../data/demoData';
import { ChannelItem } from '../types';

let channelsStore: ChannelItem[] = JSON.parse(JSON.stringify(demoChannels));

export async function getChannels(): Promise<ChannelItem[]> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return JSON.parse(JSON.stringify(channelsStore));
}

export async function updateChannel(
  id: string,
  updates: Partial<ChannelItem>
): Promise<ChannelItem> {
  const index = channelsStore.findIndex(c => c.id === id);
  if (index === -1) {
    throw new Error(`Channel ${id} not found.`);
  }

  channelsStore[index] = {
    ...channelsStore[index],
    ...updates
  };

  return { ...channelsStore[index] };
}
