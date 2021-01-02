import buildClient from '../api/build-client';

const LandingPage =  ({currentUser}) => {
    return  currentUser ? <h1> You are logged in</h1> : <h1>Sign in</h1>;
}

LandingPage.getInitialProps = async(context) => {
    console.log('LANDING PAGE');
    const {data} = await buildClient(context).get('/api/users/currentuser');
    return data;
}
export default LandingPage;