
import React, { useState, useCallback } from 'react';
import { checkWebsiteStatus } from './services/geminiService';
import { CheckResult, CheckStatus } from './types';
import { ResultCard } from './components/ResultCard';
import { LoadingIcon } from './components/icons';

const App: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [history, setHistory] = useState<CheckResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleUrlSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!url || isLoading) return;

    let formattedUrl = url;
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }
    
    // Basic URL validation
    try {
      new URL(formattedUrl);
    } catch (_) {
      setError("Please enter a valid URL.");
      return;
    }

    setIsLoading(true);
    setError(null);
    const newCheck: CheckResult = {
      url: formattedUrl,
      status: CheckStatus.PENDING,
      timestamp: Date.now(),
    };
    
    setHistory(prev => [newCheck, ...prev]);

    try {
      const result = await checkWebsiteStatus(formattedUrl);
      setHistory(prev =>
        prev.map(item =>
          item.timestamp === newCheck.timestamp
            ? { ...newCheck, ...result, timestamp: Date.now() }
            : item
        )
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setHistory(prev =>
        prev.map(item =>
          item.timestamp === newCheck.timestamp
            ? { ...newCheck, status: CheckStatus.ERROR, reason: errorMessage, timestamp: Date.now() }
            : item
        )
      );
    } finally {
      setIsLoading(false);
      setUrl('');
    }
  }, [url, isLoading]);

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans antialiased">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 text-transparent bg-clip-text mb-2">
            Site Status Checker
          </h1>
          <p className="text-lg text-slate-400">
            Instantly check if your website is up or down using the power of AI.
          </p>
        </header>

        <main>
          <div className="max-w-2xl mx-auto mb-12">
            <form onSubmit={handleUrlSubmit} className="relative">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="e.g., https://example.com"
                className="w-full pl-4 pr-32 py-4 rounded-full bg-slate-800 border border-slate-700 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-shadow duration-300 placeholder-slate-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center px-6 py-3 rounded-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-600 disabled:cursor-not-allowed font-semibold transition-colors duration-300"
                disabled={isLoading}
              >
                {isLoading ? <LoadingIcon /> : "Check"}
              </button>
            </form>
            {error && <p className="text-red-400 text-center mt-4">{error}</p>}
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            {history.map((result) => (
              <ResultCard key={result.timestamp} result={result} />
            ))}
             {history.length === 0 && (
                <div className="text-center py-10">
                    <p className="text-slate-500">Your check history will appear here.</p>
                </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
