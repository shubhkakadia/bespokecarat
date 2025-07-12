import db from "../../../config/dbConfig";

const Sessions = db.sessions;

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { authorization } = req.headers;

    if (!authorization) {
      return res
        .status(200)
        .send({ status: false, message: "Session required" });
    }

    // Assuming you have a Sessions model to handle session data
    const session = await Sessions.findOne({ where: { token: authorization } });

    if (!session) {
      return res
        .status(200)
        .send({ status: false, message: "Session not found" });
    }

    // Delete the session
    await Sessions.destroy({ where: { token: authorization } });

    return res
      .status(200)
      .send({ status: true, message: "Logged out successfully" });
  } else {
    return res.status(200).send({ status: false, message: "Not Allowed" });
  }
}
