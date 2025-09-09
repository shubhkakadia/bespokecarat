module.exports = (Seq, DT) => {
  const Medias = Seq.define(
    "medias",
    {
      filelink: {
        type: DT.STRING,
        allowNull: false,
        get() {
          const rawValue = this.getDataValue("filelink");
          return rawValue
            ? `${process.env.NEXT_PUBLIC_BASE_URL}${rawValue}`
            : null;
        },
      },
      file_type: { type: DT.STRING, allowNull: false },
      product_slug: { type: DT.STRING, allowNull: false },
    },
    { timestamps: true, freezeTableName: true }
  );

  return Medias;
};
