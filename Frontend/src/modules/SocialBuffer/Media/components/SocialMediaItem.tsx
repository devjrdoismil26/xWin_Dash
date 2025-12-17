import React from 'react';
const SocialMediaItem = ({ item }) => (
  <div className="p-2 border rounded">{item?.title || 'Item'}</div>);

export default SocialMediaItem;
