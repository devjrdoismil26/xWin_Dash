/**
 * Componente Dropdown - Menu Dropdown Reutiliz?vel
 *
 * @description
 * Sistema completo de dropdown/menu suspenso com suporte a m?ltiplos sub-componentes,
 * controle de estado via Context API, fechamento ao clicar fora e alinhamento customiz?vel.
 * Projetado para ser o componente de dropdown padr?o da aplica??o.
 *
 * Funcionalidades principais:
 * - Controle de estado via Context API
 * - Sub-componentes modulares (Trigger, Content, Item, Link, Divider)
 * - Fechamento ao clicar fora do dropdown
 * - Alinhamento customiz?vel (left, right, center, start)
 * - Largura configur?vel (auto, sm, md, lg, xl, full)
 * - Suporte a asChild pattern
 * - Suporte a links e bot?es
 * - Estados disabled
 * - Suporte completo a dark mode
 *
 * @module components/ui/Dropdown
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import Dropdown from '@/shared/components/ui/Dropdown';
 *
 * <Dropdown />
 *   <Dropdown.Trigger>Abrir Menu</Dropdown.Trigger>
 *   <Dropdown.Content />
 *     <Dropdown.Divider / />
 *     <Dropdown.Link href="/settings">Configura??es</Dropdown.Link>
 *   </Dropdown.Content>
 * </Dropdown>
 * ```
 */

import React, {
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
} from "react";
import PropTypes from "prop-types";
import { ChevronDown } from 'lucide-react';

/**
 * Context do Dropdown
 *
 * @description
 * Context que fornece o estado e controle do dropdown para os sub-componentes.
 *
 * @typedef {Object} DropdownContextValue
 * @property {boolean} open - Estado aberto/fechado do dropdown
 * @property {(value: boolean) => void} setOpen - Fun??o para controlar o estado
 * @property {() => void} toggleOpen - Fun??o para alternar o estado
 */
const DropdownContext = createContext({
  open: false,
  setOpen: () => {},
  toggleOpen: () => {},
});

/**
 * Hook useDropdown
 *
 * @description
 * Hook para acessar o contexto do Dropdown. Deve ser usado dentro de sub-componentes do Dropdown.
 *
 * @returns {DropdownContextValue} Contexto do Dropdown com open, setOpen e toggleOpen
 * @throws {Error} Se usado fora do componente Dropdown
 */
const useDropdown = () => {
  const context = useContext(DropdownContext);

  if (!context) {
    throw new Error("useDropdown must be used within a Dropdown");

  }
  return context;};

interface DropdownProps {
  children: React.ReactNode;
  align?: "left" | "right" | "center" | "start";
  width?: "auto" | "sm" | "md" | "lg" | "xl" | "full";
  className?: string; }

/**
 * Componente Dropdown (Provider)
 *
 * @description
 * Componente principal do Dropdown que fornece o contexto e controla o estado
 * do dropdown. Gerencia o fechamento ao clicar fora e fornece configura??es de
 * alinhamento e largura.
 *
 * @component
 * @param {DropdownProps} props - Props do componente
 * @param {React.ReactNode} props.children - Sub-componentes do Dropdown
 * @param {'left'|'right'|'center'|'start'} [props.align='left'] - Alinhamento do dropdown
 * @param {'auto'|'sm'|'md'|'lg'|'xl'|'full'} [props.width='auto'] - Largura do dropdown
 * @param {string} [props.className=''] - Classes CSS adicionais
 * @returns {JSX.Element} Provider do Dropdown
 */
const Dropdown = ({
  children,
  align = "left",
  width = "auto",
  className = "",
}: DropdownProps) => {
  const [open, setOpen] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);};

    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);

  }, []);

  const toggleOpen = () => setOpen((prev: unknown) => !prev);

  const alignmentClasses = {
    left: "left-0",
    right: "right-0",
    center: "left-1/2 transform -translate-x-1/2",
    start: "left-0",};

  const widthClasses = {
    auto: "w-auto",
    sm: "w-48",
    md: "w-56",
    lg: "w-64",
    xl: "w-72",
    full: "w-full",};

  return (
        <>
      <DropdownContext.Provider value={ open, setOpen, toggleOpen } />
      <div ref={ref} className={`relative inline-block text-left ${className} `}>
           
        </div>{children}
      </div>
    </DropdownContext.Provider>);};

interface DropdownTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string; }

/**
 * Sub-componente DropdownTrigger
 *
 * @description
 * Componente que dispara a abertura/fechamento do dropdown ao ser clicado.
 *
 * @component
 * @param {DropdownTriggerProps} props - Props do componente
 * @param {React.ReactNode} props.children - Elemento trigger
 * @param {boolean} [props.asChild=false] - Renderizar como child (clone element)
 * @param {string} [props.className=''] - Classes CSS adicionais
 * @returns {JSX.Element} Componente de trigger do dropdown
 */
const DropdownTrigger = ({
  children,
  asChild = false,
  className = "",
}: DropdownTriggerProps) => {
  const { toggleOpen } = useDropdown();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: (e: unknown) => {
        children.props.onClick?.(e);

        toggleOpen();

      },
    });

  }

  return (
            <button
      type="button"
      className={`inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none ${className} `}
      onClick={ toggleOpen } />
      {children}
    </button>);};

interface DropdownContentProps {
  children: React.ReactNode;
  align?: "left" | "right" | "center" | "start";
  width?: "auto" | "sm" | "md" | "lg" | "xl" | "full";
  className?: string; }

/**
 * Sub-componente DropdownContent
 *
 * @description
 * Conte?do principal do dropdown que exibe os itens do menu.
 *
 * @component
 * @param {DropdownContentProps} props - Props do componente
 * @param {React.ReactNode} props.children - Itens do dropdown
 * @param {'left'|'right'|'center'|'start'} [props.align='left'] - Alinhamento do dropdown
 * @param {'auto'|'sm'|'md'|'lg'|'xl'|'full'} [props.width='auto'] - Largura do dropdown
 * @param {string} [props.className=''] - Classes CSS adicionais
 * @returns {JSX.Element|null} Conte?do do dropdown ou null se fechado
 */
const DropdownContent = ({
  children,
  align = "left",
  width = "auto",
  className = "",
}: DropdownContentProps) => {
  const { open } = useDropdown();

  const alignmentClasses = {
    left: "left-0",
    right: "right-0",
    center: "left-1/2 transform -translate-x-1/2",
    start: "left-0",};

  const widthClasses = {
    auto: "w-auto",
    sm: "w-48",
    md: "w-56",
    lg: "w-64",
    xl: "w-72",
    full: "w-full",};

  if (!open) return null;

  return (
        <>
      <div
      className={`absolute z-50 mt-2 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-600 ${alignmentClasses[align]} ${widthClasses[width]} ${className}`}>
      </div><div className="py-1">{children}</div>);};

interface DropdownItemProps {
  children: React.ReactNode;
  onClick??: (e: any) => void;
  disabled?: boolean;
  className?: string;
  href?: string;
  method?: string;
  as?: string; }

/**
 * Sub-componente DropdownItem
 *
 * @description
 * Item individual do dropdown que pode ser um bot?o ou link.
 *
 * @component
 * @param {DropdownItemProps} props - Props do componente
 * @param {React.ReactNode} props.children - Conte?do do item
 * @param {(e: React.MouseEvent) => void} [props.onClick] - Handler de clique
 * @param {boolean} [props.disabled=false] - Estado desabilitado
 * @param {string} [props.className=''] - Classes CSS adicionais
 * @param {string} [props.href] - URL para renderizar como link
 * @param {string} [props.method='get'] - M?todo HTTP (para links)
 * @param {string} [props.as='button'] - Tipo de elemento a renderizar
 * @returns {JSX.Element} Componente de item do dropdown
 */
const DropdownItem = ({
  children,
  onClick,
  disabled = false,
  className = "",
  href,
  method = "get",
  as = "button",
}: DropdownItemProps) => {
  const { setOpen } = useDropdown();

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return;
    onClick?.(e);

    setOpen(false);};

  if (href) {
    return (
              <a
        href={ href }
        className={`block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
        onClick={ handleClick } />
        {children}
      </a>);

  }

  return (
            <button
      type="button"
      onClick={ handleClick }
      disabled={ disabled }
      className={`block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`} />
      {children}
    </button>);};

// Link component (alias for Item with href)
const DropdownLink = ({ children, href, className = "", ...props }) => (
  <DropdownItem href={href} className={className} { ...props } />
    {children}
  </DropdownItem>);

/**
 * Sub-componente DropdownDivider
 *
 * @description
 * Divisor visual para separar grupos de itens no dropdown.
 *
 * @component
 * @param {object} props - Props do componente
 * @param {string} [props.className=''] - Classes CSS adicionais
 * @returns {JSX.Element} Componente de divisor do dropdown
 */
const DropdownDivider = ({ className = "" }) => (
  <div className={`my-1 h-px bg-gray-200 dark:bg-gray-600 ${className} `} />);

        </div>

// Adicionar subcomponentes ao Dropdown principal
Dropdown.Trigger = DropdownTrigger;
Dropdown.Content = DropdownContent;
Dropdown.Item = DropdownItem;
Dropdown.Link = DropdownLink;
Dropdown.Divider = DropdownDivider;

// PropTypes
Dropdown.propTypes = {
  children: PropTypes.node,
  align: PropTypes.oneOf(["left", "right", "center", "start"]),
  width: PropTypes.oneOf(["auto", "sm", "md", "lg", "xl", "full"]),
  className: PropTypes.string,};

DropdownTrigger.propTypes = {
  children: PropTypes.node.isRequired,
  asChild: PropTypes.bool,
  className: PropTypes.string,};

DropdownContent.propTypes = {
  children: PropTypes.node,
  align: PropTypes.oneOf(["left", "right", "center", "start"]),
  width: PropTypes.oneOf(["auto", "sm", "md", "lg", "xl", "full"]),
  className: PropTypes.string,};

DropdownItem.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  href: PropTypes.string,
  method: PropTypes.string,
  as: PropTypes.string,};

DropdownLink.propTypes = {
  children: PropTypes.node,
  href: PropTypes.string.isRequired,
  className: PropTypes.string,};

DropdownDivider.propTypes = {
  className: PropTypes.string,};

export default Dropdown;
