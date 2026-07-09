"use client";

import { useState, useEffect } from "react";
import { Shield, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type ConsentChoice = "accepted" | "rejected" | "customized";

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Show banner after a short delay
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = (choice: ConsentChoice) => {
    const data = {
      choice,
      preferences,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("cookie-consent", JSON.stringify(data));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 animate-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl shadow-black/15 border border-gray-100 overflow-hidden">
        {/* Main banner */}
        {!showCustomize ? (
          <div className="p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#0B3D2E] flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-[#EAB308]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-gray-900 mb-1">
                  We value your privacy
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  We use cookies to enhance your browsing experience, serve personalized content,
                  and analyze our traffic. By clicking &quot;Accept All&quot;, you consent to our use of cookies.
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  <Button
                    onClick={() => saveConsent("accepted")}
                    className="bg-[#0B3D2E] hover:bg-[#145A44] text-white text-xs font-semibold h-9 px-4 rounded-lg"
                  >
                    Accept All
                  </Button>
                  <Button
                    onClick={() => saveConsent("rejected")}
                    variant="outline"
                    className="text-xs font-semibold h-9 px-4 rounded-lg border-gray-200"
                  >
                    Reject Non-Essential
                  </Button>
                  <button
                    onClick={() => setShowCustomize(true)}
                    className="text-xs text-[#0B3D2E] font-medium hover:underline flex items-center gap-0.5"
                  >
                    Customize
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <button
                onClick={() => saveConsent("rejected")}
                className="text-gray-300 hover:text-gray-500 shrink-0 p-1"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Customize panel */
          <div className="p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#0B3D2E]" />
                <h3 className="text-sm font-bold text-gray-900">Cookie Preferences</h3>
              </div>
              <button
                onClick={() => setShowCustomize(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 mb-5">
              {[
                {
                  key: "essential" as const,
                  label: "Essential Cookies",
                  desc: "Required for the website to function properly. Cannot be disabled.",
                  disabled: true,
                },
                {
                  key: "analytics" as const,
                  label: "Analytics Cookies",
                  desc: "Help us understand how visitors interact with our website.",
                  disabled: false,
                },
                {
                  key: "marketing" as const,
                  label: "Marketing Cookies",
                  desc: "Used to track visitors across websites for advertising purposes.",
                  disabled: false,
                },
              ].map((cookie) => (
                <div
                  key={cookie.key}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{cookie.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{cookie.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
                    <input
                      type="checkbox"
                      checked={preferences[cookie.key]}
                      disabled={cookie.disabled}
                      onChange={() =>
                        setPreferences({
                          ...preferences,
                          [cookie.key]: !preferences[cookie.key],
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-checked:bg-[#0B3D2E] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-disabled:opacity-50" />
                  </label>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => saveConsent("customized")}
                className="bg-[#0B3D2E] hover:bg-[#145A44] text-white text-xs font-semibold h-9 px-4 rounded-lg"
              >
                Save Preferences
              </Button>
              <Button
                onClick={() => setShowCustomize(false)}
                variant="outline"
                className="text-xs font-semibold h-9 px-4 rounded-lg border-gray-200"
              >
                Back
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}