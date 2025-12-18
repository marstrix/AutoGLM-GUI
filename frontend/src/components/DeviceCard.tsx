import React, { useState } from 'react';
import { ConfirmDialog } from './ConfirmDialog';

interface DeviceCardProps {
  id: string;
  model: string;
  status: string;
  connectionType?: string;
  isInitialized: boolean;
  isActive: boolean;
  onClick: () => void;
  onConnectWifi?: () => Promise<void>;
  onDisconnectWifi?: () => Promise<void>;
}

export function DeviceCard({
  id,
  model,
  status,
  connectionType,
  isInitialized,
  isActive,
  onClick,
  onConnectWifi,
  onDisconnectWifi,
}: DeviceCardProps) {
  const isOnline = status === 'device';
  const isUsb = connectionType === 'usb';
  const isRemote = connectionType === 'remote';
  const [loading, setLoading] = useState(false);
  const [showWifiConfirm, setShowWifiConfirm] = useState(false);
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);

  const handleWifiClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (loading || !onConnectWifi) return;
    setShowWifiConfirm(true);
  };

  const handleDisconnectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (loading || !onDisconnectWifi) return;
    setShowDisconnectConfirm(true);
  };

  const handleConfirmWifi = async () => {
    setShowWifiConfirm(false);
    setLoading(true);
    try {
      if (onConnectWifi) {
        await onConnectWifi();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDisconnect = async () => {
    setShowDisconnectConfirm(false);
    setLoading(true);
    try {
      if (onDisconnectWifi) {
        await onDisconnectWifi();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            onClick();
          }
        }}
        className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer border relative group ${
          isActive
            ? 'bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/20'
            : 'bg-white dark:bg-gray-800 border-transparent hover:bg-gray-50 dark:hover:bg-gray-700/50'
        }`}
      >
        <div className="flex items-center gap-3">
          {/* 状态指示器 */}
          <div
            className={`w-2.5 h-2.5 rounded-full flex-shrink-0 transition-colors ${
              isOnline
                ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]'
                : 'bg-gray-300 dark:bg-gray-600'
            }`}
            title={isOnline ? '在线' : '离线'}
          />

          {/* 设备信息 */}
          <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
            <div className="flex items-center gap-2">
              <span
                className={`font-medium text-sm truncate ${
                  isActive ? 'text-white' : 'text-gray-900 dark:text-gray-100'
                }`}
              >
                {model || '未知设备'}
              </span>
            </div>
            <span
              className={`text-xs truncate font-mono ${
                isActive ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {id}
            </span>
          </div>

          {/* 操作按钮区 */}
          <div className="flex items-center gap-2">
            {isUsb && onConnectWifi && (
              <button
                type="button"
                onClick={handleWifiClick}
                disabled={loading}
                className={`p-1.5 rounded-lg transition-all flex items-center gap-1.5 text-xs font-medium border ${
                  isActive
                    ? 'bg-white/20 border-white/20 text-white hover:bg-white/30 disabled:opacity-50'
                    : 'bg-indigo-50 border-indigo-100 text-indigo-600 hover:bg-indigo-100 hover:border-indigo-200 dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-300 dark:hover:bg-indigo-900/50 disabled:opacity-50'
                }`}
                title="切换到 WiFi 连接"
              >
                {loading ? (
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
                    />
                  </svg>
                )}
              </button>
            )}

            {isRemote && onDisconnectWifi && (
              <button
                type="button"
                onClick={handleDisconnectClick}
                disabled={loading}
                className={`p-1.5 rounded-lg transition-all flex items-center gap-1.5 text-xs font-medium border ${
                  isActive
                    ? 'bg-white/20 border-white/20 text-white hover:bg-white/30 disabled:opacity-50'
                    : 'bg-red-50 border-red-100 text-red-600 hover:bg-red-100 hover:border-red-200 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/50 disabled:opacity-50'
                }`}
                title="断开 WiFi 连接"
              >
                {loading ? (
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            )}
          </div>

          {/* 初始化状态标识 */}
          {isInitialized && (
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                isActive
                  ? 'bg-white/20 text-white'
                  : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
              }`}
              title="已初始化"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={showWifiConfirm}
        title="切换到 WiFi 连接"
        content="确定要切换到 WiFi 连接吗？请确保设备和电脑在同一局域网下。"
        onConfirm={handleConfirmWifi}
        onCancel={() => setShowWifiConfirm(false)}
      />

      <ConfirmDialog
        isOpen={showDisconnectConfirm}
        title="断开 WiFi 连接"
        content="确定要断开 WiFi 连接吗？"
        onConfirm={handleConfirmDisconnect}
        onCancel={() => setShowDisconnectConfirm(false)}
      />
    </>
  );
}
