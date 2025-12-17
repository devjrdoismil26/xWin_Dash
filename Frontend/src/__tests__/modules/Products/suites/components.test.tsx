/**
 * Testes de Componentes - Módulo Products
 */

import "../setup";
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

describe("Módulo Products - Testes de Componentes", () => {
  beforeEach(() => {
    vi.clearAllMocks();

  });

  describe("ProductsDashboard", () => {
    it("deve renderizar dashboard corretamente", () => {
      render(<ProductsDashboard />);

      expect(screen.getByText("Products Dashboard")).toBeInTheDocument();

      expect(
        screen.getByText("Manage your products and inventory"),
      ).toBeInTheDocument();

    });

    it("deve exibir estatísticas", async () => {
      render(<ProductsDashboard />);

      await waitFor(() => {
        expect(screen.getByText("Total Products")).toBeInTheDocument();

        expect(screen.getByText("Active Products")).toBeInTheDocument();

      });

    });

  });

  describe("ProductsStats", () => {
    it("deve renderizar estatísticas", () => {
      render(<ProductsStats />);

      expect(screen.getByText("Product Statistics")).toBeInTheDocument();

    });

    it("deve permitir alternar entre gráfico e tabela", () => {
      render(<ProductsStats showChart showTable />);

      expect(screen.getByText("Chart")).toBeInTheDocument();

      expect(screen.getByText("Table")).toBeInTheDocument();

    });

  });

  describe("ProductsFilters", () => {
    it("deve renderizar filtros", () => {
      render(<ProductsFilters />);

      expect(screen.getByText("Filters")).toBeInTheDocument();

      expect(screen.getByDisplayValue("All")).toBeInTheDocument();

    });

    it("deve permitir filtrar por categoria", () => {
      render(<ProductsFilters showCategoryFilter />);

      expect(screen.getByDisplayValue("All Categories")).toBeInTheDocument();

    });

  });

  describe("ProductsList", () => {
    it("deve renderizar lista de produtos", () => {
      render(<ProductsList />);

      expect(screen.getByText("Products List")).toBeInTheDocument();

    });

    it("deve permitir seleção múltipla", () => {
      render(<ProductsList allowMultiSelect />);

      expect(screen.getByText("Select All")).toBeInTheDocument();

    });

  });

  describe("ProductsForm", () => {
    it("deve renderizar formulário", () => {
      render(<ProductsForm />);

      expect(screen.getByText("Product Form")).toBeInTheDocument();

    });

    it("deve validar campos obrigatórios", async () => {
      render(<ProductsForm />);

      const submitButton = screen.getByText("Save Product");

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Name is required")).toBeInTheDocument();

      });

    });

  });

  describe("VariationsManager", () => {
    it("deve renderizar gerenciador de variações", () => {
      render(<VariationsManager productId="1" />);

      expect(screen.getByText("Product Variations")).toBeInTheDocument();

    });

    it("deve permitir adicionar variação", () => {
      render(<VariationsManager productId="1" />);

      const addButton = screen.getByText("Add Variation");

      fireEvent.click(addButton);

      expect(screen.getByText("New Variation")).toBeInTheDocument();

    });

  });

  describe("ImagesManager", () => {
    it("deve renderizar gerenciador de imagens", () => {
      render(<ImagesManager productId="1" />);

      expect(screen.getByText("Product Images")).toBeInTheDocument();

    });

    it("deve permitir upload de imagem", () => {
      render(<ImagesManager productId="1" />);

      expect(screen.getByText("Upload Image")).toBeInTheDocument();

    });

  });

  describe("ReviewsManager", () => {
    it("deve renderizar gerenciador de reviews", () => {
      render(<ReviewsManager productId="1" />);

      expect(screen.getByText("Product Reviews")).toBeInTheDocument();

    });

    it("deve exibir estatísticas de reviews", () => {
      render(<ReviewsManager productId="1" showStats />);

      expect(screen.getByText("Review Statistics")).toBeInTheDocument();

    });

  });

  describe("AnalyticsDashboard", () => {
    it("deve renderizar dashboard de analytics", () => {
      render(<AnalyticsDashboard />);

      expect(screen.getByText("Product Analytics")).toBeInTheDocument();

    });

    it("deve exibir métricas de performance", () => {
      render(<AnalyticsDashboard showMetrics />);

      expect(screen.getByText("Performance Metrics")).toBeInTheDocument();

    });

  });

});
