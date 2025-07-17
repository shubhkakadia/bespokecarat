module.exports = (Seq, DT) => {
  const Customers = Seq.define("customers", {
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
    phone_number: {
      type: DT.STRING,
      allowNull: true,
    },
    company_name: {
      type: DT.STRING,
      allowNull: true,
    },
    password: {
      type: DT.STRING,
      allowNull: false,
    },
    user_type: {
      type: DT.ENUM("customer"),
      allowNull: false,
      defaultValue: "customer",
    },
    unique_id: {
      type: DT.STRING,
      allowNull: false,
      unique: true,
    },
    accepted_terms: {
      type: DT.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    newsletter: {
      type: DT.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  });

  return Customers;
};
