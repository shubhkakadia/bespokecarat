module.exports = (Seq, DT) => {
  const Cuts = Seq.define(
    "cuts",
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
      cut_type: {
        type: DT.STRING,
        allowNull: true,
      },
      color_range: {
        type: DT.STRING,
        allowNull: true,
      },
      clarity_range: {
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

  return Cuts;
};
