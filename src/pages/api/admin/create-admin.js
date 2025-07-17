import db from "@/../config/dbConfig";
import bcrypt from "bcrypt";
import { isMasterAdmin } from "../../../../lib/authFromToken";
import { getUniqueId } from "../../../../lib/getUniqueId";

const Admin = db.admin;
const Customers = db.customers;

export default async function handler(req, res) {
  if (req.method === "POST") {
    const masterAdmin = await isMasterAdmin(req);

    if (!masterAdmin) {
      return res
        .status(200)
        .send({ status: false, message: "Only master admin allowed" });
    }

    const { first_name, last_name, email, password, is_master } = req.body;

    const isExistAdmin = await Admin.findOne({ where: { email } });

    const isExistCustomer = await Customers.findOne({ where: { email } });

    if (isExistAdmin || isExistCustomer) {
      return res
        .status(200)
        .send({ status: false, message: "Email already exists" });
    }

    const defualtPwd = bcrypt.hashSync(password, 10);

    const data = {
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      email: email.trim(),
      password: defualtPwd,
      user_type: is_master ? "master-admin" : "admin",
      unique_id: getUniqueId(10),
    };

    await Admin.create(data);

    return res
      .status(200)
      .send({ status: true, message: "Admin Created Successfully", data });
  } else {
    return res.status(200).send({ status: false, message: "Not Allowed" });
  }
}
