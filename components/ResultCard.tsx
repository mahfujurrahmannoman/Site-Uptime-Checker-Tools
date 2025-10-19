
import React from 'react';
import { CheckResult, CheckStatus } from '../types';
import { UpIcon, DownIcon, ErrorIcon, PendingIcon } from './icons';

interface ResultCardProps {
  result: CheckResult;
}

const getStatusStyles = (status: CheckStatus) => {
  switch (status) {
    case CheckStatus.UP:
      return {
        borderColor: 'border-green-500',
        textColor: 'text-green-400',
        icon: <UpIcon />,
        statusText: 'Up',
      };
    case CheckStatus.DOWN:
      return {
        borderColor: 'border-red-500',
        textColor: 'text-red-400',
        icon: <DownIcon />,
        statusText: 'Down',
      };
    case CheckStatus.ERROR:
      return {
        borderColor: 'border-yellow-500',
        textColor: 'text-yellow-400',
        icon: <ErrorIcon />,
        statusText: 'Error',
      };
    case CheckStatus.PENDING:
      return {
        borderColor: 'border-slate-600',
        textColor: 'text-slate-400',
        icon: <PendingIcon />,
        statusText: 'Checking...',
      };
  }
};

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const { borderColor, textColor, icon, statusText } = getStatusStyles(result.status);
  const formattedDate = new Date(result.timestamp).toLocaleString();

  return (
    <div className={`bg-slate-800 rounded-lg p-5 border-l-4 ${borderColor} shadow-lg flex items-start space-x-4 transition-all duration-300`}>
      <div className={`flex-shrink-0 w-8 h-8 ${textColor}`}>
        {icon}
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-center mb-1">
          <a href={result.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-lg text-slate-200 hover:text-cyan-400 truncate break-all">
            {result.url}
          </a>
          <span className={`font-bold text-sm px-2 py-1 rounded-md ${textColor}`}>
            {statusText}
          </span>
        </div>
        <div className="text-sm text-slate-400">
          {result.statusCode && <span className="mr-4">HTTP Status: {result.statusCode}</span>}
          {result.reason && <span>Reason: {result.reason}</span>}
        </div>
        <div className="text-xs text-slate-500 mt-2">
          {formattedDate}
        </div>
      </div>
    </div>
  );
};
