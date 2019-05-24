export const updateUser = async (user, email, password, name) => {
  await user.updateEmail(email);
  await user.updatePassword(password);
  await user.updateProfile({ displayName: name });
};

export const fun = () => 0;
