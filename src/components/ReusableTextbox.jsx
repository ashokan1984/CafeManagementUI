import TextField from "@mui/material/TextField";

const ReusableTextbox = ({ label, error, ...props }) => (
  <TextField label={label} error={!!error} helperText={error} {...props} fullWidth />
);

export default ReusableTextbox;
