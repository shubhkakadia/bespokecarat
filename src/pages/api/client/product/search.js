import { Op } from "sequelize";
import db from "../../../../../config/dbConfig";
import { SEARCH_MAP } from "../../../../../lib/mappers";
import { isAdmin, isClient } from "../../../../../lib/authFromToken";

export default async function handler(req, res) {
  const client = await isClient(req);
  const admin = await isAdmin(req);

  if (!client || !admin) {
    return res
      .status(200)
      .send({ status: false, message: "Authorization failed" });
  }

  if (req.method === "GET") {
    try {
      const q = String(req.query.q || "").trim();

      if (!q) {
        return res
          .status(200)
          .send({ status: true, message: "search value empty", data: [] });
      }

      const whereBase = (Model) => {
        const conds = [
          { name: { [Op.like]: `%${q}%` } },
          { sku: { [Op.like]: `%${q}%` } },
        ];
        if (Model?.rawAttributes?.shape) {
          conds.push({ shape: { [Op.like]: `%${q}%` } });
        }
        return { [Op.or]: conds };
      };

      const results = await Promise.all(
        Object.entries(SEARCH_MAP).map(async ([cat, conf]) => {
          const rows = await conf.model.findAll({
            where: whereBase(conf.model),
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
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

          return rows.map((r) => ({
            ...r.toJSON(),
            product_type: cat.charAt(0).toUpperCase() + cat.slice(1),
          }));
        })
      );

      const flat = results.flat();

      if (flat.length === 0) {
        return res.status(200).send({
          status: true,
          message: `No products found for '${q}'`,
          data: [],
        });
      }

      return res
        .status(200)
        .send({ status: true, message: "success", data: flat });
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
