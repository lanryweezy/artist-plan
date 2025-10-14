'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, BarChart3, Target, Users } from 'lucide-react';
// import { CampaignList } from '@/components/marketing/campaign-list';
import { CampaignForm } from '@/components/marketing/campaign-form';
import { MarketingAnalytics } from '@/components/marketing/marketing-analytics';
import { MarketingOverview } from '@/components/marketing/marketing-overview';

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'analytics'>('overview');
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Marketing Management</h1>
          <p className="text-muted-foreground">
            Plan, execute, and track your marketing campaigns across all platforms
          </p>
        </div>
        <Button onClick={() => setShowCreateCampaign(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Campaign
        </Button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        <Button
          variant={activeTab === 'overview' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('overview')}
        >
          <Target className="h-4 w-4 mr-2" />
          Overview
        </Button>
        <Button
          variant={activeTab === 'campaigns' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('campaigns')}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Campaigns
        </Button>
        <Button
          variant={activeTab === 'analytics' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('analytics')}
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          Analytics
        </Button>
      </div>

      {/* Content */}
      {activeTab === 'overview' && <MarketingOverview />}
      {/* {activeTab === 'campaigns' && <CampaignList />} */}
      {activeTab === 'analytics' && <MarketingAnalytics />}

      {/* Create Campaign Modal */}
      {showCreateCampaign && (
        <CampaignForm
          onClose={() => setShowCreateCampaign(false)}
          onSuccess={() => {
            setShowCreateCampaign(false);
            // Refresh campaigns list
          }}
        />
      )}
    </div>
  );
}