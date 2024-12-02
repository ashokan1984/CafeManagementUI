import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object({
  name: yup.string().min(6).max(10).required(),
  description: yup.string().max(256).required(),
  logo: yup.mixed().test("fileSize", "File too large", (file) => !file || file.size <= 2 * 1024 * 1024),
  location: yup.string().required(),
});

const CafeForm = ({ onSubmit, defaultValues }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ReusableTextbox label="Name" {...register("name")} error={errors.name?.message} />
      <ReusableTextbox label="Description" {...register("description")} error={errors.description?.message} />
      <input type="file" {...register("logo")} />
      <ReusableTextbox label="Location" {...register("location")} error={errors.location?.message} />
      <button type="submit">Submit</button>
      <button type="button">Cancel</button>
    </form>
  );
};

export default CafeForm;
