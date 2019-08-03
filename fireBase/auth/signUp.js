import Crashes from 'mobile-center-crashes';

export const updateUser = async (user, email, password, name, mobileNo, gender) => {
    try {
      await user.updateEmail(email);
      await user.updatePassword(password);
      await user.updateProfile({ displayName: name });
    } catch (err) {
      console.log(err);
      Crashes.generateTestCrash()
    }
  };