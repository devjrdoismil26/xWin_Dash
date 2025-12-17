// ========================================
// PRODUCTS MODULE - MODERN LANDING PAGE CARD
// ========================================
import React, { useState } from 'react';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Badge from '@/shared/components/ui/Badge';
import { MoreVertical, Edit, Trash2, Copy, Eye, ExternalLink, BarChart3, Users, MousePointer, TrendingUp, TrendingDown, Minus, Image as ImageIcon, Calendar, Globe, Target, Zap } from 'lucide-react';
import { LandingPage, LandingPageStatus, SectionType } from '../types/products';
import { cn } from '@/lib/utils';
interface ModernLandingPageCardProps {
  landingPage: LandingPage;
  onEdit??: (e: any) => void;
  onDelete??: (e: any) => void;
  onDuplicate??: (e: any) => void;
  onView??: (e: any) => void;
  onPublish??: (e: any) => void;
  onUnpublish??: (e: any) => void;
  className?: string;
  showActions?: boolean;
  showMetrics?: boolean;
  showSections?: boolean;
  showSEO?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
export const ModernLandingPageCard: React.FC<ModernLandingPageCardProps> = ({ landingPage,
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
    } ;

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
    } ;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));};

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();};

  const formatPercentage = (num: number) => {
    return (num * 100).toFixed(1) + '%';};

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    } ;

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
    } ;

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
    } ;

  const getConversionRateColor = (rate: number) => {
    if (rate >= 0.05) return 'text-green-600';
    if (rate >= 0.03) return 'text-yellow-600';
    return 'text-red-600';};

  const getBounceRateColor = (rate: number) => {
    if (rate <= 0.4) return 'text-green-600';
    if (rate <= 0.6) return 'text-yellow-600';
    return 'text-red-600';};

  return (
            <Card
      className={cn(
        'group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]',
        className
      )} onMouseEnter={ () => setIsHovered(true) }
      onMouseLeave={ () => setIsHovered(false)  }>
      {/* Header */}
      <div className="{/* Eye Image */}">$2</div>
        <div className="{landingPage.design?.theme ? (">$2</div>
            <div className=" ">$2</div><div className=" ">$2</div><Globe className="w-12 h-12 mx-auto mb-2" />
                <p className="text-sm font-medium">Landing Page Eye</p>
      </div>
    </>
  ) : (
            <div className=" ">$2</div><ImageIcon className="w-12 h-12" />
            </div>
          )}
        </div>
        {/* Status Badge */}
        <div className=" ">$2</div><Badge className={cn('border flex items-center gap-1', getStatusColor(landingPage.status)) } />
            {getStatusIcon(landingPage.status)}
            {landingPage.status}
          </Badge>
        </div>
        {/* Actions Dropdown */}
        { showActions && (
          <div className=" ">$2</div><div className=" ">$2</div><Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 bg-white/90 backdrop-blur-sm"
                onClick={ () => setShowDropdown(!showDropdown)  }>
                <MoreVertical className="w-4 h-4" />
              </Button>
              {showDropdown && (
                <div className="{onView && (">$2</div>
                    <button
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      onClick={() => {
                        onView(landingPage);

                        setShowDropdown(false);

                      } >
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

                      } >
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

                      } >
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

                      } >
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

                      } >
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

                      } >
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

                      } >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
        )}
      </div>
      {/* Content */}
      <div className="{/* Title and Slug */}">$2</div>
        <div>
           
        </div><h3 className="font-semibold text-gray-900 line-clamp-2 mb-1" />
            {landingPage.title}
          </h3>
          <p className="text-sm text-gray-500">/{landingPage.slug}</p>
        </div>
        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2" />
          {landingPage.description}
        </p>
        {/* Sections */}
        {showSections && landingPage.content.sections.length > 0 && (
          <div className="{landingPage.content.sections.slice(0, 4).map((section: unknown, index: unknown) => (">$2</div>
              <Badge key={index} variant="secondary" className="text-xs" />
                {getSectionIcon(section.type)}
                <span className="ml-1">{section.type}</span>
      </Badge>
    </>
  ))}
            {landingPage.content.sections.length > 4 && (
              <Badge variant="secondary" className="text-xs" />
                +{landingPage.content.sections.length - 4} more
              </Badge>
            )}
          </div>
        )}
        {/* Metrics */}
        {showMetrics && (
          <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><Users className="w-4 h-4 text-blue-500" />
                <span className="{formatNumber(landingPage.analytics.views)}">$2</span>
                </span></div><p className="text-xs text-gray-500">Views</p></div><div className=" ">$2</div><div className=" ">$2</div><Target className="w-4 h-4 text-green-500" />
                <span className="{formatNumber(landingPage.analytics.conversions)}">$2</span>
                </span></div><p className="text-xs text-gray-500">Conversions</p></div><div className=" ">$2</div><div className=" ">$2</div><BarChart3 className="w-4 h-4 text-purple-500" />
                <span className={cn('text-sm font-medium', getConversionRateColor(landingPage.analytics.conversionRate))  }>
        </span>{formatPercentage(landingPage.analytics.conversionRate)}
                </span></div><p className="text-xs text-gray-500">Conversion Rate</p></div><div className=" ">$2</div><div className=" ">$2</div><MousePointer className="w-4 h-4 text-orange-500" />
                <span className={cn('text-sm font-medium', getBounceRateColor(landingPage.analytics.bounceRate))  }>
        </span>{formatPercentage(landingPage.analytics.bounceRate)}
                </span></div><p className="text-xs text-gray-500">Bounce Rate</p>
      </div>
    </>
  )}
        {/* SEO Score */}
        {showSEO && (
          <div className=" ">$2</div><span className="text-sm text-gray-600">SEO Score:</span>
            <div className=" ">$2</div><div className=" ">$2</div><div className="w-3/4 h-full bg-green-500 rounded-full">
           
        </div><span className="text-sm font-medium text-green-600">75</span>
      </div>
    </>
  )}
        {/* Footer */}
        <div className=" ">$2</div><div className=" ">$2</div><Calendar className="w-3 h-3" />
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
    </Card>);};
