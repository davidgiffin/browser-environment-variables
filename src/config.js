const blah = () => {
  console.log('logging in config window.process', window.process)
  console.log('logging in config process.env', process.env)
  return {
    API:
      process.env.REACT_APP_BACKEND_BASE_URL
  };
};
export default blah();
