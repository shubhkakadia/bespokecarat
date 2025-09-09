import db from "../config/dbConfig";

// MAAPPING FOR SEARCH

export const SEARCH_MAP = {
  diamonds: {
    model: db.diamonds,
    relation: db.diamondVariants,
    relAs: "variants",
    fk: "diamondId",
  },
  melees: {
    model: db.melees,
    relation: db.sieveSize,
    relAs: "sieve_sizes",
    fk: "meleeId",
  },
  cuts: {
    model: db.cuts,
    relation: db.cutVariants,
    relAs: "variants",
    fk: "cutId",
  },
  colorstones: {
    model: db.colorStone,
    relation: db.colorStoneVariants,
    relAs: "variants",
    fk: "colorStoneId",
  },
  layouts: {
    model: db.layout,
    relation: db.diamondDetails,
    relAs: "diamond_details",
    fk: "layoutId",
  },
  alphabets: {
    model: db.alphabets,
    relation: db.alphabetVariants,
    relAs: "variants",
    fk: "alphabetId",
  },
};
