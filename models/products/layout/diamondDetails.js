module.exports = (Seq, DT) => {
  const DiamondDetails = Seq.define(
    "diamond_details",
    {
      layoutId: { type: DT.INTEGER, allowNull: false },
      shape: { type: DT.STRING, allowNull: false },
      pcs: { type: DT.INTEGER, allowNull: false },
      carat_weight: { type: DT.FLOAT, allowNull: false },
      dimension: { type: DT.STRING, allowNull: false },
      color_range: { type: DT.STRING, allowNull: false },
      clarity_range: { type: DT.STRING, allowNull: false },
    },
    { timestamps: true, freezeTableName: true }
  );

  return DiamondDetails;
};
