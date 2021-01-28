import 'bootstrap/dist/css/bootstrap.css'
// Not pdatesr
// This default export is required in a new `pages/_app.js` file.
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) =>  {
    return (
      <div>
        <Header currentUser = {currentUser} />
        <div className = "container">
        <Component {...pageProps} />
        </div>
        
      </div>
    )
    
  }

AppComponent.getInitialProps = async appContext => {
  console.log('THIS IS APP CONTEXT');
   const client = buildClient(appContext.ctx);
   const {data} = await client.get('/api/users/currentuser');

   let pageProps = {};
   // If appcontext have component props with getInitialProps
   if(appContext.Component.getInitialProps) {
     // update pageProps with 
     pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser);

   }
   return {
     pageProps,
     ...data
   }
}

export default AppComponent;