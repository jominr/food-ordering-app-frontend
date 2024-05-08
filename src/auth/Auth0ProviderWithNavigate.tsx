import { AppState, Auth0Provider } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

type Props = {
  children: React.ReactNode
};
// 使用SDK连接auth0 account. 
const Auth0ProviderWithNavigate = ({ children } : Props) => {
  const navigate = useNavigate();
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_AUTH0_CALLBACK_URL;
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

  if (!domain || !clientId || !redirectUri || !audience) {
    throw new Error("unable to initialise auth");
  }
  // 我们为什么构造了一个页面来create user，而不是在这个页面里呢？
  /*
    我们使用useAuth0()来拿到 getAccessTokenSilently, 
    useAuth hook只工作在provider的内部，
    从路由中可以看出，auth的provider是包裹在路由外边的。
    所以，所有的页面可以使用userAuth0(), 还有请求api的方法。
    而我们这个位置，是outside of the provider, 不是child
  */
  const onRedirectCallback = (appState? : AppState)=>{
    // onRedirectCallback能获取到两个参数，分别是appState, user
    // (appState?: AppState, user?: User)
    navigate(appState?.returnTo || "/auth-callback");
  };
  // Add the AuthProvider that comes from the auth0 SDK
  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        audience,
      }}
      // 定义一个方法：当用户重定向回我们的应用时的方法
      onRedirectCallback={onRedirectCallback}
    >
      { children }
    </Auth0Provider>
  );
};

export default Auth0ProviderWithNavigate;