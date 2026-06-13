export const contentConstraints = {
  minLength: 20,
  maxLength: 300,
};

export const contentCheckConstraints = `
    length(content) BETWEEN ${contentConstraints.minLength} AND ${contentConstraints.maxLength}
`;
