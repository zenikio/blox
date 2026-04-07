import { db } from './db.js';

const SEED_DATA = [
  { name: 'Build', energy: 'high', color: '#6366f1', isNonNegotiable: true },
  { name: 'Producer Outreach', energy: 'medium', color: '#f59e0b', isNonNegotiable: true },
  { name: 'Supply', energy: 'medium', color: '#10b981', isNonNegotiable: true },
  { name: 'Audit', energy: 'high', color: '#3b82f6', isNonNegotiable: false },
  { name: 'Refactor', energy: 'high', color: '#8b5cf6', isNonNegotiable: false },
  { name: 'Social', energy: 'medium', color: '#ec4899', isNonNegotiable: false },
  { name: 'Copy', energy: 'high', color: '#f97316', isNonNegotiable: false },
  { name: 'Positioning', energy: 'high', color: '#14b8a6', isNonNegotiable: false },
  { name: 'Institute Outreach', energy: 'medium', color: '#64748b', isNonNegotiable: false },
  { name: 'Advertiser Outreach', energy: 'low', color: '#a78bfa', isNonNegotiable: false },
  { name: 'Numbers', energy: 'low', color: '#06b6d4', isNonNegotiable: false },
  { name: 'Design', energy: 'low', color: '#f43f5e', isNonNegotiable: false },
  { name: 'Learn & Strategize', energy: 'medium', color: '#84cc16', isNonNegotiable: false }
];

export async function seedIfNeeded() {
  const count = await db.blocks.count();
  
  if (count === 0) {
    await db.blocks.bulkAdd(SEED_DATA);
  }
}
