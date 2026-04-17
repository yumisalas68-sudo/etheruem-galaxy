/**
 * IndexedDB utility for storing and retrieving project logos
 */

const DB_NAME = 'ethereum-galaxy-db';
const STORE_NAME = 'logos';
const DB_VERSION = 1;

interface StoredLogo {
	projectName: string;
	imageData: string; // base64 encoded image
	fileName: string;
	mimeType: string;
	uploadedAt: number;
}

/**
 * Initialize IndexedDB database
 */
function openDatabase(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);

		request.onerror = () => reject(request.error);
		request.onsuccess = () => resolve(request.result);

		request.onupgradeneeded = (event) => {
			const db = (event.target as IDBOpenDBRequest).result;

			// Create object store if it doesn't exist
			if (!db.objectStoreNames.contains(STORE_NAME)) {
				db.createObjectStore(STORE_NAME, { keyPath: 'projectName' });
			}
		};
	});
}

/**
 * Store a logo in IndexedDB
 */
export async function storeLogo(
	projectName: string,
	file: File
): Promise<void> {
	const db = await openDatabase();

	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = () => {
			const imageData = reader.result as string;

			const logo: StoredLogo = {
				projectName,
				imageData,
				fileName: file.name,
				mimeType: file.type,
				uploadedAt: Date.now(),
			};

			const transaction = db.transaction(STORE_NAME, 'readwrite');
			const store = transaction.objectStore(STORE_NAME);
			const request = store.put(logo);

			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.error);
		};

		reader.onerror = () => reject(reader.error);
		reader.readAsDataURL(file);
	});
}

/**
 * Get a logo from IndexedDB
 */
export async function getLogo(projectName: string): Promise<string | null> {
	const db = await openDatabase();

	return new Promise((resolve, reject) => {
		const transaction = db.transaction(STORE_NAME, 'readonly');
		const store = transaction.objectStore(STORE_NAME);
		const request = store.get(projectName);

		request.onsuccess = () => {
			const result = request.result as StoredLogo | undefined;
			resolve(result?.imageData || null);
		};

		request.onerror = () => reject(request.error);
	});
}

/**
 * Get all stored logos
 */
export async function getAllLogos(): Promise<Record<string, string>> {
	const db = await openDatabase();

	return new Promise((resolve, reject) => {
		const transaction = db.transaction(STORE_NAME, 'readonly');
		const store = transaction.objectStore(STORE_NAME);
		const request = store.getAll();

		request.onsuccess = () => {
			const logos = request.result as StoredLogo[];
			const logoMap: Record<string, string> = {};

			for (const logo of logos) {
				logoMap[logo.projectName] = logo.imageData;
			}

			resolve(logoMap);
		};

		request.onerror = () => reject(request.error);
	});
}

/**
 * Delete a logo from IndexedDB
 */
export async function deleteLogo(projectName: string): Promise<void> {
	const db = await openDatabase();

	return new Promise((resolve, reject) => {
		const transaction = db.transaction(STORE_NAME, 'readwrite');
		const store = transaction.objectStore(STORE_NAME);
		const request = store.delete(projectName);

		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);
	});
}

/**
 * Clear all logos from IndexedDB
 */
export async function clearAllLogos(): Promise<void> {
	const db = await openDatabase();

	return new Promise((resolve, reject) => {
		const transaction = db.transaction(STORE_NAME, 'readwrite');
		const store = transaction.objectStore(STORE_NAME);
		const request = store.clear();

		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);
	});
}

/**
 * Match filename to project name
 * Handles various naming conventions:
 * - exact match: "Uniswap.png" -> "Uniswap"
 * - lowercase: "uniswap.png" -> "Uniswap"
 * - with spaces: "The Graph.png" -> "The Graph"
 * - with dashes/underscores: "the-graph.png" -> "The Graph"
 */
export function matchFilenameToProject(
	fileName: string,
	projectNames: string[]
): string | null {
	// Remove file extension
	const nameWithoutExt = fileName.replace(/\.(png|jpg|jpeg|svg|webp|gif)$/i, '');

	// Try exact match (case-insensitive)
	const exactMatch = projectNames.find(
		p => p.toLowerCase() === nameWithoutExt.toLowerCase()
	);
	if (exactMatch) return exactMatch;

	// Try with spaces replaced by dashes/underscores
	const nameWithSpaces = nameWithoutExt.replace(/[-_]/g, ' ');
	const spaceMatch = projectNames.find(
		p => p.toLowerCase() === nameWithSpaces.toLowerCase()
	);
	if (spaceMatch) return spaceMatch;

	// Try partial match (filename contains project name or vice versa)
	const partialMatch = projectNames.find(p => {
		const pLower = p.toLowerCase();
		const fLower = nameWithoutExt.toLowerCase();
		return pLower.includes(fLower) || fLower.includes(pLower);
	});

	return partialMatch || null;
}
