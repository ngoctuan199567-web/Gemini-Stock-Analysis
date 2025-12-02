import React from 'react';
import { StockData } from '../types';
import PriceChart from './PriceChart';
import AnalysisCard from './AnalysisCard';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart2, 
  ShieldAlert, 
  Target, 
  Activity, 
  ExternalLink,
  Info,
  Table as TableIcon
} from 'lucide-react';

interface StockDashboardProps {
  data: StockData;
}

const StockDashboard: React.FC<StockDashboardProps> = ({ data }) => {
  const isPositive = data.changeAmount >= 0;
  const priceColor = isPositive ? "#10b981" : "#f43f5e"; // emerald-500 : rose-500

  // Helper to translate Action
  const getActionLabel = (action: string) => {
    switch(action?.toLowerCase()) {
      case 'buy': return '买入';
      case 'sell': return '卖出';
      case 'hold': return '持有';
      case 'wait': return '观望';
      default: return action;
    }
  };

  // Helper to translate Risk
  const getRiskLabel = (level: string) => {
    switch(level?.toLowerCase()) {
      case 'low': return '低风险';
      case 'medium': return '中等风险';
      case 'high': return '高风险';
      case 'very high': return '极高风险';
      default: return level;
    }
  };

  // Reverse history for table display (Newest first)
  const reversedHistory = [...data.history].reverse();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              {data.symbol} 
              <span className="text-lg font-normal text-slate-400 bg-slate-700 px-2 py-0.5 rounded-md">
                {data.companyName}
              </span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              最后更新: {data.lastUpdated} | 货币: {data.currency}
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-white">
              {data.currentPrice.toFixed(2)}
            </div>
            <div className={`flex items-center justify-end gap-1 font-medium ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
              <span>{data.changeAmount > 0 ? '+' : ''}{data.changeAmount.toFixed(2)}</span>
              <span>({data.changePercent > 0 ? '+' : ''}{data.changePercent.toFixed(2)}%)</span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="mt-8">
            <PriceChart data={data.history} color={priceColor} />
        </div>
      </div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Trend Analysis */}
        <AnalysisCard 
          title="趋势分析 (含压力/支撑)" 
          icon={<TrendingUp size={18} className="text-blue-400" />}
        >
          <div className="space-y-3">
            <p className="font-medium text-white">{data.trendAnalysis.summary}</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-slate-700/50 p-2 rounded">
                <span className="block text-slate-400 text-xs">支撑位 (Support)</span>
                {data.trendAnalysis.supportLevels.map((l, i) => (
                  <span key={i} className="block text-emerald-400 font-mono">{l}</span>
                ))}
              </div>
              <div className="bg-slate-700/50 p-2 rounded">
                <span className="block text-slate-400 text-xs">压力位 (Resistance)</span>
                {data.trendAnalysis.resistanceLevels.map((l, i) => (
                  <span key={i} className="block text-rose-400 font-mono">{l}</span>
                ))}
              </div>
            </div>
          </div>
        </AnalysisCard>

        {/* Volume Analysis */}
        <AnalysisCard 
          title="成交量分析" 
          icon={<BarChart2 size={18} className="text-purple-400" />}
        >
           <div className="space-y-2">
            <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                <span className="text-slate-400">近期成交量</span>
                <span className="text-white font-mono">{data.volumeAnalysis.volume}</span>
            </div>
            <p className="text-sm leading-relaxed">
                {data.volumeAnalysis.assessment}
            </p>
           </div>
        </AnalysisCard>

        {/* Risk Assessment */}
        <AnalysisCard 
          title="风险评估" 
          icon={<ShieldAlert size={18} className="text-orange-400" />}
        >
           <div className="space-y-3">
             <div className="flex items-center justify-between">
                <span className="text-slate-400">风险等级</span>
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase
                  ${data.riskAssessment.riskLevel === 'Low' ? 'bg-emerald-500/20 text-emerald-400' : 
                    data.riskAssessment.riskLevel === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' : 
                    'bg-rose-500/20 text-rose-400'}`}>
                    {getRiskLabel(data.riskAssessment.riskLevel)}
                </span>
             </div>
             <p className="text-sm text-slate-300">{data.riskAssessment.description}</p>
             <p className="text-xs text-slate-500 mt-2">波动率分析: {data.riskAssessment.volatility}</p>
           </div>
        </AnalysisCard>

        {/* Price Targets */}
        <AnalysisCard 
          title="目标价位" 
          icon={<Target size={18} className="text-cyan-400" />}
        >
          <div className="space-y-4">
            <div>
                <span className="text-xs text-slate-400 uppercase tracking-wide">短期目标 (1-4 周)</span>
                <p className="text-lg font-bold text-white">{data.priceTargets.shortTerm}</p>
            </div>
            <div>
                <span className="text-xs text-slate-400 uppercase tracking-wide">中期目标 (1-3 月)</span>
                <p className="text-lg font-bold text-white">{data.priceTargets.midTerm}</p>
            </div>
          </div>
        </AnalysisCard>

        {/* Technical Levels */}
        <AnalysisCard 
          title="关键技术位" 
          icon={<Activity size={18} className="text-indigo-400" />}
        >
           <p className="text-sm mb-3">{data.technicalLevels.summary}</p>
           <div className="flex flex-wrap gap-2">
             {data.technicalLevels.indicators.map((ind, i) => (
                <span key={i} className="bg-slate-700 px-2 py-1 rounded text-xs text-slate-200 border border-slate-600">
                    {ind}
                </span>
             ))}
           </div>
        </AnalysisCard>

        {/* Trading Advice */}
        <AnalysisCard 
          title="具体交易建议" 
          icon={<Info size={18} className={
             data.tradingAdvice.action === 'Buy' ? 'text-emerald-400' :
             data.tradingAdvice.action === 'Sell' ? 'text-rose-400' : 'text-yellow-400'
          } />}
          className="border-2 border-slate-600 md:col-span-2 lg:col-span-1"
        >
           <div className="space-y-3">
              <div className="flex justify-between items-center">
                 <span className="text-slate-400">操作建议</span>
                 <span className={`text-lg font-bold uppercase ${
                    data.tradingAdvice.action === 'Buy' ? 'text-emerald-400' :
                    data.tradingAdvice.action === 'Sell' ? 'text-rose-400' : 'text-yellow-400'
                 }`}>
                    {getActionLabel(data.tradingAdvice.action)}
                 </span>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-slate-700 pt-3">
                  <div>
                      <span className="block text-xs text-slate-500 uppercase">建议入场区间</span>
                      <span className="text-sm font-mono text-white">{data.tradingAdvice.entryZone}</span>
                  </div>
                  <div>
                      <span className="block text-xs text-slate-500 uppercase">建议止损位</span>
                      <span className="text-sm font-mono text-rose-400">{data.tradingAdvice.stopLoss}</span>
                  </div>
              </div>
              <p className="text-sm italic text-slate-400 mt-2 bg-slate-900/50 p-2 rounded border border-slate-700/50">
                  "{data.tradingAdvice.rationale}"
              </p>
           </div>
        </AnalysisCard>
      </div>

      {/* Historical Data Table */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 border-b border-slate-700 flex items-center gap-2">
           <TableIcon size={20} className="text-slate-400" />
           <h3 className="font-bold text-white">历史行情 (Daily K-Line)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-400">
            <thead className="text-xs text-slate-200 uppercase bg-slate-700/50">
              <tr>
                <th scope="col" className="px-6 py-3">日期</th>
                <th scope="col" className="px-6 py-3">收盘价</th>
                <th scope="col" className="px-6 py-3">涨跌幅</th>
                <th scope="col" className="px-6 py-3">开盘价</th>
                <th scope="col" className="px-6 py-3">最高价</th>
                <th scope="col" className="px-6 py-3">最低价</th>
                <th scope="col" className="px-6 py-3">成交量</th>
                <th scope="col" className="px-6 py-3">成交额</th>
                <th scope="col" className="px-6 py-3">换手率</th>
              </tr>
            </thead>
            <tbody>
              {reversedHistory.map((item, index) => (
                <tr 
                    key={index} 
                    className={`border-b border-slate-700 hover:bg-slate-700/30 ${index === 0 ? 'bg-slate-700/30' : ''}`}
                >
                  <td className="px-6 py-4 font-medium text-white whitespace-nowrap">
                    {item.date}
                    {index === 0 && <span className="ml-2 text-xs bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded">最新</span>}
                  </td>
                  <td className="px-6 py-4 font-bold text-white">{item.close.toFixed(2)}</td>
                  <td className={`px-6 py-4 ${item.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {item.changePercent > 0 ? '+' : ''}{item.changePercent}%
                  </td>
                  <td className="px-6 py-4">{item.open.toFixed(2)}</td>
                  <td className="px-6 py-4 text-emerald-300/80">{item.high.toFixed(2)}</td>
                  <td className="px-6 py-4 text-rose-300/80">{item.low.toFixed(2)}</td>
                  <td className="px-6 py-4">{item.volume}</td>
                  <td className="px-6 py-4">{item.turnover}</td>
                  <td className="px-6 py-4">{item.turnoverRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sources */}
      {data.sources && data.sources.length > 0 && (
          <div className="pt-4 border-t border-slate-800">
            <h4 className="text-sm font-semibold text-slate-500 mb-3 flex items-center gap-2">
                <ExternalLink size={14} /> 数据出处 (Data Sources)
            </h4>
            <div className="flex flex-wrap gap-3">
                {data.sources.map((source, idx) => (
                    <a 
                        key={idx} 
                        href={source.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:text-blue-300 hover:underline bg-slate-800 px-3 py-1.5 rounded-full transition-colors truncate max-w-xs"
                    >
                        {source.title}
                    </a>
                ))}
            </div>
            <p className="text-xs text-slate-600 mt-4">
                免责声明: 本分析由 AI 基于搜索引擎公开数据生成。金融市场波动剧烈，历史数据不代表未来表现。本内容仅供参考，不构成投资建议，请自行评估风险。
            </p>
          </div>
      )}
    </div>
  );
};

export default StockDashboard;