import db from "@/../config/dbConfig";
import bcrypt from "bcrypt";
import { getUniqueId } from "../../../lib/getUniqueId";

const Admin = db.admin;

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { first_name, last_name, email, password, is_master } = req.body;

    const isExist = await Admin.findOne({ where: { email } });

    if (isExist) {
      return res
        .status(200)
        .send({ status: false, message: "Email already exist" });
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
