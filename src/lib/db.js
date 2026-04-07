import Dexie from 'dexie';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, eachDayOfInterval, differenceInDays } from 'date-fns';

export const db = new Dexie('blox');

db.version(1).stores({
  blocks: '++id, name, energy, isNonNegotiable, color',
  blockLogs: '++id, blockId, loggedAt'
});

// Add new block
export async function addBlock(block) {
  return await db.blocks.add(block);
}

// Delete block
export async function deleteBlock(blockId) {
  await db.blockLogs.where('blockId').equals(blockId).delete();
  return await db.blocks.delete(blockId);
}

// Update block
export async function updateBlock(blockId, updates) {
  return await db.blocks.update(blockId, updates);
}

// Get all blocks
export async function getAllBlocks() {
  return await db.blocks.toArray();
}

// Logging
export async function logBlock(blockId) {
  return await db.blockLogs.add({
    blockId,
    loggedAt: new Date()
  });
}

export async function deleteLog(logId) {
  return await db.blockLogs.delete(logId);
}

// Home screen
export async function getTodayCountPerBlock() {
  const start = startOfDay(new Date());
  const end = endOfDay(new Date());
  
  const logs = await db.blockLogs
    .where('loggedAt')
    .between(start, end, true, true)
    .toArray();
  
  const counts = {};
  logs.forEach(log => {
    counts[log.blockId] = (counts[log.blockId] || 0) + 1;
  });
  
  return counts;
}

export async function getNonNegotiableStatus() {
  const start = startOfDay(new Date());
  const end = endOfDay(new Date());
  
  const nonNegBlocks = await db.blocks
    .where('isNonNegotiable')
    .equals(1)
    .toArray();
  
  const logs = await db.blockLogs
    .where('loggedAt')
    .between(start, end, true, true)
    .toArray();
  
  const loggedBlockIds = new Set(logs.map(l => l.blockId));
  
  const status = {};
  nonNegBlocks.forEach(block => {
    status[block.id] = loggedBlockIds.has(block.id);
  });
  
  return status;
}

export async function getCurrentStreak() {
  const nonNegBlocks = await db.blocks
    .where('isNonNegotiable')
    .equals(1)
    .toArray();
  
  if (nonNegBlocks.length === 0) return 0;
  
  const nonNegIds = nonNegBlocks.map(b => b.id);
  
  // Only fetch logs from the last 90 days for performance
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  
  const recentLogs = await db.blockLogs
    .where('loggedAt')
    .above(ninetyDaysAgo)
    .toArray();
  
  let streak = 0;
  let currentDate = startOfDay(new Date());
  
  // Only check up to 90 days
  for (let i = 0; i < 90; i++) {
    const dayStart = startOfDay(currentDate);
    const dayEnd = endOfDay(currentDate);
    
    const dayLogs = recentLogs.filter(log => 
      log.loggedAt >= dayStart && log.loggedAt <= dayEnd
    );
    
    const loggedNonNegIds = new Set(
      dayLogs.filter(log => nonNegIds.includes(log.blockId)).map(log => log.blockId)
    );
    
    const allNonNegsLogged = nonNegIds.every(id => loggedNonNegIds.has(id));
    
    if (!allNonNegsLogged) break;
    
    streak++;
    currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
  }
  
  return streak;
}

export async function getTodayTotalCount() {
  const start = startOfDay(new Date());
  const end = endOfDay(new Date());
  
  return await db.blockLogs
    .where('loggedAt')
    .between(start, end, true, true)
    .count();
}

// Week screen
export async function getWeekCountPerDay(weekStart) {
  const start = startOfWeek(weekStart, { weekStartsOn: 1 });
  const end = endOfWeek(weekStart, { weekStartsOn: 1 });
  
  const days = eachDayOfInterval({ start, end });
  const logs = await db.blockLogs
    .where('loggedAt')
    .between(start, end, true, true)
    .toArray();
  
  return days.map(day => {
    const dayStart = startOfDay(day);
    const dayEnd = endOfDay(day);
    const count = logs.filter(log => log.loggedAt >= dayStart && log.loggedAt <= dayEnd).length;
    
    return {
      date: day.toISOString(),
      count
    };
  });
}

export async function getWeekCountPerBlock(weekStart) {
  const start = startOfWeek(weekStart, { weekStartsOn: 1 });
  const end = endOfWeek(weekStart, { weekStartsOn: 1 });
  
  const logs = await db.blockLogs
    .where('loggedAt')
    .between(start, end, true, true)
    .toArray();
  
  const counts = {};
  logs.forEach(log => {
    counts[log.blockId] = (counts[log.blockId] || 0) + 1;
  });
  
  return Object.entries(counts).map(([blockId, count]) => ({
    blockId: parseInt(blockId),
    count
  }));
}

export async function getNonNegWeekGrid(weekStart) {
  const start = startOfWeek(weekStart, { weekStartsOn: 1 });
  const end = endOfWeek(weekStart, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start, end });
  
  const nonNegBlocks = await db.blocks
    .where('isNonNegotiable')
    .equals(1)
    .toArray();
  
  const logs = await db.blockLogs
    .where('loggedAt')
    .between(start, end, true, true)
    .toArray();
  
  return nonNegBlocks.map(block => {
    const dayStatuses = days.map(day => {
      const dayStart = startOfDay(day);
      const dayEnd = endOfDay(day);
      return logs.some(log => 
        log.blockId === block.id && 
        log.loggedAt >= dayStart && 
        log.loggedAt <= dayEnd
      );
    });
    
    return {
      blockId: block.id,
      days: dayStatuses
    };
  });
}

// History
export async function getLogsGroupedByDate() {
  const allLogs = await db.blockLogs.orderBy('loggedAt').reverse().toArray();
  
  const grouped = {};
  
  allLogs.forEach(log => {
    const dateKey = startOfDay(log.loggedAt).toISOString();
    if (!grouped[dateKey]) {
      grouped[dateKey] = {
        date: dateKey,
        total: 0,
        entries: []
      };
    }
    grouped[dateKey].total++;
    grouped[dateKey].entries.push({
      id: log.id,
      blockId: log.blockId,
      loggedAt: log.loggedAt
    });
  });
  
  return Object.values(grouped);
}
