import Header from "./component/layout/header/Header.js";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useEffect, useState } from "react";
import WebFont from "webfontloader";
import React from "react";
import Footer from "./component/layout/footer/Footer.js";
import Home from "./component/Home/Home.js";
import ProductDetails from "./component/Product/ProductDetails.js";
import Product from "./component/Product/Product.js";
import Search from "./component/Product/Search.js";
import LoginSigup from "./component/user/Loginsignup.js";
import store from "./Store";
import { loaduser } from "./actions/Useraction.js";
import Useroptions from "./component/layout/header/Useroptions.js";
import { useSelector } from "react-redux";
import Profile from "./component/user/Profile.js";
import Protectedroute from "./component/route/Protectedroute.jsx";
import UpdateProfile from "./component/user/UpdateProfile.js";
import UpdatePassword from "./component/user/UpdatePassword.js";
import ForgotPassword from "./component/user/ForgotPassword.js";
import ResertPassword from "./component/user/ResertPassword.js";
import Cart from "./component/Cart/Cart.js";
import Shipping from "./component/Cart/Shipping.js";
import ConfirmOrder from "./component/Cart/ConfirmOrder.js";
import axios from "axios";
import Payment from "./component/Cart/Payment.js";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import OrderSuccess from "./component/Cart/OrderSuccess.js";
import MyOrders from "./component/Order/MyOrders.js";
import Ordersdetails from "./component/Order/Ordersdetails.js";
import Dashboard from "./component/admin/Dashboard.js";
import ProductList from "./component/admin/ProductList.js";
import Newproduct from "./component/admin/Newproduct.jsx";
import UpdateProduct from "./component/admin/UpdateProduct.js";
import OrderList from "./component/admin/OrderList.js";
import ProcessOrder from "./component/admin/ProcessOrder.js";
import UserList from "./component/admin/UserList.js";
import UpdateUser from "./component/admin/UpdateUser.js";
import ProductReviews from "./component/admin/ProductReviews.js";
import Contact from "./component/layout/Contact/Contact.js";
import About from "./component/layout/About/About.js";
import NotFound from "./component/layout/Not Found/NotFound.js";
function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1/stripeapikey");
    setStripeApiKey(data.stripeApiKey);
  }
  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });
    store.dispatch(loaduser());

    getStripeApiKey();
  }, []);
  window.addEventListener("contextmenu",(e)=>{
    e.preventDefault();
  })
  return (
    <Router>
      <Header />
      {isAuthenticated && <Useroptions user={user} />}

      {stripeApiKey && (
        <Elements stripe={loadStripe(stripeApiKey)}>
          <Protectedroute exact path="/process/payment" component={Payment} />
        </Elements>
      )}
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/product/:id" component={ProductDetails} />
        <Route exact path="/products" component={Product} />
        <Route path="/products/:keyword" component={Product} />
        <Route exact path="/search" component={Search} />

        <Route exact path="/contact" component={Contact} />

        <Route exact path="/about" component={About} />
        <Protectedroute exact path="/account" component={Profile} />
        <Protectedroute exact path="/me/update" component={UpdateProfile} />
        <Protectedroute
          exact
          path="/password/update"
          component={UpdatePassword}
        />
        <Route exact path="/password/forgot" component={ForgotPassword} />
        <Route exact path="/password/reset/:token" component={ResertPassword} />
        <Route exact path="/login" component={LoginSigup} />
        <Route exact path="/cart" component={Cart} />
        <Protectedroute exact path="/shipping" component={Shipping} />

        <Protectedroute exact path="/success" component={OrderSuccess} />
        <Protectedroute exact path="/orders" component={MyOrders} />
        <Protectedroute exact path="/order/confirm" component={ConfirmOrder} />

        <Protectedroute exact path="/order/:id" component={Ordersdetails} />

        <Protectedroute
          isadmin={true}
          exact
          path="/admin/dashboard"
          component={Dashboard}
        />

        <Protectedroute
          exact
          path="/admin/products"
          isadmin={true}
          component={ProductList}
        />

        <Protectedroute
          exact
          path="/admin/product"
          isadmin={true}
          component={Newproduct}
        />

        <Protectedroute
          exact
          path="/admin/product/:id"
          isadmin={true}
          component={UpdateProduct}
        />

        <Protectedroute
          exact
          path="/admin/orders"
          isadmin={true}
          component={OrderList}
        />

        <Protectedroute
          exact
          path="/admin/order/:id"
          isadmin={true}
          component={ProcessOrder}
        />

        <Protectedroute
          exact
          path="/admin/users"
          isadmin={true}
          component={UserList}
        />

        <Protectedroute
          exact
          path="/admin/user/:id"
          isadmin={true}
          component={UpdateUser}
        />

        <Protectedroute
          exact
          path="/admin/reviews"
          isadmin={true}
          component={ProductReviews}
        />

        <Route
          component={
            window.location.pathname === "/process/payment" ? null : NotFound
          }
        />
      </Switch>
      <Footer />
    </Router>
  );
}

export default App;
