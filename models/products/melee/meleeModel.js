module.exports = (Seq, DT) => {
  const Melees = Seq.define(
    "melees",
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

      description: {
        type: DT.TEXT,
        allowNull: true,
      },

      is_available: {
        type: DT.BOOLEAN,
        allowNull: false,
      },
    },
    { timestamps: true, freezeTableName: true }
  );

  return Melees;
};
