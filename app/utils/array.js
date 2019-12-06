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

exports.arraySum = function arraySum(arr) {
  return arr.reduce((prev, curr, idx, arr) => {
    return prev + curr;
  });
};

exports.arrayAvg = function arrayAvg(arr) {
  const sum = arr.reduce((prev, curr, idx, arr) => {
    return prev + curr;
  });
  return sum / arr.length;
};
