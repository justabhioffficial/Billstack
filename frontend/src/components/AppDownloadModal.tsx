import React, { useState, useEffect } from 'react';
import { X, Download, Smartphone, QrCode, CheckCircle2, Apple, Play, Sparkles, Share2, Copy, Check, ExternalLink } from 'lucide-react';
import { analytics } from '../services/analytics';

interface AppDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppDownloadModal: React.FC<AppDownloadModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!isOpen) return null;

  const handleInstallPWA = async () => {
    analytics.trackAppDownload('pwa');
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setIsInstalled(true);
        }
        setDeferredPrompt(null);
        return;
      } catch (err) {
        console.error("Install prompt error:", err);
      }
    }
    
    // Direct Standalone App Package Download fallback
    handleDownloadAppPackage();
  };

  const handleDownloadAppPackage = () => {
    analytics.trackAppDownload('launcher_package');
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>BillStack App Launcher</title>
  <link rel="manifest" href="${currentUrl}/manifest.json">
  <meta name="theme-color" content="#0f172a">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #090d16;
      color: #ffffff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      text-align: center;
      padding: 20px;
    }
    .card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 16px;
      padding: 28px;
      max-width: 420px;
      box-shadow: 0 12px 30px rgba(0,0,0,0.6);
    }
    .logo {
      width: 56px;
      height: 56px;
      background: #4f46e5;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px auto;
      font-size: 28px;
    }
    .btn {
      background: #4f46e5;
      color: #ffffff;
      font-weight: bold;
      border: none;
      padding: 14px 24px;
      border-radius: 10px;
      cursor: pointer;
      font-size: 16px;
      margin-top: 20px;
      width: 100%;
      text-decoration: none;
      display: block;
      box-sizing: border-box;
    }
    .btn:hover { background: #4338ca; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">🧾</div>
    <h2 style="margin:0 0 8px 0; font-size:22px;">BillStack SaaS App</h2>
    <p style="color:#94a3b8; font-size: 14px; line-height: 1.5; margin:0;">
      Opening your local BillStack Expense Management workspace...
    </p>
    <a href="${currentUrl}" class="btn">Launch BillStack App</a>
  </div>
  <script>
    setTimeout(function() {
      window.location.href = "${currentUrl}";
    }, 800);
  </script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const element = document.createElement('a');
    element.href = url;
    element.download = "BillStack-App-Launcher.html";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareApp = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'BillStack Expense Management',
          text: 'Manage receipts, invoices, and AI financial digests with BillStack!',
          url: currentUrl,
        });
      } catch (e) {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden space-y-0 relative">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white flex items-center justify-between relative">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-white/10 rounded-xl text-indigo-300">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Get BillStack App</h2>
              <p className="text-xs text-indigo-200">Available on Web, Android, iOS & Desktop</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-indigo-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Download Notification Banner */}
          {downloadSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2 text-emerald-800 text-xs font-semibold animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>BillStack App Package downloaded! Open file to launch app window.</span>
            </div>
          )}

          {/* Quick Install Banner */}
          <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-600 text-white rounded-lg">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm">Progressive Web App (PWA)</div>
                <div className="text-xs text-slate-500">Offline OCR camera scan & instant desktop shortcut</div>
              </div>
            </div>
            <button
              onClick={handleInstallPWA}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors shadow-xs flex items-center space-x-1.5 shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isInstalled ? 'Installed' : 'Install PWA'}</span>
            </button>
          </div>

          {/* Download Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Direct App Package Download */}
            <button
              onClick={handleDownloadAppPackage}
              className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 transition-all text-left space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <Play className="w-5 h-5" />
                </div>
                <Download className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-xs">Download App Package</div>
                <div className="text-[11px] text-slate-500">Standalone Launcher • Multi-Device</div>
              </div>
            </button>

            {/* iOS / Mobile Safari Guidance */}
            <button
              onClick={handleShareApp}
              className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 transition-all text-left space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <div className="p-2 bg-slate-100 text-slate-800 rounded-lg">
                  <Apple className="w-5 h-5" />
                </div>
                <Share2 className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-xs">Share / Install iOS & Android</div>
                <div className="text-[11px] text-slate-500">Send App Link to Phone</div>
              </div>
            </button>
          </div>

          {/* QR Code Phone Sync Box */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-4">
            <div className="space-y-1.5 min-w-0">
              <div className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                <QrCode className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Scan QR Code to Open App</span>
              </div>
              <p className="text-[11px] text-slate-500 max-w-xs leading-relaxed">
                Scan with mobile camera to open this BillStack server on your device.
              </p>
              <div className="pt-1 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-2.5 py-1 bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 text-[11px] font-semibold rounded-md flex items-center gap-1 shadow-2xs transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-indigo-600" />}
                  <span>{copied ? 'Copied Link!' : 'Copy App Link'}</span>
                </button>
                <span className="text-[10px] text-slate-400 font-mono truncate max-w-[140px]">{currentUrl}</span>
              </div>
            </div>

            {/* Dynamic QR Code Encoding Live currentUrl */}
            <div className="w-20 h-20 bg-white p-1.5 border border-slate-200 rounded-xl shrink-0 flex items-center justify-center shadow-xs">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(currentUrl)}`}
                alt="BillStack Mobile App QR Code"
                className="w-full h-full object-contain rounded-md"
              />
            </div>
          </div>

          {/* Platform Capability List */}
          <div className="space-y-1.5 pt-1 text-xs text-slate-600">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Full Cross-Platform Sync (Web Browser, Mobile PWA & Desktop App)</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Automatic Receipt Camera Scanning & Offline Sync</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

