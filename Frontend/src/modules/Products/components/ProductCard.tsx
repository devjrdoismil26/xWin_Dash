// ========================================
// PRODUCTS MODULE - MODERN PRODUCT CARD
// ========================================
import React, { useState } from 'react';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Badge from '@/shared/components/ui/Badge';
import { MoreVertical, Edit, Trash2, Copy, Eye, ShoppingCart, Star, TrendingUp, TrendingDown, Minus, Image as ImageIcon, Tag, Calendar, DollarSign } from 'lucide-react';
import { Product, ProductStatus, ProductCategory } from '../types/products';
import { cn } from '@/lib/utils';
interface ModernProductCardProps {
  product: Product;
  onEdit??: (e: any) => void;
  onDelete??: (e: any) => void;
  onDuplicate??: (e: any) => void;
  onView??: (e: any) => void;
  onAddToCart??: (e: any) => void;
  className?: string;
  showActions?: boolean;
  showMetrics?: boolean;
  showPricing?: boolean;
  showInventory?: boolean;
  showSEO?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
export const ModernProductCard: React.FC<ModernProductCardProps> = ({ product,
  onEdit,
  onDelete,
  onDuplicate,
  onView,
  onAddToCart,
  className,
  showActions = true,
  showMetrics = true,
  showPricing = true,
  showInventory = true,
  showSEO = false
   }) => {
  const [isHovered, setIsHovered] = useState(false);

  const [showDropdown, setShowDropdown] = useState(false);

  const getStatusColor = (status: ProductStatus) => {
    switch (status) {
      case ProductStatus.ACTIVE:
        return 'bg-green-100 text-green-800 border-green-200';
      case ProductStatus.DRAFT:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case ProductStatus.INACTIVE:
        return 'bg-red-100 text-red-800 border-red-200';
      case ProductStatus.ARCHIVED:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    } ;

  const getCategoryColor = (category: ProductCategory) => {
    switch (category) {
      case ProductCategory.DIGITAL:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case ProductCategory.PHYSICAL:
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case ProductCategory.SERVICE:
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case ProductCategory.SUBSCRIPTION:
        return 'bg-pink-100 text-pink-800 border-pink-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    } ;

  const getInventoryStatus = () => {
    if (!product.inventory.trackInventory) return 'Unlimited';
    if (product.inventory.quantity <= 0) return 'Out of Stock';
    if (product.inventory.quantity <= product.inventory.lowStockThreshold) return 'Low Stock';
    return 'In Stock';};

  const getInventoryColor = () => {
    if (!product.inventory.trackInventory) return 'text-gray-600';
    if (product.inventory.quantity <= 0) return 'text-red-600';
    if (product.inventory.quantity <= product.inventory.lowStockThreshold) return 'text-yellow-600';
    return 'text-green-600';};

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
  }).format(price);};

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));};

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    } ;

  return (
            <Card
      className={cn(
        'group relative overflow-hidden backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 shadow-xl shadow-blue-500/10 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 hover:scale-[1.02]',
        className
      )} onMouseEnter={ () => setIsHovered(true) }
      onMouseLeave={ () => setIsHovered(false)  }>
      {/* Header */}
      <div className="{/* Product Image */}">$2</div>
        <div className="{product.images.length > 0 ? (">$2</div>
      <img
              src={ product.images[0].url }
              alt={ product.images[0].alt }
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            / />
    </>
  ) : (
            <div className=" ">$2</div><ImageIcon className="w-12 h-12" />
            </div>
          )}
        </div>
        {/* Status Badge */}
        <div className=" ">$2</div><Badge className={cn('border', getStatusColor(product.status)) } />
            {product.status}
          </Badge>
        </div>
        {/* Category Badge */}
        <div className=" ">$2</div><Badge className={cn('border', getCategoryColor(product.category)) } />
            {product.category}
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
                        onView(product);

                        setShowDropdown(false);

                      } >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  )}
                  {onEdit && (
                    <button
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      onClick={() => {
                        onEdit(product);

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
                        onDuplicate(product);

                        setShowDropdown(false);

                      } >
                      <Copy className="w-4 h-4" />
                      Duplicate
                    </button>
                  )}
                  {onDelete && (
                    <button
                      className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      onClick={() => {
                        onDelete(product);

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
      <div className="{/* Title and SKU */}">$2</div>
        <div>
           
        </div><h3 className="font-semibold text-gray-900 line-clamp-2 mb-1" />
            {product.name}
          </h3>
          <p className="text-sm text-gray-500">SKU: {product.sku}</p>
        </div>
        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2" />
          {product.description}
        </p>
        {/* Tags */}
        {product.tags.length > 0 && (
          <div className="{product.tags.slice(0, 3).map((tag: unknown, index: unknown) => (">$2</div>
              <Badge key={index} variant="secondary" className="text-xs" />
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
            {product.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs" />
                +{product.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}
        {/* Pricing */}
        {showPricing && (
          <div className=" ">$2</div><div className=" ">$2</div><DollarSign className="w-4 h-4 text-gray-500" />
              <span className="{formatPrice(product.price, product.currency)}">$2</span>
              </span>
            </div>
            {product.variations.length > 0 && (
              <Badge variant="outline" className="text-xs" />
                {product.variations.length} variants
              </Badge>
            )}
          </div>
        )}
        {/* Inventory */}
        { showInventory && (
          <div className=" ">$2</div><span className="text-sm text-gray-600">Inventory:</span>
            <span className={cn('text-sm font-medium', getInventoryColor())  }>
        </span>{getInventoryStatus()}
            </span>
      </div>
    </>
  )}
        {/* Metrics */}
        {showMetrics && (
          <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium">4.8</span></div><p className="text-xs text-gray-500">Rating</p></div><div className=" ">$2</div><div className="{getTrendIcon('up')}">$2</div>
                <span className="text-sm font-medium">+12%</span></div><p className="text-xs text-gray-500">Sales</p>
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
            <span>Updated {formatDate(product.updatedAt)}</span>
          </div>
          { onAddToCart && (
            <Button
              size="sm"
              className="h-8 px-3"
              onClick={ () => onAddToCart(product)  }>
              <ShoppingCart className="w-4 h-4 mr-1" />
              Add to Cart
            </Button>
          )}
        </div>
    </Card>);};
