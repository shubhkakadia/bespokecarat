import { isAdmin, isClient } from "../../../lib/authFromToken";
import { SEARCH_MAP } from "../../../lib/mappers";

const db = require("../../../config/dbConfig");

export default async function handler(req, res) {
  const client = await isClient(req);
  const admin = await isAdmin(req);

  if (!client && !admin) {
    return res
      .status(200)
      .send({ status: false, message: "Authorization failed" });
  }

  if (req.method === "GET") {
    try {
      const sku = String(req.query.sku || "")
        .trim()
        .toLowerCase();

      if (!sku) {
        return res
          .status(200)
          .send({ status: true, message: "search value empty", data: [] });
      }

      let found = null;
      let collection = null;

      for (const c of Object.keys(SEARCH_MAP)) {
        const entry = SEARCH_MAP[c];
        if (!entry?.model) continue;

        const product = await entry.model.findOne({
          where: { sku },
          attributes: { exclude: ["createdAt", "updatedAt"] },
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
              attributes: {
                exclude: ["createdAt", "updatedAt", "product_slug"],
              },
            },
          ].filter(Boolean),
        });

        if (product) {
          found = product;
          collection = c;
          break;
        }
      }

      if (!found) {
        return res.status(200).send({
          status: true,
          message: `No product found with SKU '${sku}'`,
          data: [],
        });
      }

      return res.status(200).send({
        status: true,
        message: "success",
        data: {
          product_type: collection,
          product: found,
        },
      });
    } catch (error) {
      return res.status(200).json({ status: false, message: error.message });
    }
  } else {
    res.status(200).send({ status: false, message: "Not Allowed" });
  }
}
