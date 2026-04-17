import { useState } from 'react';
import { Search, RotateCcw, Zap, Sun, Moon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { type Project } from '@/lib/csv-parser';

interface UIOverlayProps {
  projects: Project[];
  visibleTags: Set<string>;
  onTagsChange: (tags: Set<string>) => void;
  onProjectSearch: (project: Project | null) => void;
  isPaused: boolean;

  speedMultiplier: number;
  onSpeedChange: (speed: number) => void;
  onReset: () => void;
  theme: 'dark' | 'silk';
  onThemeToggle: () => void;
}

const TAG_CATEGORIES = [
  'All',
  'Layer2',
  'DeFi',
  'NFT',
  'Infrastructure',
  'Gaming',
  'RWA',
  'Bridge',
  'ZK',
  'DePIN',
  'Data & Analysis'
];

const TAG_COLORS: Record<string, string> = {
  Layer2: 'bg-blue-500',
  DeFi: 'bg-purple-500',
  NFT: 'bg-pink-500',
  Infrastructure: 'bg-green-500',
  Gaming: 'bg-orange-500',
  RWA: 'bg-red-500',
  Bridge: 'bg-cyan-500',
  ZK: 'bg-indigo-500',
  DePIN: 'bg-yellow-500',
  'Data & Analysis': 'bg-teal-500'
};

export function UIOverlay({
  projects,
  visibleTags,
  onTagsChange,
  onProjectSearch,
  isPaused,

  speedMultiplier,
  onSpeedChange,
  onReset,
  theme,
  onThemeToggle
}: UIOverlayProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const visibleProjectCount = projects.filter(p =>
    visibleTags.has('All') || p.tags.some(tag => visibleTags.has(tag))
  ).length;

  const handleTagToggle = (tag: string) => {
    const newTags = new Set(visibleTags);

    if (tag === 'All') {
      newTags.clear();
      newTags.add('All');
    } else {
      newTags.delete('All');
      if (newTags.has(tag)) {
        newTags.delete(tag);
      } else {
        newTags.add(tag);
      }
      if (newTags.size === 0) {
        newTags.add('All');
      }
    }

    onTagsChange(newTags);
  };

  const handleProjectSelect = (project: Project) => {
    setSearchQuery('');
    setShowSuggestions(false);
    onProjectSearch(project);
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top bar */}
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-4 pointer-events-auto">
        {/* Title */}
        <Card className={`${theme === 'silk' ? 'bg-[#F0F2F9]/90 border-[#627EEA]/30' : 'bg-black/80 border-white/20'} px-4 py-3 backdrop-blur-md shadow-xl transition-all`}>
          <h1 className={`text-2xl font-bold ${theme === 'silk' ? 'text-[#627EEA]' : 'text-white'}`}>Ethereum Ecosystem Galaxy</h1>
          <p className={`text-sm ${theme === 'silk' ? 'text-slate-600' : 'text-gray-300'}`}>Explore {projects.length} projects across the cosmos</p>
        </Card>

        {/* Controls */}
        <Card className={`${theme === 'silk' ? 'bg-[#F0F2F9]/90 border-[#627EEA]/30' : 'bg-black/80 border-white/20'} px-4 py-3 backdrop-blur-md shadow-xl transition-all`}>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onThemeToggle}
              className={`gap-2 mr-2 ${theme === 'silk' ? 'border-[#627EEA]/30 text-[#627EEA] hover:bg-[#627EEA]/10' : 'border-white/20 text-white'}`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {theme === 'dark' ? 'Silk Mode' : 'Dark Mode'}
            </Button>


            <div className={`flex items-center gap-1 border-l ${theme === 'silk' ? 'border-slate-300' : 'border-white/20'} pl-2 ml-2`}>
              <Zap className={`w-4 h-4 ${theme === 'silk' ? 'text-[#627EEA]' : 'text-white'}`} />
              {[1, 5, 10].map((speed) => (
                <Button
                  key={speed}
                  size="sm"
                  variant={speedMultiplier === speed ? 'default' : 'outline'}
                  onClick={() => onSpeedChange(speed)}
                  className="min-w-12"
                >
                  {speed}x
                </Button>
              ))}
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={onReset}
              className={`gap-2 ml-2 border-l ${theme === 'silk' ? 'border-slate-300 text-slate-800 hover:bg-[#627EEA]/10' : 'border-white/20 text-white'}`}
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>
        </Card>
      </div>

      {/* Search */}
      <div className="absolute top-28 left-4 w-80 pointer-events-auto">
        <Card className={`${theme === 'silk' ? 'bg-[#F0F2F9]/90 border-[#627EEA]/30' : 'bg-black/80 border-white/20'} p-3 backdrop-blur-md shadow-xl transition-all`}>
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${theme === 'silk' ? 'text-[#627EEA]' : 'text-gray-400'}`} />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(e.target.value.length > 0);
              }}
              onFocus={() => setShowSuggestions(searchQuery.length > 0)}
              className={`pl-10 ${theme === 'silk' ? 'bg-white border-[#627EEA]/20 text-slate-900 placeholder:text-slate-400' : 'bg-white/10 border-white/20 text-white placeholder:text-gray-400'}`}
            />
          </div>

          {showSuggestions && (
            <div className="mt-2 max-h-64 overflow-y-auto space-y-1">
              {filteredProjects.length > 0 ? (
                filteredProjects.slice(0, 10).map((project) => (
                  <button
                    key={project.name}
                    onClick={() => handleProjectSelect(project)}
                    className={`w-full text-left px-3 py-2 rounded ${theme === 'silk' ? 'hover:bg-[#627EEA]/10 text-slate-800' : 'hover:bg-white/10 text-white'} text-sm transition-colors`}
                  >
                    <div className="font-medium">{project.name}</div>
                    <div className={`text-xs ${theme === 'silk' ? 'text-[#627EEA]/70' : 'text-gray-400'}`}>{project.primaryTag}</div>
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-gray-400 text-center">
                  No projects found matching "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* Tag filters */}
      <div className="absolute bottom-4 left-4 right-4 pointer-events-auto">
        <Card className={`${theme === 'silk' ? 'bg-[#F0F2F9]/90 border-[#627EEA]/30' : 'bg-black/80 border-white/20'} p-4 backdrop-blur-md shadow-xl transition-all`}>
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-300 mr-2 self-center">Filter:</span>
            {TAG_CATEGORIES.map((tag) => (
              <Badge
                key={tag}
                variant={visibleTags.has(tag) ? 'default' : 'outline'}
                className={`cursor-pointer transition-all ${
                  visibleTags.has(tag)
                    ? `${TAG_COLORS[tag] || 'bg-gray-500'} text-white border-transparent`
                    : `${theme === 'silk' ? 'bg-white border-[#627EEA]/30 text-slate-700 hover:bg-[#627EEA]/10' : 'bg-transparent border-white/30 text-white hover:bg-white/10'}`
                }`}
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </Card>
      </div>



      {/* Keyboard shortcuts hint */}
      <div className="absolute bottom-4 right-4 pointer-events-auto">
        <Card className={`${theme === 'silk' ? 'bg-[#F0F2F9]/90 border-[#627EEA]/30' : 'bg-black/80 border-white/20'} px-3 py-2 backdrop-blur-md`}>
          <div className={`text-xs ${theme === 'silk' ? 'text-slate-600' : 'text-gray-300'} space-y-1`}>

            <div><kbd className={`px-1 ${theme === 'silk' ? 'bg-slate-200' : 'bg-white/20'} rounded`}>R</kbd> Reset</div>
            <div><kbd className={`px-1 ${theme === 'silk' ? 'bg-slate-200' : 'bg-white/20'} rounded`}>F</kbd> Follow</div>
            <div><kbd className={`px-1 ${theme === 'silk' ? 'bg-slate-200' : 'bg-white/20'} rounded`}>1-5</kbd> Jump to rings</div>
          </div>
        </Card>
      </div>
    </div>
  );
}
