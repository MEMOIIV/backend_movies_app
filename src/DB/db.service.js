export const findOne = async ({
  model,
  filter = {},
  select = "",
  populate = [],
} = {}) => {
  return await model.findOne(filter).select(select).populate(populate).lean();
};

export const find = async ({
  model,
  filter = {},
  select = "",
  populate = [],
} = {}) => {
  return await model.find(filter).select(select).populate(populate).lean();
};

export const findById = async ({
  model,
  id,
  select = "",
  populate = [],
} = {}) => {
  return await model.findById(id).select(select).populate(populate).lean();
};

export const create = async ({
  model,
  field = [{}],
  options = { validateBeforeSave: true },
} = {}) => {
  return await model.create(field, options);
};

export const findByIdAndUpdate = async ({
  model,
  id = "",
  update = {},
  option = {new: true , runValidator : true},
} = {}) => {
  return await model.findByIdAndUpdate(id, update, option);
};

export const updateOne = async ({
  model,
  filter = {},
  data = {},
  option = {runValidator : true},
} = {}) => {
  return await model.updateOne(filter, data, option);
};

export const findOneAndUpdate = async ({
  model,
  filter = {},
  data = {},
  option = {  new: true , runValidator : true},
  select = "",
  populate = [],
} = {}) => {
  return await model.findOneAndUpdate(filter, data, option).select(select).populate(populate);
};
export const findByIdAndDelete = async ({
  model,
  filter = {},
} = {}) => {
  return await model.findByIdAndDelete(filter)
};
export const deleteOne = async ({
  model,
  filter = {},
} = {}) => {
  return await model.deleteOne(filter)
};

