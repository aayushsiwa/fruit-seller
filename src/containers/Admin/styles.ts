import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

const useStyles = makeStyles((theme: Theme) => ({
    headerBox: {
        marginBottom: theme.spacing(4),
    },
    title: {
        fontWeight: 600,
    },
    subtitle: {
        color: theme.palette.text.secondary,
    },
    error: {
        marginTop: theme.spacing(2),
    },
    tabsBox: {
        marginBottom: theme.spacing(3),
    },
    tabs: {
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
}));

export default useStyles;
