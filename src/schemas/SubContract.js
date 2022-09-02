import * as yup from "yup";

export const SubContractSchema = yup.object().shape({
  product_title: yup.string().required("Required"),
  packing_list_id: yup.string().required("Required"),
  number_of_bundles: yup
    .number("Required")
    .integer("Required")
    .transform((value) => (isNaN(value) ? undefined : value))
    .min(1, "Required")
    .required("Required")
    .nullable("Required"),
  purity: yup.string().required("Required"),
  weight: yup
    .number("Required")
    .integer("Required")
    .transform((value) => (isNaN(value) ? undefined : value))
    .min(1, "Required")
    .required("Required"),
});
