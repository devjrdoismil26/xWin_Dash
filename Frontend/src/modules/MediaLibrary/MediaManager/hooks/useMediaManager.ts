import { useMediaOptimization } from './useMediaOptimization';
import { useMediaComments } from './useMediaComments';
import { useMediaSharing } from './useMediaSharing';
import { useMediaVersions } from './useMediaVersions';
import { useMediaUtils } from './useMediaUtils';

export const useMediaManager = () => {
  const optimization = useMediaOptimization();

  const comments = useMediaComments();

  const sharing = useMediaSharing();

  const versions = useMediaVersions();

  const utils = useMediaUtils();

  return {
    // Optimization
    optimizeMedia: optimization.optimize,
    batchOptimize: optimization.batchOptimizeMedia,
    
    // Comments
    comments: comments.comments,
    createComment: comments.createComment,
    getComments: comments.getComments,
    updateComment: comments.updateComment,
    deleteComment: comments.deleteComment,
    
    // Sharing
    shares: sharing.shares,
    shareMedia: sharing.share,
    getShares: sharing.getShares,
    updateShare: sharing.updateShare,
    deleteShare: sharing.deleteShare,
    
    // Versions
    versions: versions.versions,
    createVersion: versions.createVersion,
    getVersions: versions.getVersions,
    restoreVersion: versions.restoreVersion,
    deleteVersion: versions.deleteVersion,
    
    // Utils
    ...utils,
    
    // Combined loading/error states
    loading: optimization.loading || comments.loading || sharing.loading || versions.loading,
    error: optimization.error || comments.error || sharing.error || versions.error};
};
