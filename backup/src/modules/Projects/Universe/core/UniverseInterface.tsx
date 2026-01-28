// ========================================
// UNIVERSE INTERFACE - COMPONENTE PRINCIPAL
// ========================================
import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
// import AppLayout from '@/layouts/AppLayout';
import { cn } from '@/lib/utils';
import { useUniverse } from '../hooks/useUniverse';
import { useUniverseCanvas } from '../hooks/useUniverseCanvas';

interface UniverseInterfaceProps {
  auth?: any;
}

const UniverseInterface: React.FC<UniverseInterfaceProps> = ({ auth }) => {
  const [useAdvancedInterface, setUseAdvancedInterface] = useState(false);
  const [activeView, setActiveView] = useState('overview');
  const [activeTab, setActiveTab] = useState<'instances' | 'templates' | 'snapshots' | 'canvas' | 'kanban' | 'dgd'>('instances');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const {
    instances,
    snapshots,
    templates,
    stats,
    loading,
    error,
    selectedInstance,
    isRunning,
    isSaving,
    fetchInstances,
    fetchSnapshots,
    fetchTemplates,
    fetchStats,
    createInstance,
    updateInstance,
    deleteInstance,
    createSnapshot,
    deleteSnapshot,
    startInstance,
    stopInstance,
    saveInstance,
    refreshData,
    setSelectedInstance,
    getInstanceById,
    getActiveInstances,
    getInstanceStats,
  } = useUniverse();

  const {
    blocks,
    connections,
    canvasState,
    settings,
    selectedBlocks,
    isRunning: canvasRunning,
    isSaving: canvasSaving,
    addBlock,
    removeBlock,
    updateBlock,
    connectBlocks,
    disconnectBlocks,
    selectBlock,
    deselectBlock,
    clearSelection,
    moveBlock,
    resizeBlock,
    duplicateBlock,
    groupBlocks,
    ungroupBlocks,
    alignBlocks,
    distributeBlocks,
    zoomIn,
    zoomOut,
    resetZoom,
    panCanvas,
    fitToScreen,
    exportCanvas,
    importCanvas,
    undo,
    redo,
    saveCanvas,
    loadCanvas,
    updateSettings,
    duplicateSelection,
    deleteSelection,
    alignSelection,
    setBlocks,
    setConnections,
    setIsRunning,
    setIsSaving,
    setError,
  } = useUniverseCanvas();

  const [newInstance, setNewInstance] = useState({
    name: '',
    description: '',
    template_id: '',
  });

  const handleCreateInstance = async () => {
    if (newInstance.name.trim()) {
      try {
        await createInstance({
          name: newInstance.name,
          description: newInstance.description,
          template_id: newInstance.template_id ? parseInt(newInstance.template_id) : undefined,
        });
        setNewInstance({ name: '', description: '', template_id: '' });
        setShowCreateModal(false);
      } catch (error) {
        console.error('Erro ao criar instância:', error);
      }
    }
  };

  const handleStartStop = async (instance: any) => {
    try {
      if (instance.status === 'active') {
        await stopInstance(instance.id);
      } else {
        await startInstance(instance.id);
      }
    } catch (error) {
      console.error('Erro ao iniciar/parar instância:', error);
    }
  };

  const filteredInstances = instances.filter(instance => {
    const matchesSearch = instance.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         instance.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || instance.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Head title="Universe" />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Header */}
        <div className="border-b border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">U</span>
                  </div>
                  <h1 className="text-xl font-bold text-white">Universe</h1>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setUseAdvancedInterface(!useAdvancedInterface)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    useAdvancedInterface
                      ? "bg-purple-600 text-white"
                      : "bg-white/10 text-white hover:bg-white/20"
                  )}
                >
                  {useAdvancedInterface ? 'Advanced Mode' : 'Basic Mode'}
                </button>
                
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
                >
                  Create Instance
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-white">Loading Universe...</div>
            </div>
          ) : error ? (
            <div className="text-red-400 text-center">
              Error: {error}
            </div>
          ) : (
            <div className="space-y-8">
              {/* Stats Cards */}
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <div className="text-white/70 text-sm">Total Instances</div>
                    <div className="text-2xl font-bold text-white">{stats.totalInstances}</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <div className="text-white/70 text-sm">Active Instances</div>
                    <div className="text-2xl font-bold text-green-400">{stats.activeInstances}</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <div className="text-white/70 text-sm">Templates</div>
                    <div className="text-2xl font-bold text-blue-400">{stats.templates}</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <div className="text-white/70 text-sm">Snapshots</div>
                    <div className="text-2xl font-bold text-purple-400">{stats.snapshots}</div>
                  </div>
                </div>
              )}

              {/* Content based on active tab */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="p-6">
                  <div className="text-white text-lg font-semibold mb-4">
                    {activeTab === 'instances' && 'Instances'}
                    {activeTab === 'templates' && 'Templates'}
                    {activeTab === 'snapshots' && 'Snapshots'}
                    {activeTab === 'canvas' && 'Canvas'}
                    {activeTab === 'kanban' && 'Kanban Board'}
                    {activeTab === 'dgd' && 'DGD Panel'}
                  </div>
                  
                  <div className="text-white/70">
                    Content for {activeTab} will be rendered here
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UniverseInterface;