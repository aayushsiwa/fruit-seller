import { makeStyles } from "@mui/styles";

export const useSuccessStyles = makeStyles({
  container: {
    textAlign: "center",
    marginTop: 64,
  },
  checkIcon: {
    marginBottom: 16,
  },
  successMessageTitle: { fontWeight: 700, color: "primary.main" },
  successMessage: {
    mx: "auto",
    mb: 4,
    display: "flex",
    justifyContent: "center",
  },
  continueButton: {
    mt: 4,
    py: 1.5,
    fontWeight: 600,
    borderRadius: 2,
    textTransform: "none",
  },
});
