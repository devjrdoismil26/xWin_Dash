import React from 'react';

interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange??: (e: any) => void;
  children: React.ReactNode;
  className?: string; }

interface TabsListProps {
  children: React.ReactNode;
  className?: string; }

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string; }

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string; }

const TabsContext = React.createContext<{
  value: string;
  onValueChange?: (e: any) => void;
}>({ value: '', onValueChange: () => {} );

export default function Tabs({ defaultValue = '', value, onValueChange, children, className = '' }: TabsProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);

  const currentValue = value !== undefined ? value : internalValue;
  const handleChange = onValueChange || setInternalValue;

  return (
        <>
      <TabsContext.Provider value={ value: currentValue, onValueChange: handleChange } />
      <div className={className } >{children}</div>
    </TabsContext.Provider>);

}

export function TabsList({ children, className = '' }: TabsListProps) {
  return <div className={`flex space-x-2 border-b ${className} `}>{children}</div>;
}

export function TabsTrigger({ value, children, className = '' }: TabsTriggerProps) {
  const { value: currentValue, onValueChange } = React.useContext(TabsContext);

  const isActive = currentValue === value;

  return (
            <button
      onClick={ () => onValueChange(value) }
      className={`px-4 py-2 ${isActive ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'} ${className}`}
  >
      {children}
    </button>);

}

export function TabsContent({ value, children, className = '' }: TabsContentProps) {
  const { value: currentValue } = React.useContext(TabsContext);

  if (currentValue !== value) return null;
  
  return <div className={className } >{children}</div>;
}
