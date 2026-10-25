import blocks from './data/blocks.json'

// Swap this for a Firebase implementation later; keep the async signature.
export async function getStaticBlocks() {
  return blocks
}

// Foundation for future user-created blocks (needs a simple username login).
export function getUserBlocks(username) {
  try {
    return JSON.parse(localStorage.getItem(`textblock-user-${username}`)) || []
  } catch {
    return []
  }
}
