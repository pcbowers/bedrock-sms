export const pluralizer = (func) => {
  return async (elements) => {
    return await Promise.all(elements.map(async (element) => {
      return await func(element)
    }));
  }
}

export const subset = (architecture = {}, object) => {
  return Object.keys(architecture).reduce((acc, cur, idx) => {
    return {
      ...acc,
      [architecture[cur]]: object[cur] === undefined ? null : object[cur]
    }
  }, {})
}