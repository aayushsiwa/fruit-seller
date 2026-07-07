import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme: Theme) => ({
  headerBox: {
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(2),
  },
  orderCard: {
    padding: theme.spacing(2.5),
    marginBottom: theme.spacing(2),
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    transition: 'box-shadow 0.2s, transform 0.2s',
    '&:hover': {
      boxShadow: theme.shadows[4],
      transform: 'translateY(-2px)',
    },
  },
  statusBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(1.5),
  },
  orderId: {
    fontWeight: 600,
    fontSize: '0.95rem',
    letterSpacing: '0.02em',
  },
  statusBadge: {
    fontWeight: 600,
    fontSize: '0.7rem',
    borderRadius: 8,
  },
  orderMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emptyBox: {
    textAlign: 'center',
    padding: theme.spacing(8, 2),
  },
}));

export default useStyles;
