import React, { useState } from 'react';
import Card from '@/shared/components/ui/Card';
import Input from '@/shared/components/ui/Input';
import InputLabel from '@/shared/components/ui/InputLabel';
import Select from '@/shared/components/ui/Select';
import Button from '@/shared/components/ui/Button';
const AdvancedSearch = () => {
  const [form, setForm] = useState({ query: '', type: '', dateFrom: '', dateTo: '', tags: [] });

  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(false);

  const performSearch = async () => {
    setLoading(true);

    try {
      // placeholder
      setTimeout(() => setResults([]), 300);

    } finally {
      setLoading(false);

    } ;

  return (
            <div className=" ">$2</div><h1 className="text-3xl font-bold text-gray-900">Busca Avançada</h1>
      <p className="text-gray-600">Filtre por tipo, datas e tags.</p>
      <Card />
        <Card.Content />
          <div className=" ">$2</div><div>
           
        </div><InputLabel htmlFor="query">Termo</InputLabel>
              <Input id="query" value={form.query} onChange={(e: unknown) => setForm({ ...form, query: e.target.value })} /></div><div>
           
        </div><InputLabel htmlFor="type">Tipo</InputLabel>
              <Select
                id="type"
                value={ form.type }
                onChange={(val: unknown) => setForm({ ...form, type: String(val) })}
                options={[
                  { value: '', label: 'Todos' },
                  { value: 'image', label: 'Imagem' },
                  { value: 'video', label: 'Vídeo' },
                  { value: 'document', label: 'Documento' },
                ]} /></div><div>
           
        </div><InputLabel htmlFor="dateFrom">De</InputLabel>
              <Input id="dateFrom" type="date" value={form.dateFrom} onChange={(e: unknown) => setForm({ ...form, dateFrom: e.target.value })} /></div><div>
           
        </div><InputLabel htmlFor="dateTo">Até</InputLabel>
              <Input id="dateTo" type="date" value={form.dateTo} onChange={(e: unknown) => setForm({ ...form, dateTo: e.target.value })} /></div><Button onClick={performSearch} disabled={ loading }>{loading ? 'Buscando...' : 'Buscar'}</Button>
        </Card.Content>
      </Card>
      {results.length > 0 && (
        <Card />
          <Card.Header />
            <Card.Title>Resultados</Card.Title>
          </Card.Header>
          <Card.Content />
            <div className="{(results || []).map((item: unknown, index: unknown) => (">$2</div>
                <div key={index} className="border rounded p-4">
           
        </div><h4 className="font-medium">{item.filename}</h4>
                  <p className="text-sm text-gray-600">{item.type}</p>
      </div>
    </>
  ))}
            </div>
          </Card.Content>
      </Card>
    </>
  )}
    </div>);};

export default AdvancedSearch;
