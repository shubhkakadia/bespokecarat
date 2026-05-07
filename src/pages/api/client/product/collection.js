import { SEARCH_MAP } from "../../../../../lib/mappers";
const db = require("../../../../../config/dbConfig");

const ALLOWED = [
  "diamonds",
  "melees",
  "cuts",
  "layouts",
  "alphabets",
  "colorstones",
];

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const c = String(req.query.c || "")
        .trim()
        .toLowerCase();

      if (!c) {
        return res
          .status(200)
          .send({ status: true, message: "search value empty", data: [] });
      }

      if (!ALLOWED.includes(c)) {
        return res.status(200).send({
          status: true,
          message: `Unknown collection '${c}'`,
          data: { collection: c, collections: [] },
        });
      }

      const entry = SEARCH_MAP[c];

      if (!entry || !entry.model) {
        return res.status(200).send({
          status: true,
          message: `Collection not configured: "${c}"`,
          data: { collection: c, collections: [] },
        });
      }

      const rows = await entry.model.findAll({
        attributes: { exclude: ["updatedAt"] },
        include: [
          entry.relation && entry.relAs
            ? {
                model: entry.relation,
                as: entry.relAs,
                attributes: { exclude: ["createdAt", "updatedAt"] },
              }
            : null,
          {
            model: db.medias,
            as: "medias",
            attributes: { exclude: ["createdAt", "updatedAt", "product_slug"] },
          },
        ].filter(Boolean),
        order: [["createdAt", "DESC"]],
      });

      return res.status(200).send({
        status: true,
        message: "success",
        data: {
          collection: c,
          products: rows,
        },
      });
    } catch (error) {
      console.error("Collection API error:", error);
      return res.status(200).send({
        status: false,
        message: "Something went wrong",
      });
    }
  } else {
    return res.status(200).send({ status: false, message: "Not allowed" });
  }
}
