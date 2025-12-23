import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Search, Heart, TrendingUp } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import { getAnalytics } from '../../utils/admin';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

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

  // Process user growth data for chart
  const userGrowthData = processUserGrowth(analytics.userGrowth);
  const searchesData = processSearchesData(analytics.searchesData);

  const overviewCards = [
    {
      title: 'Total Users',
      value: analytics.totalUsers,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'New Users (This Week)',
      value: analytics.newUsersThisWeek,
      icon: UserPlus,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Total Searches',
      value: analytics.totalSearches,
      icon: Search,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Total Favorites',
      value: analytics.totalFavorites,
      icon: Heart,
      color: 'from-red-500 to-red-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
          Overview
        </h2>
        <p className="text-gray-400">System statistics and insights</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-900/50 border border-white/10 rounded-lg p-6 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${card.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-gray-400 text-sm font-medium mb-1">{card.title}</h3>
              <p className="text-3xl font-bold text-white">{card.value.toLocaleString()}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-900/50 border border-white/10 rounded-lg p-6 backdrop-blur-sm"
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            User Growth (Last 30 Days)
          </h3>
          <ReactECharts
            option={getUserGrowthOption(userGrowthData)}
            style={{ height: '300px' }}
            opts={{ renderer: 'svg' }}
          />
        </motion.div>

        {/* Searches Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-900/50 border border-white/10 rounded-lg p-6 backdrop-blur-sm"
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Search className="w-5 h-5 text-purple-500" />
            Searches Per Day (Last 30 Days)
          </h3>
          <ReactECharts
            option={getSearchesOption(searchesData)}
            style={{ height: '300px' }}
            opts={{ renderer: 'svg' }}
          />
        </motion.div>
      </div>

      {/* Popular Keywords */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gray-900/50 border border-white/10 rounded-lg p-6 backdrop-blur-sm"
      >
        <h3 className="text-xl font-semibold mb-4">Most Popular Keywords</h3>
        <div className="space-y-2">
          {analytics.popularKeywords.length > 0 ? (
            analytics.popularKeywords.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <span className="text-gray-300">{item.keyword}</span>
                <span className="text-purple-400 font-semibold">{item.count} searches</span>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No keywords found</p>
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
  userGrowth.forEach(user => {
    const date = new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    dateMap[date] = (dateMap[date] || 0) + 1;
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

