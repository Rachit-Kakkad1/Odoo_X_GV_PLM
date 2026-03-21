// ============================================================//
//  generateService.js — Smart ECO Description Generator API   //
//  Calls POST /api/generate/description                       //
// ============================================================//
import { API_BASE_URL } from '../config/api';
import { secureGet } from '../capacitor/nativeServices';

/**
 * Sends ECO + changes to backend, returns a professional description string.
 * @param {Object} eco  — ECO metadata (type, productName, priority, effectiveDate)
 * @param {Array}  changes — Array of { field, oldValue, newValue, type }
 * @returns {Promise<string>} Generated description text
 */
export const generateDescription = async (eco, changes) => {
  const token = await secureGet('token');
  const res = await fetch(`${API_BASE_URL}/generate/description`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ eco, changes })
  });

  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Generation failed');
  return data.data.description;
}
