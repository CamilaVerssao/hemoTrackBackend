const dbo = require("../dbo/base");
const validation = require("../model/user");
const { messages } = require("joi-translation-pt-br");
const tableName = "user";

const get = async (object) => {
  const { limit, page, order, direction, ...filterParams } = object;

  const fields = [`${tableName}.*`];

  const filterMap = {
    id: "=",
    name: "like",
    email: "like",
    status: "like",
    createdAt: "=",
  };

  const filters = Object.entries(filterParams).reduce((acc, [key, value]) => {
    if (filterMap[key]) {
      acc.push({ column: key, operator: filterMap[key], value });
    }
    return acc;
  }, []);

  return await dbo.get(
    tableName,
    filters,
    limit,
    page,
    order,
    direction,
    fields
  );
};

const insert = async (object) => {
  try {
    await validation.object.validateAsync(object, {
      abortEarly: false,
      messages: messages,
    });
  } catch (error) {
    if (error.details) {
      const errors = error.details.map((el) => el.message);
      return { errors };
    } else {
      return { errors: [error.message] };
    }
  }

  return await dbo.insert(object, tableName, ["email"]);
};

const update = async (object, id) => {
  if (!id) {
    return false;
  }

  return await dbo.update(object, id, tableName);
};

const remove = async (id) => {
  if (!id) {
    return false;
  }
  return await dbo.remove(id, tableName);
};

module.exports = {
  get,
  insert,
  update,
  remove,
};
