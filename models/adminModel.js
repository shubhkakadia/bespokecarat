module.exports = (Seq, DT) => {
  const Admin = Seq.define(
    "admin",
    {
      first_name: {
        type: DT.STRING,
        allowNull: false,
      },
      last_name: {
        type: DT.STRING,
        allowNull: false,
      },
      email: {
        type: DT.STRING,
        allowNull: false,
      },
      password: {
        type: DT.STRING,
        allowNull: false,
      },
      user_type: {
        type: DT.ENUM("master-admin", "admin"),
        allowNull: false,
        defaultValue: "admin",
      },
      unique_id: {
        type: DT.STRING,
        allowNull: false,
        unique: true,
      },
    },
    { timestamps: true, freezeTableName: true }
  );

  return Admin;
};
