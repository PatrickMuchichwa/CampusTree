const BaseModel = require("./BaseModel");

class AdminModel extends BaseModel {
  constructor() {
    super("Admin", "admin_id");
  }
}

module.exports = new AdminModel();
