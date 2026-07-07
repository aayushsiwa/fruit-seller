import { makeStyles } from '@mui/styles';

export const useCheckoutStyles = makeStyles({
  root: {
    paddingTop: 32,
    paddingBottom: 32,
  },
  title: {
    fontWeight: 600,
    marginBottom: 32,
  },
  loadingBox: {
    textAlign: 'center',
    paddingTop: 64,
    paddingBottom: 64,
  },
  errorText: {
    color: '#f44336',
  },
  summaryBox: {
    maxWidth: 600,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});
