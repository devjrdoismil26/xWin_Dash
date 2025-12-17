import { useBundlesCRUD, useBundlesValidation, useBundlesCalculation, useBundlesAnalytics, useBundlesProducts } from './bundles';

export const useProductBundles = () => {
  const crud = useBundlesCRUD();

  const validation = useBundlesValidation();

  const calculation = useBundlesCalculation();

  const analytics = useBundlesAnalytics();

  const products = useBundlesProducts();

  return {
    // CRUD
    bundles: crud.bundles,
    loading: crud.loading,
    createBundle: crud.create,
    updateBundle: crud.update,
    deleteBundle: crud.remove,
    fetchBundles: crud.fetchAll,

    // Validation
    validateBundle: validation.validate,

    // Calculation
    calculateTotal: calculation.calculateTotal,
    calculateDiscount: calculation.calculateDiscount,
    calculateFinalPrice: calculation.calculateFinalPrice,

    // Analytics
    analytics: analytics.analytics,
    fetchAnalytics: analytics.fetchAnalytics,

    // Products
    selectedProducts: products.selectedProducts,
    addProduct: products.addProduct,
    removeProduct: products.removeProduct,
    clearProducts: products.clearProducts};
};
