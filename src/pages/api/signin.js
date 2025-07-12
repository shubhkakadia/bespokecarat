import db from "../../../config/dbConfig";
import { getUniqueId } from "../../../lib/getUniqueId";
import bcrypt from "bcrypt";

const Admin = db.admin;
const Sessions = db.sessions;

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    const isExist = await Admin.findOne({ where: { email } });

    if (!isExist) {
      return res
        .status(200)
        .send({ status: false, message: "Email doesn't exist" });
    }

    if (!bcrypt.compareSync(password.trim(), isExist.password)) {
      return res
        .status(200)
        .send({ status: false, message: "Credentials are wrong" });
    }

    const token = `${isExist.unique_id}-${getUniqueId(99)}`;

    const data = {
      userId: isExist.id,
      token,
      user_type: isExist.user_type,
    };

    await Sessions.create(data);

    return res.status(200).send({
      status: true,
      message: "Logged in successfully",
      data: { token },
    });
  } else {
    return res.status(200).send({ status: false, message: "Not Allowed" });
  }
}
