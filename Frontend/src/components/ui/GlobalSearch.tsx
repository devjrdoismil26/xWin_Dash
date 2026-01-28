import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Search, Clock, ArrowRight, Loader2, Command } from 'lucide-react';
import Button from './Button';
import { cn } from '@/lib/utils';

export interface SearchResult {
  id: string | number;
  title: string;
  description?: string;
  type?: string;
  icon?: React.ReactNode;
}

export interface SearchCategory {
  type: string;
  label: string;
  icon?: React.ReactNode;
}

export interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (result: SearchResult) => void;
  search: (query: string) => Promise<SearchResult[]>;
  placeholder?: string;
  maxResults?: number;
  categories?: SearchCategory[];
  className?: string;
}

const DEFAULT_CATEGORIES: SearchCategory[] = [
  { type: 'lead', label: 'Leads', icon: '👤' },
  { type: 'project', label: 'Projetos', icon: '📁' },
  { type: 'campaign', label: 'Campanhas', icon: '📧' },
  { type: 'workflow', label: 'Workflows', icon: '⚡' },
  { type: 'product', label: 'Produtos', icon: '🛍️' },
  { type: 'user', label: 'Usuários', icon: '👥' },
  { type: 'page', label: 'Páginas', icon: '📄' },
];

const STORAGE_KEY = 'search-history';

function useSearchHistory() {
  const [history, setHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? (JSON.parse(saved) as string[]) : [];
    } catch {
      return [];
    }
  });

  const addToHistory = useCallback((query: string) => {
    setHistory((prev) => {
      const next = [query, ...prev.filter((q) => q !== query)].slice(0, 10);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { history, addToHistory, clearHistory };
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({
  isOpen,
  onClose,
  onNavigate,
  search,
  placeholder = 'Buscar em tudo...',
  maxResults = 10,
  categories = DEFAULT_CATEGORIES,
  className = '',
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { history, addToHistory, clearHistory } = useSearchHistory();
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number | null>(null);

  // focus on open
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 50);
    else {
      setQuery('');
      setResults([]);
      setError(null);
      setLoading(false);
    }
  }, [isOpen]);

  // handle keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const grouped = useMemo(() => {
    const map = new Map<string, SearchResult[]>();
    for (const r of results) {
      const type = r.type || 'outros';
      if (!map.has(type)) map.set(type, []);
      map.get(type)!.push(r);
    }
    return Array.from(map.entries());
  }, [results]);

  const doSearch = useCallback(
    (q: string) => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (!q.trim()) {
        setResults([]);
        setError(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      timerRef.current = window.setTimeout(async () => {
        try {
          const res = await search(q);
          setResults(res.slice(0, maxResults));
          setError(null);
        } catch (err: any) {
          setError(err?.message || 'Erro ao realizar busca');
        } finally {
          setLoading(false);
        }
      }, 250);
    },
    [search, maxResults],
  );

  const handleSelectHistory = (q: string) => {
    setQuery(q);
    doSearch(q);
  };

  const getCategoryLabel = (type: string) => categories.find((c) => c.type === type)?.label || type;
  const getCategoryIcon = (type: string) => categories.find((c) => c.type === type)?.icon || '📄';

  if (!isOpen) return null;

  return (
    <div className={cn('fixed inset-0 z-50 flex items-start justify-center p-4', className)}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-3xl rounded-xl bg-white shadow-xl ring-1 ring-black ring-opacity-5">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-200">
          <Search className="h-5 w-5 text-gray-500" />
          <input
            ref={inputRef}
            className="flex-1 outline-none bg-transparent text-gray-900 placeholder-gray-500"
            placeholder={placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              doSearch(e.target.value);
            }}
          />
          {query && (
            <Button variant="ghost" onClick={() => setQuery('')} aria-label="Limpar busca">
              Limpar
            </Button>
          )}
          <Button variant="ghost" onClick={onClose} aria-label="Fechar busca">
            Fechar
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[60vh] overflow-auto" role="list">
          {loading && (
            <div className="flex items-center gap-2 text-gray-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Buscando...</span>
            </div>
          )}
          {error && !loading && <div className="text-red-600 text-sm">{error}</div>}
          {!loading && !error && query.trim() && results.length === 0 && (
            <div className="text-gray-600 text-sm">Nenhum resultado encontrado para &quot;{query}&quot;</div>
          )}

          {!loading && !error && query.trim() && results.length > 0 && (
            <div className="space-y-6">
              {grouped.map(([type, typeResults]) => (
                <div key={type}>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                    <span>{getCategoryIcon(type)}</span>
                    {getCategoryLabel(type)}
                  </h3>
                  <div className="mt-2 divide-y divide-gray-100 border border-gray-100 rounded-md">
                    {typeResults.map((result) => (
                      <button
                        key={`${type}-${result.id}`}
                        className="w-full text-left p-3 hover:bg-gray-50 flex items-center justify-between"
                        onClick={() => {
                          addToHistory(query);
                          onNavigate(result);
                          onClose();
                        }}
                      >
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{result.title}</h4>
                          {result.description && (
                            <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{result.description}</p>
                          )}
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!query.trim() && history.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Buscas recentes</h3>
                <Button variant="ghost" size="sm" onClick={clearHistory}>
                  Limpar histórico
                </Button>
              </div>
              <div className="space-y-1">
                {history.map((item) => (
                  <button key={item} className="w-full flex items-center gap-2 p-2 hover:bg-gray-50 rounded" onClick={() => handleSelectHistory(item)}>
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200 text-xs text-gray-500 flex items-center gap-3">
          <Command className="h-4 w-4" />
          <span>Dica: use palavras-chave para refinar a busca</span>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;
