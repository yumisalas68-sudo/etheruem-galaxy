import { useState, useEffect, useCallback, useRef } from 'react';
import { Upload, X, Check, AlertCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
	storeLogo,
	getAllLogos,
	clearAllLogos,
	matchFilenameToProject,
} from '@/lib/logo-storage';
import type { Project } from '@/lib/csv-parser';

interface LogoUploadManagerProps {
	projects: Project[];
	onLogosUpdated: () => void;
	onClose: () => void;
}

interface UploadStatus {
	fileName: string;
	projectName: string | null;
	status: 'pending' | 'success' | 'failed' | 'skipped';
	error?: string;
}

export function LogoUploadManager({
	projects,
	onLogosUpdated,
	onClose,
}: LogoUploadManagerProps) {
	const [isDragging, setIsDragging] = useState(false);
	const [uploadStatuses, setUploadStatuses] = useState<UploadStatus[]>([]);
	const [isUploading, setIsUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [storedLogos, setStoredLogos] = useState<Record<string, string>>({});
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Load stored logos on mount
	useEffect(() => {
		loadStoredLogos();
	}, []);

	const loadStoredLogos = async () => {
		try {
			const logos = await getAllLogos();
			setStoredLogos(logos);
		} catch (error) {
			console.error('Failed to load stored logos:', error);
		}
	};

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	}, []);

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
	}, []);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			setIsDragging(false);

			const files = Array.from(e.dataTransfer.files).filter(file =>
				file.type.startsWith('image/')
			);

			if (files.length > 0) {
				processFiles(files);
			}
		},
		[projects]
	);

	const handleFileSelect = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const files = e.target.files
				? Array.from(e.target.files).filter(file =>
						file.type.startsWith('image/')
				  )
				: [];

			if (files.length > 0) {
				processFiles(files);
			}
		},
		[projects]
	);

	const processFiles = async (files: File[]) => {
		setIsUploading(true);
		setUploadProgress(0);

		const projectNames = projects.map(p => p.name);
		const statuses: UploadStatus[] = [];

		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			const projectName = matchFilenameToProject(file.name, projectNames);

			if (!projectName) {
				statuses.push({
					fileName: file.name,
					projectName: null,
					status: 'skipped',
					error: 'No matching project found',
				});
			} else {
				try {
					await storeLogo(projectName, file);
					statuses.push({
						fileName: file.name,
						projectName,
						status: 'success',
					});
				} catch (error) {
					statuses.push({
						fileName: file.name,
						projectName,
						status: 'failed',
						error: (error as Error).message,
					});
				}
			}

			setUploadProgress(((i + 1) / files.length) * 100);
		}

		setUploadStatuses(statuses);
		setIsUploading(false);

		// Reload stored logos
		await loadStoredLogos();

		// Notify parent component
		onLogosUpdated();
	};

	const handleClearAll = async () => {
		if (
			!confirm(
				'Are you sure you want to delete all uploaded logos? This cannot be undone.'
			)
		) {
			return;
		}

		try {
			await clearAllLogos();
			setStoredLogos({});
			setUploadStatuses([]);
			onLogosUpdated();
		} catch (error) {
			console.error('Failed to clear logos:', error);
			alert('Failed to clear logos: ' + (error as Error).message);
		}
	};

	const successCount = uploadStatuses.filter(s => s.status === 'success').length;
	const failedCount = uploadStatuses.filter(s => s.status === 'failed').length;
	const skippedCount = uploadStatuses.filter(s => s.status === 'skipped').length;
	const storedCount = Object.keys(storedLogos).length;

	return (
		<div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
			<Card className="w-full max-w-2xl bg-black/95 border-white/20 text-white max-h-[90vh] overflow-auto">
				<div className="p-6">
					{/* Header */}
					<div className="flex items-center justify-between mb-6">
						<div>
							<h2 className="text-2xl font-bold">Upload Project Logos</h2>
							<p className="text-gray-400 text-sm mt-1">
								Drag and drop or select logo files to upload
							</p>
						</div>
						<Button
							variant="ghost"
							size="icon"
							onClick={onClose}
							className="text-gray-400 hover:text-white"
						>
							<X className="h-5 w-5" />
						</Button>
					</div>

					{/* Storage Status */}
					{storedCount > 0 && (
						<div className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center justify-between">
							<div>
								<p className="text-green-400 font-semibold">
									{storedCount} logo{storedCount !== 1 ? 's' : ''} stored
								</p>
								<p className="text-gray-400 text-sm">
									Logos are saved in your browser and will persist across sessions
								</p>
							</div>
							<Button
								variant="ghost"
								size="sm"
								onClick={handleClearAll}
								className="text-red-400 hover:text-red-300"
							>
								<Trash2 className="h-4 w-4 mr-2" />
								Clear All
							</Button>
						</div>
					)}

					{/* Upload Area */}
					<div
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						onDrop={handleDrop}
						className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
							isDragging
								? 'border-blue-500 bg-blue-500/10'
								: 'border-white/20 hover:border-white/40'
						}`}
					>
						<Upload
							className={`h-12 w-12 mx-auto mb-4 ${
								isDragging ? 'text-blue-400' : 'text-gray-400'
							}`}
						/>
						<p className="text-lg font-semibold mb-2">
							{isDragging ? 'Drop files here' : 'Drag & drop logo files here'}
						</p>
						<p className="text-gray-400 text-sm mb-4">
							or click to browse
						</p>
						<Button
							onClick={() => fileInputRef.current?.click()}
							variant="outline"
							className="border-white/20 text-white hover:bg-white/10"
						>
							Select Files
						</Button>
						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							multiple
							onChange={handleFileSelect}
							className="hidden"
						/>
					</div>

					{/* Upload Progress */}
					{isUploading && (
						<div className="mt-6">
							<div className="flex items-center justify-between mb-2">
								<span className="text-sm text-gray-400">Uploading...</span>
								<span className="text-sm text-gray-400">
									{Math.round(uploadProgress)}%
								</span>
							</div>
							<Progress value={uploadProgress} className="h-2" />
						</div>
					)}

					{/* Upload Results */}
					{uploadStatuses.length > 0 && !isUploading && (
						<div className="mt-6">
							<div className="flex items-center justify-between mb-4">
								<h3 className="font-semibold">Upload Results</h3>
								<div className="flex gap-4 text-sm">
									{successCount > 0 && (
										<span className="text-green-400">
											✓ {successCount} success
										</span>
									)}
									{failedCount > 0 && (
										<span className="text-red-400">✗ {failedCount} failed</span>
									)}
									{skippedCount > 0 && (
										<span className="text-yellow-400">
											⊘ {skippedCount} skipped
										</span>
									)}
								</div>
							</div>

							<div className="space-y-2 max-h-64 overflow-y-auto">
								{uploadStatuses.map((status, idx) => (
									<div
										key={idx}
										className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
									>
										<div className="flex items-center gap-3 flex-1 min-w-0">
											{status.status === 'success' && (
												<Check className="h-4 w-4 text-green-400 flex-shrink-0" />
											)}
											{status.status === 'failed' && (
												<X className="h-4 w-4 text-red-400 flex-shrink-0" />
											)}
											{status.status === 'skipped' && (
												<AlertCircle className="h-4 w-4 text-yellow-400 flex-shrink-0" />
											)}

											<div className="flex-1 min-w-0">
												<p className="text-sm font-medium truncate">
													{status.fileName}
												</p>
												{status.projectName && (
													<p className="text-xs text-gray-400">
														→ {status.projectName}
													</p>
												)}
												{status.error && (
													<p className="text-xs text-red-400">{status.error}</p>
												)}
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Instructions */}
					<div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
						<h4 className="font-semibold text-blue-400 mb-2">
							💡 File Naming Tips
						</h4>
						<ul className="text-sm text-gray-300 space-y-1">
							<li>• Name files to match project names (e.g., "Uniswap.png")</li>
							<li>• Supports: PNG, JPG, SVG, WEBP, GIF</li>
							<li>• Case-insensitive, handles spaces/dashes/underscores</li>
							<li>
								• Examples: "uniswap.png", "the-graph.svg", "Aave_Protocol.jpg"
							</li>
						</ul>
					</div>
				</div>
			</Card>
		</div>
	);
}
