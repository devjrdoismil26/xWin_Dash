// ADStool Service
class ADStoolServiceClass {
  async getCampaigns() {
    return { data: [], success: true};

  }

  async getCampaign(id: string) {
    return { data: null, success: true};

  }

  async createCampaign(data: unknown) {
    return { data, success: true};

  }

  async updateCampaign(id: string, data: unknown) {
    return { data, success: true};

  }

  async deleteCampaign(id: string) {
    return { success: true};

  } export const ADStoolService = new ADStoolServiceClass();

export default ADStoolService;
