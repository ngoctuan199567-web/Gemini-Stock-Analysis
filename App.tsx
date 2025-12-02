import React, { useState, useCallback } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { analyzeStock } from './services/gemini';
import { StockData, AnalysisState } from './types';
import StockDashboard from './components/StockDashboard';

const App: React.FC = () => {
  const [ticker, setTicker] = useState('');
  const [state, setState] = useState<AnalysisState>({
    status: 'idle',
    data: null,
    error: null,
  });

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker.trim()) return;

    setState({ status: 'loading', data: null, error: null });

    try {
      const result = await analyzeStock(ticker);
      setState({ status: 'success', data: result, error: null });
    } catch (err: any) {
      setState({
        status: 'error',
        data: null,
        error: err.message || "分析股票失败，请检查代码或重试。",
      });
    }
  }, [ticker]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header / Search Area */}
        <div className="mb-10 text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              Gemini 智能股票分析师
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto">
              基于 Google Gemini AI 与实时搜索，提供精准的趋势预测、风险评估与关键技术位分析。
            </p>
          </div>

          <form onSubmit={handleSearch} className="relative max-w-lg mx-auto">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
              <div className="relative flex">
                <input
                  type="text"
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value)}
                  placeholder="请输入股票代码 (如: AAPL, 00700.HK, 600519)..."
                  className="w-full bg-slate-800 text-white border-0 rounded-l-lg py-4 pl-4 pr-12 focus:ring-0 focus:outline-none placeholder-slate-500 text-lg"
                  disabled={state.status === 'loading'}
                />
                <button
                  type="submit"
                  disabled={state.status === 'loading'}
                  className="bg-blue-600 hover:bg-blue-500 text-white rounded-r-lg px-6 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {state.status === 'loading' ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <Search size={24} />
                  )}
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-left px-1">
              支持: 美股、港股、A股、加密货币 (数据来源真实可信)
            </p>
          </form>
        </div>

        {/* Content Area */}
        <main>
          {state.status === 'idle' && (
            <div className="text-center py-20 opacity-50">
               <div className="inline-block p-6 rounded-full bg-slate-800 mb-4">
                  <Search size={48} className="text-slate-600" />
               </div>
               <p className="text-xl text-slate-500">请输入股票代码以生成专业报告</p>
            </div>
          )}

          {state.status === 'error' && (
            <div className="bg-rose-900/20 border border-rose-800 text-rose-200 p-6 rounded-xl text-center max-w-2xl mx-auto">
              <p className="text-lg font-semibold mb-2">分析失败</p>
              <p>{state.error}</p>
            </div>
          )}

          {state.status === 'loading' && (
             <div className="max-w-4xl mx-auto space-y-6">
                 {/* Skeleton Loading UI */}
                 <div className="h-32 bg-slate-800 rounded-2xl animate-pulse"></div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="h-48 bg-slate-800 rounded-xl animate-pulse"></div>
                    <div className="h-48 bg-slate-800 rounded-xl animate-pulse"></div>
                    <div className="h-48 bg-slate-800 rounded-xl animate-pulse"></div>
                 </div>
                 <div className="text-center text-slate-400 text-sm animate-pulse">
                    正在分析市场数据、读取最新图表并计算风险模型...
                 </div>
             </div>
          )}

          {state.status === 'success' && state.data && (
            <StockDashboard data={state.data} />
          )}
        </main>

      </div>
    </div>
  );
};

export default App;