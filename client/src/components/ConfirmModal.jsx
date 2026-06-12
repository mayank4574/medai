import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, AlertOctagon, Info, CheckCircle2, Loader2 } from 'lucide-react';

const LOCALIZATION = {
  en: {
    deleteReport: {
      title: 'Delete Report',
      description: 'This action cannot be undone. The report and all associated analysis data will be permanently removed.',
      confirm: 'Delete Report',
    },
    deleteFamily: {
      title: 'Delete Family Member',
      description: 'Removing this family profile will also remove associated report history.',
      confirm: 'Delete Member',
    },
    logoutAll: {
      title: 'Logout All Sessions',
      description: 'You will be signed out from all devices except the current session.',
      confirm: 'Logout All',
    },
    markRead: {
      title: 'Mark All Read',
      description: 'Are you sure you want to mark all notifications as read?',
      confirm: 'Mark All Read',
    },
    cancel: 'Cancel',
    ok: 'OK',
    close: 'Close',
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Information',
  },
  ja: {
    deleteReport: {
      title: 'レポートの削除',
      description: 'この操作は取り消せません。レポートと関連するすべての分析データは完全に削除されます。',
      confirm: 'レポートを削除',
    },
    deleteFamily: {
      title: '家族メンバーの削除',
      description: 'この家族のプロフィールを削除すると、関連するレポート履歴も削除されます。',
      confirm: 'メンバーを削除',
    },
    logoutAll: {
      title: 'すべてのセッションからログアウト',
      description: '現在のセッション以外のすべてのデバイスからサインアウトされます。',
      confirm: 'すべてログアウト',
    },
    markRead: {
      title: 'すべて既読にする',
      description: 'すべての通知を既読にしてもよろしいですか？',
      confirm: 'すべて既読',
    },
    cancel: 'キャンセル',
    ok: 'OK',
    close: '閉じる',
    success: '成功',
    error: 'エラー',
    warning: '警告',
    info: '情報',
  },
  hi: {
    deleteReport: {
      title: 'रिपोर्ट हटाएं',
      description: 'यह क्रिया पूर्ववत नहीं की जा सकती। रिपोर्ट और सभी संबंधित विश्लेषण डेटा स्थायी रूप से हटा दिए जाएंगे।',
      confirm: 'रिपोर्ट हटाएं',
    },
    deleteFamily: {
      title: 'पारिवारिक सदस्य हटाएं',
      description: 'इस पारिवारिक प्रोफ़ाइल को हटाने से संबंधित रिपोर्ट इतिहास भी हटा दिया जाएगा।',
      confirm: 'सदस्य हटाएं',
    },
    logoutAll: {
      title: 'सभी डिवाइसों से लॉगआउट करें',
      description: 'आप वर्तमान सत्र को छोड़कर अन्य सभी उपकरणों से साइन आउट हो जाएंगे।',
      confirm: 'सभी से लॉगआउट',
    },
    markRead: {
      title: 'सभी को पढ़ा हुआ चिह्नित करें',
      description: 'क्या आप वाकई सभी सूचनाओं को पढ़ा हुआ चिह्नित करना चाहते हैं?',
      confirm: 'सभी को पढ़ें',
    },
    cancel: 'रद्द करें',
    ok: 'ठीक है',
    close: 'बंद करें',
    success: 'सफलता',
    error: 'त्रुटि',
    warning: 'चेतावनी',
    info: 'जानकारी',
  },
  gu: {
    deleteReport: {
      title: 'રિપોર્ટ કાઢી નાખો',
      description: 'આ પ્રક્રિયાને પૂર્વવત કરી શકાતી નથી. રિપોર્ટ અને સંબંધિત તમામ વિશ્લેષણ ડેટા કાયમી ધોરણે દૂર કરવામાં આવશે.',
      confirm: 'રિપોર્ટ કાઢી નાખો',
    },
    deleteFamily: {
      title: 'પરિવારના સભ્યને કાઢી નાખો',
      description: 'આ પ્રોફાઇલને કાઢી નાખવાથી તેની સાથે જોડાયેલ તમામ અહેવાલ ઇતિહાસ પણ કાઢી નાખવામાં આવશે.',
      confirm: 'સભ્ય કાઢી નાખો',
    },
    logoutAll: {
      title: 'તમામ ઉપકરણોમાંથી લોગઆઉટ',
      description: 'તમે વર્તમાન સત્ર સિવાયના તમામ ઉપકરણોમાંથી સાઇન આઉટ થઈ જશો.',
      confirm: 'બધા લોગઆઉટ',
    },
    markRead: {
      title: 'બધા વાંચેલા તરીકે ચિહ્નિત કરો',
      description: 'શું તમે ખરેખર બધી સૂચનાઓને વાંચેલી તરીકે ચિહ્નિત કરવા માંગો છો?',
      confirm: 'બધા વાંચો',
    },
    cancel: 'રદ કરો',
    ok: 'બરાબર',
    close: 'બંધ કરો',
    success: 'સફળતા',
    error: 'ભૂલ',
    warning: 'ચેતવણી',
    info: 'માહિતી',
  },
  fr: {
    deleteReport: {
      title: 'Supprimer le rapport',
      description: 'Cette action ne peut pas être annulée. Le rapport et toutes les données d\'analyse associées seront définitivement supprimés.',
      confirm: 'Supprimer le rapport',
    },
    deleteFamily: {
      title: 'Supprimer le membre',
      description: 'La suppression de ce profil familial supprimera également l\'historique des rapports associés.',
      confirm: 'Supprimer le membre',
    },
    logoutAll: {
      title: 'Déconnecter toutes les sessions',
      description: 'Vous serez déconnecté de tous les appareils à l\'exception de la session en cours.',
      confirm: 'Tout déconnecter',
    },
    markRead: {
      title: 'Tout marquer comme lu',
      description: 'Êtes-vous sûr de vouloir marquer toutes les notifications comme lues ?',
      confirm: 'Tout marquer comme lu',
    },
    cancel: 'Annuler',
    ok: 'OK',
    close: 'Fermer',
    success: 'Succès',
    error: 'Erreur',
    warning: 'Avertissement',
    info: 'Information',
  }
};

export const getLocalizedText = (key, subKey, langCode) => {
  const code = langCode || 'en';
  const dictionary = LOCALIZATION[code] || LOCALIZATION.en;
  
  if (subKey && dictionary[key]) {
    return dictionary[key][subKey] || LOCALIZATION.en[key]?.[subKey] || '';
  }
  return dictionary[key] || LOCALIZATION.en[key] || '';
};

export default function ConfirmModal({
  isOpen,
  type = 'confirm', // 'confirm' | 'success' | 'error'
  title: propTitle,
  description: propDescription,
  variant: propVariant, // 'danger' | 'warning' | 'info' | 'success'
  confirmText: propConfirmText,
  cancelText: propCancelText,
  onConfirm,
  onClose,
  isLoading = false,
  lang = 'en',
  contextKey,
}) {
  const modalRef = useRef(null);
  
  // Resolve language and custom texts
  const resolvedLang = lang || 'en';
  let title = propTitle;
  let description = propDescription;
  let confirmText = propConfirmText;
  let cancelText = propCancelText || getLocalizedText('cancel', null, resolvedLang);

  if (contextKey) {
    title = title || getLocalizedText(contextKey, 'title', resolvedLang);
    description = description || getLocalizedText(contextKey, 'description', resolvedLang);
    confirmText = confirmText || getLocalizedText(contextKey, 'confirm', resolvedLang);
  }

  // Fallback defaults based on type
  if (type === 'success') {
    title = title || getLocalizedText('success', null, resolvedLang);
    confirmText = confirmText || getLocalizedText('ok', null, resolvedLang);
  } else if (type === 'error') {
    title = title || getLocalizedText('error', null, resolvedLang);
    confirmText = confirmText || getLocalizedText('close', null, resolvedLang);
  } else {
    title = title || 'Confirm';
    confirmText = confirmText || getLocalizedText('ok', null, resolvedLang);
  }

  // Determine variant theme
  const variant = propVariant || (type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info');

  const variantStyles = {
    danger: {
      icon: AlertOctagon,
      pulseColor: 'bg-red-500/20 dark:bg-red-500/10',
      iconContainer: 'bg-red-50 dark:bg-red-950/40 border-red-200/50 dark:border-red-800/40 text-red-500 dark:text-red-400',
      btnConfirm: 'bg-red-600 hover:bg-red-500 active:bg-red-700 text-white shadow-lg shadow-red-600/15 dark:shadow-red-900/20 focus:ring-red-500',
    },
    warning: {
      icon: AlertTriangle,
      pulseColor: 'bg-amber-500/20 dark:bg-amber-500/10',
      iconContainer: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200/50 dark:border-amber-800/40 text-amber-600 dark:text-amber-400',
      btnConfirm: 'bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white shadow-lg shadow-amber-600/15 dark:shadow-amber-900/20 focus:ring-amber-500',
    },
    info: {
      icon: Info,
      pulseColor: 'bg-blue-500/20 dark:bg-blue-500/10',
      iconContainer: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200/50 dark:border-blue-800/40 text-primary dark:text-blue-400',
      btnConfirm: 'bg-primary hover:bg-primary-hover active:bg-primary-hover/90 text-white shadow-lg shadow-blue-600/15 dark:shadow-blue-900/20 focus:ring-primary',
    },
    success: {
      icon: CheckCircle2,
      pulseColor: 'bg-green-500/20 dark:bg-green-500/10',
      iconContainer: 'bg-green-50 dark:bg-green-950/40 border-green-200/50 dark:border-green-800/40 text-green-600 dark:text-green-400',
      btnConfirm: 'bg-green-600 hover:bg-green-500 active:bg-green-700 text-white shadow-lg shadow-green-600/15 dark:shadow-green-900/20 focus:ring-green-500',
    }
  };

  const currentStyle = variantStyles[variant] || variantStyles.info;
  const Icon = currentStyle.icon;

  useEffect(() => {
    if (!isOpen) return;

    // Body scroll lock
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      // ESC closes
      if (e.key === 'Escape' && !isLoading) {
        onClose();
        return;
      }

      // Enter confirms if focused elsewhere
      if (e.key === 'Enter') {
        const activeTagName = document.activeElement?.tagName?.toLowerCase();
        if (activeTagName !== 'button') {
          e.preventDefault();
          if (type === 'confirm') {
            onConfirm();
          } else {
            onClose();
          }
        }
      }

      // Focus trap cycling
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Initial focus on open
    setTimeout(() => {
      if (modalRef.current) {
        const confirmBtn = modalRef.current.querySelector('[data-confirm-btn]');
        if (confirmBtn) {
          confirmBtn.focus();
        }
      }
    }, 50);

    return () => {
      document.body.style.overflow = originalStyle;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isLoading, onClose, onConfirm, type]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop Fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md"
            onClick={() => {
              if (!isLoading) onClose();
            }}
          />

          {/* Modal Card Scale/Slide */}
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: 'spring', duration: 0.35 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200/50 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 shadow-2xl flex flex-col items-center text-center max-h-[90vh]"
          >
            {/* Contextual light glow */}
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
              variant === 'danger' ? 'bg-red-500/10' :
              variant === 'warning' ? 'bg-amber-500/10' :
              variant === 'success' ? 'bg-green-500/10' : 'bg-blue-500/10'
            }`} />

            {/* Circular Pulse Warning Icon */}
            <div className="relative mb-5 flex items-center justify-center shrink-0">
              <div className={`absolute w-14 h-14 rounded-full animate-ping pointer-events-none ${currentStyle.pulseColor}`} style={{ animationDuration: '2.5s' }} />
              <div className={`relative w-14 h-14 rounded-full border flex items-center justify-center shadow-inner ${currentStyle.iconContainer}`}>
                <Icon size={26} className="animate-pulse" style={{ animationDuration: '3.5s' }} />
              </div>
            </div>

            {/* Title */}
            <h2 id="modal-title" className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2 tracking-tight shrink-0">
              {title}
            </h2>

            {/* Content Overflow Area */}
            <div className="overflow-y-auto mb-6 max-h-[40vh] w-full px-2">
              <p id="modal-description" className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
                {description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full shrink-0">
              {type === 'confirm' && (
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={onClose}
                  className="flex-1 order-2 sm:order-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 text-sm font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                >
                  {cancelText}
                </button>
              )}
              <button
                type="button"
                data-confirm-btn
                disabled={isLoading}
                onClick={type === 'confirm' ? onConfirm : onClose}
                className={`flex-1 order-1 sm:order-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${currentStyle.btnConfirm}`}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>{confirmText}</span>
                  </>
                ) : (
                  confirmText
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
