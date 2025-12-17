import React from 'react';
import { Handle, Position } from 'reactflow';
import { Calendar, Clock, Send, Users, Globe, Smartphone, Monitor, Image, Video, FileText, Link, Hash, AtSign, TrendingUp, BarChart, Eye, MousePointer, Heart, MessageCircle, Share2, Bookmark, Settings, Play, Pause, Square, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
const PostScheduleNode: React.FC<{ id: string; data: Record<string, any>; selected?: boolean; onUpdate??: (e: any) => void; onDelete??: (e: any) => void; onConnect???: (e: any) => void; onDisconnect???: (e: any) => void }> = ({ data, isConnectable, selected }) => {
  const getPostIcon = (type: unknown) => {
    switch (type) {
      case 'facebook':
        return <Globe className="h-4 w-4" />;
      case 'instagram':
        return <Image className="h-4 w-4" />;
      case 'twitter':
        return <MessageCircle className="h-4 w-4" />;
      case 'linkedin':
        return <Users className="h-4 w-4" />;
      case 'youtube':
        return <Video className="h-4 w-4" />;
      case 'tiktok':
        return <Play className="h-4 w-4" />;
      case 'pinterest':
        return <Image className="h-4 w-4" />;
      case 'blog':
        return <FileText className="h-4 w-4" />;
      case 'email':
        return <Send className="h-4 w-4" />;
      case 'sms':
        return <MessageCircle className="h-4 w-4" />;
      case 'whatsapp':
        return <MessageCircle className="h-4 w-4" />;
      case 'telegram':
        return <MessageCircle className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    } ;

  const getPostColor = (type: unknown) => {
    switch (type) {
      case 'facebook':
        return 'border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100';
      case 'instagram':
        return 'border-pink-300 bg-gradient-to-br from-pink-50 to-pink-100';
      case 'twitter':
        return 'border-cyan-300 bg-gradient-to-br from-cyan-50 to-cyan-100';
      case 'linkedin':
        return 'border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100';
      case 'youtube':
        return 'border-red-300 bg-gradient-to-br from-red-50 to-red-100';
      case 'tiktok':
        return 'border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100';
      case 'pinterest':
        return 'border-red-300 bg-gradient-to-br from-red-50 to-red-100';
      case 'blog':
        return 'border-purple-300 bg-gradient-to-br from-purple-50 to-purple-100';
      case 'email':
        return 'border-indigo-300 bg-gradient-to-br from-indigo-50 to-indigo-100';
      case 'sms':
        return 'border-green-300 bg-gradient-to-br from-green-50 to-green-100';
      case 'whatsapp':
        return 'border-emerald-300 bg-gradient-to-br from-emerald-50 to-emerald-100';
      case 'telegram':
        return 'border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100';
      default:
        return 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-yellow-100';
    } ;

  const postType = data?.postType || 'facebook';
  const postName = data?.name || 'Agendamento de Post';
  const postDescription = data?.description || 'Agenda posts para redes sociais';
  return (
        <>
      <div className={cn(
      'workflow-node min-w-[200px] max-w-[250px]',
      getPostColor(postType),
      selected && 'selected shadow-lg ring-2 ring-blue-500'
    )  }>
      </div><Handle
        type="target"
        position={ Position.Left }
        isConnectable={ isConnectable }
        className="workflow-node-handle target"
      / />
      <Handle
        type="source"
        position={ Position.Right }
        isConnectable={ isConnectable }
        className="workflow-node-handle source"
      / />
      <div className=" ">$2</div><div className="{getPostIcon(postType)}">$2</div>
        </div>
        <div className="{postName}">$2</div>
        </div>
      <div className=" ">$2</div><p className="text-xs text-gray-600 mb-2" />
          {postDescription}
        </p>
        {data?.postType && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Plataforma:</span>
            <span className="{postType}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.content && (
          <div className=" ">$2</div><FileText className="h-3 w-3 text-gray-500" />
            <span className="{data.content}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.schedule && (
          <div className=" ">$2</div><Calendar className="h-3 w-3 text-gray-500" />
            <span className="{data.schedule}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.timezone && (
          <div className=" ">$2</div><Clock className="h-3 w-3 text-gray-500" />
            <span className="{data.timezone}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.media && (data as any).media.length > 0 && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Mídia:</span>
            <div className="{data.media.slice(0, 2).map((item: unknown, index: unknown) => (">$2</div>
                <div key={index} className="text-xs text-gray-600 bg-white rounded px-2 py-1 flex items-center gap-1">
           
        </div>{item.type === 'image' && <Image className="h-3 w-3" />}
                  {item.type === 'video' && <Video className="h-3 w-3" />}
                  {item.type === 'link' && <Link className="h-3 w-3" />}
                  {item.name}
                </div>
              ))}
              {data.media.length > 2 && (
                <div className="+{data.media.length - 2} mais...">$2</div>
    </div>
  )}
            </div>
        )}
        {data?.hashtags && (data as any).hashtags.length > 0 && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Hashtags:</span>
            <div className="{data.hashtags.slice(0, 2).map((hashtag: unknown, index: unknown) => (">$2</div>
                <div key={index} className="text-xs text-gray-600 bg-white rounded px-2 py-1">
          #
        </div>{hashtag}
                </div>
              ))}
              {data.hashtags.length > 2 && (
                <div className="+{data.hashtags.length - 2} mais...">$2</div>
    </div>
  )}
            </div>
        )}
        {data?.mentions && (data as any).mentions.length > 0 && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Menções:</span>
            <div className="{data.mentions.slice(0, 2).map((mention: unknown, index: unknown) => (">$2</div>
                <div key={index} className="text-xs text-gray-600 bg-white rounded px-2 py-1">
          @
        </div>{mention}
                </div>
              ))}
              {data.mentions.length > 2 && (
                <div className="+{data.mentions.length - 2} mais...">$2</div>
    </div>
  )}
            </div>
        )}
        {data?.audience && (
          <div className=" ">$2</div><Users className="h-3 w-3 text-gray-500" />
            <span className="Público: {data.audience}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.location && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Localização:</span>
            <span className="{data.location}">$2</span>
            </span>
      </div>
    </>
  )}
        { data?.status && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Status:</span>
            <span className={cn(
              'text-xs px-2 py-1 rounded-full',
              (data as any).status === 'scheduled' && 'bg-blue-100 text-blue-800',
              (data as any).status === 'published' && 'bg-green-100 text-green-800',
              (data as any).status === 'failed' && 'bg-red-100 text-red-800',
              (data as any).status === 'draft' && 'bg-gray-100 text-gray-800',
              (data as any).status === 'cancelled' && 'bg-yellow-100 text-yellow-800'
            )  }>
        </span>{data.status}
            </span>
      </div>
    </>
  )}
        { data?.priority && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Prioridade:</span>
            <span className={cn(
              'text-xs px-2 py-1 rounded-full',
              (data as any).priority === 'high' && 'bg-red-100 text-red-800',
              (data as any).priority === 'medium' && 'bg-yellow-100 text-yellow-800',
              (data as any).priority === 'low' && 'bg-green-100 text-green-800'
            )  }>
        </span>{data.priority}
            </span>
      </div>
    </>
  )}
        { data?.autoOptimize !== undefined && (
          <div className=" ">$2</div><div className={cn(
              'w-2 h-2 rounded-full',
              (data as any).autoOptimize ? 'bg-green-500' : 'bg-gray-400'
            )  }>
        </div><span className="{data.autoOptimize ? 'Otimização Automática' : 'Otimização Manual'}">$2</span>
            </span>
      </div>
    </>
  )}
        { data?.crossPost !== undefined && (
          <div className=" ">$2</div><div className={cn(
              'w-2 h-2 rounded-full',
              (data as any).crossPost ? 'bg-green-500' : 'bg-gray-400'
            )  }>
        </div><span className="{data.crossPost ? 'Cross-posting Ativo' : 'Cross-posting Inativo'}">$2</span>
            </span>
      </div>
    </>
  )}
      </div>
      <div className=" ">$2</div><div className=" ">$2</div><Calendar className="h-3 w-3 text-yellow-600" />
          <span className="text-xs text-yellow-600 font-medium">AGENDAMENTO</span></div></div>);};

export default PostScheduleNode;
