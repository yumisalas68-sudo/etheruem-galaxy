import { getLogoUrl } from './logo-urls';

export interface Project {
  name: string;
  description: string;
  tags: string[];
  url: string;
  primaryTag: string;
  funding?: string;
  launchDate?: string;
  marketCap?: string;
  xFollowers?: number;
  status?: 'Live' | 'Launched' | 'Building' | 'Active';
  investors?: string[];
  xHandle?: string;
  logo?: string;
}

export function parseProjectsCSV(csvText: string): Project[] {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');

  const projects: Project[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);

    if (values.length >= 4) {
      const tags = values[2].split('|').map(tag => tag.trim());
      const primaryTag = tags[0];

      // Parse optional fields
      const funding = values[4] || undefined;
      const launchDate = values[5] || undefined;
      const marketCap = values[6] || undefined;
      const xFollowers = values[7] ? parseInt(values[7], 10) : undefined;
      const status = (values[8] as 'Live' | 'Launched' | 'Building' | 'Active') || undefined;
      const investors = values[9] ? values[9].split('|').map(inv => inv.trim()) : undefined;
      const xHandle = values[10] || undefined;
      // Get logo URL from GitHub-hosted mapping
      const logo = getLogoUrl(values[0]);

      projects.push({
        name: values[0],
        description: values[1],
        tags,
        url: values[3],
        primaryTag,
        funding,
        launchDate,
        marketCap,
        xFollowers,
        status,
        investors,
        xHandle,
        logo
      });
    }
  }

  return projects;
}

/**
 * Parse CSV and load logos from GitHub URLs
 */
export async function parseProjectsCSVWithLogos(csvText: string): Promise<Project[]> {


  const projects = parseProjectsCSV(csvText);



  const projectsWithLogos = projects.filter(p => p.logo).length;


  return projects;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}
