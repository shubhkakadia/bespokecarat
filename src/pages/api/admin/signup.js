import db from "@/../config/dbConfig";
import bcrypt from "bcrypt";
import { isMasterAdmin } from "../../../../lib/authFromToken";
import { getUniqueId } from "../../../../lib/getUniqueId";

const Admin = db.admin;

export default async function handler(req, res) {
  if (req.method === "POST") {
    const masterAdmin = await isMasterAdmin(req);

    if (!masterAdmin) {
      return res
        .status(200)
        .send({ status: false, message: "Only master admin allowed" });
    }

    const { firstName, lastName, email, password, isMaster } = req.body;

    const isExist = await Admin.findOne({ where: { email } });

    if (isExist) {
      return res
        .status(200)
        .send({ status: false, message: "Email already exist" });
    }

    const defualtPwd = bcrypt.hashSync(password, 10);

    const data = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim(),
      password: defualtPwd,
      user_type: isMaster ? "master-admin" : "admin",
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
