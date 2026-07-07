import { makeStyles } from '@mui/styles';

export const useLoginStyles = makeStyles({
  container: {
    marginTop: 32,
    marginBottom: 32,
  },
  paper: {
    padding: 32,
    borderRadius: 16,
  },
  title: {
    fontWeight: 700,
  },
  signUpBox: {
    marginTop: 24,
    textAlign: 'center',
  },
  signUpLink: {
    fontWeight: 600,
  },
  divider: {
    marginTop: 24,
    marginBottom: 24,
  },
  googleButtonBox: {
    display: 'flex',
    justifyContent: 'center',
  },
  forgotPasswordBox: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  welcomeBox: {
    textAlign: 'center',
    marginBottom: 32,
  },
  loadingBox: { my: 4, textAlign: 'center' },
});
