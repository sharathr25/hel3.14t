// @flow
export const updateUser = async (user: Object, email: string, password: string, name: string) => {
    try {
      await user.updateEmail(email);
      await user.updatePassword(password);
      await user.updateProfile({ displayName: name });
    } catch (err) {
      console.log(err);
    }
  };