import db from "../../../config/dbConfig";
import { getUniqueId } from "../../../lib/getUniqueId";
import bcrypt from "bcrypt";
import { signInValidator } from "../../../lib/validators/signInValidator";

const Admin = db.admin;
const Customers = db.customers;
const Sessions = db.sessions;

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { error, value } = signInValidator.validate(req.body);

    if (error) {
      return res
        .status(200)
        .json({ status: false, message: error.details[0].message });
    }

    const { email, password } = value;

    let user = await Admin.findOne({ where: { email } });

    if (!user) {
      user = await Customers.findOne({ where: { email } });
    }

    if (!user) {
      return res
        .status(200)
        .send({ status: false, message: "Email doesn't exist" });
    }

    const isPasswordValid = bcrypt.compareSync(password.trim(), user.password);
    if (!isPasswordValid) {
      return res
        .status(200)
        .send({ status: false, message: "Credentials are wrong" });
    }
    const token = `${user.unique_id}-${getUniqueId(99)}`;

    const data = {
      userId: user.id,
      token,
      user_type: user.user_type,
    };

    await Sessions.create(data);

    return res.status(200).send({
      status: true,
      message: "Logged in successfully",
      data: {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        token,
        user_type: user.user_type,
      },
    });
  } else {
    return res.status(200).send({ status: false, message: "Not Allowed" });
  }
}
