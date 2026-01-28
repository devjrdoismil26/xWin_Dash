// ========================================
// PRODUCTS MODULE - MODERN LANDING PAGE CARD
// ========================================
import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { 
  MoreVertical, 
  Edit, 
  Trash2, 
  Copy, 
  Eye, 
  ExternalLink,
  BarChart3,
  Users,
  MousePointer,
  TrendingUp,
  TrendingDown,
  Minus,
  Image as ImageIcon,
  Calendar,
  Globe,
  Target,
  Zap
} from 'lucide-react';
import { LandingPage, LandingPageStatus, SectionType } from '../types/products';
import { cn } from '@/lib/utils';
interface ModernLandingPageCardProps {
  landingPage: LandingPage;
  onEdit?: (landingPage: LandingPage) => void;
  onDelete?: (landingPage: LandingPage) => void;
  onDuplicate?: (landingPage: LandingPage) => void;
  onView?: (landingPage: LandingPage) => void;
  onPublish?: (landingPage: LandingPage) => void;
  onUnpublish?: (landingPage: LandingPage) => void;
  className?: string;
  showActions?: boolean;
  showMetrics?: boolean;
  showSections?: boolean;
  showSEO?: boolean;
}
export const ModernLandingPageCard: React.FC<ModernLandingPageCardProps> = ({
  landingPage,
  onEdit,
  onDelete,
  onDuplicate,
  onView,
  onPublish,
  onUnpublish,
  className,
  showActions = true,
  showMetrics = true,
  showSections = true,
  showSEO = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const getStatusColor = (status: LandingPageStatus) => {
    switch (status) {
      case LandingPageStatus.PUBLISHED:
        return 'bg-green-100 text-green-800 border-green-200';
      case LandingPageStatus.DRAFT:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case LandingPageStatus.ARCHIVED:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  const getStatusIcon = (status: LandingPageStatus) => {
    switch (status) {
      case LandingPageStatus.PUBLISHED:
        return <Globe className="w-4 h-4" />;
      case LandingPageStatus.DRAFT:
        return <Edit className="w-4 h-4" />;
      case LandingPageStatus.ARCHIVED:
        return <Trash2 className="w-4 h-4" />;
      default:
        return <Edit className="w-4 h-4" />;
    }
  };
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  };
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };
  const formatPercentage = (num: number) => {
    return (num * 100).toFixed(1) + '%';
  };
  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };
  const getSectionIcon = (type: SectionType) => {
    switch (type) {
      case SectionType.HERO:
        return <Target className="w-4 h-4" />;
      case SectionType.FEATURES:
        return <Zap className="w-4 h-4" />;
      case SectionType.TESTIMONIALS:
        return <Users className="w-4 h-4" />;
      case SectionType.PRICING:
        return <BarChart3 className="w-4 h-4" />;
      case SectionType.FAQ:
        return <MousePointer className="w-4 h-4" />;
      case SectionType.CTA:
        return <Target className="w-4 h-4" />;
      case SectionType.CONTACT:
        return <Users className="w-4 h-4" />;
      default:
        return <Zap className="w-4 h-4" />;
    }
  };
  const getSectionColor = (type: SectionType) => {
    switch (type) {
      case SectionType.HERO:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case SectionType.FEATURES:
        return 'bg-green-100 text-green-800 border-green-200';
      case SectionType.TESTIMONIALS:
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case SectionType.PRICING:
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case SectionType.FAQ:
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case SectionType.CTA:
        return 'bg-red-100 text-red-800 border-red-200';
      case SectionType.CONTACT:
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  const getConversionRateColor = (rate: number) => {
    if (rate >= 0.05) return 'text-green-600';
    if (rate >= 0.03) return 'text-yellow-600';
    return 'text-red-600';
  };
  const getBounceRateColor = (rate: number) => {
    if (rate <= 0.4) return 'text-green-600';
    if (rate <= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };
  return (
    <Card
      className={cn(
        'group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="relative">
        {/* Preview Image */}
        <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
          {landingPage.design?.theme ? (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <div className="text-white text-center">
                <Globe className="w-12 h-12 mx-auto mb-2" />
                <p className="text-sm font-medium">Landing Page Preview</p>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <ImageIcon className="w-12 h-12" />
            </div>
          )}
        </div>
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <Badge className={cn('border flex items-center gap-1', getStatusColor(landingPage.status))}>
            {getStatusIcon(landingPage.status)}
            {landingPage.status}
          </Badge>
        </div>
        {/* Actions Dropdown */}
        {showActions && (
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 bg-white/90 backdrop-blur-sm"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
              {showDropdown && (
                <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[140px]">
                  {onView && (
                    <button
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      onClick={() => {
                        onView(landingPage);
                        setShowDropdown(false);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  )}
                  {landingPage.status === LandingPageStatus.PUBLISHED && (
                    <button
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      onClick={() => {
                        window.open(`/landing-pages/${landingPage.slug}`, '_blank');
                        setShowDropdown(false);
                      }}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open Live
                    </button>
                  )}
                  {onEdit && (
                    <button
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      onClick={() => {
                        onEdit(landingPage);
                        setShowDropdown(false);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                  )}
                  {onDuplicate && (
                    <button
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      onClick={() => {
                        onDuplicate(landingPage);
                        setShowDropdown(false);
                      }}
                    >
                      <Copy className="w-4 h-4" />
                      Duplicate
                    </button>
                  )}
                  {landingPage.status === LandingPageStatus.DRAFT && onPublish && (
                    <button
                      className="w-full px-3 py-2 text-left text-sm text-green-600 hover:bg-green-50 flex items-center gap-2"
                      onClick={() => {
                        onPublish(landingPage);
                        setShowDropdown(false);
                      }}
                    >
                      <Globe className="w-4 h-4" />
                      Publish
                    </button>
                  )}
                  {landingPage.status === LandingPageStatus.PUBLISHED && onUnpublish && (
                    <button
                      className="w-full px-3 py-2 text-left text-sm text-yellow-600 hover:bg-yellow-50 flex items-center gap-2"
                      onClick={() => {
                        onUnpublish(landingPage);
                        setShowDropdown(false);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                      Unpublish
                    </button>
                  )}
                  {onDelete && (
                    <button
                      className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      onClick={() => {
                        onDelete(landingPage);
                        setShowDropdown(false);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title and Slug */}
        <div>
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
            {landingPage.title}
          </h3>
          <p className="text-sm text-gray-500">/{landingPage.slug}</p>
        </div>
        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2">
          {landingPage.description}
        </p>
        {/* Sections */}
        {showSections && landingPage.content.sections.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {landingPage.content.sections.slice(0, 4).map((section, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {getSectionIcon(section.type)}
                <span className="ml-1">{section.type}</span>
              </Badge>
            ))}
            {landingPage.content.sections.length > 4 && (
              <Badge variant="secondary" className="text-xs">
                +{landingPage.content.sections.length - 4} more
              </Badge>
            )}
          </div>
        )}
        {/* Metrics */}
        {showMetrics && (
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Users className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">
                  {formatNumber(landingPage.analytics.views)}
                </span>
              </div>
              <p className="text-xs text-gray-500">Views</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Target className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">
                  {formatNumber(landingPage.analytics.conversions)}
                </span>
              </div>
              <p className="text-xs text-gray-500">Conversions</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <BarChart3 className="w-4 h-4 text-purple-500" />
                <span className={cn('text-sm font-medium', getConversionRateColor(landingPage.analytics.conversionRate))}>
                  {formatPercentage(landingPage.analytics.conversionRate)}
                </span>
              </div>
              <p className="text-xs text-gray-500">Conversion Rate</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <MousePointer className="w-4 h-4 text-orange-500" />
                <span className={cn('text-sm font-medium', getBounceRateColor(landingPage.analytics.bounceRate))}>
                  {formatPercentage(landingPage.analytics.bounceRate)}
                </span>
              </div>
              <p className="text-xs text-gray-500">Bounce Rate</p>
            </div>
          </div>
        )}
        {/* SEO Score */}
        {showSEO && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <span className="text-sm text-gray-600">SEO Score:</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="w-3/4 h-full bg-green-500 rounded-full"></div>
              </div>
              <span className="text-sm font-medium text-green-600">75</span>
            </div>
          </div>
        )}
        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>Updated {formatDate(landingPage.updatedAt)}</span>
          </div>
          {landingPage.status === LandingPageStatus.PUBLISHED && (
            <Button
              size="sm"
              variant="outline"
              className="h-8 px-3"
              onClick={() => window.open(`/landing-pages/${landingPage.slug}`, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              View Live
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
