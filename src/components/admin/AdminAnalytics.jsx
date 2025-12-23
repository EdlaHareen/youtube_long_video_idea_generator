import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Download } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import { getAnalytics, exportToCSV } from '../../utils/admin';

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('30'); // days

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await getAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Error loading analytics:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!analytics) return;
    
    const exportData = [
      { Metric: 'Total Users', Value: analytics.totalUsers },
      { Metric: 'New Users This Week', Value: analytics.newUsersThisWeek },
      { Metric: 'Total Searches', Value: analytics.totalSearches },
      { Metric: 'Total Favorites', Value: analytics.totalFavorites },
      ...analytics.popularKeywords.map((item, index) => ({
        Metric: `Keyword #${index + 1}: ${item.keyword}`,
        Value: item.count,
      })),
    ];
    
    exportToCSV(exportData, 'analytics');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-400">Error: {error}</div>
      </div>
    );
  }

  if (!analytics) return null;

  // Process data for charts
  const userGrowthData = processUserGrowth(analytics.userGrowth);
  const searchesData = processSearchesData(analytics.searchesData);
  const keywordsData = processKeywordsData(analytics.popularKeywords);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
            Analytics Dashboard
          </h2>
          <p className="text-gray-400">Detailed insights and metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 bg-gray-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
          <motion.button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="w-4 h-4" />
            Export
          </motion.button>
        </div>
      </div>

      {/* User Growth Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900/50 border border-white/10 rounded-lg p-6 backdrop-blur-sm"
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-500" />
          User Growth Over Time
        </h3>
        <ReactECharts
          option={getUserGrowthOption(userGrowthData)}
          style={{ height: '400px' }}
          opts={{ renderer: 'svg' }}
        />
      </motion.div>

      {/* Searches Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-900/50 border border-white/10 rounded-lg p-6 backdrop-blur-sm"
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-500" />
          Daily Searches
        </h3>
        <ReactECharts
          option={getSearchesOption(searchesData)}
          style={{ height: '400px' }}
          opts={{ renderer: 'svg' }}
        />
      </motion.div>

      {/* Popular Keywords Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-900/50 border border-white/10 rounded-lg p-6 backdrop-blur-sm"
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-500" />
          Most Popular Keywords
        </h3>
        <ReactECharts
          option={getKeywordsOption(keywordsData)}
          style={{ height: '400px' }}
          opts={{ renderer: 'svg' }}
        />
      </motion.div>

      {/* Most Favorited Videos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-900/50 border border-white/10 rounded-lg p-6 backdrop-blur-sm"
      >
        <h3 className="text-xl font-semibold mb-4">Most Favorited Videos</h3>
        <div className="space-y-2">
          {analytics.mostFavorited.length > 0 ? (
            analytics.mostFavorited.map((video, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex-1">
                  <div className="text-white font-medium">{video.title}</div>
                  <div className="text-sm text-gray-400">{video.channelName}</div>
                </div>
                <div className="text-purple-400 font-semibold">{video.count} favorites</div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No favorites found</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function processUserGrowth(userGrowth) {
  if (!userGrowth || userGrowth.length === 0) {
    return { dates: [], counts: [] };
  }

  const dateMap = {};
  let cumulative = 0;
  userGrowth.forEach(user => {
    const date = new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    cumulative++;
    dateMap[date] = cumulative;
  });

  const dates = Object.keys(dateMap).sort();
  const counts = dates.map(date => dateMap[date]);

  return { dates, counts };
}

function processSearchesData(searchesData) {
  if (!searchesData || searchesData.length === 0) {
    return { dates: [], counts: [] };
  }

  const dateMap = {};
  searchesData.forEach(search => {
    const date = new Date(search.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    dateMap[date] = (dateMap[date] || 0) + 1;
  });

  const dates = Object.keys(dateMap).sort();
  const counts = dates.map(date => dateMap[date]);

  return { dates, counts };
}

function processKeywordsData(keywords) {
  if (!keywords || keywords.length === 0) {
    return { keywords: [], counts: [] };
  }

  return {
    keywords: keywords.map(k => k.keyword),
    counts: keywords.map(k => k.count),
  };
}

function getUserGrowthOption(data) {
  return {
    backgroundColor: 'transparent',
    textStyle: {
      color: '#e5e7eb',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: data.dates,
      axisLine: {
        lineStyle: {
          color: '#4b5563',
        },
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#4b5563',
        },
      },
      splitLine: {
        lineStyle: {
          color: '#1f2937',
        },
      },
    },
    series: [
      {
        data: data.counts,
        type: 'line',
        smooth: true,
        itemStyle: {
          color: '#a855f7',
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(168, 85, 247, 0.3)' },
              { offset: 1, color: 'rgba(168, 85, 247, 0)' },
            ],
          },
        },
      },
    ],
  };
}

function getSearchesOption(data) {
  return {
    backgroundColor: 'transparent',
    textStyle: {
      color: '#e5e7eb',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: data.dates,
      axisLine: {
        lineStyle: {
          color: '#4b5563',
        },
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#4b5563',
        },
      },
      splitLine: {
        lineStyle: {
          color: '#1f2937',
        },
      },
    },
    series: [
      {
        data: data.counts,
        type: 'bar',
        itemStyle: {
          color: '#a855f7',
        },
      },
    ],
  };
}

function getKeywordsOption(data) {
  return {
    backgroundColor: 'transparent',
    textStyle: {
      color: '#e5e7eb',
    },
    grid: {
      left: '20%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#4b5563',
        },
      },
      splitLine: {
        lineStyle: {
          color: '#1f2937',
        },
      },
    },
    yAxis: {
      type: 'category',
      data: data.keywords,
      axisLine: {
        lineStyle: {
          color: '#4b5563',
        },
      },
    },
    series: [
      {
        data: data.counts,
        type: 'bar',
        itemStyle: {
          color: '#a855f7',
        },
      },
    ],
  };
}

