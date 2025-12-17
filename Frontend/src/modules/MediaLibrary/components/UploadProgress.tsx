import React from 'react';

export const UploadProgress: React.FC = () => {
  const [progress] = React.useState(0);

  return (
            <div className=" ">$2</div><div className=" ">$2</div><span className="text-sm text-white">Enviando arquivos...</span>
        <span className="text-sm text-gray-400">{progress}%</span></div><div className=" ">$2</div><div
          className="h-full bg-blue-500 transition-all duration-300"
          style={width: `${progress} %` } / />
           
        </div></div>);};
