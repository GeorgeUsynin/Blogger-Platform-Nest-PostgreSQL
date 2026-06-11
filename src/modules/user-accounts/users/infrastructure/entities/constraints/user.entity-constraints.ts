export const loginConstraints = {
  minLength: 3,
  maxLength: 10,
  loginPostgresRegex: '^[A-Za-z0-9_-]*$',
};

export const passwordConstraints = {
  minLength: 6,
  maxLength: 20,
};

export const emailConstraints = {
  maxLength: 100,
  emailPostgresRegex: '^[A-Za-z0-9_.-]+@([A-Za-z0-9-]+[.])+[A-Za-z0-9-]{2,4}$',
};

export const loginCheckConstraints = `
    length(login) BETWEEN ${loginConstraints.minLength} AND ${loginConstraints.maxLength}
    AND login ~ '${loginConstraints.loginPostgresRegex}'
`;

export const emailCheckConstraints = `
    length(email) <= ${emailConstraints.maxLength}
    AND email ~ '${emailConstraints.emailPostgresRegex}'
`;
