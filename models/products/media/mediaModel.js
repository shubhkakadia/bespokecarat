module.exports = (Seq, DT) => {
  const Medias = Seq.define(
    "medias",
    {
      filelink: { type: DT.STRING, allowNull: false },
      file_type: { type: DT.STRING, allowNull: false },
      product_slug: { type: DT.STRING, allowNull: false },
    },
    { timestamps: true, freezeTableName: true }
  );

  return Medias;
};
