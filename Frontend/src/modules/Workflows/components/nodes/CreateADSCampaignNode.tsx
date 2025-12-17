import React, { useState, useEffect } from 'react';
import { Target, Play, Settings, DollarSign, Users, TrendingUp } from 'lucide-react';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';
import InputLabel from '@/shared/components/ui/InputLabel';
import Select from '@/shared/components/ui/Select';
import Badge from '@/shared/components/ui/Badge';
import useToast from '@/shared/components/ui/useToast';
const CreateADSCampaignNode: React.FC<{ id: string; data: Record<string, any>; selected?: boolean; onUpdate??: (e: any) => void; onDelete??: (e: any) => void; onConnect???: (e: any) => void; onDisconnect???: (e: any) => void }> = ({ 
  id, 
  data, 
  selected, 
  onUpdate, 
  onDelete, 
  onConnect,
  onDisconnect 
}) => {
  const { toast } = useToast();

  const [config, setConfig] = useState<Record<string, any>>({
    name: '',
    platform: 'facebook',
    objective: 'awareness',
    budget: 100,
    budgetType: 'daily',
    targetAudience: {
      ageMin: 18,
      ageMax: 65,
      interests: [],
      locations: [],
      demographics: {} ,
    adCreative: {
      headline: '',
      description: '',
      callToAction: 'Learn More',
      mediaUrl: ''
    },
    schedule: {
      startDate: '',
      endDate: '',
      timezone: 'UTC'
    },
    bidding: {
      strategy: 'lowest_cost',
      bidAmount: 0
    },
    ...data?.config
  });

  const [isCreating, setIsCreating] = useState(false);

  const [campaignPreview, setCampaignPreview] = useState<any>(null);

  const handleConfigChange = (field: string, value: unknown) => {
    const newConfig = { ...config, [field]: value};

    setConfig(newConfig);

    onUpdate?.(id, { ...data, config: newConfig });};

  const handleNestedConfigChange = (parent: unknown, field: unknown, value: unknown) => {
    const newConfig = {
      ...config,
      [parent]: {
        ...config[parent],
        [field]: value
      } ;

    setConfig(newConfig);

    onUpdate?.(id, { ...data, config: newConfig });};

  const handleTestCampaign = async () => {
    if (!config.name) {
      toast.error('Please enter a campaign name');

      return;
    }
    setIsCreating(true);

    try {
      // Simulate campaign creation
      await new Promise(resolve => setTimeout(resolve, 2000));

      const preview = {
        id: `camp_${Date.now()}`,
        name: config.name,
        platform: config.platform,
        status: 'draft',
        budget: config.budget,
        estimatedReach: Math.floor(config.budget * 50),
        estimatedClicks: Math.floor(config.budget * 10),
        estimatedImpressions: Math.floor(config.budget * 1000)};

      setCampaignPreview(preview);

      toast.success('Campaign created successfully');

    } catch (error) {
      toast.error('Failed to create campaign');

    } finally {
      setIsCreating(false);

    } ;

  const getPlatformColor = (platform: unknown) => {
    const colors = {
      facebook: 'bg-blue-100 text-blue-800',
      instagram: 'bg-pink-100 text-pink-800',
      google: 'bg-red-100 text-red-800',
      twitter: 'bg-sky-100 text-sky-800',
      linkedin: 'bg-blue-100 text-blue-800'};

    return colors[platform] || 'bg-gray-100 text-gray-800';};

  const getObjectiveColor = (objective: unknown) => {
    const colors = {
      awareness: 'bg-green-100 text-green-800',
      traffic: 'bg-blue-100 text-blue-800',
      conversions: 'bg-purple-100 text-purple-800',
      engagement: 'bg-yellow-100 text-yellow-800',
      leads: 'bg-orange-100 text-orange-800'};

    return colors[objective] || 'bg-gray-100 text-gray-800';};

  return (
        <>
      <Card 
      className={`workflow-node ads-campaign-node ${selected ? 'selected' : ''} `}
      style={minWidth: '350px',
        border: selected ? '2px solid #3B82F6' : '1px solid #E5E7EB',
        backgroundColor: '#FEF2F2'
      } />
      <div className=" ">$2</div><div className=" ">$2</div><Target className="w-5 h-5 text-red-600" />
          <h3 className="font-semibold text-gray-900">Create ADS Campaign</h3>
          <Badge variant="secondary" className={getPlatformColor(config.platform) } />
            {config.platform}
          </Badge></div><div className=" ">$2</div><Button
            size="sm"
            variant="ghost"
            onClick={ () => onConnect?.(id) }
            title="Connect"
          >
            <Play className="w-4 h-4" /></Button><Button
            size="sm"
            variant="ghost"
            onClick={ () => onDisconnect?.(id) }
            title="Disconnect"
          >
            <Settings className="w-4 h-4" /></Button><Button
            size="sm"
            variant="ghost"
            onClick={ () => onDelete?.(id) }
            title="Delete"
            className="text-red-600 hover:text-red-700"
          >
            ×
          </Button></div><div className="{/* Campaign Basic Info */}">$2</div>
        <div>
           
        </div><InputLabel>Campaign Name *</InputLabel>
          <Input
            value={ config.name }
            onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleConfigChange('name', e.target.value) }
            placeholder="Enter campaign name" /></div><div className=" ">$2</div><div>
           
        </div><InputLabel>Platform</InputLabel>
            <Select
              value={ config.platform }
              onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleConfigChange('platform', e.target.value) }
              options={[
                { value: 'facebook', label: 'Facebook' },
                { value: 'instagram', label: 'Instagram' },
                { value: 'google', label: 'Google Ads' },
                { value: 'twitter', label: 'Twitter' },
                { value: 'linkedin', label: 'LinkedIn' }
              ]} /></div><div>
           
        </div><InputLabel>Objective</InputLabel>
            <Select
              value={ config.objective }
              onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleConfigChange('objective', e.target.value) }
              options={[
                { value: 'awareness', label: 'Brand Awareness' },
                { value: 'traffic', label: 'Traffic' },
                { value: 'conversions', label: 'Conversions' },
                { value: 'engagement', label: 'Engagement' },
                { value: 'leads', label: 'Lead Generation' }
              ]} />
          </div>
        {/* Budget Configuration */}
        <div className=" ">$2</div><h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2" />
            <DollarSign className="w-4 h-4" />
            Budget Settings
          </h4>
          <div className=" ">$2</div><div>
           
        </div><InputLabel>Budget Amount</InputLabel>
              <Input
                type="number"
                value={ config.budget }
                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleConfigChange('budget', parseFloat(e.target.value) || 0) }
                min="1"
                step="0.01"
                placeholder="100.00" /></div><div>
           
        </div><InputLabel>Budget Type</InputLabel>
              <Select
                value={ config.budgetType }
                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleConfigChange('budgetType', e.target.value) }
                options={[
                  { value: 'daily', label: 'Daily' },
                  { value: 'lifetime', label: 'Lifetime' }
                ]} /></div></div>
        {/* Target Audience */}
        <div className=" ">$2</div><h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2" />
            <Users className="w-4 h-4" />
            Target Audience
          </h4>
          <div className=" ">$2</div><div>
           
        </div><InputLabel>Age Min</InputLabel>
              <Input
                type="number"
                value={ config.targetAudience.ageMin }
                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleNestedConfigChange('targetAudience', 'ageMin', parseInt(e.target.value) || 18) }
                min="13"
                max="65" /></div><div>
           
        </div><InputLabel>Age Max</InputLabel>
              <Input
                type="number"
                value={ config.targetAudience.ageMax }
                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleNestedConfigChange('targetAudience', 'ageMax', parseInt(e.target.value) || 65) }
                min="13"
                max="65" /></div></div>
        {/* Ad Creative */}
        <div className=" ">$2</div><h4 className="font-semibold text-gray-900 mb-2">Ad Creative</h4>
          <div className=" ">$2</div><div>
           
        </div><InputLabel>Headline</InputLabel>
              <Input
                value={ config.adCreative.headline }
                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleNestedConfigChange('adCreative', 'headline', e.target.value) }
                placeholder="Enter ad headline"
                maxLength="40" /></div><div>
           
        </div><InputLabel>Description</InputLabel>
              <textarea
                value={ config.adCreative.description }
                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleNestedConfigChange('adCreative', 'description', e.target.value) }
                placeholder="Enter ad description"
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={ 2 }
                maxLength="125" /></div><div>
           
        </div><InputLabel>Call to Action</InputLabel>
              <Select
                value={ config.adCreative.callToAction }
                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleNestedConfigChange('adCreative', 'callToAction', e.target.value) }
                options={[
                  { value: 'Learn More', label: 'Learn More' },
                  { value: 'Shop Now', label: 'Shop Now' },
                  { value: 'Sign Up', label: 'Sign Up' },
                  { value: 'Download', label: 'Download' },
                  { value: 'Book Now', label: 'Book Now' }
                ]} /></div></div>
        {/* Schedule */}
        <div className=" ">$2</div><h4 className="font-semibold text-gray-900 mb-2">Schedule</h4>
          <div className=" ">$2</div><div>
           
        </div><InputLabel>Start Date</InputLabel>
              <Input
                type="date"
                value={ config.schedule.startDate }
                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleNestedConfigChange('schedule', 'startDate', e.target.value) } /></div><div>
           
        </div><InputLabel>End Date</InputLabel>
              <Input
                type="date"
                value={ config.schedule.endDate }
                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleNestedConfigChange('schedule', 'endDate', e.target.value) } /></div></div>
        {/* Bidding Strategy */}
        <div className=" ">$2</div><h4 className="font-semibold text-gray-900 mb-2">Bidding</h4>
          <div className=" ">$2</div><div>
           
        </div><InputLabel>Strategy</InputLabel>
              <Select
                value={ config.bidding.strategy }
                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleNestedConfigChange('bidding', 'strategy', e.target.value) }
                options={[
                  { value: 'lowest_cost', label: 'Lowest Cost' },
                  { value: 'cost_cap', label: 'Cost Cap' },
                  { value: 'bid_cap', label: 'Bid Cap' },
                  { value: 'target_cost', label: 'Target Cost' }
                ]} /></div><div>
           
        </div><InputLabel>Bid Amount</InputLabel>
              <Input
                type="number"
                value={ config.bidding.bidAmount }
                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleNestedConfigChange('bidding', 'bidAmount', parseFloat(e.target.value) || 0) }
                min="0"
                step="0.01"
                placeholder="0.00" /></div></div>
        {/* Test Button */}
        <Button
          onClick={ handleTestCampaign }
          disabled={ isCreating || !config.name }
          className="w-full"
          variant="outline" />
          {isCreating ? (
            <>
              <div className="Creating Campaign...">$2</div>
      </>
    </>
  ) : (
            <>
              <Target className="w-4 h-4 mr-2" />
              Create Campaign
            </>
          )}
        </Button>
        {/* Campaign Eye */}
        {campaignPreview && (
          <div className=" ">$2</div><div className=" ">$2</div><TrendingUp className="w-4 h-4 text-green-600" />
              <span className="font-semibold text-green-800">Campaign Created</span></div><div className=" ">$2</div><div><strong>ID:</strong> {campaignPreview.id}</div>
              <div><strong>Name:</strong> {campaignPreview.name}</div>
              <div><strong>Platform:</strong> {campaignPreview.platform}</div>
              <div><strong>Status:</strong> {campaignPreview.status}</div>
              <div><strong>Budget:</strong> ${campaignPreview.budget}</div>
              <div><strong>Est. Reach:</strong> {campaignPreview.estimatedReach.toLocaleString()}</div>
    </div>
  )}
        {/* Node Status */}
        <div className=" ">$2</div><span>Node ID: {id}</span>
          <span className=" ">$2</span><div className="Ready">$2</div>
          </span>
        </div>
      {/* Connection Points */}
      <div className=" ">$2</div><div className="connection-point input" data-node-id={id} data-type="input">
           
        </div><div className="connection-dot">
           
        </div><div className="connection-point output" data-node-id={id} data-type="output">
           
        </div><div className="connection-dot" /></div></Card>);};

export default CreateADSCampaignNode;
