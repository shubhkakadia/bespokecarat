const db = require("../config/dbConfig");
const { SEARCH_MAP } = require("./mappers");

async function isGlobalSkuTaken(sku, transaction, opts = {}) {
  const { excludeKey, excludeId } = opts;
  const normSku = String(sku || "")
    .trim()
    .toUpperCase();
  if (!normSku) return { taken: false };

  for (const key of Object.keys(SEARCH_MAP)) {
    const entry = SEARCH_MAP[key];
    if (!entry?.model) continue;

    const where = { sku: normSku };
    if (excludeKey === key && excludeId != null) {
      where.id = { [db.Sequelize.Op.ne]: excludeId };
    }

    const hit = await entry.model.findOne({
      where,
      attributes: ["id", "sku"],
      transaction,
      raw: true,
    });

    if (hit) {
      const table =
        entry.model?.getTableName?.() || entry.model?.tableName || key;
      return { taken: true, table, id: hit.id };
    }
  }

  return { taken: false };
}

module.exports = { isGlobalSkuTaken };
