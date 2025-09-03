module.exports = (Seq, DT) => {
  const CutVariants = Seq.define(
    "cut_variants",
    {
      cutId: { type: DT.INTEGER, allowNull: false },
      dimension: { type: DT.STRING, allowNull: false },
      carat_weight: { type: DT.FLOAT, allowNull: false },
      price: { type: DT.FLOAT, allowNull: false },
    },
    { timestamps: true, freezeTableName: true }
  );

  return CutVariants;
};
