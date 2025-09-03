module.exports = (Seq, DT) => {
  const AlphabetVariants = Seq.define(
    "alphabet_variants",
    {
      alphabetId: { type: DT.INTEGER, allowNull: false },
      carat_weight: { type: DT.FLOAT, allowNull: false },
      price: { type: DT.FLOAT, allowNull: false },
    },
    { timestamps: true, freezeTableName: true }
  );

  return AlphabetVariants;
};
