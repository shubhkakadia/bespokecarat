module.exports = (Seq, DT) => {
  const SieveSizes = Seq.define(
    "sieve_sizes",
    {
      meleeId: { type: DT.INTEGER, allowNull: false },
      size: { type: DT.STRING, allowNull: false },
      color_range: { type: DT.STRING, allowNull: false },
      clarity_range: { type: DT.STRING, allowNull: false },
      price_per_carat: { type: DT.STRING, allowNull: false },
    },
    { timestamps: true, freezeTableName: true }
  );

  return SieveSizes;
};
