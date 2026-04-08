import { db, getTodayCountPerBlock, getNonNegotiableStatus, getCurrentStreak, logBlock as dbLogBlock } from './db.js';
import { seedIfNeeded } from './seed.js';

let blocks = $state([]);
let todayCounts = $state({});
let nonNegStatus = $state({});
let streak = $state(0);

let todayTotal = $derived(
  Object.values(todayCounts).reduce((a, b) => a + b, 0)
);

let deepWorkMinutes = $derived(todayTotal * 30);

let toastMessage = $state('');
let toastVisible = $state(false);

export async function init() {
  await seedIfNeeded();
  blocks = await db.blocks.toArray();
  todayCounts = await getTodayCountPerBlock();
  nonNegStatus = await getNonNegotiableStatus();
  
  // Load streak in background - it's not critical for initial render
  getCurrentStreak().then(s => {
    streak = s;
  });
}

export async function logBlock(blockId) {
  const previousCount = todayCounts[blockId] || 0;
  todayCounts = { ...todayCounts, [blockId]: previousCount + 1 };
  
  if (nonNegStatus[blockId] === false) {
    nonNegStatus = { ...nonNegStatus, [blockId]: true };
  }
  
  try {
    await dbLogBlock(blockId);
    streak = await getCurrentStreak();
  } catch (error) {
    todayCounts = { ...todayCounts, [blockId]: previousCount };
    showToast('Failed to log block');
  }
}

export async function refresh() {
  todayCounts = await getTodayCountPerBlock();
  nonNegStatus = await getNonNegotiableStatus();
  streak = await getCurrentStreak();
}

function showToast(message) {
  toastMessage = message;
  toastVisible = true;
  setTimeout(() => {
    toastVisible = false;
  }, 3000);
}

export function getBlocks() {
  return blocks;
}

export function getTodayCounts() {
  return todayCounts;
}

export function getNonNegStatus() {
  return nonNegStatus;
}

export function getStreak() {
  return streak;
}

export function getTodayTotal() {
  return todayTotal;
}

export function getDeepWorkMinutes() {
  return deepWorkMinutes;
}

export function getToast() {
  return { message: toastMessage, visible: toastVisible };
}

export async function updateBlock(blockId, updates) {
  await db.blocks.update(blockId, updates);
  blocks = await db.blocks.toArray();
  
  // Refresh non-neg status if that changed
  if ('isNonNegotiable' in updates) {
    nonNegStatus = await getNonNegotiableStatus();
  }
}

export async function deleteBlock(blockId) {
  await db.blockLogs.where('blockId').equals(blockId).delete();
  await db.blocks.delete(blockId);
  blocks = await db.blocks.toArray();
  
  // Refresh counts and status
  todayCounts = await getTodayCountPerBlock();
  nonNegStatus = await getNonNegotiableStatus();
  streak = await getCurrentStreak();
}
