import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Base English translations
const enTranslations = {
  "Dashboard": "Dashboard",
  "Upload & Scan": "Upload & Scan",
  "Reports": "Reports",
  "Trends": "Trends",
  "Family": "Family",
  "All Settings": "All Settings",
  "Sign Out": "Sign Out",
  "My Profile": "My Profile",
  "Language": "Language",
  "Security": "Security",
  "Notifications": "Notifications",
  "Appearance": "Appearance",
  "Help & Support": "Help & Support",
  "Edit name, email & photo": "Edit name, email & photo",
  "Change password & 2FA": "Change password & 2FA",
  "Email & push alerts": "Email & push alerts",
  "Light / Dark mode": "Light / Dark mode",
  "FAQ & contact us": "FAQ & contact us"
};

// Auto-generated language maps for the 20 requested languages
const resources = {
  en: { translation: enTranslations },
  hi: { 
    translation: {
      "Dashboard": "डैशबोर्ड", "Upload & Scan": "अपलोड और स्कैन", "Reports": "रिपोर्ट्स", "Trends": "रुझान", "Family": "परिवार",
      "All Settings": "सभी सेटिंग्स", "Sign Out": "साइन आउट", "My Profile": "मेरी प्रोफ़ाइल", "Language": "भाषा", "Security": "सुरक्षा",
      "Notifications": "सूचनाएं", "Appearance": "दिखावट", "Help & Support": "सहायता",
      "Edit name, email & photo": "नाम, ईमेल और फोटो संपादित करें", "Change password & 2FA": "पासवर्ड और 2FA बदलें", "Email & push alerts": "ईमेल और पुश अलर्ट", "Light / Dark mode": "लाइट / डार्क मोड", "FAQ & contact us": "सामान्य प्रश्न और संपर्क करें"
    }
  },
  gu: {
    translation: {
      "Dashboard": "ડેશબોર્ડ", "Upload & Scan": "અપલોડ અને સ્કેન", "Reports": "અહેવાલો", "Trends": "વલણો", "Family": "કુટુંબ",
      "All Settings": "બધા સેટિંગ્સ", "Sign Out": "સાઇન આઉટ", "My Profile": "મારી પ્રોફાઇલ", "Language": "ભાષા", "Security": "સુરક્ષા",
      "Notifications": "સૂચનાઓ", "Appearance": "દેખાવ", "Help & Support": "મદદ અને આધાર",
      "Edit name, email & photo": "નામ, ઇમેઇલ અને ફોટો સંપાદિત કરો", "Change password & 2FA": "પાસવર્ડ અને 2FA બદલો", "Email & push alerts": "ઇમેઇલ અને પુશ ચેતવણીઓ", "Light / Dark mode": "લાઇટ / ડાર્ક મોડ", "FAQ & contact us": "FAQ અને અમારો સંપર્ક કરો"
    }
  },
  mr: {
    translation: {
      "Dashboard": "डॅशबोर्ड", "Upload & Scan": "अपलोड आणि स्कॅन", "Reports": "अहवाल", "Trends": "कल", "Family": "कुटुंब",
      "All Settings": "सर्व सेटिंग्ज", "Sign Out": "साइन आउट", "My Profile": "माझी प्रोफाइल", "Language": "भाषा", "Security": "सुरक्षा",
      "Notifications": "सूचना", "Appearance": "देखावा", "Help & Support": "मदत आणि समर्थन",
      "Edit name, email & photo": "नाव, ईमेल आणि फोटो संपादित करा", "Change password & 2FA": "पासवर्ड आणि 2FA बदला", "Email & push alerts": "ईमेल आणि पुश अलर्ट", "Light / Dark mode": "लाइट / डार्क मोड", "FAQ & contact us": "नेहमी विचारले जाणारे प्रश्न आणि संपर्क"
    }
  },
  bn: {
    translation: {
      "Dashboard": "ড্যাশবোর্ড", "Upload & Scan": "আপলোড এবং স্ক্যান", "Reports": "রিপোর্ট", "Trends": "প্রবণতা", "Family": "পরিবার",
      "All Settings": "সব সেটিংস", "Sign Out": "সাইন আউট", "My Profile": "আমার প্রোফাইল", "Language": "ভাষা", "Security": "নিরাপত্তা",
      "Notifications": "বিজ্ঞপ্তি", "Appearance": "চেহারা", "Help & Support": "সাহায্য এবং সমর্থন",
      "Edit name, email & photo": "নাম, ইমেল এবং ছবি সম্পাদনা করুন", "Change password & 2FA": "পাসওয়ার্ড এবং 2FA পরিবর্তন করুন", "Email & push alerts": "ইমেল এবং পুশ সতর্কতা", "Light / Dark mode": "হালকা / অন্ধকার মোড", "FAQ & contact us": "FAQ এবং আমাদের সাথে যোগাযোগ করুন"
    }
  },
  pa: {
    translation: {
      "Dashboard": "ਡੈਸ਼ਬੋਰਡ", "Upload & Scan": "ਅੱਪਲੋਡ ਅਤੇ ਸਕੈਨ", "Reports": "ਰਿਪੋਰਟਾਂ", "Trends": "ਰੁਝਾਨ", "Family": "ਪਰਿਵਾਰ",
      "All Settings": "ਸਾਰੀਆਂ ਸੈਟਿੰਗਾਂ", "Sign Out": "ਸਾਈਨ ਆਉਟ", "My Profile": "ਮੇਰੀ ਪ੍ਰੋਫਾਈਲ", "Language": "ਭਾਸ਼ਾ", "Security": "ਸੁਰੱਖਿਆ",
      "Notifications": "ਸੂਚਨਾਵਾਂ", "Appearance": "ਦਿੱਖ", "Help & Support": "ਮਦਦ ਅਤੇ ਸਮਰਥਨ",
      "Edit name, email & photo": "ਨਾਮ, ਈਮੇਲ ਅਤੇ ਫੋਟੋ ਬਦਲੋ", "Change password & 2FA": "ਪਾਸਵਰਡ ਅਤੇ 2FA ਬਦਲੋ", "Email & push alerts": "ਈਮੇਲ ਅਤੇ ਪੁਸ਼ ਅਲਰਟ", "Light / Dark mode": "ਲਾਈਟ / ਡਾਰਕ ਮੋਡ", "FAQ & contact us": "ਅਕਸਰ ਪੁੱਛੇ ਜਾਂਦੇ ਸਵਾਲ ਅਤੇ ਸੰਪਰਕ"
    }
  },
  ta: {
    translation: {
      "Dashboard": "கட்டுப்பாட்டு அறை", "Upload & Scan": "பதிவேற்றம் & ஸ்கேன்", "Reports": "அறிக்கைகள்", "Trends": "போக்குகள்", "Family": "குடும்பம்",
      "All Settings": "அனைத்து அமைப்புகள்", "Sign Out": "வெளியேறு", "My Profile": "என் சுயவிவரம்", "Language": "மொழி", "Security": "பாதுகாப்பு",
      "Notifications": "அறிவிப்புகள்", "Appearance": "தோற்றம்", "Help & Support": "உதவி & ஆதரவு",
      "Edit name, email & photo": "பெயர், மின்னஞ்சல் & புகைப்படத்தை திருத்து", "Change password & 2FA": "கடவுச்சொல் & 2FA-ஐ மாற்று", "Email & push alerts": "மின்னஞ்சல் & புஷ் எச்சரிக்கைகள்", "Light / Dark mode": "ஒளி / இருண்ட பயன்முறை", "FAQ & contact us": "FAQ & எங்களை தொடர்பு கொள்ள"
    }
  },
  te: {
    translation: {
      "Dashboard": "డాష్‌బోర్డ్", "Upload & Scan": "అప్‌లోడ్ & స్కాన్", "Reports": "నివేదికలు", "Trends": "ట్రెండ్స్", "Family": "కుటుంబం",
      "All Settings": "అన్ని సెట్టింగ్‌లు", "Sign Out": "సైన్ అవుట్", "My Profile": "నా ప్రొఫైల్", "Language": "భాష", "Security": "భద్రత",
      "Notifications": "నోటిఫికేషన్‌లు", "Appearance": "స్వరూపం", "Help & Support": "సహాయం & మద్దతు",
      "Edit name, email & photo": "పేరు, ఇమెయిల్ & ఫోటోను సవరించండి", "Change password & 2FA": "పాస్‌వర్డ్ & 2FA మార్చండి", "Email & push alerts": "ఇమెయిల్ & పుష్ హెచ్చరికలు", "Light / Dark mode": "లైట్ / డార్క్ మోడ్", "FAQ & contact us": "FAQ & మమ్మల్ని సంప్రదించండి"
    }
  },
  ml: {
    translation: {
      "Dashboard": "ഡാഷ്‌ബോർഡ്", "Upload & Scan": "അപ്‌ലോഡ് & സ്കാൻ", "Reports": "റിപ്പോർട്ടുകൾ", "Trends": "ട്രെൻഡുകൾ", "Family": "കുടുംബം",
      "All Settings": "എല്ലാ ക്രമീകരണങ്ങളും", "Sign Out": "സൈൻ ഔട്ട്", "My Profile": "എന്റെ പ്രൊഫൈൽ", "Language": "ഭാഷ", "Security": "സുരക്ഷ",
      "Notifications": "അറിയിപ്പുകൾ", "Appearance": "രൂപം", "Help & Support": "സഹായവും പിന്തുണയും",
      "Edit name, email & photo": "പേരും ഇമെയിലും ഫോട്ടോയും തിരുത്തുക", "Change password & 2FA": "പാസ്‌വേഡും 2FA-യും മാറ്റുക", "Email & push alerts": "ഇമെയിൽ & പുഷ് അലേർട്ടുകൾ", "Light / Dark mode": "ലൈറ്റ് / ഡാർക്ക് മോഡ്", "FAQ & contact us": "പതിവുചോദ്യങ്ങളും ഞങ്ങളെ ബന്ധപ്പെടലും"
    }
  },
  kn: {
    translation: {
      "Dashboard": "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", "Upload & Scan": "ಅಪ್‌ಲೋಡ್ ಮತ್ತು ಸ್ಕ್ಯಾನ್", "Reports": "ವರದಿಗಳು", "Trends": "ಟ್ರೆಂಡ್‌ಗಳು", "Family": "ಕುಟುಂಬ",
      "All Settings": "ಎಲ್ಲಾ ಸೆಟ್ಟಿಂಗ್‌ಗಳು", "Sign Out": "ಸೈನ್ ಔಟ್", "My Profile": "ನನ್ನ ಪ್ರೊಫೈಲ್", "Language": "ಭಾಷೆ", "Security": "ಭದ್ರತೆ",
      "Notifications": "ಸೂಚನೆಗಳು", "Appearance": "ಗೋಚರತೆ", "Help & Support": "ಸಹಾಯ ಮತ್ತು ಬೆಂಬಲ",
      "Edit name, email & photo": "ಹೆಸರು, ಇಮೇಲ್ ಮತ್ತು ಫೋಟೋ ಬದಲಾಯಿಸಿ", "Change password & 2FA": "ಪಾಸ್‌ವರ್ಡ್ ಮತ್ತು 2FA ಬದಲಾಯಿಸಿ", "Email & push alerts": "ಇಮೇಲ್ ಮತ್ತು ಪುಶ್ ಎಚ್ಚರಿಕೆಗಳು", "Light / Dark mode": "ಲೈಟ್ / ಡಾರ್ಕ್ ಮೋಡ್", "FAQ & contact us": "FAQ ಮತ್ತು ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ"
    }
  },
  ur: {
    translation: {
      "Dashboard": "ڈیش بورڈ", "Upload & Scan": "اپ لوڈ اور اسکین", "Reports": "رپورٹس", "Trends": "رجحانات", "Family": "خاندان",
      "All Settings": "تمام ترتیبات", "Sign Out": "سائن آؤٹ", "My Profile": "میری پروفائل", "Language": "زبان", "Security": "سیکیورٹی",
      "Notifications": "اطلاعات", "Appearance": "ظاہری شکل", "Help & Support": "مدد اور معاونت",
      "Edit name, email & photo": "نام، ای میل اور تصویر میں ترمیم کریں", "Change password & 2FA": "پاس ورڈ اور 2FA تبدیل کریں", "Email & push alerts": "ای میل اور پش الرٹس", "Light / Dark mode": "لائٹ / ڈارک موڈ", "FAQ & contact us": "عام سوالات اور رابطہ"
    }
  },
  ja: {
    translation: {
      "Dashboard": "ダッシュボード", "Upload & Scan": "アップロードとスキャン", "Reports": "レポート", "Trends": "トレンド", "Family": "家族",
      "All Settings": "すべての設定", "Sign Out": "サインアウト", "My Profile": "マイプロフィール", "Language": "言語", "Security": "セキュリティ",
      "Notifications": "通知", "Appearance": "外観", "Help & Support": "サポート",
      "Edit name, email & photo": "名前、メール、写真を編集", "Change password & 2FA": "パスワードと2FAを変更", "Email & push alerts": "メールとプッシュ通知", "Light / Dark mode": "ライト/ダークモード", "FAQ & contact us": "FAQと連絡先"
    }
  },
  zh: {
    translation: {
      "Dashboard": "仪表板", "Upload & Scan": "上传和扫描", "Reports": "报告", "Trends": "趋势", "Family": "家庭",
      "All Settings": "所有设置", "Sign Out": "登出", "My Profile": "我的个人资料", "Language": "语言", "Security": "安全",
      "Notifications": "通知", "Appearance": "外观", "Help & Support": "帮助与支持",
      "Edit name, email & photo": "编辑姓名、电子邮件和照片", "Change password & 2FA": "更改密码和双因素验证", "Email & push alerts": "电子邮件和推送警报", "Light / Dark mode": "亮/暗模式", "FAQ & contact us": "常见问题与联系方式"
    }
  },
  ko: {
    translation: {
      "Dashboard": "대시보드", "Upload & Scan": "업로드 및 스캔", "Reports": "보고서", "Trends": "트렌드", "Family": "가족",
      "All Settings": "모든 설정", "Sign Out": "로그아웃", "My Profile": "내 프로필", "Language": "언어", "Security": "보안",
      "Notifications": "알림", "Appearance": "외관", "Help & Support": "도움말 및 지원",
      "Edit name, email & photo": "이름, 이메일 및 사진 편집", "Change password & 2FA": "비밀번호 및 2FA 변경", "Email & push alerts": "이메일 및 푸시 알림", "Light / Dark mode": "라이트 / 다크 모드", "FAQ & contact us": "FAQ 및 문의"
    }
  },
  ar: {
    translation: {
      "Dashboard": "لوحة القيادة", "Upload & Scan": "رفع ومسح", "Reports": "التقارير", "Trends": "الاتجاهات", "Family": "العائلة",
      "All Settings": "جميع الإعدادات", "Sign Out": "تسجيل خروج", "My Profile": "ملفي الشخصي", "Language": "اللغة", "Security": "الأمان",
      "Notifications": "الإشعارات", "Appearance": "المظهر", "Help & Support": "المساعدة والدعم",
      "Edit name, email & photo": "تعديل الاسم والبريد والصورة", "Change password & 2FA": "تغيير كلمة المرور و2FA", "Email & push alerts": "تنبيهات البريد والدفع", "Light / Dark mode": "الوضع الفاتح / الداكن", "FAQ & contact us": "الأسئلة الشائعة واتصل بنا"
    }
  },
  ru: {
    translation: {
      "Dashboard": "Панель управления", "Upload & Scan": "Загрузить и сканировать", "Reports": "Отчеты", "Trends": "Тенденции", "Family": "Семья",
      "All Settings": "Все настройки", "Sign Out": "Выйти", "My Profile": "Мой профиль", "Language": "Язык", "Security": "Безопасность",
      "Notifications": "Уведомления", "Appearance": "Внешний вид", "Help & Support": "Помощь и поддержка",
      "Edit name, email & photo": "Изменить имя, email и фото", "Change password & 2FA": "Изменить пароль и 2FA", "Email & push alerts": "Email и push-уведомления", "Light / Dark mode": "Светлый / Темный режим", "FAQ & contact us": "ЧАВО и контакты"
    }
  },
  es: {
    translation: {
      "Dashboard": "Panel de control", "Upload & Scan": "Cargar y escanear", "Reports": "Informes", "Trends": "Tendencias", "Family": "Familia",
      "All Settings": "Todos los ajustes", "Sign Out": "Cerrar sesión", "My Profile": "Mi perfil", "Language": "Idioma", "Security": "Seguridad",
      "Notifications": "Notificaciones", "Appearance": "Apariencia", "Help & Support": "Ayuda y soporte",
      "Edit name, email & photo": "Editar nombre, correo y foto", "Change password & 2FA": "Cambiar contraseña y 2FA", "Email & push alerts": "Alertas de correo y push", "Light / Dark mode": "Modo claro / oscuro", "FAQ & contact us": "Preguntas frecuentes y contacto"
    }
  },
  fr: {
    translation: {
      "Dashboard": "Tableau de bord", "Upload & Scan": "Télécharger et scanner", "Reports": "Rapports", "Trends": "Tendances", "Family": "Famille",
      "All Settings": "Tous les paramètres", "Sign Out": "Se déconnecter", "My Profile": "Mon profil", "Language": "Langue", "Security": "Sécurité",
      "Notifications": "Notifications", "Appearance": "Apparence", "Help & Support": "Aide et support",
      "Edit name, email & photo": "Modifier le nom, l'email et la photo", "Change password & 2FA": "Modifier le mot de passe et 2FA", "Email & push alerts": "Alertes par email et push", "Light / Dark mode": "Mode clair / sombre", "FAQ & contact us": "FAQ et contact"
    }
  },
  de: {
    translation: {
      "Dashboard": "Dashboard", "Upload & Scan": "Hochladen & Scannen", "Reports": "Berichte", "Trends": "Trends", "Family": "Familie",
      "All Settings": "Alle Einstellungen", "Sign Out": "Abmelden", "My Profile": "Mein Profil", "Language": "Sprache", "Security": "Sicherheit",
      "Notifications": "Benachrichtigungen", "Appearance": "Erscheinungsbild", "Help & Support": "Hilfe & Support",
      "Edit name, email & photo": "Name, E-Mail und Foto bearbeiten", "Change password & 2FA": "Passwort & 2FA ändern", "Email & push alerts": "E-Mail- und Push-Benachrichtigungen", "Light / Dark mode": "Hell- / Dunkelmodus", "FAQ & contact us": "FAQ & Kontakt"
    }
  },
  pt: {
    translation: {
      "Dashboard": "Painel de controle", "Upload & Scan": "Carregar e escanear", "Reports": "Relatórios", "Trends": "Tendências", "Family": "Família",
      "All Settings": "Todas as configurações", "Sign Out": "Sair", "My Profile": "Meu Perfil", "Language": "Idioma", "Security": "Segurança",
      "Notifications": "Notificações", "Appearance": "Aparência", "Help & Support": "Ajuda e Suporte",
      "Edit name, email & photo": "Editar nome, e-mail e foto", "Change password & 2FA": "Alterar senha e 2FA", "Email & push alerts": "Alertas de e-mail e push", "Light / Dark mode": "Modo claro / escuro", "FAQ & contact us": "FAQ e contato"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
