module.exports = (Seq, DT) => {
  const Sessions = Seq.define(
    "sessions",
    {
      userId: { type: DT.INTEGER, allowNull: false },
      token: { type: DT.STRING, allowNull: false },
      user_type: {
        type: DT.ENUM("master-admin", "admin", "client"),
        allowNull: false,
      },
    },
    { timestamps: true, freezeTableName: true }
  );

  return Sessions;
};
