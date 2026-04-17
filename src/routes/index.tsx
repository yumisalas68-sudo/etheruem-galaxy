import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { EthereumGalaxy } from "@/components/EthereumGalaxy";
import { UIOverlay } from "@/components/UIOverlay";
import { ProjectDetailPanel } from "@/components/ProjectDetailPanel";
import { Button } from "@/components/ui/button";
import { parseProjectsCSVWithLogos, type Project } from "@/lib/csv-parser";
import csvData from "@/data/ethereum-galaxy-final.csv?raw";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	const [projects, setProjects] = useState<Project[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedProject, setSelectedProject] = useState<Project | null>(null);
	const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
	const [isPaused, setIsPaused] = useState(true);
	const [speedMultiplier, setSpeedMultiplier] = useState(1);
	const [visibleTags, setVisibleTags] = useState<Set<string>>(new Set(['All']));
	const [followMode, setFollowMode] = useState(false);
	const [statusFilter, setStatusFilter] = useState<string | null>(null);
	const [investorFilter, setInvestorFilter] = useState<string | null>(null);
	const [theme, setTheme] = useState<'dark' | 'silk'>('dark');

	// Load projects from CSV
	const loadProjects = useCallback(async () => {
		try {



			const data = await parseProjectsCSVWithLogos(csvData);






			// Debug logo loading
			const projectsWithLogos = data.filter((p: Project) => p.logo);



			// Show all project names that have logos


			// Store globally for debugging
			(window as any).ethereumProjects = data;

			setProjects(data);
		} catch (error) {
			console.error('❌ DATA LOAD FAILED:', error);
			alert('Failed to load project data: ' + (error as Error).message);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadProjects();
	}, [loadProjects]);

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Ignore if typing in an input
			if (e.target instanceof HTMLInputElement) return;

			switch (e.key) {

				case 'Escape':
					setSelectedProject(null);
					setFollowMode(false);
					break;
				case 'r':
				case 'R':
					handleReset();
					break;
				case 'f':
				case 'F':
					setFollowMode(prev => !prev);
					break;
				case '1':
				case '2':
				case '3':
				case '4':
				case '5':
					// Jump to ring functionality could be implemented here
					break;
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, []);

	const handleReset = useCallback(() => {
		setSelectedProject(null);
		setHoveredProject(null);
		setIsPaused(true);
		setSpeedMultiplier(1);
		setFollowMode(false);
		setStatusFilter(null);
		setInvestorFilter(null);
		setVisibleTags(new Set(['All']));
	}, []);

	const handleProjectSearch = useCallback((project: Project | null) => {
		setSelectedProject(project);
		if (project) {
			setFollowMode(true);
			// Ensure the selected project is visible by updating tag filters
			// Add the project's tags to visible tags if not already visible
			setVisibleTags(prevTags => {
				// If "All" is selected, project is already visible
				if (prevTags.has('All')) return prevTags;

				// Check if any of the project's tags are currently visible
				const isVisible = project.tags.some(tag => prevTags.has(tag));

				// If not visible, add the primary tag to make it visible
				if (!isVisible) {
					const newTags = new Set(prevTags);
					newTags.add(project.primaryTag);
					return newTags;
				}

				return prevTags;
			});
		}
	}, []);

	// Filter projects based on status and investor
	const filteredProjects = projects.filter(project => {
		// Apply status filter
		if (statusFilter && project.status !== statusFilter) {
			return false;
		}

		// Apply investor filter
		if (investorFilter && (!project.investors || !project.investors.includes(investorFilter))) {
			return false;
		}

		return true;
	});

	// Log filtered projects stats
	useEffect(() => {
		if (filteredProjects.length > 0) {
			const filteredWithLogos = filteredProjects.filter(p => p.logo).length;

		}
	}, [filteredProjects, statusFilter, investorFilter]);

	const handleFilterByStatus = useCallback((status: string) => {
		setStatusFilter(status);
		setInvestorFilter(null); // Clear investor filter when filtering by status
		setVisibleTags(new Set(['All'])); // Show all tags
		setSelectedProject(null); // Close detail panel
		setFollowMode(false);
	}, []);

	const handleFilterByInvestor = useCallback((investor: string) => {
		setInvestorFilter(investor);
		setStatusFilter(null); // Clear status filter when filtering by investor
		setVisibleTags(new Set(['All'])); // Show all tags
		setSelectedProject(null); // Close detail panel
		setFollowMode(false);
	}, []);

	if (loading) {
		return (
			<div className="w-full h-screen bg-black flex items-center justify-center">
				<div className="text-white text-2xl">Loading Ethereum Ecosystem...</div>
			</div>
		);
	}

	return (
		<div className={`w-full h-screen ${theme === 'dark' ? 'bg-black' : 'bg-[#F0F2F9]'} relative overflow-hidden transition-colors duration-500`}>
			<EthereumGalaxy
				projects={filteredProjects}
				selectedProject={selectedProject}
				hoveredProject={hoveredProject}
				onProjectSelect={setSelectedProject}
				onProjectHover={setHoveredProject}
				isPaused={isPaused}
				speedMultiplier={speedMultiplier}
				visibleTags={visibleTags}
				followMode={followMode}
				theme={theme}
			/>

			<UIOverlay
				projects={filteredProjects}
				visibleTags={visibleTags}
				onTagsChange={setVisibleTags}
				onProjectSearch={handleProjectSearch}
				isPaused={isPaused}
				speedMultiplier={speedMultiplier}
				onSpeedChange={setSpeedMultiplier}
				onReset={handleReset}
				theme={theme}
				onThemeToggle={() => setTheme(prev => prev === 'dark' ? 'silk' : 'dark')}
			/>

			<ProjectDetailPanel
				project={hoveredProject || selectedProject}
				onClose={() => {
					setSelectedProject(null);
					setFollowMode(false);
				}}
				onFilterByStatus={handleFilterByStatus}
				onFilterByInvestor={handleFilterByInvestor}
			/>

			{/* Active Filters Display */}
			{(statusFilter || investorFilter) && (
				<div className="absolute top-20 left-4 bg-black/90 border border-white/20 rounded-lg p-4 backdrop-blur-md pointer-events-auto">
					<div className="flex items-center gap-2 mb-2">
						<span className="text-gray-300 text-sm font-semibold">Active Filter:</span>
					</div>
					{statusFilter && (
						<div className="flex items-center gap-2 mb-2">
							<span className="text-white text-sm">Status: <span className="font-bold text-green-400">{statusFilter}</span></span>
							<Button
								size="sm"
								variant="ghost"
								onClick={() => setStatusFilter(null)}
								className="h-6 px-2 text-gray-400 hover:text-white"
							>
								Clear
							</Button>
						</div>
					)}
					{investorFilter && (
						<div className="flex items-center gap-2 mb-2">
							<span className="text-white text-sm">Investor: <span className="font-bold text-orange-400">{investorFilter}</span></span>
							<Button
								size="sm"
								variant="ghost"
								onClick={() => setInvestorFilter(null)}
								className="h-6 px-2 text-gray-400 hover:text-white"
							>
								Clear
							</Button>
						</div>
					)}
					<div className="text-gray-400 text-xs">
						Showing {filteredProjects.length} of {projects.length} projects
					</div>
				</div>
			)}
		</div>
	);
}
