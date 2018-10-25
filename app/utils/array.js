'use strict';

exports.listOpen = function(list, key) {
  const nList = [];
  list.forEach(item => {
    const cList = item[key];
    const { name } = item;
    cList.forEach(child => {
      const item = {
        name,
      };
      item[key] = child;
      nList.push(item);
    });
  });
  return nList;
};
