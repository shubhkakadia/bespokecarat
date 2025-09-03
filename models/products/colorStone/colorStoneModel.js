module.exports = (Seq, DT) => {
  const ColorStones = Seq.define(
    "color_stones",
    {
      name: {
        type: DT.STRING,
        allowNull: false,
      },
      slug: { type: DT.STRING, allowNull: false, unique: true },
      color: { type: DT.STRING, allowNull: false, unique: true },
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
        allowNull: false,
      },
    },
    { timestamps: true, freezeTableName: true }
  );

  return ColorStones;
};
