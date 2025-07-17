import db from "../../../config/dbConfig";
import { getUniqueId } from "../../../lib/getUniqueId";
import bcrypt from "bcrypt";
import { signInValidator } from "../../../lib/validators/signInValidator";

const Admin = db.admin;
const Customers = db.customers;
const Sessions = db.sessions;

function isEmail(input) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
}

function isPhone(input) {
  return /^\+?\d{10,15}$/.test(input);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).send({ status: false, message: "Not Allowed" });
  }

  const { error, value } = signInValidator.validate(req.body);
  if (error) {
    return res
      .status(200)
      .json({ status: false, message: error.details[0].message });
  }

  const { email_or_phone, password } = value;
  const identifier = email_or_phone.trim();

  let user = null;

  if (isEmail(identifier)) {
    user = await Customers.findOne({ where: { email: identifier } });

    if (!user) {
      user = await Admin.findOne({ where: { email: identifier } });
    }
  } else if (isPhone(identifier)) {
    user = await Customers.findOne({ where: { phone_number: identifier } });
  } else {
    return res
      .status(200)
      .send({ status: false, message: "Invalid email or phone format" });
  }

  if (!user) {
    return res
      .status(200)
      .send({ status: false, message: "Account doesn't exist" });
  }

  const isPasswordValid = bcrypt.compareSync(password.trim(), user.password);
  if (!isPasswordValid) {
    return res
      .status(200)
      .send({ status: false, message: "Credentials are wrong" });
  }

  const token = `${user.unique_id}-${getUniqueId(99)}`;

  await Sessions.create({
    userId: user.id,
    token,
    user_type: user.user_type,
  });

  return res.status(200).send({
    status: true,
    message: "Logged in successfully",
    data: {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone_number: user.phone_number,
      token,
      user_type: user.user_type,
    },
  });
}
