// Dynamically detect API base URL. Uses environment variable VITE_API_URL in production,
// and defaults to the local proxy path '/api' in development.
const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function fetchHealth() {
  const response = await fetch(`${API_BASE}/health`);
  if (!response.ok) throw new Error('Backend health check failed');
  return response.json();
}

export async function classifyWasteItem(itemName) {
  const response = await fetch(`${API_BASE}/classify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ item: itemName })
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to classify item');
  }
  return response.json();
}

export async function fetchHistory() {
  const response = await fetch(`${API_BASE}/history`);
  if (!response.ok) throw new Error('Failed to retrieve scan history');
  return response.json();
}

export async function addHistoryRecord(record) {
  const response = await fetch(`${API_BASE}/history`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(record)
  });
  if (!response.ok) throw new Error('Failed to save manual history');
  return response.json();
}

export async function deleteHistoryRecord(id) {
  const response = await fetch(`${API_BASE}/history/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete history record');
  return response.json();
}

export async function fetchStatistics() {
  const response = await fetch(`${API_BASE}/statistics`);
  if (!response.ok) throw new Error('Failed to retrieve statistics');
  return response.json();
}

export async function fetchCollectionCenters(type = '') {
  const query = type ? `?type=${encodeURIComponent(type)}` : '';
  const response = await fetch(`${API_BASE}/centers${query}`);
  if (!response.ok) throw new Error('Failed to fetch collection centers');
  return response.json();
}

export async function resetDatabase() {
  const response = await fetch(`${API_BASE}/settings/reset`, {
    method: 'POST'
  });
  if (!response.ok) throw new Error('Failed to reset database');
  return response.json();
}
