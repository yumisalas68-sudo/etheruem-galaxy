/**
 * Logo URL mappings for Ethereum ecosystem projects
 *
 * These logos are hosted on GitHub and loaded directly via URLs.
 * This ensures cross-browser compatibility and persistence.
 */

// GitHub raw content base URL
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/yeziR4/Kokoro-TTS-API/main';

/**
 * Mapping of project names to their logo URLs
 *
 * Format: { "Project Name": "logo-filename.webp" }
 */
export const LOGO_URL_MAP: Record<string, string> = {
  // Direct GitHub-hosted logos
  "Aethir": `${GITHUB_RAW_BASE}/Aethir.webp`,
  "AltLayer": `${GITHUB_RAW_BASE}/AltLayer.webp`,
  "Aurory": `${GITHUB_RAW_BASE}/Aurory.webp`,
  "Big Time": `${GITHUB_RAW_BASE}/Big_Time.webp`,
  "Blast": `${GITHUB_RAW_BASE}/Blast.webp`,
  "Blur": `${GITHUB_RAW_BASE}/Blur.webp`,
  "Bubblemaps": `${GITHUB_RAW_BASE}/Bubblemaps.webp`,
  "Eclipse": `${GITHUB_RAW_BASE}/Eclipse.webp`,

  // New project logos added
  "EigenCloud": `${GITHUB_RAW_BASE}/EigenCloud.webp`,
  "Ethena": `${GITHUB_RAW_BASE}/Ethena.webp`,
  "Galxe": `${GITHUB_RAW_BASE}/Galxe.webp`,
  "Hop Protocol": `${GITHUB_RAW_BASE}/Hop_Protocol.webp`,
  "LFJ": `${GITHUB_RAW_BASE}/LFJ.webp`,
  "LooksRare": `${GITHUB_RAW_BASE}/LooksRare.webp`,
  "Loot": `${GITHUB_RAW_BASE}/Loot.webp`,
  "Manifold": `${GITHUB_RAW_BASE}/Manifold.webp`,
  "OlympusDAO": `${GITHUB_RAW_BASE}/OlympusDAO.webp`,
  "Parallel": `${GITHUB_RAW_BASE}/Parallel.webp`,
  "Particle Network": `${GITHUB_RAW_BASE}/Particle_Network.webp`,
  "Pendle": `${GITHUB_RAW_BASE}/Pendle.webp`,
  "Pudgy Penguins": `${GITHUB_RAW_BASE}/Pudgy_Penguins.webp`,
  "Puffer Finance": `${GITHUB_RAW_BASE}/Puffer_Finance.webp`,
  "Ribbon Finance": `${GITHUB_RAW_BASE}/Ribbon_Finance.webp`,
  "Ronin": `${GITHUB_RAW_BASE}/Ronin.webp`,
  "Superstate": `${GITHUB_RAW_BASE}/Superstate.webp`,
  "Taiko": `${GITHUB_RAW_BASE}/Taiko.webp`,
  "Unichain": `${GITHUB_RAW_BASE}/Unichain.webp`,

  // Additional project logos (PNG and ICO formats)
  "DefiLlama": `${GITHUB_RAW_BASE}/DefiLlama.png`,
  "Bored Ape Yacht Club": `${GITHUB_RAW_BASE}/Bored_Ape_Yacht_Club.png`,
  "Scroll": `${GITHUB_RAW_BASE}/Scroll.png`,
  "OpenSea": `${GITHUB_RAW_BASE}/OpenSea.png`,
  "Ondo Finance": `${GITHUB_RAW_BASE}/Ondo_Finance.ico`,
  "Maple Finance": `${GITHUB_RAW_BASE}/Maple_Finance.ico`,
};

/**
 * Get logo URL for a project by name
 * @param projectName - The name of the project
 * @returns Logo URL if available, undefined otherwise
 */
export function getLogoUrl(projectName: string): string | undefined {
  return LOGO_URL_MAP[projectName];
}

/**
 * Check if a project has a logo URL configured
 * @param projectName - The name of the project
 * @returns True if logo URL exists
 */
export function hasLogoUrl(projectName: string): boolean {
  return projectName in LOGO_URL_MAP;
}

/**
 * Get all available project names with logos
 * @returns Array of project names that have logo URLs
 */
export function getProjectsWithLogos(): string[] {
  return Object.keys(LOGO_URL_MAP);
}
