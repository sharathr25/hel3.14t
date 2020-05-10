import { useState } from "react";

const useForm = (validations) => {
    const [values, setValues] = useState({})
    const [errors, setErrors] = useState({})

    const validateField = (name) => {
        const value = values[name] || '';
        const { constraints } = validations[name];
        if(!constraints) return '';
        return constraints.reduce((acc, cur) => {
            const { fun, message } = cur;
            return acc ? acc : fun(value) ? "" : message;
        }, "")
    }

    const bindField = (name) => {
        return {
            onChangeText: (value) => {
                setValues({ ...values, [name]: value })
            },
            onBlur: () => {
                setErrors({ ...errors, [name]: validateField(name) })
            },
        };
    }

    const isValid = () =>  {
        const hasErrors = Object.keys(validations).some(name => Boolean(validateField(name)))
        
        return !hasErrors;
    }

    return { values, errors, bindField, isValid } 
}

export default useForm;