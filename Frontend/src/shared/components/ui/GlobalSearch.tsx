/**
 * Componente GlobalSearch - Busca Global da Aplicação
 *
 * @description
 * Componente de busca global que permite buscar em toda a aplicação através
 * de um modal overlay. Inclui histórico de buscas, categorização de resultados,
 * suporte a atalhos de teclado e busca com debounce.
 *
 * Funcionalidades principais:
 * - Busca global com callback customizado
 * - Histórico de buscas persistente (localStorage)
 * - Agrupamento de resultados por categoria
 * - Suporte a atalhos de teclado (Esc para fechar, Cmd/Ctrl+K para abrir)
 * - Debounce automático na busca
 * - Estados de loading e erro
 *
 * @module components/ui/GlobalSearch
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import GlobalSearch from '@/shared/components/ui/GlobalSearch';
 *
 * const searchFunction = async (query: string) => {
 *   const response = await api.get(`/search?q=${query}`);

 *   return (response as any).data.results;
 *};

 *
 * <GlobalSearch
 *   isOpen={ isSearchOpen }
 *   onClose={ () => setIsSearchOpen(false) }
 *   onNavigate={ (result: unknown) => router.visit(result.url) }
 *   search={ searchFunction }
 *   placeholder="Buscar leads, projetos, campanhas..."
 * />
 * ```
 */

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Search, Clock, ArrowRight, Loader2, Command } from 'lucide-react';
import Button from "./Button";
import { cn } from '@/lib/utils';

/**
 * Interface de resultado de busca
 *
 * @description
 * Estrutura de um resultado retornado pela função de busca.
 *
 * @interface SearchResult
 * @property {string | number} id - ID único do resultado
 * @property {string} title - Título do resultado
 * @property {string} [description] - Descrição do resultado (opcional)
 * @property {string} [type] - Tipo/categoria do resultado (opcional)
 * @property {React.ReactNode} [icon] - Ícone do resultado (opcional)
 *
 * @example
 * ```ts
 * const result: SearchResult = {
 *   id: 1,
 *   title: 'Projeto Alpha',
 *   description: 'Projeto de desenvolvimento',
 *   type: 'project',
 *   icon: <Folder / />
 *};

 * ```
 */
export interface SearchResult {
  id: string | number;
  title: string;
  description?: string;
  type?: string;
  icon?: React.ReactNode; }

/**
 * Interface de categoria de busca
 *
 * @description
 * Define uma categoria para agrupar resultados de busca.
 *
 * @interface SearchCategory
 * @property {string} type - Tipo identificador da categoria
 * @property {string} label - Rótulo exibido para a categoria
 * @property {React.ReactNode} [icon] - Ícone da categoria (opcional)
 *
 * @example
 * ```ts
 * const category: SearchCategory = {
 *   type: 'lead',
 *   label: 'Leads',
 *   icon: <User / />
 *};

 * ```
 */
export interface SearchCategory {
  type: string;
  label: string;
  icon?: React.ReactNode; }

/**
 * Props do componente GlobalSearch
 *
 * @description
 * Propriedades que podem ser passadas para o componente GlobalSearch.
 *
 * @interface GlobalSearchProps
 * @property {boolean} isOpen - Se o modal de busca está aberto
 * @property {() => void} onClose - Função chamada ao fechar o modal
 * @property {(result: SearchResult) => void} onNavigate - Função chamada ao selecionar um resultado
 * @property {(query: string) => Promise<SearchResult[]>} search - Função assíncrona que realiza a busca
 * @property {string} [placeholder] - Placeholder do input de busca (opcional, padrão: 'Buscar em tudo...')
 * @property {number} [maxResults] - Número máximo de resultados (opcional, padrão: 10)
 * @property {SearchCategory[]} [categories] - Categorias disponíveis (opcional)
 * @property {string} [className] - Classes CSS adicionais (opcional)
 *
 * @example
 * ```tsx
 * const props: GlobalSearchProps = {
 *   isOpen: true,
 *   onClose: () => setIsOpen(false),
 *   onNavigate: (result: unknown) => navigateTo(result),
 *   search: mySearchFunction,
 *   maxResults: 20
 *};

 * ```
 */
export interface GlobalSearchProps {
  isOpen: boolean;
  onClose??: (e: any) => void;
  onNavigate?: (e: any) => void;
  search: (query: string) => Promise<SearchResult[]>;
  placeholder?: string;
  maxResults?: number;
  categories?: SearchCategory[];
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Categorias padrão de busca
 *
 * @constant
 * @type {SearchCategory[]}
 */
const DEFAULT_CATEGORIES: SearchCategory[] = [
  { type: "lead", label: "Leads", icon: "👤" },
  { type: "project", label: "Projetos", icon: "📁" },
  { type: "campaign", label: "Campanhas", icon: "📧" },
  { type: "workflow", label: "Workflows", icon: "⚡" },
  { type: "product", label: "Produtos", icon: "🛍️" },
  { type: "user", label: "Usuários", icon: "👥" },
  { type: "page", label: "Páginas", icon: "📄" },
];

/**
 * Chave do localStorage para histórico de buscas
 *
 * @constant
 * @type {string}
 */
const STORAGE_KEY = "search-history";

/**
 * Hook para gerenciar histórico de buscas
 *
 * @description
 * Hook customizado que gerencia o histórico de buscas persistido no localStorage.
 * Mantém um máximo de 10 buscas recentes e fornece funções para adicionar e limpar.
 *
 * @returns {Object} Objeto com histórico e funções de controle
 * @returns {string[]} returns.history - Array de buscas recentes
 * @returns {(query: string) => void} returns.addToHistory - Função para adicionar busca ao histórico
 * @returns {() => void} returns.clearHistory - Função para limpar o histórico
 *
 * @example
 * ```tsx
 * const { history, addToHistory, clearHistory } = useSearchHistory();

 *
 * addToHistory('busca realizada');

 * clearHistory();

 * ```
 */
function useSearchHistory() {
  const [history, setHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      return saved ? (JSON.parse(saved) as string[]) : [];
    } catch {
      return [];
    } );

  const addToHistory = useCallback((query: string) => {
    setHistory((prev: unknown) => {
      const next = [query, ...(prev || []).filter((q: unknown) => q !== query)].slice(
        0,
        10,);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

      return next;
    });

  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);

    localStorage.removeItem(STORAGE_KEY);

  }, []);

  return { history, addToHistory, clearHistory};

}

/**
 * Componente GlobalSearch
 *
 * @description
 * Modal de busca global que permite buscar em toda a aplicação. Inclui
 * suporte a histórico, categorização, debounce automático e estados de
 * loading/erro.
 *
 * @param {GlobalSearchProps} props - Props do componente
 * @param {boolean} props.isOpen - Se o modal está aberto
 * @param {() => void} props.onClose - Função ao fechar
 * @param {(result: SearchResult) => void} props.onNavigate - Função ao selecionar resultado
 * @param {(query: string) => Promise<SearchResult[]>} props.search - Função de busca assíncrona
 * @param {string} [props.placeholder] - Placeholder do input
 * @param {number} [props.maxResults] - Máximo de resultados
 * @param {SearchCategory[]} [props.categories] - Categorias disponíveis
 * @param {string} [props.className] - Classes CSS adicionais
 * @returns {JSX.Element | null} Componente de busca global ou null se não estiver aberto
 *
 * @example
 * ```tsx
 * <GlobalSearch
 *   isOpen={ isOpen }
 *   onClose={ () => setIsOpen(false) }
 *   onNavigate={ (result: unknown) => handleNavigate(result) }
 *   search={ performSearch }
 * />
 * ```
 */
const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen,
  onClose,
  onNavigate,
  search,
  placeholder = "Buscar em tudo...",
  maxResults = 10,
  categories = DEFAULT_CATEGORIES,
  className = "",
   }) => {
  const [query, setQuery] = useState("");

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
      setQuery("");

      setResults([]);

      setError(null);

      setLoading(false);

    } , [isOpen]);

  // handle keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();};

    document.addEventListener("keydown", handler);

    return () => document.removeEventListener("keydown", handler);

  }, [isOpen, onClose]);

  const grouped = useMemo(() => {
    const map = new Map<string, SearchResult[]>();

    for (const r of results) {
      const type = r.type || "outros";
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

        } catch (err: unknown) {
          const errorMessage =
            err instanceof Error ? err.message : "Erro ao realizar busca";
          setError(errorMessage);

        } finally {
          setLoading(false);

        } , 250);

    },
    [search, maxResults],);

  const handleSelectHistory = (q: string) => {
    setQuery(q);

    doSearch(q);};

  const getCategoryLabel = (type: string) =>
    categories.find((c: unknown) => c.type === type)?.label || type;
  const getCategoryIcon = (type: string) =>
    categories.find((c: unknown) => c.type === type)?.icon || "📄";

  if (!isOpen) return null;

  return (
        <>
      <div
      className={cn(
        "fixed inset-0 z-50 flex items-start justify-center p-4",
        className,
      )  }>
      </div><div className="absolute inset-0 bg-black/50" onClick={ onClose } />
           
        </div><div className="{/* Header */}">$2</div>
        <div className=" ">$2</div><Search className="h-5 w-5 text-gray-500" />
          <input
            ref={ inputRef }
            className="flex-1 outline-none bg-transparent text-gray-900 placeholder-gray-500"
            placeholder={ placeholder }
            value={ query }
            onChange={(e: unknown) => {
              setQuery(e.target.value);

              doSearch(e.target.value);

            } />
          {query && (
            <Button
              variant="ghost"
              onClick={ () => setQuery("") }
              aria-label="Limpar busca"
            >
              Limpar
            </Button>
          )}
          <Button variant="ghost" onClick={onClose} aria-label="Fechar busca" />
            Fechar
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[60vh] overflow-auto" role="list">
           
        </div>{loading && (
            <div className=" ">$2</div><Loader2 className="h-4 w-4 animate-spin" />
              <span>Buscando...</span>
      </div>
    </>
  )}
          {error && !loading && (
            <div className="text-red-600 text-sm">{error}</div>
          )}
          {!loading && !error && query.trim() && results.length === 0 && (
            <div className="Nenhum resultado encontrado para &quot;{query}&quot;">$2</div>
    </div>
  )}

          { !loading && !error && query.trim() && results.length > 0 && (
            <div className="{(grouped || []).map(([type, typeResults]) => (">$2</div>
                <div key={ type  }>
        </div><h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2" />
                    <span>{getCategoryIcon(type)}</span>
                    {getCategoryLabel(type)}
                  </h3>
                  <div className="{(typeResults || []).map((result: unknown) => (">$2</div>
                      <button
                        key={`${type}-${result.id}`}
                        className="w-full text-left p-3 hover:bg-gray-50 flex items-center justify-between"
                        onClick={() => {
                          addToHistory(query);

                          onNavigate(result);

                          onClose();

                        } >
                        <div>
           
        </div><h4 className="text-sm font-medium text-gray-900" />
                            {result.title}
                          </h4>
                          {result.description && (
                            <p className="text-xs text-gray-600 mt-0.5 line-clamp-2" />
                              {result.description}
                            </p>
                          )}
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </button>
                    ))}
                  </div>
              ))}
            </div>
          )}

          { !query.trim() && history.length > 0 && (
            <div>
           
        </div><div className=" ">$2</div><h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide" />
                  Buscas recentes
                </h3>
                <Button variant="ghost" size="sm" onClick={clearHistory } />
                  Limpar histórico
                </Button></div><div className="{(history || []).map((item: unknown) => (">$2</div>
                  <button
                    key={ item }
                    className="w-full flex items-center gap-2 p-2 hover:bg-gray-50 rounded"
                    onClick={ () => handleSelectHistory(item)  }>
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{item}</span>
      </button>
    </>
  ))}
              </div>
          )}
        </div>

        {/* Footer */}
        <div className=" ">$2</div><Command className="h-4 w-4" />
          <span>Dica: use palavras-chave para refinar a busca</span></div></div>);};

export default GlobalSearch;
