import { Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme:Theme) => ({
  headerBox: {
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(2),
  },
  flexContainer: {
    display: "flex",
    flexDirection: "row",
    gap: theme.spacing(4),
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
    },
  },
  cartBox: {
    width: "65%",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  },
  summaryBox: {
    width: "30%",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  },
  buttonsWrapper: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: theme.spacing(3),
    flexWrap: "wrap",
    gap: theme.spacing(2),
  },
}));


export default useStyles;