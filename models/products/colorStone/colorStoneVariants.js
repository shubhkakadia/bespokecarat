module.exports = (Seq, DT) => {
  const ColorStonesVariants = Seq.define(
    "color_stones_variants",
    {
      colorStoneId: { type: DT.INTEGER, allowNull: false },
      shape: { type: DT.STRING, allowNull: false },
      dimension: { type: DT.STRING, allowNull: false },
      carat_weight: { type: DT.FLOAT, allowNull: false },
      price: { type: DT.FLOAT, allowNull: false },
    },
    { timestamps: true, freezeTableName: true }
  );

  return ColorStonesVariants;
};
