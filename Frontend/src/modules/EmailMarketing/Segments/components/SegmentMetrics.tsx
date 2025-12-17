import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Card from '@/shared/components/ui/Card';
import Modal from '@/shared/components/ui/Modal';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import ErrorState from '@/shared/components/ui/ErrorState';
const MetricCard = ({ title, value }) => (
  <Card className="p-4" />
    <h2 className="text-sm text-gray-600">{title}</h2>
    <p className="text-xl font-semibold">{value}</p>
  </Card>);

const SegmentMetrics = ({ segment, onClose, isOpen = true }) => {
  const [isLoading, setIsLoading] = useState(true);

  const [metrics, setMetrics] = useState<any>(null);

  const [error, setError] = useState('');

  useEffect(() => {
    setIsLoading(true);

    setError('');

    // Placeholder: carregar métricas
    setTimeout(() => {
      setMetrics({
        sent: 0,
        opens: 0,
        clicks: 0,
        score_distribution: { '0-25': 0, '26-50': 0, '51-75': 0, '76-100': 0 },
      });

      setIsLoading(false);

    }, 200);

  }, [segment]);

  return (
        <>
      <Modal isOpen={isOpen} onClose={onClose} title="Métricas do Segmento" size="lg" />
      <Card />
        <Card.Content />
          {isLoading ? (
            <LoadingSpinner text="Carregando métricas..." / />
          ) : error ? (
            <ErrorState text={error} / />
          ) : metrics ? (
            <div className=" ">$2</div><div className=" ">$2</div><MetricCard title="Enviados" value={metrics.sent} / />
                <MetricCard title="Aberturas" value={metrics.opens} / />
                <MetricCard title="Cliques" value={metrics.clicks} / />
                <MetricCard title="Leads (76-100)" value={metrics.score_distribution['76-100']} / />
              </div>
          ) : null}
        </Card.Content>
        <Card.Footer className="flex justify-end" />
          <button type="button" className="px-3 py-2 text-sm border rounded" onClick={ onClose } />
            Fechar
          </button>
        </Card.Footer></Card></Modal>);};

SegmentMetrics.propTypes = {
  segment: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,};

MetricCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,};

export default SegmentMetrics;
