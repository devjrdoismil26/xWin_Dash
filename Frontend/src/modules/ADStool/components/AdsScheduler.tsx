import React, { useMemo, useCallback, useState } from 'react';
import { Target, DollarSign, Plus } from 'lucide-react';
import Calendar from '@/shared/components/ui/Calendar';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';
import Select from '@/shared/components/ui/Select';
import InputLabel from '@/shared/components/ui/InputLabel';
import Textarea from '@/shared/components/ui/Textarea';
import Badge from '@/shared/components/ui/Badge';
import ConfirmationModal from '@/shared/components/ui/ConfirmationModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/Dialog';
import { apiClient } from '@/services';
import { AdsSchedulerProps, AdsCampaign, AdsPlatform } from '../types';
interface CampaignEvent {
  id: string;
  title: string;
  start: Date;
  resource: {
    id: number;
  name: string;
  platform: AdsPlatform;
  status: string;
  eventType: 'start' | 'end';
  type: 'ads'; };

}
interface FormData {
  name: string;
  platform: AdsPlatform;
  budget: string;
  startDate: string;
  endDate: string;
  targetAudience: string;
  adType: string;
  keywords: string;
  description: string;
  status: string; }
interface RescheduleData {
  campaignId: number;
  eventType: 'start' | 'end';
  originalDate: Date;
  newDate: Date;
  campaignName: string; }
const AdsScheduler: React.FC<AdsSchedulerProps> = ({ campaigns = [] as unknown[], 
  onSchedulerCreate,
  onSchedulerUpdate,
  onSchedulerDelete,
  loading = false,
  error 
   }) => {
  const [view, setView] = useState<'month' | 'week' | 'day' | 'agenda'>('month');

  const [formData, setFormData] = useState<FormData>({
    name: '',
    platform: 'google_ads',
    budget: '',
    startDate: '',
    endDate: '',
    targetAudience: '',
    adType: 'search',
    keywords: '',
    description: '',
    status: 'scheduled',
  });

  const [selectedCampaign, setSelectedCampaign] = useState<CampaignEvent['resource'] | null>(null);

  const [rescheduleData, setRescheduleData] = useState<RescheduleData | null>(null);

  const [isConfirmRescheduleModalOpen, setIsConfirmRescheduleModalOpen] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const events = useMemo((): CampaignEvent[] => {
    const campaignEvents: CampaignEvent[] = [] as unknown[];
    campaigns.forEach((c: unknown) => {
      campaignEvents.push({ 
        id: `${c.id}-start`, 
        title: `${c.name} - Início`, 
        start: new Date(c.start_date || ''), 
        resource: { 
          ...c, 
          eventType: 'start' as const, 
          type: 'ads' as const 
        } );

      if (c.end_date) {
        campaignEvents.push({ 
          id: `${c.id}-end`, 
          title: `${c.name} - Fim`, 
          start: new Date(c.end_date), 
          resource: { 
            ...c, 
            eventType: 'end' as const, 
            type: 'ads' as const 
          } );

      } );

    return campaignEvents;
  }, [campaigns]);

  const eventStyleGetter = useCallback((event: CampaignEvent) => {
    const campaign = event.resource;
    let backgroundColor = '#3174ad';
    let borderColor = '#265985';
    switch (campaign.platform) {
      case 'google_ads':
        backgroundColor = campaign.eventType === 'start' ? '#4285f4' : '#1a73e8';
        borderColor = '#1557b0';
        break;
      case 'facebook_ads':
        backgroundColor = campaign.eventType === 'start' ? '#1877f2' : '#166fe5';
        borderColor = '#144bc4';
        break;
      case 'linkedin_ads':
        backgroundColor = campaign.eventType === 'start' ? '#0a66c2' : '#004182';
        borderColor = '#003366';
        break;
      case 'twitter_ads':
        backgroundColor = campaign.eventType === 'start' ? '#1da1f2' : '#0d8bd9';
        borderColor = '#0a6bb3';
        break;
      case 'tiktok_ads':
        backgroundColor = campaign.eventType === 'start' ? '#ff0050' : '#e6004a';
        borderColor = '#cc003f';
        break;
    }
    if (campaign.status === 'paused') {
      backgroundColor = `${backgroundColor}80`;
    } else if (campaign.status === 'completed') {
      backgroundColor = '#6b7280';
      borderColor = '#4b5563';
    }
    return { 
      style: { 
        backgroundColor, 
        borderColor, 
        borderRadius: '6px', 
        color: 'white', 
        fontSize: '11px', 
        padding: '2px 4px', 
        fontWeight: '500' 
      } ;

  }, []);

  const handleEventSelect = useCallback((event: CampaignEvent) => {
    setSelectedCampaign(event.resource);

  }, []);

  const handleEventDrop = useCallback(({ event, start }: { event: CampaignEvent; start: Date }) => {
    setRescheduleData({
      campaignId: event.resource.id,
      eventType: event.resource.eventType,
      originalDate: event.start,
      newDate: start,
      campaignName: event.resource.name,
    });

    setIsConfirmRescheduleModalOpen(true);

  }, []);

  const handleConfirmReschedule = useCallback(async () => {
    if (!rescheduleData) return;
    const field = rescheduleData.eventType === 'start' ? 'start_date' : 'end_date';
    const updateData = { [field]: moment(rescheduleData.newDate).format('YYYY-MM-DD HH:mm:ss')};

    try {
      await apiClient.put(`/api/adstool/campaigns/${rescheduleData.campaignId}`, updateData);

      onSchedulerUpdate?.({
        id: rescheduleData.campaignId,
        campaign_id: rescheduleData.campaignId,
        name: rescheduleData.campaignName,
        schedule_type: 'scheduled',
        schedule_data: {
          start_time: rescheduleData.newDate.toISOString(),
          timezone: 'America/Sao_Paulo'
        },
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
  });

    } catch (error) {
      console.error('Erro ao reagendar campanha:', error);

    } , [rescheduleData, onSchedulerUpdate]);

  const handleCreateCampaign = useCallback(async () => {
    try {
      const response = await apiClient.post('/api/adstool/campaigns', {
        name: formData.name,
        platform: formData.platform,
        budget: parseFloat(formData.budget) || 0,
        start_date: moment(formData.startDate).format('YYYY-MM-DD HH:mm:ss'),
        end_date: formData.endDate ? moment(formData.endDate).format('YYYY-MM-DD HH:mm:ss') : null,
        objective: 'awareness',
        targeting: {
          interests: formData.targetAudience.split(',').map(s => s.trim())
  } );

      onSchedulerCreate?.();

      setIsCreateModalOpen(false);

      resetForm();

    } catch (error) {
      console.error('Erro ao criar campanha:', error);

    } , [formData, onSchedulerCreate]);

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      platform: 'google_ads',
      budget: '',
      startDate: '',
      endDate: '',
      targetAudience: '',
      adType: 'search',
      keywords: '',
      description: '',
      status: 'scheduled',
    });

  }, []);

  const handleFormChange = useCallback((field: keyof FormData, value: string) => {
    setFormData((prev: unknown) => ({ ...prev, [field]: value }));

  }, []);

  const handleSlotSelect = useCallback((slotInfo: { start: Date }) => {
    handleFormChange('startDate', moment(slotInfo.start).format('YYYY-MM-DDTHH:mm'));

  }, [handleFormChange]);

  if (loading) {
    return (
        <>
      <Card />
      <Card.Header />
          <div className=" ">$2</div><Target className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold">Agendador de Campanhas</h3></div></Card.Header>
        <Card.Content />
          <div className=" ">$2</div><div className="animate-pulse text-gray-500">Carregando calendário...</div>
        </Card.Content>
      </Card>);

  }
  if (error) {
    return (
        <>
      <Card />
      <Card.Header />
          <div className=" ">$2</div><Target className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold">Agendador de Campanhas</h3></div></Card.Header>
        <Card.Content />
          <div className=" ">$2</div><div className="text-red-500">Erro: {error}</div>
        </Card.Content>
      </Card>);

  }
  return (
            <>
      <Card />
        <Card.Header />
          <div className=" ">$2</div><div className=" ">$2</div><Target className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold">Agendador de Campanhas</h3></div><div className=" ">$2</div><div className=" ">$2</div><DollarSign className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">{events.length / 2} campanha(s)</span></div><Button onClick={() => setIsCreateModalOpen(true)} size="sm">
                <Plus className="w-4 h-4 mr-1" /> Nova
              </Button></div></Card.Header>
        <Card.Content />
          <div className=" ">$2</div><Calendar
              events={ events }
              height={ 600 }
              onSelectEvent={ handleEventSelect }
              onSelectSlot={ handleSlotSelect }
              onEventDrop={ handleEventDrop }
              selectable
              draggableAccessor={ () => true }
              views={ ['month', 'week', 'day', 'agenda'] }
              defaultView={ view }
              eventPropGetter={ eventStyleGetter } /></div></Card.Content></Card><Dialog open={isCreateModalOpen} onOpenChange={ setIsCreateModalOpen } />
        <DialogContent className="max-w-2xl" />
          <DialogHeader />
            <DialogTitle>Criar Campanha</DialogTitle></DialogHeader><div className=" ">$2</div><div className=" ">$2</div><div>
           
        </div><InputLabel htmlFor="name">Nome</InputLabel>
                <Input 
                  id="name" 
                  value={ formData.name }
                  onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleFormChange('name', e.target.value) }
                  placeholder="Ex Black Friday 2024" /></div><div>
           
        </div><InputLabel htmlFor="platform">Plataforma</InputLabel>
                <Select 
                  id="platform" 
                  value={ formData.platform }
                  onChange={ (e: unknown) => handleFormChange('platform', e.target.value as AdsPlatform)  }>
                  <option value="google_ads">Google Ads</option>
                  <option value="facebook_ads">Facebook Ads</option>
                  <option value="linkedin_ads">LinkedIn Ads</option>
                  <option value="twitter_ads">Twitter Ads</option>
                  <option value="tiktok_ads">TikTok Ads</option></Select></div>
            <div className=" ">$2</div><div>
           
        </div><InputLabel htmlFor="budget">Orçamento</InputLabel>
                <Input 
                  id="budget" 
                  type="number" 
                  value={ formData.budget }
                  onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleFormChange('budget', e.target.value) }
                  placeholder="1000" /></div><div>
           
        </div><InputLabel htmlFor="adType">Tipo de anúncio</InputLabel>
                <Select 
                  id="adType" 
                  value={ formData.adType }
                  onChange={ (e: unknown) => handleFormChange('adType', e.target.value)  }>
                  <option value="search">Search</option>
                  <option value="display">Display</option>
                  <option value="video">Vídeo</option>
                  <option value="shopping">Shopping</option>
                  <option value="social">Social</option></Select></div>
            <div className=" ">$2</div><div>
           
        </div><InputLabel htmlFor="startDate">Início</InputLabel>
                <Input 
                  id="startDate" 
                  type="datetime-local" 
                  value={ formData.startDate }
                  onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleFormChange('startDate', e.target.value) } /></div><div>
           
        </div><InputLabel htmlFor="endDate">Término</InputLabel>
                <Input 
                  id="endDate" 
                  type="datetime-local" 
                  value={ formData.endDate }
                  onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleFormChange('endDate', e.target.value) } /></div><div>
           
        </div><InputLabel htmlFor="targetAudience">Público alvo</InputLabel>
              <Input 
                id="targetAudience" 
                value={ formData.targetAudience }
                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleFormChange('targetAudience', e.target.value) }
                placeholder="Ex, 25-40 anos, interessadas em tecnologia" /></div><div>
           
        </div><InputLabel htmlFor="keywords">Palavras-chave</InputLabel>
              <Input 
                id="keywords" 
                value={ formData.keywords }
                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleFormChange('keywords', e.target.value) }
                placeholder="marketing digital, publicidade online, anúncios" /></div><div>
           
        </div><InputLabel htmlFor="description">Descrição</InputLabel>
              <Textarea 
                id="description" 
                value={ formData.description }
                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleFormChange('description', e.target.value) }
                placeholder="Descreva os objetivos e estratégia da campanha..." /></div><div className=" ">$2</div><Button variant="outline" onClick={ () => setIsCreateModalOpen(false)  }>
                Fechar
              </Button>
              <Button onClick={ handleCreateCampaign } />
                Criar
              </Button></div></DialogContent></Dialog><ConfirmationModal
        open={ isConfirmRescheduleModalOpen }
        onClose={ () => setIsConfirmRescheduleModalOpen(false) }
        onConfirm={ handleConfirmReschedule }
        title="Confirmar Reagendamento"
        text={
          rescheduleData
            ? `Deseja mover a ${rescheduleData.eventType === 'start' ? 'data de início' : 'data de fim'} da campanha "${rescheduleData.campaignName}"?\nDe: ${moment(rescheduleData.originalDate).format('DD/MM/YYYY HH:mm')}\nPara: ${moment(rescheduleData.newDate).format('DD/MM/YYYY HH:mm')}`
            : ''
        }
        confirmText="Reagendar"
        cancelText="Cancelar" />
    </>);};

export default AdsScheduler;
