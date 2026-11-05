import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, ShieldCheck, Database, GitBranch, Key, Zap } from 'lucide-react';

interface SetupGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SetupGuideModal: React.FC<SetupGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const sampleEnv = `# Required for AI Concierge Chatbot (Gemini 2.5 Flash)
GEMINI_API_KEY="your-gemini-api-key"

# Required for Supabase Database & Auth
VITE_SUPABASE_URL="https://your-project-ref.supabase.co"
VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# Required for Stripe Secure Payments
VITE_STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"

# Deployment URL
APP_URL="https://your-store.vercel.app"`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div 
        className="relative bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <div>
              <h2 className="text-lg font-bold font-display text-slate-950">
                Supabase, Vercel &amp; API Credentials Guide
              </h2>
              <p className="text-xs text-slate-500">
                Everything you need to connect your live database, payment gateway, and automated CI/CD
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Setup Guide"
            className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-8 overflow-y-auto max-h-[75vh]">
          {/* Section 1: Required Keys & Credentials Checklist */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
              <Key className="w-4 h-4 text-amber-600" />
              <span>1. Required API Keys &amp; Credentials Checklist</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {/* Gemini */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Google Gemini API</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Powers the 24/7 AI Customer Support concierge via <strong>gemini-2.5-flash</strong>.
                </p>
                <div className="font-mono text-[10px] text-slate-500 bg-white p-1.5 rounded border border-slate-200">
                  GEMINI_API_KEY
                </div>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-slate-900 font-semibold hover:underline"
                >
                  Get API Key <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Supabase */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Supabase Database</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Stores persistent orders, real-time tracking events, product inventory, and RLS policies.
                </p>
                <div className="font-mono text-[10px] text-slate-500 bg-white p-1.5 rounded border border-slate-200">
                  VITE_SUPABASE_URL<br />
                  VITE_SUPABASE_ANON_KEY
                </div>
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-slate-900 font-semibold hover:underline"
                >
                  Supabase Console <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Stripe */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Payment Gateway (Stripe)</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Authorizes credit/debit transactions, Apple Pay, and webhook confirmations.
                </p>
                <div className="font-mono text-[10px] text-slate-500 bg-white p-1.5 rounded border border-slate-200">
                  VITE_STRIPE_PUBLISHABLE_KEY<br />
                  STRIPE_SECRET_KEY
                </div>
                <a
                  href="https://dashboard.stripe.com/apikeys"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-slate-900 font-semibold hover:underline"
                >
                  Stripe Keys <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Section 2: Supabase Database Setup */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
              <Database className="w-4 h-4 text-emerald-600" />
              <span>2. Supabase Database Setup &amp; SQL Schema Execution</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-3">
              <ol className="list-decimal list-inside space-y-1.5 text-slate-700">
                <li>Create a free account or sign in at <strong>supabase.com</strong>.</li>
                <li>Click <strong>New Project</strong>, pick your organization, name it <code>aura-store</code>, and set a database password.</li>
                <li>In the left sidebar, click <strong>SQL Editor</strong> &gt; <strong>New Query</strong>.</li>
                <li>Open the included <code>supabase-schema.sql</code> file in this repository, copy its content, paste it into the editor, and click <strong>Run</strong>.</li>
                <li>Go to <strong>Project Settings</strong> &gt; <strong>API</strong> and copy your <strong>Project URL</strong> and <strong>anon public key</strong>.</li>
              </ol>

              <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                <span className="text-[11px] text-slate-500 font-mono">
                  Schema file available at: <code>/supabase-schema.sql</code>
                </span>
                <button
                  onClick={() => copyToClipboard('See /supabase-schema.sql in workspace', 'schema')}
                  className="px-3 py-1 bg-white border border-slate-300 rounded text-[11px] font-semibold text-slate-800 hover:bg-slate-100 flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === 'schema' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'schema' ? 'Copied path' : 'Copy schema location'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 3: Vercel & Git Deployment */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
              <GitBranch className="w-4 h-4 text-slate-900" />
              <span>3. Git Repository &amp; Public Vercel Deployment</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-3">
              <div className="space-y-1.5 text-slate-700">
                <p><strong>Step A: Push code to your Git provider (GitHub / GitLab):</strong></p>
                <pre className="p-2.5 bg-slate-900 text-slate-100 rounded-lg font-mono text-[11px] overflow-x-auto">
                  {`git init\ngit add .\ngit commit -m "feat: initial aura contemporary commerce release"\ngit remote add origin https://github.com/your-username/aura-store.git\ngit branch -M main\ngit push -u origin main`}
                </pre>
              </div>

              <div className="space-y-1.5 text-slate-700 pt-2">
                <p><strong>Step B: Connect to Vercel for Automated CI/CD Deployments:</strong></p>
                <ol className="list-decimal list-inside space-y-1 text-slate-600">
                  <li>Visit <strong>vercel.com/new</strong> and click <strong>Import</strong> next to your repository.</li>
                  <li>In the <strong>Environment Variables</strong> section, add the keys shown below.</li>
                  <li>Click <strong>Deploy</strong>. Vercel builds and issues your live production domain (e.g. <code>https://aura-store.vercel.app</code>) with instant push-to-deploy updates on every git commit.</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Section 4: Sample .env Configuration */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                4. Production Environment Variables Template (.env)
              </span>
              <button
                onClick={() => copyToClipboard(sampleEnv, 'env')}
                className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'env' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'env' ? 'Copied' : 'Copy .env snippet'}</span>
              </button>
            </div>

            <pre className="p-3.5 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] leading-relaxed overflow-x-auto">
              {sampleEnv}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Got it, Return to Store
          </button>
        </div>
      </div>
    </div>
  );
};
