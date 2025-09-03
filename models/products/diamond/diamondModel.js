module.exports = (Seq, DT) => {
  const Diamonds = Seq.define(
    "diamonds",
    {
      name: {
        type: DT.STRING,
        allowNull: false,
      },
      slug: { type: DT.STRING, allowNull: false, unique: true },
      shape: {
        type: DT.STRING,
        allowNull: false,
      },
      sku: {
        type: DT.STRING,
        allowNull: false,
      },
      certification: {
        type: DT.STRING,
        allowNull: true,
      },
      description: {
        type: DT.TEXT,
        allowNull: true,
      },

      is_available: {
        type: DT.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
    },
    { timestamps: true, freezeTableName: true }
  );

  return Diamonds;
};
