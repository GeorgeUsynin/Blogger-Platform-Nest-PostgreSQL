export const bodyConstraints = {
  minLength: 10,
  maxLength: 500,
};

export const bodyCheckConstraints = `
    length(body) BETWEEN ${bodyConstraints.minLength} AND ${bodyConstraints.maxLength}
`;
