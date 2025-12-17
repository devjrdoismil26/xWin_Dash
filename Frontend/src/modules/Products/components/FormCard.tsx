// ========================================
// PRODUCTS MODULE - MODERN FORM CARD
// ========================================
import React, { useState } from 'react';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Badge from '@/shared/components/ui/Badge';
import { MoreVertical, Edit, Trash2, Copy, Eye, ExternalLink, BarChart3, Users, MousePointer, TrendingUp, TrendingDown, Minus, FileText, Calendar, Globe, Target, Zap, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { LeadCaptureForm, FormStatus, FieldType } from '../types/products';
import { cn } from '@/lib/utils';
interface ModernFormCardProps {
  form: LeadCaptureForm;
  onEdit??: (e: any) => void;
  onDelete??: (e: any) => void;
  onDuplicate??: (e: any) => void;
  onView??: (e: any) => void;
  onPublish??: (e: any) => void;
  onUnpublish??: (e: any) => void;
  className?: string;
  showActions?: boolean;
  showMetrics?: boolean;
  showFields?: boolean;
  showSettings?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
export const ModernFormCard: React.FC<ModernFormCardProps> = ({ form,
  onEdit,
  onDelete,
  onDuplicate,
  onView,
  onPublish,
  onUnpublish,
  className,
  showActions = true,
  showMetrics = true,
  showFields = true,
  showSettings = false
   }) => {
  const [isHovered, setIsHovered] = useState(false);

  const [showDropdown, setShowDropdown] = useState(false);

  const getStatusColor = (status: FormStatus) => {
    switch (status) {
      case FormStatus.PUBLISHED:
        return 'bg-green-100 text-green-800 border-green-200';
      case FormStatus.DRAFT:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case FormStatus.ARCHIVED:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    } ;

  const getStatusIcon = (status: FormStatus) => {
    switch (status) {
      case FormStatus.PUBLISHED:
        return <Globe className="w-4 h-4" />;
      case FormStatus.DRAFT:
        return <Edit className="w-4 h-4" />;
      case FormStatus.ARCHIVED:
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

  const getFieldIcon = (type: FieldType) => {
    switch (type) {
      case FieldType.TEXT:
        return <FileText className="w-4 h-4" />;
      case FieldType.EMAIL:
        return <Target className="w-4 h-4" />;
      case FieldType.PHONE:
        return <Users className="w-4 h-4" />;
      case FieldType.NUMBER:
        return <BarChart3 className="w-4 h-4" />;
      case FieldType.SELECT:
        return <Zap className="w-4 h-4" />;
      case FieldType.MULTISELECT:
        return <Zap className="w-4 h-4" />;
      case FieldType.CHECKBOX:
        return <CheckCircle className="w-4 h-4" />;
      case FieldType.RADIO:
        return <Target className="w-4 h-4" />;
      case FieldType.TEXTAREA:
        return <FileText className="w-4 h-4" />;
      case FieldType.DATE:
        return <Calendar className="w-4 h-4" />;
      case FieldType.FILE:
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    } ;

  const getFieldColor = (type: FieldType) => {
    switch (type) {
      case FieldType.TEXT:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case FieldType.EMAIL:
        return 'bg-green-100 text-green-800 border-green-200';
      case FieldType.PHONE:
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case FieldType.NUMBER:
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case FieldType.SELECT:
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case FieldType.MULTISELECT:
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case FieldType.CHECKBOX:
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case FieldType.RADIO:
        return 'bg-red-100 text-red-800 border-red-200';
      case FieldType.TEXTAREA:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case FieldType.DATE:
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case FieldType.FILE:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    } ;

  const getConversionRateColor = (rate: number) => {
    if (rate >= 0.15) return 'text-green-600';
    if (rate >= 0.1) return 'text-yellow-600';
    return 'text-red-600';};

  const getCompletionRateColor = (rate: number) => {
    if (rate >= 0.8) return 'text-green-600';
    if (rate >= 0.6) return 'text-yellow-600';
    return 'text-red-600';};

  const getRequiredFieldsCount = () => {
    return (form.fields || []).filter(field => field.required).length;};

  const getOptionalFieldsCount = () => {
    return (form.fields || []).filter(field => !field.required).length;};

  return (
            <Card
      className={cn(
        'group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]',
        className
      )} onMouseEnter={ () => setIsHovered(true) }
      onMouseLeave={ () => setIsHovered(false)  }>
      {/* Header */}
      <div className="{/* Form Eye */}">$2</div>
        <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><FileText className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm font-medium">Form Eye</p></div></div>
        {/* Status Badge */}
        <div className=" ">$2</div><Badge className={cn('border flex items-center gap-1', getStatusColor(form.status)) } />
            {getStatusIcon(form.status)}
            {form.status}
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
                        onView(form);

                        setShowDropdown(false);

                      } >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  )}
                  {form.status === FormStatus.PUBLISHED && (
                    <button
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      onClick={() => {
                        window.open(`/forms/${form.slug}`, '_blank');

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
                        onEdit(form);

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
                        onDuplicate(form);

                        setShowDropdown(false);

                      } >
                      <Copy className="w-4 h-4" />
                      Duplicate
                    </button>
                  )}
                  {form.status === FormStatus.DRAFT && onPublish && (
                    <button
                      className="w-full px-3 py-2 text-left text-sm text-green-600 hover:bg-green-50 flex items-center gap-2"
                      onClick={() => {
                        onPublish(form);

                        setShowDropdown(false);

                      } >
                      <Globe className="w-4 h-4" />
                      Publish
                    </button>
                  )}
                  {form.status === FormStatus.PUBLISHED && onUnpublish && (
                    <button
                      className="w-full px-3 py-2 text-left text-sm text-yellow-600 hover:bg-yellow-50 flex items-center gap-2"
                      onClick={() => {
                        onUnpublish(form);

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
                        onDelete(form);

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
            {form.title}
          </h3>
          <p className="text-sm text-gray-500">/{form.slug}</p>
        </div>
        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2" />
          {form.description}
        </p>
        {/* Fields */}
        {showFields && form.fields.length > 0 && (
          <div className=" ">$2</div><div className=" ">$2</div><span className="text-sm font-medium text-gray-700">Fields ({form.fields.length})</span>
              <div className=" ">$2</div><Badge variant="outline" className="text-xs" />
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {getRequiredFieldsCount()} required
                </Badge>
                <Badge variant="outline" className="text-xs" />
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {getOptionalFieldsCount()} optional
                </Badge></div><div className="{form.fields.slice(0, 4).map((field: unknown, index: unknown) => (">$2</div>
                <Badge key={index} variant="secondary" className="text-xs" />
                  {getFieldIcon(field.type)}
                  <span className="ml-1">{field.type}</span>
      </Badge>
    </>
  ))}
              {form.fields.length > 4 && (
                <Badge variant="secondary" className="text-xs" />
                  +{form.fields.length - 4} more
                </Badge>
              )}
            </div>
        )}
        {/* Metrics */}
        {showMetrics && (
          <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><Users className="w-4 h-4 text-blue-500" />
                <span className="{formatNumber(form.analytics.views)}">$2</span>
                </span></div><p className="text-xs text-gray-500">Views</p></div><div className=" ">$2</div><div className=" ">$2</div><Target className="w-4 h-4 text-green-500" />
                <span className="{formatNumber(form.analytics.submissions)}">$2</span>
                </span></div><p className="text-xs text-gray-500">Submissions</p></div><div className=" ">$2</div><div className=" ">$2</div><BarChart3 className="w-4 h-4 text-purple-500" />
                <span className={cn('text-sm font-medium', getConversionRateColor(form.analytics.conversionRate))  }>
        </span>{formatPercentage(form.analytics.conversionRate)}
                </span></div><p className="text-xs text-gray-500">Conversion Rate</p></div><div className=" ">$2</div><div className=" ">$2</div><CheckCircle className="w-4 h-4 text-orange-500" />
                <span className={cn('text-sm font-medium', getCompletionRateColor(0.85))  }>
        </span>{formatPercentage(0.85)}
                </span></div><p className="text-xs text-gray-500">Completion Rate</p>
      </div>
    </>
  )}
        {/* Settings */}
        {showSettings && (
          <div className=" ">$2</div><div className=" ">$2</div><span className="text-sm text-gray-600">Settings:</span>
              <div className="{form.settings.emailNotifications && (">$2</div>
                  <Badge variant="outline" className="text-xs" />
                    <Target className="w-3 h-3 mr-1" />
                    Email
                  </Badge>
                )}
                {form.settings.autoResponder && (
                  <Badge variant="outline" className="text-xs" />
                    <Zap className="w-3 h-3 mr-1" />
                    Auto Reply
                  </Badge>
                )}
                {form.settings.spamProtection && (
                  <Badge variant="outline" className="text-xs" />
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Spam Protection
                  </Badge>
                )}
                {form.settings.doubleOptIn && (
                  <Badge variant="outline" className="text-xs" />
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Double Opt-in
                  </Badge>
                )}
              </div>
    </div>
  )}
        {/* Footer */}
        <div className=" ">$2</div><div className=" ">$2</div><Calendar className="w-3 h-3" />
            <span>Updated {formatDate(form.updatedAt)}</span>
          </div>
          {form.status === FormStatus.PUBLISHED && (
            <Button
              size="sm"
              variant="outline"
              className="h-8 px-3"
              onClick={() => window.open(`/forms/${form.slug}`, '_blank')}
  >
              <ExternalLink className="w-4 h-4 mr-1" />
              View Live
            </Button>
          )}
        </div>
    </Card>);};
