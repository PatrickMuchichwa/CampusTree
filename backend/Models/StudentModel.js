const BaseModel = require("./BaseModel");

class StudentModel extends BaseModel {
  constructor() {
    super("Student", "student_id");
  }
}

module.exports = new StudentModel();
