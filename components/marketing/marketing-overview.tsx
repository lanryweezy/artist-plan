'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Heart, 
  Share2, 
  DollarSign,
  Calendar,
  Target,
  Play,
  MessageSquare
} from 'lucide-react';

export function MarketingOverview() {
  // Mock data - in real app, this would come from API
  const activeCampaigns = [
    {
      id: '1',
      name: 'New Single Release',
      type: 'release_promotion',
      status: 'active',
      progress: 65,
      budget: 1500,
      spent: 975,
      platforms: ['instagram', 'tiktok', 'spotify'],
      endDate: '2024-02-15'
    },
    {
      id: '2',
      name: 'Tour Announcement',
      type: 'tour_promotion',
      status: 'planned',
      progress: 25,
      budget: 2000,
      spent: 0,
      platforms: ['facebook', 'twitter', 'email'],
      endDate: '2024-03-01'
    }
  ];

  const metrics = {
    totalReach: 125000,
    engagement: 8.5,
    conversions: 2340,
    roi: 245,
    activeCampaigns: 3,
    totalBudget: 5500,
    spentBudget: 2100
  };

  const recentActivity = [
    {
      id: '1',
      type: 'campaign_started',
      message: 'New Single Release campaign went live',
      timestamp: '2 hours ago',
      campaign: 'New Single Release'
    },
    {
      id: '2',
      type: 'milestone_reached',
      message: 'Reached 10K impressions on Instagram',
      timestamp: '5 hours ago',
      campaign: 'New Single Release'
    },
    {
      id: '3',
      type: 'budget_alert',
      message: 'Tour Announcement campaign budget 80% used',
      timestamp: '1 day ago',
      campaign: 'Tour Announcement'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalReach.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.engagement}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2.1%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.conversions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+18.2%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROI</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.roi}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+5.3%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Campaigns */}
        <Card>
          <CardHeader>
            <CardTitle>Active Campaigns</CardTitle>
            <CardDescription>
              {metrics.activeCampaigns} campaigns currently running
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeCampaigns.map((campaign) => (
              <div key={campaign.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{campaign.name}</h4>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {campaign.type.replace('_', ' ')}
                      </Badge>
                      <span>•</span>
                      <span>Ends {campaign.endDate}</span>
                    </div>
                  </div>
                  <Badge 
                    variant={campaign.status === 'active' ? 'default' : 'secondary'}
                  >
                    {campaign.status}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{campaign.progress}%</span>
                  </div>
                  <Progress value={campaign.progress} className="h-2" />
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Budget: ${campaign.spent} / ${campaign.budget}</span>
                  <span>{campaign.platforms.length} platforms</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates from your marketing campaigns
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {activity.type === 'campaign_started' && (
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Play className="h-4 w-4 text-green-600" />
                    </div>
                  )}
                  {activity.type === 'milestone_reached' && (
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Target className="h-4 w-4 text-blue-600" />
                    </div>
                  )}
                  {activity.type === 'budget_alert' && (
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <DollarSign className="h-4 w-4 text-yellow-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.message}</p>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span>{activity.timestamp}</span>
                    <span>•</span>
                    <span>{activity.campaign}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Budget Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Overview</CardTitle>
          <CardDescription>
            Track your marketing spend across all campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Budget</span>
              <span className="text-2xl font-bold">${metrics.totalBudget.toLocaleString()}</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Spent</span>
                <span>${metrics.spentBudget.toLocaleString()}</span>
              </div>
              <Progress 
                value={(metrics.spentBudget / metrics.totalBudget) * 100} 
                className="h-2" 
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{Math.round((metrics.spentBudget / metrics.totalBudget) * 100)}% used</span>
                <span>${(metrics.totalBudget - metrics.spentBudget).toLocaleString()} remaining</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}