import React, { useState } from 'react';
import { Eye, Box, Layers, Sparkles, Settings, Play, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface ARVRMode {
  id: string;
  name: string;
  type: 'ar' | 'vr' | 'mixed';
  description: string;
  icon: React.ReactNode;
  isSupported: boolean;
  features: string[];
}

interface ARVRInterfaceProps {
  onModeChange?: (mode: ARVRMode) => void;
  onObjectManipulate?: (objectId: string, transform: any) => void;
}

const ARVRInterface: React.FC<ARVRInterfaceProps> = ({
  onModeChange,
  onObjectManipulate
}) => {
  const [currentMode, setCurrentMode] = useState<ARVRMode | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // AR/VR Modes
  const arvrModes: ARVRMode[] = [
    {
      id: 'ar-dashboard',
      name: 'AR Dashboard',
      type: 'ar',
      description: 'Visualize dashboards flutuando no espaço real',
      icon: <Eye className="w-6 h-6" />,
      isSupported: true,
      features: ['Spatial Tracking', 'Hand Gestures', 'Voice Commands', 'Real-time Data']
    },
    {
      id: 'vr-workspace',
      name: 'VR Workspace',
      type: 'vr',
      description: 'Imersão completa em ambiente virtual de trabalho',
      icon: <Box className="w-6 h-6" />,
      isSupported: true,
      features: ['360° Environment', 'Avatar Collaboration', '3D Navigation', 'Haptic Feedback']
    },
    {
      id: 'mixed-reality',
      name: 'Mixed Reality',
      type: 'mixed',
      description: 'Combinação de elementos reais e virtuais',
      icon: <Layers className="w-6 h-6" />,
      isSupported: false,
      features: ['Real-time Blending', 'Spatial Anchoring', 'Occlusion', 'Light Estimation']
    },
    {
      id: 'holographic-display',
      name: 'Holographic Display',
      type: 'ar',
      description: 'Projeções holográficas de dados e interfaces',
      icon: <Sparkles className="w-6 h-6" />,
      isSupported: false,
      features: ['Holographic Projection', '3D Holograms', 'Spatial Audio', 'Gesture Recognition']
    }
  ];

  const handleModeChange = (mode: ARVRMode) => {
    if (!mode.isSupported) {
      alert(`${mode.name} is not yet supported on this device.`);
      return;
    }

    setCurrentMode(mode);
    setIsActive(true);
    setIsLoading(true);

    // Simulate mode activation
    setTimeout(() => {
      setIsLoading(false);
      if (onModeChange) {
        onModeChange(mode);
      }
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Initializing {currentMode?.name}...
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Setting up immersive environment
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Immersive Interfaces (AR/VR)
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Experience data visualization in augmented and virtual reality
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isActive && currentMode && (
            <div className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-sm">
              <Play className="w-3 h-3 mr-1 inline" />
              {currentMode.name} Active
            </div>
          )}
          <button className="bg-white/10 border border-white/20 hover:bg-white/20 px-4 py-2 rounded-lg text-sm">
            <Settings className="w-4 h-4 mr-2 inline" />
            Settings
          </button>
        </div>
      </div>

      {/* AR/VR Modes */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Available Modes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {arvrModes.map((mode) => (
            <div
              key={mode.id}
              className={`p-6 rounded-lg border shadow-lg transition-all duration-300 ${
                mode.isSupported 
                  ? 'bg-white/10 border-white/20 hover:bg-white/20' 
                  : 'bg-gray-500/10 border-gray-500/20 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    mode.isSupported 
                      ? 'bg-blue-500/20' 
                      : 'bg-gray-500/20'
                  }`}>
                    {mode.icon}
                  </div>
                  <div>
                    <h4 className={`text-lg font-semibold ${
                      mode.isSupported 
                        ? 'text-gray-900 dark:text-white' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {mode.name}
                    </h4>
                    <p className={`text-sm ${
                      mode.isSupported 
                        ? 'text-gray-600 dark:text-gray-400' 
                        : 'text-gray-500 dark:text-gray-500'
                    }`}>
                      {mode.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!mode.isSupported && (
                    <div className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2 py-1 rounded text-xs">
                      <AlertCircle className="w-3 h-3 mr-1 inline" />
                      Coming Soon
                    </div>
                  )}
                  {mode.isSupported && (
                    <div className="bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-1 rounded text-xs">
                      <CheckCircle className="w-3 h-3 mr-1 inline" />
                      Available
                    </div>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Features
                </h5>
                <div className="flex flex-wrap gap-1">
                  {mode.features.map((feature) => (
                    <span key={feature} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  className="flex-1 bg-white/10 border border-white/20 hover:bg-white/20 px-4 py-2 rounded text-sm"
                  disabled={!mode.isSupported}
                >
                  <Settings className="w-4 h-4 mr-2 inline" />
                  Settings
                </button>
                <button
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                  onClick={() => handleModeChange(mode)}
                  disabled={!mode.isSupported || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 inline animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2 inline" />
                      Activate
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status */}
      {isActive && (
        <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-lg">
          <h3 className="text-lg font-semibold text-green-400 mb-2">
            {currentMode?.name} Active
          </h3>
          <p className="text-green-300">
            Immersive environment is ready. You can now interact with spatial objects and data visualizations.
          </p>
        </div>
      )}
    </div>
  );
};

export default ARVRInterface;