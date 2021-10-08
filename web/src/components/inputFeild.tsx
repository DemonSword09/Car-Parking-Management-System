import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useField } from "formik";
import React, { HtmlHTMLAttributes } from "react";
import { InputHTMLAttributes } from "react";
type inputFeildprops = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
};
const InputFeild: React.FC<inputFeildprops> = ({
  label,
  size: _,
  ...props
}) => {
  const [field, { error }] = useField(props);
  return (
    <FormControl mt={4} isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <Input {...field} {...props} id={field.name} placeholder={field.name} />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};
export default InputFeild;
