import { makeStyles } from '@mui/styles';

export const useRegisterStyles = makeStyles({
  container: {
    marginTop: 32,
    marginBottom: 32,
  },
  box: {
    my: 4,
  },
  paper: {
    padding: 32,
    borderRadius: 16,
  },
  welcomeBox: {
    textAlign: 'center',
    marginBottom: 32,
  },
  title: {
    fontWeight: 700,
  },
  signInBox: {
    marginTop: 24,
    textAlign: 'center',
  },
  signInLink: {
    fontWeight: 600,
  },
  divider: {
    marginTop: 24,
    marginBottom: 24,
  },
  googleButtonBox: {
    display: 'flex',
    justifyContent: 'center',
    gap: 16,
  },
  googleButton: {
    flex: 1,
  },
});
