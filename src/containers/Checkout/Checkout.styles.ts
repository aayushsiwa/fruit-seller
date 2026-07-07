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
    width: '100%',
  },
  addressPaper: {
    padding: 24,
    borderRadius: 8,
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: 600,
    marginBottom: 16,
  },
  formRow: {
    display: 'flex',
    gap: 16,
    marginBottom: 16,
  },
});
