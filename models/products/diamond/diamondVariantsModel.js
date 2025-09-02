module.exports = (Seq, DT) => {
  const DiamondVariants = Seq.define(
    "diamond_variants",
    {
      diamondId: { type: DT.INTEGER, allowNull: false },
      color: { type: DT.STRING, allowNull: false },
      clarity: { type: DT.STRING, allowNull: false },
      carat_weight: { type: DT.FLOAT, allowNull: false },
      price: { type: DT.FLOAT, allowNull: false },
    },
    { timestamps: true, freezeTableName: true }
  );

  return DiamondVariants;
};
