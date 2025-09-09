import { isClient } from "../../../../lib/authFromToken";

const db = require("../../../../config/dbConfig");
const { SEARCH_MAP } = require("../../../../lib/mappers");

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export default async function handler(req, res) {
  const client = await isClient(req);

  if (!client) {
    return res
      .status(200)
      .send({ status: false, message: "Authorization failed" });
  }

  if (req.method === "GET") {
    try {
      const grouped = {};

      await Promise.all(
        Object.entries(SEARCH_MAP).map(async ([cat, conf]) => {
          const rows = await conf.model.findAll({
            where: {},
            attributes: { exclude: ["createdAt", "updatedAt"] },
            include: [
              {
                model: db.medias,
                as: "medias",
                attributes: {
                  exclude: ["createdAt", "updatedAt", "product_slug"],
                },
                required: false,
              },
              {
                model: conf.relation,
                as: conf.relAs,
                attributes: { exclude: ["createdAt", "updatedAt", conf.fk] },
                required: false,
              },
            ],
            order: [["createdAt", "DESC"]],
          });

          grouped[cap(cat)] = rows.map((r) => r.toJSON());
        })
      );

      return res.status(200).send({
        status: true,
        message: "success",
        data: grouped,
      });
    } catch (error) {
      return res.status(200).send({
        status: false,
        message: "Something went wrong",
      });
    }
  } else {
    return res.status(200).send({ status: false, message: "Not Allowed" });
  }
}
