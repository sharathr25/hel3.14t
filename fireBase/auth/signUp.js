export const updateUser = async (user, email, password, name) => {
    try {
      await user.updateEmail(email);
      await user.updatePassword(password);
      await user.updateProfile({ displayName: name });
    } catch (err) {
      console.log(err);
      Alert.alert(err.toString());
    }
  };