require('dotenv').config()
const blah = () => {
  console.log("are we loading .env?", process.env.REACT_APP_TEST)
  console.log('logging in config window.process', window.process)
  console.log('logging in config process.env', process.env)
  return {
    API:
      process.env.REACT_APP_BACKEND_BASE_URL2
  };
};
export default blah();
