
export const regex = {
    email : /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    phoneNo:  /^\d{10}$/
}
  
export const loginUserNameConstraints = [
    { fun: (value) => value.length !== 0, message: "username cannot be empty" },
    { fun: (value) => regex.email.test(value) || regex.phoneNo.test(value), message: "username invalid" }
]
  
export const passwordConstraints = [
    { fun: (value) => value.length !== 0, message: "password cannot be empty" },
    { fun: (value) => value.length > 5, message: "password should be more than 5 characters" }
]