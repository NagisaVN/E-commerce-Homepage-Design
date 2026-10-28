import fs from 'fs'
import path from 'path'

function getDbPath() {
  return path.join(process.cwd(), 'db.json')
}

export function readDatabase() {
  try {
    const raw = fs.readFileSync(getDbPath(), 'utf-8')
    const parsed = JSON.parse(raw)
    globalThis.__TECHZONE_DB__ = parsed
    return parsed
  } catch (err) {
    console.error('Lỗi đọc db.json:', err)
    if (globalThis.__TECHZONE_DB__) {
      return globalThis.__TECHZONE_DB__
    }
    return {}
  }
}

export function saveDatabase(data) {
  try {
    globalThis.__TECHZONE_DB__ = data
    fs.writeFileSync(getDbPath(), JSON.stringify(data, null, 2), 'utf-8')
    return true
  } catch (err) {
    console.warn('Lỗi ghi db.json:', err?.message)
    // Vẫn giữ trong RAM
    globalThis.__TECHZONE_DB__ = data
    return false
  }
}

/**
 * Chuyển đổi chuỗi tiếng Việt thành slug URL an toàn
 */
export function toSlug(str) {
  if (!str) return ''
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .trim()
}
