module.exports = (Seq, DT) => {
  const Layouts = Seq.define(
    "layouts",
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
      layout_type: {
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
      price: {
        type: DT.FLOAT,
        allowNull: false,
      },
    },
    { timestamps: true, freezeTableName: true }
  );

  return Layouts;
};
