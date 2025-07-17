import db from "../../../config/dbConfig";
import bcrypt from "bcrypt";
import { getUniqueId } from "../../../lib/getUniqueId";
import { signUpValidator } from "../../../lib/validators/signUpValidator";

const Customers = db.customers;

export default async function (req, res) {
  if (req.method === "POST") {
    const { error, value } = signUpValidator.validate(req.body);

    if (error) {
      return res
        .status(200)
        .send({ status: false, message: error.details[0].message });
    }

    const {
      first_name,
      last_name,
      email,
      phone_number,
      company_name,
      password,
      accepted_terms,
      newsletter,
    } = value;

    const isExist = await Customers.findOne({ where: { email } });

    if (isExist) {
      return res
        .status(200)
        .send({ status: false, message: "Email already exist" });
    }

    const phoneExist = await Customers.findOne({
      where: { phone_number },
    });
    if (phoneExist) {
      return res
        .status(200)
        .send({ status: false, message: "Phone number already exists" });
    }

    const hasedPwd = bcrypt.hashSync(password, 10);

    const data = {
      first_name,
      last_name,
      email,
      phone_number,
      company_name,
      password: hasedPwd,
      user_type: "customer",
      unique_id: getUniqueId(10),
      accepted_terms,
      newsletter,
    };

    await Customers.create(data);

    return res
      .status(200)
      .send({ status: true, message: "Account created successfully" });
  } else {
    return res.status(200).send({ status: false, message: "Not Allowed" });
  }
}
