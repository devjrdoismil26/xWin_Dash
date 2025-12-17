import { render, screen, fireEvent } from '@testing-library/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/components/ui/Tabs';

describe('Tabs', () => {
  it('should render tabs', () => {
    render(
      <Tabs defaultValue="tab1" />
        <TabsList />
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger></TabsList><TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>);

    expect(screen.getByText('Tab 1')).toBeInTheDocument();

    expect(screen.getByText('Tab 2')).toBeInTheDocument();

  });

  it('should show default tab content', () => {
    render(
      <Tabs defaultValue="tab1" />
        <TabsList />
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger></TabsList><TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>);

    expect(screen.getByText('Content 1')).toBeVisible();

  });

  it('should switch tabs on click', () => {
    render(
      <Tabs defaultValue="tab1" />
        <TabsList />
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger></TabsList><TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>);

    fireEvent.click(screen.getByText('Tab 2'));

    expect(screen.getByText('Content 2')).toBeVisible();

  });

});
