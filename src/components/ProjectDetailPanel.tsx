import { X as CloseIcon, ExternalLink, Globe, DollarSign, Calendar, TrendingUp, Users, Building2, Handshake, Twitter, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { type Project } from '@/lib/csv-parser';
import { getRingConfig } from '@/lib/ring-config';
import { useState, useEffect } from 'react';

interface ProjectDetailPanelProps {
  project: Project | null;
  onClose: () => void;
  onFilterByStatus?: (status: string) => void;
  onFilterByInvestor?: (investor: string) => void;
  theme?: 'dark' | 'silk';
}

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

export function ProjectDetailPanel({ project, onClose, onFilterByStatus, onFilterByInvestor, theme = 'dark' }: ProjectDetailPanelProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Reset image states when project changes
  useEffect(() => {
    setImageError(false);
    setImageLoading(true);
  }, [project?.name]);

  if (!project) return null;

  const ringConfig = getRingConfig(project.primaryTag);

  return (
    <div className="absolute inset-y-0 right-0 w-96 pointer-events-auto">
      <Card className={`h-full ${theme === 'silk' ? 'bg-[#F0F2F9]/95 border-l border-[#627EEA]/20' : 'bg-black/90 border-l border-white/20'} rounded-none backdrop-blur-md flex flex-col shadow-2xl`}>
        {/* Header */}
        <div
          className={`p-6 border-b ${theme === 'silk' ? 'border-[#627EEA]/20' : 'border-white/20'}`}
          style={{
            background: `linear-gradient(to bottom, ${ringConfig.color}20, transparent)`
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4 flex-1">
              {project.logo && !imageError && (
                <div className="flex-shrink-0 relative">
                  {imageLoading && (
                    <div className={`absolute inset-0 flex items-center justify-center w-16 h-16 rounded-lg border ${theme === 'silk' ? 'border-[#627EEA]/20 bg-white' : 'border-white/20 bg-white/5'}`}>
                      <ImageIcon className={`w-8 h-8 ${theme === 'silk' ? 'text-[#627EEA]/30' : 'text-white/30'} animate-pulse`} />
                    </div>
                  )}
                  <img
                    src={project.logo}
                    alt={`${project.name} logo`}
                    className={`w-16 h-16 rounded-lg border ${theme === 'silk' ? 'border-[#627EEA]/20 bg-white' : 'border-white/20 bg-white/5'} object-cover`}
                    loading="eager"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      console.error(`❌ Failed to load logo for ${project.name}:`, project.logo);
                      setImageError(true);
                      setImageLoading(false);
                    }}
                    onLoad={() => {
                      console.log(`✅ Successfully loaded logo for ${project.name}`);
                      setImageLoading(false);
                    }}
                  />
                </div>
              )}
              <div className="flex-1">
                <h2 className={`text-2xl font-bold ${theme === 'silk' ? 'text-slate-900' : 'text-white'} mb-2`}>{project.name}</h2>
                <Badge
                  className={`${TAG_COLORS[project.primaryTag] || 'bg-gray-500'} text-white`}
                >
                  {project.primaryTag}
                </Badge>
              </div>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={onClose}
              className={`${theme === 'silk' ? 'text-[#627EEA] hover:bg-[#627EEA]/10' : 'text-white hover:bg-white/10'}`}
            >
              <CloseIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-6 pb-24 space-y-6">
            {/* Description */}
            <div>
              <h3 className={`text-sm font-semibold ${theme === 'silk' ? 'text-[#627EEA]' : 'text-gray-300'} uppercase tracking-wider mb-2`}>
                Description
              </h3>
              <p className={`${theme === 'silk' ? 'text-slate-700' : 'text-white'} leading-relaxed`}>{project.description}</p>
            </div>

            {/* Project Status */}
            {project.status && (
              <div>
                <h3 className={`text-sm font-semibold ${theme === 'silk' ? 'text-[#627EEA]' : 'text-gray-300'} uppercase tracking-wider mb-3`}>
                  Project Status
                </h3>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-green-400" />
                  <Badge
                    className={`${
                      project.status === 'Live' || project.status === 'Active'
                        ? 'bg-green-500'
                        : project.status === 'Launched'
                        ? 'bg-blue-500'
                        : 'bg-yellow-500'
                    } text-white cursor-pointer hover:opacity-80 transition-opacity`}
                    onClick={() => onFilterByStatus?.(project.status!)}
                    title={`Click to filter projects with status: ${project.status}`}
                  >
                    {project.status}
                  </Badge>
                </div>
                <p className={`text-xs ${theme === 'silk' ? 'text-slate-500' : 'text-gray-400'} mt-2`}>
                  Click to filter by status
                </p>
              </div>
            )}

            {/* Key Metrics */}
            {(project.funding || project.launchDate || project.marketCap || project.xFollowers) && (
              <div>
                <h3 className={`text-sm font-semibold ${theme === 'silk' ? 'text-[#627EEA]' : 'text-gray-300'} uppercase tracking-wider mb-3`}>
                  Key Metrics
                </h3>
                <div className={`${theme === 'silk' ? 'bg-white border border-[#627EEA]/10' : 'bg-white/5'} rounded-lg p-4 space-y-3`}>
                  {project.funding && project.funding !== '$0' && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <span className={`${theme === 'silk' ? 'text-slate-500' : 'text-gray-400'}`}>Total Funding</span>
                      </div>
                      <span className={`${theme === 'silk' ? 'text-slate-900' : 'text-white'} font-semibold`}>{project.funding}</span>
                    </div>
                  )}
                  {project.launchDate && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span className={`${theme === 'silk' ? 'text-slate-500' : 'text-gray-400'}`}>Launch Date</span>
                      </div>
                      <span className={`${theme === 'silk' ? 'text-slate-900' : 'text-white'} font-medium`}>
                        {new Date(project.launchDate).toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  )}
                  {project.marketCap && project.marketCap !== '$0' && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-purple-500" />
                        <span className={`${theme === 'silk' ? 'text-slate-500' : 'text-gray-400'}`}>Market Cap</span>
                      </div>
                      <span className={`${theme === 'silk' ? 'text-slate-900' : 'text-white'} font-semibold`}>{project.marketCap}</span>
                    </div>
                  )}
                  {project.xFollowers && project.xFollowers > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-cyan-500" />
                        <span className={`${theme === 'silk' ? 'text-slate-500' : 'text-gray-400'}`}>X Followers</span>
                      </div>
                      <span className={`${theme === 'silk' ? 'text-slate-900' : 'text-white'} font-medium`}>
                        {project.xFollowers.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Backed By Investors */}
            {project.investors && project.investors.length > 0 && (
              <div>
                <h3 className={`text-sm font-semibold ${theme === 'silk' ? 'text-[#627EEA]' : 'text-gray-300'} uppercase tracking-wider mb-3`}>
                  <div className="flex items-center gap-2">
                    <Handshake className="w-4 h-4 text-orange-500" />
                    Backed By
                  </div>
                </h3>
                <div className={`${theme === 'silk' ? 'bg-white border border-[#627EEA]/10' : 'bg-white/5'} rounded-lg p-4`}>
                  <div className="flex flex-wrap gap-2">
                    {project.investors.map((investor) => (
                      <Badge
                        key={investor}
                        variant="outline"
                        className={`${theme === 'silk' ? 'text-slate-700 bg-slate-100 border-slate-200' : 'text-white border-white/20 bg-white/5'} cursor-pointer hover:bg-[#627EEA]/10 hover:border-[#627EEA]/50 transition-all`}
                        onClick={() => onFilterByInvestor?.(investor)}
                        title={`Click to filter projects backed by ${investor}`}
                      >
                        {investor}
                      </Badge>
                    ))}
                  </div>
                </div>
                <p className={`text-xs ${theme === 'silk' ? 'text-slate-500' : 'text-gray-400'} mt-2`}>
                  Click any investor to filter projects backed by them
                </p>
              </div>
            )}

            {/* All Tags */}
            <div>
              <h3 className={`text-sm font-semibold ${theme === 'silk' ? 'text-[#627EEA]' : 'text-gray-300'} uppercase tracking-wider mb-2`}>
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge
                    key={tag}
                    className={`${TAG_COLORS[tag] || 'bg-gray-500'} text-white`}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Orbital Information */}
            <div>
              <h3 className={`text-sm font-semibold ${theme === 'silk' ? 'text-[#627EEA]' : 'text-gray-300'} uppercase tracking-wider mb-2`}>
                Orbital Information
              </h3>
              <div className={`${theme === 'silk' ? 'bg-white border border-[#627EEA]/10' : 'bg-white/5'} rounded-lg p-4 space-y-2`}>
                <div className="flex justify-between">
                  <span className={`${theme === 'silk' ? 'text-slate-500' : 'text-gray-400'}`}>Ring Category</span>
                  <span className={`${theme === 'silk' ? 'text-slate-900' : 'text-white'} font-medium`}>{ringConfig.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className={`${theme === 'silk' ? 'text-slate-500' : 'text-gray-400'}`}>Orbital Speed</span>
                  <span className={`${theme === 'silk' ? 'text-slate-900' : 'text-white'} font-medium`}>{(ringConfig.speed * 10000).toFixed(1)}x</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`${theme === 'silk' ? 'text-slate-500' : 'text-gray-400'}`}>Ring Color</span>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: ringConfig.color }}
                    />
                    <span className={`${theme === 'silk' ? 'text-slate-900' : 'text-white'} font-mono text-sm`}>{ringConfig.color}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <h3 className={`text-sm font-semibold ${theme === 'silk' ? 'text-[#627EEA]' : 'text-gray-300'} uppercase tracking-wider`}>
                Links
              </h3>

              <Button
                className={`w-full justify-start gap-2 ${theme === 'silk' ? 'border-[#627EEA]/30 text-[#627EEA] hover:bg-[#627EEA]/10' : 'border-white/20'}`}
                variant="outline"
                onClick={() => window.open(project.url, '_blank')}
              >
                <Globe className="w-4 h-4" />
                Visit Website
              </Button>

              {project.xHandle && (
                <Button
                  className={`w-full justify-start gap-2 ${theme === 'silk' ? 'border-[#627EEA]/30 text-[#627EEA] hover:bg-[#627EEA]/10' : 'border-white/20'}`}
                  variant="outline"
                  onClick={() => window.open(`https://x.com/${project.xHandle?.replace('@', '')}`, '_blank')}
                >
                  <Twitter className="w-4 h-4" />
                  View X
                </Button>
              )}
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className={`p-4 border-t ${theme === 'silk' ? 'border-[#627EEA]/20 bg-white/50' : 'border-white/20 bg-white/5'}`}>
          <p className={`text-xs ${theme === 'silk' ? 'text-slate-500' : 'text-gray-400'} text-center`}>
            Click outside or press <kbd className={`px-1 ${theme === 'silk' ? 'bg-slate-200' : 'bg-white/20'} rounded`}>Esc</kbd> to close
          </p>
        </div>
      </Card>
    </div>
  );
}
