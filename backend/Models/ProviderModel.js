const BaseModel = require("./BaseModel");

class ProviderModel extends BaseModel {
  constructor() {
    super("ServiceProvider", "provider_id");
  }
}

module.exports = new ProviderModel();
