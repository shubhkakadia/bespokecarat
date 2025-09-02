module.exports = (Seq, DT) => {
  const Alphabets = Seq.define(
    "alphabets",
    {
      name: {
        type: DT.STRING,
        allowNull: false,
      },
      slug: { type: DT.STRING, allowNull: false, unique: true },
      sku: {
        type: DT.STRING,
        allowNull: false,
      },
      character: {
        type: DT.STRING,
        allowNull: false,
      },
      color_range: {
        type: DT.STRING,
        allowNull: false,
      },
      clarity_range: {
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

  return Alphabets;
};
