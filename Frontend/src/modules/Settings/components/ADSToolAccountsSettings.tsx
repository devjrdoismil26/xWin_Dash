import React, { useState } from 'react';
import Card from '@/shared/components/ui/Card';
import Input from '@/shared/components/ui/Input';
import InputLabel from '@/shared/components/ui/InputLabel';
import Select from '@/shared/components/ui/Select';
import Button from '@/shared/components/ui/Button';
interface ADSToolAccountsSettingsProps {
  [key: string]: unknown;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
const ADSToolAccountsSettings = ({ configs = [] as unknown[] }) => { const find = (k: unknown) => configs.find((c: unknown) => c.key === k)?.value;
  const [googleClientId, setGoogleClientId] = useState(find('ads_tool_google_ads_client_id') || '');

  const [googleClientSecret, setGoogleClientSecret] = useState(find('ads_tool_google_ads_client_secret') || '');

  const [googleRefresh, setGoogleRefresh] = useState(find('ads_tool_google_ads_refresh_token') || '');

  const [fbAccess, setFbAccess] = useState(find('ads_tool_facebook_ads_access_token') || '');

  const [fbAppId, setFbAppId] = useState(find('ads_tool_facebook_ads_app_id') || '');

  const [fbAppSecret, setFbAppSecret] = useState(find('ads_tool_facebook_ads_app_secret') || '');

  const [autoSync, setAutoSync] = useState(find('ads_tool_enable_auto_sync') || 'true');

  const [syncInterval, setSyncInterval] = useState(find('ads_tool_sync_interval_hours') || '24');

  return (
            <div className=" ">$2</div><Card />
        <Card.Header />
          <Card.Title>Google Ads</Card.Title>
        </Card.Header>
        <Card.Content />
          <form className="space-y-3" onSubmit={onSubmit } />
            <div>
           
        </div><InputLabel htmlFor="gid">Client ID</InputLabel>
              <Input id="gid" value={googleClientId} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setGoogleClientId(e.target.value) } /></div><div>
           
        </div><InputLabel htmlFor="gsecret">Client Secret</InputLabel>
              <Input id="gsecret" type="password" value={googleClientSecret} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setGoogleClientSecret(e.target.value) } /></div><div>
           
        </div><InputLabel htmlFor="grefresh">Refresh Token</InputLabel>
              <Input id="grefresh" type="password" value={googleRefresh} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setGoogleRefresh(e.target.value) } /></div><Button type="submit">Salvar</Button></form></Card.Content></Card><Card />
        <Card.Header />
          <Card.Title>Facebook Ads</Card.Title>
        </Card.Header>
        <Card.Content />
          <div className=" ">$2</div><div>
           
        </div><InputLabel htmlFor="faccess">Access Token</InputLabel>
              <Input id="faccess" type="password" value={fbAccess} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setFbAccess(e.target.value) } /></div><div>
           
        </div><InputLabel htmlFor="fappid">App ID</InputLabel>
              <Input id="fappid" value={fbAppId} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setFbAppId(e.target.value) } /></div><div>
           
        </div><InputLabel htmlFor="fappsecret">App Secret</InputLabel>
              <Input id="fappsecret" type="password" value={fbAppSecret} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setFbAppSecret(e.target.value) } /></div></Card.Content></Card><Card />
        <Card.Header />
          <Card.Title>Sincronização</Card.Title>
        </Card.Header>
        <Card.Content />
          <div className=" ">$2</div><div>
           
        </div><InputLabel htmlFor="autoSync">Sincronização automática</InputLabel>
              <Select id="autoSync" value={autoSync} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setAutoSync(e.target.value)  }>
                <option value="true">Sim</option>
                <option value="false">Não</option></Select></div>
            <div>
           
        </div><InputLabel htmlFor="interval">Intervalo (h)</InputLabel>
              <Input id="interval" type="number" value={syncInterval} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setSyncInterval(e.target.value) } /></div></Card.Content></Card></div>);};

export default ADSToolAccountsSettings;
